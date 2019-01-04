package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.WarrantyTypeService;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.WarrantyTypeDTO;
import com.ts.app.web.rest.errors.TimesheetException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Calendar;
import java.util.List;

/**
 * REST controller for managing the WarrantyType information.
 */

@RestController
@RequestMapping("/api")
@CrossOrigin
public class WarrantyTypeResource {

	private final Logger log = LoggerFactory.getLogger(WarrantyTypeResource.class);

	@Inject
	private WarrantyTypeService warrantyTypeService;

	@Inject
	public WarrantyTypeResource(WarrantyTypeService warrantyTypeService) {
		this.warrantyTypeService = warrantyTypeService;
	}

	/**
	 * POST /saveWarrantyType -> saveWarrantyType the WarrantyType.
	 */
	@RequestMapping(value = "/warrantyType", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveAssetType(@Valid @RequestBody WarrantyTypeDTO warrantyTypeDTO, HttpServletRequest request) {
		log.info("Inside the saveAssetType -" + warrantyTypeDTO.getName() );
		try  {
			warrantyTypeDTO.setUserId(SecurityUtils.getCurrentUserId());
			warrantyTypeDTO = warrantyTypeService.createWarrantyTypeInformation(warrantyTypeDTO);
		}catch (Exception cve) {
			throw new TimesheetException(cve, warrantyTypeDTO);
		}

		return new ResponseEntity<>(warrantyTypeDTO,HttpStatus.CREATED);
	}

	@RequestMapping(value = "/warrantyType", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateAssetType(@Valid @RequestBody WarrantyTypeDTO warrantyTypeDTO, HttpServletRequest request) {
		log.info("Inside Update" + warrantyTypeDTO.getName());
		try {
			warrantyTypeService.updateWarrantyType(warrantyTypeDTO);
		}catch (Exception cve) {
			throw new TimesheetException(cve);
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/warrantyType/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		log.info("Inside Delete" + id);
		warrantyTypeService.deleteWarrantyType(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/warrantyType", method = RequestMethod.GET)
	public List<WarrantyTypeDTO> findAll(HttpServletRequest request) {
		log.info("--Invoked WarrantyTypeResource.findAll --");
		return warrantyTypeService.findAll();
	}

	@RequestMapping(value = "/warrantyType/{id}", method = RequestMethod.GET)
	public WarrantyTypeDTO get(@PathVariable Long id) {
		return warrantyTypeService.findOne(id);
	}

	@RequestMapping(value = "/warrantyType/search",method = RequestMethod.POST)
	public SearchResult<WarrantyTypeDTO> searchAssetTypes(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<WarrantyTypeDTO> result = null;
		if(searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = warrantyTypeService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}


    @RequestMapping(value = "/warrantyType/import", method = RequestMethod.POST)
    public ResponseEntity<ImportResult> importJobData(@RequestParam("warrantyTypeFile") MultipartFile file){
    	log.info("--Invoked WarrantyType Import --");
		Calendar cal = Calendar.getInstance();
		//ImportResult result = importUtil.importAssetTypeData(file, cal.getTimeInMillis());
		ImportResult result = null;
		return new ResponseEntity<ImportResult>(result,HttpStatus.OK);
	}

    @RequestMapping(value = "/warrantyType/import/{fileId}/status",method = RequestMethod.GET)
	public ImportResult importStatus(@PathVariable("fileId") String fileId) {
		log.debug("ImportStatus -  fileId -"+ fileId);
		//ImportResult result = warrantyTypeService.getImportStatus(fileId);
		ImportResult result = null;
		if(result!=null && result.getStatus() != null) {
			switch(result.getStatus()) {
				case "PROCESSING" :
					result.setMsg("Importing data...");
					break;
				case "COMPLETED" :
					result.setMsg("Completed importing");
					break;
				case "FAILED" :
					result.setMsg("Failed to import. Please try again");
					break;
				default :
					result.setMsg("Completed importing");
					break;
			}
		}
		return result;
	}
}
