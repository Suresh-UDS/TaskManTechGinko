package com.ts.app.web.rest;

import java.util.Calendar;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.domain.AssetStatusHistoryDTO;
import com.ts.app.domain.Material;
import com.ts.app.domain.MaterialItemGroup;
import com.ts.app.domain.MaterialUOMType;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.InventoryManagementService;
import com.ts.app.web.rest.dto.AssetgroupDTO;
import com.ts.app.web.rest.dto.ExportResponse;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.MaterialDTO;
import com.ts.app.web.rest.dto.MaterialItemGroupDTO;
import com.ts.app.web.rest.dto.MaterialTransactionDTO;
import com.ts.app.web.rest.dto.PurchaseReqDTO;
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
			materialDTO = inventoryService.updateInventory(materialDTO);
		} catch(Exception e) {
			throw new TimesheetException("Error while updating Inventory" +e);
		}
		return new ResponseEntity<>(materialDTO, HttpStatus.OK);
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

	@RequestMapping(value = "/inventory/transactions", method=RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public SearchResult<MaterialTransactionDTO> viewMaterialTransaction(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<MaterialTransactionDTO> result = null;
		try {
			result = inventoryService.viewMaterialTransactions(searchCriteria);
		} catch(Exception e) {
			throw new TimesheetException("Error while get material transactions " +e);
		}
		return result;
	}

	@RequestMapping(path="/inventory/import", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ImportResult> importMasterData(@RequestParam("inventoryFile") MultipartFile file) throws Exception {
		Calendar cal = Calendar.getInstance();
		ImportResult result = inventoryService.importFile(file, cal.getTimeInMillis());
		return new ResponseEntity<ImportResult>(result, HttpStatus.OK);
	}

	@RequestMapping(value = "/inventory/import/{fileId}/status", method = RequestMethod.GET)
	public ImportResult importStatus(@PathVariable("fileId") String fileId) {
		// log.debug("ImportStatus - fileId -"+ fileId);
		ImportResult result = inventoryService.getImportStatus(fileId);
		if (result != null && result.getStatus() != null) {
			switch (result.getStatus()) {
			case "PROCESSING":
				result.setMsg("Importing data...");
				break;
			case "COMPLETED":
				result.setMsg("Completed importing");
				break;
			case "FAILED":
				result.setMsg("Failed to import. Please try again");
				break;
			default:
				result.setMsg("Completed importing");
				break;
			}
		}
		return result;
	}

	@RequestMapping(value = "/inventory/export", method = RequestMethod.POST)
	public ExportResponse exportInventory(@RequestBody SearchCriteria searchCriteria) {
		// log.debug("JOB EXPORT STARTS HERE **********");
		ExportResponse resp = new ExportResponse();
		if (searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			SearchResult<MaterialDTO> result = inventoryService.findBySearchCrieria(searchCriteria);
			List<MaterialDTO> results = result.getTransactions();
			resp.addResult(inventoryService.generateReport(results, searchCriteria));

			// log.debug("RESPONSE FOR OBJECT resp *************"+resp);
		}
		return resp;
	}

	@RequestMapping(value = "/inventory/export/{fileId}/status", method = RequestMethod.GET)
	public ExportResult exportStatus(@PathVariable("fileId") String fileId) {
		log.debug("ExportStatus - fileId -"+ fileId);
		ExportResult result = inventoryService.getExportStatus(fileId);

		if (result != null && result.getStatus() != null) {
			switch (result.getStatus()) {
			case "PROCESSING":
				result.setMsg("Exporting...");
				break;
			case "COMPLETED":
				result.setMsg("Download");
				result.setFile("/api/inventory/export/" + fileId);
				break;
			case "FAILED":
				result.setMsg("Failed to export. Please try again");
				break;
			default:
				result.setMsg("Failed to export. Please try again");
				break;
			}
		}
		return result;
	}

	@RequestMapping(value = "/inventory/export/{fileId}", method = RequestMethod.GET)
	public byte[] getExportFile(@PathVariable("fileId") String fileId, HttpServletResponse response) {
		byte[] content = inventoryService.getExportFile(fileId);
		response.setContentType("Application/x-msexcel");
		response.setContentLength(content.length);
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Content-Disposition", "attachment; filename=\"" + fileId + ".xlsx\"");
		return content;
	}

	@RequestMapping(value = "/delete/transaction/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteMaterialTransaction(@PathVariable("id") long id) {
	    inventoryService.deleteTransaction(id);
	    return new ResponseEntity<>(HttpStatus.OK);
    }













}
