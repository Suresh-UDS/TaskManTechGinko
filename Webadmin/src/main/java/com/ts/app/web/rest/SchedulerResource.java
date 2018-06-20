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

import com.ts.app.domain.Frequency;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.ReportService;
import com.ts.app.service.SchedulerService;
import com.ts.app.web.rest.dto.ReportResult;

/**
 * REST controller for invoking scheduler operations using API endpoint.
 */
@RestController
@RequestMapping("/api")
public class SchedulerResource {

	private final Logger log = LoggerFactory.getLogger(SchedulerResource.class);

	@Inject
	private SchedulerService schedulerService;

	
	@RequestMapping(value = "/scheduler/attendance/consolidated", method = RequestMethod.GET)
	public ResponseEntity<?> sendConsolidatedAttendanceReport() {
		schedulerService.attendanceShiftReportSchedule();
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value = "/scheduler/attendance/detailed", method = RequestMethod.GET)
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
	
	@RequestMapping(value = "/scheduler/attendance/checkout", method = RequestMethod.GET)
	public ResponseEntity<?> autocheckoutAttendance() {
		
		schedulerService.attendanceCheckOutTask();
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/scheduler/jobs/{schedule}", method = RequestMethod.GET)
	public ResponseEntity<?> createDailyJobs(@RequestParam("schedule") String schedule) {
		Frequency freq = Frequency.valueOf(schedule);
		switch(freq) {
			case DAILY:
				schedulerService.createDailyTask();
				break;
			case WEEKLY:
				schedulerService.createWeeklyTask();
				break;
			case FORTNIGHTLY:
				schedulerService.createFortnightlyTask();
				break;
			case MONTHLY:
				schedulerService.createMonthlyTask();
				break;
			case QUARTERLY:
				schedulerService.createQuarterlyTask();
				break;
			case HALFYEARLY:
				schedulerService.createHalfYearlyTask();
				break;
			case YEARLY:
				schedulerService.createYearlyTask();
				break;
			default:
				
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}

	
}
