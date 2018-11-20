package com.ts.app.web.rest;

import com.ts.app.domain.Frequency;
import com.ts.app.service.SchedulerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

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
	public ResponseEntity<?> sendDetailedAttendanceReport(@RequestParam(value = "date", required = false) @DateTimeFormat(pattern="dd-MM-yyyy") Date attnDate, @RequestParam(value = "onDemand", required = false) boolean onDemand) {
		if(attnDate == null) {
			Calendar currCal = Calendar.getInstance();
			currCal.set(Calendar.HOUR_OF_DAY, 0);
			currCal.set(Calendar.MINUTE,0);
			attnDate = currCal.getTime();
		}		
		schedulerService.schedulerHelperService.generateDetailedAttendanceReport(attnDate, false, true, onDemand);
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
			case DAY:
				schedulerService.createDailyTask();
				break;
			case WEEK:
				schedulerService.createWeeklyTask();
				break;
			case FORTNIGHT:
				schedulerService.createFortnightlyTask();
				break;
			case MONTH:
				schedulerService.createMonthlyTask();
				break;
			case QUARTER:
				schedulerService.createQuarterlyTask();
				break;
			case HALFYEAR:
				schedulerService.createHalfYearlyTask();
				break;
			case YEAR:
				schedulerService.createYearlyTask();
				break;
			default:
				
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}

	
	@RequestMapping(value = "/scheduler/job/daily", method = RequestMethod.GET)
	public ResponseEntity<?> runDailyJobSchedule(@RequestParam(value = "date", required = false) @DateTimeFormat(pattern="dd-MM-yyyy") Date jobDate, @RequestParam(value="siteIds", required = false) List<Long> siteIds) {
		if(jobDate == null) {
			jobDate = new Date();
		}
		schedulerService.createDailyTask(jobDate, siteIds);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	
}
