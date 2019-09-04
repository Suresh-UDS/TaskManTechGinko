package com.ts.app.web.rest;

import com.ts.app.domain.OnboardingUserConfig;
import com.ts.app.domain.SapBusinessCategories;
import com.ts.app.web.rest.dto.*;
import org.json.JSONException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.codahale.metrics.annotation.Timed;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.OnboardingUserConfigService;
import com.ts.app.web.rest.errors.TimesheetException;

import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

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

    @RequestMapping(value = "/saveOnboardingUserConfigList/{userId}/{branchCode}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> saveOnboardingUserConfigList(@PathVariable("userId") long userId,@PathVariable("branchCode") String branchCode, @Valid @RequestBody List<OnboardingUserConfigDTO> onboardingUserConfigDTO,HttpServletRequest httpServletRequest){
        List<OnboardingUserConfig> createdUserlist = null;
        try {
//            onboardingUserConfigDTO.setUserId(SecurityUtils.getCurrentUserId());
            createdUserlist = onboardingUserConfigService.saveOnBoardingUserConfigList(onboardingUserConfigDTO,userId,branchCode);
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

    @RequestMapping(value = "/onBoardingConfig/getUserDetails/{id}/branch/{branch}",method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<OnboardingUserConfigDTO> getOnBoardingConfigDetailsForUser (@PathVariable ("id") long id,@PathVariable ("branch") String branch) throws JSONException {
        return onboardingUserConfigService.getOnBoardingConfigDetailsForUser(id,branch);
    }

    @RequestMapping(value = "/getBranchListForUser/{id}", method = RequestMethod.GET)
    public List<OnboardingUserConfigDTO> getBranchListForUser(@PathVariable ("id") long id){
        long userId = ( id == 0 ? SecurityUtils.getCurrentUserId() : id );
        List<OnboardingUserConfigDTO> branchList = null;
        try {
        branchList = onboardingUserConfigService.findBranchListByUserId(userId);
        }catch(Exception e){
        	throw new TimesheetException("Error while getting Branch List" + e);
        }
        return branchList;
    }
	
	@RequestMapping(value = "/getProjectListForUser", method = RequestMethod.GET)
	public List<OnboardingUserConfigDTO> getProjectListForUser() {
        long userId = SecurityUtils.getCurrentUserId();
        List<OnboardingUserConfigDTO> projectList = null;
		try {
			projectList = onboardingUserConfigService.findProjectByUserId(userId);
		}catch (Exception e) {
			throw new TimesheetException("Error while getting Project List" + e);
		}
		return projectList;
	}
	
	@RequestMapping(value = "/getWBSListForUser", method = RequestMethod.GET)
	public List<OnboardingUserConfigDTO> getWBSListForUser() {
        long userId = SecurityUtils.getCurrentUserId();
		List<OnboardingUserConfigDTO> wbsList = null;
		try {
			wbsList = onboardingUserConfigService.findWBSByUserId(userId);
		}catch (Exception e) {
			throw new TimesheetException("Error while getting WBS List" + e);
		}
		return wbsList;
	}

    @RequestMapping(value = "/onBoarding/document_image/upload", method = RequestMethod.POST)
    public ResponseEntity<?> upload(@RequestParam("employeeId") long employeeId,
                                    @RequestParam("imageFile") MultipartFile file,
                                    @RequestParam("document_type") String document_type) throws JSONException {
        EmployeeDocumentsDTO employeeDocumentsDTO = new EmployeeDocumentsDTO();
        employeeDocumentsDTO.setDocLocation(file);
        employeeDocumentsDTO.setEmployeeId(employeeId);
        employeeDocumentsDTO.setDocType(document_type);
        log.debug("on boarding employee address proof image update with parameter " + employeeId);
        onboardingUserConfigService.uploadFile(employeeDocumentsDTO);
        return new ResponseEntity<String>(
            "{ \"employee address proof image\" : \"" + employeeDocumentsDTO.getDocName() + "\", \"status\" : \"success\"}", HttpStatus.OK);
    }

    @RequestMapping(value = "/getProjectByBranchCode/{branchCode}", method = RequestMethod.GET)
    public List<OnboardingUserConfigDTO> getProjectListByBranchCode(@PathVariable("branchCode") String branchCode){
	    long userId = SecurityUtils.getCurrentUserId();
	    List<OnboardingUserConfigDTO> projectList = null;
	    try{
	        projectList = onboardingUserConfigService.findProjectByBranchCode(userId,branchCode);
        }catch (Exception e){
	        throw new TimesheetException("Error while getting project list "+e);
        }
	    return projectList;
    }

    @RequestMapping(value = "/getWBSByProjectCode/{projectCode}",method = RequestMethod.GET)
    public List<OnboardingUserConfigDTO> getWBSByProjectCode(@PathVariable("projectCode") String projectCode){
        long userId = SecurityUtils.getCurrentUserId();
        List<OnboardingUserConfigDTO> projectList = null;
        try{
            projectList = onboardingUserConfigService.findWBSByProjectCode(userId,projectCode);
        }catch (Exception e){
            throw new TimesheetException("Error while getting WBS list "+e);
        }
        return projectList;
    }
	
}
