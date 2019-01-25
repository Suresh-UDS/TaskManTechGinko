package com.ts.app.service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.UserGroup;
import com.ts.app.repository.UserGroupRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.UserGroupDTO;
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
 * Service class for managing user group information.
 */
@Service
@Transactional
public class UserGroupService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(UserGroupService.class);

	@Inject
	private UserGroupRepository userGroupRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	public UserGroupDTO createUserGroupInformation(UserGroupDTO userGroupDto) {
		UserGroup userGroup = mapperUtil.toEntity(userGroupDto, UserGroup.class);
		userGroup.setActive(UserGroup.ACTIVE_YES);
        userGroup = userGroupRepository.save(userGroup);
		log.debug("Created Information for UserGroup: {}", userGroup);
		userGroupDto = mapperUtil.toModel(userGroup, UserGroupDTO.class);
		return userGroupDto;
	}

	public void updateUserGroup(UserGroupDTO userGroup) {
		log.debug("Inside Update");
		UserGroup userGroupUpdate = userGroupRepository.findOne(userGroup.getId());
		userGroupUpdate.setName(userGroup.getName());
		userGroupRepository.saveAndFlush(userGroupUpdate);
	}

	public void deleteUserGroup(Long id) {
		log.debug("Inside Delete");
		UserGroup userGroupUpdate = userGroupRepository.findOne(id);
        userGroupUpdate.setActive(UserGroup.ACTIVE_NO);
		userGroupRepository.save(userGroupUpdate);
	}

	public List<UserGroupDTO> findAll() {
		List<UserGroup> entities = userGroupRepository.findActiveUserGroups();
		return mapperUtil.toModelList(entities, UserGroupDTO.class);
	}

	public UserGroupDTO findOne(Long id) {
		UserGroup entity = userGroupRepository.findOne(id);
		return mapperUtil.toModel(entity, UserGroupDTO.class);
	}


	public SearchResult<UserGroupDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		SearchResult<UserGroupDTO> result = new SearchResult<UserGroupDTO>();
		if(searchCriteria != null) {
			Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
			Page<UserGroup> page = null;
			List<UserGroupDTO> transactions = null;
			if(!searchCriteria.isFindAll()) {
				if(searchCriteria.getUserGroupId() != 0) {
					page = userGroupRepository.findGroupsById(searchCriteria.getUserGroupId(), pageRequest);
				}
			}else {
				page = userGroupRepository.findUserGroups(pageRequest);
			}
			if(page != null) {
				transactions = mapperUtil.toModelList(page.getContent(), UserGroupDTO.class);
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}
		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<UserGroup> page, List<UserGroupDTO> transactions, SearchResult<UserGroupDTO> result) {
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
