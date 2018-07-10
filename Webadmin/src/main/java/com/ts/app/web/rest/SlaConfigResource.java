package com.ts.app.web.rest;

import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ts.app.service.SlaConfigService;
import com.ts.app.web.rest.dto.SlaConfigDTO;

@RestController
@RequestMapping("/api")
public class SlaConfigResource {

	
	@Inject
	SlaConfigService slaservice;
	
	private final Logger log = LoggerFactory.getLogger(SlaConfigResource.class);

	@RequestMapping(path = "/sla", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> saveSla(@RequestBody SlaConfigDTO slaconfigdto, HttpServletRequest request)
	{
		log.debug(">>> SLAManagement save request <<<");

		slaconfigdto = slaservice.saveSla(slaconfigdto);

		return new ResponseEntity<>(slaconfigdto, HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/sla", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	public String updateSla(@Valid @RequestBody SlaConfigDTO slaconfigdto, HttpServletRequest request)
	{
		log.debug("********SLAConfig update******** " + slaconfigdto.getId());
		String status = slaservice.updateSLA(slaconfigdto);
		return status +(HttpStatus.OK);
	}
	@RequestMapping(value = "/sla/delete/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> deleteSla(@PathVariable Long id)
	{
		log.debug("*********SLAConfig Delete********" + id);
		slaservice.deleteSlaConfig(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value = "/sla/search", method = RequestMethod.POST)
	public List<SlaConfigDTO> SlaList(HttpServletRequest request) {
		log.info("********** SLAConfig findAll *********");
		return slaservice.findAllSla();
	}
	
	}
