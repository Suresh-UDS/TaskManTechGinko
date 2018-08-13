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
import com.ts.app.domain.MaterialTransactionType;
import com.ts.app.domain.MaterialUOMType;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.InventoryManagementService;
import com.ts.app.service.InventoryTransactionService;
import com.ts.app.web.rest.dto.MaterialDTO;
import com.ts.app.web.rest.dto.MaterialTransactionDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;

/**
 * REST controller for managing the Inventory information.
 */

@RestController
@RequestMapping("/api")
@CrossOrigin
public class InventoryTransactionResource {

	private final Logger log = LoggerFactory.getLogger(InventoryTransactionResource.class);
	
	@Inject
	private InventoryTransactionService inventoryTransactionService;
	
	@RequestMapping(value="/saveInventory/transaction", method=RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveInventory(@Valid @RequestBody MaterialTransactionDTO materialTransDTO, HttpServletRequest request) { 
		log.debug("inventory object: {}", materialTransDTO);
		try {
			materialTransDTO = inventoryTransactionService.createInventoryTransaction(materialTransDTO);
		}catch(Exception e) { 
			throw new TimesheetException("Error while create inventory transaction" + e);
		}
		return new ResponseEntity<>(materialTransDTO, HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/inventoryTrans/{id}", method=RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
	public MaterialTransactionDTO getMaterialTransaction(@PathVariable("id") long id) { 
		return inventoryTransactionService.getMaterialTransaction(id);
	}
	
	@RequestMapping(value="/inventoryTrans/findAll", method=RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
	public List<MaterialTransactionDTO> getAllMaterialTransactions() { 
		List<MaterialTransactionDTO> result = null;
		try {
			result = inventoryTransactionService.findAll();
		}catch(Exception e){
			throw new TimesheetException("Error while get a List of material Trans" + e);
		}
		return result;
	}
	
	@RequestMapping(value="/update/inventoryTrans", method=RequestMethod.PUT, produces=MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateMaterialTransaction(@Valid @RequestBody MaterialTransactionDTO materialTransDTO, HttpServletRequest request) {
		log.debug("Update object: {}" +materialTransDTO);
		try {
			inventoryTransactionService.updateMaterialTransaction(materialTransDTO);
		} catch(Exception e) { 
			throw new TimesheetException("Error while updating Inventory" +e);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	@RequestMapping(value="/delete/inventoryTrans/{id}", method=RequestMethod.DELETE)
	public ResponseEntity<?> deleteMaterialTrans(@PathVariable("id") long id) { 
		inventoryTransactionService.deleteMaterialTrans(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value="/materialTransaction/type", method=RequestMethod.GET)
	public MaterialTransactionType[] getTransactionType() { 
		MaterialTransactionType[] list = null;
		list = inventoryTransactionService.getTransactionType();
		return list;
	}
	
	@RequestMapping(value = "/inventoryTrans/search", method = RequestMethod.POST)
	public SearchResult<MaterialTransactionDTO> searchMaterials(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<MaterialTransactionDTO> result = null;
		if (searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = inventoryTransactionService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}
	
	
	
	
	
	
	
}
