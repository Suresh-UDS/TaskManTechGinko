package com.ts.app.service;

import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.OnboardingDeclaration;
import com.ts.app.repository.OnboardingDeclarationRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.OnboardingDeclarationDTO;

@Service
public class OnboardingDeclarationService {
	
	@Inject
	OnboardingDeclarationRepository onboardingDeclarationRepository;
	
	@Inject
	MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;
	
	public List<OnboardingDeclarationDTO> getDeclarationList() {
		List<OnboardingDeclaration> declarationModel = onboardingDeclarationRepository.getDeclartionList();
		List<OnboardingDeclarationDTO> declarationList = mapperUtil.toModelList(declarationModel, OnboardingDeclarationDTO.class);
		return declarationList;
	}
	
	public OnboardingDeclarationDTO getListByLangauge(String language){
		
		OnboardingDeclaration declarationModel = onboardingDeclarationRepository.findByLanguageAndActive(language, "Y");
		OnboardingDeclarationDTO declarationList = mapperUtil.toModel(declarationModel, OnboardingDeclarationDTO.class);
		return declarationList;
	}
}
