package com.ts.app.web.rest;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.domain.Expense;
import com.ts.app.domain.ExpenseCategory;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.ExpenseManagementService;
import com.ts.app.web.rest.dto.ExpenseDTO;
import com.ts.app.web.rest.dto.ExpenseDocumentDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ExpenseManagementResource {

	private final Logger log = LoggerFactory.getLogger(ExpenseManagementResource.class);

    @Inject
    private ExpenseManagementService expenseManagementService;

    @Inject
    private Environment env;
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

        return new ResponseEntity<>(expense,HttpStatus.CREATED);
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

    @RequestMapping(value = "/expenses/search",method = RequestMethod.POST)
    public SearchResult<ExpenseDTO> searchExpenses(@RequestBody SearchCriteria searchCriteria){
        SearchResult<ExpenseDTO> result = null;
        if (searchCriteria != null) {
            searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
            result = expenseManagementService.findBySearchCrieria(searchCriteria);
        }
        return result;
    }

    @RequestMapping(value = "/expenses/latest/{siteId}", method = RequestMethod.GET)
    public Expense findLatestRecordBySite(@PathVariable("siteId") long siteId) {
        log.info("--Invoked expense resource .findLatestRecordBySite -- "+siteId);
        return expenseManagementService.findLatestRecordBySite(siteId);
    }

    @RequestMapping(value = { "/expenses/uploadFile" }, method = RequestMethod.POST)
    public ResponseEntity<?> uploadAssetFile(@RequestParam("title") String title, @RequestParam("expenseId") long expenseId,
                                             @RequestParam("uploadFile") MultipartFile file, @RequestParam("type") String type,
                                             ExpenseDocumentDTO expenseDocumentDTO) {
        expenseDocumentDTO.setExpenseId(expenseId);
        expenseDocumentDTO.setTitle(title);
        expenseDocumentDTO.setType(type);
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        log.debug("********** file extension : "+ extension);
        String ext = env.getProperty("extensionFile");
        log.debug("********** validation extension : "+ ext);
        String[] arrExt = ext.split(",");
        for (String exten : arrExt) {
            if (extension.equalsIgnoreCase(exten)) {
                expenseDocumentDTO = expenseManagementService.uploadFile(expenseDocumentDTO, file);
                expenseDocumentDTO.setExtension(extension);
            }
        }
        return new ResponseEntity<>(expenseDocumentDTO, HttpStatus.OK);
    }




}
