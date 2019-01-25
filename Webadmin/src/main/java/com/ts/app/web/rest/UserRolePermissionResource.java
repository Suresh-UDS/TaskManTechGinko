package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.service.UserRolePermissionService;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.UserRolePermissionDTO;
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
 * REST controller for managing the UserRolePermission information.
 */
@RestController
@RequestMapping("/api")
public class UserRolePermissionResource {

	private final Logger log = LoggerFactory.getLogger(UserRolePermissionResource.class);

	@Inject
	private UserRolePermissionService userRolePermissionService;

	@Inject
	public UserRolePermissionResource(UserRolePermissionService userRolePermissionService) {
		this.userRolePermissionService = userRolePermissionService;
	}

	/**
	 * POST /saveUserRolePermission -> saveUserRolePermission the UserRolePermission.
	 */
	@RequestMapping(value = "/userRolePermission", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed 
	public ResponseEntity<?> saveUserRolePermission(@Valid @RequestBody UserRolePermissionDTO userRolePermissionDTO, HttpServletRequest request) {
		log.info("Inside the saveUserRolePermission -" + userRolePermissionDTO);
		UserRolePermissionDTO userRolePermissionDto = null;
		try {
			userRolePermissionDto = userRolePermissionService.createUserRolePermissionInformation(userRolePermissionDTO);
		}catch (Exception e) {
			String msg = "Error while creating user group, please check the information";
			//return new ResponseEntity<String>(msg , HttpStatus.NOT_ACCEPTABLE);
			throw new TimesheetException(e, userRolePermissionDTO);

		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/userRolePermission", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateUserRolePermission(@Valid @RequestBody UserRolePermissionDTO userRolePermission, HttpServletRequest request) {
		log.info("Inside Update" + userRolePermission.getId());
		userRolePermissionService.updateUserRolePermission(userRolePermission);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/userRolePermission/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		log.info("Inside Delete" + id);
		userRolePermissionService.deleteUserRolePermission(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/userRolePermission", method = RequestMethod.GET)
	public List<UserRolePermissionDTO> findAll() {
		log.info("--Invoked UserRolePermissionResource.findAll --");
		return userRolePermissionService.findAll();
	}

	@RequestMapping(value = "/userRolePermission/{id}", method = RequestMethod.GET)
	public UserRolePermissionDTO get(@PathVariable Long id) {
		return userRolePermissionService.findOne(id);
	}
	
	@RequestMapping(value = "/userRolePermission/search",method = RequestMethod.POST)
	public UserRolePermissionDTO searchUserRolePermissions(@RequestBody SearchCriteria searchCriteria) {
		UserRolePermissionDTO result = null;
		if(searchCriteria != null) {
			result = userRolePermissionService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}


}
