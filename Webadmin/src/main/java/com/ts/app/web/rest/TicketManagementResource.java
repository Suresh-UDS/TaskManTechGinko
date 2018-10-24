package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Ticket;
import com.ts.app.domain.TicketStatus;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.PushService;
import com.ts.app.service.SchedulerHelperService;
import com.ts.app.service.TicketManagementService;
import com.ts.app.service.UserService;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.*;

import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class TicketManagementResource {
	private final Logger log = LoggerFactory.getLogger(JobManagementResource.class);

	@Inject
	private PushService pushService;

	@Inject
	private UserService userService;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private TicketManagementService ticketService;
	
	@Inject
	private SchedulerHelperService schedulerHelperService;

	@RequestMapping(path = "/ticket", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveTicket(@Valid @RequestBody TicketDTO ticketDTO, HttpServletRequest request) {
		ticketDTO.setUserId(SecurityUtils.getCurrentUserId());
		TicketDTO response = ticketService.saveTicket(ticketDTO);

		if (response != null) {

		}
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@RequestMapping(path = "/ticket/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateTicket(@Valid @RequestBody TicketDTO ticketDTO, HttpServletRequest request) {
		ticketDTO.setUserId(SecurityUtils.getCurrentUserId());
		TicketDTO response = ticketService.updateTicket(ticketDTO);

		if (response != null) {

		}
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@RequestMapping(value = "/tickets/search", method = RequestMethod.POST)
	public SearchResult<TicketDTO> searchTickets(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<TicketDTO> result = null;
		if (searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = ticketService.findBySearchCrieria(searchCriteria);
			// result = ticketService.listAllTickets();
		}
		return result;
	}

	@RequestMapping(path = "/ticket/details/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public TicketDTO getTicket(@PathVariable("id") Long id) {
		return ticketService.getTicketDetails(id);
	}

	@RequestMapping(path = "/ticket/lookup/status", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<TicketStatus> getTicketStatuses() {
		TicketStatus[] statuses = TicketStatus.values();
		return Arrays.asList(statuses);
	}

	@RequestMapping(value = "/ticket/export", method = RequestMethod.POST)
	public ExportResponse exportJob(@RequestBody SearchCriteria searchCriteria) {
		log.debug("TICKET EXPORT STARTS HERE **********");
		ExportResponse resp = new ExportResponse();
		if (searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			SearchResult<TicketDTO> result = ticketService.findBySearchCrieria(searchCriteria);
			List<TicketDTO> results = result.getTransactions();
			resp.addResult(ticketService.generateReport(results, searchCriteria));

			// log.debug("RESPONSE FOR OBJECT resp *************"+resp);
		}
		return resp;
	}

	@RequestMapping(value = "/ticket/export/{fileId}/status", method = RequestMethod.GET)
	public ExportResult exportStatus(@PathVariable("fileId") String fileId) {
		// log.debug("ExportStatus - fileId -"+ fileId);
		ExportResult result = ticketService.getExportStatus(fileId);

		// log.debug("RESULT NOW **********"+result);
		// log.debug("RESULT GET STATUS **********"+result.getStatus());

		if (result != null && result.getStatus() != null) {
			switch (result.getStatus()) {
			case "PROCESSING":
				result.setMsg("Exporting...");
				break;
			case "COMPLETED":
				result.setMsg("Download");
				// log.debug("DOWNLOAD FILE PROCESSING HERE ************"+result.getMsg());
				// log.debug("FILE ID IN API CALLING ************"+fileId);
				result.setFile("/api/ticket/export/" + fileId);
				// log.debug("DOWNLOADED FILE IS ************"+result.getFile());
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

	@RequestMapping(value = "/ticket/export/{fileId}", method = RequestMethod.GET)
	public byte[] getExportFile(@PathVariable("fileId") String fileId, HttpServletResponse response) {
		byte[] content = ticketService.getExportFile(fileId);
		response.setContentType("Application/x-msexcel");
		response.setContentLength(content.length);
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Content-Disposition", "attachment; filename=\"" + fileId + ".xlsx\"");
		return content;
	}

	@RequestMapping(value = "/ticket/{assetId}/view", method = RequestMethod.GET)
	public List<TicketDTO> getAssetTickets(@PathVariable("assetId") long assetId) {
		log.info("Get ticket by assetId" + assetId);
		List<TicketDTO> result = null;
		result = ticketService.getAllAssetTickets(assetId);
		log.info("Tickets result - " + result);
		return result;
	}

	@RequestMapping(value = "/ticket/image/upload", method = RequestMethod.POST)
	public ResponseEntity<?> upload(@RequestParam("ticketId") long ticketId,
			@RequestParam("ticketFile") MultipartFile file) throws JSONException {
		TicketDTO ticketDTO = new TicketDTO();
		ticketDTO.setImageFile(file);
		ticketDTO.setId(ticketId);
		log.debug("ticket resource with parameters" + ticketId);
		ticketService.uploadFile(ticketDTO);
		return new ResponseEntity<String>(
				"{ \"ticketFileName\" : \"" + ticketDTO.getImage() + "\", \"status\" : \"success\"}", HttpStatus.OK);
	}

	@RequestMapping(value = "/ticket/image/{id}/{imageId}", method = RequestMethod.GET)
	public String findQuotationImage(@PathVariable("id") long ticketId, @PathVariable("imageId") String imageId) {
		return ticketService.getTicketImage(ticketId, imageId);
	}
	
	@RequestMapping(value = "/ticket/uploadExistingFile", method = RequestMethod.POST)
	public String uploadExistingTicketImages() {
		log.debug("Upload existing ticket image S3");
		return ticketService.uploadExistingTicketImg();
	}
	
	@RequestMapping(value = "/checkDailyReports", method = RequestMethod.GET)
	public String checkdailyReport(@RequestParam(value = "date", required = false) @DateTimeFormat(pattern="dd-MM-yyyy") Date date, @RequestParam("onDemand") boolean onDemand) {
		log.debug("check daily report called...");
		schedulerHelperService.sendDaywiseReportEmail(date, onDemand);
		return "successfully send reports!";
	}
	
	

}
