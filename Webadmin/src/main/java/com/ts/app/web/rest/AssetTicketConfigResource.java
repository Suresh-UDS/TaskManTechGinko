package com.ts.app.web.rest;

import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.hibernate.loader.custom.Return;
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
import com.ts.app.domain.AssetTicketConfig;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.AssetTicketConfigService;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.web.rest.dto.AssetTicketConfigDTO;
import com.ts.app.web.rest.dto.AssetTypeDTO;
import com.ts.app.web.rest.errors.TimesheetException;

import antlr.StringUtils;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class AssetTicketConfigResource {
	
	private final Logger log = LoggerFactory.getLogger(AssetTicketConfig.class);
	
	@Inject
	private ImportUtil importUtil;
	
	@Inject
	private AssetTicketConfigService assetTicketConfigService;
	
	@Inject
	public AssetTicketConfigResource(AssetTicketConfigService assetTicketConfigService) {
		this.assetTicketConfigService = assetTicketConfigService;
	}
	
	//Save asset ticket config
	@RequestMapping(value = "/assetTicketSave", method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveAssetTicketConfig(@Valid @RequestBody AssetTicketConfigDTO assetTicketConfigDTO,HttpServletRequest request){
		try {
			assetTicketConfigDTO.setUserId(SecurityUtils.getCurrentUserId());
			assetTicketConfigDTO = assetTicketConfigService.createTicketConfigInfo(assetTicketConfigDTO);
			
		}catch (Exception ex){
			throw new TimesheetException(ex,assetTicketConfigDTO);
		}
		return new ResponseEntity<>(assetTicketConfigDTO,HttpStatus.CREATED);
		
	}
	
	
	//Update asset ticket config
	@RequestMapping(value = "/assetTicketUpdate", method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateAssetTicketConfig(@Valid @RequestBody AssetTicketConfigDTO assetTicketConfig,HttpServletRequest request){
	
		try {
			assetTicketConfigService.updateAssetTicketConfig(assetTicketConfig);
		}catch (Exception ex) {
			throw new TimesheetException(ex);
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	//Find all
	@RequestMapping(value = "/assetTicketFindAll", method = RequestMethod.GET)
	public List<AssetTicketConfigDTO> findAll(HttpServletRequest request) {
		return assetTicketConfigService.findAll();
	}
	
	//FindOne
	@RequestMapping(value = "/assetTicketFindOne/{id}", method = RequestMethod.GET)
	public AssetTicketConfigDTO get(@PathVariable Long id) {
		return assetTicketConfigService.findOne(id);
	}
	
    
}
