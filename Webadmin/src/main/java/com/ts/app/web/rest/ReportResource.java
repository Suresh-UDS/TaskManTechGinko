package com.ts.app.web.rest;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ts.app.security.SecurityUtils;
import com.ts.app.service.ReportService;
import com.ts.app.service.SchedulerHelperService;
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
	@Lazy
	private SchedulerHelperService schedulerHelperService;


	@RequestMapping(value = "/reports/attendance/site/{siteId}/selectedDate/{selectedDate}", method = RequestMethod.GET)
	public ReportResult getAttendanceStatusBySite(@PathVariable Long siteId, @PathVariable("selectedDate") Date selectedDate) {
		long userId = SecurityUtils.getCurrentUserId();
		return reportService.getAttendanceStatsDateRange(userId, siteId, selectedDate, selectedDate);
	}

    @RequestMapping(value = "/reports/attendance/region/{region}/project/{projectId}/selectedDate/{selectedDate}", method = RequestMethod.GET)
    public ReportResult getAttendanceStatusByRegion(@PathVariable String region, @PathVariable Long projectId, @PathVariable("selectedDate") Date selectedDate) {
        long userId = SecurityUtils.getCurrentUserId();
        return reportService.getAttendanceStatsByRegion(userId, projectId, region, selectedDate, selectedDate);
    }

    @RequestMapping(value = "/reports/attendance/branch/{branch}/region/{region}/project/{projectId}/selectedDate/{selectedDate}", method = RequestMethod.GET)
    public ReportResult getAttendanceStatusByBranch(@PathVariable String branch, @PathVariable String region, @PathVariable Long projectId, @PathVariable("selectedDate") Date selectedDate) {
        long userId = SecurityUtils.getCurrentUserId();
        return reportService.getAttendanceStatsByBranch(userId, projectId,region,branch, selectedDate, selectedDate);
    }

	@RequestMapping(value = "/reports/attendance/project/{projectId}/selectedDate/{selectedDate}", method = RequestMethod.GET)
	public ReportResult getAttendanceStatusByProject(@PathVariable Long projectId, @PathVariable("selectedDate") Date selectedDate) {
		long userId = SecurityUtils.getCurrentUserId();
		return reportService.getAttendanceStatsByProjectIdDateRange(userId, projectId, selectedDate, selectedDate);
	}

	@RequestMapping(value = "/reports/ticket/site/{siteId}/fromDate/{fromDate}/toDate/{toDate}", method = RequestMethod.GET)
	public ReportResult getTicketStatsBySite(@PathVariable Long siteId, @PathVariable("fromDate") @DateTimeFormat(pattern="dd-MM-yyyy") Date fromDate,@PathVariable("toDate") @DateTimeFormat(pattern="dd-MM-yyyy") Date toDate) {
		long userId = SecurityUtils.getCurrentUserId();
		List<Long> siteIds = new ArrayList<Long>();
		siteIds.add(siteId);
		return reportService.getTicketStatsDateRange(userId, siteIds, fromDate, toDate);
	}

    @RequestMapping(value = "/reports/ticket/region/{region}/project/{projectId}/fromDate/{fromDate}/toDate/{toDate}", method = RequestMethod.GET)
    public ReportResult getTicketStatsByRegion(@PathVariable String region,@PathVariable Long projectId, @PathVariable("fromDate") @DateTimeFormat(pattern="dd-MM-yyyy") Date fromDate, @PathVariable("toDate") @DateTimeFormat(pattern="dd-MM-yyyy") Date toDate) {
        long userId = SecurityUtils.getCurrentUserId();

        return reportService.getTicketStatsDateRangeByRegion(userId, projectId, region, fromDate, toDate);
    }

    @RequestMapping(value = "/reports/ticket/branch/{branch}/region/{region}/project/{projectId}/fromDate/{fromDate}/toDate/{toDate}", method = RequestMethod.GET)
    public ReportResult getTicketStatsByBranch(@PathVariable String branch,@PathVariable String region,@PathVariable Long projectId, @PathVariable("fromDate") @DateTimeFormat(pattern="dd-MM-yyyy") Date fromDate,@PathVariable("toDate") @DateTimeFormat(pattern="dd-MM-yyyy") Date toDate) {
        long userId = SecurityUtils.getCurrentUserId();
        return reportService.getTicketStatsDateRangeByBranch(userId, projectId, region,branch, fromDate, toDate);
    }

	@RequestMapping(value = "/reports/ticket/project/{projectId}/fromDate/{fromDate}/toDate/{toDate}", method = RequestMethod.GET)
	public ReportResult getTicketStatsByProject(@PathVariable Long projectId, @PathVariable("fromDate") @DateTimeFormat(pattern="dd-MM-yyyy") Date fromDate,@PathVariable("toDate") @DateTimeFormat(pattern="dd-MM-yyyy") Date toDate) {
		long userId = SecurityUtils.getCurrentUserId();
		return reportService.getTicketStatsByProjectAndDateRange(userId, projectId, fromDate, toDate);
	}

	@RequestMapping(value = "/reports/attendance/consolidated", method = RequestMethod.GET)
	public ResponseEntity<?> sendConsolidatedAttendanceReport() {
		Calendar cal = Calendar.getInstance();
		schedulerHelperService.generateDetailedAttendanceReport(cal.getTime(), true, false, false);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/reports/attendance/detailed", method = RequestMethod.GET)
	public ResponseEntity<?> sendDetailedAttendanceReport(@RequestParam(value = "date", required = false) @DateTimeFormat(pattern="dd-MM-yyyy") Date attnDate, @RequestParam(value = "onDemand", required = false) boolean onDemand) {
		if(attnDate == null) {
			Calendar currCal = Calendar.getInstance();
			currCal.set(Calendar.HOUR_OF_DAY, 0);
			currCal.set(Calendar.MINUTE,0);
			attnDate = currCal.getTime();
		}
		schedulerHelperService.generateDetailedAttendanceReport(attnDate, false, true, onDemand);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/reports/attendance/checkout", method = RequestMethod.GET)
	public ResponseEntity<?> autocheckoutAttendance() {
		schedulerHelperService.autoCheckOutAttendance();
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/reports/attendance/musterroll", method = RequestMethod.GET)
	public ResponseEntity<?> sendMusterrollAttendanceReport(@RequestParam(value = "date", required = false) @DateTimeFormat(pattern="dd-MM-yyyy") Date attnDate, @RequestParam(value = "onDemand", required = false) boolean onDemand, @RequestParam(value = "siteId", required = false) long siteId) {
		Calendar startCal = Calendar.getInstance();
		Calendar endCal = Calendar.getInstance();
		if(attnDate != null) {
			startCal.setTime(attnDate);
			endCal.setTime(attnDate);
		}
		startCal.set(Calendar.DAY_OF_MONTH, 1);
		startCal.set(Calendar.HOUR_OF_DAY, 0);
		startCal.set(Calendar.MINUTE,0);
		endCal.set(Calendar.DAY_OF_MONTH, endCal.getActualMaximum(Calendar.DAY_OF_MONTH));
		endCal.set(Calendar.HOUR_OF_DAY,23);
		endCal.set(Calendar.MINUTE,59);
		schedulerHelperService.generateMusterRollAttendanceReport(siteId, startCal.getTime(), endCal.getTime() , true, onDemand);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/reports/daily", method = RequestMethod.GET)
	public ResponseEntity<?> generateDailyReport(@RequestParam(value = "date", required = false) @DateTimeFormat(pattern="dd-MM-yyyy") Date reportDate, @RequestParam(value="projectId", required=false) long projectId) {
		schedulerHelperService.sendDaywiseReportEmail(reportDate, true, projectId);
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
