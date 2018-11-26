package com.ts.app.web.rest;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import com.ts.app.domain.Branch;
import com.ts.app.domain.Region;
import com.ts.app.web.rest.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
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
import com.ts.app.service.SiteService;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.web.rest.errors.TimesheetException;
import com.ts.app.web.rest.util.TokenUtils;

/**
 * REST controller for managing the Site information.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class SiteResource {

	private final Logger log = LoggerFactory.getLogger(SiteResource.class);

	@Inject
	private SiteService siteService;

	@Inject
	private ImportUtil importUtil;

	@Inject
	public SiteResource(SiteService siteService) {
		this.siteService = siteService;
	}

	/**
	 * POST /saveSite -> saveSite the Site.
	 */
	@RequestMapping(value = "/site", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveSite(@Valid @RequestBody SiteDTO siteDTO, HttpServletRequest request) {
		log.info("Inside the saveSite -" + siteDTO.getName() + ", projectId -" + siteDTO.getProjectId());
		try  {
			siteDTO.setUserId(SecurityUtils.getCurrentUserId());
			siteDTO = siteService.createSiteInformation(siteDTO);
		}catch (Exception cve) {
			throw new TimesheetException(cve, siteDTO);
		}

		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/site", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateSite(@Valid @RequestBody SiteDTO site, HttpServletRequest request) {
		log.info("Inside Update" + site.getName() + " , "+ site.getProjectId());
		try {
			siteService.updateSite(site);
		}catch (Exception cve) {
			throw new TimesheetException(cve);
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/site/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		log.info("Inside Delete" + id);
		siteService.deleteSite(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/site", method = RequestMethod.GET)
	public List<SiteDTO> findAll(HttpServletRequest request) {
		log.info("--Invoked SiteResource.findAll --");
		String token = request.getHeader("X-Auth-Token");
		EmployeeDTO empDto = TokenUtils.getObject(token);
		long userId = 0;
		if(empDto != null) {
			userId = empDto.getUserId();
		}
		if(userId == 0) {
			userId = SecurityUtils.getCurrentUserId();
		}
		return siteService.findAll(userId);
	}

	@RequestMapping(value = "/site/{id}", method = RequestMethod.GET)
	public SiteDTO get(@PathVariable Long id) {
		return siteService.findOne(id);
		// .map((entity) -> new ResponseEntity<>(entity, HttpStatus.OK))
		// .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@RequestMapping(value = "/site/{id}/shifts/{date}", method = RequestMethod.GET)
	public List<ShiftDTO> getShifts(@PathVariable("id") long id, @PathVariable("date") @DateTimeFormat(pattern="yyyy-MM-dd") Date date) {
		return siteService.findShifts(id, date);
	}

	@RequestMapping(value = "/site/search",method = RequestMethod.POST)
	public SearchResult<SiteDTO> searchSites(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<SiteDTO> result = null;
		if(searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = siteService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}

    @RequestMapping(value = "/site/searchList",method = RequestMethod.POST)
    public List<SiteDTO> searchSiteList(@RequestBody SearchCriteria searchCriteria) {
        List<SiteDTO> result = null;
        if(searchCriteria != null) {
            searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
            result = siteService.searchSiteList(searchCriteria);
        }
        return result;
    }

    @RequestMapping(value = "/site/employee/{employeeId}", method = RequestMethod.GET)
    public List<SiteDTO> findByEmployeeId(@PathVariable Long employeeId) {
        log.info("--Invoked EmployeeResource.findAll --");
        return siteService.findByEmployeeId(employeeId);
    }



    @RequestMapping(value = "/import/site", method = RequestMethod.POST)
    public ResponseEntity<ImportResult> importJobData(@RequestParam("siteFile") MultipartFile file){
    	log.info("--Invoked Site Import --");
		Calendar cal = Calendar.getInstance();
		ImportResult result = importUtil.importSiteData(file, cal.getTimeInMillis());
		return new ResponseEntity<ImportResult>(result,HttpStatus.OK);
	}

	@RequestMapping(value = "/proximityCheck", method = RequestMethod.POST)
    public ResponseEntity<String> checksiteProximity(@RequestBody SearchCriteria siteDetails){
        log.debug("check site proximity - "+siteDetails.getSiteId());
        log.debug("check site proximity - "+siteDetails.getLat());
        log.debug("check site proximity - "+siteDetails.getLng());
        String result = siteService.checkProximity(siteDetails.getSiteId(),siteDetails.getLat(),siteDetails.getLng());
        if(result.equalsIgnoreCase("failure")) {
        		return new ResponseEntity<String>(result,HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<String>(result,HttpStatus.OK);
    }

    @RequestMapping(value = "/region",method = RequestMethod.POST)
    public ResponseEntity<?> saveRegion(@RequestBody RegionDTO region){
        long userId = SecurityUtils.getCurrentUserId();
        try {
            RegionDTO regionDTO= siteService.createRegion(region);
        }catch(Exception e) {
            throw new TimesheetException(e, region);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);

    }

    @RequestMapping(value = "/branch",method = RequestMethod.POST)
    public ResponseEntity<?> saveBranch(@RequestBody BranchDTO branchDTO){
        long userId = SecurityUtils.getCurrentUserId();
        try {
            BranchDTO branchDTO1= siteService.createBranch(branchDTO);
        }catch(Exception e) {
            throw new TimesheetException(e, branchDTO);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);

    }

    @RequestMapping(value = "/branch", method = RequestMethod.GET)
    public List<BranchDTO> findAllBranches() {
        log.info("--Invoked site service.find all branches--");
        return siteService.findAllBranches();
    }

    @RequestMapping(value = "/region", method = RequestMethod.GET)
    public List<RegionDTO> findAllRegions() {
        log.info("--Invoked site service.find all Regions--");
        return siteService.findAllRegions();
    }

    @RequestMapping(value = "/region/projectId/{projectId}", method = RequestMethod.GET)
    public List<RegionDTO> findRegionsByProject(@PathVariable("projectId") long projectId){
        return siteService.findRegionByProject(projectId);
    }

    @RequestMapping(value = "/branch/projectId/{projectId}/region/{regionId}", method = RequestMethod.GET)
    public List<BranchDTO> findBranchByProject(@PathVariable("projectId") long projectId, @PathVariable("regionId") long regionId){
        return siteService.findBranchByProject(projectId,regionId);
    }

    @RequestMapping(value = "/project/region/{region}/projectId/{projectId}", method = RequestMethod.POST)
    public List<SiteDTO> findSitesByRegion( @PathVariable("region") String region, @PathVariable("projectId") long projectId){
        log.debug("find by project id and region - "+projectId+" - "+region);
        return siteService.findSitesByRegion(projectId,region);
    }

    @RequestMapping(value = "/project/branch/{branch}/region/{region}/projectId/{projectId}", method = RequestMethod.GET)
    public List<SiteDTO> findSitesByRegionAndBranch(@PathVariable("branch") String branch, @PathVariable("region") String region,  @PathVariable("projectId") long projectId){
        return siteService.findSitesByRegionAndBranch(projectId,region,branch);
    }

    @RequestMapping(value = "/site/import/{fileId}/status",method = RequestMethod.GET)
	public ImportResult importStatus(@PathVariable("fileId") String fileId) {
		log.debug("ImportStatus -  fileId -"+ fileId);
		ImportResult result = siteService.getImportStatus(fileId);
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


    @RequestMapping(value = "/change/site/employee", method = RequestMethod.POST)
    public ResponseEntity<ImportResult> changeSiteEmployee(@RequestParam("siteFile") MultipartFile file){
        log.info("--Invoked Change Site Import --");
        Calendar cal = Calendar.getInstance();
        ImportResult result = importUtil.changeEmployeeSite(file, cal.getTimeInMillis());
        return new ResponseEntity<ImportResult>(result,HttpStatus.OK);
    }

}
