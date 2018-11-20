package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.domain.UOMType;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.RateCardService;
import com.ts.app.web.rest.dto.QuotationDTO;
import com.ts.app.web.rest.dto.RateCardDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.errors.TimesheetException;
import org.json.JSONException;
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
import java.util.Arrays;
import java.util.List;

/**
 * REST controller for managing the RateCard information.
 */
@RestController
@RequestMapping("/api")
public class RateCardResource {

	private final Logger log = LoggerFactory.getLogger(RateCardResource.class);

	@Inject
	private RateCardService rateCardService;

	@Inject
	public RateCardResource(RateCardService rateCardService) {
		this.rateCardService = rateCardService;
	}

	/**
	 * POST /saveRateCard -> saveRateCard the RateCard.
	 */
	@RequestMapping(value = "/rateCard", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveRateCard(@Valid @RequestBody RateCardDTO rateCardDTO, HttpServletRequest request) {
		log.info("Inside the saveRateCard -" + rateCardDTO.getName());
		RateCardDTO rateCardDto = null;
		try {
			rateCardDto = rateCardService.createRateCardInformation(rateCardDTO);
		}catch (Exception e) {
			String msg = "Error while creating rate card, please check the information";
			//return new ResponseEntity<String>(msg , HttpStatus.NOT_ACCEPTABLE);
			throw new TimesheetException(e, rateCardDTO);

		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/rateCard", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateRateCard(@Valid @RequestBody RateCardDTO rateCard, HttpServletRequest request) {
		log.info("Inside Update" + rateCard.getName());
		rateCardService.updateRateCard(rateCard);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/rateCard/delete", method = RequestMethod.POST)
	public ResponseEntity<?> delete(@RequestBody RateCardDTO rateCard) {
		log.info("Inside Delete" + rateCard.getId());
		rateCardService.deleteRateCard(rateCard);

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/rateCard", method = RequestMethod.GET)
	public Object findAll() {
		log.info("--Invoked RateCardResource.findAll --");
		return rateCardService.findAll();
	}

	@RequestMapping(value = "/rateCard/{id}", method = RequestMethod.GET)
	public RateCardDTO get(@PathVariable Long id) {
		return rateCardService.findOne(id);
	}

	@RequestMapping(value = "/rateCard/search",method = RequestMethod.POST)
	public Object searchRateCards(@RequestBody SearchCriteria searchCriteria) {
		Object result = null;
		if(searchCriteria != null) {
			result =  rateCardService.findAll();
		}
		return result;
	}

	@RequestMapping(value = "/rateCard/types", method = RequestMethod.GET)
	public Object getRateCardTypes() {
		log.info("--Invoked RateCardResource.getRateCardTypes --");
		//List<RateType> rateTypes = Arrays.asList(RateType.values());
		//return rateTypes;
		Object result = null;
		result = rateCardService.findAllTypes();
		return result;
	}

	@RequestMapping(value = "/rateCard/uom", method = RequestMethod.GET)
    public List<UOMType> getUomTypes() {
        log.info("--Invoked RateCardResource.getUomTypes --");
        List<UOMType> uomTypes = Arrays.asList(UOMType.values());
        return uomTypes;
    }

    @RequestMapping(value = "/rateCard/quotation", method = RequestMethod.POST)
    public ResponseEntity<QuotationDTO> saveQuotation(@RequestBody QuotationDTO quotationDto) {
        log.info("--Invoked RateCardResource.Get Quotations --");
        long currentUserId = SecurityUtils.getCurrentUserId();
        QuotationDTO result = rateCardService.saveQuotation(quotationDto, currentUserId);
        return new ResponseEntity<QuotationDTO>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/quotation/image/upload", method = RequestMethod.POST)
    public ResponseEntity<?> upload(@RequestParam("quotationId") String quotationId, @RequestParam("quotationFile") MultipartFile file) throws JSONException {
    		QuotationDTO quotationDTO = new QuotationDTO();
    		quotationDTO.setQuotationFile(file);
        quotationDTO.setId(quotationId);
        log.debug("quotation resource with parameters"+quotationId);
        rateCardService.uploadFile(quotationDTO);
        return new ResponseEntity<String>("{ \"quotationFileName\" : \""+quotationDTO.getQuotationFileName() + "\", \"status\" : \"success\"}", HttpStatus.OK);
    }

    @RequestMapping(value = "/quotation/image/{id}/{imageId:.+}",method = RequestMethod.GET)
    public String findQuotationImage(@PathVariable("id") String quotationId, @PathVariable("imageId") String imageId) {
        return rateCardService.getQuotationImage(quotationId, imageId);
//        return ("{ \"image\":\" "+image+"\"",HttpStatus.OK);
    }

	@RequestMapping(value = "/rateCard/quotation/id/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getQuotation(@PathVariable("id") String id) {
        log.info("--Invoked RateCardResource.getQuotation --");
        Object result = rateCardService.getQuotation(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

	@RequestMapping(value = "/rateCard/quotation/serialId/{serialId}", method = RequestMethod.GET)
    public ResponseEntity<?> getQuotationBySerialId(@PathVariable("serialId") long serialId) {
        log.info("--Invoked RateCardResource.getQuotation --");
        Object result = rateCardService.getQuotation(serialId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @RequestMapping(value = "/rateCard/quotation/search", method = RequestMethod.POST)
    public Object getQuotations(@RequestBody SearchCriteria searchCriteria) {
        log.info("--Invoked RateCardResource.Get Quotations --" + searchCriteria);
        Object result =null;
        searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
        result= rateCardService.getQuotations(searchCriteria);
        return result;
    }

    @RequestMapping(value = "/rateCard/quotation/approve",method = RequestMethod.POST)
    public Object approveQuotation(@RequestBody QuotationDTO quotationDTO){
	    log.info("Approve Quotations");
	    Object result = null;
	    rateCardService.approveQuotation(quotationDTO);
	    return result;
    }

    @RequestMapping(value = "/rateCard/quotation/reject",method = RequestMethod.POST)
    public Object rejectQuotation(@RequestBody QuotationDTO quotationDTO){
	    log.info("Reject Quotations");
	    Object result = null;
	    rateCardService.rejectQuotation(quotationDTO);
	    return result;
    }

}
