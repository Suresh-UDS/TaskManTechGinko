package com.ts.app.service.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.Date;
import java.util.Iterator;

import javax.transaction.Transactional;

import org.apache.poi.ss.format.CellFormatType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ts.app.domain.Employee;
import com.ts.app.domain.Location;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.LocationRepository;

@Component
@Transactional
public class ImportUtil {

	private static final Logger log = LoggerFactory.getLogger(ImportUtil.class);

	private static final String NEW_IMPORT_FOLDER = "/opt/imports/new";
	private static final String COMPLETED_IMPORT_FOLDER = "/opt/imports/completed";

	private static final String SEPARATOR = System.getProperty("file.separator");

//	@Autowired
//	private JobManagementService jobService;

	@Autowired
	private LocationRepository locationRepo;

	@Autowired
	private EmployeeRepository employeeRepo;

	public void importJobData() {
		// get new files in the imports folder
		FilenameFilter filter = new ExcelFilenameFilter(".xlsx");
		File[] files = new File(NEW_IMPORT_FOLDER).listFiles(filter);

//		for (File file : files) {
//			if (file.isFile()) {
//				importFromFile(file.getPath());
//				file.renameTo(new File(COMPLETED_IMPORT_FOLDER + SEPARATOR + file.getName()));
//			}
//		}

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


//	private void importFromFile(String path) {
//		try {
//
//			FileInputStream excelFile = new FileInputStream(new File(path));
//			Workbook workbook = new XSSFWorkbook(excelFile);
//			Sheet datatypeSheet = workbook.getSheetAt(0);
//			Iterator<Row> iterator = datatypeSheet.iterator();
//			int lastRow = datatypeSheet.getLastRowNum();
//			int r = 0;
//			Row projectRow = datatypeSheet.getRow(r);
//			long projectId = (long) projectRow.getCell(2).getNumericCellValue();
//			r++;
//			Row siteRow = datatypeSheet.getRow(r);
//			long siteId = (long) siteRow.getCell(2).getNumericCellValue();
//			r++;
//			Row managerRow = datatypeSheet.getRow(r);
//			String managerId = String.valueOf(managerRow.getCell(2).getNumericCellValue());
//			String supervisorId = String.valueOf(managerRow.getCell(5).getNumericCellValue());
//			r = 4;
//			for (; r < lastRow; r++) {
//				log.debug("Current Row number -" + r);
//				Row currentRow = datatypeSheet.getRow(r);
//				JobDTO jobDto = new JobDTO();
//				jobDto.setTitle(currentRow.getCell(1).getStringCellValue());
//				jobDto.setDesc(currentRow.getCell(1).getStringCellValue());
//				jobDto.setSiteId(siteId);
//				String location = currentRow.getCell(2).getStringCellValue();
//				Location loc = locationRepo.findByName(location);
//				if (loc == null) {
//					loc = new Location();
//					loc.setName(location);
//					loc.setActive("Y");
//					loc = locationRepo.save(loc);
//				}
//				jobDto.setLocationId(loc.getId());
//				String jobType = currentRow.getCell(3).getStringCellValue();
//				String empId = null;
//				log.debug("cell type =" + currentRow.getCell(5).getCellType());
//				if (currentRow.getCell(5).getCellType() == CellFormatType.NUMBER.ordinal()) {
//					try {
//						empId = String.valueOf(currentRow.getCell(5).getNumericCellValue());
//					} catch (IllegalStateException ise) {
//						empId = currentRow.getCell(5).getStringCellValue();
//					}
//				} else {
//					try {
//						empId = currentRow.getCell(5).getStringCellValue();
//					} catch (IllegalStateException ise) {
//						empId = String.valueOf(currentRow.getCell(5).getNumericCellValue());
//					}
//
//				}
//				log.debug("Employee id =" + empId);
//				Employee emp = employeeRepo.findByEmpId(empId);
//				log.debug("Employee obj =" + emp);
//				if (emp != null) {
//					jobDto.setEmployeeId(emp.getId());
//					jobDto.setEmployeeName(emp.getFullName());
//					jobDto.setStatus(JobStatus.ASSIGNED.name());
//					jobDto.setJobType(JobType.valueOf(jobType));
//					String schedule = currentRow.getCell(6).getStringCellValue();
//					jobDto.setSchedule(schedule);
//					Date startDate = currentRow.getCell(7).getDateCellValue();
//					Date startTime = currentRow.getCell(9).getDateCellValue();
//					Date endDate = currentRow.getCell(8).getDateCellValue();
//					Date endTime = currentRow.getCell(10).getDateCellValue();
//					jobDto.setPlannedStartTime(DateUtil.convertToDateTime(startDate, startTime));
//					jobDto.setPlannedEndTime(DateUtil.convertToDateTime(startDate, endTime));
//					jobDto.setScheduleEndDate(DateUtil.convertToDateTime(endDate, endTime));
//					jobDto.setFrequency(currentRow.getCell(11).getStringCellValue());
//					jobDto.setActive("Y");
//					jobService.saveJob(jobDto);
//
//				}
//			}
//
//		} catch (FileNotFoundException e) {
//			log.error("Error while reading the job data file for import", e);
//		} catch (IOException e) {
//			log.error("Error while reading the job data file for import", e);
//		}
//	}

}
