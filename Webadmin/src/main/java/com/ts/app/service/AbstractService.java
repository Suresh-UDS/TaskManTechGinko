package com.ts.app.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.ts.app.config.Constants;
import com.ts.app.domain.Employee;
import com.ts.app.domain.Setting;
import com.ts.app.domain.Site;
import com.ts.app.domain.Ticket;
import com.ts.app.domain.User;
import com.ts.app.repository.SettingsRepository;
import com.ts.app.service.util.PagingUtil;

public abstract class AbstractService {
	
	private static final Logger logger = LoggerFactory.getLogger(AbstractService.class);
	
	private SettingsRepository settingsRepository;
	
	private MailService mailService;
	
	protected Pageable createPageRequest(int page) {
		if(page == 0) {
			page = 1;
		}
        return createPageRequest(page, PagingUtil.PAGE_SIZE); 
    }
	
	protected Pageable createPageRequest(int page, boolean isAll) {
		if(page == 0) {
			page = 1;
		}
		if(isAll) {
	        return createPageRequest(page, Integer.MAX_VALUE); 
		}else {
			return createPageRequest(page, PagingUtil.PAGE_SIZE);
		}
    }

	protected Pageable createPageRequest(int page, int pageSize) {
		if(page == 0) {
			page = 1;
		}
		Sort s = new Sort(Sort.Direction.DESC, "createdDate");
        return createPageSort(page, pageSize, s); 
    }
	
	public Pageable createPageSort(int page, int pageSize, Sort s) {
		if(page == 0) {
			page = 1;
		}
		page -= 1;
        return new PageRequest(page, pageSize, s); 
    }
	
    public List<Long> findAllSubordinates(Employee employee, List<Long> subEmpIds) {
        Set<Employee> subs = employee.getSubOrdinates();
        if(logger.isDebugEnabled()) {
        		logger.debug("List of subordinates -"+ subs);
        }
        if(subEmpIds == null){
            subEmpIds = new ArrayList<Long>();
        }
        subEmpIds.add(employee.getId());
        for(Employee sub : subs) {
            subEmpIds.add(sub.getId());
            Hibernate.initialize(sub.getSubOrdinates());
            if(CollectionUtils.isNotEmpty(sub.getSubOrdinates())){
                findAllSubordinates(sub, subEmpIds);
            }
        }
        return subEmpIds;
    }
    
    
	protected void sendTicketNotifications(Employee ticketOwner, Employee assignedTo, Employee currentUserEmp, Ticket ticket, Site site, boolean isNew, Map<String, String> env) {
		Hibernate.initialize(assignedTo.getUser());
		User assignedToUser = assignedTo.getUser();
		Hibernate.initialize(ticketOwner.getUser());
		User ticketOwnerUser = ticketOwner.getUser();
		
		String ticketUrl = env.get("url.ticket-view");
		ticketUrl +=  ticket.getId();
		Setting ticketReports = null;
		List<Setting> settings = settingsRepository.findSettingByKeyAndSiteIdOrProjectId(SettingsService.EMAIL_NOTIFICATION_TICKET, site.getId(), site.getProject().getId());
		if(CollectionUtils.isNotEmpty(settings)) {
			ticketReports = settings.get(0);
		}
		Setting ticketReportEmails = null;
		if(ticketReports != null && ticketReports.getSettingValue().equalsIgnoreCase("true")) {
			settings = settingsRepository.findSettingByKeyAndSiteIdOrProjectId(SettingsService.EMAIL_NOTIFICATION_TICKET_EMAILS, site.getId(), site.getProject().getId());
			if(CollectionUtils.isNotEmpty(settings)) {
				ticketReportEmails = settings.get(0);
			}
		}
	    String assignedToEmail = (assignedToUser != null ? (StringUtils.isNotEmpty(assignedToUser.getEmail()) ? assignedToUser.getEmail() : "") : "");
	    String ticketOwnerEmail = (ticketOwnerUser != null ? "," + (StringUtils.isNotEmpty(ticketOwnerUser.getEmail()) ? ticketOwnerUser.getEmail() : "") : "");
	    String ticketEmails = ticketReportEmails != null ? ticketReportEmails.getSettingValue() : "";
		assignedToEmail += Constants.COMMA_SEPARATOR + ticketEmails;
		ticketOwnerEmail += Constants.COMMA_SEPARATOR + ticketEmails;
	    if(StringUtils.isNotEmpty(ticket.getStatus()) && (ticket.getStatus().equalsIgnoreCase("Open") || ticket.getStatus().equalsIgnoreCase("Assigned"))) {
	    		if(isNew) {
		    		mailService.sendTicketCreatedMail(ticketUrl,assignedTo.getUser(),assignedToEmail,site.getName(),ticket.getId(), String.valueOf(ticket.getId()),
	        				assignedToUser.getFirstName(), assignedTo.getName(),ticket.getTitle(),ticket.getDescription(), ticket.getStatus(), ticket.getSeverity());
		    		mailService.sendTicketCreatedMail(ticketUrl,ticketOwner.getUser(),ticketOwnerEmail,site.getName(),ticket.getId(), String.valueOf(ticket.getId()),
	        				assignedToUser.getFirstName(), assignedTo.getName(),ticket.getTitle(),ticket.getDescription(), ticket.getStatus(), ticket.getSeverity());
	    		}else {
		    		mailService.sendTicketUpdatedMail(ticketUrl,assignedTo.getUser(),assignedToEmail,site.getName(),ticket.getId(), String.valueOf(ticket.getId()),
			        				assignedToUser.getFirstName(), assignedTo.getName(),ticket.getTitle(),ticket.getDescription(), ticket.getStatus());
		    		mailService.sendTicketUpdatedMail(ticketUrl,ticketOwner.getUser(),ticketOwnerEmail,site.getName(),ticket.getId(), String.valueOf(ticket.getId()),
	        				assignedToUser.getFirstName(), assignedTo.getName(),ticket.getTitle(),ticket.getDescription(), ticket.getStatus());
	    		}
    		}else if(StringUtils.isNotEmpty(ticket.getStatus()) && (ticket.getStatus().equalsIgnoreCase("Closed"))) {
    			if(assignedTo != null) {
			    mailService.sendTicketClosedMail(ticketUrl,assignedTo.getUser(),assignedToEmail,site.getName(),ticket.getId(), String.valueOf(ticket.getId()),
	        				assignedToUser.getFirstName(), assignedTo.getName(), currentUserEmp.getName(), currentUserEmp.getEmpId(), ticket.getTitle(),ticket.getDescription(), ticket.getStatus());
    			}
    			
		    mailService.sendTicketClosedMail(ticketUrl,ticketOwner.getUser(),ticketOwnerEmail,site.getName(),ticket.getId(), String.valueOf(ticket.getId()),
    				assignedToUser.getFirstName(), assignedTo.getName(), currentUserEmp.getName(), currentUserEmp.getEmpId(), ticket.getTitle(),ticket.getDescription(), ticket.getStatus());
    		}
	}

}
