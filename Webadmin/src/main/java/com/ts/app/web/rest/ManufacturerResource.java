package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.ManufacturerService;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.ManufacturerDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
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
 * REST controller for managing the Manufacturer information.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class ManufacturerResource {

	private final Logger log = LoggerFactory.getLogger(ManufacturerResource.class);

	@Inject
	private ManufacturerService manufacturerService;

	@Inject
	private ImportUtil importUtil;

	@Inject
	public ManufacturerResource(ManufacturerService manufacturerService) {
		this.manufacturerService = manufacturerService;
	}

	/**
	 * POST /saveManufacturer -> saveManufacturer the Manufacturer.
	 */
	@RequestMapping(value = "/manufacturer", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveManufacturer(@Valid @RequestBody ManufacturerDTO manufacturerDTO, HttpServletRequest request) {
		log.info("Inside the saveManufacturer -" + manufacturerDTO.getName() + ", assetType -" + manufacturerDTO.getAssetType());
		try  {
			manufacturerDTO.setUserId(SecurityUtils.getCurrentUserId());
			manufacturerDTO = manufacturerService.createManufacturerInformation(manufacturerDTO);
		}catch (Exception cve) {
			throw new TimesheetException(cve, manufacturerDTO);
		}

		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/manufacturer", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateManufacturer(@Valid @RequestBody ManufacturerDTO manufacturer, HttpServletRequest request) {
		log.info("Inside Update" + manufacturer.getName() + " , "+ manufacturer.getAssetType());
		try {
			manufacturerService.updateManufacturer(manufacturer);
		}catch (Exception cve) {
			throw new TimesheetException(cve);
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/manufacturer/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		log.info("Inside Delete" + id);
		manufacturerService.deleteManufacturer(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/manufacturer", method = RequestMethod.GET)
	public List<ManufacturerDTO> findAll(HttpServletRequest request) {
		log.info("--Invoked ManufacturerResource.findAll --");
		return manufacturerService.findAll();
	}

	@RequestMapping(value = "/manufacturer/{id}", method = RequestMethod.GET)
	public ManufacturerDTO get(@PathVariable Long id) {
		return manufacturerService.findOne(id);
	}

	@RequestMapping(value = "/manufacturer/search",method = RequestMethod.POST)
	public SearchResult<ManufacturerDTO> searchManufacturers(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<ManufacturerDTO> result = null;
		if(searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = manufacturerService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}


    @RequestMapping(value = "/manufacturer/import", method = RequestMethod.POST)
    public ResponseEntity<ImportResult> importJobData(@RequestParam("manufacturerFile") MultipartFile file){
    	log.info("--Invoked Manufacturer Import --");
		Calendar cal = Calendar.getInstance();
		//ImportResult result = importUtil.importManufacturerData(file, cal.getTimeInMillis());
		ImportResult result = null;
		return new ResponseEntity<ImportResult>(result,HttpStatus.OK);
	}

    @RequestMapping(value = "/manufacturer/import/{fileId}/status",method = RequestMethod.GET)
	public ImportResult importStatus(@PathVariable("fileId") String fileId) {
		log.debug("ImportStatus -  fileId -"+ fileId);
		//ImportResult result = manufacturerService.getImportStatus(fileId);
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
