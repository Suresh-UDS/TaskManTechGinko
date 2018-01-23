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
import com.ts.app.domain.ApplicationAction;
import com.ts.app.domain.ApplicationModule;
import com.ts.app.domain.UserRolePermission;
import com.ts.app.repository.ApplicationActionRepository;
import com.ts.app.repository.ApplicationModuleRepository;
import com.ts.app.repository.UserRolePermissionRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.UserRolePermissionDTO;

/**
 * Service class for managing user role permission information.
 */
@Service
@Transactional
public class UserRolePermissionService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(UserRolePermissionService.class);

	@Inject
	private UserRolePermissionRepository userRolePermissionRepository;
	
	@Inject
	private ApplicationModuleRepository moduleRepository;

	@Inject
	private ApplicationActionRepository actionRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	public UserRolePermissionDTO createUserRolePermissionInformation(UserRolePermissionDTO userRolePermissionDto) {
		UserRolePermission userRolePermission = mapperUtil.toEntity(userRolePermissionDto, UserRolePermission.class);
		userRolePermission.setActive(UserRolePermission.ACTIVE_YES);
        userRolePermission = userRolePermissionRepository.save(userRolePermission);
		log.debug("Created Information for UserRolePermission: {}", userRolePermission);
		userRolePermissionDto = mapperUtil.toModel(userRolePermission, UserRolePermissionDTO.class);
		return userRolePermissionDto;
	}

	public void updateUserRolePermission(UserRolePermissionDTO userRolePermission) {
		log.debug("Inside Update");
		UserRolePermission userRolePermUpdate = userRolePermissionRepository.findOne(userRolePermission.getId());
		ApplicationModule module = moduleRepository.findOne(userRolePermission.getModuleId());
		ApplicationAction action = actionRepository.findOne(userRolePermission.getActionId());
		userRolePermUpdate.setModule(module);
		userRolePermUpdate.setAction(action);
		userRolePermissionRepository.saveAndFlush(userRolePermUpdate);
	}

	public void deleteUserRolePermission(Long id) {
		log.debug("Inside Delete");
		UserRolePermission userRoleUpdate = userRolePermissionRepository.findOne(id);
        userRoleUpdate.setActive(UserRolePermission.ACTIVE_NO);
		userRolePermissionRepository.save(userRoleUpdate);
	}

	public List<UserRolePermissionDTO> findAll() {
		List<UserRolePermission> entities = userRolePermissionRepository.findActiveUserRolePermissions();
		return mapperUtil.toModelList(entities, UserRolePermissionDTO.class);
	}

	public UserRolePermissionDTO findOne(Long id) {
		UserRolePermission entity = userRolePermissionRepository.findOne(id);
		return mapperUtil.toModel(entity, UserRolePermissionDTO.class);
	}


	public SearchResult<UserRolePermissionDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		SearchResult<UserRolePermissionDTO> result = new SearchResult<UserRolePermissionDTO>();
		if(searchCriteria != null) {
			Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
			Page<UserRolePermission> page = null;
			List<UserRolePermissionDTO> transactions = null;
			if(!searchCriteria.isFindAll()) {
				if(searchCriteria.getUserRolePermissionId() != 0) {
					page = userRolePermissionRepository.findUserRolePermissionById(searchCriteria.getUserRolePermissionId(), pageRequest);
				}
			}else {
				page = userRolePermissionRepository.findUserRolePermissions(pageRequest);
			}
			if(page != null) {
				transactions = mapperUtil.toModelList(page.getContent(), UserRolePermissionDTO.class);
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}
		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<UserRolePermission> page, List<UserRolePermissionDTO> transactions, SearchResult<UserRolePermissionDTO> result) {
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
