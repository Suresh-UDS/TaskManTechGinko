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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.domain.PurchaseRequestStatus;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.PurchaseRequisitionService;
import com.ts.app.web.rest.dto.AssetDTO;
import com.ts.app.web.rest.dto.ExportResponse;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.PurchaseReqDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class PurchaseRequisitionResource {


	private final Logger log = LoggerFactory.getLogger(PurchaseRequisitionResource.class);
	
	@Inject
	private PurchaseRequisitionService purchaseReqService;
	
	@RequestMapping(value="/save/purchaseRequest", method=RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> savePurchaseReq(@Valid @RequestBody PurchaseReqDTO purchaseReqDTO, HttpServletRequest request) {
		log.debug("purchaseReq object: {}", purchaseReqDTO);
		try {
			purchaseReqDTO = purchaseReqService.createPurchaseRequest(purchaseReqDTO);
		}catch(Exception e) { 
			throw new TimesheetException("Error while create Purchase Requisition" + e);
		}
		return new ResponseEntity<>(purchaseReqDTO, HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/purchaseRequest/{id}", method=RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
	public PurchaseReqDTO getPurchase(@PathVariable("id") long id) { 
		return purchaseReqService.getPurchaseReq(id);
	}
	
	@RequestMapping(value = "/purchaseRequest/sites", method=RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public List<PurchaseReqDTO> getPurchaseRequest(@Valid @RequestBody PurchaseReqDTO purchaseReqDTO, HttpServletRequest request) { 
		List<PurchaseReqDTO> result = null;
		try {
			result = purchaseReqService.getRequestBySite(purchaseReqDTO);
		} catch(Exception e) {
			throw new TimesheetException("Error while get purchase request based on Site " +e);
		}
		return result;
	}
	
	@RequestMapping(value="/purchaseRequest/findAll", method=RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
	public List<PurchaseReqDTO> getAllRequests() { 
		List<PurchaseReqDTO> result = null;
		try {
			result = purchaseReqService.findAll();
		}catch(Exception e){
			throw new TimesheetException("Error while get a List of purchase requests " + e);
		}
		return result;
	}
	
	@RequestMapping(value="/update/purchaseRequest", method=RequestMethod.PUT, produces=MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updatePurchaseReq(@Valid @RequestBody PurchaseReqDTO purchaseReqDTO, HttpServletRequest request) {
		log.debug("Update object: {}" + purchaseReqDTO);
		try {
			purchaseReqDTO.setApprovedById(SecurityUtils.getCurrentUserId());
			purchaseReqService.updatePurchaseRequest(purchaseReqDTO);
		} catch(Exception e) { 
			throw new TimesheetException("Error while updating purchase Request" +e);
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value="/delete/purchaseRequest/{id}", method=RequestMethod.DELETE)
	public ResponseEntity<?> deleteMaterial(@PathVariable("id") long id) { 
		purchaseReqService.deletePurchaseReq(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value="/purchaseRequest/materialTransaction", method=RequestMethod.POST)
	public ResponseEntity<?> createTransaction(@Valid @RequestBody PurchaseReqDTO purchaseReqDTO, HttpServletRequest request) {
		PurchaseReqDTO result = null;
		try {
			result = purchaseReqService.createMaterialTransaction(purchaseReqDTO);
		}catch(Exception e) { 
			throw new TimesheetException("Error while create transaction for Purchase Request" +e);
		}
		return new ResponseEntity<>(result, HttpStatus.CREATED);
	}
		
	@RequestMapping(value = "/purchaseRequest/search", method = RequestMethod.POST)
	public SearchResult<PurchaseReqDTO> searchRequests(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<PurchaseReqDTO> result = null;
		if (searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = purchaseReqService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}
	
	@RequestMapping(value = "/purchaseRequest/export", method = RequestMethod.POST)
	public ExportResponse exportPurchaseRequest(@RequestBody SearchCriteria searchCriteria) {
		// log.debug("JOB EXPORT STARTS HERE **********");
		ExportResponse resp = new ExportResponse();
		if (searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			SearchResult<PurchaseReqDTO> result = purchaseReqService.findBySearchCrieria(searchCriteria);
			List<PurchaseReqDTO> results = result.getTransactions();
			resp.addResult(purchaseReqService.generateReport(results, searchCriteria));

			// log.debug("RESPONSE FOR OBJECT resp *************"+resp);
		}
		return resp;
	}
	
	@RequestMapping(value = "/purchaseRequest/export/{fileId}/status", method = RequestMethod.GET)
	public ExportResult exportStatus(@PathVariable("fileId") String fileId) {
		// log.debug("ExportStatus - fileId -"+ fileId);
		ExportResult result = purchaseReqService.getExportStatus(fileId);

		// log.debug("RESULT NOW **********"+result);
		// log.debug("RESULT GET STATUS **********"+result.getStatus());

		if (result != null && result.getStatus() != null) {
			switch (result.getStatus()) {
			case "PROCESSING":
				result.setMsg("Exporting...");
				break;
			case "COMPLETED":
				result.setMsg("Download");
				result.setFile("/api/purchaseRequest/export/" + fileId);
				break;
			case "FAILED":
				result.setMsg("Failed to export. Please try again");
				break;
			default:
				result.setMsg("Failed to export. Please try again");
				break;
			}
		}
		return result;
	}

	@RequestMapping(value = "/purchaseRequest/export/{fileId}", method = RequestMethod.GET)
	public byte[] getExportFile(@PathVariable("fileId") String fileId, HttpServletResponse response) {
		byte[] content = purchaseReqService.getExportFile(fileId);
		response.setContentType("Application/x-msexcel");
		response.setContentLength(content.length);
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Content-Disposition", "attachment; filename=\"" + fileId + ".xlsx\"");
		return content;
	}
	
	@RequestMapping(value = "/purchaseRequest/status", method = RequestMethod.GET)
	public ResponseEntity<PurchaseRequestStatus[]> getRequestStatus() {
		PurchaseRequestStatus[] status = purchaseReqService.getRequestStatus();
		return new ResponseEntity<>(status, HttpStatus.OK);
	}
	
	

}
