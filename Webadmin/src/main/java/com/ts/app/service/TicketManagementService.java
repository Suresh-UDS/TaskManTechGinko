package com.ts.app.service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Employee;
import com.ts.app.domain.Job;
import com.ts.app.domain.Setting;
import com.ts.app.domain.Site;
import com.ts.app.domain.Ticket;
import com.ts.app.domain.User;
import com.ts.app.domain.UserRole;
import com.ts.app.domain.UserRoleEnum;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.LocationRepository;
import com.ts.app.repository.NotificationRepository;
import com.ts.app.repository.SettingsRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.TicketRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.ReportUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.TicketDTO;

@Service
@Transactional
public class TicketManagementService extends AbstractService {

    private final Logger log = LoggerFactory.getLogger(JobManagementService.class);

    @Inject
    private TicketRepository ticketRepository;

    @Inject
    private EmployeeRepository employeeRepository;

    @Inject
    private LocationRepository locationRepository;

    @Inject
    private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

    @Inject
    private SiteRepository siteRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private JobRepository jobRepository;

    @Inject
    private NotificationRepository notificationRepository;

    @Inject
    private SchedulerService schedulerService;

    @Inject
    private MailService mailService;

    @Inject
    private ReportService reportService;
    
    @Inject
    private SettingsRepository settingsRepository;

    @Inject
    private Environment env;

    @Inject
    private ReportUtil reportUtil;
    
	@Inject
	private ExportUtil exportUtil;
    
    public TicketDTO saveTicket(TicketDTO ticketDTO){
    		User user = userRepository.findOne(ticketDTO.getUserId());
        Ticket ticket = mapperUtil.toEntity(ticketDTO,Ticket.class);

        Site site = siteRepository.findOne(ticketDTO.getSiteId());
        ticket.setSite(site);
        
        ticket.setEmployee(user.getEmployee());
        Employee employee = null;
        if(ticketDTO.getEmployeeId() > 0) {
	        employee = employeeRepository.findOne(ticketDTO.getEmployeeId());
	        if(employee != null) {
		        ticket.setAssignedTo(employee);
		        Calendar assignedCal = Calendar.getInstance();
		        ticket.setAssignedOn(new java.sql.Date(assignedCal.getTimeInMillis()));
	        }
        }else {
        		ticket.setAssignedTo(null);
        }
        ticket.setClosedBy(null);
        /*if(employee != null) {
        		ticket.setStatus("Assigned");
        }else {
        */
        		ticket.setStatus("Open");
        //}
        ticket.setClosedBy(null);

//        ticket.setJob(null);

//        log.debug("Job id in ticket service"+ticket.getJob());

        ticket = ticketRepository.save(ticket);

        ticketDTO = mapperUtil.toModel(ticket, TicketDTO.class);

        if(employee != null) {
        		sendNotifications(employee, ticket, site, true);
        }

        return ticketDTO;

    }

    public TicketDTO updateTicket(TicketDTO ticketDTO){
    		User user = userRepository.findOne(ticketDTO.getUserId());
        Ticket ticket = ticketRepository.findOne(ticketDTO.getId());
        Site site = siteRepository.findOne(ticket.getSite().getId());
        if(site!=null){
            ticket.setSite(site);
        }
        Calendar currCal = Calendar.getInstance();
        Employee employee = null;
        if(ticket.getEmployee().getId() != ticketDTO.getEmployeeId()) {
	        employee = employeeRepository.findOne(ticketDTO.getEmployeeId());
	        ticket.setStatus("Assigned");
	        ticket.setAssignedTo(employee);
	        ticket.setAssignedOn(new java.sql.Date(currCal.getTimeInMillis()));
        } else {
        		employee = employeeRepository.findOne(ticket.getEmployee().getId());
        }
        //ticket.setStatus(ticketDTO.getStatus());
        ticket.setTitle(ticketDTO.getTitle());
        ticket.setDescription(ticketDTO.getDescription());
        ticket.setSeverity(ticketDTO.getSeverity());
        ticket.setComments(ticketDTO.getComments());
        ticket.setCategory(ticketDTO.getCategory());
        if(StringUtils.isNotEmpty(ticket.getStatus()) && (ticket.getStatus().equalsIgnoreCase("Closed"))) {
        		ticket.setClosedBy(user.getEmployee());
        		ticket.setClosedOn(new java.sql.Date(currCal.getTimeInMillis()));
        }

        ticket = ticketRepository.saveAndFlush(ticket);

        ticketDTO = mapperUtil.toModel(ticket, TicketDTO.class);
        if(employee != null) {
        		sendNotifications(employee, ticket, site, false);
        }
        
        return ticketDTO;
    }
    
    public List<TicketDTO> listAllTickets(){
        List<TicketDTO> ticketDTOList = new ArrayList<TicketDTO>();
        List<Ticket> tickets = null;
        tickets = ticketRepository.findAll();
        for(Ticket ticket : tickets) {
        		log.debug("ticket status in list all-- "+ticket.getStatus());
			ticketDTOList.add(mapperUtil.toModel(ticket,TicketDTO.class));
		}

        return ticketDTOList;
    }

    public TicketDTO getTicketDetails(long id){
        Ticket ticket = ticketRepository.findOne(id);
        TicketDTO ticketDTO1 = mapperUtil.toModel(ticket,TicketDTO.class);
        Job job = jobRepository.findByTicketId(id);
        if(job!=null) {
        		ticketDTO1.setJobId(job.getId());
            ticketDTO1.setJobName(job.getTitle());	
        }
        

        return ticketDTO1;
    }

    public SearchResult<TicketDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
        User user = userRepository.findOne(searchCriteria.getUserId());
        SearchResult<TicketDTO> result = new SearchResult<TicketDTO>();
        if(searchCriteria != null) {
            Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());

            Page<Ticket> page = null;
            List<TicketDTO> transactions = null;

            Calendar startCal = Calendar.getInstance();
            if (searchCriteria.getFromDate() != null) {
                startCal.setTime(searchCriteria.getFromDate());
            }
            startCal.set(Calendar.HOUR_OF_DAY, 0);
            startCal.set(Calendar.MINUTE, 0);
            startCal.set(Calendar.SECOND, 0);
            Calendar endCal = Calendar.getInstance();
            if (searchCriteria.getToDate() != null) {
                endCal.setTime(searchCriteria.getToDate());
            }
            endCal.set(Calendar.HOUR_OF_DAY, 23);
            endCal.set(Calendar.MINUTE, 59);
            endCal.set(Calendar.SECOND, 0);
            //searchCriteria.setFromDate(startCal.getTime());
            //searchCriteria.setToDate(endCal.getTime());
            ZonedDateTime startDate = ZonedDateTime.ofInstant(startCal.toInstant(), ZoneId.systemDefault());
            ZonedDateTime endDate = ZonedDateTime.ofInstant(endCal.toInstant(), ZoneId.systemDefault());
            
            if(user != null) {
	        		Hibernate.initialize(user.getUserRole());
	        		UserRole userRole = user.getUserRole();
	        		if(userRole != null) {
	        			if(userRole.getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue())){
	        				if(searchCriteria.isFindAll()) {
	        					page = ticketRepository.findAll(startDate, endDate, pageRequest);
	        				}else if(searchCriteria.getSiteId() > 0) {
	        					if(StringUtils.isNotEmpty(searchCriteria.getTicketStatus())) {
	        						page = ticketRepository.findBySiteIdAndStatus(searchCriteria.getSiteId(), searchCriteria.getTicketStatus(), startDate, endDate, pageRequest);
	        					}else {
	        						page = ticketRepository.findBySiteId(searchCriteria.getSiteId(), startDate, endDate, pageRequest);
	        					}
	        				}else if(searchCriteria.getProjectId() > 0) {
	        					if(StringUtils.isNotEmpty(searchCriteria.getTicketStatus())) {
	        						page = ticketRepository.findByProjectIdAndStatus(searchCriteria.getProjectId(), searchCriteria.getTicketStatus(), startDate, endDate, pageRequest);
	        					}else {
	        						page = ticketRepository.findByProjectId(searchCriteria.getProjectId(), startDate, endDate, pageRequest);
	        					}
	        				}else {
	        					if(StringUtils.isNotEmpty(searchCriteria.getTicketStatus())) {
	        						page = ticketRepository.findByStatus(searchCriteria.getTicketStatus(), startDate, endDate, pageRequest);
	        					}else {
	        						page = ticketRepository.findByDateRange(startDate, endDate, pageRequest);
	        					}
	        				}
	        			}
	        		}
            }
            if(page == null && user != null) {
            		Employee employee = user.getEmployee();
                List<Long> subEmpIds = new ArrayList<Long>();
                if(employee != null) {
                    Hibernate.initialize(employee.getSubOrdinates());
                    findAllSubordinates(employee, subEmpIds);
                    log.debug("List of subordinate ids -"+ subEmpIds);
                    searchCriteria.setSubordinateIds(subEmpIds);
                }
                if(searchCriteria.getSiteId() > 0) {
                		if(StringUtils.isNotEmpty(searchCriteria.getTicketStatus())) {
                			page = ticketRepository.findBySiteIdStatusAndEmpId(searchCriteria.getSiteId(), searchCriteria.getTicketStatus(),searchCriteria.getSubordinateIds(), startDate, endDate,pageRequest);
                		}else {
                			page = ticketRepository.findBySiteIdUserIdAndEmpId(searchCriteria.getSiteId(), searchCriteria.getSubordinateIds(), startDate, endDate,pageRequest);
                		}
                }else if (searchCriteria.getProjectId() > 0) {
	            		if(StringUtils.isNotEmpty(searchCriteria.getTicketStatus())) {
	            			page = ticketRepository.findByProjectIdStatusAndEmpId(searchCriteria.getProjectId(), searchCriteria.getTicketStatus(),searchCriteria.getSubordinateIds(), startDate, endDate,pageRequest);
	            		}else {
	            			page = ticketRepository.findByProjectIdAndEmpId(searchCriteria.getProjectId(), searchCriteria.getSubordinateIds(), startDate, endDate,pageRequest);
	            		}
                }else {
	            		if(StringUtils.isNotEmpty(searchCriteria.getTicketStatus())) {
	            			page = ticketRepository.findByStatusAndEmpId(searchCriteria.getTicketStatus(),searchCriteria.getSubordinateIds(), startDate, endDate,pageRequest);
	            		}else {
	            			page = ticketRepository.findByEmpId(searchCriteria.getSubordinateIds(), startDate, endDate,pageRequest);
	            		}
                	
                }
            }
            transactions = mapperUtil.toModelList(page.getContent(), TicketDTO.class);
            buildSearchResult(searchCriteria, page, transactions, result);
            
        }
        return result;
    }
    
	private void buildSearchResult(SearchCriteria searchCriteria, Page<Ticket> page, List<TicketDTO> transactions, SearchResult<TicketDTO> result) {
		if(page != null) {
			result.setTotalPages(page.getTotalPages());
		}
		result.setCurrPage(page.getNumber() + 1);
		result.setTotalCount(page.getTotalElements());
        result.setStartInd((result.getCurrPage() - 1) * 10 + 1);
        result.setEndInd((result.getTotalCount() > 10  ? (result.getCurrPage()) * 10 : result.getTotalCount()));

		result.setTransactions(transactions);
		return;
	}
	
	private void sendNotifications(Employee employee, Ticket ticket, Site site, boolean isNew) {
		Hibernate.initialize(employee.getUser());
		User user = employee.getUser();
		Setting ticketReports = settingsRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_TICKET, site.getId());
		if(ticketReports == null) {
			ticketReports = settingsRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_TICKET, site.getProject().getId());
		}
		Setting ticketReportEmails = null;
		if(ticketReports != null && ticketReports.getSettingValue().equalsIgnoreCase("true")) {
			ticketReportEmails = settingsRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_TICKET_EMAILS, site.getId());
		    if(ticketReportEmails == null) {
		    		ticketReportEmails = settingsRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_TICKET_EMAILS, site.getProject().getId());
		    }
		}        
	    String ticketEmails = (user != null ? user.getEmail() : "");
	    ticketEmails += ticketReportEmails != null ? ticketReportEmails.getSettingValue() : "";
	    if(StringUtils.isNotEmpty(ticket.getStatus()) && (ticket.getStatus().equalsIgnoreCase("Open") || ticket.getStatus().equalsIgnoreCase("Assigned"))) { 
	    		if(isNew) {
		    		mailService.sendTicketCreatedMail(employee.getUser(),ticketEmails,site.getName(),ticket.getId(), String.valueOf(ticket.getId()),
	        				user.getFirstName(), employee.getName(),ticket.getTitle(),ticket.getDescription(), ticket.getStatus(), ticket.getSeverity());
	    		}else {
		    		mailService.sendTicketUpdatedMail(employee.getUser(),ticketEmails,site.getName(),ticket.getId(), String.valueOf(ticket.getId()),
			        				user.getFirstName(), employee.getName(),ticket.getTitle(),ticket.getDescription(), ticket.getStatus());
	    		}
    		}else if(StringUtils.isNotEmpty(ticket.getStatus()) && (ticket.getStatus().equalsIgnoreCase("Closed"))) {    			
		    mailService.sendTicketClosedMail(ticket.getEmployee().getUser(),ticketEmails,site.getName(),ticket.getId(), String.valueOf(ticket.getId()),
        				user.getFirstName(), employee.getName(),ticket.getTitle(),ticket.getDescription(), ticket.getStatus());
    		}
	}
	
	public ExportResult generateReport(List<TicketDTO> transactions, SearchCriteria criteria) {
        //return exportUtil.writeJobReportToFile(transactions, null, null);
        //log.debug("REPORT GENERATION PROCESSING HERE ***********");
        //log.debug("CRIITERIA *******"+criteria+"TRANSACTION *********"+transactions);

        return reportUtil.generateTicketReports(transactions, null, null, criteria);
    }


	public ExportResult getExportStatus(String fileId) {
		ExportResult er = new ExportResult();

		fileId += ".xlsx";
        //log.debug("FILE ID INSIDE OF getExportStatus CALL ***********"+fileId);

		if(!StringUtils.isEmpty(fileId)) {
			String status = exportUtil.getExportStatus(fileId);
			er.setFile(fileId);
			er.setStatus(status);
		}
		return er;
	}

	public byte[] getExportFile(String fileName) {
		//return exportUtil.readExportFile(fileName);
		return exportUtil.readJobExportFile(fileName);
	}
}
