package com.ts.app.web.rest;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import com.ts.app.web.rest.dto.ChecklistDTO;
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
import com.ts.app.service.FeedbackTransactionService;
import com.ts.app.web.rest.dto.FeedbackTransactionDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FeedbackResource {

    private final Logger log = LoggerFactory.getLogger(ChecklistResource.class);

    @Inject
    private FeedbackTransactionService feedbackTransactionService;

    @Inject
    public FeedbackResource(FeedbackTransactionService feedbackTransactionService) {
        this.feedbackTransactionService = feedbackTransactionService;
    }

    @RequestMapping(value = "/feedback", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> saveFeedback(@Valid @RequestBody FeedbackTransactionDTO feedbackTransactionDTO, HttpServletRequest request) {
        log.info("Inside the save feedback -" + feedbackTransactionDTO.getName());
        FeedbackTransactionDTO createdFeedback = null;
        try {
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

}
