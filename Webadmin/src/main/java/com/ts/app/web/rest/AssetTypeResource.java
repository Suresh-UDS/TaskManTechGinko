package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.AssetTypeService;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.web.rest.dto.AssetTypeDTO;
import com.ts.app.web.rest.dto.ImportResult;
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
 * REST controller for managing the AssetType information.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class AssetTypeResource {

	private final Logger log = LoggerFactory.getLogger(AssetTypeResource.class);

	@Inject
	private AssetTypeService assetTypeService;

	@Inject
	private ImportUtil importUtil;

	@Inject
	public AssetTypeResource(AssetTypeService assetTypeService) {
		this.assetTypeService = assetTypeService;
	}

	/**
	 * POST /saveAssetType -> saveAssetType the AssetType.
	 */
	@RequestMapping(value = "/assetType", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveAssetType(@Valid @RequestBody AssetTypeDTO assetTypeDTO, HttpServletRequest request) {
		log.info("Inside the saveAssetType -" + assetTypeDTO.getName() );
		System.out.println("Code===>"+assetTypeDTO.getAssetTypeCode());
		System.out.println("Relationship==>"+assetTypeDTO.isRelationShipBased());
		try  {
			assetTypeDTO.setUserId(SecurityUtils.getCurrentUserId());
			assetTypeDTO = assetTypeService.createAssetTypeInformation(assetTypeDTO);
		}catch (Exception cve) {
			throw new TimesheetException(cve, assetTypeDTO);
		}

		return new ResponseEntity<>(assetTypeDTO,HttpStatus.CREATED);
	}

	@RequestMapping(value = "/assetType", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateAssetType(@Valid @RequestBody AssetTypeDTO assetType, HttpServletRequest request) {
		log.info("Inside Update" + assetType.getName());
		try {
			assetTypeService.updateAssetType(assetType);
		}catch (Exception cve) {
			throw new TimesheetException(cve);
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/assetType/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		log.info("Inside Delete" + id);
		assetTypeService.deleteAssetType(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/assetType", method = RequestMethod.GET)
	public List<AssetTypeDTO> findAll(HttpServletRequest request) {
		log.info("--Invoked AssetTypeResource.findAll --");
		return assetTypeService.findAll();
	}

	@RequestMapping(value = "/assetType/{id}", method = RequestMethod.GET)
	public AssetTypeDTO get(@PathVariable Long id) {
		return assetTypeService.findOne(id);
	}

	@RequestMapping(value = "/assetType/search",method = RequestMethod.POST)
	public SearchResult<AssetTypeDTO> searchAssetTypes(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<AssetTypeDTO> result = null;
		if(searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = assetTypeService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}


    @RequestMapping(value = "/assetType/import", method = RequestMethod.POST)
    public ResponseEntity<ImportResult> importJobData(@RequestParam("assetTypeFile") MultipartFile file){
    	log.info("--Invoked AssetType Import --");
		Calendar cal = Calendar.getInstance();
		//ImportResult result = importUtil.importAssetTypeData(file, cal.getTimeInMillis());
		ImportResult result = null;
		return new ResponseEntity<ImportResult>(result,HttpStatus.OK);
	}

    @RequestMapping(value = "/assetType/import/{fileId}/status",method = RequestMethod.GET)
	public ImportResult importStatus(@PathVariable("fileId") String fileId) {
		log.debug("ImportStatus -  fileId -"+ fileId);
		//ImportResult result = assetTypeService.getImportStatus(fileId);
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
