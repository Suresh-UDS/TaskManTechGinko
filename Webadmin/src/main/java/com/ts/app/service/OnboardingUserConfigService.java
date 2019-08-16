package com.ts.app.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import com.ts.app.domain.SapBusinessCategories;
import com.ts.app.domain.User;
import com.ts.app.repository.SapBusinessCategoriesRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.security.SecurityUtils;
import org.apache.commons.collections.CollectionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Asset;
import com.ts.app.domain.OnboardingUserConfig;
import com.ts.app.repository.OnboardingUserConfigRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.AssetDTO;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.OnboardingUserConfigDTO;

import java.util.ArrayList;
import java.util.List;

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
	MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;
		
	public OnboardingUserConfigDTO saveOnboardingUserInfo(OnboardingUserConfigDTO onboardingUserConfigDTO) {
		OnboardingUserConfig onboardingUserList = mapperUtil.toEntity(onboardingUserConfigDTO, OnboardingUserConfig.class);
		onboardingUserList.setActive(OnboardingUserConfig.ACTIVE_YES);
		onboardingUserList = onboardingUserConfigRepository.save(onboardingUserList);
		onboardingUserConfigDTO = mapperUtil.toModel(onboardingUserList, OnboardingUserConfigDTO.class);
		return onboardingUserConfigDTO;
	}

	public List<OnboardingUserConfig> saveOnBoardingUserConfigList(List<OnboardingUserConfigDTO> onboardingUserConfigDTOList){
	    OnboardingUserConfigDTO userConfigDTO = new OnboardingUserConfigDTO();
	    List<OnboardingUserConfig> responseUserConfig = new ArrayList<>();
	    OnboardingUserConfigDTO userConfigDTO1 = new OnboardingUserConfigDTO();
	    User user = userRepository.findOne(SecurityUtils.getCurrentUserId());
        if(clearAllUserConfigs(SecurityUtils.getCurrentUserId())){
            for(OnboardingUserConfigDTO onboardingUserConfigDTO: onboardingUserConfigDTOList){
            OnboardingUserConfig userConfig = new OnboardingUserConfig();
                userConfig = mapperUtil.toEntity(onboardingUserConfigDTO, OnboardingUserConfig.class);
                userConfig.setUser(user);
                userConfig.setActive(OnboardingUserConfig.ACTIVE_YES);
                userConfig = onboardingUserConfigRepository.save(userConfig);
                responseUserConfig.add(userConfig);
            if(CollectionUtils.isNotEmpty(onboardingUserConfigDTO.getChildElements()) && onboardingUserConfigDTO.getChildElements().size()>0){
                for(OnboardingUserConfigDTO configDTO : onboardingUserConfigDTO.getChildElements()){
                    userConfig = mapperUtil.toEntity(configDTO, OnboardingUserConfig.class);
                    userConfig.setElementParent(onboardingUserConfigDTO.getElement());
                    userConfig.setUser(user);
                    userConfig.setActive(OnboardingUserConfig.ACTIVE_YES);
                    userConfig=onboardingUserConfigRepository.save(userConfig);
                    responseUserConfig.add(userConfig);
                }
                }
            }
        }


        return responseUserConfig;
    }

	public List<OnboardingUserConfigDTO> findBranchListByUserId(long userId) {
		List <OnboardingUserConfig> branchModel = onboardingUserConfigRepository.findbranchListByUserId(userId);
		List<OnboardingUserConfigDTO> branchList = mapperUtil.toModelList(branchModel, OnboardingUserConfigDTO.class);
		return branchList;
	}
	
	public List<OnboardingUserConfigDTO> findProjectByBranchId(long userId) {
		List<OnboardingUserConfig> projectModel = onboardingUserConfigRepository.findProjectByBranchId(userId);
		List<OnboardingUserConfigDTO> projectList = mapperUtil.toModelList(projectModel, OnboardingUserConfigDTO.class);
		return projectList;
	}
	
	public List<OnboardingUserConfigDTO> findWBSByProjectId(long userId){
		List<OnboardingUserConfig> wbsModel = onboardingUserConfigRepository.findWBSByProjectId(userId);
		List<OnboardingUserConfigDTO> wbsList = mapperUtil.toModelList(wbsModel, OnboardingUserConfigDTO.class);
		return wbsList;
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

    public List<OnboardingUserConfigDTO> getOnBoardingConfigDetailsForUser(long userId) throws JSONException {
        List<OnboardingUserConfig> userConfigs = onboardingUserConfigRepository.findElementParentsByUserId(userId); // Get all element parents for the user id
        List<OnboardingUserConfigDTO> userConfigDTOS = mapperUtil.toModelList(userConfigs, OnboardingUserConfigDTO.class);
        List<SapBusinessCategories> sapBusinessCategories1 = sapBusinessCategoriesRepository.findLatest();
        SapBusinessCategories sapBusinessCategories = sapBusinessCategories1.get(0);
        JSONArray ja = new JSONArray(sapBusinessCategories.getElementsJson());

//        for(OnboardingUserConfigDTO userConfig: userConfigDTOS){
//            List<OnboardingUserConfig> userConfigs1 = onboardingUserConfigRepository.findElementChildsByUserId(userId,userConfig.getElementParent());
//            userConfig.setChildElements(mapperUtil.toModelList(userConfigs1, OnboardingUserConfigDTO.class));
//
//        }
        return userConfigDTOS;
    }

    public boolean clearAllUserConfigs(long userId){
	    try {
            onboardingUserConfigRepository.deleteByUserId(userId);
            return true;
        }catch (Exception e){
	        log.debug("Error in deleting configs"+e);
	        return false;
        }
    }

}
