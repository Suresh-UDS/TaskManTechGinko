package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Ticket;
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
import javax.validation.Valid;
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

        TicketDTO response = ticketService.saveTicket(ticketDTO);

        if(response!=null){

        }
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @RequestMapping(path="/ticket/update",method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> updateTicket(@Valid @RequestBody TicketDTO ticketDTO, HttpServletRequest request) {

        TicketDTO response = ticketService.updateTicket(ticketDTO);

        if(response!=null){

        }
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/tickets/search",method = RequestMethod.POST)
    public List<Ticket> searchTickets(@RequestBody SearchCriteria searchCriteria) {
        List<Ticket> result = null;
        if(searchCriteria != null) {
            searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
            //jobService.updateJobStatus(searchCriteria.getSiteId(), searchCriteria.getJobStatus());
//            result = ticketService.findBySearchCrieria(searchCriteria);
            result = ticketService.listAllTickets();
        }
        return result;
    }

    @RequestMapping(path="/ticket/details/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public TicketDTO getTicket(@PathVariable("id") Long id){
        return ticketService.getTicketDetails(id);
    }

}
