package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.domain.*;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.AssetManagementService;
import com.ts.app.service.WarrantyTypeService;
import com.ts.app.service.util.FileUploadHelper;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.web.rest.dto.*;
import com.ts.app.web.rest.errors.TimesheetException;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * REST controller for managing the Asset information.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class AssetResource {

	private final Logger log = LoggerFactory.getLogger(AssetResource.class);

	@Inject
	private AssetManagementService assetService;

	@Inject
	private WarrantyTypeService warrantyTypeService;

	@Inject
	private FileUploadHelper fileUploaderUtils;

	@Autowired
	private ServletContext servletContext;

	@Inject
	private Environment env;

	// Asset
	@RequestMapping(path = "/asset", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveAsset(@Valid @RequestBody AssetDTO assetDTO, HttpServletRequest request) {
		log.debug(">>> Asset DTO save request <<<");

		if (!StringUtils.isEmpty(assetDTO.getWarrantyFromDate()) && !StringUtils.isEmpty(assetDTO.getWarrantyToDate())) {
			try{
				SimpleDateFormat sdf=new SimpleDateFormat("E MMM dd HH:mm:ss z yyyy");
		        Date fromdate=sdf.parse(String.valueOf(assetDTO.getWarrantyFromDate()));
		        Date todate=sdf.parse(String.valueOf(assetDTO.getWarrantyToDate()));
		        SimpleDateFormat sdf2=new SimpleDateFormat("MMM dd,yyyy HH:mm:ss");
		        log.debug("<<< From Date "+sdf2.format(fromdate));
		        log.debug("<<< To Date "+sdf2.format(todate));

		        if(fromdate.after(todate)){
	                log.debug("<<< Warranty From Date is after Warranty To Date");
	                assetDTO.setMessage("Warranty From Date is after Warranty To Date");
					return new ResponseEntity<>(assetDTO,HttpStatus.BAD_REQUEST);
	            }
	        }
	        catch(Exception e){
	        	throw new TimesheetException(e, assetDTO);
	        }
		}

		try {
			assetDTO = assetService.saveAsset(assetDTO);
		} catch (Exception e) {
			throw new TimesheetException(e, assetDTO);
		}

		log.debug("Asset new id - " + assetDTO.getId());
		return new ResponseEntity<>(assetDTO, HttpStatus.CREATED);
	}

	@RequestMapping(value = "/assets/search", method = RequestMethod.POST)
	public List<AssetDTO> findAllAssets(HttpServletRequest request) {
		log.info("--Invoked Location.findAll --");
		return assetService.findAllAssets();
	}

	@RequestMapping(value = "/asset/search", method = RequestMethod.POST)
	public SearchResult<AssetDTO> searchAssets(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<AssetDTO> result = null;
		if (searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = assetService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}

	@RequestMapping(value = "/asset/findppmschedule", method = RequestMethod.POST)
	public SearchResult<AssetPpmScheduleDTO> findPPMSchedule(@RequestBody SearchCriteria searchCriteria) {
		log.debug(">>> find ppm schedule <<<");
		SearchResult<AssetPpmScheduleDTO> result = null;
		if (searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = assetService.findPPMSearchCriteria(searchCriteria);
		}
		return result;
	}

	@RequestMapping(path = "/assets/{assetId}/ppmschedulelist", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public List<AssetPpmScheduleDTO> getAssetPPMSchedule(@PathVariable("assetId") long assetId) {
		log.debug(">>> Asset PPM get request <<<");
		log.debug("AssetId <<<" + assetId);

		List<AssetPpmScheduleDTO> response = assetService.getAssetPPMSchedules(assetId);
		for (AssetPpmScheduleDTO assetPpmScheduleDTO : response) {
			log.debug("Get Asset PPM Schedule for asset id - " + assetPpmScheduleDTO.getId());
		}
		return response;
	}

	@RequestMapping(path = "/site/{id}/asset", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<AssetDTO> getSiteAssets(@PathVariable("id") Long siteId) {
		return assetService.getSiteAssets(siteId);
	}

	@RequestMapping(path = "/asset/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public AssetDTO getAsset(@PathVariable("id") Long id) {
		log.debug(">>> get asset details! by asset id from resource <<<" + id);
		return assetService.getAssetDTO(id);
	}

	@RequestMapping(path = "/asset/code/{code}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public AssetDTO getAssetByCode(@PathVariable("code") String code) {
		return assetService.getAssetByCode(code);
	}

	@RequestMapping(path = "/asset/breakDown" , method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> markBreakDown(@Valid @RequestBody AssetDTO assetDTO){
		log.debug("Asset details in breakdown - "+assetDTO.getId()+" - "+assetDTO.getSiteId());
	    if(assetDTO.getId() >0){
            assetDTO.setUserId(SecurityUtils.getCurrentUserId());
            assetDTO.setStatus("BREAKDOWN");
            assetDTO = assetService.updateAsset(assetDTO);

        }
        return new ResponseEntity<>(assetDTO, HttpStatus.CREATED);
    }

	@RequestMapping(path = "/asset/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateAsset(@Valid @RequestBody AssetDTO assetDTO, HttpServletRequest request,
			@PathVariable("id") Long id) {
		log.debug(">>> asset id : " + id);
		if (assetDTO.getId() > 0)
			assetDTO.setId(id);
		if (!StringUtils.isEmpty(assetDTO.getWarrantyFromDate()) && !StringUtils.isEmpty(assetDTO.getWarrantyToDate())) {
			try{
				SimpleDateFormat sdf=new SimpleDateFormat("E MMM dd HH:mm:ss z yyyy");
		        Date fromdate=sdf.parse(String.valueOf(assetDTO.getWarrantyFromDate()));
		        Date todate=sdf.parse(String.valueOf(assetDTO.getWarrantyToDate()));
		        SimpleDateFormat sdf2=new SimpleDateFormat("MMM dd,yyyy HH:mm:ss");
		        log.debug("<<< From Date "+sdf2.format(fromdate));
		        log.debug("<<< To Date "+sdf2.format(todate));

		        if(fromdate.after(todate)){
	                log.debug("<<< Warranty From Date is after Warranty To Date");
	                assetDTO.setMessage("Warranty From Date is after Warranty To Date");
					return new ResponseEntity<>(assetDTO,HttpStatus.BAD_REQUEST);
	            }
	        }
	        catch(Exception e){
	        	throw new TimesheetException(e, assetDTO);
	        }
		}

		try {
			assetDTO.setUserId(SecurityUtils.getCurrentUserId());
			assetDTO = assetService.updateAsset(assetDTO);
			}catch(Exception e) {
			throw new TimesheetException(e, assetDTO);
		}

		log.debug("Asset new id - " + assetDTO.getId());
		return new ResponseEntity<>(assetDTO, HttpStatus.CREATED);
	}

	@RequestMapping(value = "/asset/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		log.debug(">>> Inside Asset Delete " + id);
		assetService.deleteAsset(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/asset/{id}/qrcode/{code}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Map<String, Object> generateAssetQRCode(@PathVariable("id") long assetId, @PathVariable("code") String assetCode) {
		Map<String, Object> result = null;
		try {
			result = assetService.generateAssetQRCode(assetId, assetCode);
		} catch(Exception e) {
			throw new TimesheetException("Error while generating QR-Code" +e);
		}

		return result;
	}

	@RequestMapping(path = "/asset/qrcode/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Map<String, Object> getQRCode(@PathVariable("id") Long id) {
		log.debug(">>> get QR Code! <<<");
		Map<String, Object> result = null;
		try {
			result = assetService.getQRCode(id);
		} catch(Exception e) {
			throw new TimesheetException("Error while get a QR-Code" +e);
		}
		return result;
	}

	@RequestMapping(value = "/assetgroup", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveAssetGroup(@Valid @RequestBody AssetgroupDTO assetgroupDTO,
			HttpServletRequest request) {
		log.info(">>> Inside the save assetgroup -");
		log.info(">>> Inside Save assetgroup <<< " + assetgroupDTO.getAssetgroup());
		try {
			assetgroupDTO.setUserId(SecurityUtils.getCurrentUserId());
			assetgroupDTO = assetService.createAssetGroup(assetgroupDTO);
		} catch (Exception e) {
			throw new TimesheetException(e, assetgroupDTO);
		}
		return new ResponseEntity<>(assetgroupDTO, HttpStatus.CREATED);
	}

	@RequestMapping(value = "/assetgroup", method = RequestMethod.GET)
	public List<AssetgroupDTO> findAllAssetGroups() {
		log.info("--Invoked AssetResource.findAllAssetGroups --");
		return assetService.findAllAssetGroups();
	}

	@RequestMapping(value = "/assetwarrantytype", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveWarrantyType(@Valid @RequestBody WarrantyTypeDTO warrantyTypeDTO,
			HttpServletRequest request) {
		log.info(">>> Inside the save assetwarrantytype -");
		log.info(">>> Inside Save assetwarrantytype <<< " + warrantyTypeDTO.getName());
		long userId = SecurityUtils.getCurrentUserId();
		try {
			warrantyTypeDTO = warrantyTypeService.createWarrantyTypeInformation(warrantyTypeDTO);
		} catch (Exception e) {
			throw new TimesheetException(e, warrantyTypeDTO);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/assetwarrantytype", method = RequestMethod.GET)
	public List<WarrantyTypeDTO> findAllWarrantyTypes() {
		log.info("--Invoked AssetResource.findAllWarrantyTypes --");
		return warrantyTypeService.findAll();
	}

	@RequestMapping(value = "/assets/type", method = RequestMethod.GET)
	public List<AssetTypeDTO> findAllAssetType() {
		log.info("Get All Asset Type");
		return assetService.findAllAssetType();
	}

//	Asset Status
	@RequestMapping(value = "/assets/assetstatus", method = RequestMethod.GET)
	public AssetStatus[]  getAssetStatus() {
		log.info("Get Asset Status");
		AssetStatus[] assetStatus = null;
		assetStatus = assetService.getAssetStatus();
		return assetStatus;
	}
//

	@RequestMapping(value = "/assets/config", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<AssetParameterConfigDTO>> getAssetConfig(
			@Valid @RequestBody AssetParameterConfigDTO assetParamConfigDTO) {
		List<AssetParameterConfigDTO> result = null;
		if (assetParamConfigDTO.getAssetType() != null && assetParamConfigDTO.getAssetId() > 0) {
			result = assetService.findByAssetConfig(assetParamConfigDTO.getAssetType(),
					assetParamConfigDTO.getAssetId());
		}
		return new ResponseEntity<>(result, HttpStatus.OK);

	}

	@RequestMapping(value = "/assets/removeConfig/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteAssetConfig(@PathVariable Long id) {
		assetService.deleteAssetConfig(id);
		return new ResponseEntity<>(HttpStatus.OK);

	}

	@RequestMapping(value = "/assets/params", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> saveAssetParamConfig(@Valid @RequestBody AssetParameterConfigDTO assetParamConfigDTO,
			HttpServletRequest request) {
		log.info("Inside the saveParameterConfig -" + assetParamConfigDTO.getName() + ", assetType -"
				+ assetParamConfigDTO.getAssetType());
		try {
			assetParamConfigDTO.setUserId(SecurityUtils.getCurrentUserId());
			assetParamConfigDTO = assetService.createAssetParamConfig(assetParamConfigDTO);

		} catch (Exception cve) {
			throw new TimesheetException(cve, assetParamConfigDTO);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);

	}

	@RequestMapping(value = { "/assets/uploadFile" }, method = RequestMethod.POST)
	public ResponseEntity<?> uploadAssetFile(@RequestParam("title") String title, @RequestParam("assetId") long assetId,
			@RequestParam("uploadFile") MultipartFile file, @RequestParam("type") String type,
			AssetDocumentDTO assetDocumentDTO) {
		assetDocumentDTO.setAssetId(assetId);
		assetDocumentDTO.setTitle(title);
		assetDocumentDTO.setType(type);
		String extension = FilenameUtils.getExtension(file.getOriginalFilename());
		log.debug("********** file extension : "+ extension);
		String ext = env.getProperty("extensionFile");
		log.debug("********** validation extension : "+ ext);
		String[] arrExt = ext.split(",");
		for (String exten : arrExt) {
			if (extension.equalsIgnoreCase(exten)) {
				assetDocumentDTO = assetService.uploadFile(assetDocumentDTO, file);
				assetDocumentDTO.setExtension(extension);
			}
		}
		return new ResponseEntity<>(assetDocumentDTO, HttpStatus.OK);
	}

	@RequestMapping(value = { "/assets/uploadAssetPhoto" }, method = RequestMethod.POST)
	public ResponseEntity<?> uploadAssetImage(@RequestParam("title") String title, @RequestParam("assetId") long assetId,
			@RequestParam("uploadFile") MultipartFile file, @RequestParam("type") String type,
			AssetDocumentDTO assetDocumentDTO) {
		assetDocumentDTO.setAssetId(assetId);
		assetDocumentDTO.setTitle(title);
		assetDocumentDTO.setType(type);
		String extension = FilenameUtils.getExtension(file.getOriginalFilename());
		log.debug("********file extension : "+extension);
		String ext = env.getProperty("extensionImg");
		log.debug("********** validation extension : "+ ext);
		String[] arrExt = ext.split(",");
		for (String exten : arrExt)
		{
			log.debug("**********file extension read : " + exten);
			if (extension.equalsIgnoreCase(exten)) {
				assetDocumentDTO = assetService.uploadFile(assetDocumentDTO, file);
				assetDocumentDTO.setExtension(extension);
			}
		}
		return new ResponseEntity<>(assetDocumentDTO, HttpStatus.OK);
	}
	/*
	 * @RequestMapping(path = "/assets/ppmschedule", method =
	 * RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	 *
	 * @Timed public ResponseEntity<?> saveAssetPPMSchedule(@Valid @RequestBody
	 * AssetPpmScheduleDTO assetPpmScheduleDTO, HttpServletRequest request) {
	 * log.debug(">>> Asset DTO saveAssetPPMSchedule request <<<"); log.debug(
	 * "Title <<<" + assetPpmScheduleDTO.getTitle());
	 *
	 * try { if(!assetService.isDuplicatePPMSchedule(assetPpmScheduleDTO)) {
	 * log.debug(">>> going to create <<<"); assetPpmScheduleDTO =
	 * assetService.createAssetPpmSchedule(assetPpmScheduleDTO); }else {
	 * log.debug(">>> duplicate <<<");
	 * assetPpmScheduleDTO.setMessage("error.duplicateRecordError"); return new
	 * ResponseEntity<>(assetPpmScheduleDTO,HttpStatus.BAD_REQUEST); }
	 *
	 *
	 * }catch(Exception e) { throw new TimesheetException(e,
	 * assetPpmScheduleDTO); }
	 *
	 * log.debug("Asset PPM Schedule new id - " + assetPpmScheduleDTO.getId());
	 * return new ResponseEntity<>(assetPpmScheduleDTO, HttpStatus.CREATED); }
	 */

	@RequestMapping(path = "/assets/ppmschedule", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveAssetPPMSchedule(@Valid @RequestBody AssetPpmScheduleDTO assetPpmScheduleDTO,
			HttpServletRequest request) {
		log.debug(">>> Asset DTO saveAssetPPMSchedule request <<<");
		log.debug("Title <<<" + assetPpmScheduleDTO.getTitle());

		AssetPpmScheduleDTO response = assetService.createAssetPpmSchedule(assetPpmScheduleDTO);
		log.debug("Asset PPM Schedule save response - " + response);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@RequestMapping(path = "/assets/ppmschedule", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateAssetPPMSchedule(@Valid @RequestBody AssetPpmScheduleDTO assetPpmScheduleDTO,
			HttpServletRequest request) {
		log.debug(">>> Asset DTO updateAssetPPMSchedule request <<<");
		log.debug(">>> PPM Title <<< " + assetPpmScheduleDTO.getTitle());

		AssetPpmScheduleDTO response = assetService.updateAssetPPMSchedule(assetPpmScheduleDTO);
		log.debug("Asset PPM Schedule update response - " + response.getTitle());
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@RequestMapping(path = "/assets/{assetId}/ppmschedule/calendar", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public List<AssetPPMScheduleEventDTO> getAssetPPMScheduleCalendar(@RequestBody SearchCriteria searchCriteria) {
		log.debug(">>> Asset Resource getAssetPPMScheduleCalendar request <<<");
		log.debug("AssetId <<< " + searchCriteria.getAssetId() + " - startDate - "
				+ searchCriteria.getCheckInDateTimeFrom() + " - endDate - " + searchCriteria.getCheckInDateTimeTo());

		List<AssetPPMScheduleEventDTO> response = assetService.getAssetPPMScheduleCalendar(searchCriteria.getAssetId(),
				searchCriteria.getCheckInDateTimeFrom(), searchCriteria.getCheckInDateTimeTo());
		log.debug("Get Asset PPM Schedule calendar for asset id size - " + response);
		return response;
	}

	@RequestMapping(value = { "/assets/getAllFile/{type}/{id}",
			"/assets/getAllAssetPhoto/{type}/{id}" }, method = RequestMethod.GET)
	public List<AssetDocumentDTO> getUploadedFiles(@PathVariable String type, @PathVariable Long id) {
		List<AssetDocumentDTO> result = null;
		result = assetService.findAllDocuments(type, id);
		return result;
	}

	@RequestMapping(path = "/assets/amcschedule", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveAssetAMCSchedule(@Valid @RequestBody AssetAMCScheduleDTO assetAMCScheduleDTO,
			HttpServletRequest request) {
		log.debug(">>> Asset DTO saveAssetAMCSchedule request <<<");
		log.debug("Title <<<" + assetAMCScheduleDTO.getTitle());

		AssetAMCScheduleDTO response = assetService.createAssetAMCSchedule(assetAMCScheduleDTO);
		log.debug("Asset AMC Schedule save response - " + response);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@RequestMapping(path = "/assets/amcschedule", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateAssetAMCSchedule(@Valid @RequestBody AssetAMCScheduleDTO assetAMCScheduleDTO,
			HttpServletRequest request) {
		log.debug(">>> Asset DTO updateAssetAMCSchedule request <<<");
		log.debug("Title <<<" + assetAMCScheduleDTO.getTitle());

		AssetAMCScheduleDTO response = assetService.updateAssetAMCSchedule(assetAMCScheduleDTO);
		log.debug("Asset AMC Schedule update response - " + response);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@RequestMapping(path = "/assets/{assetId}/amcschedule", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public List<AssetAMCScheduleDTO> getAssetAMCSchedule(@PathVariable("assetId") long assetId) {
		log.debug(">>> Asset DTO updateAssetAMCSchedule request <<<");
		log.debug("AssetId <<<" + assetId);

		List<AssetAMCScheduleDTO> response = assetService.getAssetAMCSchedules(assetId);
		log.debug("Get Asset AMC Schedule for asset id - " + response);
		return response;
	}

	@RequestMapping(value = "/assets/viewFile/{documentId}/{fileName:.+}", method = RequestMethod.GET)
	public ResponseEntity<byte[]> getUploadFile(@PathVariable("documentId") long documentId,
			@PathVariable("fileName") String fileName, HttpServletResponse response) throws IOException {
		log.debug("DocumentId" + documentId);
		MediaType mediaType = fileUploaderUtils.getMediaTypeForFileName(this.servletContext, fileName);
		log.debug("fileName: " + fileName);
		log.debug("mediaType: " + mediaType);
		byte[] content = assetService.getUploadedFile(documentId);
		response.setContentType(mediaType.getType());
		response.setContentLength(content.length);
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
		return new ResponseEntity<byte[]>(content, HttpStatus.OK);
	}

	@RequestMapping(value = "/assets/saveReadings", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> saveAssetReadings(@Valid @RequestBody AssetParameterReadingDTO assetParamReadingDTO,
			HttpServletRequest request) {
		log.debug("Save Asset Parameter Reading" + assetParamReadingDTO.getName());
		log.debug("Save Asset Parameter Reading" + assetParamReadingDTO.getAssetParameterConfigId());
		try {
			assetParamReadingDTO.setUserId(SecurityUtils.getCurrentUserId());
			if (assetParamReadingDTO.getId() > 0) {
				log.debug("Update Asset Parameter Reading" + assetParamReadingDTO.getId());
				assetParamReadingDTO = assetService.updateAssetReadings(assetParamReadingDTO);
			} else {
				assetParamReadingDTO = assetService.saveAssetReadings(assetParamReadingDTO);
			}

		} catch (TimesheetException e) {
			throw new TimesheetException(e, assetParamReadingDTO);
		}
		return new ResponseEntity<>(assetParamReadingDTO, HttpStatus.CREATED);
	}

	@RequestMapping(value = "/assets/{id}/viewReadings", method = RequestMethod.GET)
	public AssetParameterReadingDTO getReadings(@PathVariable("id") long id) {
		AssetParameterReadingDTO result = null;
		result = assetService.viewReadings(id);
		return result;
	}

	@RequestMapping(value = "/assets/amc/frequency", method = RequestMethod.GET)
	public Frequency[] getAllFrequency() {
		Frequency[] List = null;
		List = assetService.getAllType();
		return List;
	}

	@RequestMapping(value = "/assets/amc/frequencyPrefix", method = RequestMethod.GET)
	public FrequencyPrefix[] getAllFrequencyPrefix() {
		FrequencyPrefix[] List = null;
		List = assetService.getAllPrefixs();
		return List;
	}

	@RequestMapping(value = "/assets/viewAssetReadings", method = RequestMethod.POST)
	public SearchResult<AssetParameterReadingDTO> getAssetReadings(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<AssetParameterReadingDTO> result = null;
		result = assetService.viewAssetReadings(searchCriteria);
		return result;
	}

	@RequestMapping(value = "/assets/{assetId}/getLatestReading/{assetParamId}", method = RequestMethod.GET)
	public AssetParameterReadingDTO getLatestReading(@PathVariable("assetId") long assetId,
			@PathVariable("assetParamId") long assetParamId) {
		AssetParameterReadingDTO result = null;
		result = assetService.getLatestParamReading(assetId, assetParamId);
		return result;
	}

	@RequestMapping(value = "/assets/{id}/document/image", method = RequestMethod.DELETE)
    public ResponseEntity<?>  deleteImages(@PathVariable("id") long id) {
        log.debug("images ids -"+id);
        String result = null;
        result = assetService.deleteImages(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

	@RequestMapping(path="/assets/import", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ImportResult> importAssetData(@RequestParam("assetFile") MultipartFile file){
		Calendar cal = Calendar.getInstance();
		ImportResult result = assetService.importFile(file, cal.getTimeInMillis());
        if(!StringUtils.isEmpty(result.getStatus()) && result.getStatus().equalsIgnoreCase("FAILED")) {
	    		return new ResponseEntity<ImportResult>(result,HttpStatus.BAD_REQUEST);
	    }
		return new ResponseEntity<ImportResult>(result, HttpStatus.OK);
	}

	@RequestMapping(value = "/assets/import/{fileId}/status", method = RequestMethod.GET)
	public ImportResult importStatus(@PathVariable("fileId") String fileId) {
		// log.debug("ImportStatus - fileId -"+ fileId);
		ImportResult result = assetService.getImportStatus(fileId);
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

	@RequestMapping(path = "/assets/ppm/import", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ImportResult> importAssetPPMData(@RequestParam("assetPPMFile") MultipartFile file) {
		Calendar cal = Calendar.getInstance();
		ImportResult result = assetService.importPPMFile(file, cal.getTimeInMillis());
        if(!StringUtils.isEmpty(result.getStatus()) && result.getStatus().equalsIgnoreCase("FAILED")) {
	    		return new ResponseEntity<ImportResult>(result,HttpStatus.BAD_REQUEST);
	    }
		return new ResponseEntity<ImportResult>(result, HttpStatus.OK);
	}

	@RequestMapping(value = "/assets/ppm/import/{fileId}/status", method = RequestMethod.GET)
	public ImportResult importPPMStatus(@PathVariable("fileId") String fileId) {
		// log.debug("ImportStatus - fileId -"+ fileId);
		ImportResult result = assetService.getImportStatus(fileId);
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

	@RequestMapping(path = "/assets/amc/import", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ImportResult> importAssetAMCData(@RequestParam("assetAMCFile") MultipartFile file) {
		Calendar cal = Calendar.getInstance();
		ImportResult result = assetService.importAMCFile(file, cal.getTimeInMillis());
        if(!StringUtils.isEmpty(result.getStatus()) && result.getStatus().equalsIgnoreCase("FAILED")) {
	    		return new ResponseEntity<ImportResult>(result,HttpStatus.BAD_REQUEST);
	    }
		return new ResponseEntity<ImportResult>(result, HttpStatus.OK);
	}

	@RequestMapping(value = "/assets/amc/import/{fileId}/status", method = RequestMethod.GET)
	public ImportResult importAMCStatus(@PathVariable("fileId") String fileId) {
		// log.debug("ImportStatus - fileId -"+ fileId);
		ImportResult result = assetService.getImportStatus(fileId);
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

	@RequestMapping(value = "/assets/export", method = RequestMethod.POST)
	public ExportResponse exportAsset(@RequestBody SearchCriteria searchCriteria) {
		// log.debug("JOB EXPORT STARTS HERE **********");
		ExportResponse resp = new ExportResponse();
		if (searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			SearchResult<AssetDTO> result = assetService.findBySearchCrieria(searchCriteria);
			List<AssetDTO> results = result.getTransactions();
			resp.addResult(assetService.generateReport(results, searchCriteria));

			// log.debug("RESPONSE FOR OBJECT resp *************"+resp);
		}
		return resp;
	}

	@RequestMapping(value = "/assets/export/{fileId}/status", method = RequestMethod.GET)
	public ExportResult exportStatus(@PathVariable("fileId") String fileId) {
		// log.debug("ExportStatus - fileId -"+ fileId);
		ExportResult result = assetService.getExportStatus(fileId);

		// log.debug("RESULT NOW **********"+result);
		// log.debug("RESULT GET STATUS **********"+result.getStatus());

		if (result != null && result.getStatus() != null) {
			switch (result.getStatus()) {
			case "PROCESSING":
				result.setMsg("Exporting...");
				break;
			case "COMPLETED":
				result.setMsg("Download");
				// log.debug("DOWNLOAD FILE PROCESSING HERE
				// ************"+result.getMsg());
				// log.debug("FILE ID IN API CALLING ************"+fileId);
				result.setFile("/api/assets/export/" + fileId);
				// log.debug("DOWNLOADED FILE IS
				// ************"+result.getFile());
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

	@RequestMapping(value = "/assets/export/{fileId}", method = RequestMethod.GET)
	public byte[] getExportFile(@PathVariable("fileId") String fileId, HttpServletResponse response) {
		byte[] content = assetService.getExportFile(fileId);
		response.setContentType("Application/x-msexcel");
		response.setContentLength(content.length);
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Content-Disposition", "attachment; filename=\"" + fileId + ".xlsx\"");
		return content;
	}

	@RequestMapping(value = "/assets/52week/export", method = RequestMethod.POST)
	public ExportResponse exportAsset52WeekSchedule(@RequestBody SearchCriteria searchCriteria) {
		// log.debug("JOB EXPORT STARTS HERE **********");
		ExportResponse resp = new ExportResponse();
		if (searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			ExportResult result = assetService.generate52WeekSchedule(searchCriteria.getSiteId(),
					searchCriteria.getAssetId());
			resp.addResult(result);

			// log.debug("RESPONSE FOR OBJECT resp *************"+resp);
		}
		return resp;
	}

	@RequestMapping(value = "/assets/readingRules", method = RequestMethod.GET)
	public AssetReadingRule[] getAllRules() {
		AssetReadingRule[] List = null;
		List = assetService.getAllRules();
		return List;
	}

	@RequestMapping(value = "/assets/update/config", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> updateAssetConfig(@Valid @RequestBody AssetParameterConfigDTO assetParameterConfigDTO,
			HttpServletRequest request) {
		try {
			assetService.updateAssetConfig(assetParameterConfigDTO);
		} catch (Exception e) {
			throw new TimesheetException("Error while updating AssetConfig" + e);
		}

		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/assets/config/{id}", method = RequestMethod.GET)
	public AssetParameterConfigDTO getAssetConfig(@PathVariable("id") long id, HttpServletRequest request) {
		AssetParameterConfigDTO result = null;
		result = assetService.getAssetConfig(id);
		return result;
	}

	@RequestMapping(value= "/list/qrcodes/[{assetIds}]", method = RequestMethod.GET)
	public List<Object> findAllAssetQrCodes(@PathVariable long[] assetIds) {
		log.info("Get List of Asset qr codes");
		List<Object> qrList = null;
		try {
			qrList = assetService.findAllAssetQrcode(assetIds);
		} catch(Exception e) {
			throw new TimesheetException("Error while get listing QR codes" + e);
		}
		return qrList;
	}

	@RequestMapping(value= "/list/qrcodes/findAll", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<Object> findAllAssetQrCodes(@RequestBody SearchCriteria search) {
		log.info("Get List of All Asset QR Codes");
		List<Object> qrLists = null;
		try {
			qrLists = assetService.findAllQrcodes(search.getSiteId());
		} catch(Exception e) {
			throw new TimesheetException("Error while get listing QR codes" + e);
		}
		return qrLists;
	}

	@RequestMapping(value = "/assets/statusHistory", method=RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public SearchResult<AssetStatusHistoryDTO> viewStatusHistory(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<AssetStatusHistoryDTO> result = null;
		try {
			result = assetService.viewAssetStatusHistory(searchCriteria);
		} catch(Exception e) {
			throw new TimesheetException("Error while get asset status history" +e);
		}
		return result;
	}

	@RequestMapping(value = "/assets/siteHistory", method=RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public SearchResult<AssetSiteHistoryDTO> viewSiteHistory(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<AssetSiteHistoryDTO> result = null;
		try {
			result = assetService.viewAssetSiteHistory(searchCriteria);
		} catch(Exception e) {
			throw new TimesheetException("Error while get asset site history" +e);
		}
		return result;
	}

	@RequestMapping(value = "/assets/tickets", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public SearchResult<TicketDTO> getAssetTickets(@RequestBody SearchCriteria searchCriteria) {
	    SearchResult<TicketDTO> result = null;
	    try{
	        result = assetService.getAssetTickets(searchCriteria);
        } catch (Exception e){
	        throw new TimesheetException("Error while get Asset Tickets" +e);
        }
	    return result;
    }



}
