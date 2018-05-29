package com.ts.app.web.rest;

import java.util.Calendar;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.ParameterConfigService;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.ParameterConfigDTO;
import com.ts.app.web.rest.dto.ParameterDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;

/**
 * REST controller for managing the ParameterConfig information.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class ParameterConfigResource {

	private final Logger log = LoggerFactory.getLogger(ParameterConfigResource.class);

	@Inject
	private ParameterConfigService parameterConfigService;

	@Inject
	private ImportUtil importUtil;

	@Inject
	public ParameterConfigResource(ParameterConfigService parameterConfigService) {
		this.parameterConfigService = parameterConfigService;
	}

	/**
	 * POST /saveParameterConfig -> saveParameterConfig the ParameterConfig.
	 */
	@RequestMapping(value = "/parameterConfig", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveParameterConfig(@Valid @RequestBody ParameterConfigDTO parameterConfigDTO, HttpServletRequest request) {
		log.info("Inside the saveParameterConfig -" + parameterConfigDTO.getName() + ", assetType -" + parameterConfigDTO.getAssetType());
		try  {
			parameterConfigDTO.setUserId(SecurityUtils.getCurrentUserId());
			parameterConfigDTO = parameterConfigService.createParameterConfigInformation(parameterConfigDTO);
		}catch (Exception cve) {
			throw new TimesheetException(cve, parameterConfigDTO);
		}

		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	/**
	 * POST /saveParameterConfig -> saveParameter the Parameter.
	 */
	@RequestMapping(value = "/parameter", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveParameter(@Valid @RequestBody ParameterDTO parameterDTO, HttpServletRequest request) {
		log.info("Inside the saveParameter -" + parameterDTO.getName());
		try  {
			parameterDTO.setUserId(SecurityUtils.getCurrentUserId());
			parameterDTO = parameterConfigService.createParameter(parameterDTO);
		}catch (Exception cve) {
			throw new TimesheetException(cve, parameterDTO);
		}

		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/parameterConfig", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateParameterConfig(@Valid @RequestBody ParameterConfigDTO parameterConfig, HttpServletRequest request) {
		log.info("Inside Update" + parameterConfig.getName() + " , "+ parameterConfig.getAssetType());
		try {
			parameterConfigService.updateParameterConfig(parameterConfig);
		}catch (Exception cve) {
			throw new TimesheetException(cve);
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/parameterConfig/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		log.info("Inside Delete" + id);
		parameterConfigService.deleteParameterConfig(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/parameterConfig", method = RequestMethod.GET)
	public List<ParameterConfigDTO> findAll(HttpServletRequest request) {
		log.info("--Invoked ParameterConfigResource.findAll --");
		return parameterConfigService.findAll();
	}
	
	@RequestMapping(value = "/parameter", method = RequestMethod.GET)
	public List<ParameterDTO> findAllParameters(HttpServletRequest request) {
		log.info("--Invoked ParameterConfigResource.findAllParameters --");
		return parameterConfigService.findAllParameters();
	}

	@RequestMapping(value = "/parameterConfig/{id}", method = RequestMethod.GET)
	public ParameterConfigDTO get(@PathVariable Long id) {
		return parameterConfigService.findOne(id);
	}

	@RequestMapping(value = "/parameterConfig/search",method = RequestMethod.POST)
	public SearchResult<ParameterConfigDTO> searchParameterConfigs(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<ParameterConfigDTO> result = null;
		if(searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = parameterConfigService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}


    @RequestMapping(value = "/parameterConfig/import", method = RequestMethod.POST)
    public ResponseEntity<ImportResult> importJobData(@RequestParam("parameterConfigFile") MultipartFile file){
    	log.info("--Invoked ParameterConfig Import --");
		Calendar cal = Calendar.getInstance();
		//ImportResult result = importUtil.importParameterConfigData(file, cal.getTimeInMillis());
		ImportResult result = null;
		return new ResponseEntity<ImportResult>(result,HttpStatus.OK);
	}

    @RequestMapping(value = "/parameterConfig/import/{fileId}/status",method = RequestMethod.GET)
	public ImportResult importStatus(@PathVariable("fileId") String fileId) {
		log.debug("ImportStatus -  fileId -"+ fileId);
		//ImportResult result = parameterConfigService.getImportStatus(fileId);
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
