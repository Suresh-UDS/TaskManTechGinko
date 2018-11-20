package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.service.ApplicationModuleService;
import com.ts.app.web.rest.dto.ApplicationModuleDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
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
 * REST controller for managing the ApplicationModule information.
 */
@RestController
@RequestMapping("/api")
public class ApplicationModuleResource {

	private final Logger log = LoggerFactory.getLogger(ApplicationModuleResource.class);

	@Inject
	private ApplicationModuleService applicationModuleService;

	@Inject
	public ApplicationModuleResource(ApplicationModuleService applicationModuleService) {
		this.applicationModuleService = applicationModuleService;
	}

	/**
	 * POST /saveApplicationModule -> saveApplicationModule the ApplicationModule.
	 */
	@RequestMapping(value = "/applicationModule", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed 
	public ResponseEntity<?> saveApplicationModule(@Valid @RequestBody ApplicationModuleDTO applicationModuleDTO, HttpServletRequest request) {
		log.info("Inside the saveApplicationModule -" + applicationModuleDTO.getName());
		ApplicationModuleDTO applicationModuleDto = null;
		try {
			applicationModuleDto = applicationModuleService.createApplicationModuleInformation(applicationModuleDTO);
		}catch (Exception e) {
			String msg = "Error while creating user group, please check the information";
			//return new ResponseEntity<String>(msg , HttpStatus.NOT_ACCEPTABLE);
			throw new TimesheetException(e, applicationModuleDTO);

		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/applicationModule", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateApplicationModule(@Valid @RequestBody ApplicationModuleDTO applicationModule, HttpServletRequest request) {
		log.info("Inside Update" + applicationModule.getName());
		applicationModuleService.updateApplicationModule(applicationModule);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/applicationModule/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		log.info("Inside Delete" + id);
		applicationModuleService.deleteApplicationModule(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/applicationModule", method = RequestMethod.GET)
	public List<ApplicationModuleDTO> findAll() {
		log.info("--Invoked ApplicationModuleResource.findAll --");
		return applicationModuleService.findAll();
	}

	@RequestMapping(value = "/applicationModule/{id}", method = RequestMethod.GET)
	public ApplicationModuleDTO get(@PathVariable Long id) {
		return applicationModuleService.findOne(id);
	}
	
	@RequestMapping(value = "/applicationModule/search",method = RequestMethod.POST)
	public SearchResult<ApplicationModuleDTO> searchApplicationModules(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<ApplicationModuleDTO> result = null;
		if(searchCriteria != null) {
			result = applicationModuleService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}


}
