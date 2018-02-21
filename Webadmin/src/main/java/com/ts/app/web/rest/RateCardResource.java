package com.ts.app.web.rest;

import java.util.Arrays;
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
import com.ts.app.domain.RateType;
import com.ts.app.domain.UOMType;
import com.ts.app.service.RateCardService;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.RateCardDTO;
import com.ts.app.web.rest.errors.TimesheetException;

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
	public List<RateType> getRateCardTypes() {
		log.info("--Invoked RateCardResource.getRateCardTypes --");
		List<RateType> rateTypes = Arrays.asList(RateType.values());
		return rateTypes;
	}

	@RequestMapping(value = "/rateCard/uom", method = RequestMethod.GET)
    public List<UOMType> getUomTypes() {
        log.info("--Invoked RateCardResource.getUomTypes --");
        List<UOMType> uomTypes = Arrays.asList(UOMType.values());
        return uomTypes;
    }

    @RequestMapping(value = "/rateCard/quotation/get", method = RequestMethod.GET)
    public Object getQuotations() {
        log.info("--Invoked RateCardResource.Get Quotations --");
        Object result =null;
        result= rateCardService.getQuotations();
        return result;
    }

    @RequestMapping(value = "/rateCard/quotation/approve",method = RequestMethod.POST)
    public Object approveQuotation(@RequestBody RateCardDTO rateCardDTO){
	    log.info("Approve Quotations");
	    Object result = null;
	    rateCardService.approveQuotation(rateCardDTO);
	    return result;
    }

}
