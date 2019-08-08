package com.ts.app.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
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

@Service
@Transactional
public class OnboardingUserConfigService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(OnboardingUserConfigService.class);
	
	@Inject
	OnboardingUserConfigRepository onboardingUserConfigRepository;
	
	@Inject
	MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;
		
	public OnboardingUserConfigDTO saveOnboardingUserInfo(OnboardingUserConfigDTO onboardingUserConfigDTO) {
		OnboardingUserConfig onboardingUserList = mapperUtil.toEntity(onboardingUserConfigDTO, OnboardingUserConfig.class);
		onboardingUserList.setActive(OnboardingUserConfig.ACTIVE_YES);
		onboardingUserList = onboardingUserConfigRepository.save(onboardingUserList);
		onboardingUserConfigDTO = mapperUtil.toModel(onboardingUserList, OnboardingUserConfigDTO.class);
		return onboardingUserConfigDTO;
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
		onboardingUserConfigDTO.setUserId(onboardingUserConfig.getUserId());
		onboardingUserConfigDTO.setElement(onboardingUserConfig.getElement());
		onboardingUserConfigDTO.setElementParent(onboardingUserConfig.getElementParent());
		onboardingUserConfigDTO.setElementType(onboardingUserConfig.getElementType());
		return onboardingUserConfigDTO;
	}
	
	private void mapToEntity(OnboardingUserConfigDTO onboardingUserConfigDTO,OnboardingUserConfig onboardingUserConfig) {		
		onboardingUserConfig.setUserId(onboardingUserConfigDTO.getUserId());
		onboardingUserConfig.setElement(onboardingUserConfigDTO.getElement());
		onboardingUserConfig.setElementParent(onboardingUserConfigDTO.getElementParent());
		onboardingUserConfig.setElementType(onboardingUserConfigDTO.getElementType());
	}
}
