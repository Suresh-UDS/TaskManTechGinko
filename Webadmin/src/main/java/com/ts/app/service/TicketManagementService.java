package com.ts.app.service;

import com.ts.app.domain.*;
import com.ts.app.repository.*;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

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
    private Environment env;

    public TicketDTO saveTicket(TicketDTO ticketDTO){
        Ticket ticket = mapperUtil.toEntity(ticketDTO,Ticket.class);

        Site site = siteRepository.findOne(ticketDTO.getSiteId());
        ticket.setSite(site);

        Employee employee = employeeRepository.findOne(ticketDTO.getEmployeeId());
        ticket.setEmployee(employee);
        ticket.setStatus("Open");

//        ticket.setJob(null);

//        log.debug("Job id in ticket service"+ticket.getJob());

        ticket = ticketRepository.save(ticket);

        ticketDTO = mapperUtil.toModel(ticket, TicketDTO.class);

        Employee employee1 = employeeRepository.findOne(ticketDTO.getEmployeeId());

//        mailService.sendTicketCreatedMail();

        return ticketDTO;

    }

    public TicketDTO updateTicket(TicketDTO ticketDTO){
        Ticket ticket = ticketRepository.findOne(ticketDTO.getId());
        Site site = siteRepository.findOne(ticket.getSite().getId());
        if(site!=null){
            ticket.setSite(site);
        }

        Employee employee = employeeRepository.findOne(ticket.getEmployee().getId());
        if(employee!=null){
            ticket.setEmployee(employee);
        }

//        Job job = jobRepository.findOne(ticketDTO.getJobId());
//        if(job!=null){
//            ticket.setJob(job);
//        }


        ticket.setStatus(ticketDTO.getStatus());

        ticket = ticketRepository.saveAndFlush(ticket);

        ticketDTO = mapperUtil.toModel(ticket, TicketDTO.class);

        return ticketDTO;
    }

    public List<TicketDTO> listAllTickets(){
        List<TicketDTO> ticketDTOList = new ArrayList<TicketDTO>();
        List<Ticket> tickets = null;
        tickets = ticketRepository.findAll();
        for(Ticket ticket : tickets) {
			ticketDTOList.add(mapperUtil.toModel(ticket,TicketDTO.class));
		}

        return ticketDTOList;
    }

    public TicketDTO getTicketDetails(long id){
        Ticket ticket = ticketRepository.findOne(id);
        TicketDTO ticketDTO1 = mapperUtil.toModel(ticket,TicketDTO.class);
        Job job = jobRepository.findByTicketId(id);
        log.debug("JOb details in ticket"+job.getId());
        log.debug("Job detail in ticket"+job.getTitle());
        ticketDTO1.setJobId(job.getId());
        ticketDTO1.setJobName(job.getTitle());

        return ticketDTO1;
    }

    public List<Ticket> findBySearchCrieria(SearchCriteria searchCriteria) {
        User user = userRepository.findOne(searchCriteria.getUserId());
        SearchResult<TicketDTO> result = new SearchResult<TicketDTO>();
        List<Ticket> tickets = null;
        if(searchCriteria != null) {
            Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());

            Page<Ticket> page = null;
            List<TicketDTO> transactions = null;

            Calendar startCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
            if (searchCriteria.getFromDate() != null) {
                startCal.setTime(searchCriteria.getFromDate());
            }
            startCal.set(Calendar.HOUR_OF_DAY, 0);
            startCal.set(Calendar.MINUTE, 0);
            startCal.set(Calendar.SECOND, 0);
            Calendar endCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
            if (searchCriteria.getToDate() != null) {
                endCal.setTime(searchCriteria.getToDate());
            }
            endCal.set(Calendar.HOUR_OF_DAY, 23);
            endCal.set(Calendar.MINUTE, 59);
            endCal.set(Calendar.SECOND, 0);
            //searchCriteria.setFromDate(startCal.getTime());
            //searchCriteria.setToDate(endCal.getTime());

            java.sql.Date startDate = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(startCal));
            java.sql.Date toDate = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(endCal));

              tickets = ticketRepository.findByUserId(searchCriteria.getUserId());



        }
        return tickets;
    }
}
