package com.ts.app.web.rest;

import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.FeedbackService;
import com.ts.app.service.FeedbackTransactionService;
import com.ts.app.web.rest.dto.ExportResponse;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.FeedbackDTO;
import com.ts.app.web.rest.dto.FeedbackMappingDTO;
import com.ts.app.web.rest.dto.FeedbackReportResult;
import com.ts.app.web.rest.dto.FeedbackTransactionDTO;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;

@RestController
@RequestMapping("/api")
public class FeedbackResource {

    private final Logger log = LoggerFactory.getLogger(FeedbackResource.class);

    @Inject
    private FeedbackService feedbackService;
    
    @Inject
    private FeedbackTransactionService feedbackTransactionService;

    @Inject
    public FeedbackResource(FeedbackTransactionService feedbackTransactionService) {
        this.feedbackTransactionService = feedbackTransactionService;
    }

    @RequestMapping(value = "/feedbackquestions", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> saveFeedbackQuestions(@Valid @RequestBody FeedbackDTO feedbackDTO, HttpServletRequest request) {
        log.info("Inside the save feedback -" + feedbackDTO.getName());
        FeedbackDTO createdFeedback = null;
        try {
            createdFeedback  = feedbackService.saveFeebdackQuestions(feedbackDTO);
        }catch (Exception e) {
            String msg = "Error while creating feedback, please check the information";
            throw new TimesheetException(e, feedbackDTO);

        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    
    @RequestMapping(value = "/feedbackquestions", method = RequestMethod.GET)
    public List<FeedbackDTO> findAllFeedbackQuestions(@RequestBody SearchCriteria searchCriteria) {
        log.info("--Invoked FeedbackResource.findAllFeedbackQuestions --");
        return feedbackService.findAll(searchCriteria.getCurrPage());
    }

    @RequestMapping(value = "/feedbackquestions/{id}", method = RequestMethod.GET)
    public FeedbackDTO getFeedbackQuestions(@PathVariable Long id) {
        return feedbackService.findOne(id);
    }    
    
    @RequestMapping(value = "/feedbackquestions/search",method = RequestMethod.POST)
    public SearchResult<FeedbackDTO> searchFeedbackQuestions(@RequestBody SearchCriteria searchCriteria) {
        SearchResult<FeedbackDTO> result = null;
        if(searchCriteria != null) {
        		searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
            result = feedbackService.findBySearchCrieria(searchCriteria);
        }
        return result;
    }   
    
    @RequestMapping(value = "/feedbackmapping", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> saveFeedbackMapping(@Valid @RequestBody FeedbackMappingDTO feedbackMappingDTO, HttpServletRequest request) {
        log.info("Inside the save feedback -" + feedbackMappingDTO.getId());
        FeedbackMappingDTO createdFeedback = null;
        try {
            createdFeedback  = feedbackService.saveFeebdackMapping(feedbackMappingDTO);
        }catch (Exception e) {
            String msg = "Error while creating feedback mapping , please check the information";
            throw new TimesheetException(e, feedbackMappingDTO);

        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    
    @RequestMapping(value = "/feedbackmapping", method = RequestMethod.GET)
    public List<FeedbackMappingDTO> findAllFeedbackMapping(@RequestBody SearchCriteria searchCriteria) {
        log.info("--Invoked FeedbackResource.findAllFeedbackMapping --");
        return feedbackService.findAllMapping(searchCriteria.getCurrPage());
    }

    @RequestMapping(value = "/feedbackmapping/{id}", method = RequestMethod.GET)
    public FeedbackMappingDTO getFeedbackMapping(@PathVariable Long id) {
        return feedbackService.findOneMapping(id);
    }    
    
    @RequestMapping(value = "/feedbackmapping/search",method = RequestMethod.POST)
    public SearchResult<FeedbackMappingDTO> searchFeedbackMapping(@RequestBody SearchCriteria searchCriteria) {
        SearchResult<FeedbackMappingDTO> result = null;
        if(searchCriteria != null) {
        		searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
            result = feedbackService.findMappingBySearchCrieria(searchCriteria);
        }
        return result;
    }   
    
    
    @RequestMapping(value = "/feedback", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> saveFeedback(@Valid @RequestBody FeedbackTransactionDTO feedbackTransactionDTO, HttpServletRequest request) {
        log.info("Inside the save feedback -" + feedbackTransactionDTO.getName());
        FeedbackTransactionDTO createdFeedback = null;
        try {
        		feedbackTransactionDTO.setUserId(SecurityUtils.getCurrentUserId());
            createdFeedback  = feedbackTransactionService.saveFeebdackInformation(feedbackTransactionDTO);
        }catch (Exception e) {
            String msg = "Error while creating feedback, please check the information";
            throw new TimesheetException(e, feedbackTransactionDTO);

        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/feedback", method = RequestMethod.GET)
    public List<FeedbackTransactionDTO> findAll(@RequestBody SearchCriteria searchCriteria) {
        log.info("--Invoked FeedbackResource.findAll --");
        return feedbackTransactionService.findAll(searchCriteria.getCurrPage());
    }

    @RequestMapping(value = "/feedback/{id}", method = RequestMethod.GET)
    public FeedbackTransactionDTO get(@PathVariable Long id) {
        return feedbackTransactionService.findOne(id);
    }

    @RequestMapping(value = "/feedback/search",method = RequestMethod.POST)
    public SearchResult<FeedbackTransactionDTO> searchFeedback(@RequestBody SearchCriteria searchCriteria) {
        SearchResult<FeedbackTransactionDTO> result = null;
        if(searchCriteria != null) {
            result = feedbackTransactionService.findBySearchCrieria(searchCriteria);
        }
        return result;
    }
    
    @RequestMapping(value = "/feedback/reports",method = RequestMethod.POST)
    public FeedbackReportResult generateReport(@RequestBody SearchCriteria searchCriteria) {
        FeedbackReportResult result = null;
        if(searchCriteria != null) {
            result = feedbackTransactionService.generateReport(searchCriteria);
        }
        return result;
    }
    
    @RequestMapping(value = "/feedbackquestions/{id}/image/{imageId}",method = RequestMethod.GET)
    public String findCheckInOutByEmployee(@PathVariable("id") long feedbackQuestionsId,@PathVariable("imageId") String imageId) {
        return feedbackService.getFeedbackQuestionImage(feedbackQuestionsId, imageId);
    }

    @RequestMapping(value = "/feedback/export",method = RequestMethod.POST)
    public ExportResponse exportFeedback(@RequestBody SearchCriteria searchCriteria) {
	    log.debug("Feebdack EXPORT STARTS HERE **********"+searchCriteria.isReport());
        ExportResponse resp = new ExportResponse();
        if(searchCriteria != null) {
            searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
            searchCriteria.setReport(true);
            SearchResult<FeedbackTransactionDTO> result = feedbackTransactionService.findBySearchCrieria(searchCriteria);
            List<FeedbackTransactionDTO> results = result.getTransactions();
            resp.addResult(feedbackTransactionService.generateReport(results, searchCriteria));

           // log.debug("RESPONSE FOR OBJECT resp *************"+resp);
        }
        return resp;
    }

    @RequestMapping(value = "/feedback/export/{fileId}/status",method = RequestMethod.GET)
	public ExportResult exportStatus(@PathVariable("fileId") String fileId) {
		//log.debug("ExportStatus -  fileId -"+ fileId);
		ExportResult result = feedbackTransactionService.getExportStatus(fileId);

		//log.debug("RESULT NOW **********"+result);
		//log.debug("RESULT GET STATUS **********"+result.getStatus());

		if(result!=null && result.getStatus() != null) {
			switch(result.getStatus()) {
				case "PROCESSING" :
					result.setMsg("Exporting...");
					break;
				case "COMPLETED" :
					result.setMsg("Download");
					//log.debug("DOWNLOAD FILE PROCESSING HERE ************"+result.getMsg());
					//log.debug("FILE ID IN API CALLING ************"+fileId);
					result.setFile("/api/feedback/export/"+fileId);
					//log.debug("DOWNLOADED FILE IS ************"+result.getFile());
					break;
				case "FAILED" :
					result.setMsg("Failed to export. Please try again");
					break;
				default :
					result.setMsg("Failed to export. Please try again");
					break;
			}
		}
		return result;
	}

	@RequestMapping(value = "/feedback/export/{fileId}",method = RequestMethod.GET)
	public byte[] getExportFile(@PathVariable("fileId") String fileId, HttpServletResponse response) {
		byte[] content = feedbackTransactionService.getExportFile(fileId);
		response.setContentType("Application/x-msexcel");
		response.setContentLength(content.length);
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Content-Disposition","attachment; filename=\"" + fileId + ".xlsx\"");
		return content;
	}
}
