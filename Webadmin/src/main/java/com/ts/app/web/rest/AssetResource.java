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
import com.ts.app.service.AssetManagementService;
import com.ts.app.web.rest.dto.AssetDTO;
import com.ts.app.web.rest.dto.AssetgroupDTO;
import com.ts.app.web.rest.dto.DesignationDTO;
import com.ts.app.web.rest.errors.TimesheetException;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;

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
	
	//Asset
    @RequestMapping(path="/asset",method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> saveAsset(@Valid @RequestBody AssetDTO assetDTO, HttpServletRequest request) {
        log.debug(">>> Asset DTO save request <<<");
        log.debug("Title <<<"+assetDTO.getTitle());
        log.debug("AssetGroup <<<"+assetDTO.getAssetGroup());
        log.debug("ProjectId <<<"+assetDTO.getProjectId());
        log.debug("SiteId <<<"+assetDTO.getSiteId());
        log.debug("Block <<<"+assetDTO.getBlock());
        log.debug("Floor <<<"+assetDTO.getFloor());
        log.debug("Zone <<<"+assetDTO.getZone());
        log.debug("ModelNumber <<<"+assetDTO.getModelNumber());
        log.debug("SerialNumber <<<"+assetDTO.getSerialNumber());
        log.debug("PurchasePrice <<<"+assetDTO.getPurchasePrice());
        log.debug("CurrentPrice <<<"+assetDTO.getCurrentPrice());
        log.debug("EstimatedDisposePrice <<<"+assetDTO.getEstimatedDisposePrice());
        log.debug("Code <<<"+assetDTO.getCode());
        log.debug("UdsAsset <<<"+assetDTO.isUdsAsset());
        
        AssetDTO response = assetService.saveAsset(assetDTO);
        log.debug("Asset save response - "+ response);
        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }

    @RequestMapping(value = "/assets/search",method = RequestMethod.POST)
    public List<AssetDTO> findAllAssets(HttpServletRequest request) {
        log.info("--Invoked Location.findAll --");
        return assetService.findAllAssets();
    }
    
	@RequestMapping(value = "/asset/search",method = RequestMethod.POST)
	public SearchResult<AssetDTO> searchAssets(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<AssetDTO> result = null;
		if(searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = assetService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}

    @RequestMapping(path="/site/{id}/asset", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<AssetDTO> getSiteAssets(@PathVariable("id") Long siteId){
        return assetService.getSiteAssets(siteId);
    }

    @RequestMapping(path="/asset/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public AssetDTO getAsset(@PathVariable("id") Long id){
    	log.debug(">>> get asset! <<<");
        return assetService.getAssetDTO(id);
    }

    @RequestMapping(path="/asset/code/{code}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public AssetDTO getAssetByCode(@PathVariable("code") String code){
        return assetService.getAssetByCode(code);
    }

    @RequestMapping(path="/asset/{id}",method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> updateAsset(@Valid @RequestBody AssetDTO assetDTO, HttpServletRequest request, @PathVariable("id") Long id) {
    	log.debug(">>> asset id : "+id);
        if(assetDTO.getId()==null) assetDTO.setId(id);
        log.debug("Asset Details in updateAsset = "+ assetDTO);
        log.debug(">>> Asset Update Request <<<");
        log.debug("Title <<<"+assetDTO.getTitle());
        log.debug("AssetGroup <<<"+assetDTO.getAssetGroup());
        log.debug("ProjectId <<<"+assetDTO.getProjectId());
        log.debug("SiteId <<<"+assetDTO.getSiteId());
        log.debug("Block <<<"+assetDTO.getBlock());
        log.debug("Floor <<<"+assetDTO.getFloor());
        log.debug("Zone <<<"+assetDTO.getZone());
        log.debug("ModelNumber <<<"+assetDTO.getModelNumber());
        log.debug("SerialNumber <<<"+assetDTO.getSerialNumber());
        log.debug("PurchasePrice <<<"+assetDTO.getPurchasePrice());
        log.debug("CurrentPrice <<<"+assetDTO.getCurrentPrice());
        log.debug("EstimatedDisposePrice <<<"+assetDTO.getEstimatedDisposePrice());
        log.debug("Code <<<"+assetDTO.getCode());
        log.debug("UdsAsset <<<"+assetDTO.isUdsAsset());
        AssetDTO response = assetService.updateAsset(assetDTO);
        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }

    @RequestMapping(value = "/asset/{id}/qrcode", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
    public String generateAssetQRCode(@PathVariable("id") long assetId) {
        return assetService.generateAssetQRCode(assetId);
    }
    
    @RequestMapping(value = "/assetgroup", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> saveAssetGroup(@Valid @RequestBody AssetgroupDTO assetgroupDTO, HttpServletRequest request) {
        log.info(">>> Inside the save assetgroup -");
        log.info(">>> Inside Save assetgroup <<< "+assetgroupDTO.getAssetgroup());
        long userId = SecurityUtils.getCurrentUserId();
        try {
        	AssetgroupDTO assetgroup= assetService.createAssetGroup(assetgroupDTO);
        }catch(Exception e) {
            throw new TimesheetException(e, assetgroupDTO);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    
    @RequestMapping(value = "/assetgroup", method = RequestMethod.GET)
    public List<AssetgroupDTO> findAllAssetGroups() {
        log.info("--Invoked AssetResource.findAllAssetGroups --");
        return assetService.findAllAssetGroups();
    }
}
