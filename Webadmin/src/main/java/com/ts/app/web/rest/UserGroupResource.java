package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.service.UserGroupService;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.UserGroupDTO;
import com.ts.app.web.rest.errors.TimesheetException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

/**
 * REST controller for managing the UserGroup information.
 */
@RestController
@RequestMapping("/api")
public class UserGroupResource {

	private final Logger log = LoggerFactory.getLogger(UserGroupResource.class);

	@Inject
	private UserGroupService userGroupService;

	@Inject
	public UserGroupResource(UserGroupService userGroupService) {
		this.userGroupService = userGroupService;
	}

	/**
	 * POST /saveUserGroup -> saveUserGroup the UserGroup.
	 */
	@RequestMapping(value = "/userGroup", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed 
	public ResponseEntity<?> saveUserGroup(@Valid @RequestBody UserGroupDTO userGroupDTO, HttpServletRequest request) {
		log.info("Inside the saveUserGroup -" + userGroupDTO.getName());
		UserGroupDTO userGroupDto = null;
		try {
			userGroupDto = userGroupService.createUserGroupInformation(userGroupDTO);
		}catch (Exception e) {
			String msg = "Error while creating user group, please check the information";
			//return new ResponseEntity<String>(msg , HttpStatus.NOT_ACCEPTABLE);
			throw new TimesheetException(e, userGroupDTO);

		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/userGroup", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateUserGroup(@Valid @RequestBody UserGroupDTO userGroup, HttpServletRequest request) {
		log.info("Inside Update" + userGroup.getName());
		userGroupService.updateUserGroup(userGroup);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/userGroup/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		log.info("Inside Delete" + id);
		userGroupService.deleteUserGroup(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/userGroup", method = RequestMethod.GET)
	public List<UserGroupDTO> findAll() {
		log.info("--Invoked UserGroupResource.findAll --");
		return userGroupService.findAll();
	}

	@RequestMapping(value = "/userGroup/{id}", method = RequestMethod.GET)
	public UserGroupDTO get(@PathVariable Long id) {
		return userGroupService.findOne(id);
	}
	
	@RequestMapping(value = "/userGroup/search",method = RequestMethod.POST)
	public SearchResult<UserGroupDTO> searchUserGroups(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<UserGroupDTO> result = null;
		if(searchCriteria != null) {
			result = userGroupService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}


}
