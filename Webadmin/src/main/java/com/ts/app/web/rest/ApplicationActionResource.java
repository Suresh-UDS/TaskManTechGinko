package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.service.ApplicationActionService;
import com.ts.app.web.rest.dto.ApplicationActionDTO;
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
 * REST controller for managing the ApplicationAction information.
 */
@RestController
@RequestMapping("/api")
public class ApplicationActionResource {

	private final Logger log = LoggerFactory.getLogger(ApplicationActionResource.class);

	@Inject
	private ApplicationActionService applicationActionService;

	@Inject
	public ApplicationActionResource(ApplicationActionService applicationActionService) {
		this.applicationActionService = applicationActionService;
	}

	/**
	 * POST /saveApplicationAction -> saveApplicationAction the ApplicationAction.
	 */
	@RequestMapping(value = "/applicationAction", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed 
	public ResponseEntity<?> saveApplicationAction(@Valid @RequestBody ApplicationActionDTO applicationActionDTO, HttpServletRequest request) {
		log.info("Inside the saveApplicationAction -" + applicationActionDTO.getName());
		ApplicationActionDTO applicationActionDto = null;
		try {
			applicationActionDto = applicationActionService.createApplicationActionInformation(applicationActionDTO);
		}catch (Exception e) {
			String msg = "Error while creating user group, please check the information";
			//return new ResponseEntity<String>(msg , HttpStatus.NOT_ACCEPTABLE);
			throw new TimesheetException(e, applicationActionDTO);

		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/applicationAction", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateApplicationAction(@Valid @RequestBody ApplicationActionDTO applicationAction, HttpServletRequest request) {
		log.info("Inside Update" + applicationAction.getName());
		applicationActionService.updateApplicationAction(applicationAction);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/applicationAction/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		log.info("Inside Delete" + id);
		applicationActionService.deleteApplicationAction(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/applicationAction", method = RequestMethod.GET)
	public List<ApplicationActionDTO> findAll() {
		log.info("--Invoked ApplicationActionResource.findAll --");
		return applicationActionService.findAll();
	}

	@RequestMapping(value = "/applicationAction/{id}", method = RequestMethod.GET)
	public ApplicationActionDTO get(@PathVariable Long id) {
		return applicationActionService.findOne(id);
	}
	
	@RequestMapping(value = "/applicationAction/search",method = RequestMethod.POST)
	public SearchResult<ApplicationActionDTO> searchApplicationActions(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<ApplicationActionDTO> result = null;
		if(searchCriteria != null) {
			result = applicationActionService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}


}
