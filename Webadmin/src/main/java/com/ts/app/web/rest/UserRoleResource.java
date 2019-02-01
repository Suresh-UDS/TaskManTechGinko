package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.service.UserRoleService;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.UserRoleDTO;
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
 * REST controller for managing the UserRole information.
 */
@RestController
@RequestMapping("/api")
public class UserRoleResource {

	private final Logger log = LoggerFactory.getLogger(UserRoleResource.class);

	@Inject
	private UserRoleService userRoleService;

	@Inject
	public UserRoleResource(UserRoleService userRoleService) {
		this.userRoleService = userRoleService;
	}

	/**
	 * POST /saveUserRole -> saveUserRole the UserRole.
	 */
	@RequestMapping(value = "/userRole", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed 
	public ResponseEntity<?> saveUserRole(@Valid @RequestBody UserRoleDTO userRoleDTO, HttpServletRequest request) {
		log.info("Inside the saveUserRole -" + userRoleDTO.getName());
		try {
			if(!userRoleService.isDuplicate(userRoleDTO)) {
				userRoleDTO = userRoleService.createUserRoleInformation(userRoleDTO);
			}
			else {
				userRoleDTO.setMessage("error.duplicateRecordError");
				return new ResponseEntity<>(userRoleDTO,HttpStatus.BAD_REQUEST);
			}
		}catch (Exception e) {
			String msg = "Error while creating user group, please check the information";
			//return new ResponseEntity<String>(msg , HttpStatus.NOT_ACCEPTABLE);
			throw new TimesheetException(e, userRoleDTO);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/userRole", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateUserRole(@Valid @RequestBody UserRoleDTO userRole, HttpServletRequest request) {
		log.info("Inside Update" + userRole.getName());
		userRoleService.updateUserRole(userRole);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/userRole/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		log.info("Inside Delete" + id);
		userRoleService.deleteUserRole(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/userRole", method = RequestMethod.GET)
	public List<UserRoleDTO> findAll() {
		log.info("--Invoked UserRoleResource.findAll --");
		return userRoleService.findAndExclude();
	}

    @RequestMapping(value = "/userRole/exclude", method = RequestMethod.GET)
    public List<UserRoleDTO> findExcludeRole() {
        log.info("--Invoked UserRoleResource.findExcludeRole --");
        return userRoleService.findAndExclude();
    }

	@RequestMapping(value = "/userRole/{id}", method = RequestMethod.GET)
	public UserRoleDTO get(@PathVariable Long id) {
		return userRoleService.findOne(id);
	}
	
	@RequestMapping(value = "/userRole/search",method = RequestMethod.POST)
	public SearchResult<UserRoleDTO> searchUserRoles(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<UserRoleDTO> result = null;
		if(searchCriteria != null) {
			result = userRoleService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}


}
