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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.service.LocationService;
import com.ts.app.web.rest.dto.LocationDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;

@RestController
@RequestMapping("/api")
public class LocationResource {

    private final Logger log = LoggerFactory.getLogger(LocationResource.class);

    @Inject
    private LocationService locationService;
    
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
            result = locationService.findBySearchCrieria(searchCriteria);
        }
        return result;
    }   
    
   

}
