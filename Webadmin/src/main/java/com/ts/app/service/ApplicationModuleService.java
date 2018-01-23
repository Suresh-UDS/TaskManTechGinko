package com.ts.app.service;

import java.util.List;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.ApplicationModule;
import com.ts.app.repository.ApplicationModuleRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.ApplicationModuleDTO;

/**
 * Service class for managing app module information.
 */
@Service
@Transactional
public class ApplicationModuleService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(ApplicationModuleService.class);

	@Inject
	private ApplicationModuleRepository appModuleRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	public ApplicationModuleDTO createApplicationModuleInformation(ApplicationModuleDTO appModuleDto) {
		ApplicationModule appModule = mapperUtil.toEntity(appModuleDto, ApplicationModule.class);
		appModule.setActive(ApplicationModule.ACTIVE_YES);
        appModule = appModuleRepository.save(appModule);
		log.debug("Created Information for ApplicationModule: {}", appModule);
		appModuleDto = mapperUtil.toModel(appModule, ApplicationModuleDTO.class);
		return appModuleDto;
	}

	public void updateApplicationModule(ApplicationModuleDTO appModule) {
		log.debug("Inside Update");
		ApplicationModule appModuleUpdate = appModuleRepository.findOne(appModule.getId());
		appModuleUpdate.setName(appModule.getName());
		appModuleRepository.saveAndFlush(appModuleUpdate);
	}

	public void deleteApplicationModule(Long id) {
		log.debug("Inside Delete");
		ApplicationModule appModuleUpdate = appModuleRepository.findOne(id);
        appModuleUpdate.setActive(ApplicationModule.ACTIVE_NO);
		appModuleRepository.save(appModuleUpdate);
	}

	public List<ApplicationModuleDTO> findAll() {
		List<ApplicationModule> entities = appModuleRepository.findActiveApplicationModules();
		return mapperUtil.toModelList(entities, ApplicationModuleDTO.class);
	}

	public ApplicationModuleDTO findOne(Long id) {
		ApplicationModule entity = appModuleRepository.findOne(id);
		return mapperUtil.toModel(entity, ApplicationModuleDTO.class);
	}


	public SearchResult<ApplicationModuleDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		SearchResult<ApplicationModuleDTO> result = new SearchResult<ApplicationModuleDTO>();
		if(searchCriteria != null) {
			Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
			Page<ApplicationModule> page = null;
			List<ApplicationModuleDTO> transactions = null;
			if(!searchCriteria.isFindAll()) {
				if(searchCriteria.getApplicationModuleId() != 0) {
					page = appModuleRepository.findApplicationModuleById(searchCriteria.getApplicationModuleId(), pageRequest);
				}
			}else {
				page = appModuleRepository.findApplicationModules(pageRequest);
			}
			if(page != null) {
				transactions = mapperUtil.toModelList(page.getContent(), ApplicationModuleDTO.class);
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}
		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<ApplicationModule> page, List<ApplicationModuleDTO> transactions, SearchResult<ApplicationModuleDTO> result) {
		if(page != null) {
			result.setTotalPages(page.getTotalPages());
		}
		result.setCurrPage(page.getNumber() + 1);
		result.setTotalCount(page.getTotalElements());
        result.setStartInd((result.getCurrPage() - 1) * 10 + 1);
        result.setEndInd((result.getTotalCount() > 10  ? (result.getCurrPage()) * 10 : result.getTotalCount()));

		result.setTransactions(transactions);
		return;
	}


}
