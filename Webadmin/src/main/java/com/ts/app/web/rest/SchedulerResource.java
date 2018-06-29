package com.ts.app.web.rest;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ts.app.service.SchedulerService;


/**
 * REST controller for scheduler 
 */
@RestController
@RequestMapping("/api")
public class SchedulerResource {

	private final Logger log = LoggerFactory.getLogger(SchedulerResource.class);

	@Inject
	private SchedulerService schedulerService;
	
	@RequestMapping(value = "/scheduler/job/daily", method = RequestMethod.GET)
	public ResponseEntity<?> runDailyJobSchedule() {
		schedulerService.runDailyTask();
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	
}
