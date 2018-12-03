package com.ts.app.web.rest;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import com.amazonaws.services.elasticmapreduce.model.Ec2InstanceAttributes;
import com.ts.app.domain.TicketStatusReport;
import com.ts.app.service.*;
import org.json.JSONException;
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
import com.ts.app.config.ReportDatabaseConfiguration;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.TicketStatus;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ExportResponse;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.TicketDTO;

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
	
	@Inject 
	private ReportDatabaseService reportDatabaseService;

	@RequestMapping(path = "/ticket", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveTicket(@Valid @RequestBody TicketDTO ticketDTO, HttpServletRequest request) {
		ticketDTO.setUserId(SecurityUtils.getCurrentUserId());
		TicketDTO response = ticketService.saveTicket(ticketDTO);

		if (response != null) {
		    try {
                TicketStatusReport ticketStatusReport = new TicketStatusReport();
                ticketStatusReport.setAssignedOn(response.getAssignedOn());
                ticketStatusReport.setBranch(response.getBranch());
                ticketStatusReport.setCategory(response.getCategory());
                ticketStatusReport.setClosedOn(response.getClosedOn());
                ticketStatusReport.setCreatedDate(response.getCreatedDate());
                ticketStatusReport.setProjectId(response.getProjectId());
                ticketStatusReport.setSiteId(response.getSiteId());
                ticketStatusReport.setRegion(response.getRegion());
                ticketStatusReport.setStatus(response.getStatus());
                ticketStatusReport.setStatusCount(1);
                reportDatabaseService.addNewTicketPoints(ticketStatusReport);
            } catch (Exception e) {
		        e.printStackTrace();
            }
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
	public String checkdailyReport(@RequestParam(value = "date", required = false) @DateTimeFormat(pattern="dd-MM-yyyy") Date date, @RequestParam("onDemand") boolean onDemand, @RequestParam(value="siteId", required=false) long siteId) {
		log.debug("check daily report called...");
		schedulerHelperService.sendDaywiseReportEmail(date, onDemand, siteId);
		return "successfully send reports!";
	}
	
	

}
