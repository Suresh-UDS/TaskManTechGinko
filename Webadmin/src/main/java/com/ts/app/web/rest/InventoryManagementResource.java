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
import com.ts.app.domain.Material;
import com.ts.app.domain.MaterialItemGroup;
import com.ts.app.domain.MaterialUOMType;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.InventoryManagementService;
import com.ts.app.web.rest.dto.AssetgroupDTO;
import com.ts.app.web.rest.dto.MaterialDTO;
import com.ts.app.web.rest.dto.MaterialItemGroupDTO;
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
	
	@RequestMapping(value="/save/inventory", method=RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
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
			inventoryService.updateInventory(materialDTO);
		} catch(Exception e) { 
			throw new TimesheetException("Error while updating Inventory" +e);
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value="/delete/inventory/{id}", method=RequestMethod.DELETE)
	public ResponseEntity<?> deleteMaterial(@PathVariable("id") long id) { 
		inventoryService.deleteMaterial(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value="/material/uom", method=RequestMethod.GET)
	public MaterialUOMType[] getMaterialUOM() { 
		MaterialUOMType[] list = null;
		list = inventoryService.getAllMaterialUom();
		return list;
	}
	
	@RequestMapping(value = "/materialItemgroup", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveItemGroup(@Valid @RequestBody MaterialItemGroupDTO materialGroupDTO, HttpServletRequest request) {
		try {
			materialGroupDTO = inventoryService.createMaterialGroup(materialGroupDTO);
		} catch (Exception e) {
			throw new TimesheetException("Error while add material Item group" +e);
		}
		return new ResponseEntity<>(materialGroupDTO, HttpStatus.CREATED);
	}

	@RequestMapping(value = "/materialItemgroup", method = RequestMethod.GET)
	public List<MaterialItemGroupDTO> findAllItemGroups() {
		log.info("--Invoked inventoryResource.findAll item Groups --");
		return inventoryService.findAllItemGroups();
	}
	
	@RequestMapping(value = "material/itemgroup/{id}", method = RequestMethod.GET)
	public List<MaterialDTO> findOneItemGroups(@PathVariable("id") long id) {
		log.info("--Invoked inventoryResource.findAll item Groups --");
		List<MaterialDTO> result = null;
		try {
			result = inventoryService.getMaterialGroup(id);
		}catch(Exception e) { 
			throw new TimesheetException("Error while get material group items" +e);
		}
		return result;
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
