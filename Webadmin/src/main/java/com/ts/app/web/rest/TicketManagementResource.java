package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Ticket;
import com.ts.app.domain.TicketStatus;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.PushService;
import com.ts.app.service.TicketManagementService;
import com.ts.app.service.UserService;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import java.util.Arrays;
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

    @RequestMapping(path="/ticket",method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> saveTicket(@Valid @RequestBody TicketDTO ticketDTO, HttpServletRequest request) {
    		ticketDTO.setUserId(SecurityUtils.getCurrentUserId());
        TicketDTO response = ticketService.saveTicket(ticketDTO);

        if(response!=null){

        }
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @RequestMapping(path="/ticket/update",method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> updateTicket(@Valid @RequestBody TicketDTO ticketDTO, HttpServletRequest request) {
    		ticketDTO.setUserId(SecurityUtils.getCurrentUserId());
        TicketDTO response = ticketService.updateTicket(ticketDTO);

        if(response!=null){

        }
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/tickets/search",method = RequestMethod.POST)
    public SearchResult<TicketDTO> searchTickets(@RequestBody SearchCriteria searchCriteria) {
        SearchResult<TicketDTO> result = null;
        if(searchCriteria != null) {
            searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
            result = ticketService.findBySearchCrieria(searchCriteria);
//            result = ticketService.listAllTickets();
        }
        return result;
    }

    @RequestMapping(path="/ticket/details/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public TicketDTO getTicket(@PathVariable("id") Long id){
        return ticketService.getTicketDetails(id);
    }
    
    @RequestMapping(path="/ticket/lookup/status", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<TicketStatus> getTicketStatuses(){
        TicketStatus[] statuses = TicketStatus.values();
        return Arrays.asList(statuses);
    }
    
    @RequestMapping(value = "/ticket/export",method = RequestMethod.POST)
    public ExportResponse exportJob(@RequestBody SearchCriteria searchCriteria) {
	    //log.debug("JOB EXPORT STARTS HERE **********");
        ExportResponse resp = new ExportResponse();
        if(searchCriteria != null) {
            searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
            SearchResult<TicketDTO> result = ticketService.findBySearchCrieria(searchCriteria);
            List<TicketDTO> results = result.getTransactions();
            resp.addResult(ticketService.generateReport(results, searchCriteria));

           // log.debug("RESPONSE FOR OBJECT resp *************"+resp);
        }
        return resp;
    }

    @RequestMapping(value = "/ticket/export/{fileId}/status",method = RequestMethod.GET)
	public ExportResult exportStatus(@PathVariable("fileId") String fileId) {
		//log.debug("ExportStatus -  fileId -"+ fileId);
		ExportResult result = ticketService.getExportStatus(fileId);

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
					result.setFile("/api/ticket/export/"+fileId);
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

	@RequestMapping(value = "/ticket/export/{fileId}",method = RequestMethod.GET)
	public byte[] getExportFile(@PathVariable("fileId") String fileId, HttpServletResponse response) {
		byte[] content = ticketService.getExportFile(fileId);
		response.setContentType("Application/x-msexcel");
		response.setContentLength(content.length);
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Content-Disposition","attachment; filename=\"" + fileId + ".xlsx\"");
		return content;
	}

}
