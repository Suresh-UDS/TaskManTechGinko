package com.ts.app.web.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.OnboardingUserConfigService;
import com.ts.app.web.rest.dto.ChecklistDTO;
import com.ts.app.web.rest.dto.OnboardingUserConfigDTO;
import com.ts.app.web.rest.errors.TimesheetException;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class OnboardingUserCofigResource {
	
	private final Logger log = LoggerFactory.getLogger(OnboardingUserCofigResource.class);
	
	@Inject
	private OnboardingUserConfigService onboardingUserConfigService;
	
	@RequestMapping(value = "/saveOnboardingUserConfig", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveOnboardingUserConfig(@Valid @RequestBody OnboardingUserConfigDTO onboardingUserConfigDTO,HttpServletRequest httpServletRequest){
		OnboardingUserConfigDTO createdUserlist = null;
		try {
			onboardingUserConfigDTO.setUserId(SecurityUtils.getCurrentUserId());
			createdUserlist = onboardingUserConfigService.saveOnboardingUserInfo(onboardingUserConfigDTO);
		}catch(Exception cve){
			String msg = "Error while creating Onboarding user,Please check the information";
			throw new TimesheetException(cve,onboardingUserConfigDTO);
			
		}
	return new ResponseEntity<>(HttpStatus.CREATED);
	}
}
