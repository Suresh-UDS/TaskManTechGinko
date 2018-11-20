package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.LocationService;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.LocationDTO;
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
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LocationResource {

    private final Logger log = LoggerFactory.getLogger(LocationResource.class);

    @Inject
    private LocationService locationService;

    @Inject
	private ImportUtil importUtil;


    @RequestMapping(value = "/location", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> saveLocation(@Valid @RequestBody LocationDTO locationDTO, HttpServletRequest request) {
        log.info("Inside the save location -" + locationDTO.getName());
        LocationDTO createdLocation = null;
        try {
            createdLocation  = locationService.saveLocation(locationDTO);
        }catch (Exception e) {
            String msg = "Error while creating location, please check the information";
            throw new TimesheetException(e, locationDTO);

        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/locations", method = RequestMethod.GET)
    public List<LocationDTO> findAll(@RequestBody SearchCriteria searchCriteria) {
        log.info("--Invoked LocationResource.findAllLocation --");
        return locationService.findAll(searchCriteria.getCurrPage());
    }

    @RequestMapping(value = "/location/{id}", method = RequestMethod.GET)
    public LocationDTO getLocation(@PathVariable Long id) {
        return locationService.findOne(id);
    }

    @RequestMapping(value = "/location/block/{block}/floor/{floor}/zone/{zone}/siteId/{siteId}", method = RequestMethod.GET)
    public LocationDTO getLocationId(@PathVariable String block, @PathVariable String floor, @PathVariable String zone, @PathVariable long siteId) {
        return locationService.findId(siteId,block,floor,zone);
    }

//    @RequestMapping(value = "/location/block/{block}/floor/{floor}/zone/{zone}/siteId/{siteId}", method = RequestMethod.GET)
//    public List<LocationDTO> getLocationIds(@PathVariable String block, @PathVariable String floor, @PathVariable String zone, @PathVariable long siteId) {
//        return locationService.findIds(siteId,block,floor,zone);
//    }

    @RequestMapping(value = "/location/project/{projectId}/site/{siteId}/block", method = RequestMethod.GET)
    public List<String> getBlocks(@PathVariable("projectId") long projectId,@PathVariable("siteId") long siteId) {
        return locationService.findBlocks(projectId, siteId);
    }

    @RequestMapping(value = "/location/project/{projectId}/site/{siteId}/block/{block}/floor", method = RequestMethod.GET)
    public List<String> getFloors(@PathVariable("projectId") long projectId,@PathVariable("siteId") long siteId, @PathVariable("block") String block) {
        return locationService.findFloors(projectId, siteId, block);
    }

    @RequestMapping(value = "/location/project/{projectId}/site/{siteId}/block/{block}/floor/{floor}/zone", method = RequestMethod.GET)
    public List<String> getZones(@PathVariable("projectId") long projectId,@PathVariable("siteId") long siteId, @PathVariable("block") String block, @PathVariable("floor") String floor) {
        return locationService.findZones(projectId, siteId, block, floor);
    }

    @RequestMapping(value = "/location/search",method = RequestMethod.POST)
    public SearchResult<LocationDTO> searchLocation(@RequestBody SearchCriteria searchCriteria) {
        SearchResult<LocationDTO> result = null;
        if(searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
            result = locationService.findBySearchCrieria(searchCriteria);
        }
        return result;
    }

    @RequestMapping(value = "/location/import", method = RequestMethod.POST)
    public ResponseEntity<ImportResult> importLocationData(@RequestParam("locationFile") MultipartFile file){
    	log.info("--Invoked Location Import --");
		Calendar cal = Calendar.getInstance();
		ImportResult result = importUtil.importLocationData(file, cal.getTimeInMillis());
		return new ResponseEntity<ImportResult>(result,HttpStatus.OK);
	}

//    @RequestMapping(value = "/location/{id}/qrcode/{siteId}", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
//    public String generateAssetQRCode(@PathVariable("id") long locationId, @PathVariable("siteId") long siteId) {
//        return locationService.generateLocationQRCode(locationId, siteId);
//    }
    
    @RequestMapping(value = "/location/{id}/qrcode/{siteId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Map<String, Object> generateLocationQRCode(@PathVariable("id") long locationId, @PathVariable("siteId") long siteId) {
		Map<String, Object> result = null;
		try { 
			result = locationService.generateLocationQRCode(locationId, siteId);
		} catch(Exception e) {
			throw new TimesheetException("Error while generating Location QR-Code" + e);
		}
		
		return result;
	}

    @RequestMapping(value = "/location/qrCode/{block}/{floor}/{zone}/{siteId}", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
    public String generateQRCode(@PathVariable("block") String block, @PathVariable("floor") String floor, @PathVariable("zone") String zone, @PathVariable("siteId") long siteId) {
        return locationService.generateQRCode(block,floor,zone, siteId);

    }

    @RequestMapping(value = "/location/import/{fileId}/status",method = RequestMethod.GET)
	public ImportResult importStatus(@PathVariable("fileId") String fileId) {
		log.debug("ImportStatus -  fileId -"+ fileId);
		ImportResult result = locationService.getImportStatus(fileId);
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
