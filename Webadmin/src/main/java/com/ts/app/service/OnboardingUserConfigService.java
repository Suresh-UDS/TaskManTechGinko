package com.ts.app.service;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import com.ts.app.domain.*;
import com.ts.app.repository.*;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.util.AmazonS3Utils;
import com.ts.app.web.rest.dto.*;
import org.apache.commons.collections.CollectionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ts.app.service.util.MapperUtil;

@Service
@Transactional
public class OnboardingUserConfigService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(OnboardingUserConfigService.class);
	
	@Inject
	OnboardingUserConfigRepository onboardingUserConfigRepository;

	@Inject
    SapBusinessCategoriesRepository sapBusinessCategoriesRepository;

	@Inject
    UserRepository userRepository;

    @Inject
    EmployeeRepository employeeRepository;

    @Inject
    EmployeeDocumentRepository employeeDocumentRepository;
	
	@Inject
	MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

    @Inject
    private AmazonS3Utils amazonS3utils;
		
	public OnboardingUserConfigDTO saveOnboardingUserInfo(OnboardingUserConfigDTO onboardingUserConfigDTO) {
		OnboardingUserConfig onboardingUserList = mapperUtil.toEntity(onboardingUserConfigDTO, OnboardingUserConfig.class);
		onboardingUserList.setActive(OnboardingUserConfig.ACTIVE_YES);
		onboardingUserList = onboardingUserConfigRepository.save(onboardingUserList);
		onboardingUserConfigDTO = mapperUtil.toModel(onboardingUserList, OnboardingUserConfigDTO.class);
		return onboardingUserConfigDTO;
	}

	public List<OnboardingUserConfig> saveOnBoardingUserConfigList(List<OnboardingUserConfigDTO> onboardingUserConfigDTOList,long userId){
	    OnboardingUserConfigDTO userConfigDTO = new OnboardingUserConfigDTO();
	    List<OnboardingUserConfig> responseUserConfig = new ArrayList<>();
	    OnboardingUserConfigDTO userConfigDTO1 = new OnboardingUserConfigDTO();
	    User user = userRepository.findOne(userId);
	    
	    if(onboardingUserConfigDTOList.size() > 0) {
	    
	        if(clearAllUserConfigs(userId,onboardingUserConfigDTOList.get(0).getBranch())){
	            for(OnboardingUserConfigDTO onboardingUserConfigDTO: onboardingUserConfigDTOList){
	            	OnboardingUserConfig userConfig = new OnboardingUserConfig();
	                userConfig = mapperUtil.toEntity(onboardingUserConfigDTO, OnboardingUserConfig.class);
	                userConfig.setUser(user);
	                userConfig.setActive(OnboardingUserConfig.ACTIVE_YES);
	                userConfig = onboardingUserConfigRepository.save(userConfig);
	                responseUserConfig.add(userConfig);
	       
	            }
	        }
	    }


        return responseUserConfig;
    }

	public List<OnboardingUserConfigDTO> findBranchListByUserId(long userId) {
		List <OnboardingUserConfig> branchModel = onboardingUserConfigRepository.findBranchByUserId(userId);
        return mapperUtil.toModelList(branchModel, OnboardingUserConfigDTO.class);
	}
	
	public List<OnboardingUserConfigDTO> findProjectByUserId(long userId) {
		List<OnboardingUserConfig> projectModel = onboardingUserConfigRepository.findProjectByUserId(userId);
        return mapperUtil.toModelList(projectModel, OnboardingUserConfigDTO.class);
	}
	
	public List<OnboardingUserConfigDTO> findWBSByUserId(long userId){
		List<OnboardingUserConfig> wbsModel = onboardingUserConfigRepository.findWBSByUserId(userId);
        return mapperUtil.toModelList(wbsModel, OnboardingUserConfigDTO.class);
	}

	public List<OnboardingUserConfigDTO> findProjectByBranchCode(long userId, String branchCode){
	    List<OnboardingUserConfig> projectList = onboardingUserConfigRepository.findProjectByBranchId(userId, branchCode);
	    return mapperUtil.toModelList(projectList, OnboardingUserConfigDTO.class);
    }

    public List<String> findProjectCodesByBranch(long userId, String branchCode){
        List<String> projectCodes = onboardingUserConfigRepository.findProjectCodesByBranch(userId, branchCode);
        return projectCodes;
    }

    public List<String> findProjectCodesByUser(long userId){
        List<String> projectCodes = onboardingUserConfigRepository.findProjectCodesByUser(userId);
        return projectCodes;
    }

    public List<String> findWBSCodesByUser(long userId){
        List<String> projectCodes = onboardingUserConfigRepository.findWBSCodesByUser(userId);
        return projectCodes;
    }

    public List<String> findWbsCodesByProjectAndBranch(long userId, String branchCode, String projectCode){
        List<String> wbsCodes = onboardingUserConfigRepository.findWbsCodesByBranchAndProject(userId,  projectCode);
        return wbsCodes;
    }

    public List<OnboardingUserConfigDTO> findWBSByProjectCode(long userId, String projectCode){
        List<OnboardingUserConfig> projectList = onboardingUserConfigRepository.findWBSByProjectId(userId, projectCode);
        return mapperUtil.toModelList(projectList, OnboardingUserConfigDTO.class);
    }
	
	public OnboardingUserConfigDTO mapToModal(OnboardingUserConfig onboardingUserConfig,boolean includeShifts) {
		OnboardingUserConfigDTO onboardingUserConfigDTO = new OnboardingUserConfigDTO();
		onboardingUserConfigDTO.setId(onboardingUserConfig.getId());
		onboardingUserConfigDTO.setUserId(onboardingUserConfig.getUser().getId());
		onboardingUserConfigDTO.setElement(onboardingUserConfig.getElement());
		onboardingUserConfigDTO.setElementParent(onboardingUserConfig.getElementParent());
		onboardingUserConfigDTO.setElementType(onboardingUserConfig.getElementType());
		return onboardingUserConfigDTO;
	}
	
	private void mapToEntity(OnboardingUserConfigDTO onboardingUserConfigDTO,OnboardingUserConfig onboardingUserConfig) {		
		onboardingUserConfig.setUser(userRepository.findOne(onboardingUserConfigDTO.getUserId()));
		onboardingUserConfig.setElement(onboardingUserConfigDTO.getElement());
		onboardingUserConfig.setElementParent(onboardingUserConfigDTO.getElementParent());
		onboardingUserConfig.setElementType(onboardingUserConfigDTO.getElementType());
	}

	public SapBusinessCategories getOnBoardingConfigDetails(){
	    List<SapBusinessCategories> sapBusinessCategories = sapBusinessCategoriesRepository.findLatest();

        return sapBusinessCategories.get(0);

    }
	
	public String getParentElementOfProject(String elementCode,long userId){
		
		List<String> parentCodeList = onboardingUserConfigRepository.getParentElementOfProject(elementCode, userId);
		 	
		if(parentCodeList.size() > 0) {
			
			return parentCodeList.get(0);
			
		}
		else {
			
			return "";
		}
	
	}

    public List<OnboardingUserConfigDTO> getOnBoardingConfigDetailsForUser(long userId,String branch) throws JSONException {
        List<OnboardingUserConfig> userConfigs = onboardingUserConfigRepository.findElementParentsByUserIdAndBranch(userId,branch); // Get all element parents for the user id
        List<OnboardingUserConfigDTO> userConfigDTOS = mapperUtil.toModelList(userConfigs, OnboardingUserConfigDTO.class);

//        for(OnboardingUserConfigDTO userConfig: userConfigDTOS){
//            List<OnboardingUserConfig> userConfigs1 = onboardingUserConfigRepository.findElementChildsByUserId(userId,userConfig.getElementParent());
//            userConfig.setChildElements(mapperUtil.toModelList(userConfigs1, OnboardingUserConfigDTO.class));
//
//        }
        return userConfigDTOS;
    }

    public boolean clearAllUserConfigs(long userId,String branch){
	    try {
            onboardingUserConfigRepository.deleteByUserIdAndBranch(userId,branch);
            return true;
        }catch (Exception e){
	        log.debug("Error in deleting configs"+e);
	        return false;
        }
    }

    @Transactional
    public EmployeeDocumentsDTO uploadFile(EmployeeDocumentsDTO employeeDTO) throws JSONException {

	    if(checkImageExists(employeeDTO.getEmployeeId(),employeeDTO.getDocType())){
	        log.debug("image already exisits and made active false");
        }else{
	        log.debug("no images exisists");
        }

        log.debug("employee address proof images upload to AWS s3 -"+employeeDTO.getEmployeeId());
        employeeDTO = amazonS3utils.uploadEmployeeAddressProofImage(employeeDTO.getEmployeeId(), employeeDTO.getDocLocation(), employeeDTO);
//        employeeDTO.setDocLocation(employeeDTO.getDocLocation());
        employeeDTO.setDocUrl(employeeDTO.getDocUrl());
        employeeDTO.setActive(EmployeeDocuments.ACTIVE_YES);
        EmployeeDocuments employeeDocuments = mapperUtil.toEntity(employeeDTO,EmployeeDocuments.class);
        employeeDocumentRepository.save(employeeDocuments);
        employeeDTO.setDocName(employeeDTO.getDocName());
        employeeDTO.setDocType(employeeDTO.getDocType());
        employeeDTO.setDocUrl(employeeDTO.getDocUrl());
        return employeeDTO;
    }

    public boolean checkImageExists(long employeeId, String document_type){
	    EmployeeDocuments employeeDocuments = employeeDocumentRepository.findByEmployeeIdAndDocumentType(employeeId, document_type);
        if(employeeDocuments !=null && employeeDocuments.getId()>0){
            employeeDocuments.setActive(EmployeeDocuments.ACTIVE_NO);
            employeeDocumentRepository.saveAndFlush(employeeDocuments);
            return true;
        }else{
            return false;
        }
    }





}
