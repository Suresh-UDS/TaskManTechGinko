package com.ts.app.web.rest;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.ext.api.FaceRecognitionService;
import com.ts.app.security.SecurityUtils;
import com.ts.app.web.rest.dto.FaceRecognitionRequest;
import com.ts.app.web.rest.dto.FaceRecognitionResponse;
import com.ts.app.web.rest.errors.TimesheetException;

/**
 * REST controller for storing face detection information and verifying
 */
@RestController
@RequestMapping("/api")
public class FaceRecognitionResource {

	private final Logger log = LoggerFactory.getLogger(FaceRecognitionResource.class);

	@Inject
	private FaceRecognitionService faceRecognitionService;




	/**
	 * POST /saveFaceProfile -> UserFaceProfile.
	 */
	@RequestMapping(value = "/face/profile", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<FaceRecognitionResponse> saveFaceProfile(@Valid @RequestBody FaceRecognitionRequest frRequest, HttpServletRequest request) {
		log.info("Inside the method in concern" + frRequest.getEmployeeEmpId());
		FaceRecognitionResponse resp = null;
		try {
			//log.debug("Logged in user id -" + SecurityUtils.getCurrentUserId());
			//frRequest.setUserId(SecurityUtils.getCurrentUserId());
			resp = faceRecognitionService.detect(frRequest);
			resp = faceRecognitionService.enroll(frRequest);
		}catch (Exception cve) {
			log.error("Error while saving face profile info ",cve);
			throw new TimesheetException(cve);
		}
		return new ResponseEntity<FaceRecognitionResponse>(resp,HttpStatus.CREATED);

	}

	/**
	 * POST /verifyFaceId
	 */
    @RequestMapping(value = "/face/verify",method = RequestMethod.POST)
    public ResponseEntity<FaceRecognitionResponse> verifyFaceId(@Valid @RequestBody FaceRecognitionRequest frRequest, HttpServletRequest request) {
		log.info("Inside the method in concern" + frRequest.getEmployeeEmpId());
		FaceRecognitionResponse resp = null;
		try {
			//log.debug("Logged in user id -" + SecurityUtils.getCurrentUserId());
			//frRequest.setUserId(SecurityUtils.getCurrentUserId());
			resp = faceRecognitionService.verify(frRequest);
		}catch (Exception cve) {
			log.error("Error while saving face profile info ",cve);
			throw new TimesheetException(cve);
		}
    	return new ResponseEntity<FaceRecognitionResponse>(resp,HttpStatus.FOUND);
    }

}
