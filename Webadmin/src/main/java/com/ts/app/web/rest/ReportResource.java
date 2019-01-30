package com.ts.app.web.rest;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ts.app.domain.AttendanceReportCounts;
import com.ts.app.domain.AttendanceStatusReport;
import com.ts.app.domain.ChartModelEntity;
import com.ts.app.domain.JobReportCounts;
import com.ts.app.domain.JobStatusReport;
import com.ts.app.domain.TicketReportCounts;
import com.ts.app.domain.TicketStatusReport;
import com.ts.app.domain.Measurements.JobStatusMeasurement;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.ReportDatabaseService;
import com.ts.app.service.ReportService;
import com.ts.app.service.SchedulerHelperService;
import com.ts.app.service.SchedulerService;
import com.ts.app.service.SiteService;
import com.ts.app.service.util.ReportDatabaseUtil;
import com.ts.app.web.rest.dto.QuotationDTO;
import com.ts.app.web.rest.dto.ReportResult;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SiteDTO;


/**
 * REST controller for report generation
 */
@RestController
@RequestMapping("/api")
public class ReportResource {

	private final Logger log = LoggerFactory.getLogger(ReportResource.class);

	@Inject
	private ReportService reportService;

	@Inject
	@Lazy
	private SchedulerHelperService schedulerHelperService;

	//@Inject
    private ReportDatabaseUtil reportDatabaseUtil;

	@Inject
    private ReportDatabaseService reportDatabaseService;

	@Inject
    private SchedulerService schedulerService;
	
	@Inject
	private SiteService siteService;


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

    @RequestMapping(value = "/reports/preCompute/jobs", method = RequestMethod.GET)
    public ResponseEntity<?> getJobPrecomputeData() {
        List<JobStatusReport> reportList = reportDatabaseUtil.getPreComputeJobData();
        return new ResponseEntity<>(reportList, HttpStatus.OK);
    }

    @RequestMapping(value = "/reports/preCompute/tickets", method = RequestMethod.GET)
    public ResponseEntity<?> getTicketPrecomputeData() {
        List<TicketStatusReport> reportList = reportDatabaseUtil.getPreComputeTicketData();
        return new ResponseEntity<>(reportList, HttpStatus.OK);
    }

    @RequestMapping(value = "/reports/preCompute/attendance", method = RequestMethod.GET)
    public ResponseEntity<?> getAttenPrecomputeData() {
        List<AttendanceStatusReport> reportList = reportDatabaseUtil.getPreComputeAttendanceData();
        return new ResponseEntity<>(reportList, HttpStatus.OK);
    }

	@RequestMapping(value = "/reports/job/points", method = RequestMethod.GET)
	public ResponseEntity<?> addJobPoints() throws Exception {
        reportDatabaseUtil.addPointsToJob();
	    return new ResponseEntity<>("Successfully created job points to influxDb", HttpStatus.CREATED);
    }

    @RequestMapping(value = "/reports/ticket/points", method = RequestMethod.GET)
    public ResponseEntity<?> addTicketPoints() throws Exception {
        reportDatabaseUtil.addTicketPoints();
        return new ResponseEntity<>("Successfully created ticket points to influxDb", HttpStatus.CREATED);
    }

    @RequestMapping(value = "/reports/attendance/points", method = RequestMethod.GET)
    public ResponseEntity<?> addAttnPoints() throws Exception {
        reportDatabaseUtil.addAttendancePoints();
        return new ResponseEntity<>("Successfully created attendance points to influxDb", HttpStatus.CREATED);
    }

    @RequestMapping(value = "/reports/quotation/points", method = RequestMethod.GET)
    public ResponseEntity<?> addQuotationPoint() {
        try {
            reportDatabaseUtil.addQuotationPoints();
        }catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("Successfully created Quotation points to influxDb", HttpStatus.OK);
    }

    @RequestMapping(value = "/reports/jobType/count", method = RequestMethod.GET)
    public ResponseEntity<?> getJobPointsByStatus() {
        List<JobStatusMeasurement> reportCategoryPoints = reportDatabaseUtil.getJobReportCategoryPoints();
        return new ResponseEntity<>(reportCategoryPoints, HttpStatus.OK);
    }

    @RequestMapping(value = "/reports/jobStatus/count", method = RequestMethod.GET)
    public ResponseEntity<?> getJobListByStatus() {
        List<ChartModelEntity> reportStatusPoints = reportDatabaseUtil.getJobReportStatusPoints();
        return new ResponseEntity<>(reportStatusPoints, HttpStatus.OK);
    }

    @RequestMapping(value = "/reports/ticketStatus/count", method = RequestMethod.GET)
    public ResponseEntity<?> getTicketListByStatus() {
        List<ChartModelEntity> reportStatusPoints = reportDatabaseUtil.getTicketReportStatusPoints();
        return new ResponseEntity<>(reportStatusPoints, HttpStatus.OK);
    }

    @RequestMapping(value = "/reports/query", method = RequestMethod.GET)
    public ResponseEntity<?> getQueryListByStatus(@RequestBody SearchCriteria searchCriteria) {
        List<JobStatusMeasurement> queryList = reportDatabaseUtil.getTodayJobsCount(searchCriteria);
        return new ResponseEntity<>(queryList, HttpStatus.OK);
    }

    @RequestMapping(value = "/reports/jobs/count", method = RequestMethod.POST)
    public ResponseEntity<?> getJobsCountByToday(@RequestBody SearchCriteria searchCriteria) {
        List<JobReportCounts> reportTodayPoints = reportDatabaseUtil.getTotalJobsCount(searchCriteria);
        return new ResponseEntity<>(reportTodayPoints, HttpStatus.OK);
    }

    @RequestMapping(value = "/reports/tickets/count", method = RequestMethod.POST)
    public ResponseEntity<?> getTicketsCountByToday(@RequestBody SearchCriteria searchCriteria) {
        List<TicketReportCounts> reportTodayPoints = reportDatabaseUtil.getTotalTicketCount(searchCriteria);
        return new ResponseEntity<>(reportTodayPoints, HttpStatus.OK);
    }

    @RequestMapping(value = "/reports/attendance/count", method = RequestMethod.POST)
    public ResponseEntity<?> getAttendanceCountByToday(@RequestBody SearchCriteria searchCriteria) {
        AttendanceReportCounts reportTodayPoints = reportDatabaseUtil.getAttendanceTotalCounts(searchCriteria);
        return new ResponseEntity<>(reportTodayPoints, HttpStatus.OK);
    }

    @RequestMapping(value = "/reports/quotations/count", method = RequestMethod.POST)
    public ResponseEntity<?> getQuotationCountByToday(@RequestBody SearchCriteria searchCriteria) {
    		if(searchCriteria.getSiteId() == 0) {
    			List<SiteDTO> sites = null;
    			if(StringUtils.isNotEmpty(searchCriteria.getBranch())) {
    				sites = siteService.findSitesByRegionAndBranch(searchCriteria.getProjectId(), searchCriteria.getRegion(), searchCriteria.getBranch());
    			}else if(StringUtils.isNotEmpty(searchCriteria.getRegion())) {
    				sites = siteService.findSitesByRegion(searchCriteria.getProjectId(), searchCriteria.getRegion());
    			}
    			if(!CollectionUtils.isEmpty(sites)) {
    				List<Long> siteIds = new ArrayList<Long>();
    				for(SiteDTO site : sites) {
    					siteIds.add(site.getId());
    				}
    				searchCriteria.setSiteIds(siteIds);
    			}
    		}
    		QuotationDTO quotationSummary = reportService.getQuotationCountSummary(searchCriteria);
    		return new ResponseEntity<>(quotationSummary, HttpStatus.OK);
        //List<QuotationReportCounts> reportTodayPoints = reportDatabaseUtil.getQuotationCounts(searchCriteria);
        //return new ResponseEntity<>(reportTodayPoints, HttpStatus.OK);
    }

    @RequestMapping(value = "/reports/attendance", method = RequestMethod.GET)
    public ResponseEntity<?> getAttnCounts() {
        List<ChartModelEntity> reportList = reportDatabaseUtil.getAttnTotalCounts();
        return new ResponseEntity<>(reportList, HttpStatus.OK);
    }

    @RequestMapping(value = "/reports/quotations/chart", method = RequestMethod.GET)
    public ResponseEntity<?> getChartQuote() {
        List<ChartModelEntity> response = reportDatabaseUtil.getChartzCounts();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(value = "/reports/job/delete", method = RequestMethod.GET)
    public ResponseEntity<?> deleteCountByToday() {
        String reportTodayPoints = reportDatabaseUtil.deleteOrUpdateJobPoints();
        return new ResponseEntity<>(reportTodayPoints, HttpStatus.OK);
    }

    @RequestMapping(value = "/callschedule/service", method = RequestMethod.GET)
    public String callScheduleServ() {
            schedulerService.createJobPoints();
	    return "schedule service called...";
    }
    
    @RequestMapping(value = "/getAvgTicket", method = RequestMethod.GET)
    public ResponseEntity<?> getAveticket() {
    	List<ChartModelEntity> response = reportDatabaseUtil.getAverageTicketAge();
    	return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(value = "/getAvgTicket/monthly", method = RequestMethod.GET)
    public ResponseEntity<?> getAveticketMonthly() {
        List<ChartModelEntity> response = reportDatabaseUtil.getAverageTicketAgeMonthly();
    	return new ResponseEntity<>(response, HttpStatus.OK);
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
