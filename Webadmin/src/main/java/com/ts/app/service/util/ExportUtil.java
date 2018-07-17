package com.ts.app.service.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.inject.Inject;
import javax.transaction.Transactional;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.EmployeeAttendanceReport;
import com.ts.app.domain.Job;
import com.ts.app.domain.JobStatus;
import com.ts.app.domain.Ticket;
import com.ts.app.web.rest.dto.AttendanceDTO;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.EmployeeDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.ReportResult;
import com.ts.app.web.rest.dto.TicketDTO;

@Component
@Transactional
public class ExportUtil {

	private static final Logger log = LoggerFactory.getLogger(ExportUtil.class);

	// Delimiter used in CSV file
	private static final String NEW_LINE_SEPARATOR = "\r";

	// CSV file header
	private static final Object[] FILE_HEADER = { "ID", "TITLE", "DATE", "COMPLETED TIME", "SITE", "LOCATION" };
	private static final Object[] JOB_DETAIL_REPORT_FILE_HEADER = { "SITE", "TITLE", "DESCRIPTION", "EMPLOYEE", "TYPE",
			"PLANNED START TIME", "COMPLETED TIME", "STATUS", "TICKET_ID", "TICKET DESCRIPTION" };
	private static final Object[] CONSOLIDATED_REPORT_FILE_HEADER = { "SITE", "LOCATION", "ASSIGNED JOBS",
			"COMPLETED JOBS", "OVERDUE JOBS", "TAT" };
	private static final Object[] DETAIL_REPORT_FILE_HEADER = { "SITE", "DATE", "EMPLOYEE ID", "EMPLOYEE NAME",
			"CHECK IN TIME", "CHECK OUT TIME" };
	private static final Object[] EMPLOYEE_DETAIL_REPORT_FILE_HEADER = { "EMPLOYEE ID", "EMPLOYEE NAME", "DESIGNATION",
			"REPORTING TO", "CLIENT", "SITE", "ACTIVE" };
	private static final Object[] ATTENDANCE_DETAIL_REPORT_FILE_HEADER = { "EMPLOYEE ID", "EMPLOYEE NAME", "SITE",
			"CLIENT", "STATUS", "CHECK IN", "CHECK OUT", "SHIFT START", "SHIFT END" };

	private String[] EMP_HEADER = { "EMPLOYEE ID", "EMPLOYEE NAME", "DESIGNATION", "REPORTING TO", "CLIENT", "SITE",
			"ACTIVE" };
	private String[] JOB_HEADER = { "SITE", "TITLE", "DESCRIPTION", "TICKET ID", "TICKET TITLE", "EMPLOYEE", "TYPE", "PLANNED START TIME", "COMPLETED TIME",
			"STATUS" };
	private String[] ATTD_HEADER = { "EMPLOYEE ID", "EMPLOYEE NAME", "SITE", "CLIENT", "CHECK IN", "CHECK OUT",
			 "SHIFT CONTINUED", "LATE CHECK IN" };
	private String[] TICKET_HEADER = { "ID", "SITE", "ISSUE", "DESCRIPTION","STATUS", "PENDING STATUS","CATEGORY", "SEVERITY", "INITIATOR",
			"INITIATED ON", "ASSIGNED TO", "ASSIGNED ON", "CLOSED BY", "CLOSED ON" };

	@Inject
	private Environment env;

	private static final Map<String, String> statusMap = new ConcurrentHashMap<String, String>();

	private Lock lock;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	public ExportResult writeConsolidatedJobReportToFile(String projName, List<ReportResult> content,
			final String empId, ExportResult result) {
		boolean isAppend = false;
		// boolean isAppend = (result != null);
		log.debug("result = " + result + ", isAppend=" + isAppend);
		if (result == null) {
			result = new ExportResult();
		}
		// Create the CSVFormat object with "\n" as a record delimiter
		CSVFormat csvFileFormat = CSVFormat.DEFAULT.withRecordSeparator(NEW_LINE_SEPARATOR).withDelimiter(',');
		String fileName = null;
		log.debug("result file name - " + result.getFile());
		if (StringUtils.isEmpty(result.getFile())) {
			if (StringUtils.isNotEmpty(empId)) {
				fileName = empId + System.currentTimeMillis() + ".csv";
			} else if (StringUtils.isNotEmpty(projName)) {
				fileName = projName + "_" + System.currentTimeMillis() + ".csv";
			}
		} else {
			fileName = result.getFile() + ".csv";
		}
		log.debug("result file name - " + fileName);
		if (statusMap.containsKey(fileName)) {
			String status = statusMap.get(fileName);
			log.debug("Current status for filename -" + fileName + ", status -" + status);
		} else {
			statusMap.put(fileName, "PROCESSING");
		}
		final String exportFileName = fileName;

		if (lock == null) {
			lock = new Lock();
		}
		try {
			lock.lock();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		log.debug("export util - aquired lock");

		Thread writerThread = new Thread(new Runnable() {

			FileWriter fileWriter = null;
			CSVPrinter csvFilePrinter = null;

			@Override
			public void run() {
				// TODO Auto-generated method stub
				String filePath = env.getProperty("export.file.path");
				FileSystem fileSystem = FileSystems.getDefault();
				if (StringUtils.isNotEmpty(empId)) {
					filePath += "/" + empId;
				}
				Path path = fileSystem.getPath(filePath);
				// path = path.resolve(String.valueOf(empId));
				if (!Files.exists(path)) {
					Path newEmpPath = Paths.get(filePath);
					try {
						Files.createDirectory(newEmpPath);
					} catch (IOException e) {
						log.error("Error while creating path " + newEmpPath);
					}
				}
				filePath += "/" + exportFileName;
				try {
					// initialize FileWriter object
					log.debug("filePath = " + filePath + ", isAppend=" + isAppend);
					fileWriter = new FileWriter(filePath, isAppend);
					String siteName = null;

					// initialize CSVPrinter object
					csvFilePrinter = new CSVPrinter(fileWriter, csvFileFormat);
					if (!isAppend) {
						// Create CSV file header
						csvFilePrinter.printRecord(CONSOLIDATED_REPORT_FILE_HEADER);
					}
					for (ReportResult transaction : content) {
						if (StringUtils.isEmpty(siteName) || !siteName.equalsIgnoreCase(transaction.getSiteName())) {
							csvFilePrinter.printRecord("");
							csvFilePrinter
									.printRecord("CLIENT - " + projName + "  SITE - " + transaction.getSiteName());
						}
						List record = new ArrayList();
						log.debug("Writing transaction record for site :" + transaction.getSiteName());
						record.add(transaction.getSiteName());
						record.add(transaction.getLocatinName());
						record.add(transaction.getAssignedJobCount());
						record.add(transaction.getCompletedJobCount());
						record.add(transaction.getOverdueJobCount());
						record.add(transaction.getTat());
						csvFilePrinter.printRecord(record);
					}
					log.info(exportFileName + " CSV file was created successfully !!!");
					statusMap.put(exportFileName, "COMPLETED");
				} catch (Exception e) {
					log.error("Error in CsvFileWriter !!!");
					statusMap.put(exportFileName, "FAILED");
				} finally {
					try {
						fileWriter.flush();
						fileWriter.close();
						csvFilePrinter.close();
					} catch (IOException e) {
						log.error("Error while flushing/closing fileWriter/csvPrinter !!!");
						statusMap.put(exportFileName, "FAILED");
					}
				}
				lock.unlock();
			}

		});
		writerThread.start();
		log.debug("started writer thread");

		result.setEmpId(empId);
		result.setFile(fileName.substring(0, fileName.indexOf('.')));
		result.setStatus(getExportStatus(fileName));
		return result;
	}

	// @Async

	public ExportResult writeJobReportToFile(List<Job> content, ExportResult result) {
		List<JobDTO> jobs = new ArrayList<JobDTO>();
		for (Job job : content) {
			JobDTO jobDto = new JobDTO();
			Hibernate.initialize(job.getSite());
			jobDto.setSiteName(job.getSite().getName());
			jobDto.setTitle(job.getTitle());
			jobDto.setDescription(job.getDescription());
			Hibernate.initialize(job.getEmployee());
			jobDto.setEmployeeName(job.getEmployee().getName());
			jobDto.setJobType(job.getType());
			jobDto.setPlannedStartTime(job.getPlannedStartTime());
			jobDto.setActualEndTime(job.getActualEndTime());
			jobDto.setJobStatus(job.getStatus());
			Hibernate.initialize(job.getTicket());
			Ticket ticket = job.getTicket();
			if(ticket != null) {
				jobDto.setTicketId(ticket.getId());
				jobDto.setTicketName(ticket.getTitle());
			}
			jobs.add(jobDto);
		}
		return writeJobReportToFile(jobs, null, result);
	}

	public ExportResult writeJobReportToFile(List<JobDTO> content, final String empId, ExportResult result) {
		boolean isAppend = (result != null);
		log.debug("result = " + result + ", isAppend=" + isAppend);
		if (result == null) {
			result = new ExportResult();
		}
		// Create the CSVFormat object with "\n" as a record delimiter
		CSVFormat csvFileFormat = CSVFormat.DEFAULT.withRecordSeparator(NEW_LINE_SEPARATOR).withDelimiter(',');
		String fileName = null;
		if (StringUtils.isEmpty(result.getFile())) {
			if (StringUtils.isNotEmpty(empId)) {
				fileName = empId + System.currentTimeMillis() + ".csv";
			} else {
				fileName = System.currentTimeMillis() + ".csv";
			}
		} else {
			fileName = result.getFile() + ".csv";
		}
		if (statusMap.containsKey(fileName)) {
			String status = statusMap.get(fileName);
			log.debug("Current status for filename -" + fileName + ", status -" + status);
		} else {
			statusMap.put(fileName, "PROCESSING");
		}
		final String exportFileName = fileName;

		if (lock == null) {
			lock = new Lock();
		}
		try {
			lock.lock();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		Thread writerThread = new Thread(new Runnable() {

			FileWriter fileWriter = null;
			CSVPrinter csvFilePrinter = null;

			@Override
			public void run() {
				// TODO Auto-generated method stub
				String filePath = env.getProperty("export.file.path");
				FileSystem fileSystem = FileSystems.getDefault();
				if (StringUtils.isNotEmpty(empId)) {
					filePath += "/" + empId;
				}
				Path path = fileSystem.getPath(filePath);
				// path = path.resolve(String.valueOf(empId));
				if (!Files.exists(path)) {
					Path newEmpPath = Paths.get(filePath);
					try {
						Files.createDirectory(newEmpPath);
					} catch (IOException e) {
						log.error("Error while creating path " + newEmpPath);
					}
				}
				filePath += "/" + exportFileName;
				try {
					// initialize FileWriter object
					log.debug("filePath = " + filePath + ", isAppend=" + isAppend);
					fileWriter = new FileWriter(filePath, isAppend);
					// initialize CSVPrinter object
					csvFilePrinter = new CSVPrinter(fileWriter, csvFileFormat);
					if (!isAppend) {
						// Create CSV file header
						csvFilePrinter.printRecord(JOB_DETAIL_REPORT_FILE_HEADER);
					}
					for (JobDTO transaction : content) {
						List record = new ArrayList();
						log.debug("Writing transaction record for site :" + transaction.getSiteName());
						record.add(transaction.getSiteName());
						record.add(String.valueOf(transaction.getTitle()));
						record.add(transaction.getDescription());
						record.add(transaction.getEmployeeName());
						record.add(transaction.getJobType());
						record.add(DateUtil.formatToDateTimeString(transaction.getPlannedStartTime()));
						record.add(transaction.getActualEndTime());
						record.add(transaction.getJobStatus() != null ? transaction.getJobStatus().name()
								: JobStatus.OPEN.name());
						record.add(transaction.getTicketId());
						record.add(transaction.getTicketName());
						csvFilePrinter.printRecord(record);
					}
					log.info(exportFileName + " CSV file was created successfully !!!");
					statusMap.put(exportFileName, "COMPLETED");
				} catch (Exception e) {
					log.error("Error in CsvFileWriter !!! " + e);
					statusMap.put(exportFileName, "FAILED");
				} finally {
					try {
						fileWriter.flush();
						fileWriter.close();
						csvFilePrinter.close();
					} catch (IOException e) {
						log.error("Error while flushing/closing fileWriter/csvPrinter !!!");
						statusMap.put(exportFileName, "FAILED");
					}
				}
				lock.unlock();
			}

		});
		writerThread.start();

		result.setEmpId(empId);
		result.setFile(fileName.substring(0, fileName.indexOf('.')));
		result.setStatus(getExportStatus(fileName));
		return result;
	}

	public ExportResult writeAttendanceExcelReportToFile(String projName, List<EmployeeAttendanceReport> content,
			final String empId, ExportResult result) {
		boolean isAppend = (result != null);
		log.debug("result = " + result + ", isAppend = " + isAppend);
		if (result == null) {
			result = new ExportResult();
		}
		String file_Name = null;
		if (StringUtils.isEmpty(result.getFile())) {
			if (StringUtils.isNotEmpty(empId)) {
				file_Name = empId + System.currentTimeMillis() + ".xlsx";
			} else {
				file_Name = System.currentTimeMillis() + ".xlsx";
			}
		} else {
			file_Name = result.getFile() + ".xlsx";
		}

		if (statusMap.containsKey((file_Name))) {
			String status = statusMap.get(file_Name);
			// log.debug("Current status for filename -" + file_Name + ", status -" +
			// status);
		} else {
			statusMap.put(file_Name, "PROCESSING");
		}

		final String export_File_Name = file_Name;
		if (lock == null) {
			lock = new Lock();
		}
		try {
			lock.lock();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		Thread writer_Thread = new Thread(new Runnable() {
			@Override
			public void run() {
				String file_Path = env.getProperty("export.file.path");
				FileSystem fileSystem = FileSystems.getDefault();
				if (StringUtils.isNotEmpty(empId)) {
					file_Path += "/" + empId;
				}
				Path path = fileSystem.getPath(file_Path);
				if (!Files.exists(path)) {
					Path newEmpPath = Paths.get(file_Path);
					try {
						Files.createDirectory(newEmpPath);
					} catch (IOException e) {
						log.error("Error While Creating Path " + newEmpPath);
					}
				}

				file_Path += "/" + export_File_Name;
				// create workbook
				OPCPackage pkg = null;
				//pkg = OPCPackage.open(new File(file_Path));
				XSSFWorkbook xssfWorkbook = new XSSFWorkbook();
				// create worksheet with title
				XSSFSheet xssfSheet = xssfWorkbook.createSheet("ATTENDANCE_REPORT");

				Row headerRow = xssfSheet.createRow(0);

				for (int i = 0; i < ATTD_HEADER.length; i++) {
					Cell cell = headerRow.createCell(i);
					cell.setCellValue(ATTD_HEADER[i]);
				}

				int rowNum = 1;

				for (EmployeeAttendanceReport transaction : content) {

					Row dataRow = xssfSheet.createRow(rowNum++);

					dataRow.createCell(0).setCellValue(transaction.getEmployeeIds());
					dataRow.createCell(1).setCellValue(transaction.getName() + transaction.getLastName());
					dataRow.createCell(2).setCellValue(transaction.getSiteName());
					dataRow.createCell(3).setCellValue(transaction.getProjectName());
					dataRow.createCell(4).setCellValue(transaction.getCheckInTime() != null ? String.valueOf(transaction.getCheckInTime()) : "");
					dataRow.createCell(5).setCellValue(transaction.getCheckOutTime() != null ? String.valueOf(transaction.getCheckOutTime()) : "");
					dataRow.createCell(6).setCellValue(transaction.isShiftContinued() ?  "SHIFT CONTINUED" : "");
					dataRow.createCell(7).setCellValue(transaction.isLate() ? "LATE CHECK IN" : "");
					/*
					 * Blob blob = null; byte[] img = blob.getBytes(1,(int)blob.length());
					 * BufferedImage i = null; try { i = ImageIO.read(new
					 * ByteArrayInputStream(img)); } catch (IOException e) { e.printStackTrace(); }
					 */

					// dataRow.createCell(6).setCellValue(String.valueOf(transaction.getImage()));

				}

				for (int i = 0; i < ATTD_HEADER.length; i++) {
					xssfSheet.autoSizeColumn(i);
				}
				log.info(export_File_Name + " Excel file was created successfully !!!");
				statusMap.put(export_File_Name, "COMPLETED");

				FileOutputStream fileOutputStream = null;
				try {
					fileOutputStream = new FileOutputStream(file_Path);
					xssfWorkbook.write(fileOutputStream);
					fileOutputStream.close();
				} catch (IOException e) {
					log.error("Error while flushing/closing  !!!");
					statusMap.put(export_File_Name, "FAILED");
				}
				lock.unlock();
			}
		});

		writer_Thread.start();

		result.setEmpId(empId);
		result.setFile(file_Name.substring(0, file_Name.indexOf('.')));
		result.setStatus(getExportStatus(file_Name));
		return result;

	}

	public ExportResult writeAttendanceReportToFile(String projName, List<EmployeeAttendanceReport> content, List<Map<String,String>> consolidatedData, Map<String, String> summary,
			Map<String, Map<String, Integer>> shiftWiseSummary, final String empId, ExportResult result) {
		boolean isAppend = (result != null);
		log.debug("result = " + result + ", isAppend=" + isAppend);
		if (result == null) {
			result = new ExportResult();
		}
		// Create the CSVFormat object with "\n" as a record delimiter
		CSVFormat csvFileFormat = CSVFormat.DEFAULT.withRecordSeparator(NEW_LINE_SEPARATOR).withDelimiter(',');
		String fileName = null;
		if (StringUtils.isEmpty(result.getFile())) {
			if (StringUtils.isNotEmpty(empId)) {
				fileName = empId + System.currentTimeMillis() + ".xlsx";
			} else if (StringUtils.isNotEmpty(projName)) {
				fileName = projName + "_" + System.currentTimeMillis() + ".xlsx";
			} else {
				fileName = System.currentTimeMillis() + ".xlsx";
			}
		} else {
			fileName = result.getFile() + ".xlsx";
		}
		if (statusMap.containsKey(fileName)) {
			String status = statusMap.get(fileName);
			log.debug("Current status for filename -" + fileName + ", status -" + status);
		} else {
			statusMap.put(fileName, "PROCESSING");
		}
		final String exportFileName = fileName;

		/*
		 * if(lock == null) { lock = new Lock(); } try { lock.lock(); } catch
		 * (InterruptedException e) { // TODO Auto-generated catch block
		 * e.printStackTrace(); }
		 */

		FileWriter fileWriter = null;
		CSVPrinter csvFilePrinter = null;

		// TODO Auto-generated method stub
		String filePath = env.getProperty("export.file.path");
		FileSystem fileSystem = FileSystems.getDefault();
		if (StringUtils.isNotEmpty(empId)) {
			filePath += "/" + empId;
		}
		Path path = fileSystem.getPath(filePath);
		// path = path.resolve(String.valueOf(empId));
		if (!Files.exists(path)) {
			Path newEmpPath = Paths.get(filePath);
			try {
				Files.createDirectory(newEmpPath);

			} catch (IOException e) {
				log.error("Error while creating path " + newEmpPath);
			}
		}
		filePath += "/" + exportFileName;

		OPCPackage pkg = null;
		// Path newFilePath = Paths.get(filePath);
		// Files.createFile(newFilePath);
		// pkg = OPCPackage.open(new FileInputStream(filePath));
		String templatePath = env.getProperty("attendance.template.path");
		FileInputStream fis = null;
		XSSFWorkbook xssfWorkbook = null;
		try {
			fis = new FileInputStream(templatePath);
			xssfWorkbook = new XSSFWorkbook(fis);
		} catch (IOException e1) {
			log.error("Error while opening the attendance template file",e1);
		}

		//create consolidated data sheet
		XSSFSheet consSheet = xssfWorkbook.getSheetAt(0);

//		Row headerRow = consSheet.createRow(0);
//
//		for (int i = 0; i < ATTENDANCE_CONSOLIDATED_REPORT_FILE_HEADER.length; i++) {
//			Cell cell = headerRow.createCell(i);
//			cell.setCellValue((String) ATTENDANCE_CONSOLIDATED_REPORT_FILE_HEADER[i]);
//		}

		int rowNum = 2;

		Row projRow = consSheet.getRow(0);
		projRow.getCell(0).setCellValue(projName);

		for (Map<String,String> data : consolidatedData) {
			Row dataRow = consSheet.getRow(rowNum++);
			dataRow.getCell(0).setCellValue(data.get("SiteName") != null ? data.get("SiteName") : "");
			dataRow.getCell(1).setCellValue((data.get("ShiftStartTime") != null ? data.get("ShiftStartTime") : "") + " - " + (data.get("ShiftEndTime") != null ? data.get("ShiftEndTime") : ""));
			dataRow.getCell(2).setCellValue(data.get("Present"));
			//dataRow.getCell(3).setCellValue(data.get("Present"));
			//dataRow.getCell(4).setCellValue(data.get("Absent"));
		}

		rowNum++;

		Row summaryRow = consSheet.getRow(rowNum);
		summaryRow.getCell(0).setCellValue("Total Mandays Per Day");
		summaryRow.getCell(2).setCellValue(summary.get("TotalPresent"));
		//summaryRow.getCell(3).setCellValue(summary.get("TotalPresent"));
		//summaryRow.getCell(4).setCellValue(summary.get("TotalAbsent"));

		rowNum++;
		if(shiftWiseSummary != null && shiftWiseSummary.size() > 0) {
			Row shiftWiseTitleRow = consSheet.getRow(rowNum);
			rowNum++;
			shiftWiseTitleRow.getCell(0).setCellValue("SHIFT WISE PRESENT FOR " + shiftWiseSummary.size() + " SITES");
			Set<String> keys = shiftWiseSummary.keySet();
			Iterator<String> keyItr = keys.iterator();
			while(keyItr.hasNext()) {
				Row shiftWiseSummaryRow = consSheet.getRow(rowNum);
				String shiftTiming = keyItr.next();
				Map<String, Integer> shiftWise = shiftWiseSummary.get(shiftTiming);
				shiftWiseSummaryRow.getCell(0).setCellValue(shiftTiming);
				shiftWiseSummaryRow.getCell(2).setCellValue(shiftWise.get("Present"));
				rowNum++;
			}
		}


		//summaryRow.getCell(2).setCellValue(summary.get("TotalEmployees"));
		//summaryRow.getCell(3).setCellValue(summary.get("TotalPresent"));
		//summaryRow.getCell(4).setCellValue(summary.get("TotalAbsent"));



		// create worksheet with title
		//XSSFSheet xssfSheet = xssfWorkbook.createSheet("ATTENDANCE_DETAILED_REPORT");

//		headerRow = xssfSheet.createRow(0);
//
//		for (int i = 0; i < ATTENDANCE_DETAIL_REPORT_FILE_HEADER.length; i++) {
//			Cell cell = headerRow.createCell(i);
//			cell.setCellValue((String) ATTENDANCE_DETAIL_REPORT_FILE_HEADER[i]);
//		}
		XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(1);
		rowNum = 1;

		for (EmployeeAttendanceReport transaction : content) {

			Row dataRow = xssfSheet.getRow(rowNum++);

			dataRow.getCell(0).setCellValue(transaction.getEmployeeIds());
			dataRow.getCell(1).setCellValue(transaction.getName() + " " + transaction.getLastName());
			dataRow.getCell(2).setCellValue(transaction.getSiteName());
			dataRow.getCell(3).setCellValue((transaction.getShiftStartTime() != null ? String.valueOf(transaction.getShiftStartTime()) : "") + "-" + (transaction.getShiftEndTime() != null ? String.valueOf(transaction.getShiftEndTime()) : ""));
			dataRow.getCell(4).setCellValue(transaction.getCheckInTime() != null ? String.valueOf(transaction.getCheckInTime()) : "");
			dataRow.getCell(5).setCellValue(transaction.getCheckOutTime() != null ? String.valueOf(transaction.getCheckOutTime()) : "");
			dataRow.getCell(6).setCellValue(transaction.getStatus());
			dataRow.getCell(7).setCellValue(transaction.isShiftContinued() ? "SHIFT CONTINUED" : "");
			dataRow.getCell(8).setCellValue(transaction.isLate() ? "LATE CHECK IN" : "");

		}

		for (int i = 0; i < ATTD_HEADER.length; i++) {
			xssfSheet.autoSizeColumn(i);
		}
		log.info(filePath + " Excel file was created successfully !!!");
		statusMap.put(filePath, "COMPLETED");

		FileOutputStream fileOutputStream = null;
		try {
			fileOutputStream = new FileOutputStream(filePath);
			xssfWorkbook.write(fileOutputStream);
			fileOutputStream.close();
		} catch (IOException e) {
			log.error("Error while flushing/closing  !!!");
			statusMap.put(filePath, "FAILED");
		}

		result.setEmpId(empId);
		result.setFile(fileName.substring(0, fileName.indexOf('.')));
		result.setStatus(getExportStatus(fileName));
		return result;
	}

	public ExportResult writeToCsvFile(List<AttendanceDTO> content, final String empId, ExportResult result) {
		boolean isAppend = (result != null);
		log.debug("result = " + result + ", isAppend=" + isAppend);
		if (result == null) {
			result = new ExportResult();
		}
		// Create the CSVFormat object with "\n" as a record delimiter
		CSVFormat csvFileFormat = CSVFormat.DEFAULT.withRecordSeparator(NEW_LINE_SEPARATOR).withDelimiter(',');
		String fileName = null;
		if (StringUtils.isEmpty(result.getFile())) {
			if (StringUtils.isNotEmpty(empId)) {
				fileName = empId + System.currentTimeMillis() + ".csv";
			} else {
				fileName = System.currentTimeMillis() + ".csv";
			}
		} else {
			fileName = result.getFile() + ".csv";
		}
		if (statusMap.containsKey(fileName)) {
			String status = statusMap.get(fileName);
			log.debug("Current status for filename -" + fileName + ", status -" + status);
		} else {
			statusMap.put(fileName, "PROCESSING");
		}
		final String exportFileName = fileName;

		if (lock == null) {
			lock = new Lock();
		}
		try {
			lock.lock();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		Thread writerThread = new Thread(new Runnable() {

			FileWriter fileWriter = null;
			CSVPrinter csvFilePrinter = null;

			@Override
			public void run() {
				// TODO Auto-generated method stub
				String filePath = env.getProperty("export.file.path");
				FileSystem fileSystem = FileSystems.getDefault();
				if (StringUtils.isNotEmpty(empId)) {
					filePath += "/" + empId;
				}
				Path path = fileSystem.getPath(filePath);
				// path = path.resolve(String.valueOf(empId));
				if (!Files.exists(path)) {
					Path newEmpPath = Paths.get(filePath);
					try {
						Files.createDirectory(newEmpPath);
					} catch (IOException e) {
						log.error("Error while creating path " + newEmpPath);
					}
				}
				filePath += "/" + exportFileName;
				try {
					// initialize FileWriter object
					log.debug("filePath = " + filePath + ", isAppend=" + isAppend);
					fileWriter = new FileWriter(filePath, isAppend);
					// initialize CSVPrinter object
					csvFilePrinter = new CSVPrinter(fileWriter, csvFileFormat);
					if (!isAppend) {
						// Create CSV file header
						csvFilePrinter.printRecord(DETAIL_REPORT_FILE_HEADER);
					}
					// Write a new student object list to the CSV file
					for (AttendanceDTO transaction : content) {
						List record = new ArrayList();
						log.debug("Writing transaction record for Employee id :" + transaction.getEmployeeEmpId());
						record.add(transaction.getSiteName());
						record.add(transaction.getCreatedDate());
						record.add(String.valueOf(transaction.getEmployeeEmpId()));
						record.add(transaction.getEmployeeFullName());
						record.add(DateUtil.convertUTCToIST(DateUtil.convertToTimestamp(transaction.getCheckInTime())));
						record.add(DateUtil.convertUTCToIST(DateUtil.convertToTimestamp(transaction.getCheckOutTime())));
						csvFilePrinter.printRecord(record);
					}
					log.info(exportFileName + " CSV file was created successfully !!!");
					statusMap.put(exportFileName, "COMPLETED");
				} catch (Exception e) {
					log.error("Error in CsvFileWriter !!!");
					statusMap.put(exportFileName, "FAILED");
				} finally {
					try {
						fileWriter.flush();
						fileWriter.close();
						csvFilePrinter.close();
					} catch (IOException e) {
						log.error("Error while flushing/closing fileWriter/csvPrinter !!!");
						statusMap.put(exportFileName, "FAILED");
					}
				}
				lock.unlock();
			}

		});
		writerThread.start();

		result.setEmpId(empId);
		result.setFile(fileName.substring(0, fileName.indexOf('.')));
		result.setStatus(getExportStatus(fileName));
		return result;
	}

	public ExportResult writeToExcelFile(List<EmployeeDTO> content, ExportResult result) {
		log.debug("Welcome here to EXPORT-------->");

		boolean isAppend = (result != null);
		// log.debug("result === " + result + ", isAppend === " + isAppend);
		if (result == null) {
			result = new ExportResult();
		}

		// Create a function to export .xls file

		String file_Name = null;
		if (StringUtils.isEmpty(result.getFile())) {
			file_Name = System.currentTimeMillis() + ".xlsx";
		} else {
			file_Name = result.getFile() + ".xlsx";
		}
		if (statusMap.containsKey(file_Name)) {
			String status = statusMap.get(file_Name);
			// log.debug("Current status for file_Name - "+file_Name+", status - "+status);
		} else {
			statusMap.put(file_Name, "PROCESSING");
		}
		final String exportFileName = file_Name;
		if (lock == null) {
			lock = new Lock();
		}
		try {
			lock.lock();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		Thread writerThread = new Thread(new Runnable() {
			@Override
			public void run() {
				// TODO Auto-generated method stub
				String filePath = env.getProperty("export.file.path");
				FileSystem fileSystem = FileSystems.getDefault();
				// log.debug("FILE SYSTEM -----" + fileSystem);

				// if(StringUtils.isNotEmpty(empId)) {
				// filePath += "/" + empId;
				// }
				Path path = fileSystem.getPath(filePath);
				// log.debug("PATH----------" + path);
				// path = path.resolve(String.valueOf(empId));
				if (!Files.exists(path)) {
					Path newEmpPath = Paths.get(filePath);
					try {
						Files.createDirectory(newEmpPath);
					} catch (IOException e) {
						log.error("Error while creating path " + newEmpPath);
					}
				}
				filePath += "/" + exportFileName;
				// log.debug("NEW EXCEL_FILE PATH TO EXPORT----------" + filePath);

				// create workbook
				XSSFWorkbook xssfWorkbook = new XSSFWorkbook();
				// create worksheet with title
				XSSFSheet xssfSheet = xssfWorkbook.createSheet("EMPLOYEE_REPORT");

				Row headerRow = xssfSheet.createRow(0);

				for (int i = 0; i < EMP_HEADER.length; i++) {
					Cell cell = headerRow.createCell(i);
					cell.setCellValue(EMP_HEADER[i]);
				}

				int rowNum = 1;

				for (EmployeeDTO transaction : content) {

					log.info("Entered into EMP-FOR Loop--------->");

					Row dataRow = xssfSheet.createRow(rowNum++);

					dataRow.createCell(0).setCellValue(transaction.getEmpId());
					dataRow.createCell(1).setCellValue(transaction.getName());
					dataRow.createCell(2).setCellValue(transaction.getDesignation());
					dataRow.createCell(3).setCellValue(transaction.getManagerName());
					dataRow.createCell(4).setCellValue(transaction.getProjectName());
					dataRow.createCell(5).setCellValue(transaction.getSiteName());
					dataRow.createCell(6).setCellValue(transaction.getActive());
				}

				for (int i = 0; i < EMP_HEADER.length; i++) {
					xssfSheet.autoSizeColumn(i);
				}
				// log.info(exportFileName + " Excel file was created successfully !!!");
				statusMap.put(exportFileName, "COMPLETED");

				// String fName = "F:\\Export\\Employee.xlsx";
				FileOutputStream fileOutputStream = null;
				try {
					fileOutputStream = new FileOutputStream(filePath);
					xssfWorkbook.write(fileOutputStream);
					fileOutputStream.close();
				} catch (IOException e) {
					log.error("Error while flushing/closing  !!!");
					statusMap.put(exportFileName, "FAILED");
				}
				lock.unlock();
			}
		});
		writerThread.start();

		// result.setEmpId(empId);
		result.setFile(file_Name.substring(0, file_Name.indexOf('.')));
		result.setStatus(getExportStatus(file_Name));
		return result;
	}

	public ExportResult writeToCsvFile(List<EmployeeDTO> content, ExportResult result) {
		boolean isAppend = (result != null);
		log.debug("result = " + result + ", isAppend=" + isAppend);
		if (result == null) {
			result = new ExportResult();
		}
		// Create the CSVFormat object with "\n" as a record delimiter
		CSVFormat csvFileFormat = CSVFormat.DEFAULT.withRecordSeparator(NEW_LINE_SEPARATOR).withDelimiter(',');
		String fileName = null;
		if (StringUtils.isEmpty(result.getFile())) {
			// if(StringUtils.isNotEmpty(empId)) {
			// fileName = empId + System.currentTimeMillis() + ".csv";
			// }else {
			fileName = System.currentTimeMillis() + ".csv";
			// }
		} else {
			fileName = result.getFile() + ".csv";
		}
		if (statusMap.containsKey(fileName)) {
			String status = statusMap.get(fileName);
			log.debug("Current status for filename -" + fileName + ", status -" + status);
		} else {
			statusMap.put(fileName, "PROCESSING");
		}
		final String exportFileName = fileName;

		if (lock == null) {
			lock = new Lock();
		}
		try {
			lock.lock();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		Thread writerThread = new Thread(new Runnable() {

			FileWriter fileWriter = null;
			CSVPrinter csvFilePrinter = null;

			@Override
			public void run() {
				// TODO Auto-generated method stub
				String filePath = env.getProperty("export.file.path");
				FileSystem fileSystem = FileSystems.getDefault();
				// if(StringUtils.isNotEmpty(empId)) {
				// filePath += "/" + empId;
				// }
				Path path = fileSystem.getPath(filePath);
				// path = path.resolve(String.valueOf(empId));
				if (!Files.exists(path)) {
					Path newEmpPath = Paths.get(filePath);
					try {
						Files.createDirectory(newEmpPath);
					} catch (IOException e) {
						log.error("Error while creating path " + newEmpPath);
					}
				}
				filePath += "/" + exportFileName;
				try {
					// initialize FileWriter object
					log.debug("filePath = " + filePath + ", isAppend=" + isAppend);
					fileWriter = new FileWriter(filePath, isAppend);
					// initialize CSVPrinter object
					csvFilePrinter = new CSVPrinter(fileWriter, csvFileFormat);
					if (!isAppend) {
						// Create CSV file header
						csvFilePrinter.printRecord(EMPLOYEE_DETAIL_REPORT_FILE_HEADER);
					}
					// Write a new student object list to the CSV file
					for (EmployeeDTO transaction : content) {
						List record = new ArrayList();
						// log.debug("Writing transaction record for Employee id :"+
						// transaction.getEmployeeEmpId());
						record.add(transaction.getEmpId());
						record.add(transaction.getName());
						record.add(transaction.getDesignation());
						record.add(transaction.getManagerName());
						record.add(transaction.getProjectName());
						record.add(transaction.getSiteName());
						record.add(transaction.getActive());
						csvFilePrinter.printRecord(record);
					}
					log.info(exportFileName + " CSV file was created successfully !!!");
					statusMap.put(exportFileName, "COMPLETED");
				} catch (Exception e) {
					log.error("Error in CsvFileWriter !!!");
					statusMap.put(exportFileName, "FAILED");
				} finally {
					try {
						fileWriter.flush();
						fileWriter.close();
						csvFilePrinter.close();
					} catch (IOException e) {
						log.error("Error while flushing/closing fileWriter/csvPrinter !!!");
						statusMap.put(exportFileName, "FAILED");
					}
				}
				lock.unlock();
			}

		});
		writerThread.start();

		// result.setEmpId(empId);
		result.setFile(fileName.substring(0, fileName.indexOf('.')));
		result.setStatus(getExportStatus(fileName));
		return result;
	}

	public void updateExportStatus(String uid, String status) {
		statusMap.put(uid, status);
	}

	public String getExportStatus(String fileName) {
		String status = null;
		log.debug("statusMap -" + statusMap);
		if (statusMap != null) {
			if (statusMap.containsKey(fileName)) {
				status = statusMap.get(fileName);
				if (status.equals("COMPLETED") || status.equals("FAILED")) {
					statusMap.remove(fileName);
				}
			}
		}
		// log.debug("status for fileName -" + fileName +" , status -" +status);
		return status;
	}

	public byte[] readEmployeeExportExcelFile(String fileName) {

		// log.info("INSIDE OF readExportFILE **********");

		String filePath = env.getProperty("export.file.path");
		// filePath += "/" + fileName +".xlsx";

		filePath += "/" + fileName + ".xlsx";

		// log.debug("PATH OF THE READ EXPORT FILE*********"+filePath);
		File file = new File(filePath);
		// log.debug("NAME OF THE READ EXPORT FILE*********"+file);

		FileInputStream fileInputStream = null;
		byte emp_excelData[] = null;

		try {

			File readFile = new File(filePath);
			emp_excelData = new byte[(int) readFile.length()];

			// read file into bytes[]
			fileInputStream = new FileInputStream(file);
			fileInputStream.read(emp_excelData);

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (fileInputStream != null) {
				try {
					fileInputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}

		}

		return emp_excelData;

	}

	public byte[] readJobExportFile(String fileName) {

		// log.info("INSIDE OF readExportFILE **********");

		String filePath = env.getProperty("export.file.path");
		// filePath += "/" + fileName +".xlsx";

		filePath += "/" + fileName + ".xlsx";

		// log.debug("PATH OF THE READ EXPORT FILE*********"+filePath);
		File file = new File(filePath);
		// log.debug("NAME OF THE READ EXPORT FILE*********"+file);

		FileInputStream fileInputStream = null;
		byte job_excelData[] = null;

		try {

			File readJobFile = new File(filePath);
			job_excelData = new byte[(int) readJobFile.length()];

			// read file into bytes[]
			fileInputStream = new FileInputStream(file);
			fileInputStream.read(job_excelData);

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (fileInputStream != null) {
				try {
					fileInputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}

		}

		return job_excelData;

	}

	public byte[] readExportFile(String fileName) {
		String filePath = env.getProperty("export.file.path");
		filePath += "/" + fileName + ".xlsx";
		File file = new File(filePath);
		byte csvData[] = null;
		try {
			FileInputStream csvFile = new FileInputStream(file);
			csvData = new byte[(int) file.length()];
			List<String> lines = IOUtils.readLines(csvFile);
			StringBuffer sb = new StringBuffer();
			for (String line : lines) {
				sb.append(line + "\n");
			}
			csvData = sb.toString().getBytes();
			csvFile.close();

		} catch (IOException io) {
			log.error("Error while reading the csv file ," + fileName, io);
		}
		return csvData;
	}

	public byte[] readAttendanceExportFile(String empId, String fileName) {
		// log.info("INSIDE OF readExportFILE **********");

		String filePath = env.getProperty("export.file.path");
		// filePath += "/" + fileName +".xlsx";

		filePath += "/" + fileName + ".xlsx";

		// log.debug("PATH OF THE READ EXPORT FILE*********"+filePath);
		File file = new File(filePath);
		// log.debug("NAME OF THE READ EXPORT FILE*********"+file);

		FileInputStream fileInputStream = null;
		byte attd_excelData[] = null;

		try {

			File readJobFile = new File(filePath);
			attd_excelData = new byte[(int) readJobFile.length()];

			// read file into bytes[]
			fileInputStream = new FileInputStream(file);
			fileInputStream.read(attd_excelData);

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (fileInputStream != null) {
				try {
					fileInputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}

		}

		return attd_excelData;

	}

	public byte[] readExportFile(String empId, String fileName) {
		String filePath = env.getProperty("export.file.path");
		if (StringUtils.isNotBlank(empId)) {
			filePath += "/" + empId;
		}
		filePath += "/" + fileName + ".xlsx";
		File file = new File(filePath);
		byte csvData[] = null;
		try {
			FileInputStream csvFile = new FileInputStream(file);
			csvData = new byte[(int) file.length()];
			List<String> lines = IOUtils.readLines(csvFile);
			StringBuffer sb = new StringBuffer();
			for (String line : lines) {
				sb.append(line + "\n");
			}
			csvData = sb.toString().getBytes();
			csvFile.close();

		} catch (IOException io) {
			log.error("Error while reading the csv file ," + fileName, io);
		}
		return csvData;
	}

	public ExportResult writeJobExcelReportToFile(List<JobDTO> content, String empId, ExportResult result) {
		boolean isAppend = (result != null);
		log.debug("result = " + result + ", isAppend = " + isAppend);
		if (result == null) {
			result = new ExportResult();
		}
		String file_Name = null;
		if (StringUtils.isEmpty(result.getFile())) {
			if (StringUtils.isNotEmpty(empId)) {
				file_Name = empId + System.currentTimeMillis() + ".xlsx";
			} else {
				file_Name = System.currentTimeMillis() + ".xlsx";
			}
		} else {
			file_Name = result.getFile() + ".xlsx";
		}

		if (statusMap.containsKey((file_Name))) {
			String status = statusMap.get(file_Name);
			// log.debug("Current status for filename -" + file_Name + ", status -" +
			// status);
		} else {
			statusMap.put(file_Name, "PROCESSING");
		}

		final String export_File_Name = file_Name;
		if (lock == null) {
			lock = new Lock();
		}
		try {
			lock.lock();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		Thread writer_Thread = new Thread(new Runnable() {
			@Override
			public void run() {
				String file_Path = env.getProperty("export.file.path");
				FileSystem fileSystem = FileSystems.getDefault();
				if (StringUtils.isNotEmpty(empId)) {
					file_Path += "/" + empId;
				}
				Path path = fileSystem.getPath(file_Path);
				if (!Files.exists(path)) {
					Path newEmpPath = Paths.get(file_Path);
					try {
						Files.createDirectory(newEmpPath);
					} catch (IOException e) {
						log.error("Error While Creating Path " + newEmpPath);
					}
				}

				file_Path += "/" + export_File_Name;
				// create workbook
				XSSFWorkbook xssfWorkbook = new XSSFWorkbook();
				// create worksheet with title
				XSSFSheet xssfSheet = xssfWorkbook.createSheet("JOB_REPORT");

				Row headerRow = xssfSheet.createRow(0);

				for (int i = 0; i < JOB_HEADER.length; i++) {
					Cell cell = headerRow.createCell(i);
					cell.setCellValue(JOB_HEADER[i]);
				}

				int rowNum = 1;

				for (JobDTO transaction : content) {

					Row dataRow = xssfSheet.createRow(rowNum++);

					dataRow.createCell(0).setCellValue(transaction.getSiteName());
					dataRow.createCell(1).setCellValue(transaction.getTitle());
					dataRow.createCell(2).setCellValue(transaction.getDescription());
					dataRow.createCell(3).setCellValue(transaction.getTicketId() > 0 ? transaction.getTicketId() +"" : "");
					dataRow.createCell(4).setCellValue(transaction.getTicketName());
					dataRow.createCell(5).setCellValue(transaction.getEmployeeName());
					dataRow.createCell(6).setCellValue(String.valueOf(transaction.getJobType()));
					dataRow.createCell(7).setCellValue(DateUtil.formatToDateTimeString(transaction.getPlannedStartTime()));
					dataRow.createCell(8).setCellValue(DateUtil.formatToDateTimeString(transaction.getActualEndTime()));
					dataRow.createCell(9)
							.setCellValue(transaction.getJobStatus() != null ? transaction.getJobStatus().name()
									: JobStatus.OPEN.name());
				}

				for (int i = 0; i < JOB_HEADER.length; i++) {
					xssfSheet.autoSizeColumn(i);
				}
				log.info(export_File_Name + " Excel file was created successfully !!!");
				statusMap.put(export_File_Name, "COMPLETED");

				FileOutputStream fileOutputStream = null;
				try {
					fileOutputStream = new FileOutputStream(file_Path);
					xssfWorkbook.write(fileOutputStream);
					fileOutputStream.close();
				} catch (IOException e) {
					log.error("Error while flushing/closing  !!!");
					statusMap.put(export_File_Name, "FAILED");
				}
				lock.unlock();
			}
		});

		writer_Thread.start();

		result.setEmpId(empId);
		result.setFile(file_Name.substring(0, file_Name.indexOf('.')));
		result.setStatus(getExportStatus(file_Name));
		return result;
	}

	public ExportResult writeTicketExcelReportToFile(List<TicketDTO> content, String empId, ExportResult result) {
		boolean isAppend = (result != null);
		log.debug("result = " + result + ", isAppend = " + isAppend);
		if (result == null) {
			result = new ExportResult();
		}
		String file_Name = null;
		if (StringUtils.isEmpty(result.getFile())) {
			if (StringUtils.isNotEmpty(empId)) {
				file_Name = empId + System.currentTimeMillis() + ".xlsx";
			} else {
				file_Name = System.currentTimeMillis() + ".xlsx";
			}
		} else {
			file_Name = result.getFile() + ".xlsx";
		}

		if (statusMap.containsKey((file_Name))) {
			String status = statusMap.get(file_Name);
			// log.debug("Current status for filename -" + file_Name + ", status -" +
			// status);
		} else {
			statusMap.put(file_Name, "PROCESSING");
		}

		final String export_File_Name = file_Name;
		if (lock == null) {
			lock = new Lock();
		}
		try {
			lock.lock();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		Thread writer_Thread = new Thread(new Runnable() {
			@Override
			public void run() {
				String file_Path = env.getProperty("export.file.path");
				FileSystem fileSystem = FileSystems.getDefault();
				if (StringUtils.isNotEmpty(empId)) {
					file_Path += "/" + empId;
				}
				Path path = fileSystem.getPath(file_Path);
				if (!Files.exists(path)) {
					Path newEmpPath = Paths.get(file_Path);
					try {
						Files.createDirectory(newEmpPath);
					} catch (IOException e) {
						log.error("Error While Creating Path " + newEmpPath);
					}
				}

				file_Path += "/" + export_File_Name;
				// create workbook
				XSSFWorkbook xssfWorkbook = new XSSFWorkbook();
				// create worksheet with title
				XSSFSheet xssfSheet = xssfWorkbook.createSheet("TICKET_REPORT");

				Row headerRow = xssfSheet.createRow(0);

				for (int i = 0; i < TICKET_HEADER.length; i++) {
					Cell cell = headerRow.createCell(i);
					cell.setCellValue(TICKET_HEADER[i]);
				}

				int rowNum = 1;

				for (TicketDTO transaction : content) {

					Row dataRow = xssfSheet.createRow(rowNum++);
					dataRow.createCell(0).setCellValue(transaction.getId());
					dataRow.createCell(1).setCellValue(transaction.getSiteName());
					dataRow.createCell(2).setCellValue(transaction.getTitle());
					dataRow.createCell(3).setCellValue(transaction.getDescription());
					dataRow.createCell(4).setCellValue(transaction.getStatus());
					dataRow.createCell(5).setCellValue(transaction.isPendingAtClient() ? "PENDING WITH CLIENT" : (transaction.isPendingAtUDS() ? "PENDING WITH UDS" : ""));
					dataRow.createCell(6).setCellValue(transaction.getCategory());
					dataRow.createCell(7).setCellValue(transaction.getSeverity());
					dataRow.createCell(8).setCellValue(transaction.getCreatedBy());
					dataRow.createCell(9).setCellValue(DateUtil.formatToDateTimeString(Date.from(transaction.getCreatedDate().toInstant())));
					dataRow.createCell(10).setCellValue(transaction.getAssignedToName());
					dataRow.createCell(11).setCellValue(transaction.getAssignedOn() != null ? DateUtil.formatToDateTimeString(transaction.getAssignedOn()) : "");
					dataRow.createCell(12).setCellValue(transaction.getClosedByName());
					dataRow.createCell(13).setCellValue(
							transaction.getClosedOn() != null ? DateUtil.formatToDateTimeString(transaction.getClosedOn()) : "");
				}

				for (int i = 0; i < TICKET_HEADER.length; i++) {
					xssfSheet.autoSizeColumn(i);
				}
				log.info(export_File_Name + " Ticket export file was created successfully !!!");
				statusMap.put(export_File_Name, "COMPLETED");

				FileOutputStream fileOutputStream = null;
				try {
					fileOutputStream = new FileOutputStream(file_Path);
					xssfWorkbook.write(fileOutputStream);
					fileOutputStream.close();
				} catch (IOException e) {
					log.error("Error while flushing/closing  !!!");
					statusMap.put(export_File_Name, "FAILED");
				}
				lock.unlock();
			}
		});

		writer_Thread.start();

		result.setEmpId(empId);
		result.setFile(file_Name.substring(0, file_Name.indexOf('.')));
		result.setStatus(getExportStatus(file_Name));
		return result;
	}
}
