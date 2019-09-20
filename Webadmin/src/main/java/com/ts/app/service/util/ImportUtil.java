package com.ts.app.service.util;

import com.ts.app.domain.*;
import com.ts.app.domain.util.LogImportType;
import com.ts.app.repository.*;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.*;
import com.ts.app.web.rest.dto.*;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.ss.format.CellFormatType;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.io.*;
import java.nio.file.FileSystem;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;


@Component
@Transactional
public class ImportUtil {

	private static final Logger log = LoggerFactory.getLogger(ImportUtil.class);

	public static final String COMPLETED = "COMPLETED";
	public static final String FAILED = "FAILED";
	public static final String SUCCESS_MESSAGE = "SUCCESS";
	private static final String NEW_IMPORT_FOLDER = "import.file.path.new";
	private static final String JOB_FOLDER = "job";
	private static final String EMPLOYEE_FOLDER = "employee";
	private static final String ASSET_FOLDER = "asset";
	private static final String CHECKLIST_FOLDER = "checklist";
	private static final String EMP_SHIFT_FOLDER = "empshift";
	private static final String CLIENT_FOLDER = "client";
	private static final String SITE_FOLDER = "site";
	private static final String LOCATION_FOLDER = "location";
    private static final String INVENTORY_FOLDER = "inventory";
    private static final String EMPLOYEE_ONBOARDING_FOLDER = "employeeOnboarding";
    private static final String COMPLETED_IMPORT_FOLDER = "import.file.path.completed";
	private static final String SEPARATOR = System.getProperty("file.separator");

	private static final Map<String,ImportResult> statusMap = new ConcurrentHashMap<String,ImportResult>();

	@Autowired
	private JobManagementService jobService;

	@Autowired
	private UserService userService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private LocationRepository locationRepo;

	@Autowired
	private EmployeeRepository employeeRepo;

    @Autowired
    private TicketRepository ticketRepository;

	@Autowired
	private ProjectRepository projectRepo;

	@Autowired
	private SiteRepository siteRepo;

	@Autowired
	private FileUploadHelper fileUploadHelper;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private SiteLocationService siteLocationService;

	@Inject
    private SiteService siteService;

	@Inject
	private ChecklistService checklistService;

	@Inject
	private Environment env;

	@Inject
	private EmployeeShiftRepository empShiftRepo;

	@Inject
	private AssetManagementService assetManagementService;

	@Inject
    private InventoryManagementService inventoryManagementService;

	@Inject
    private AssetRepository assetRepository;

	@Inject
	private ImportLogRepository importLogRepository;
	
	@Inject
	private PositionsRepository positionsRepository;

    @Value("${onBoarding.dummyUser}")
    private String dummyUser;

	public ImportResult importJobData(MultipartFile file, long dateTime)  {
        String fileName = dateTime + ".xlsx";
		String filePath = env.getProperty(NEW_IMPORT_FOLDER) + SEPARATOR +  JOB_FOLDER;
		String uploadedFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
		String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER) + SEPARATOR +  JOB_FOLDER;
		String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
		ImportResult result = new ImportResult();
		if(statusMap.containsKey(fileKey)) {
			ImportResult importResult = statusMap.get(fileKey);
			String status = importResult.getStatus();
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			result.setFile(fileKey);
			result.setStatus("PROCESSING");
			statusMap.put(fileKey, result);
		}
		String response = null;
		try {
			response = importNewFiles("job",filePath, fileName, targetFilePath);
		}catch (Exception e ) {
			log.error("Error while importing job data", e);
			result.setStatus("FAILED");
			result.setMsg(e.getMessage());
		}
		//result.setMsg(response);
		return result;
	}

	public ImportResult importClientData(MultipartFile file, long dateTime) {
        String fileName = dateTime + ".xlsx";
		String filePath = env.getProperty(NEW_IMPORT_FOLDER) + SEPARATOR +  CLIENT_FOLDER;
		String uploadedFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
		String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER) + SEPARATOR +  CLIENT_FOLDER;
		String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
		ImportResult result = new ImportResult();
		if(statusMap.containsKey(fileKey)) {
			ImportResult importResult = statusMap.get(fileKey);
			String status = importResult.getStatus();
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			result.setFile(fileKey);
			result.setStatus("PROCESSING");
			statusMap.put(fileKey, result);
		}
		try {
			importNewFiles("client",filePath, fileName, targetFilePath);
			result.setFile(fileKey);
			//result.setStatus(getImportStatus(fileKey));
		}catch (Exception e) {
			log.error("Error while importing client data",e);
			result.setStatus("FAILED");
			result.setMsg(e.getMessage());
		}
		return result;
	}

	public ImportResult importSiteData(MultipartFile file, long dateTime) {
        String fileName = dateTime + ".xlsx";
		String filePath = env.getProperty(NEW_IMPORT_FOLDER) + SEPARATOR +  SITE_FOLDER;
		String uploadedFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
		String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER) + SEPARATOR +  SITE_FOLDER;
		String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
		ImportResult result = new ImportResult();
		if(statusMap.containsKey(fileKey)) {
			ImportResult importResult = statusMap.get(fileKey);
			String status = importResult.getStatus();
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			result.setFile(fileKey);
			result.setStatus("PROCESSING");
			statusMap.put(fileKey, result);
		}
		try {
			importNewFiles("site",filePath, fileName, targetFilePath);
			result.setFile(fileKey);
		}catch (Exception e) {
			log.error("Error while importing site data",e);
			result.setStatus("FAILED");
			result.setMsg(e.getMessage());
		}
		return result;
	}

	public ImportResult changeEmployeeSite(MultipartFile file, long dateTime) {
	    String fileName = "changeEmployee"+dateTime + ".xlsx";
	    String filePath = env.getProperty(NEW_IMPORT_FOLDER)+SEPARATOR+SITE_FOLDER;
	    String uploadFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
	    String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER)+SEPARATOR+SITE_FOLDER;
	    String fileKey = fileName.substring(0,fileName.indexOf(".xlsx"));

	    ImportResult result = new ImportResult();
		if(statusMap.containsKey(fileKey)) {
			ImportResult importResult = statusMap.get(fileKey);
			String status = importResult.getStatus();
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			result.setFile(fileKey);
			result.setStatus("PROCESSING");
			statusMap.put(fileKey, result);
		}
		try {
			importNewFiles("siteEmployeeChange",filePath,fileName,targetFilePath);
		}catch (Exception e) {
			log.error("Error while importing employee site change data",e);
		}
	    result.setFile(fileKey);
	    result.setStatus("PROCESSING");
	    return result;

    }

	public ImportResult importLocationData(MultipartFile file, long dateTime) {
        String fileName = dateTime + ".xlsx";
		String filePath = env.getProperty(NEW_IMPORT_FOLDER) + SEPARATOR +  LOCATION_FOLDER;
		String uploadedFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
		String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER) + SEPARATOR +  LOCATION_FOLDER;
		String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
		ImportResult result = new ImportResult();
		if(statusMap.containsKey(fileKey)) {
			ImportResult importResult = statusMap.get(fileKey);
			String status = importResult.getStatus();
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			result.setFile(fileKey);
			result.setStatus("PROCESSING");
			statusMap.put(fileKey, result);
		}
		try {
			importNewFiles("location",filePath, fileName, targetFilePath);
			result.setFile(fileKey);
		}catch (Exception e) {
			log.error("Error while importing location data",e);
			result.setStatus("FAILED");
			result.setMsg(e.getMessage());
		}
		return result;
	}

	public ImportResult importEmployeeData(MultipartFile file, long dateTime) {
        String fileName = dateTime + ".xlsx";
		String filePath = env.getProperty(NEW_IMPORT_FOLDER) + SEPARATOR +  EMPLOYEE_FOLDER;
		String uploadedFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
		String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER) + SEPARATOR +  EMPLOYEE_FOLDER;
		String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
		ImportResult result = new ImportResult();
		if(statusMap.containsKey(fileKey)) {
			ImportResult importResult = statusMap.get(fileKey);
			String status = importResult.getStatus();
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			result.setFile(fileKey);
			result.setStatus("PROCESSING");
			statusMap.put(fileKey, result);
		}
		try {
			importNewFiles("employee",filePath, fileName, targetFilePath);
			result.setFile(fileKey);
		}catch (Exception e) {
			log.error("Error while importing employee data",e);
			result.setStatus("FAILED");
			result.setMsg(e.getMessage());
			statusMap.put(fileKey, result);
		}
		return result;

	}
	
/**********************************Modified By Vinoth**************************************************************************/
	
	public ImportResult importEmployeeOnboardingData(MultipartFile file, long dateTime) {
        String fileName = dateTime + ".xlsx";
		String filePath = env.getProperty(NEW_IMPORT_FOLDER) + SEPARATOR +  EMPLOYEE_ONBOARDING_FOLDER;
		String uploadedFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
		String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER) + SEPARATOR +  EMPLOYEE_ONBOARDING_FOLDER;
		String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
		ImportResult result = new ImportResult();
		if(statusMap.containsKey(fileKey)) {
			ImportResult importResult = statusMap.get(fileKey);
			String status = importResult.getStatus();
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			result.setFile(fileKey);
			result.setStatus("PROCESSING");
			statusMap.put(fileKey, result);
		}
		try {
			importNewFiles("employeeOnboarding",filePath, fileName, targetFilePath);
			result.setFile(fileKey);
		}catch (Exception e) {
			log.error("Error while importing employee Onbording data",e);
			result.setStatus("FAILED");
			result.setMsg(e.getMessage());
			statusMap.put(fileKey, result);
		}
		return result;

	}
	
/******************************************************************************************************************************/

	public ImportResult importAssetData(MultipartFile file, long dateTime, boolean isPPM, boolean isAMC) {
        String fileName = dateTime + ".xlsx";
		String filePath = env.getProperty(NEW_IMPORT_FOLDER) + SEPARATOR +  ASSET_FOLDER;
		String uploadedFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
		String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER) + SEPARATOR +  ASSET_FOLDER;
		String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
		ImportResult result = new ImportResult();
		if(statusMap.containsKey(fileKey)) {
			ImportResult importResult = statusMap.get(fileKey);
			String status = importResult.getStatus();
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			result.setFile(fileKey);
			result.setStatus("PROCESSING");
			statusMap.put(fileKey, result);
		}
		try {
			if(isPPM) {
				importNewFiles("assetPPM",filePath, fileName, targetFilePath);
			}else if(isAMC) {
				importNewFiles("assetAMC",filePath, fileName, targetFilePath);
			}else {
				importNewFiles("asset",filePath, fileName, targetFilePath);
			}
			result.setFile(fileKey);
		}catch (Exception e) {
			log.error("Error while importing asset data",e);
			result.setStatus("FAILED");
			result.setMsg(e.getMessage());
		}
		return result;
	}


	public ImportResult importChecklistData(MultipartFile file, long dateTime) {
        String fileName = dateTime + ".xlsx";
		String filePath = env.getProperty(NEW_IMPORT_FOLDER) + SEPARATOR +  CHECKLIST_FOLDER;
		String uploadedFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
		String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER) + SEPARATOR +  CHECKLIST_FOLDER;
		String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
		ImportResult result = new ImportResult();
		if(statusMap.containsKey(fileKey)) {
			ImportResult importResult = statusMap.get(fileKey);
			String status = importResult.getStatus();
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			result.setFile(fileKey);
			result.setStatus("PROCESSING");
			statusMap.put(fileKey, result);
		}
		try {
			importNewFiles("checklist",filePath, fileName, targetFilePath);
			result.setFile(fileKey);
		}catch (Exception e) {
			log.error("Error while importing checklist data",e );
			result.setStatus("FAILED");
			result.setMsg(e.getMessage());
		}
		return result;

	}

	public ImportResult importEmployeeShiftData(MultipartFile file, long dateTime) {
        String fileName = dateTime + ".xlsx";
		String filePath = env.getProperty(NEW_IMPORT_FOLDER) + SEPARATOR +  EMP_SHIFT_FOLDER;
		String uploadedFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
		String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER) + SEPARATOR +  EMP_SHIFT_FOLDER;
		String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
		ImportResult result = new ImportResult();
		if(statusMap.containsKey(fileKey)) {
			ImportResult importResult = statusMap.get(fileKey);
			String status = importResult.getStatus();
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			result.setFile(fileKey);
			result.setStatus("PROCESSING");
			statusMap.put(fileKey, result);
		}
		try {
			importNewFiles("employeeshift",filePath, fileName, targetFilePath);
		}catch (Exception e) {
			log.error("Eror while importing employee shift data",e);
			result.setStatus("FAILED");
			result.setMsg(e.getMessage());
		}
		return result;

	}

	@Async
	private String importNewFiles(String domain, String sourceFilePath,String fileName, String targetFilePath) throws Exception {
		String response = null;
		// get new files in the imports folder
		//FilenameFilter filter = new ExcelFilenameFilter(".xlsx");
		//File[] files = new File(sourceFilePath).listFiles(filter);

		//for (File fileObj : files) {
		String fileKey = null;
		try {
			fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));

			File fileObj = new File(sourceFilePath + SEPARATOR +  fileName);
			if (fileObj.isFile()) {
				switch(domain) {
					case "job" :
						importJobFromFile(fileKey,fileObj.getPath());
						break;
					case "employee":
						importEmployeeFromFile(fileKey, fileObj.getPath());
						break;
					case "employeeOnboarding":
						importEmployeeOnboardingFromFile(fileKey, fileObj.getPath());
						break;
					case "client" :
						importClientFromFile(fileKey,fileObj.getPath());
						break;
					case "site" :
						importSiteFromFile(fileKey,fileObj.getPath());
						break;
					case "location" :
						importLocationFromFile(fileKey,fileObj.getPath());
						break;
					case "checklist" :
						importChecklistFromFile(fileKey,fileObj.getPath());
						break;
					case "employeeshift" :
						importEmployeeShiftMasterFromFile(fileKey, fileObj.getPath());
						break;
					case "asset" :
						importAssetFromFile(fileKey, fileObj.getPath());
						break;
					case "assetPPM" :
						importAssetPPMFromFile(fileKey,fileObj.getPath());
						break;
					case "assetAMC" :
						importAssetAMCFromFile(fileKey,fileObj.getPath());
						break;
	                case "siteEmployeeChange" :
	                    changeSiteEmployee(fileObj.getPath());
                    case "inventory" :
                        importInventoryMaster(fileObj.getPath());
                        break;
				}
				ImportResult importResult = null;
				if(statusMap.containsKey(fileKey)) {
					importResult = statusMap.get(fileKey);
				}else {
					importResult = new ImportResult();
				}
				importResult.setFile(fileKey);
				importResult.setMsg(SUCCESS_MESSAGE);
				importResult.setStatus(COMPLETED);
				statusMap.put(fileKey, importResult);
				FileSystem fileSystem = FileSystems.getDefault();
	            Path path = fileSystem.getPath(targetFilePath);
	            if (!Files.exists(path)) {
	                Path newEmpPath = Paths.get(targetFilePath);
	                try {
	                    Files.createDirectory(newEmpPath);
	                } catch (IOException e) {
	                    log.error("Error while creating path for attendance " + newEmpPath);
	                }
	            }
				fileObj.renameTo(new File(targetFilePath + SEPARATOR + fileName));
			}
		} catch (Exception ex) {
			String msg = "Error while importing from the file - " + fileName ;
			log.error(msg, ex);
			StringBuffer statusMsg = new StringBuffer();
			ImportResult importResult = null;
			if(statusMap.containsKey(fileKey)) {
				importResult = statusMap.get(fileKey);
			}else {
				importResult = new ImportResult();
			}

			statusMsg.append(ex.getMessage());
			statusMsg.append("--" + msg);
			statusMsg.append("--" + "Please correct the data format and retry again");
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(statusMsg.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(statusMsg.toString());
		}
		//}
		//result.setEmpId(empId);
		return response;
	}

	public String getImportStatus(String fileName) {
		ImportResult importResult = null;
		String status = "";
		log.debug("statusMap -" + statusMap);
		if(statusMap != null) {
			if(statusMap.containsKey(fileName)) {
				importResult = statusMap.get(fileName);
				if(importResult != null) {
					status = importResult.getStatus();
					if(StringUtils.isNotEmpty(status) &&
							(status.equalsIgnoreCase("COMPLETED") || status.equalsIgnoreCase("FAILED"))) {
						statusMap.remove(fileName);
					}
				}
			}
		}
		log.debug("status for fileName -" + fileName +" , status -" +status);
		return status;
	}

	public ImportResult getImportResult(String fileName) {
		ImportResult importResult = null;
		String status = "";
		log.debug("statusMap -" + statusMap);
		if(statusMap != null) {
			if(statusMap.containsKey(fileName)) {
				importResult = statusMap.get(fileName);
				if(importResult != null) {
					status = importResult.getStatus();
					if(StringUtils.isNotEmpty(status) &&
							(status.equalsIgnoreCase("COMPLETED") || status.equalsIgnoreCase("FAILED"))) {
						statusMap.remove(fileName);
					}
				}
			}
		}
		log.debug("status for fileName -" + fileName +" , status -" +status);
		return importResult;
	}

	public static class ExcelFilenameFilter implements FilenameFilter {

		private String ext;

		public ExcelFilenameFilter(String ext) {
			this.ext = ext.toLowerCase();
		}

		@Override
		public boolean accept(File dir, String name) {
			return name.toLowerCase().endsWith(ext);
		}

	}


	private String importJobFromFile(String fileKey, String path) throws Exception {
		int r = 0;
		int cellNo = 0;
		StringBuffer response = new StringBuffer();
		ImportResult importResult = statusMap.get(fileKey);
		try {
			log.debug("JobFromFile -" + path);
			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			Iterator<Row> iterator = datatypeSheet.iterator();
			int lastRow = datatypeSheet.getLastRowNum();
			Row projectRow = datatypeSheet.getRow(r);
			cellNo = 2;
			long projectId = (long) projectRow.getCell(2).getNumericCellValue();
			r++;
			Row siteRow = datatypeSheet.getRow(r);
			long siteId = 0;
			if(siteRow.getCell(2) != null) {
				siteId = (long) siteRow.getCell(2).getNumericCellValue();
			}
			r++;
			//Row managerRow = datatypeSheet.getRow(r);
			//String managerId = String.valueOf(managerRow.getCell(2).getNumericCellValue());
			//String supervisorId = String.valueOf(managerRow.getCell(5).getNumericCellValue());
			r = 4;
			for (; r <= lastRow; r++) {
				log.debug("Current Row number -" + r);
				cellNo = 0;
				try {
					Row currentRow = datatypeSheet.getRow(r);
					JobDTO jobDto = new JobDTO();
					if(siteId == 0) {
						if(currentRow.getCell(cellNo) != null) {
							siteId = (long) currentRow.getCell(cellNo).getNumericCellValue();
						}
						if(siteId == 0 && siteRow.getCell(2) != null) {
							siteId = (long) siteRow.getCell(2).getNumericCellValue();
						}
					}
					jobDto.setSiteId(siteId);
					cellNo++;
					jobDto.setTitle(currentRow.getCell(1).getStringCellValue());
					cellNo++;
					jobDto.setDescription(currentRow.getCell(2).getStringCellValue());
					cellNo = 4;
					String jobType = currentRow.getCell(4).getStringCellValue();
					String empId = null;
					cellNo = 6;
					if (currentRow.getCell(6).getCellType() == CellFormatType.NUMBER.ordinal()) {
						try {
							empId = String.valueOf((long)currentRow.getCell(6).getNumericCellValue());
						} catch (IllegalStateException ise) {
							empId = currentRow.getCell(6).getStringCellValue();
						}
					} else {
						try {
							empId = currentRow.getCell(6).getStringCellValue();
						} catch (IllegalStateException ise) {
							empId = String.valueOf((long)currentRow.getCell(6).getNumericCellValue());
						}

					}
					log.debug("Employee id =" + empId);
					Employee emp = employeeRepo.findByEmpId(empId);
					log.debug("Employee obj =" + emp);
					if (emp != null) {
						jobDto.setEmployeeId(emp.getId());
						jobDto.setEmployeeName(emp.getFullName());
						jobDto.setStatus(JobStatus.ASSIGNED.name());
						jobDto.setJobType(JobType.valueOf(jobType));
						cellNo++;
						String schedule = currentRow.getCell(7).getStringCellValue();
						jobDto.setSchedule(schedule);
						cellNo++;
						Date startDate = currentRow.getCell(8).getDateCellValue();
						cellNo++;
						Date endDate = currentRow.getCell(9).getDateCellValue();
						cellNo++;
						Date startTime = currentRow.getCell(10).getDateCellValue();
						cellNo++;
						Date endTime = currentRow.getCell(11).getDateCellValue();
						jobDto.setPlannedStartTime(DateUtil.convertToDateTime(startDate, startTime));
						jobDto.setPlannedEndTime(DateUtil.convertToDateTime(endDate, endTime));
						jobDto.setScheduleEndDate(DateUtil.convertToDateTime(endDate, endTime));
						//jobDto.setPlannedHours((int)(startTime.getTime() - endTime.getTime()));
						Date date1 = (DateUtil.convertToDateTime(startDate, startTime));
						Date date2 = (DateUtil.convertToDateTime(endDate, endTime));
						long diff = date2.getTime()-date1.getTime();
						//long diff = endTime.getTime() - startTime.getTime();
						//long diffHours = diff / (24 * 60 * 60 * 1000);
						long diffHours = diff / (60 * 60 * 1000);
						jobDto.setPlannedHours((int)(diffHours));
						
						//jobDto.setPlannedHours((int)(endTime.getTime() - startTime.getTime()));
						cellNo++;
						if(currentRow.getCell(12)!=null){
	                        jobDto.setFrequency(currentRow.getCell(12).getStringCellValue());
	                    }
						jobDto.setActive("Y");
						cellNo++;
						if(currentRow.getCell(13) != null) {
							String checkListName = currentRow.getCell(13).getStringCellValue();
							if(StringUtils.isNotBlank(checkListName)) {
								SearchCriteria searchCriteria = new SearchCriteria();
								searchCriteria.setName(checkListName);
								SearchResult<ChecklistDTO> result = checklistService.findBySearchCrieria(searchCriteria);
								List<ChecklistDTO> checkListDtos = result.getTransactions();
								if(CollectionUtils.isNotEmpty(checkListDtos)) {
									ChecklistDTO checklistDto = checkListDtos.get(0);
									List<ChecklistItemDTO> checkListItems = checklistDto.getItems();
									List<JobChecklistDTO> jobCheckListItems = new ArrayList<JobChecklistDTO>();
									for(ChecklistItemDTO checklistItemDto : checkListItems) {
										JobChecklistDTO jobChecklistDto = new JobChecklistDTO();
										jobChecklistDto.setChecklistId(String.valueOf(checklistDto.getId()));
										jobChecklistDto.setChecklistName(checklistDto.getName());
										jobChecklistDto.setChecklistItemId(String.valueOf(checklistItemDto.getId()));
										jobChecklistDto.setChecklistItemName(String.valueOf(checklistItemDto.getName()));
										jobCheckListItems.add(jobChecklistDto);
									}
									jobDto.setChecklistItems(jobCheckListItems);
								}
							}
						}
						cellNo++;
						if((currentRow.getCell(14)!=null)&&(currentRow.getCell(15)!=null)&&currentRow.getCell(16)!=null){
						    String block = currentRow.getCell(14).getStringCellValue();
						    cellNo++;
						    String floor = currentRow.getCell(15).getStringCellValue();
						    cellNo++;
						    String zone = currentRow.getCell(16).getStringCellValue();
	                        jobDto.setBlock(block);
	                        jobDto.setFloor(floor);
	                        jobDto.setZone(zone);
	                        log.debug("location available - " + block+" - "+floor+" - "+zone);
	                        log.debug("site id - "+jobDto.getSiteId());

	                        List<Location> loc = locationRepo.findByAll(jobDto.getSiteId(),block,floor,zone);
	                        log.debug("location details - "+loc.isEmpty());
	                        if(loc.isEmpty()){

	                        }else{
	                            long locationId = loc.get(0).getId();
	                            jobDto.setLocationId(locationId);
	                        }

	                    }else {
						    cellNo += 2;
	                    }
					    cellNo++;
						if(currentRow.getCell(17) != null) {
							boolean isScheduleExcludeWeeknd = currentRow.getCell(17).getBooleanCellValue();
							jobDto.setScheduleDailyExcludeWeekend(isScheduleExcludeWeeknd);
						}
						jobService.saveJob(jobDto);

					}
					siteId  = 0;
				} catch (IllegalStateException | NumberFormatException formatEx) {
					/*
					String msg = "Error while getting values from row - " + r;
					log.error(msg, formatEx);
					response.append(formatEx.getMessage());
					response.append("\n" + msg);
					response.append("\n" + "Correct the data format and retry again");
					if(importResult == null) {
						importResult = new ImportResult();
					}
					importResult.setStatus(FAILED);
					importResult.setMsg(response.toString());
					statusMap.put(fileKey, importResult);
					*/
					throw formatEx;
				} catch (Exception e) {
					String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
					log.error(msg, e);
					response.append(e.getMessage());
					response.append("--" + msg);
					response.append("--" + "Please correct the data format and retry again");
					if(importResult == null) {
						importResult = new ImportResult();
					}
					importResult.setStatus(FAILED);
					importResult.setMsg(response.toString());
					statusMap.put(fileKey, importResult);
					throw new Exception(response.toString());
				}
			}

		} catch (IOException e) {
			String msg = "Error while reading the job data file for import";
			log.error(msg, e);
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		} catch (IllegalStateException | NumberFormatException formatEx) {
			String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
			log.error(msg, formatEx);
			response.append(formatEx.getMessage());
			response.append("--" + msg);
			response.append("--" + "Please correct the data format and retry again");
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		}
		if(response.length() == 0) {
			response.append(SUCCESS_MESSAGE);
		}
		return response.toString();
	}


	private String importClientFromFile(String fileKey, String path) throws Exception {
		int r = 0;
		int cellNo = 0;
		StringBuffer response = new StringBuffer();
		ImportResult importResult = statusMap.get(fileKey);
		try {

			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			int lastRow = datatypeSheet.getLastRowNum();
			r = 1;
			for (; r <= lastRow; r++) {
				log.debug("Current Row number -" + r);
				try {
					Row currentRow = datatypeSheet.getRow(r);
					ProjectDTO projectDto = new ProjectDTO();
					cellNo = 0;
					projectDto.setName(currentRow.getCell(0).getStringCellValue());
					cellNo = 1;
					projectDto.setContactFirstName(currentRow.getCell(1).getStringCellValue());
					cellNo = 2;
					projectDto.setContactLastName(currentRow.getCell(2).getStringCellValue());
					cellNo = 3;
					projectDto.setPhone(String.valueOf(currentRow.getCell(3).getStringCellValue()));
					cellNo = 4;
					projectDto.setEmail(currentRow.getCell(4).getStringCellValue());
					cellNo = 5;
					projectDto.setAddress(currentRow.getCell(5).getStringCellValue());
					projectDto.setUserId(SecurityUtils.getCurrentUserId());
					if (CollectionUtils.isEmpty(projectRepo.findAllByName(projectDto.getName()))){
							Project project = mapperUtil.toEntity(projectDto, Project.class);
							project.setActive(Project.ACTIVE_YES);
							project = projectRepo.save(project);
					}
				} catch (IllegalStateException | NumberFormatException formatEx) {
					throw formatEx;
				} catch (Exception e) {
					String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
					log.error(msg, e);
					response.append(e.getMessage());
					response.append("--" + msg);
					response.append("--" + "Please correct the data format and retry again");
					if(importResult == null) {
						importResult = new ImportResult();
					}
					importResult.setStatus(FAILED);
					importResult.setMsg(response.toString());
					statusMap.put(fileKey, importResult);
					throw new Exception(response.toString());
				}
			}

		} catch (IOException e) {
			String msg = "Error while reading the client data file for import";
			log.error(msg, e);
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		} catch (IllegalStateException | NumberFormatException formatEx) {
			String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
			log.error(msg, formatEx);
			response.append(formatEx.getMessage());
			response.append("--" + msg);
			response.append("--" + "Please correct the data format and retry again");
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		}
		if(response.length() == 0) {
			response.append(SUCCESS_MESSAGE);
		}
		return response.toString();
	}

	private String importSiteFromFile(String fileKey, String path) throws Exception {
		int r = 0;
		int cellNo = 0;
		StringBuffer response = new StringBuffer();
		ImportResult importResult = statusMap.get(fileKey);
		try {

			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			Iterator<Row> iterator = datatypeSheet.iterator();
			int lastRow = datatypeSheet.getLastRowNum();
			r = 1;
			for (; r <= lastRow; r++) {
				log.debug("Current Row number -" + r+"Last Row : "+lastRow);
				try {
					Row currentRow = datatypeSheet.getRow(r);
					cellNo = 0;
					log.debug("cell type =" + currentRow.getCell(0).getNumericCellValue()+"\t"+currentRow.getCell(9).getNumericCellValue());
					SiteDTO siteDTO = new SiteDTO();
					siteDTO.setProjectId((int)currentRow.getCell(0).getNumericCellValue());
					cellNo = 1;
					siteDTO.setName(currentRow.getCell(1).getStringCellValue());
					cellNo = 7;
					log.debug("REgion and branch - "+ currentRow.getCell(7).getStringCellValue());
					cellNo = 8;
					log.debug("Branch - " + currentRow.getCell(8).getStringCellValue());
	                if(org.apache.commons.lang3.StringUtils.isNotEmpty(currentRow.getCell(7).getStringCellValue())){
	                    log.debug("REgion from site import - "+currentRow.getCell(7).getStringCellValue());
	                    String regionName = currentRow.getCell(7).getStringCellValue();
	                    Region region = siteService.isRegionSaved(regionName,siteDTO.getProjectId());

	                    if(region!=null && region.getId()>0){
	                        siteDTO.setRegion(region.getName());
	                        if(org.apache.commons.lang3.StringUtils.isNotEmpty(currentRow.getCell(8).getStringCellValue())){

	                            String branchName = currentRow.getCell(8).getStringCellValue();
	                            Branch branch = siteService.isBranchSaved(branchName,siteDTO.getProjectId(),region.getId());
	                            if(branch!=null && branch.getId()>0){
	                                siteDTO.setBranch(branch.getName());
	                            }
	                        }
	                    }
	                }
	                log.debug("site DTO region and branch - "+siteDTO.getRegion()+" - "+siteDTO.getBranch());
	                cellNo = 9;
					siteDTO.setAddressLat(Double.valueOf(currentRow.getCell(9).getNumericCellValue()));
					cellNo = 10;
					siteDTO.setAddressLng(Double.valueOf(currentRow.getCell(10).getNumericCellValue()));
					cellNo = 11;
					siteDTO.setRadius(Double.valueOf(currentRow.getCell(11).getNumericCellValue()));
					cellNo = 6;
					siteDTO.setAddress(currentRow.getCell(6).getStringCellValue());
					siteDTO.setUserId(SecurityUtils.getCurrentUserId());
					Site site = mapperUtil.toEntity(siteDTO, Site.class);
			        site.setActive(Site.ACTIVE_YES);
					site = siteRepo.save(site);
					log.debug("Created Information for Site: {}", site);
					//update the site location by calling site location service
					siteLocationService.save(site.getUser().getId(), site.getId(), site.getAddressLat(), site.getAddressLng(), site.getRadius());

				} catch (IllegalStateException | NumberFormatException formatEx) {
					throw formatEx;
				} catch (Exception e) {
					String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
					log.error(msg, e);
					response.append(e.getMessage());
					response.append("--" + msg);
					response.append("--" + "Please correct the data format and retry again");
					if(importResult == null) {
						importResult = new ImportResult();
					}
					importResult.setStatus(FAILED);
					importResult.setMsg(response.toString());
					statusMap.put(fileKey, importResult);
					throw new Exception(response.toString());
				}
			}

		} catch (IOException e) {
			String msg = "Error while reading the site data file for import";
			log.error(msg, e);
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		} catch (IllegalStateException | NumberFormatException formatEx) {
			String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
			log.error(msg, formatEx);
			response.append(formatEx.getMessage());
			response.append("--" + msg);
			response.append("--" + "Please correct the data format and retry again");
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		}
		if(response.length() == 0) {
			response.append(SUCCESS_MESSAGE);
		}
		return response.toString();
	}

	private String importLocationFromFile(String fileKey, String path) throws Exception {
		int r = 0;
		int cellNo = 0;
		StringBuffer response = new StringBuffer();
		ImportResult importResult = statusMap.get(fileKey);
		try {

			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			Iterator<Row> iterator = datatypeSheet.iterator();
			int lastRow = datatypeSheet.getLastRowNum();
			r = 1;
			for (; r <= lastRow; r++) {
				log.debug("Current Row number -" + r+"Last Row : "+lastRow);
				try {
					Row currentRow = datatypeSheet.getRow(r);
					LocationDTO locationDTO = new LocationDTO();
					cellNo = 1;
					locationDTO.setProjectId(Long.valueOf(getCellValue(currentRow.getCell(1))));
					cellNo = 3;
					locationDTO.setSiteId(Long.valueOf(getCellValue(currentRow.getCell(3))));
					cellNo = 5;
					locationDTO.setBlock(currentRow.getCell(5).getStringCellValue());
					cellNo = 6;
					locationDTO.setFloor(currentRow.getCell(6).getStringCellValue());
					cellNo = 8;
					locationDTO.setZone(currentRow.getCell(8).getStringCellValue());
					Location loc = mapperUtil.toEntity(locationDTO, Location.class);
			        loc.setActive(Site.ACTIVE_YES);
					loc = locationRepo.save(loc);
					log.debug("Created Information for Location: {}", loc);
				} catch (IllegalStateException | NumberFormatException formatEx) {
					throw formatEx;
				} catch (Exception e) {
					String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
					log.error(msg, e);
					response.append(e.getMessage());
					response.append("--" + msg);
					response.append("--" + "Please correct the data format and retry again");
					if(importResult == null) {
						importResult = new ImportResult();
					}
					importResult.setStatus(FAILED);
					importResult.setMsg(response.toString());
					statusMap.put(fileKey, importResult);
					throw new Exception(response.toString());
				}
			}

		} catch (IOException e) {
			String msg = "Error while reading the location data file for import";
			log.error(msg, e);
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		} catch (IllegalStateException | NumberFormatException formatEx) {
			String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
			log.error(msg, formatEx);
			response.append(formatEx.getMessage());
			response.append("--" + msg);
			response.append("--" + "Please correct the data format and retry again");
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		}
		if(response.length() == 0) {
			response.append(SUCCESS_MESSAGE);
		}
		return response.toString();
	}


	private String importChecklistFromFile(String fileKey, String path) throws Exception {
		// TODO Auto-generated method stub
		int r = 0;
		int cellNo = 0;
		StringBuffer response = new StringBuffer();
		ImportResult importResult = statusMap.get(fileKey);
		try{
			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			Iterator<Row> iterator = datatypeSheet.iterator();
			int lastRow = datatypeSheet.getLastRowNum();
			r = 1;
			for (; r <= lastRow; r++) {
				try {
					Row currentRow = datatypeSheet.getRow(r);
					log.debug("cell type =" + currentRow.getCell(0).getStringCellValue()+"\t"+currentRow.getCell(1).getStringCellValue());
					ChecklistDTO checklistDTO = new ChecklistDTO();
					List<ChecklistItemDTO> checkListItems = new ArrayList<ChecklistItemDTO>();
					StringTokenizer items = new StringTokenizer(currentRow.getCell(1).getStringCellValue(), ",");
					while(items.hasMoreTokens()){
						String itemName = items.nextToken();
						log.debug("Items -"+itemName);
						ChecklistItemDTO checkListItemDTO = new ChecklistItemDTO();
						//checkListItemDTO.setId(i);
						checkListItemDTO.setName(itemName);
						checkListItems.add(checkListItemDTO);
					}
					checklistDTO.setName(currentRow.getCell(0).getStringCellValue());
					checklistDTO.setItems(checkListItems);
					ChecklistDTO createdChecklist = null;
					createdChecklist = checklistService.createChecklistInformation(checklistDTO);
				} catch (IllegalStateException | NumberFormatException formatEx) {
					throw formatEx;
				} catch (Exception e) {
					String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
					log.error(msg, e);
					response.append(e.getMessage());
					response.append("--" + msg);
					response.append("--" + "Please correct the data format and retry again");
					if(importResult == null) {
						importResult = new ImportResult();
					}
					importResult.setStatus(FAILED);
					importResult.setMsg(response.toString());
					statusMap.put(fileKey, importResult);
					throw new Exception(response.toString());
				}


			}

		}catch (IOException e) {
			String msg = "Error while reading the checklist data file for import";
			log.error(msg, e);
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		} catch (IllegalStateException | NumberFormatException formatEx) {
			String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
			log.error(msg, formatEx);
			response.append(formatEx.getMessage());
			response.append("--" + msg);
			response.append("--" + "Please correct the data format and retry again");
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		}
		if(response.length() == 0) {
			response.append(SUCCESS_MESSAGE);
		}
		return response.toString();


	}

	private List<AssetDTO> getNonInsertedCount(List<AssetDTO> assetDTOs) {
		 
		List<AssetDTO> nonInsertedRows = assetDTOs.stream().filter(asset -> !asset.isInserted()).collect(Collectors.toList());
		
		return nonInsertedRows;
		
	}
	
	private  List<AssetDTO> invalidAssetRows;
	
	private int lastNonInsertedCount;
	
	private void saveImportedDetails(List<AssetDTO> assetDTOs,int nonInsertedCount) throws Exception {
		
		
			
		if(lastNonInsertedCount != nonInsertedCount) {
		
			lastNonInsertedCount = nonInsertedCount;
			 
			try {
		
				for(AssetDTO asset : assetDTOs) {
				
					if(!asset.isInserted() && !StringUtils.isEmpty(asset.getCode())) {
					
						if(StringUtils.isEmpty(asset.getParentAssetCode())) {
							
							assetManagementService.saveAsset(asset);
							asset.setInserted(true);
							
						}
						else {
							
							List<Asset> parentAssets = assetRepository.findAssetCodeBySite(asset.getSiteId(),String.valueOf(asset.getSiteId()) + "_"+ asset.getParentAssetCode());
							
							if(parentAssets.size() > 0) {
								
								asset.setParentAsset(parentAssets.get(0));
								asset.setParentAssetId(parentAssets.get(0).getId());
								assetManagementService.saveAsset(asset);
								asset.setInserted(true);
								
							} 
							   
						}
						 
					}
					
				}
				
			}
			catch (Exception e) {
				//String msg = "Error while reading the asset data file for import";
				//log.error(msg, e);
				
				throw new Exception(e);
			} 
			
			List<AssetDTO> filteredRows = getNonInsertedCount(assetDTOs);
			
			if(filteredRows.size()>0) {
				
				saveImportedDetails(filteredRows,filteredRows.size());
				
			}
			
		}
		else {
			
			invalidAssetRows = getNonInsertedCount(assetDTOs);
			
		}
	}
	
	private String importAssetFromFile(String fileKey, String path) throws Exception {
		
		int r = 0;
		int cellNo = 0;
		StringBuffer response = new StringBuffer();
		ImportResult importResult = statusMap.get(fileKey);
		
		currentCell = 0;
		
		try {

			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			//Iterator<Row> iterator = datatypeSheet.iterator();
			int lastRow = datatypeSheet.getLastRowNum();
			r = 1;

			log.debug("Last Row number -" + lastRow);
			
			List<AssetDTO> assetDTOs = new ArrayList<>();
			 
			for (; r <= lastRow; r++) {
				 
				try {
					
					// Reading Part
					

					Row currentRow = datatypeSheet.getRow(r);

					if(currentRow.getCell(0) == null) {
						break;
					}
 					
					AssetDTO assetDTO = new AssetDTO();
					assetDTO.setRowNumber(r+1);
					
					assetDTO.setCode(getCellValue(currentRow.getCell(0)));
					assetDTO.setInserted(false);
					
					assetDTO.setTitle(getCellValue(currentRow.getCell(1))); 
					assetDTO.setDescription(getCellValue(currentRow.getCell(2))); 
					assetDTO.setAssetType(getCellValue(currentRow.getCell(3)));
					assetDTO.setParentAssetCode(getCellValue(currentRow.getCell(4)));
					assetDTO.setAssetGroup(getCellValue(currentRow.getCell(5)));
					assetDTO.setProjectId(Long.valueOf(getCellValue(currentRow.getCell(6))));
					assetDTO.setSiteId(Long.valueOf(getCellValue(currentRow.getCell(7))));
					assetDTO.setBlock(getCellValue(currentRow.getCell(8)));
					assetDTO.setFloor(getCellValue(currentRow.getCell(9)));
					assetDTO.setZone(getCellValue(currentRow.getCell(10)));
					assetDTO.setManufacturerId(Long.valueOf(getCellValue(currentRow.getCell(11))));
					assetDTO.setModelNumber(getCellValue(currentRow.getCell(12)));
					assetDTO.setSerialNumber(getCellValue(currentRow.getCell(13)));
					Date acquiredDate = currentRow.getCell(14) != null ? currentRow.getCell(14).getDateCellValue() : null;
					if(acquiredDate != null) {
						assetDTO.setAcquiredDate(acquiredDate);
					}
					assetDTO.setPurchasePrice(Double.valueOf(getCellValue(currentRow.getCell(15))));
					assetDTO.setCurrentPrice(Double.valueOf(getCellValue(currentRow.getCell(16))));
					assetDTO.setEstimatedDisposePrice(Double.valueOf(getCellValue(currentRow.getCell(17))));
					assetDTO.setWarrantyType(getCellValue(currentRow.getCell(18)));
					Date warrantyDate = currentRow.getCell(19) != null ? currentRow.getCell(19).getDateCellValue() : null;
					if(warrantyDate != null) {
						assetDTO.setWarrantyExpiryDate(warrantyDate);
					}
					assetDTO.setVendorId(Long.valueOf(getCellValue(currentRow.getCell(20))));
					assetDTO.setStatus(getCellValue(currentRow.getCell(21)));
					
					String criticalStatusObj = getCellValue(currentRow.getCell(22));
					
					if(criticalStatusObj !=null ) {
						
						String[] criticalStatusList = criticalStatusObj.split(",");
						
						List<AssetTicketConfigDTO> statusList = new ArrayList<AssetTicketConfigDTO>();
						
						for(String criticalStatus : criticalStatusList) {
							
							AssetTicketConfigDTO status = new AssetTicketConfigDTO();
							
							status.setStatus(criticalStatus);
							status.setSeverity(true);
							status.setTicket(true);
							
							statusList.add(status);
							
							
						}
						
						assetDTO.setCriticalStatusList(statusList);
						
					}
					
					
					assetDTOs.add(assetDTO);
			 
				} catch (IllegalStateException | NumberFormatException formatEx) {
					throw formatEx;
				} catch (Exception e) {
					Row errorRow = datatypeSheet.getRow(r+1);
					String name = getCellValue((errorRow.getCell(0)));
					String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (currentCell) + " in " + name;
					log.error(msg, e);
					response.append(e.getMessage());
					response.append("--" + msg);
					response.append("--" + "Please correct the data format and retry again");

					ImportLogs importLog = new ImportLogs();
					importLog.setActive(ImportLogs.ACTIVE_YES);
					importLog.setErrorMessage(msg);
					importLog.setItemType(LogImportType.ASSET.getValue());
					importLog.setFileName(fileKey);
					importLogRepository.save(importLog);

					if(importResult == null) {
						importResult = new ImportResult();
					}
					importResult.setStatus(FAILED);
					importResult.setMsg(response.toString());
					statusMap.put(fileKey, importResult);
					throw new Exception(response.toString());
				}
 
			}
			
			
			// save data 
			
			lastNonInsertedCount = 0;
			
			saveImportedDetails(assetDTOs,assetDTOs.size());
			
			
			

		} catch (IOException e) {
			String msg = "Error while reading the asset data file for import";
			log.error(msg, e);
			ImportLogs importLog = new ImportLogs();
			importLog.setActive(ImportLogs.ACTIVE_YES);
			importLog.setErrorMessage(msg);
			importLog.setItemType(LogImportType.ASSET.getValue());
			importLog.setFileName(fileKey);
			importLogRepository.save(importLog);
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		} catch (IllegalStateException | NumberFormatException formatEx) {
			String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
			log.error(msg, formatEx);
			response.append(formatEx.getMessage());
			response.append("--" + msg);
			response.append("--" + "Please correct the data format and retry again");
			ImportLogs importLog = new ImportLogs();
			importLog.setActive(ImportLogs.ACTIVE_YES);
			importLog.setErrorMessage(msg);
			importLog.setItemType(LogImportType.ASSET.getValue());
			importLog.setFileName(fileKey);
			importLogRepository.save(importLog);
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		}
		if(response.length() == 0) {
			
			response.append(FAILED);
			
			if(invalidAssetRows !=null && invalidAssetRows.size()>0) {
				 
				response.append("Following Rows are invalid");
				response.append(invalidAssetRows.stream().map(n -> String.valueOf(n.getRowNumber())).collect(Collectors.joining(",")));
				
			}
		}
		return response.toString();
	}

	private String importAssetPPMFromFile(String fileKey, String path) throws Exception {
		int r = 0;
		int cellNo = 0;
		StringBuffer response = new StringBuffer();
		ImportResult importResult = statusMap.get(fileKey);
		try {

			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			//Iterator<Row> iterator = datatypeSheet.iterator();
			int lastRow = datatypeSheet.getLastRowNum();
			r = 1;

			log.debug("Last Row number -" + lastRow);
			for (; r <= lastRow; r++) {
				log.debug("Current Row number -" + r);
				try {
					Row currentRow = datatypeSheet.getRow(r);

					AssetPpmScheduleDTO assetPPMDto = new AssetPpmScheduleDTO();
					cellNo = 0;
					String assetCode = getCellValue(currentRow.getCell(0));
					AssetDTO assetDTO = assetManagementService.findByAssetCode(assetCode);
					assetPPMDto.setAssetId(assetDTO.getId());
					cellNo = 3;
					assetPPMDto.setTitle(getCellValue(currentRow.getCell(3)));
					cellNo = 4;
					assetPPMDto.setFrequency(getCellValue(currentRow.getCell(4)));
					cellNo = 5;
					assetPPMDto.setFrequencyDuration(Integer.parseInt(getCellValue(currentRow.getCell(5))));
					cellNo = 6;
					Date startDate = currentRow.getCell(6) != null ? currentRow.getCell(6).getDateCellValue() : null;
					if(startDate != null) {
						assetPPMDto.setStartDate(startDate);
					}
					cellNo = 7;
					Date endDate = currentRow.getCell(7) != null ? currentRow.getCell(7).getDateCellValue() : null;
					if(endDate != null) {
						assetPPMDto.setEndDate(endDate);
					}
					cellNo = 8;
					Date startDateTime = currentRow.getCell(8) != null ? currentRow.getCell(8).getDateCellValue() : null;
					if(startDateTime != null) {
						assetPPMDto.setJobStartTime(DateUtil.convertToZDT(startDateTime));
					}
					cellNo = 9;
					assetPPMDto.setPlannedHours(Integer.parseInt(getCellValue(currentRow.getCell(9))));
					cellNo = 10;
					assetPPMDto.setEmpId(Long.parseLong(getCellValue(currentRow.getCell(10))));
					cellNo = 11;
	                String checkListName = getCellValue(currentRow.getCell(11));
	                if(StringUtils.isNotBlank(checkListName)) {
	                    SearchCriteria searchCriteria = new SearchCriteria();
	                    searchCriteria.setName(checkListName);
	                    SearchResult<ChecklistDTO> result = checklistService.findBySearchCrieria(searchCriteria);
	                    List<ChecklistDTO> checkListDtos = result.getTransactions();
	                    if (CollectionUtils.isNotEmpty(checkListDtos)) {
	                        ChecklistDTO checklistDto = checkListDtos.get(0);
	                        assetPPMDto.setChecklistId(checklistDto.getId());
	                    }
	                }

					assetManagementService.createAssetPpmSchedule(assetPPMDto);
				} catch (IllegalStateException | NumberFormatException formatEx) {
					throw formatEx;
				} catch (Exception e) {
					String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
					log.error(msg, e);
					response.append(e.getMessage());
					response.append("--" + msg);
					response.append("--" + "Please correct the data format and retry again");
					if(importResult == null) {
						importResult = new ImportResult();
					}
					importResult.setStatus(FAILED);
					importResult.setMsg(response.toString());
					statusMap.put(fileKey, importResult);
					throw new Exception(response.toString());
				}

			}

		} catch (IOException e) {
			String msg = "Error while reading the asset ppm data file for import";
			log.error(msg, e);
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		} catch (IllegalStateException | NumberFormatException formatEx) {
			String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
			log.error(msg, formatEx);
			response.append(formatEx.getMessage());
			response.append("--" + msg);
			response.append("--" + "Please correct the data format and retry again");
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		}
		if(response.length() == 0) {
			response.append(SUCCESS_MESSAGE);
		}
		return response.toString();
	}

	private String importAssetAMCFromFile(String fileKey, String path) throws Exception{
		int r = 0;
		int cellNo = 0;
		StringBuffer response = new StringBuffer();
		ImportResult importResult = statusMap.get(fileKey);
		try {

			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			//Iterator<Row> iterator = datatypeSheet.iterator();
			int lastRow = datatypeSheet.getLastRowNum();
			r = 1;

			log.debug("Last Row number -" + lastRow);
			for (; r <= lastRow; r++) {
				log.debug("Current Row number -" + r);
				try {
					Row currentRow = datatypeSheet.getRow(r);
					cellNo = 0;
					AssetAMCScheduleDTO assetAMCDto = new AssetAMCScheduleDTO();
					String assetCode = getCellValue(currentRow.getCell(0));
					AssetDTO assetDTO = assetManagementService.findByAssetCode(assetCode);
					assetAMCDto.setAssetId(assetDTO.getId());
					cellNo = 3;
					assetAMCDto.setTitle(getCellValue(currentRow.getCell(3)));
					cellNo = 4;
					assetAMCDto.setFrequency(getCellValue(currentRow.getCell(4)));
					cellNo = 5;
					assetAMCDto.setFrequencyDuration(Integer.parseInt(getCellValue(currentRow.getCell(5))));
					cellNo = 6;
					Date startDate = currentRow.getCell(6) != null ? currentRow.getCell(6).getDateCellValue() : null;
					if(startDate != null) {
						assetAMCDto.setStartDate(startDate);
					}
					cellNo = 7;
					Date endDate = currentRow.getCell(7) != null ? currentRow.getCell(7).getDateCellValue() : null;
					if(endDate != null) {
						assetAMCDto.setEndDate(endDate);
					}
					cellNo = 8;
					Date startDateTime = currentRow.getCell(8) != null ? currentRow.getCell(8).getDateCellValue() : null;
					if(startDateTime != null) {
						assetAMCDto.setJobStartTime(DateUtil.convertToZDT(startDateTime));
					}
					cellNo = 9;
					assetAMCDto.setPlannedHours(Integer.parseInt(getCellValue(currentRow.getCell(9))));
					cellNo = 10;
					assetAMCDto.setEmpId(Long.parseLong(getCellValue(currentRow.getCell(10))));
					assetAMCDto.setFrequencyPrefix("Every");
					cellNo = 11;
					assetAMCDto.setMaintenanceType(getCellValue(currentRow.getCell(11)));
					cellNo = 12;
	                String checkListName = getCellValue(currentRow.getCell(12));

	                if(StringUtils.isNotBlank(checkListName)) {
	                    SearchCriteria searchCriteria = new SearchCriteria();
	                    searchCriteria.setName(checkListName);
	                    SearchResult<ChecklistDTO> result = checklistService.findBySearchCrieria(searchCriteria);
	                    List<ChecklistDTO> checkListDtos = result.getTransactions();
	                    if (CollectionUtils.isNotEmpty(checkListDtos)) {
	                        ChecklistDTO checklistDto = checkListDtos.get(0);
	                        assetAMCDto.setChecklistId(checklistDto.getId());
	                    }
	                }

					assetManagementService.createAssetAMCSchedule(assetAMCDto);
				} catch (IllegalStateException | NumberFormatException formatEx) {
					throw formatEx;
				} catch (Exception e) {
					String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
					log.error(msg, e);
					response.append(e.getMessage());
					response.append("--" + msg);
					response.append("--" + "Please correct the data format and retry again");
					if(importResult == null) {
						importResult = new ImportResult();
					}
					importResult.setStatus(FAILED);
					importResult.setMsg(response.toString());
					statusMap.put(fileKey, importResult);
					throw new Exception(response.toString());
				}

			}

		} catch (IOException e) {
			String msg = "Error while reading the asset amc data file for import";
			log.error(msg, e);
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		} catch (IllegalStateException | NumberFormatException formatEx) {
			String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
			log.error(msg, formatEx);
			response.append(formatEx.getMessage());
			response.append("--" + msg);
			response.append("--" + "Please correct the data format and retry again");
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		}
		if(response.length() == 0) {
			response.append(SUCCESS_MESSAGE);
		}
		return response.toString();
	}

	private String importEmployeeFromFile(String fileKey, String path) throws Exception {
		StringBuffer response = new StringBuffer();
		int r = 1;
		int cellNo = 0;
		ImportResult importResult = statusMap.get(fileKey);
		try {

			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			//Iterator<Row> iterator = datatypeSheet.iterator();
			int lastRow = datatypeSheet.getLastRowNum();
			log.debug("Last Row number -" + lastRow);
			for (; r <= lastRow; r++) {
				log.debug("Current Row number -" + r);
				Row currentRow = datatypeSheet.getRow(r);
				try {
					cellNo = 2;
					if(currentRow.getCell(2).getStringCellValue() != null) {
						Employee existingEmployee = employeeRepo.findByEmpId(currentRow.getCell(2).getStringCellValue().trim());
						if(existingEmployee != null) {
							List<EmployeeProjectSite> projSites = existingEmployee.getProjectSites();
							cellNo = 0;
							Project newProj = projectRepo.findOne(Long.valueOf(getCellValue(currentRow.getCell(0))));
							cellNo = 1;
							Site newSite = siteRepo.findOne(Long.valueOf(getCellValue(currentRow.getCell(1))));
							EmployeeProjectSite projectSite = new EmployeeProjectSite();
							projectSite.setProject(newProj);
							projectSite.setSite(newSite);
							projectSite.setEmployee(existingEmployee);
                            existingEmployee.getProjectSites().add(projectSite);
							log.debug("Update Employee Information with new site info: {} " + existingEmployee.getEmpId() );

							if(StringUtils.isNotEmpty(getCellValue(currentRow.getCell(5)))) {
								Employee manager =  employeeRepo.findByEmpId(currentRow.getCell(5).getStringCellValue().trim());
								if(manager !=null){
                                    existingEmployee.setManager(manager);
                                }
					        }
                            existingEmployee.setFaceAuthorised(false);
                            existingEmployee.setFaceIdEnrolled(false);
                            existingEmployee.setLeft(false);
                            existingEmployee.setRelieved(false);
                            existingEmployee.setReliever(false);

							employeeRepo.save(existingEmployee);
							//create user if opted.
							cellNo = 3;
							String createUser = getCellValue(currentRow.getCell(3));
							cellNo = 4;
							long userRoleId = Long.parseLong(getCellValue(currentRow.getCell(4)));
							UserDTO user = new UserDTO();
							if(StringUtils.isNotEmpty(createUser) && createUser.equalsIgnoreCase("Y") && userRoleId > 0) {
							    if((existingEmployee.getUser() == null) || (existingEmployee.getUser() !=null && StringUtils.equals(existingEmployee.getUser().getLogin(),dummyUser))){
                                    user.setLogin(existingEmployee.getEmpId());
                                    user.setPassword(existingEmployee.getEmpId());
                                    user.setFirstName(existingEmployee.getName());
                                    user.setLastName(existingEmployee.getLastName());
                                    user.setAdminFlag("N");
                                    user.setUserRoleId(userRoleId);
                                    user.setEmployeeId(existingEmployee.getId());
                                    user.setActivated(true);
                                    user = userService.createUserInformation(user);
                                    User userObj = userRepository.findOne(user.getId());
                                    existingEmployee.setUser(userObj);
                                    employeeRepo.save(existingEmployee);
                                }

							}
							log.debug("Created Information for Employee: {}" + existingEmployee.getId());

						}
					}
				} catch (IllegalStateException | NumberFormatException formatEx) {
					throw formatEx;
				} catch (Exception e) {
					String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
					log.error(msg, e);
					response.append(e.getMessage());
					response.append("--" + msg);
					response.append("--" + "Please correct the data format and retry again");
					if(importResult == null) {
						importResult = new ImportResult();
					}
					importResult.setStatus(FAILED);
					importResult.setMsg(response.toString());
					statusMap.put(fileKey, importResult);
					throw new Exception(response.toString());
				}



			/*}*/
			}

		} catch (IOException e) {
			String msg = "Error while reading the employee data file for import";
			log.error(msg, e);
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		}  catch (IllegalStateException | NumberFormatException formatEx) {
			String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
			log.error(msg, formatEx);
			response.append(formatEx.getMessage());
			response.append("--" + msg);
			response.append("--" + "Please correct the data format and retry again");
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		}
		if(response.length() == 0) {
			response.append(SUCCESS_MESSAGE);
		}
		return response.toString();
	}

/*******************************************Modified By Vinoth*************************************************************************/
	
	private String importEmployeeOnboardingFromFile(String fileKey, String path) throws Exception {
		StringBuffer response = new StringBuffer();
		int r = 1;
		int cellNo = 0;
		ImportResult importResult = statusMap.get(fileKey);
		try {

			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			int lastRow = datatypeSheet.getLastRowNum();
			log.debug("Last Row number -" + lastRow);
			for (; r <= lastRow; r++) {
				log.debug("Current Row number -" + r);
				Row currentRow = datatypeSheet.getRow(r);
				try {
					cellNo = 5;
					cellNo = 2;
					cellNo = 0;

					Employee employee = null;
					
					boolean isNewEmployee = false;
					String empId;
					boolean skipSave = false; 
					
					if( currentRow.getCell(5) !=null && StringUtils.isNotEmpty( currentRow.getCell(5).getStringCellValue()   )){
						
						employee = isSkipDuplicate(currentRow.getCell(5).getStringCellValue().trim());
						empId  = currentRow.getCell(5).getStringCellValue() ;
						 
						
					}
					else {
						
						 empId = currentRow.getCell(32).getStringCellValue().substring(7);
                         log.debug("Employee id not present, entering substirng - "+empId);
                         
                         employee = isSkipDuplicate(empId);
                         
                         
                         
                         isNewEmployee = true;
								
					}
					
                    if(employee==null) {
 						 employee = new Employee();
 						 employee.setEmpId(empId);
					 
                    }
                    else {
                    	
                    	if(employee.isSubmitted() && !employee.isVerified()) {
 							
 							skipSave = true;
 							
 						}

                    }
                    
                    
                    if(skipSave == false) {
                     
                    		employee.setNewEmployee(isNewEmployee);
			            	 
							cellNo = 0;
							employee.setProjectCode(getCellValue(currentRow.getCell(0)));
							cellNo = 1;
							employee.setProjectDescription(getCellValue(currentRow.getCell(1)));
							cellNo = 2;
							employee.setWbsId(getCellValue(currentRow.getCell(2)));
							cellNo = 3;
							employee.setWbsDescription(getCellValue(currentRow.getCell(3)));
							cellNo = 4; 
							
							String[] fullName = getCellValue(currentRow.getCell(4)).split(" ");
							
							if(fullName.length > 1) {
 								
								employee.setName(Arrays.stream(fullName).limit(fullName.length-1).collect(Collectors.joining(" ")));
								
								employee.setLastName(fullName[fullName.length-1]);
								
							}
							else {
								
								employee.setName(fullName[0]);
								employee.setLastName("");
								
							}
							
							employee.setFullName(getCellValue(currentRow.getCell(4)));

							cellNo = 6;
							employee.setFatherName(getCellValue(currentRow.getCell(6)));
							cellNo = 7;
							employee.setMotherName(getCellValue(currentRow.getCell(7)));
							cellNo = 8;
							employee.setGender(getCellValue(currentRow.getCell(8)));
							cellNo = 9;
							employee.setMaritalStatus(getCellValue(currentRow.getCell(9)));
							cellNo = 10;
							Date dobDate = currentRow.getCell(10) != null ? currentRow.getCell(10).getDateCellValue(): null;
							if (dobDate != null) {
								employee.setDob(DateUtil.convertToSQLDate(dobDate));
							} 
							cellNo = 11;
							Date dojDate = currentRow.getCell(11) != null ? currentRow.getCell(11).getDateCellValue(): null;
							if (dojDate != null) {
								employee.setDoj(DateUtil.convertToSQLDate(dojDate));
							}
							cellNo = 12;
							employee.setReligion(getCellValue(currentRow.getCell(12)));
							cellNo = 13;
							employee.setBloodGroup(getCellValue(currentRow.getCell(13)));
							cellNo = 14;
							employee.setPersonalIdentificationMark1(getCellValue(currentRow.getCell(14)));
							cellNo = 15;
							employee.setPersonalIdentificationMark2(getCellValue(currentRow.getCell(15)));
							cellNo = 16;
							employee.setMobile(getCellValue(currentRow.getCell(16)));
							cellNo = 17;
							employee.setEmergencyContactNumber(getCellValue(currentRow.getCell(17)));
							cellNo = 18;
							employee.setPresentAddress(getCellValue(currentRow.getCell(18)));
							cellNo = 19;
							employee.setPresentCity(getCellValue(currentRow.getCell(19)));
							cellNo = 20;
							employee.setPresentState(getCellValue(currentRow.getCell(20)));
							cellNo = 21;
							employee.setPermanentAddress(getCellValue(currentRow.getCell(21)));
							cellNo = 22;
							employee.setPermanentCity(getCellValue(currentRow.getCell(22)));
							cellNo = 23;
							employee.setPermanentState(getCellValue(currentRow.getCell(23)));
							cellNo =24;
							employee.setEducationalQulification(getCellValue(currentRow.getCell(24)));
							cellNo = 25;
							employee.setBoardInstitute(getCellValue(currentRow.getCell(25)));
							cellNo = 26;
							employee.setNomineeName(getCellValue(currentRow.getCell(26)));
							cellNo = 27;
							employee.setNomineeRelationship(getCellValue(currentRow.getCell(27)));
							cellNo = 28;
							employee.setNomineeContactNumber(getCellValue(currentRow.getCell(28)));
							cellNo = 29;
							String per = getCellValue(currentRow.getCell(29));
							Double perDob = Double.parseDouble(per);
							employee.setPercentage(perDob);
							cellNo = 30;
							employee.setEmployer(getCellValue(currentRow.getCell(30)));
							cellNo = 31;
							employee.setPreviousDesignation(getCellValue(currentRow.getCell(31)));
							cellNo = 32;
							employee.setAdharCardNumber(getCellValue(currentRow.getCell(32)));
							cellNo = 33;
							employee.setAccountNumber(getCellValue(currentRow.getCell(33)));
							cellNo = 34;
							employee.setIfscCode(getCellValue(currentRow.getCell(34)));
							cellNo = 35; 
							employee.setPosition(getCellValue(currentRow.getCell(35)));
							cellNo = 36;
							
							String position,wbsId;
							position = getCellValue(currentRow.getCell(35));
							wbsId = getCellValue(currentRow.getCell(2));
							
							Positions positionOb = positionsRepository.findByWbsIdAndPositionId(wbsId, position);
							
							double gorss = positionOb!=null ? positionOb.getGrossAmount() : 0d;
							
							
							
							employee.setGross( gorss);
							
							ZoneId  zone = ZoneId.of("Asia/Singapore");
							ZonedDateTime zdt   = ZonedDateTime.of(LocalDateTime.now(), zone);
							employee.setCreatedDate(zdt);
							employee.setActive(Employee.ACTIVE_YES);
							employee.setFaceAuthorised(false);
							employee.setFaceIdEnrolled(false);
							employee.setLeft(false);
							employee.setRelieved(false);
							employee.setReliever(false);
							employee.setImported(true);
							employee.setOnBoardedFrom("Web");
							employee.setOnBoardSource("Import");
							if(employee.getUser()==null) {employee.setUser(null);}
							employee.setSubmitted(false);
							employee.setVerified(false);
                            //employeeDTO.setMessage("error.duplicateRecordError");
							if(employee.getId()!=null) {
								employeeRepo.saveAndFlush(employee);
							}
							else {
								employeeRepo.save(employee);
							}
                      
                    
                    }
					
//					cellNo = 5;
//					if(currentRow.getCell(5).getStringCellValue() != null) {
//						Employee existingEmployee = employeeRepo.findByEmpId(currentRow.getCell(5).getStringCellValue().trim());
//						if(existingEmployee != null) {
//							List<EmployeeProjectSite> projSites = existingEmployee.getProjectSites();
//							cellNo = 0;
//							Project newProj = projectRepo.findOne(Long.valueOf(getCellValue(currentRow.getCell(0))));
//							cellNo = 1;
//							Site newSite = siteRepo.findOne(Long.valueOf(getCellValue(currentRow.getCell(1))));
//							EmployeeProjectSite projectSite = new EmployeeProjectSite();
//							projectSite.setProject(newProj);
//							projectSite.setSite(newSite);
//							projectSite.setEmployee(existingEmployee);
//
//							if(CollectionUtils.isNotEmpty(projSites)) {
//								projSites.add(projectSite);
//							}
//							employeeRepo.save(existingEmployee);
//							log.debug("Update Employee Information with new site info: {}");
//						}else {
//							Employee employee = new Employee();
//							cellNo = 0;
//							employee.setProjectId(getCellValue(currentRow.getCell(0)));
//							cellNo = 1;
//							employee.setProjectDescription(getCellValue(currentRow.getCell(1)));
//							cellNo = 2;
//							employee.setWbsId(getCellValue(currentRow.getCell(2)));
//							cellNo = 3;
//							employee.setWbsDescription(getCellValue(currentRow.getCell(3)));
//							cellNo = 4;
//							employee.setName(getCellValue(currentRow.getCell(4)));
//							employee.setFullName(getCellValue(currentRow.getCell(4)));
//							employee.setLastName(getCellValue(currentRow.getCell(4)));
//							cellNo = 5;
//							employee.setEmpId(getCellValue(currentRow.getCell(5)));
//							cellNo = 6;
//							employee.setFatherName(getCellValue(currentRow.getCell(6)));
//							cellNo = 7;
//							employee.setMotherName(getCellValue(currentRow.getCell(7)));
//							cellNo = 8;
//							employee.setGender(getCellValue(currentRow.getCell(8)));
//							cellNo = 9;
//							employee.setMaritalStatus(getCellValue(currentRow.getCell(9)));
//							cellNo = 10;
//							Date dobDate = currentRow.getCell(10) != null ? currentRow.getCell(10).getDateCellValue(): null;
//							if (dobDate != null) {
//								employee.setDob(DateUtil.convertToSQLDate(dobDate));
//							} 
//							cellNo = 11;
//							Date dojDate = currentRow.getCell(11) != null ? currentRow.getCell(11).getDateCellValue(): null;
//							if (dojDate != null) {
//								employee.setDoj(DateUtil.convertToSQLDate(dojDate));
//							}
//							cellNo = 12;
//							employee.setReligion(getCellValue(currentRow.getCell(12)));
//							cellNo = 13;
//							employee.setBloodGroup(getCellValue(currentRow.getCell(13)));
//							cellNo = 14;
//							employee.setPersonalIdentificationMark1(getCellValue(currentRow.getCell(14)));
//							cellNo = 15;
//							employee.setPersonalIdentificationMark2(getCellValue(currentRow.getCell(15)));
//							cellNo = 16;
//							employee.setMobile(getCellValue(currentRow.getCell(16)));
//							cellNo = 17;
//							employee.setEmergencyContactNumber(getCellValue(currentRow.getCell(17)));
//							cellNo = 18;
//							employee.setPresentAddress(getCellValue(currentRow.getCell(18)));
//							cellNo = 19;
//							employee.setPresentCity(getCellValue(currentRow.getCell(19)));
//							cellNo = 20;
//							employee.setPresentState(getCellValue(currentRow.getCell(20)));
//							cellNo = 21;
//							employee.setPermanentAddress(getCellValue(currentRow.getCell(21)));
//							cellNo = 22;
//							employee.setPermanentCity(getCellValue(currentRow.getCell(22)));
//							cellNo = 23;
//							employee.setPermanentState(getCellValue(currentRow.getCell(23)));
//							cellNo =24;
//							employee.setEducationalQulification(getCellValue(currentRow.getCell(24)));
//							cellNo = 25;
//							employee.setBoardInstitute(getCellValue(currentRow.getCell(25)));
//							cellNo = 26;
//							employee.setNomineeName(getCellValue(currentRow.getCell(26)));
//							cellNo = 27;
//							employee.setNomineeRelationship(getCellValue(currentRow.getCell(27)));
//							cellNo = 28;
//							employee.setNomineeContactNumber(getCellValue(currentRow.getCell(28)));
//							cellNo = 29;
//							String per = getCellValue(currentRow.getCell(29));
//							Double perDob = Double.parseDouble(per);
//							employee.setPercentage(perDob);
//							cellNo = 30;
//							employee.setEmployer(getCellValue(currentRow.getCell(30)));
//							cellNo = 31;
//							employee.setDesignation(getCellValue(currentRow.getCell(31)));
//							cellNo = 32;
//							employee.setAdharCardNumber(getCellValue(currentRow.getCell(32)));
//							cellNo = 33;
//							employee.setAccountNumber(getCellValue(currentRow.getCell(33)));
//							cellNo = 34;
//							employee.setIfscCode(getCellValue(currentRow.getCell(34)));
//							ZoneId  zone = ZoneId.of("Asia/Singapore");
//							ZonedDateTime zdt   = ZonedDateTime.of(LocalDateTime.now(), zone);
//							employee.setCreatedDate(zdt);
//							employee.setActive(Employee.ACTIVE_YES);
//							employee.setFaceAuthorised(false);
//							employee.setFaceIdEnrolled(false);
//							employee.setLeft(false);
//							employee.setRelieved(false);
//							employee.setReliever(false);
//                            employeeRepo.save(employee);
//						}
//					}
				} catch (IllegalStateException | NumberFormatException formatEx) {
					throw formatEx;
				} catch (Exception e) {
					String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
					log.error(msg, e);
					response.append(e.getMessage());
					response.append("--" + msg);
					response.append("--" + "Please correct the data format and retry again");
					if(importResult == null) {
						importResult = new ImportResult();
					}
					importResult.setStatus(FAILED);
					importResult.setMsg(response.toString());
					statusMap.put(fileKey, importResult);
					throw new Exception(response.toString());
				}
			}

		} catch (IOException e) {
			String msg = "Error while reading the employee data file for import";
			log.error(msg, e);
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		}  catch (IllegalStateException | NumberFormatException formatEx) {
			String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
			log.error(msg, formatEx);
			response.append(formatEx.getMessage());
			response.append("--" + msg);
			response.append("--" + "Please correct the data format and retry again");
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		}
		if(response.length() == 0) {
			response.append(SUCCESS_MESSAGE);
		}
		return response.toString();
	}

	

	public Employee isSkipDuplicate(String empId) {
		
		return employeeRepo.findByEmpId(empId);
		
//		Employee existingEmployeeWbs = employeeRepo.findByEmpIdandWbsId(empId,wbsId);
//		Employee exsistingEmployeeProjId = employeeRepo.findByEmpIdandProjId(empId,projId);
//		if(existingEmployeeWbs != null || exsistingEmployeeProjId != null) {
//			return true;
//		}else {
//			return false;
//		}
	 }
	
/**************************************************************************************************************************************/
	
	private void changeSiteEmployee(String path){

	    try{
	        FileInputStream excelFile = new FileInputStream(new File(path));
	        Workbook workbook = new XSSFWorkbook(excelFile);
	        Sheet datatypeSheet = workbook.getSheetAt(0);
	        int lastRow = datatypeSheet.getLastRowNum();
	        int r =1;
	        log.debug("Last Row number - "+r);
	        boolean canSave = true;
	        for (;r<=lastRow;r++){
	            log.debug("Current Row Number - "+lastRow);
                Row currentRow = datatypeSheet.getRow(r);
                EmployeeProjectSite employeeProjectSite =new EmployeeProjectSite();
                Long siteId = Long.valueOf(getCellValue(currentRow.getCell(0)));
                log.debug("Site id - "+siteId);
                String empId  = getCellValue(currentRow.getCell(1));
                log.debug("Employee id - "+empId);
                Long projectId= Long.valueOf(getCellValue(currentRow.getCell(2)));
                log.debug("Project id - "+projectId);

                Employee employee = employeeRepo.findByEmpId(empId);

                Site site = siteRepo.getOne(siteId);

                Project project = projectRepo.findOne(projectId);

                if(employee!=null){
//                    List<Ticket> tickets = ticketRepository.findByEmployee(employee.getId());
//                    log.debug("Ticket - "+tickets.size());
//                    if(tickets.size()>0){
//                        for (Ticket ticket : tickets){
//                            ticket.setSite(site);
//                            log.debug("Ticket site id after change - "+ticket.getSite().getId());
//                            Ticket ticket1 = ticketRepository.save(ticket);
//                            log.debug("Ticket after changing site Id - "+ticket1.getSite().getId());
//                        }
//                    }
                    employeeProjectSite.setProject(project);
                    employeeProjectSite.setSite(site);
                    employeeProjectSite.setEmployee(employee);
                    List<EmployeeProjectSite> employeeProjectSites = employee.getProjectSites();
//                    employeeProjectSites.clear();
                    log.debug("Employee project sites count - "+employeeProjectSites.size());
                    employeeProjectSites.add(employeeProjectSite);
                    log.debug("Employee project sites count after - "+employeeProjectSites.size());
                    log.debug("Employee project sites count after - "+site.getName() +" - "+project.getName());

                    employee.setProjectSites(employeeProjectSites);

//                    for(EmployeeProjectSite employeeProjectSite1:employeeProjectSites){
//                        log.debug("Employee - "+employeeProjectSite1.getProject().getName());
//                    }
                    employeeRepo.save(employee);

//                    log.debug("Employee found - "+employee.getName());
                }else{
                    log.debug("Employee null");
                }


            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void importInventoryMaster(String path) {
        try {

            FileInputStream excelFile = new FileInputStream(new File(path));
            Workbook workbook = new XSSFWorkbook(excelFile);
            Sheet datatypeSheet = workbook.getSheetAt(0);
            //Iterator<Row> iterator = datatypeSheet.iterator();
            int lastRow = datatypeSheet.getLastRowNum();
            int r = 1;

            log.debug("Last Row number -" + lastRow);
            for (; r <= lastRow; r++) {
                log.debug("Current Row number -" + r);
                Row currentRow = datatypeSheet.getRow(r);
                MaterialDTO materialDTO = new MaterialDTO();
                materialDTO.setName(getCellValue(currentRow.getCell(0)));
                materialDTO.setItemCode(getCellValue(currentRow.getCell(1)));
                materialDTO.setItemGroup(getCellValue(currentRow.getCell(2)));
                materialDTO.setUom(getCellValue(currentRow.getCell(3)).toUpperCase());
                materialDTO.setProjectId(Long.valueOf(getCellValue(currentRow.getCell(4))));
                materialDTO.setSiteId(Long.valueOf(getCellValue(currentRow.getCell(5))));
                materialDTO.setDescription(getCellValue(currentRow.getCell(6)));
                materialDTO.setMinimumStock(Long.valueOf(getCellValue(currentRow.getCell(7))));
                materialDTO.setMaximumStock(Long.valueOf(getCellValue(currentRow.getCell(7))));
                materialDTO.setStoreStock(Long.valueOf((getCellValue(currentRow.getCell(8)))));
                materialDTO.setManufacturerId(Long.valueOf(getCellValue(currentRow.getCell(9))));
                inventoryManagementService.createInventory(materialDTO);
            }

        } catch (FileNotFoundException e) {
            log.error("Error while reading the inventory data file for import", e);
        } catch (IOException e) {
            log.error("Error while reading the inventory data file for import", e);
        }

    }

	private String importEmployeeShiftMasterFromFile(String fileKey, String path) throws Exception {
		int r = 0;
		int cellNo = 0;
		StringBuffer response = new StringBuffer();
		ImportResult importResult = statusMap.get(fileKey);
		try {

			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			//Iterator<Row> iterator = datatypeSheet.iterator();
			int lastRow = datatypeSheet.getLastRowNum();
			r = 1;

			log.debug("Last Row number -" + lastRow);
			boolean canSave = true;
			for (; r <= lastRow; r++) {
				log.debug("Current Row number -" + r);
				try {
					Row currentRow = datatypeSheet.getRow(r);

					EmployeeShift shift = new EmployeeShift();
					canSave = true;
					cellNo = 1;
					//Project newProj = projectRepo.findOne(Long.valueOf(getCellValue(currentRow.getCell(0))));
					Site site = siteRepo.findOne(Long.valueOf(getCellValue(currentRow.getCell(1))));
					cellNo = 2;
					String empId = getCellValue(currentRow.getCell(2));
					Employee employee = employeeRepo.findByEmpId(empId);
					shift.setEmployee(employee);
					shift.setSite(site);
					//String startTime = getCellValue(currentRow.getCell(4));
					try {
						cellNo = 4;
						shift.setStartTime(DateUtil.convertToTimestamp(currentRow.getCell(4).getDateCellValue()));
					}catch (IllegalStateException ise) {
						canSave = false;
						log.error("Error while reading the shift start time from the file", ise);
					}
					//String endTime = getCellValue(currentRow.getCell(5));
					try {
						cellNo = 5;
						shift.setEndTime(DateUtil.convertToTimestamp(currentRow.getCell(5).getDateCellValue()));
					}catch (IllegalStateException ise) {
						canSave = false;
						log.error("Error while reading the shift end time from the file", ise);
					}
					// email, phone number missing
					ZoneId  zone = ZoneId.of("Asia/Singapore");
					ZonedDateTime zdt   = ZonedDateTime.of(LocalDateTime.now(), zone);
					shift.setCreatedDate(zdt);
					shift.setActive(Employee.ACTIVE_YES);
					if(canSave) {
						empShiftRepo.saveAndFlush(shift);
					}

					log.debug("Created Information for EmployeeShift: {}", shift);
				} catch (IllegalStateException | NumberFormatException formatEx) {
					throw formatEx;
				} catch (Exception e) {
					String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
					log.error(msg, e);
					response.append(e.getMessage());
					response.append("--" + msg);
					response.append("--" + "Please correct the data format and retry again");
					if(importResult == null) {
						importResult = new ImportResult();
					}
					importResult.setStatus(FAILED);
					importResult.setMsg(response.toString());
					statusMap.put(fileKey, importResult);
					throw new Exception(response.toString());
				}

			/*}*/
			}

		} catch (FileNotFoundException e) {
			log.error("Error while reading the employee shift data file for import", e);
		} catch (IOException e) {
			String msg = "Error while reading the employee shift data file for import";
			log.error(msg, e);
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		} catch (IllegalStateException | NumberFormatException formatEx) {
			String msg = "Error while getting values from row - " + (r+1) + " - cell - "+ (cellNo+1);
			log.error(msg, formatEx);
			response.append(formatEx.getMessage());
			response.append("--" + msg);
			response.append("--" + "Please correct the data format and retry again");
			if(importResult == null) {
				importResult = new ImportResult();
			}
			importResult.setStatus(FAILED);
			importResult.setMsg(response.toString());
			statusMap.put(fileKey, importResult);
			throw new Exception(response.toString());
		}
		if(response.length() == 0) {
			response.append(SUCCESS_MESSAGE);
		}
		return response.toString();
	}

    public ImportResult importInventoryMaster(MultipartFile file, long dateTime, boolean isMaterialTransaction, boolean isMaterialIndent) throws Exception {
        String fileName = dateTime + ".xlsx";
        String filePath = env.getProperty(NEW_IMPORT_FOLDER) + SEPARATOR +  INVENTORY_FOLDER;
        String uploadedFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
        String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER) + SEPARATOR +  INVENTORY_FOLDER;
        String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
        if(statusMap.containsKey(fileKey)) {
            String status = String.valueOf(statusMap.get(fileKey));
            log.debug("Current status for filename -"+fileKey+", status -" + status);
        }else {
//            statusMap.put(fileKey, "PROCESSING");
        }
        if(isMaterialTransaction) {
            importNewFiles("inventoryTransaction",filePath, fileName, targetFilePath);
        }else if(isMaterialIndent) {
            importNewFiles("inventoryIndent",filePath, fileName, targetFilePath);
        }else {
            importNewFiles("inventory",filePath, fileName, targetFilePath);
        }
        ImportResult result = new ImportResult();
        result.setFile(fileKey);
        result.setStatus("PROCESSING");
        return result;
    }

    private int currentCell;

    private String getCellValue(Cell cell) {
		String value = null;
		if(cell != null) {
			switch(cell.getCellType()) {
				case HSSFCell.CELL_TYPE_BLANK:
		        case HSSFCell.CELL_TYPE_ERROR:
		            // ignore all blank or error cells
		            break;
		        case HSSFCell.CELL_TYPE_NUMERIC:
		        		value = Long.toString((long)cell
		                    .getNumericCellValue());
		            break;
		        case HSSFCell.CELL_TYPE_BOOLEAN:
		        	value = Boolean.toString(cell
		                    .getBooleanCellValue());
		            break;
		        case HSSFCell.CELL_TYPE_STRING:
		        default:
		        	value = cell.getStringCellValue();
		            break;
			}
		}
		currentCell ++;
		return value;
	}
 
	private boolean isDuplicateCode(String code, long siteId) {
	    String assetCode = siteId+"_"+code;
        List<Asset> asset = assetRepository.findAssetCodeBySite(siteId, assetCode);
        if(asset.size() > 0) {
            return true;
        }
	    return false;
    }

}
