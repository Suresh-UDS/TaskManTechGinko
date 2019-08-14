package com.ts.app.web.rest;

import com.ts.app.domain.OnboardingUserConfig;
import com.ts.app.domain.SapBusinessCategories;
import org.json.JSONException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.OnboardingUserConfigService;
import com.ts.app.web.rest.dto.OnboardingUserConfigDTO;
import com.ts.app.web.rest.errors.TimesheetException;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

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

    @RequestMapping(value = "/saveOnboardingUserConfigList", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> saveOnboardingUserConfigList(@Valid @RequestBody List<OnboardingUserConfigDTO> onboardingUserConfigDTO,HttpServletRequest httpServletRequest){
        List<OnboardingUserConfig> createdUserlist = null;
        try {
//            onboardingUserConfigDTO.setUserId(SecurityUtils.getCurrentUserId());
            createdUserlist = onboardingUserConfigService.saveOnBoardingUserConfigList(onboardingUserConfigDTO);
        }catch(Exception cve){
            String msg = "Error while creating Onboarding user,Please check the information";
//            throw new TimesheetException(cve,onboardingUserConfigDTO);
            log.debug("Error "+msg);


        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

	@RequestMapping(value = "/onBoardingConfig/getDetails",method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public SapBusinessCategories getOnBoardingConfigDetails(){

        return onboardingUserConfigService.getOnBoardingConfigDetails();
    }

    @RequestMapping(value = "/onBoardingConfig/getUserDetails/{id}",method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<OnboardingUserConfigDTO> getOnBoardingConfigDetailsForUser (@PathVariable ("id") long id) throws JSONException {
        return onboardingUserConfigService.getOnBoardingConfigDetailsForUser(id);
    }
}
