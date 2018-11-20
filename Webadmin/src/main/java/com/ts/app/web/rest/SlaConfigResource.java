package com.ts.app.web.rest;

import com.ts.app.security.SecurityUtils;
import com.ts.app.service.SlaConfigService;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.SlaConfigDTO;
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
	public void updateSla(@Valid @RequestBody SlaConfigDTO slaconfigdto, HttpServletRequest request)
	{
		log.debug("********SLAConfig update******** " + slaconfigdto.getId());
		slaservice.updateSLA(slaconfigdto);
	}
	@RequestMapping(value = "/sla/delete/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> deleteSla(@PathVariable Long id)
	{
		log.debug("*********SLAConfig Delete********" + id);
		slaservice.deleteSlaConfig(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value = "/sla", method = RequestMethod.GET)
	public List<SlaConfigDTO> slaList() {
		log.info("********** SLAConfig findAll slaEscalationNotification *********");
		return slaservice.findAll();
	}
	
	@RequestMapping(value = "/sla/search/{id}", method = RequestMethod.GET)
	public SlaConfigDTO searchSLA(@PathVariable Long id)
	{
		log.debug("*******SLAConfig Selected SLA ********" + id);
		return slaservice.searchSelectedSLA(id);
	}
	
	@RequestMapping(value = "/sla/search",method = RequestMethod.POST)
    public SearchResult<SlaConfigDTO> searchSLA(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<SlaConfigDTO> result = null;
        if(searchCriteria != null) {
        	searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
            result = slaservice.findBySlaList(searchCriteria);
        }
        return result;
    }

	}
