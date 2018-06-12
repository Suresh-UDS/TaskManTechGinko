package com.ts.app.web.rest;

import java.io.IOException;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.websocket.server.PathParam;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import com.ts.app.domain.AssetParameterReading;
import com.ts.app.domain.Frequency;
import com.ts.app.domain.FrequencyDuration;
import com.ts.app.domain.FrequencyPrefix;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.AssetManagementService;
import com.ts.app.service.util.FileUploadHelper;
import com.ts.app.web.rest.dto.AssetAMCScheduleDTO;
import com.ts.app.web.rest.dto.AssetDTO;
import com.ts.app.web.rest.dto.AssetDocumentDTO;
import com.ts.app.web.rest.dto.AssetParameterConfigDTO;
import com.ts.app.web.rest.dto.AssetParameterReadingDTO;
import com.ts.app.web.rest.dto.AssetPpmScheduleDTO;
import com.ts.app.web.rest.dto.AssetTypeDTO;
import com.ts.app.web.rest.dto.AssetgroupDTO;
import com.ts.app.web.rest.dto.ImageDeleteRequest;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;

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
	private FileUploadHelper fileUploaderUtils;
	
	@Autowired
    private ServletContext servletContext;

	// Asset
	@RequestMapping(path = "/asset", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveAsset(@Valid @RequestBody AssetDTO assetDTO, HttpServletRequest request) {
		log.debug(">>> Asset DTO save request <<<");
		
		try {
			if(!assetService.isDuplicate(assetDTO)) {
				log.debug(">>> going to create <<<");
				assetDTO = assetService.saveAsset(assetDTO);
			}else {
				log.debug(">>> duplicate <<<");
				assetDTO.setMessage("error.duplicateRecordError");
				return new ResponseEntity<>(assetDTO,HttpStatus.BAD_REQUEST);
			}
		}catch(Exception e) {
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
	
	@RequestMapping(path = "/site/{id}/asset", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<AssetDTO> getSiteAssets(@PathVariable("id") Long siteId) {
		return assetService.getSiteAssets(siteId);
	}

	@RequestMapping(path = "/asset/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public AssetDTO getAsset(@PathVariable("id") Long id) {
		log.debug(">>> get asset details! by asset id from resource <<<"+id);
		return assetService.getAssetDTO(id);
	}

	@RequestMapping(path = "/asset/code/{code}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public AssetDTO getAssetByCode(@PathVariable("code") String code) {
		return assetService.getAssetByCode(code);
	}

	@RequestMapping(path = "/asset/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateAsset(@Valid @RequestBody AssetDTO assetDTO, HttpServletRequest request,
			@PathVariable("id") Long id) {
		log.debug(">>> asset id : " + id);
		if (assetDTO.getId() > 0)
			assetDTO.setId(id);
		AssetDTO response = assetService.updateAsset(assetDTO);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/asset/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		log.debug(">>> Inside Asset Delete " + id);
		assetService.deleteAsset(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/asset/{id}/qrcode/{code}", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
	public String generateAssetQRCode(@PathVariable("id") long assetId, @PathVariable("code") String assetCode) {
		return assetService.generateAssetQRCode(assetId, assetCode);
	}

	@RequestMapping(path = "/asset/qrcode/{id}", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
	public String getQRCode(@PathVariable("id") Long id) {
		log.debug(">>> get QR Code! <<<");
		return assetService.getQRCode(id);
	}

	@RequestMapping(value = "/assetgroup", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveAssetGroup(@Valid @RequestBody AssetgroupDTO assetgroupDTO,
			HttpServletRequest request) {
		log.info(">>> Inside the save assetgroup -");
		log.info(">>> Inside Save assetgroup <<< " + assetgroupDTO.getAssetgroup());
		long userId = SecurityUtils.getCurrentUserId();
		try {
			AssetgroupDTO assetgroup = assetService.createAssetGroup(assetgroupDTO);
		} catch (Exception e) {
			throw new TimesheetException(e, assetgroupDTO);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/assetgroup", method = RequestMethod.GET)
	public List<AssetgroupDTO> findAllAssetGroups() {
		log.info("--Invoked AssetResource.findAllAssetGroups --");
		return assetService.findAllAssetGroups();
	}

	@RequestMapping(value = "/assets/type", method = RequestMethod.GET)
	public List<AssetTypeDTO> findAllAssetType() {
		log.info("Get All Asset Type");
		return assetService.findAllAssetType();
	}

	@RequestMapping(value = "/assets/config", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<AssetParameterConfigDTO>> getAssetConfig(@Valid @RequestBody AssetParameterConfigDTO assetParamConfigDTO) {
		List<AssetParameterConfigDTO> result = null;
		if (assetParamConfigDTO.getAssetType()!=null && assetParamConfigDTO.getAssetId() > 0) {
			result = assetService.findByAssetConfig(assetParamConfigDTO.getAssetType(), assetParamConfigDTO.getAssetId());
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

	@RequestMapping(value = { "/assets/uploadFile", "/assets/uploadAssetPhoto" }, method = RequestMethod.POST)
	public ResponseEntity<?> uploadAssetFile(@RequestParam("title") String title, @RequestParam("assetId") long assetId,
			@RequestParam("uploadFile") MultipartFile file, @RequestParam("type") String type,
			AssetDocumentDTO assetDocumentDTO) {
		assetDocumentDTO.setAssetId(assetId);
		assetDocumentDTO.setTitle(title);
		assetDocumentDTO.setType(type);
		assetDocumentDTO = assetService.uploadFile(assetDocumentDTO, file);
		return new ResponseEntity<>(assetDocumentDTO, HttpStatus.OK);
	}

	@RequestMapping(path = "/assets/ppmschedule", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveAssetPPMSchedule(@Valid @RequestBody AssetPpmScheduleDTO assetPpmScheduleDTO,
			HttpServletRequest request) {
		log.debug(">>> Asset DTO saveAssetPPMSchedule request <<<");
		log.debug("Title <<<" + assetPpmScheduleDTO.getTitle());
		
		try {
			if(!assetService.isDuplicatePPMSchedule(assetPpmScheduleDTO)) {
				log.debug(">>> going to create <<<");
				assetPpmScheduleDTO = assetService.createAssetPpmSchedule(assetPpmScheduleDTO);
			}else {
				log.debug(">>> duplicate <<<");
				assetPpmScheduleDTO.setMessage("error.duplicateRecordError");
				return new ResponseEntity<>(assetPpmScheduleDTO,HttpStatus.BAD_REQUEST);
			}
			

		}catch(Exception e) {
			throw new TimesheetException(e, assetPpmScheduleDTO);
		}
		
		log.debug("Asset PPM Schedule new id - " + assetPpmScheduleDTO.getId());
		return new ResponseEntity<>(assetPpmScheduleDTO, HttpStatus.CREATED);
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

	@RequestMapping(path = "/assets/{assetId}/ppmschedule", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public List<AssetPpmScheduleDTO> getAssetPPMSchedule(@PathVariable("assetId") Long assetId) {
		log.debug(">>> Asset Resource getAssetPPMSchedule request <<<");
		log.debug("AssetId <<< " + assetId);

		List<AssetPpmScheduleDTO> response = assetService.getAssetPPMSchedule(assetId);
		log.debug("Get Asset PPM Schedule for asset id size - " + response.size());
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
	
	@RequestMapping(path = "/assets/{assetId}/ppmschedulelist", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public List<AssetPpmScheduleDTO> getAssetPPMSchedule(@PathVariable("assetId") long assetId) {
		log.debug(">>> Asset PPM get request <<<");
		log.debug("AssetId <<<" + assetId);

		List<AssetPpmScheduleDTO> response = assetService.getAssetPPMSchedules(assetId);
		for(AssetPpmScheduleDTO assetPpmScheduleDTO:response) {
		log.debug("Get Asset PPM Schedule for asset id - " + assetPpmScheduleDTO.getId());
		}
		return response;
	}
	
	@RequestMapping(value = "/assets/viewFile/{documentId}/{fileName:.+}",method = RequestMethod.GET)
	public ResponseEntity<byte[]> getUploadFile(@PathVariable("documentId") long documentId, @PathVariable("fileName") String fileName, HttpServletResponse response) throws IOException {
		log.debug("DocumentId" +documentId);
		MediaType mediaType = fileUploaderUtils.getMediaTypeForFileName(this.servletContext, fileName);
		log.debug("fileName: " + fileName);
        log.debug("mediaType: " + mediaType);
		byte[] content = assetService.getUploadedFile(documentId);
		response.setContentType(mediaType.getType());
		response.setContentLength(content.length);
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Content-Disposition","attachment; filename=\"" + fileName + "\"");
		return new ResponseEntity<byte[]>(content, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/assets/saveReadings", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> saveAssetReadings(@Valid @RequestBody AssetParameterReadingDTO assetParamReadingDTO, HttpServletRequest request) {
		log.debug("Save Asset Parameter Reading" +assetParamReadingDTO.getName());
		try{ 
			assetParamReadingDTO.setUserId(SecurityUtils.getCurrentUserId());
			assetParamReadingDTO = assetService.saveAssetReadings(assetParamReadingDTO);
		} catch(TimesheetException e){ 
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
	
	@RequestMapping(value="/assets/amc/frequency", method = RequestMethod.GET) 
	public Frequency[] getAllFrequency() { 
		Frequency[] List = null;
		List = assetService.getAllType();
		return List;
	}
	
	@RequestMapping(value="/assets/amc/frequencyPrefix", method = RequestMethod.GET) 
	public FrequencyPrefix[] getAllFrequencyPrefix() { 
		FrequencyPrefix[] List = null;
		List = assetService.getAllPrefixs();
		return List;
	}
	
	@RequestMapping(value = "/assets/{assetId}/viewAssetReadings", method = RequestMethod.GET)
	public List<AssetParameterReadingDTO> getAssetReadings(@PathVariable("assetId") long assetId) {
		List<AssetParameterReadingDTO> result = null;
		result = assetService.viewAssetReadings(assetId);
		return result;
	}
	
	@RequestMapping(value = "/assets/{assetId}/getLatestReading/{assetParamId}", method = RequestMethod.GET)
	public AssetParameterReadingDTO getLatestReading(@PathVariable("assetId") long assetId, @PathVariable("assetParamId") long assetParamId) {
		AssetParameterReadingDTO result = null;
		result = assetService.getLatestParamReading(assetId, assetParamId);
		return result;
	}
	
	@RequestMapping(value = "/assets/{id}/document/image", method = RequestMethod.DELETE)
    public ResponseEntity<?>  deleteImages(@PathVariable("id") long id) {
        log.debug("images ids -"+id);
        assetService.deleteImages(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
	
	
	
}
