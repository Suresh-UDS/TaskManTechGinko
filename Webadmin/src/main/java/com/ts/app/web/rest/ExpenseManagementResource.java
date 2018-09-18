package com.ts.app.web.rest;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.domain.Expense;
import com.ts.app.domain.ExpenseCategory;
import com.ts.app.service.ExpenseManagementService;
import com.ts.app.web.rest.dto.ExpenseDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.errors.TimesheetException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ExpenseManagementResource {

	private final Logger log = LoggerFactory.getLogger(ExpenseManagementResource.class);

    @Inject
    private ExpenseManagementService expenseManagementService;
//
    @RequestMapping(value = "/expense", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> saveExpense(@Valid @RequestBody ExpenseDTO expenseDTO, HttpServletRequest request) {
        log.info("Inside the save Expense -" + expenseDTO.getReceiptNumber());

        ExpenseDTO expense = null;
        try {
            expense  = expenseManagementService.saveExpense(expenseDTO);
        }catch (Exception e) {
            String msg = "Error while creating expense, please check the information";
            log.info("Error - "+e);
            throw new TimesheetException(e, expenseDTO);

        }

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/expenseCategories", method = RequestMethod.GET)
    public List<ExpenseCategory> findAllExpenseCategories() {
        return expenseManagementService.findAllExpenseCategories();
    }



    @RequestMapping(value = "/expenses", method = RequestMethod.POST)
    public List<ExpenseDTO> findAll(@RequestBody SearchCriteria searchCriteria) {
        log.info("--Invoked LocationResource.findAllLocation --");
        return expenseManagementService.findAll(searchCriteria.getCurrPage());
    }

    @RequestMapping(value = "/expenses/latest/{siteId}", method = RequestMethod.GET)
    public Expense findLatestRecordBySite(@PathVariable("siteId") long siteId) {
        log.info("--Invoked expense resource .findLatestRecordBySite -- "+siteId);
        return expenseManagementService.findLatestRecordBySite(siteId);
    }




}