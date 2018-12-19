package com.ts.app.service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.ApplicationAction;
import com.ts.app.repository.ApplicationActionRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.ApplicationActionDTO;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.List;

/**
 * Service class for managing app action information.
 */
@Service
@Transactional
public class ApplicationActionService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(ApplicationActionService.class);

	@Inject
	private ApplicationActionRepository appActionRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	public ApplicationActionDTO createApplicationActionInformation(ApplicationActionDTO appModuleDto) {
		ApplicationAction appModule = mapperUtil.toEntity(appModuleDto, ApplicationAction.class);
		appModule.setActive(ApplicationAction.ACTIVE_YES);
        appModule = appActionRepository.save(appModule);
		log.debug("Created Information for ApplicationAction: {}", appModule);
		appModuleDto = mapperUtil.toModel(appModule, ApplicationActionDTO.class);
		return appModuleDto;
	}

	public void updateApplicationAction(ApplicationActionDTO appModule) {
		log.debug("Inside Update");
		ApplicationAction appModuleUpdate = appActionRepository.findOne(appModule.getId());
		appModuleUpdate.setName(appModule.getName());
		appActionRepository.saveAndFlush(appModuleUpdate);
	}

	public void deleteApplicationAction(Long id) {
		log.debug("Inside Delete");
		ApplicationAction appModuleUpdate = appActionRepository.findOne(id);
        appModuleUpdate.setActive(ApplicationAction.ACTIVE_NO);
		appActionRepository.save(appModuleUpdate);
	}

	public List<ApplicationActionDTO> findAll() {
		List<ApplicationAction> entities = appActionRepository.findAll();
		return mapperUtil.toModelList(entities, ApplicationActionDTO.class);
	}

	public ApplicationActionDTO findOne(Long id) {
		ApplicationAction entity = appActionRepository.findOne(id);
		return mapperUtil.toModel(entity, ApplicationActionDTO.class);
	}


	public SearchResult<ApplicationActionDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		SearchResult<ApplicationActionDTO> result = new SearchResult<ApplicationActionDTO>();
		if(searchCriteria != null) {
			Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
			Page<ApplicationAction> page = null;
			List<ApplicationActionDTO> transactions = null;
			if(!searchCriteria.isFindAll()) {
				if(searchCriteria.getApplicationActionId() != 0) {
					page = appActionRepository.findApplicationActionById(searchCriteria.getApplicationActionId(), pageRequest);
				}
			}else {
				page = appActionRepository.findApplicationActions(pageRequest);
			}
			if(page != null) {
				transactions = mapperUtil.toModelList(page.getContent(), ApplicationActionDTO.class);
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}
		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<ApplicationAction> page, List<ApplicationActionDTO> transactions, SearchResult<ApplicationActionDTO> result) {
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
