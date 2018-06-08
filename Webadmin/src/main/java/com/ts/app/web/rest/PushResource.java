package com.ts.app.web.rest;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ts.app.security.SecurityUtils;
import com.ts.app.service.PushService;
import com.ts.app.web.rest.dto.PushRequestDTO;

/**
 * REST controller for Push service
 */
@RestController
@RequestMapping("/api")
public class PushResource {

	private final Logger log = LoggerFactory.getLogger(PushResource.class);

	@Inject
	private PushService pushService;
	
	@RequestMapping(value = "/push/subscribe", method = RequestMethod.GET)
	public ResponseEntity<?> subscribe(@RequestBody PushRequestDTO pushRequest) {
		long userId = SecurityUtils.getCurrentUserId();
		pushRequest.setUserId(userId);
		pushService.subscribe(pushRequest);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value = "/push/send", method = RequestMethod.GET)
	public ResponseEntity<?> send(@RequestBody PushRequestDTO pushRequest) {
		long userId = SecurityUtils.getCurrentUserId();
		pushRequest.setUserId(userId);
		pushService.subscribe(pushRequest);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	

}
