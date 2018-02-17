package com.ts.app.service.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.inject.Inject;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.ts.app.domain.EmployeeAttendanceReport;
import com.ts.app.web.rest.dto.AttendanceDTO;
import com.ts.app.web.rest.dto.EmployeeDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.ReportResult;

@Component
public class ExportUtil {

	private static final Logger log = LoggerFactory.getLogger(ExportUtil.class);

	// Delimiter used in CSV file
	private static final String NEW_LINE_SEPARATOR = "\r";

	// CSV file header
	private static final Object[] FILE_HEADER = { "ID", "TITLE", "DATE", "COMPLETED TIME", "SITE", "LOCATION"};
	private static final Object[] JOB_DETAIL_REPORT_FILE_HEADER = { "SITE", "TITLE", "EMPLOYEE", "TYPE", "PLANNED START TIME", "COMPLETED TIME", "STATUS"};
	private static final Object[] CONSOLIDATED_REPORT_FILE_HEADER = { "SITE", "LOCATION", "ASSIGNED JOBS", "COMPLETED JOBS", "OVERDUE JOBS","TAT"};
	private static final Object[] DETAIL_REPORT_FILE_HEADER = { "SITE", "DATE", "EMPLOYEE ID", "EMPLOYEE NAME", "CHECK IN TIME", "CHECK OUT TIME"};
	private static final Object[] EMPLOYEE_DETAIL_REPORT_FILE_HEADER = { "EMPLOYEE ID", "EMPLOYEE NAME", "DESIGNATION", "REPORTING TO", "CLIENT", "SITE", "ACTIVE"};
	private static final Object[] ATTENDANCE_DETAIL_REPORT_FILE_HEADER = { "EMPLOYEE ID", "EMPLOYEE NAME", "SITE", "CLIENT", "CHECK IN", "CHECK OUT"};

	@Inject
	private Environment env;

	private static final Map<String,String> statusMap = new ConcurrentHashMap<String,String>();

	private Lock lock;

	public ExportResult writeConsolidatedJobReportToFile(String projName, List<ReportResult> content, final String empId, ExportResult result) {
		boolean isAppend = false;
//		boolean isAppend = (result != null);
		log.debug("result = " + result + ", isAppend=" + isAppend);
		if(result == null) {
			result = new ExportResult();
		}
		// Create the CSVFormat object with "\n" as a record delimiter
		CSVFormat csvFileFormat = CSVFormat.DEFAULT.withRecordSeparator(NEW_LINE_SEPARATOR).withDelimiter(',');
		String fileName = null;
		log.debug("result file name - "+ result.getFile());
		if(StringUtils.isEmpty(result.getFile())) {
			if(StringUtils.isNotEmpty(empId)) {
				fileName = empId + System.currentTimeMillis() + ".csv";
			}else if(StringUtils.isNotEmpty(projName)) {
				fileName = projName  +  "_" + System.currentTimeMillis() + ".csv";
			}
		}	else {
			fileName = result.getFile() + ".csv";
		}
		log.debug("result file name - "+fileName);
		if(statusMap.containsKey(fileName)) {
			String status = statusMap.get(fileName);
			log.debug("Current status for filename -"+fileName+", status -" + status);
		}else {
			statusMap.put(fileName, "PROCESSING");
		}
		final String exportFileName = fileName;

		if(lock == null) {
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
					if(StringUtils.isNotEmpty(empId)) {
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
						fileWriter = new FileWriter( filePath,isAppend);
						String siteName = null;
						
						// initialize CSVPrinter object
						csvFilePrinter = new CSVPrinter(fileWriter, csvFileFormat);
						if(!isAppend) {
							// Create CSV file header
							csvFilePrinter.printRecord(CONSOLIDATED_REPORT_FILE_HEADER);
						}
						for (ReportResult transaction : content) {
							if(StringUtils.isEmpty(siteName) || !siteName.equalsIgnoreCase(transaction.getSiteName())) {
								csvFilePrinter.printRecord("");
								csvFilePrinter.printRecord("CLIENT - " + projName + "  SITE - " + transaction.getSiteName());
							}
							List record = new ArrayList();
							log.debug("Writing transaction record for site :"+ transaction.getSiteName());
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
		result.setFile(fileName.substring(0,fileName.indexOf('.')));
		result.setStatus(getExportStatus(fileName));
		return result;
	}

	public ExportResult writeJobReportToFile(List<JobDTO> content, final String empId, ExportResult result) {
		boolean isAppend = (result != null);
		log.debug("result = " + result + ", isAppend=" + isAppend);
		if(result == null) {
			result = new ExportResult();
		}
		// Create the CSVFormat object with "\n" as a record delimiter
		CSVFormat csvFileFormat = CSVFormat.DEFAULT.withRecordSeparator(NEW_LINE_SEPARATOR).withDelimiter(',');
		String fileName = null;
		if(StringUtils.isEmpty(result.getFile())) {
			if(StringUtils.isNotEmpty(empId)) {
				fileName = empId + System.currentTimeMillis() + ".csv";
			}else {
				fileName = System.currentTimeMillis() + ".csv";
			}
		}	else {
			fileName = result.getFile() + ".csv";
		}
		if(statusMap.containsKey(fileName)) {
			String status = statusMap.get(fileName);
			log.debug("Current status for filename -"+fileName+", status -" + status);
		}else {
			statusMap.put(fileName, "PROCESSING");
		}
		final String exportFileName = fileName;

		if(lock == null) {
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
					if(StringUtils.isNotEmpty(empId)) {
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
						fileWriter = new FileWriter( filePath,isAppend);
						// initialize CSVPrinter object
						csvFilePrinter = new CSVPrinter(fileWriter, csvFileFormat);
						if(!isAppend) {
							// Create CSV file header
							csvFilePrinter.printRecord(JOB_DETAIL_REPORT_FILE_HEADER);
						}
						for (JobDTO transaction : content) {
							List record = new ArrayList();
							log.debug("Writing transaction record for site :"+ transaction.getSiteName());
							record.add(transaction.getSiteName());
							record.add(String.valueOf(transaction.getTitle()));
							record.add(transaction.getEmployeeName());
							record.add(transaction.getJobType());
							record.add(transaction.getPlannedStartTime());
							record.add(transaction.getActualEndTime());
							record.add(transaction.getJobStatus().toString());
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
		result.setFile(fileName.substring(0,fileName.indexOf('.')));
		result.setStatus(getExportStatus(fileName));
		return result;
	}
	
	
	public ExportResult writeAttendanceReportToFile(String projName, List<EmployeeAttendanceReport> content, final String empId, ExportResult result) {
		boolean isAppend = (result != null);
		log.debug("result = " + result + ", isAppend=" + isAppend);
		if(result == null) {
			result = new ExportResult();
		}
		// Create the CSVFormat object with "\n" as a record delimiter
		CSVFormat csvFileFormat = CSVFormat.DEFAULT.withRecordSeparator(NEW_LINE_SEPARATOR).withDelimiter(',');
		String fileName = null;
		if(StringUtils.isEmpty(result.getFile())) {
			if(StringUtils.isNotEmpty(empId)) {
				fileName = empId + System.currentTimeMillis() + ".csv";
			}else if(StringUtils.isNotEmpty(projName)) {
				fileName = projName  +  "_" + System.currentTimeMillis() + ".csv";
			}else {
				fileName = System.currentTimeMillis() + ".csv";
			}
		}	else {
			fileName = result.getFile() + ".csv";
		}
		if(statusMap.containsKey(fileName)) {
			String status = statusMap.get(fileName);
			log.debug("Current status for filename -"+fileName+", status -" + status);
		}else {
			statusMap.put(fileName, "PROCESSING");
		}
		final String exportFileName = fileName;

		if(lock == null) {
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
					if(StringUtils.isNotEmpty(empId)) {
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
						fileWriter = new FileWriter( filePath,isAppend);
						// initialize CSVPrinter object
						csvFilePrinter = new CSVPrinter(fileWriter, csvFileFormat);
						if(!isAppend) {
							// Create CSV file header
							csvFilePrinter.printRecord(ATTENDANCE_DETAIL_REPORT_FILE_HEADER);
						}
						for (EmployeeAttendanceReport transaction : content) {
							List record = new ArrayList();
							log.debug("Writing transaction record for site :"+ transaction.getSiteName());
							record.add(transaction.getEmployeeIds());
							record.add(transaction.getName() + transaction.getLastName());
							record.add(transaction.getSiteName());
							record.add(transaction.getProjectName());
							record.add(transaction.getCheckInTime());
							record.add(transaction.getCheckOutTime());
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
		result.setFile(fileName.substring(0,fileName.indexOf('.')));
		result.setStatus(getExportStatus(fileName));
		return result;
	}

	public ExportResult writeToCsvFile(List<AttendanceDTO> content, final String empId, ExportResult result) {
		boolean isAppend = (result != null);
		log.debug("result = " + result + ", isAppend=" + isAppend);
		if(result == null) {
			result = new ExportResult();
		}
		// Create the CSVFormat object with "\n" as a record delimiter
		CSVFormat csvFileFormat = CSVFormat.DEFAULT.withRecordSeparator(NEW_LINE_SEPARATOR).withDelimiter(',');
		String fileName = null;
		if(StringUtils.isEmpty(result.getFile())) {
			if(StringUtils.isNotEmpty(empId)) {
				fileName = empId + System.currentTimeMillis() + ".csv";
			}else {
				fileName = System.currentTimeMillis() + ".csv";
			}
		}	else {
			fileName = result.getFile() + ".csv";
		}
		if(statusMap.containsKey(fileName)) {
			String status = statusMap.get(fileName);
			log.debug("Current status for filename -"+fileName+", status -" + status);
		}else {
			statusMap.put(fileName, "PROCESSING");
		}
		final String exportFileName = fileName;

		if(lock == null) {
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
					if(StringUtils.isNotEmpty(empId)) {
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
						fileWriter = new FileWriter( filePath,isAppend);
						// initialize CSVPrinter object
						csvFilePrinter = new CSVPrinter(fileWriter, csvFileFormat);
						if(!isAppend) {
							// Create CSV file header
							csvFilePrinter.printRecord(DETAIL_REPORT_FILE_HEADER);
						}
						// Write a new student object list to the CSV file
						for (AttendanceDTO transaction : content) {
							List record = new ArrayList();
							log.debug("Writing transaction record for Employee id :"+ transaction.getEmployeeEmpId());
							record.add(transaction.getSiteName());
							record.add(transaction.getCreatedDate());
							record.add(String.valueOf(transaction.getEmployeeEmpId()));
							record.add(transaction.getEmployeeFullName());
							record.add(DateUtil.convertUTCToIST(transaction.getCheckInTime()));
							record.add(DateUtil.convertUTCToIST(transaction.getCheckOutTime()));
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
		result.setFile(fileName.substring(0,fileName.indexOf('.')));
		result.setStatus(getExportStatus(fileName));
		return result;
	}
	
	public ExportResult writeToCsvFile(List<EmployeeDTO> content, ExportResult result) {
		boolean isAppend = (result != null);
		log.debug("result = " + result + ", isAppend=" + isAppend);
		if(result == null) {
			result = new ExportResult();
		}
		// Create the CSVFormat object with "\n" as a record delimiter
		CSVFormat csvFileFormat = CSVFormat.DEFAULT.withRecordSeparator(NEW_LINE_SEPARATOR).withDelimiter(',');
		String fileName = null;
		if(StringUtils.isEmpty(result.getFile())) {
			//if(StringUtils.isNotEmpty(empId)) {
			//	fileName = empId + System.currentTimeMillis() + ".csv";
			//}else {
				fileName = System.currentTimeMillis() + ".csv";
			//}
		}	else {
			fileName = result.getFile() + ".csv";
		}
		if(statusMap.containsKey(fileName)) {
			String status = statusMap.get(fileName);
			log.debug("Current status for filename -"+fileName+", status -" + status);
		}else {
			statusMap.put(fileName, "PROCESSING");
		}
		final String exportFileName = fileName;

		if(lock == null) {
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
					//if(StringUtils.isNotEmpty(empId)) {
					//	filePath += "/" + empId;
					//}
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
						fileWriter = new FileWriter( filePath,isAppend);
						// initialize CSVPrinter object
						csvFilePrinter = new CSVPrinter(fileWriter, csvFileFormat);
						if(!isAppend) {
							// Create CSV file header
							csvFilePrinter.printRecord(EMPLOYEE_DETAIL_REPORT_FILE_HEADER);
						}
						// Write a new student object list to the CSV file
						for (EmployeeDTO transaction : content) {
							List record = new ArrayList();
							//log.debug("Writing transaction record for Employee id :"+ transaction.getEmployeeEmpId());
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

		//result.setEmpId(empId);
		result.setFile(fileName.substring(0,fileName.indexOf('.')));
		result.setStatus(getExportStatus(fileName));
		return result;
	}

	public String getExportStatus(String fileName) {
		String status = null;
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

	public byte[] readExportFile(String fileName) {
		String filePath = env.getProperty("export.file.path");
		filePath += "/" + fileName +".csv";
		File file = new File(filePath);
		byte csvData[] = null;
		try {
			FileInputStream csvFile = new FileInputStream(file);
	        csvData = new byte[(int) file.length()];
			List<String> lines = IOUtils.readLines(csvFile);
			StringBuffer sb = new StringBuffer();
			for(String line : lines) {
				sb.append(line +"\n");
			}
			csvData = sb.toString().getBytes();
	        csvFile.close();

		}catch(IOException io) {
			log.error("Error while reading the csv file ,"+ fileName , io);
		}
		return csvData;
	}
	
	public byte[] readExportFile(String empId, String fileName) {
		String filePath = env.getProperty("export.file.path");
		if(StringUtils.isNotBlank(empId)) {
			filePath += "/" + empId;
		}
		filePath += "/" + fileName +".csv";
		File file = new File(filePath);
		byte csvData[] = null;
		try {
			FileInputStream csvFile = new FileInputStream(file);
	        csvData = new byte[(int) file.length()];
			List<String> lines = IOUtils.readLines(csvFile);
			StringBuffer sb = new StringBuffer();
			for(String line : lines) {
				sb.append(line +"\n");
			}
			csvData = sb.toString().getBytes();
	        csvFile.close();

		}catch(IOException io) {
			log.error("Error while reading the csv file ,"+ fileName , io);
		}
		return csvData;
	}



}




