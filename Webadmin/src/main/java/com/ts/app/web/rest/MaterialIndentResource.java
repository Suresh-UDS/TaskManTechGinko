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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.domain.MaterialIndent;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.MaterialIndentService;
import com.ts.app.web.rest.dto.MaterialIndentDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class MaterialIndentResource {


	private final Logger log = LoggerFactory.getLogger(MaterialIndentResource.class);
	
	@Inject
	private MaterialIndentService materialIndentService;
	
	@RequestMapping(value="/save/materialIndent", method=RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveInventory(@Valid @RequestBody MaterialIndentDTO materialIndentDTO, HttpServletRequest request) { 
		log.debug("inventory object: {}", materialIndentDTO);
		try {
			materialIndentDTO = materialIndentService.createIndent(materialIndentDTO);
		}catch(Exception e) { 
			throw new TimesheetException("Error while create material Indent" + e);
		}
		return new ResponseEntity<>(materialIndentDTO, HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/materialIndent/{id}", method=RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
	public MaterialIndentDTO getMaterial(@PathVariable("id") long id) { 
		return materialIndentService.getMaterial(id);
	}
	
	@RequestMapping(value = "/materialIndent/sites", method=RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public List<MaterialIndentDTO> getMaterialIndent(@Valid @RequestBody MaterialIndentDTO indentDTO, HttpServletRequest request) { 
		List<MaterialIndentDTO> result = null;
		try {
			result = materialIndentService.getMaterialBySite(indentDTO);
		} catch(Exception e) {
			throw new TimesheetException("Error while get material indents based on Site" + e);
		}
		return result;
	}
	
	@RequestMapping(value="/materialIndent/findAll", method=RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
	public List<MaterialIndentDTO> getAllMaterials() { 
		List<MaterialIndentDTO> result = null;
		try {
			result = materialIndentService.findAll();
		}catch(Exception e){
			throw new TimesheetException("Error while get a List of material indents" + e);
		}
		return result;
	}
	
	@RequestMapping(value="/update/materialIndent", method=RequestMethod.PUT, produces=MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateMaterialIndent(@Valid @RequestBody MaterialIndentDTO materialIndentDTO, HttpServletRequest request) {
		log.debug("Update object: {}" + materialIndentDTO);
		try {
			materialIndentService.updateMaterialIndents(materialIndentDTO);
		} catch(Exception e) { 
			throw new TimesheetException("Error while updating materialIndent" +e);
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value="/delete/materialIndent/{id}", method=RequestMethod.DELETE)
	public ResponseEntity<?> deleteMaterial(@PathVariable("id") long id) { 
		materialIndentService.deleteMaterialIndent(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value="/indent/materialTransaction", method=RequestMethod.POST)
	public ResponseEntity<?> createTransaction(@Valid @RequestBody MaterialIndentDTO materialIndentDto, HttpServletRequest request) {
		MaterialIndentDTO result = null;
		try {
			materialIndentDto.setUserId(SecurityUtils.getCurrentUserId());
			result = materialIndentService.createMaterialTransaction(materialIndentDto);
		}catch(Exception e) { 
			throw new TimesheetException("Error while create transaction for Indent" +e);
		}
		return new ResponseEntity<>(result, HttpStatus.CREATED);
	}
		
	@RequestMapping(value = "/materialIndent/search", method = RequestMethod.POST)
	public SearchResult<MaterialIndentDTO> searchMaterials(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<MaterialIndentDTO> result = null;
		if (searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = materialIndentService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}
	
	
	
	
	
	
	
	
	
	

}
