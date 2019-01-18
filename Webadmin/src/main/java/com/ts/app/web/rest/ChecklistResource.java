package com.ts.app.web.rest;

import java.util.Calendar;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.service.ChecklistService;
import com.ts.app.service.ImportService;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.web.rest.dto.ChecklistDTO;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;

/**
 * REST controller for managing the Checklist information.
 */
@RestController
@RequestMapping("/api")
public class ChecklistResource {

	private final Logger log = LoggerFactory.getLogger(ChecklistResource.class);

	@Inject
	private ChecklistService checklistService;
	
	@Inject
	private ImportService importService;

	@Inject
	public ChecklistResource(ChecklistService checklistService) {
		this.checklistService = checklistService;
	}

	/**
	 * POST /saveChecklist -> saveChecklist the Checklist.
	 */
	@RequestMapping(value = "/checklist", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed 
	public ResponseEntity<?> saveChecklist(@Valid @RequestBody ChecklistDTO checklistDTO, HttpServletRequest request) {
		log.info("Inside the saveChecklist -" + checklistDTO.getName());
		ChecklistDTO createdChecklist = null;
		try {
			createdChecklist = checklistService.createChecklistInformation(checklistDTO);
		}catch (Exception e) {
			String msg = "Error while creating checklist, please check the information";
			throw new TimesheetException(e, checklistDTO);

		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/checklist", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateChecklist(@Valid @RequestBody ChecklistDTO checklist, HttpServletRequest request) {
		log.info("Inside Update" + checklist.getName());
		checklistService.updateChecklist(checklist);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/checklist/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		log.info("Inside Delete" + id);
		checklistService.deleteChecklist(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/checklist", method = RequestMethod.GET)
	public List<ChecklistDTO> findAll() {
		log.info("--Invoked ChecklistResource.findAll --");
		return checklistService.findAll();
	}

	@RequestMapping(value = "/checklist/{id}", method = RequestMethod.GET)
	public ChecklistDTO get(@PathVariable Long id) {
		return checklistService.findOne(id);
	}
	
	@RequestMapping(value = "/checklist/search",method = RequestMethod.POST)
	public SearchResult<ChecklistDTO> searchChecklists(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<ChecklistDTO> result = null;
		if(searchCriteria != null) {
			result = checklistService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}
	
	  @RequestMapping(path="/checklist/import", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
		public ResponseEntity<ImportResult> importJobData(@RequestParam("checklistFile") MultipartFile file){
			Calendar cal = Calendar.getInstance();
			ImportResult result = importService.importChecklistData(file, cal.getTimeInMillis());
	        if(StringUtils.isNotEmpty(result.getStatus()) && result.getStatus().equalsIgnoreCase("FAILED")) {
		    		return new ResponseEntity<ImportResult>(result,HttpStatus.BAD_REQUEST);
		    }
			return new ResponseEntity<ImportResult>(result,HttpStatus.OK);
		}
	  
	  @RequestMapping(value = "/checklist/import/{fileId}/status",method = RequestMethod.GET)
		public ImportResult importStatus(@PathVariable("fileId") String fileId) {
			log.debug("ImportStatus -  fileId -"+ fileId);
			ImportResult result = checklistService.getImportStatus(fileId);
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
