package com.ts.app.service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.User;
import com.ts.app.domain.UserRole;
import com.ts.app.repository.UserRepository;
import com.ts.app.repository.UserRoleRepository;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.UserRoleDTO;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.inject.Inject;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for managing user role information.
 */
@Service
@Transactional
public class UserRoleService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(UserRoleService.class);

	@Inject
	private UserRoleRepository userRoleRepository;

	@Inject
    private UserRepository userRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	public UserRoleDTO createUserRoleInformation(UserRoleDTO userRoleDto) {
		UserRole userRole = mapperUtil.toEntity(userRoleDto, UserRole.class);
		userRole.setActive(UserRole.ACTIVE_YES);
        userRole = userRoleRepository.save(userRole);
		log.debug("Created Information for UserRole: {}", userRole);
		userRoleDto = mapperUtil.toModel(userRole, UserRoleDTO.class);
		return userRoleDto;
	}

	public boolean isDuplicate(UserRoleDTO userRoleDTO) {
		SearchCriteria criteria = new SearchCriteria();
		criteria.setRole(userRoleDTO.getName());
		SearchResult<UserRoleDTO> searchResults = findBySearchCrieria(criteria);
		List<UserRoleDTO> userRoleDTOS = searchResults.getTransactions();
		if(searchResults != null && CollectionUtils.isNotEmpty(searchResults.getTransactions())) {
			return true;
		}
		return false;
	}

	public void updateUserRole(UserRoleDTO userRole) {
		log.debug("Inside Update");
		UserRole userRoleUpdate = userRoleRepository.findOne(userRole.getId());
		userRoleUpdate.setDescription(userRole.getDescription());
		userRoleUpdate.setRoleLevel(userRole.getRoleLevel());
		userRoleRepository.saveAndFlush(userRoleUpdate);
	}

	public void deleteUserRole(Long id) {
		log.debug("Inside Delete");
		UserRole userRoleUpdate = userRoleRepository.findOne(id);
        userRoleUpdate.setActive(UserRole.ACTIVE_NO);
		userRoleRepository.save(userRoleUpdate);
	}

	public List<UserRoleDTO> findAll() {
		List<UserRole> entities = userRoleRepository.findActiveUserRoles();
		return mapperUtil.toModelList(entities, UserRoleDTO.class);
	}

    public List<UserRoleDTO> findAndExclude() {
        List<UserRole> entities = userRoleRepository.findExcludeAdminRole();
        return mapperUtil.toModelList(entities, UserRoleDTO.class);
    }

	public UserRoleDTO findOne(Long id) {
		UserRole entity = userRoleRepository.findOne(id);
		return mapperUtil.toModel(entity, UserRoleDTO.class);
	}


	public SearchResult<UserRoleDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		SearchResult<UserRoleDTO> result = new SearchResult<UserRoleDTO>();
		if(searchCriteria != null) {


            //----
            Pageable pageRequest = null;
            if(!StringUtils.isEmpty(searchCriteria.getColumnName())){
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" +sort);
                pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);

            }else{
                pageRequest = createPageRequest(searchCriteria.getCurrPage());
            }

			//Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
			Page<UserRole> page = null;
			List<UserRoleDTO> transactions = null;
			if(!searchCriteria.isFindAll()) {
				if(searchCriteria.getUserRoleId() != 0) {

                    page = userRoleRepository.findRoleById(searchCriteria.getUserRoleId(), pageRequest);
				}
				if(!StringUtils.isEmpty(searchCriteria.getRole())) {

                    page = userRoleRepository.findRoleByName(searchCriteria.getRole(), pageRequest);
				}
				if(!StringUtils.isEmpty(searchCriteria.getRoleLevel()) && searchCriteria.getRoleLevel()>0) {

                    page = userRoleRepository.findRoleByLevel(searchCriteria.getRoleLevel(), pageRequest);
				}
			}else {

                page = userRoleRepository.findUserRoles(pageRequest);
			}
			//-----




			if(page != null) {
                transactions = mapperUtil.toModelList(page.getContent(), UserRoleDTO.class);
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}
		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<UserRole> page, List<UserRoleDTO> transactions, SearchResult<UserRoleDTO> result) {
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
