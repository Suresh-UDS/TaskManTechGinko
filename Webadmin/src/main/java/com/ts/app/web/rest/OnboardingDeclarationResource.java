package com.ts.app.web.rest;

import java.util.List;

import javax.inject.Inject;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ts.app.service.OnboardingDeclarationService;
import com.ts.app.web.rest.dto.OnboardingDeclarationDTO;
import com.ts.app.web.rest.errors.TimesheetException;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class OnboardingDeclarationResource {
	
	@Inject
	OnboardingDeclarationService onboardingDeclarationService;

	@RequestMapping(value = "/getDeclarationForm",method = RequestMethod.GET)
	public List<OnboardingDeclarationDTO> getDeclarationForm(){
		List<OnboardingDeclarationDTO> declarationList = null;
		try {
			 declarationList = onboardingDeclarationService.getDeclarationList();
		}catch(Exception e) {
			throw new TimesheetException("Error while getting Branch List" + e);
		}
		return declarationList;
	}
}
