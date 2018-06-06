package com.ts.app.web.rest;

import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.websocket.server.PathParam;

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
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.AssetManagementService;
import com.ts.app.web.rest.dto.AssetAMCScheduleDTO;
import com.ts.app.web.rest.dto.AssetDTO;
import com.ts.app.web.rest.dto.AssetDocumentDTO;
import com.ts.app.web.rest.dto.AssetParameterConfigDTO;
import com.ts.app.web.rest.dto.AssetPpmScheduleDTO;
import com.ts.app.web.rest.dto.AssetTypeDTO;
import com.ts.app.web.rest.dto.AssetgroupDTO;
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

	// Asset
	@RequestMapping(path = "/asset", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveAsset(@Valid @RequestBody AssetDTO assetDTO, HttpServletRequest request) {
		log.debug(">>> Asset DTO save request <<<");

		AssetDTO response = assetService.saveAsset(assetDTO);
		log.debug("Asset new id - " + response.getId());
		return new ResponseEntity<>(response, HttpStatus.CREATED);
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

	@RequestMapping(path = "/site/{id}/asset", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<AssetDTO> getSiteAssets(@PathVariable("id") Long siteId) {
		return assetService.getSiteAssets(siteId);
	}

	@RequestMapping(path = "/asset/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public AssetDTO getAsset(@PathVariable("id") Long id) {
		log.debug(">>> get asset! <<<");
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
		log.debug("Asset Details in updateAsset id from dto = " + assetDTO.getId());
		AssetDTO response = assetService.updateAsset(assetDTO);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
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

	@RequestMapping(value = "/assets/{type}/config/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<AssetParameterConfigDTO> getAssetConfig(@PathVariable("type") String type,
			@PathVariable("id") Long id) {
		List<AssetParameterConfigDTO> result = null;
		if (type != null && id != null) {
			result = assetService.findByAssetConfig(type, id);
		}
		return result;

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

		AssetPpmScheduleDTO response = assetService.createAssetPpmSchedule(assetPpmScheduleDTO);
		log.debug("Asset Ppm Schedule save response - " + response);
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
	public List<AssetAMCScheduleDTO> getAssetAMCSchedule(@PathParam("assetId") long id) {
		log.debug(">>> Asset DTO updateAssetAMCSchedule request <<<");
		log.debug("AssetId <<<" + id);

		List<AssetAMCScheduleDTO> response = assetService.getAssetAMCSchedules(id);
		log.debug("Get Asset AMC Schedule for asset id - " + response);
		return response;
	}
}