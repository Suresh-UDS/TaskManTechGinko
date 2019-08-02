package com.ts.app.service;

import javax.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.OnboardingUserConfig;
import com.ts.app.repository.OnboardingUserConfigRepository;
import com.ts.app.service.util.MapperUtil;
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
