package com.ts.app.web.rest;

import java.util.Calendar;
import java.util.Date;
import java.util.Optional;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ts.app.security.SecurityUtils;
import com.ts.app.service.ReportService;
import com.ts.app.service.SchedulerService;
import com.ts.app.web.rest.dto.ReportResult;

/**
 * REST controller for report generation
 */
@RestController
@RequestMapping("/api")
public class ReportResource {

	private final Logger log = LoggerFactory.getLogger(ProjectResource.class);

	@Inject
	private ReportService reportService;
	
	@Inject
	private SchedulerService schedulerService;


	@RequestMapping(value = "/reports/attendance/site/{siteId}/selectedDate/{selectedDate}", method = RequestMethod.GET)
	public ReportResult getAttendanceStatusBySite(@PathVariable Long siteId, @PathVariable("selectedDate") Date selectedDate) {
		long userId = SecurityUtils.getCurrentUserId();
		return reportService.getAttendanceStatsDateRange(userId, siteId, selectedDate, selectedDate);
	}
	
	@RequestMapping(value = "/reports/attendance/project/{projectId}/selectedDate/{selectedDate}", method = RequestMethod.GET)
	public ReportResult getAttendanceStatusByProject(@PathVariable Long projectId, @PathVariable("selectedDate") Date selectedDate) {
		long userId = SecurityUtils.getCurrentUserId();
		return reportService.getAttendanceStatsByProjectIdDateRange(userId, projectId, selectedDate, selectedDate);
	}
	
	@RequestMapping(value = "/reports/attendance/consolidated", method = RequestMethod.GET)
	public ResponseEntity<?> sendConsolidatedAttendanceReport() {
		schedulerService.attendanceShiftReportSchedule();
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value = "/reports/attendance/detailed", method = RequestMethod.GET)
	public ResponseEntity<?> sendDetailedAttendanceReport(@RequestParam(value = "date", required = false) Date attnDate) {
		if(attnDate == null) {
			Calendar currCal = Calendar.getInstance();
			currCal.set(Calendar.HOUR_OF_DAY, 0);
			currCal.set(Calendar.MINUTE,0);
			attnDate = currCal.getTime();
		}		
		schedulerService.schedulerHelperService.generateDetailedAttendanceReport(schedulerService, attnDate, false, true);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value = "/reports/attendance/checkout", method = RequestMethod.GET)
	public ResponseEntity<?> autocheckoutAttendance() {
		
		schedulerService.attendanceCheckOutTask();
		return new ResponseEntity<>(HttpStatus.OK);
	}

	
	//    @CrossOrigin
//    @RequestMapping(value = "/reports/site/{siteId}/selectedDate/{selectedDate}", method = RequestMethod.GET)
//    public ReportResult getJobStatusBySite(@PathVariable Long siteId, @PathVariable("selectedDate") Date selectedDate) {
//        return reportService.getJobStats(siteId, selectedDate);
//    }
//
//    @CrossOrigin
//    @RequestMapping(value = "/reports/site/{siteId}/selectedDate/{selectedDate}/endDate/{endDate}", method = RequestMethod.GET)
//    public ReportResult getJobStatusBySiteDateRange(@PathVariable Long siteId, @PathVariable("selectedDate") Date selectedDate, @PathVariable("endDate") Date endDate) {
//        return reportService.getJobStatsDateRange(siteId, selectedDate, endDate);
//    }
//
//    @CrossOrigin
//    @RequestMapping(value = "/reports/site/{siteId}/selectedDate/{selectedDate}/endDate/{endDate}/{locationId}", method = RequestMethod.GET)
//    public ReportResult getJobStatusBySiteDateRange(@PathVariable Long siteId, @PathVariable("selectedDate") Date selectedDate, @PathVariable("endDate") Date endDate, @PathVariable("locationId") Long locationId) {
//        return reportService.jobCountByLocationSiteIdAndStatus(siteId, selectedDate, endDate,locationId);
//    }
//
//    @CrossOrigin
//    @RequestMapping(value = "/reports/site/{siteId}/selectedDate/{selectedDate}/jobtype", method = RequestMethod.GET)
//    public ReportResult getJobStatusBySiteAndType(@PathVariable Long siteId, @PathVariable("selectedDate") Date selectedDate) {
//        return reportService.getJobStatsByJobType(siteId, selectedDate);
//    }
//
//    @CrossOrigin
//    @RequestMapping(value = "/reports/site/{siteId}/selectedDate/{selectedDate}/endDate/{endDate}/jobtype", method = RequestMethod.GET)
//    public ReportResult getJobStatsByJobTypeDateRange(@PathVariable Long siteId, @PathVariable("selectedDate") Date selectedDate, @PathVariable("endDate") Date endDate) {
//        return reportService.getJobStatsByJobTypeDateRange(siteId, selectedDate, endDate);
//    }
}
