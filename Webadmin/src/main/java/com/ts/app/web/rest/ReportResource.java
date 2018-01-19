package com.ts.app.web.rest;

import java.util.Date;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ts.app.service.ReportService;
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


	@RequestMapping(value = "/reports/attendance/site/{siteId}/selectedDate/{selectedDate}", method = RequestMethod.GET)
	public ReportResult getAttendanceStatusBySite(@PathVariable Long siteId, @PathVariable("selectedDate") Date selectedDate) {
		return reportService.getAttendanceStatsDateRange(siteId, selectedDate, selectedDate);
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
