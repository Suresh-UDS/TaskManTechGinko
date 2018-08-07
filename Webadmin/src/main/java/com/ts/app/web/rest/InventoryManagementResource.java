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
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.InventoryManagementService;
import com.ts.app.web.rest.dto.MaterialDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;

/**
 * REST controller for managing the Inventory information.
 */

@RestController
@RequestMapping("/api")
@CrossOrigin
public class InventoryManagementResource {

	private final Logger log = LoggerFactory.getLogger(InventoryManagementResource.class);
	
	@Inject
	private InventoryManagementService inventoryService;
	
	@RequestMapping(value="/saveInventory", method=RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveInventory(@Valid @RequestBody MaterialDTO materialDTO, HttpServletRequest request) { 
		log.debug("inventory object: {}", materialDTO);
		try {
			materialDTO = inventoryService.createInventory(materialDTO);
		}catch(Exception e) { 
			throw new TimesheetException("Error while create inventory" + e);
		}
		return new ResponseEntity<>(materialDTO, HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/inventory/{id}", method=RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
	public MaterialDTO getMaterial(@PathVariable("id") long id) { 
		return inventoryService.getMaterial(id);
	}
	
	@RequestMapping(value="/findAll", method=RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
	public List<MaterialDTO> getAllMaterials() { 
		List<MaterialDTO> result = null;
		try {
			result = inventoryService.findAll();
		}catch(Exception e){
			throw new TimesheetException("Error while get a List of material" + e);
		}
		return result;
	}
	
	@RequestMapping(value="/update/inventory", method=RequestMethod.PUT, produces=MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateMaterial(@Valid @RequestBody MaterialDTO materialDTO, HttpServletRequest request) {
		log.debug("Update object: {}" +materialDTO);
		try {
			materialDTO = inventoryService.updateInventory(materialDTO);
		} catch(Exception e) { 
			throw new TimesheetException("Error while updating Inventory" +e);
		}
		return new ResponseEntity<>(materialDTO, HttpStatus.CREATED);
	}
	
	@RequestMapping(value="/delete/inventory", method=RequestMethod.DELETE)
	public ResponseEntity<?> deleteMaterial(@PathVariable("id") long id) { 
		inventoryService.deleteMaterial(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value = "/inventory/search", method = RequestMethod.POST)
	public SearchResult<MaterialDTO> searchMaterials(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<MaterialDTO> result = null;
		if (searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = inventoryService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
}
