package com.ts.app.service.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FilenameFilter;
import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;
import java.util.concurrent.ConcurrentHashMap;

import javax.inject.Inject;
import javax.transaction.Transactional;

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
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.EmployeeShift;
import com.ts.app.domain.JobStatus;
import com.ts.app.domain.JobType;
import com.ts.app.domain.Location;
import com.ts.app.domain.Project;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.EmployeeShiftRepository;
import com.ts.app.repository.LocationRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.repository.UserRoleRepository;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.ChecklistService;
import com.ts.app.service.JobManagementService;
import com.ts.app.service.SiteLocationService;
import com.ts.app.service.UserService;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ChecklistDTO;
import com.ts.app.web.rest.dto.ChecklistItemDTO;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.JobChecklistDTO;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.LocationDTO;
import com.ts.app.web.rest.dto.ProjectDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.SiteDTO;
import com.ts.app.web.rest.dto.UserDTO;
import com.ts.app.web.rest.errors.TimesheetException;


@Component
@Transactional
public class ImportUtil {

	private static final Logger log = LoggerFactory.getLogger(ImportUtil.class);

	private static final String NEW_IMPORT_FOLDER = "import.file.path.new";
	private static final String JOB_FOLDER = "job";
	private static final String EMPLOYEE_FOLDER = "employee";
	private static final String CHECKLIST_FOLDER = "checklist";
	private static final String EMP_SHIFT_FOLDER = "empshift";
	private static final String CLIENT_FOLDER = "client";
	private static final String SITE_FOLDER = "site";
	private static final String LOCATION_FOLDER = "location";
	private static final String COMPLETED_IMPORT_FOLDER = "import.file.path.completed";
	private static final String SEPARATOR = System.getProperty("file.separator");

	private static final Map<String,String> statusMap = new ConcurrentHashMap<String,String>();
	
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
	private ChecklistService checklistService;
	
	@Inject
	private Environment env;
	
	@Inject
	private EmployeeShiftRepository empShiftRepo;
	
	
	public ImportResult importJobData(MultipartFile file, long dateTime) {
        String fileName = dateTime + ".xlsx";
		String filePath = env.getProperty(NEW_IMPORT_FOLDER) + SEPARATOR +  JOB_FOLDER;
		String uploadedFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
		String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER) + SEPARATOR +  JOB_FOLDER;
		String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
		if(statusMap.containsKey(fileKey)) {
			String status = statusMap.get(fileKey);
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			statusMap.put(fileKey, "PROCESSING");
		}
		importNewFiles("job",filePath, fileName, targetFilePath);
		ImportResult result = new ImportResult();
		result.setFile(fileKey);
		result.setStatus("PROCESSING");
		return result;
	}
	
	public ImportResult importClientData(MultipartFile file, long dateTime) {
        String fileName = dateTime + ".xlsx";
		String filePath = env.getProperty(NEW_IMPORT_FOLDER) + SEPARATOR +  CLIENT_FOLDER;
		String uploadedFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
		String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER) + SEPARATOR +  CLIENT_FOLDER;
		String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
		if(statusMap.containsKey(fileKey)) {
			String status = statusMap.get(fileKey);
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			statusMap.put(fileKey, "PROCESSING");
		}
		importNewFiles("client",filePath, fileName, targetFilePath);
		ImportResult result = new ImportResult();
		result.setFile(fileKey);
		//result.setStatus(getImportStatus(fileKey));
		result.setStatus("PROCESSING");
		return result;
	}
	
	public ImportResult importSiteData(MultipartFile file, long dateTime) {
        String fileName = dateTime + ".xlsx";
		String filePath = env.getProperty(NEW_IMPORT_FOLDER) + SEPARATOR +  SITE_FOLDER;
		String uploadedFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
		String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER) + SEPARATOR +  SITE_FOLDER;
		String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
		if(statusMap.containsKey(fileKey)) {
			String status = statusMap.get(fileKey);
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			statusMap.put(fileKey, "PROCESSING");
		}
		importNewFiles("site",filePath, fileName, targetFilePath);
		ImportResult result = new ImportResult();
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
		if(statusMap.containsKey(fileKey)) {
			String status = statusMap.get(fileKey);
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			statusMap.put(fileKey, "PROCESSING");
		}
		importNewFiles("location",filePath, fileName, targetFilePath);
		ImportResult result = new ImportResult();
		result.setFile(fileKey);
		result.setStatus("PROCESSING");
		return result;
	}
	
	public ImportResult importEmployeeData(MultipartFile file, long dateTime) {
        String fileName = dateTime + ".xlsx";
		String filePath = env.getProperty(NEW_IMPORT_FOLDER) + SEPARATOR +  EMPLOYEE_FOLDER;
		String uploadedFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
		String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER) + SEPARATOR +  EMPLOYEE_FOLDER;
		String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
		if(statusMap.containsKey(fileKey)) {
			String status = statusMap.get(fileKey);
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			statusMap.put(fileKey, "PROCESSING");
		}
		importNewFiles("employee",filePath, fileName, targetFilePath);
		ImportResult result = new ImportResult();
		result.setFile(fileKey);
		result.setStatus("PROCESSING");
		return result;

	}
	
	public ImportResult importChecklistData(MultipartFile file, long dateTime) {
        String fileName = dateTime + ".xlsx";
		String filePath = env.getProperty(NEW_IMPORT_FOLDER) + SEPARATOR +  CHECKLIST_FOLDER;
		String uploadedFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
		String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER) + SEPARATOR +  CHECKLIST_FOLDER;
		String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
		if(statusMap.containsKey(fileKey)) {
			String status = statusMap.get(fileKey);
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			statusMap.put(fileKey, "PROCESSING");
		}
		importNewFiles("checklist",filePath, fileName, targetFilePath);
		ImportResult result = new ImportResult();
		result.setFile(fileKey);
		result.setStatus("PROCESSING");
		return result;

	}
	
	public ImportResult importEmployeeShiftData(MultipartFile file, long dateTime) {
        String fileName = dateTime + ".xlsx";
		String filePath = env.getProperty(NEW_IMPORT_FOLDER) + SEPARATOR +  EMP_SHIFT_FOLDER;
		String uploadedFileName = fileUploadHelper.uploadJobImportFile(file, filePath, fileName);
		String targetFilePath = env.getProperty(COMPLETED_IMPORT_FOLDER) + SEPARATOR +  EMP_SHIFT_FOLDER;
		String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
		if(statusMap.containsKey(fileKey)) {
			String status = statusMap.get(fileKey);
			log.debug("Current status for filename -"+fileKey+", status -" + status);
		}else {
			statusMap.put(fileKey, "PROCESSING");
		}
		importNewFiles("employeeshift",filePath, fileName, targetFilePath);
		ImportResult result = new ImportResult();
		result.setFile(fileKey);
		result.setStatus("PROCESSING");
		return result;

	}
	
	@Async
	private void importNewFiles(String domain, String sourceFilePath,String fileName, String targetFilePath) {
		// get new files in the imports folder
		//FilenameFilter filter = new ExcelFilenameFilter(".xlsx");
		//File[] files = new File(sourceFilePath).listFiles(filter);

		//for (File fileObj : files) {
		String fileKey = fileName.substring(0, fileName.indexOf(".xlsx"));
		
			File fileObj = new File(sourceFilePath + SEPARATOR +  fileName);
			if (fileObj.isFile()) {
				switch(domain) {
					case "job" :
						importJobFromFile(fileObj.getPath());
						break;
					case "employee":
						importEmployeeFromFile(fileObj.getPath());
						break;
					case "client" :
						importClientFromFile(fileObj.getPath());
						break;
					case "site" :
						importSiteFromFile(fileObj.getPath());
						break;
					case "location" :
						importLocationFromFile(fileObj.getPath());
						break;
					case "checklist" :
						importChecklistFromFile(fileObj.getPath());
						break;
					case "employeeshift" :
						importEmployeeShiftMasterFromFile(fileObj.getPath());
						break;
						
				}
				statusMap.put(fileKey, "COMPLETED");
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
		//}
		//result.setEmpId(empId);
	}
	
	public String getImportStatus(String fileName) {
		String status = "";
		log.debug("statusMap -" + statusMap);
		if(statusMap != null) {
			if(statusMap.containsKey(fileName)) {
				status = statusMap.get(fileName);
				if(status.equals("COMPLETED") || status.equals("FAILED")) {
					statusMap.remove(fileName);
				}
			}
		}
		log.debug("status for fileName -" + fileName +" , status -" +status);
		return status;
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


	private void importJobFromFile(String path) {
		try {
			log.debug("JobFromFile -" + path);
			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			Iterator<Row> iterator = datatypeSheet.iterator();
			int lastRow = datatypeSheet.getLastRowNum();
			int r = 0;
			Row projectRow = datatypeSheet.getRow(r);
			long projectId = (long) projectRow.getCell(2).getNumericCellValue();
			r++;
			Row siteRow = datatypeSheet.getRow(r);
			long siteId = (long) siteRow.getCell(2).getNumericCellValue();
			r++;
			Row managerRow = datatypeSheet.getRow(r);
			String managerId = String.valueOf(managerRow.getCell(2).getNumericCellValue());
			String supervisorId = String.valueOf(managerRow.getCell(5).getNumericCellValue());
			r = 4;
			for (; r <= lastRow; r++) {
				log.debug("Current Row number -" + r);
				Row currentRow = datatypeSheet.getRow(r);
				JobDTO jobDto = new JobDTO();
				jobDto.setTitle(currentRow.getCell(1).getStringCellValue());
				jobDto.setDesc(currentRow.getCell(1).getStringCellValue());
				jobDto.setSiteId(siteId);
				String location = currentRow.getCell(2).getStringCellValue();
				Location loc = locationRepo.findByName(location);
				if (loc == null) {
					loc = new Location();
					loc.setName(location);
					loc.setActive("Y");
					loc = locationRepo.save(loc);
				}
				jobDto.setLocationId(loc.getId());
				String jobType = currentRow.getCell(3).getStringCellValue();
				String empId = null;
				log.debug("cell type =" + currentRow.getCell(5).getCellType());
				if (currentRow.getCell(5).getCellType() == CellFormatType.NUMBER.ordinal()) {
					try {
						empId = String.valueOf(currentRow.getCell(5).getNumericCellValue());
					} catch (IllegalStateException ise) {
						empId = currentRow.getCell(5).getStringCellValue();
					}
				} else {
					try {
						empId = currentRow.getCell(5).getStringCellValue();
					} catch (IllegalStateException ise) {
						empId = String.valueOf(currentRow.getCell(5).getNumericCellValue());
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
					String schedule = currentRow.getCell(6).getStringCellValue();
					jobDto.setSchedule(schedule);
					Date startDate = currentRow.getCell(7).getDateCellValue();
					Date startTime = currentRow.getCell(9).getDateCellValue();
					Date endDate = currentRow.getCell(8).getDateCellValue();
					Date endTime = currentRow.getCell(10).getDateCellValue();
					jobDto.setPlannedStartTime(DateUtil.convertToDateTime(startDate, startTime));
					jobDto.setPlannedEndTime(DateUtil.convertToDateTime(startDate, endTime));
					jobDto.setScheduleEndDate(DateUtil.convertToDateTime(endDate, endTime));
					jobDto.setFrequency(currentRow.getCell(11).getStringCellValue());
					jobDto.setActive("Y");
					if(currentRow.getCell(12) != null) {
						String checkListName = currentRow.getCell(12).getStringCellValue();
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
									jobChecklistDto.setChecklistItemName(checklistItemDto.getName());
									jobCheckListItems.add(jobChecklistDto);
								}
								jobDto.setChecklistItems(jobCheckListItems);
							}
						}
					}
					jobService.saveJob(jobDto);

				}
			}

		} catch (FileNotFoundException e) {
			log.error("Error while reading the job data file for import", e);
		} catch (IOException e) {
			log.error("Error while reading the job data file for import", e);
		}
	}
	
	
	private void importClientFromFile(String path) {
		try {

			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			int lastRow = datatypeSheet.getLastRowNum();
			int r = 1;
			for (; r <= lastRow; r++) {
				log.debug("Current Row number -" + r);
				Row currentRow = datatypeSheet.getRow(r);
				ProjectDTO projectDto = new ProjectDTO();
				projectDto.setName(currentRow.getCell(0).getStringCellValue());
				projectDto.setContactFirstName(currentRow.getCell(1).getStringCellValue());
				projectDto.setContactLastName(currentRow.getCell(2).getStringCellValue());
				projectDto.setPhone(String.valueOf(currentRow.getCell(3).getStringCellValue()));
				projectDto.setEmail(currentRow.getCell(4).getStringCellValue());
				projectDto.setAddress(currentRow.getCell(5).getStringCellValue());
				projectDto.setUserId(SecurityUtils.getCurrentUserId());
				if (CollectionUtils.isEmpty(projectRepo.findAllByName(projectDto.getName()))){
						Project project = mapperUtil.toEntity(projectDto, Project.class);
						project.setActive(Project.ACTIVE_YES);
						project = projectRepo.save(project);
				}
			}

		} catch (FileNotFoundException e) {
			log.error("Error while reading the job data file for import", e);
		} catch (IOException e) {
			log.error("Error while reading the job data file for import", e);
		}
	}
	
	private void importSiteFromFile(String path) {
		try {

			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			Iterator<Row> iterator = datatypeSheet.iterator();
			int lastRow = datatypeSheet.getLastRowNum();
			int r = 1;
			for (; r < lastRow; r++) {
				log.debug("Current Row number -" + r+"Last Row : "+lastRow);
				Row currentRow = datatypeSheet.getRow(r);
				log.debug("cell type =" + currentRow.getCell(0).getStringCellValue()+"\t"+currentRow.getCell(9).getStringCellValue());
				SiteDTO siteDTO = new SiteDTO();
				siteDTO.setProjectId(Long.valueOf(currentRow.getCell(0).getStringCellValue()));
				siteDTO.setName(currentRow.getCell(0).getStringCellValue());
				siteDTO.setAddressLat(Double.valueOf(currentRow.getCell(7).getStringCellValue()));
				siteDTO.setAddressLng(Double.valueOf(currentRow.getCell(8).getStringCellValue()));
				siteDTO.setRadius(Double.valueOf(currentRow.getCell(9).getStringCellValue()));
				siteDTO.setAddress(currentRow.getCell(6).getStringCellValue());
				siteDTO.setUserId(SecurityUtils.getCurrentUserId());
				Site site = mapperUtil.toEntity(siteDTO, Site.class);
		        site.setActive(Site.ACTIVE_YES);
				site = siteRepo.save(site);
				log.debug("Created Information for Site: {}", site);
				//update the site location by calling site location service
				siteLocationService.save(site.getUser().getId(), site.getId(), site.getAddressLat(), site.getAddressLng(), site.getRadius());
				
				}
			
		} catch (FileNotFoundException e) {
			log.error("Error while reading the job data file for import", e);
		} catch (IOException e) {
			log.error("Error while reading the job data file for import", e);
		}
	}
	
	private void importLocationFromFile(String path) {
		try {

			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			Iterator<Row> iterator = datatypeSheet.iterator();
			int lastRow = datatypeSheet.getLastRowNum();
			int r = 1;
			for (; r < lastRow; r++) {
				log.debug("Current Row number -" + r+"Last Row : "+lastRow);
				Row currentRow = datatypeSheet.getRow(r);
				LocationDTO locationDTO = new LocationDTO();
				locationDTO.setProjectId(Long.valueOf(currentRow.getCell(1).getStringCellValue()));
				locationDTO.setSiteId(Long.valueOf(currentRow.getCell(3).getStringCellValue()));
				locationDTO.setBlock(currentRow.getCell(5).getStringCellValue());
				locationDTO.setFloor(currentRow.getCell(6).getStringCellValue());
				locationDTO.setZone(currentRow.getCell(8).getStringCellValue());
				Location loc = mapperUtil.toEntity(locationDTO, Location.class);
		        loc.setActive(Site.ACTIVE_YES);
				loc = locationRepo.save(loc);
				log.debug("Created Information for Location: {}", loc);
			}
			
		} catch (FileNotFoundException e) {
			log.error("Error while reading the location data file for import", e);
		} catch (IOException e) {
			log.error("Error while reading the location data file for import", e);
		}
	}
	
	
	private void importChecklistFromFile(String path) {
		// TODO Auto-generated method stub		
		try{
			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			Iterator<Row> iterator = datatypeSheet.iterator();
			int lastRow = datatypeSheet.getLastRowNum();
			int r = 1;
			for (; r <= lastRow; r++) {
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
				try {
					createdChecklist = checklistService.createChecklistInformation(checklistDTO);
				}catch (Exception e) {
					e.getMessage();
					String msg = "Error while creating checklist, please check the information";
					throw new TimesheetException(e, checklistDTO);

				}
				
			}
			
		}catch (FileNotFoundException e) {
			// TODO: handle exception
			log.error("Error while reading the job data file for import", e);
		} catch(IOException e){
			log.error("Error while reading the job data file for import", e);
		}
		
		
	}

	
	private void importEmployeeFromFile(String path) {
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
				Employee employee = new Employee();
				
				/*Employee existingEmployee = employeeRepo.findByEmpId(currentRow.getCell(2).getStringCellValue().trim());
				log.debug("Employee obj =" + existingEmployee);
				&& existingEmployee.getActive().equals(Employee.ACTIVE_NO
				if(existingEmployee!=null){
					log.debug("*************Existing Employee");
					
				}
				else {*/
				Project newProj = projectRepo.findOne(Long.valueOf(getCellValue(currentRow.getCell(0))));
				Site newSite = siteRepo.findOne(Long.valueOf(getCellValue(currentRow.getCell(1))));
				employee.setEmpId(getCellValue(currentRow.getCell(2)));
				employee.setName(getCellValue(currentRow.getCell(3)));
				employee.setFullName(getCellValue(currentRow.getCell(3)));
				employee.setLastName(getCellValue(currentRow.getCell(4)));
				employee.setPhone(getCellValue(currentRow.getCell(5)));
				employee.setEmail(getCellValue(currentRow.getCell(6)));
				employee.setDesignation(getCellValue(currentRow.getCell(7)));
				// email, phone number missing
				ZoneId  zone = ZoneId.of("Asia/Singapore");
				ZonedDateTime zdt   = ZonedDateTime.of(LocalDateTime.now(), zone);
				employee.setCreatedDate(zdt);
				employee.setActive(Employee.ACTIVE_YES);
				if(StringUtils.isNotEmpty(getCellValue(currentRow.getCell(8)))) {
					Employee manager =  employeeRepo.findOne(Long.valueOf(getCellValue(currentRow.getCell(8))));
					employee.setManager(manager);
		        }
				List<Project> projects = new ArrayList<Project>();
				projects.add(newProj);
				List<Site> sites = new ArrayList<Site>();
				sites.add(newSite);
				employee.setFaceAuthorised(false);
				employee.setFaceIdEnrolled(false);
				employee.setLeft(false);
				employee.setRelieved(false);
				employee.setReliever(false);
				List<EmployeeProjectSite> projectSites = new ArrayList<EmployeeProjectSite>();
				EmployeeProjectSite projectSite = new EmployeeProjectSite();
				/*
				projectSite.setProjectId(newProj.getId());
				projectSite.setProjectName(newProj.getName());
				projectSite.setSiteId(newSite.getId());
				projectSite.setSiteName(newSite.getName());
				*/
				projectSite.setProject(newProj);
				projectSite.setSite(newSite);
				projectSite.setEmployee(employee);
				projectSites.add(projectSite);
				employee.setProjectSites(projectSites);
				
				employeeRepo.save(employee);
				//create user if opted.
				String createUser = getCellValue(currentRow.getCell(9));
				long userRoleId = Long.parseLong(getCellValue(currentRow.getCell(10)));
				UserDTO user = new UserDTO();
				if(StringUtils.isNotEmpty(createUser) && createUser.equalsIgnoreCase("Y") && userRoleId > 0) {
					user.setLogin(employee.getEmpId());
					user.setPassword(employee.getEmpId());
					user.setFirstName(employee.getName());
					user.setLastName(employee.getLastName());
					user.setAdminFlag("N");
					user.setUserRoleId(userRoleId);
					user.setEmployeeId(employee.getId());
					user.setActivated(true);
					user.setEmail(currentRow.getCell(6).getStringCellValue());
					user = userService.createUserInformation(user);
					User userObj = userRepository.findOne(user.getId());
					employee.setUser(userObj);
					employeeRepo.save(employee);
				}
				log.debug("Created Information for Employee: {}", employee);
				
			/*}*/
			}

		} catch (FileNotFoundException e) {
			log.error("Error while reading the job data file for import", e);
		} catch (IOException e) {
			log.error("Error while reading the job data file for import", e);
		}
	}	
	
	private void importEmployeeShiftMasterFromFile(String path) {
		try {

			FileInputStream excelFile = new FileInputStream(new File(path));
			Workbook workbook = new XSSFWorkbook(excelFile);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			//Iterator<Row> iterator = datatypeSheet.iterator();
			int lastRow = datatypeSheet.getLastRowNum();
			int r = 1;
			
			log.debug("Last Row number -" + lastRow);
			boolean canSave = true;
			for (; r <= lastRow; r++) {
				log.debug("Current Row number -" + r);
				Row currentRow = datatypeSheet.getRow(r);
				
				EmployeeShift shift = new EmployeeShift();
				canSave = true;
				
				//Project newProj = projectRepo.findOne(Long.valueOf(getCellValue(currentRow.getCell(0))));
				Site site = siteRepo.findOne(Long.valueOf(getCellValue(currentRow.getCell(1))));
				String empId = getCellValue(currentRow.getCell(2));
				Employee employee = employeeRepo.findByEmpId(empId);
				shift.setEmployee(employee);
				shift.setSite(site);
				//String startTime = getCellValue(currentRow.getCell(4));
				try {
					shift.setStartTime(DateUtil.convertToTimestamp(currentRow.getCell(4).getDateCellValue()));
				}catch (IllegalStateException ise) {
					canSave = false;
					log.error("Error while reading the shift start time from the file", ise);
				}
				//String endTime = getCellValue(currentRow.getCell(5));
				try {
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
				
			/*}*/
			}

		} catch (FileNotFoundException e) {
			log.error("Error while reading the employee shift data file for import", e);
		} catch (IOException e) {
			log.error("Error while reading the employee shift data file for import", e);
		} catch (Exception e) {
			log.error("Error while reading the employee shift data file for import", e);
		}
	}	
	
	private String getCellValue(Cell cell) {
		String value = null;
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
		return value;
	}

}
