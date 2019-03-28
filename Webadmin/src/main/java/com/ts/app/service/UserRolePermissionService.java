package com.ts.app.service;

import com.ts.app.domain.*;
import com.ts.app.repository.ApplicationActionRepository;
import com.ts.app.repository.ApplicationModuleRepository;
import com.ts.app.repository.UserRolePermissionRepository;
import com.ts.app.repository.UserRoleRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.*;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
	private UserRoleRepository userRoleRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	public UserRolePermissionDTO createUserRolePermissionInformation(UserRolePermissionDTO userRolePermissionDto) {
		//UserRolePermission userRolePermission = mapperUtil.toEntity(userRolePermissionDto, UserRolePermission.class);
		UserRole role = userRoleRepository.findOne(userRolePermissionDto.getRoleId());
		if(CollectionUtils.isNotEmpty(role.getRolePermissions())) {
			updateUserRolePermission(userRolePermissionDto);
		}else {
			List<UserRolePermission> permissions = new ArrayList<UserRolePermission>();
			for(ApplicationModuleDTO moduleDto : userRolePermissionDto.getApplicationModules()) {
				ApplicationModule module = moduleRepository.findOne(moduleDto.getId());
				for(ApplicationActionDTO actionDto : moduleDto.getModuleActions()) {
					UserRolePermission userRolePermission = new UserRolePermission();
					userRolePermission.setRole(role);
					userRolePermission.setModule(module);
					ApplicationAction action = actionRepository.findOne(actionDto.getId()); 
					userRolePermission.setAction(action);
					userRolePermission.setActive(UserRolePermission.ACTIVE_YES);
					permissions.add(userRolePermission);
				}
			}
	        List<UserRolePermission> userRolePermissions = userRolePermissionRepository.save(permissions);
			log.debug("Created Information for UserRolePermission: {}", userRolePermissions);
		}
		//userRolePermissionDto = mapperUtil.toModel(userRolePermission, UserRolePermissionDTO.class);
		return userRolePermissionDto;
	}

	public void updateUserRolePermission(UserRolePermissionDTO userRolePermissionDto) {
		log.debug("Inside Update");
		//delete existing permissions
		userRolePermissionRepository.deleteByRoleId(userRolePermissionDto.getRoleId());
		UserRole role = userRoleRepository.findOne(userRolePermissionDto.getRoleId());
		List<UserRolePermission> permissions = new ArrayList<UserRolePermission>();
		for(ApplicationModuleDTO moduleDto : userRolePermissionDto.getApplicationModules()) {
			ApplicationModule module = moduleRepository.findOne(moduleDto.getId());
			for(ApplicationActionDTO actionDto : moduleDto.getModuleActions()) {
				UserRolePermission userRolePermission = new UserRolePermission();
				userRolePermission.setRole(role);
				userRolePermission.setModule(module);
				ApplicationAction action = actionRepository.findOne(actionDto.getId()); 
				userRolePermission.setAction(action);
				userRolePermission.setActive(UserRolePermission.ACTIVE_YES);
				permissions.add(userRolePermission);
			}
		}
        List<UserRolePermission> userRolePermissions = userRolePermissionRepository.save(permissions);
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


	public UserRolePermissionDTO findBySearchCrieria(SearchCriteria searchCriteria) {
		UserRolePermissionDTO permDto = new UserRolePermissionDTO();
		if(searchCriteria != null) {
			Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage(), 1000);
			Page<UserRolePermission> page = null;
			if(!searchCriteria.isFindAll()) {
				if(searchCriteria.getUserRoleId() != 0) {
					page = userRolePermissionRepository.findUserRolePermissionByRoleId(searchCriteria.getUserRoleId(), pageRequest);
				}
			}else {
				page = userRolePermissionRepository.findUserRolePermissions(pageRequest);
			}
			if(page != null) {
				List<UserRolePermission> permissions = page.getContent();
				Map<Long, ApplicationModuleDTO> moduleMap = new HashMap<Long, ApplicationModuleDTO>();
				for(UserRolePermission permission : permissions) {
					if(permDto.getRoleId() == 0) {
						permDto.setRoleId(permission.getRole().getId());
						permDto.setRoleName(permission.getRole().getName());
					}
					ApplicationModule module = permission.getModule();
					ApplicationModuleDTO moduleDto = mapperUtil.toModel(module, ApplicationModuleDTO.class);
					ApplicationAction action = permission.getAction();
					ApplicationActionDTO actionDto = mapperUtil.toModel(action, ApplicationActionDTO.class);
					if(CollectionUtils.isNotEmpty(moduleDto.getModuleActions())){
						moduleDto.getModuleActions().clear();
					}
					if(moduleMap.containsKey(module.getId())) {
						 moduleDto = moduleMap.get(module.getId());
						 moduleDto.getModuleActions().add(actionDto);
					}else {
						List<ApplicationActionDTO> actionList = new ArrayList<ApplicationActionDTO>();
						actionList.add(actionDto);
						moduleDto.setModuleActions(actionList);
						moduleMap.put(module.getId(), moduleDto);
					}

				}
				List<ApplicationModuleDTO> moduleDtoList = new ArrayList<ApplicationModuleDTO>(moduleMap.values());
				permDto.setApplicationModules(moduleDtoList);
			}
		}
		return permDto;
	}


}
