package com.ts.app.service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import javax.inject.Inject;

import com.ts.app.repository.*;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Hibernate;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.api.client.repackaged.org.apache.commons.codec.binary.Base64;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.ts.app.config.Constants;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Asset;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.Job;
import com.ts.app.domain.Project;
import com.ts.app.domain.Setting;
import com.ts.app.domain.Site;
import com.ts.app.domain.Ticket;
import com.ts.app.domain.TicketStatus;
import com.ts.app.domain.User;
import com.ts.app.domain.UserRole;
import com.ts.app.domain.UserRoleEnum;
import com.ts.app.domain.UserRolePermission;
import com.ts.app.service.util.AmazonS3Utils;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.FileUploadHelper;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.PagingUtil;
import com.ts.app.service.util.ReportUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.TicketDTO;

@Service
@Transactional
public class TicketManagementService extends AbstractService {

    private final Logger log = LoggerFactory.getLogger(TicketManagementService.class);

    @Inject
    private TicketRepository ticketRepository;

    @Inject
    private EmployeeRepository employeeRepository;

    @Inject
    private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

    @Inject
    private ProjectRepository projectRepository;

    @Inject
    private SiteRepository siteRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private JobRepository jobRepository;

    @Inject
    private MailService mailService;

    @Inject
    private SettingsRepository settingsRepository;

    @Inject
    private Environment env;

    @Inject
    private ReportUtil reportUtil;

	@Inject
	private ExportUtil exportUtil;

	@Inject
	private FileUploadHelper fileUploadHelper;

	@Inject
	private AmazonS3Utils amazonS3utils;

	@Inject
	private AssetRepository assetRepository;

	@Value("${AWS.s3-cloudfront-url}")
	private String cloudFrontUrl;

	@Value("${AWS.s3-bucketEnv}")
	private String bucketEnv;

	@Value("${AWS.s3-ticket-path}")
	private String ticketFilePath;

	@Inject
	private RateCardService rateCardService;

    public TicketDTO saveTicket(TicketDTO ticketDTO){
    		User user = userRepository.findOne(ticketDTO.getUserId());
        Ticket ticket = mapperUtil.toEntity(ticketDTO,Ticket.class);

        Site site = siteRepository.findOne(ticketDTO.getSiteId());
        ticket.setSite(site);

        if(ticketDTO.getAssetId() > 0) {
        	Asset asset = assetRepository.findOne(ticketDTO.getAssetId());
            ticket.setAsset(asset);
        }else {
        	 ticket.setAsset(null);
        }

        Employee ticketOwner = user.getEmployee();
        ticket.setEmployee(ticketOwner);
        Employee assignedTo = null;
        if(ticketDTO.getEmployeeId() > 0) {
	        assignedTo = employeeRepository.findOne(ticketDTO.getEmployeeId());
	        if(assignedTo != null) {
		        ticket.setAssignedTo(assignedTo);
		        Calendar assignedCal = Calendar.getInstance();
		        ticket.setAssignedOn(new java.sql.Date(assignedCal.getTimeInMillis()));
	        }
        }else {
        		ticket.setAssignedTo(null);
        }
        ticket.setJob(null);
        ticket.setClosedBy(null);
        /*if(employee != null) {
        		ticket.setStatus("Assigned");
        }else {
        */
        		ticket.setStatus("Open");
        //}
        ticket.setClosedBy(null);
        ticket.setEscalationStatus(0);

//        ticket.setJob(null);

//        log.debug("Job id in ticket service"+ticket.getJob());

        ticket = ticketRepository.save(ticket);

        ticketDTO = mapperUtil.toModel(ticket, TicketDTO.class);

        if(assignedTo == null) {
        		assignedTo = user.getEmployee();
        }

        if(assignedTo != null) {
        		sendNotifications(ticketOwner, assignedTo, ticketOwner, ticket, site, true);
        }

        return ticketDTO;

    }

    public void updateTicketPendingStatus(TicketDTO ticketDTO){

        Ticket ticket = ticketRepository.findOne(ticketDTO.getId());
        if(ticketDTO.isPendingAtUDS()){
            ticket.setPendingAtUDS(true);
            ticket.setPendingAtClient(false);
        }else if(ticketDTO.isPendingAtClient()){
            ticket.setPendingAtClient(true);
            ticket.setPendingAtUDS(false);
        }else{
            ticket.setPendingAtUDS(false);
            ticket.setPendingAtClient(false);
        }
        ticketRepository.saveAndFlush(ticket);

    }


    public TicketDTO updateTicket(TicketDTO ticketDTO){
    		User user = userRepository.findOne(ticketDTO.getUserId());
        Ticket ticket = ticketRepository.findOne(ticketDTO.getId());
        //validations
        //check if job or quotation exists
        String message = null;
        boolean isValid = false;
        if(StringUtils.isNotEmpty(ticket.getQuotationId())) {
        		Object quotationResp = rateCardService.getQuotation(ticket.getQuotationId());
        		if(quotationResp != null) {
        			String quotation = (String)quotationResp;
        			if(StringUtils.isNotEmpty(quotation)) {
	        			JsonParser jsonp = new JsonParser();
	        			JsonElement jsonEle = jsonp.parse(quotation);
	        			JsonObject jsonObj = jsonEle.getAsJsonObject();
	        			JsonElement approvedEle = jsonObj.get("isApproved");
	        			if(approvedEle != null) {
	        				if(!approvedEle.getAsBoolean()) {
	        					message = "Ticket has an associated quotation which is still pending for approval";
	        					JsonElement rejectedEle = jsonObj.get("isRejected");
	        					if(rejectedEle != null && rejectedEle.getAsBoolean()) {
	        						isValid = true;
	        					}
	        				}else {
	        					isValid = true;
	        				}
	        			}
        			}else {
        				isValid = true;
        			}
        		}else {
        			isValid = true;
        		}
        }else {
        		isValid = true;
        }

        if(isValid) {
	        Site site = siteRepository.findOne(ticket.getSite().getId());
	        if(site!=null){
	            ticket.setSite(site);
	        }
	        if(ticketDTO.getAssetId() > 0) {
	        	Asset asset = assetRepository.findOne(ticketDTO.getAssetId());
	        	ticket.setAsset(asset);
	        }else {
	       	 ticket.setAsset(null);
	        }
	        Calendar currCal = Calendar.getInstance();
	        Employee ticketOwner = employeeRepository.findOne(ticket.getEmployee().getId());
	        Employee assignedTo = null;
	        if(ticketDTO.getEmployeeId()!=0) {
	            if (ticket.getEmployee() != null && (ticket.getEmployee().getId() != ticketDTO.getEmployeeId())) {
	                assignedTo = employeeRepository.findOne(ticketDTO.getEmployeeId());
	                ticket.setStatus("Assigned");
	                ticket.setAssignedTo(assignedTo);
	                ticket.setAssignedOn(new java.sql.Date(currCal.getTimeInMillis()));
	            }else {
	            		if(ticket.getEmployee() != null) {
	            			assignedTo = ticket.getEmployee();
	            		}else {
	    	                assignedTo = employeeRepository.findOne(ticketDTO.getEmployeeId());
	    	                ticket.setStatus("Assigned");
	    	                ticket.setAssignedTo(assignedTo);
	    	                ticket.setAssignedOn(new java.sql.Date(currCal.getTimeInMillis()));
	            		}
	            }
	        }else {
	        		assignedTo = ticket.getAssignedTo();
	        }
	        ticket.setStatus(ticketDTO.getStatus());
	        if (StringUtils.isNotEmpty(ticketDTO.getTitle())) {
	            ticket.setTitle(ticketDTO.getTitle());
	        }else{
	            ticket.setTitle(ticket.getTitle());
	        }
	        if (StringUtils.isNotEmpty(ticketDTO.getDescription())) {
	            ticket.setDescription(ticketDTO.getDescription());
	        }else{
	            ticket.setDescription(ticket.getDescription());
	        }
	        if(StringUtils.isNotEmpty(ticketDTO.getSeverity())){

	            ticket.setSeverity(ticketDTO.getSeverity());
            }else{
	            ticket.setSeverity(ticket.getSeverity());
            }
            if(StringUtils.isNotEmpty(ticketDTO.getCategory())){
	            ticket.setComments(ticketDTO.getCategory());
            }else{
                ticket.setComments(ticket.getCategory());
            }

	        ticket.setComments(ticketDTO.getComments());
	        if(StringUtils.isNotEmpty(ticket.getStatus()) && (ticket.getStatus().equalsIgnoreCase("Closed"))) {
	        		ticket.setClosedBy(user.getEmployee());
	        		ticket.setClosedOn(new java.sql.Date(currCal.getTimeInMillis()));
	        }

	        if(StringUtils.isNotEmpty(ticketDTO.getStatus()) && (ticketDTO.getStatus().equalsIgnoreCase("Reopen"))) {
	        		ticket.setStatus(TicketStatus.OPEN.toValue());
	        }

	        if(ticketDTO.isPendingAtUDS()){
	            ticket.setPendingAtUDS(ticketDTO.isPendingAtUDS());
	        }

	        if(ticketDTO.isPendingAtClient()){
	            ticket.setPendingAtClient(ticketDTO.isPendingAtClient());
	        }

	        ticket = ticketRepository.saveAndFlush(ticket);

	        ticketDTO = mapperUtil.toModel(ticket, TicketDTO.class);
	        //if(assignedTo != null) {
	        		sendNotifications(ticketOwner, assignedTo, user.getEmployee(), ticket, site, false);
	        //}
        }else {
        		ticketDTO.setErrorMessage(message);
        		ticketDTO.setErrorStatus(true);
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
        Project proj = ticket.getSite().getProject();
        TicketDTO ticketDTO1 = mapperUtil.toModel(ticket,TicketDTO.class);
        ticketDTO1.setProjectId(proj.getId());
        ticketDTO1.setProjectName(proj.getName());
        Job job = jobRepository.findByTicketId(id);
        if(job!=null) {
        		ticketDTO1.setJobId(job.getId());
            ticketDTO1.setJobName(job.getTitle());
        }


        return ticketDTO1;
    }

    public SearchResult<TicketDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
    		if(log.isDebugEnabled()) {
    			log.debug("Search Criteria - " + searchCriteria);
    		}
        User user = userRepository.findOne(searchCriteria.getUserId());
        SearchResult<TicketDTO> result = new SearchResult<TicketDTO>();
        if(searchCriteria != null) {
            //-----
            Pageable pageRequest = null;
            if(!StringUtils.isEmpty(searchCriteria.getColumnName())){
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" +sort);
                if(searchCriteria.isReport()) {
                		pageRequest = createPageSort(searchCriteria.getCurrPage(), Integer.MAX_VALUE, sort);
                }else {
                		pageRequest = createPageSort(searchCriteria.getCurrPage(), PagingUtil.PAGE_SIZE, sort);
                }

            }else{
            		if(searchCriteria.isReport()) {
            			pageRequest = createPageRequest(searchCriteria.getCurrPage(), true);
            		}else {
            			pageRequest = createPageRequest(searchCriteria.getCurrPage());
            		}
            }



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
	        				}else {
	        				    page = ticketRepository.findAll(new TicketSpecification(searchCriteria,true),pageRequest);
                            }

//	        				    if(searchCriteria.getSiteId() > 0) {
//	        					if(StringUtils.isNotEmpty(searchCriteria.getTicketStatus())) {
//	        						page = ticketRepository.findBySiteIdAndStatus(searchCriteria.getSiteId(), searchCriteria.getTicketStatus(), startDate, endDate, pageRequest);
//	        					}else {
//	        						page = ticketRepository.findBySiteId(searchCriteria.getSiteId(), startDate, endDate, pageRequest);
//	        					}
//	        				}else if(searchCriteria.getProjectId() > 0) {
//	        					if(StringUtils.isNotEmpty(searchCriteria.getTicketStatus())) {
//	        						page = ticketRepository.findByProjectIdAndStatus(searchCriteria.getProjectId(), searchCriteria.getTicketStatus(), startDate, endDate, pageRequest);
//	        					}else {
//	        						page = ticketRepository.findByProjectId(searchCriteria.getProjectId(), startDate, endDate, pageRequest);
//	        					}
//	        				}else if(searchCriteria.getAssetId() > 0) {
//	        					if(StringUtils.isNotEmpty(searchCriteria.getTicketStatus())) {
//	        						page = ticketRepository.findByAssetIdAndStatus(searchCriteria.getAssetId(), searchCriteria.getTicketStatus(), startDate, endDate, pageRequest);
//	        					}else {
//	        						page = ticketRepository.findByAssetId(searchCriteria.getAssetId(), startDate, endDate, pageRequest);
//	        					}
//	        				}else {
//	        					if(StringUtils.isNotEmpty(searchCriteria.getTicketStatus())) {
//	        						page = ticketRepository.findByStatus(searchCriteria.getTicketStatus(), startDate, endDate, pageRequest);
//	        					}else {
//	        						page = ticketRepository.findByDateRange(startDate, endDate, pageRequest);
//	        					}
//	        				}
	        			}else{
                            page = ticketRepository.findAll(new TicketSpecification(searchCriteria,false),pageRequest);

                            log.debug("Total records - "+page.getTotalElements());

                        }
	        		}
            }
            if(page == null && user != null) {
            		boolean hasViewAll = false;
	        		Hibernate.initialize(user.getUserRole());
	        		UserRole userRole = user.getUserRole();
	        		if(userRole != null) {
	        			Set<UserRolePermission> permissions = userRole.getRolePermissions();
	        			if(CollectionUtils.isNotEmpty(permissions)) {
	        				for(UserRolePermission perm : permissions) {
	        					if(perm.getModule().getName().equalsIgnoreCase("Tickets")
	        						&& perm.getAction().getName().equalsIgnoreCase("ViewAll")) {
	        						hasViewAll = true;
	        						break;
	        					}
	        				}
	        			}
	        		}

            		Employee employee = user.getEmployee();
            		List<EmployeeProjectSite> sites = employee.getProjectSites();
            		List<Long> siteIds = new ArrayList<Long>();
            		if(hasViewAll) {
	            		for(EmployeeProjectSite site : sites) {
	            			siteIds.add(site.getSite().getId());
	            		}
            		}
                Set<Long> subEmpIds = new TreeSet<Long>();
                if(employee != null) {
                    Hibernate.initialize(employee.getSubOrdinates());
                    int levelCnt = 1;
                    findAllSubordinates(employee, subEmpIds, levelCnt);
                    List<Long> subEmpList = new ArrayList<Long>();
                    subEmpList.addAll(subEmpIds);
                    log.debug("List of subordinate ids -"+ subEmpIds);
                    searchCriteria.setSubordinateIds(subEmpList);
                }

                page = ticketRepository.findAll(new TicketSpecification(searchCriteria,hasViewAll),pageRequest);
//                if(searchCriteria.getSiteId() > 0) {
//                		if(StringUtils.isNotEmpty(searchCriteria.getTicketStatus())) {
//                			if(hasViewAll) {
//                				page = ticketRepository.findBySiteIdAndStatus(searchCriteria.getSiteId(), searchCriteria.getTicketStatus(), startDate, endDate,pageRequest);
//                			}else {
//                				page = ticketRepository.findBySiteIdStatusAndEmpId(searchCriteria.getSiteId(), searchCriteria.getTicketStatus(),searchCriteria.getSubordinateIds(), startDate, endDate,pageRequest);
//                			}
//                		}else {
//                			if(hasViewAll) {
//                				page = ticketRepository.findBySiteId(searchCriteria.getSiteId(), startDate, endDate,pageRequest);
//                			}else {
//                				page = ticketRepository.findBySiteIdUserIdAndEmpId(searchCriteria.getSiteId(), searchCriteria.getSubordinateIds(), startDate, endDate,pageRequest);
//                			}
//                		}
//                }else if (searchCriteria.getProjectId() > 0) {
//	            		if(StringUtils.isNotEmpty(searchCriteria.getTicketStatus())) {
//	            			if(hasViewAll) {
//	            				page = ticketRepository.findByProjectIdAndStatus(searchCriteria.getProjectId(), searchCriteria.getTicketStatus(), startDate, endDate,pageRequest);
//	            			}else {
//	            				page = ticketRepository.findByProjectIdStatusAndEmpId(searchCriteria.getProjectId(), searchCriteria.getTicketStatus(),searchCriteria.getSubordinateIds(), startDate, endDate,pageRequest);
//	            			}
//	            		}else {
//	            			if(hasViewAll) {
//	            				page = ticketRepository.findByProjectId(searchCriteria.getProjectId(), startDate, endDate, pageRequest);
//	            			} else {
//	            				page = ticketRepository.findByProjectIdAndEmpId(searchCriteria.getProjectId(), searchCriteria.getSubordinateIds(), startDate, endDate,pageRequest);
//	            			}
//	            		}
//                }else if (searchCriteria.getAssetId() > 0) {
//	            		if(StringUtils.isNotEmpty(searchCriteria.getTicketStatus())) {
//            				page = ticketRepository.findByAssetIdAndStatus(searchCriteria.getAssetId(), searchCriteria.getTicketStatus(), startDate, endDate,pageRequest);
//	            		}else {
//            				page = ticketRepository.findByAssetId(searchCriteria.getAssetId(), startDate, endDate, pageRequest);
//	            		}
//	            }else {
//	            		if(StringUtils.isNotEmpty(searchCriteria.getTicketStatus())) {
//            				page = ticketRepository.findByStatusAndEmpId(siteIds,searchCriteria.getTicketStatus(),searchCriteria.getSubordinateIds(), startDate, endDate,pageRequest);
//	            		}else {
//	            			if(CollectionUtils.isNotEmpty(siteIds)) {
//	            				page = ticketRepository.findByEmpId(siteIds,searchCriteria.getSubordinateIds(), startDate, endDate,pageRequest);
//	            			}else {
//	            				page = ticketRepository.findByEmpId(searchCriteria.getSubordinateIds(), startDate, endDate,pageRequest);
//	            			}
//	            		}
//
//                }
            }
	    		if(log.isDebugEnabled()) {
	    			log.debug("Ticket Search Result size -" + (page.getContent() != null ? page.getContent().size() :  null));
	    		}
            List<Ticket> entities = page.getContent();
            if(CollectionUtils.isNotEmpty(entities)) {
            		transactions = new ArrayList<TicketDTO>();
            		for(Ticket ticket : entities) {
            			transactions.add(mapToModel(ticket));
            		}
            }

            //transactions = mapperUtil.toModelList(page.getContent(), TicketDTO.class);
            buildSearchResult(searchCriteria, page, transactions, result);
	    		if(log.isDebugEnabled()) {
	    			log.debug("Ticket Search Completed");
	    		}
        }
        return result;
    }

    private TicketDTO mapToModel(Ticket ticket) {
    		TicketDTO dto = new TicketDTO();
    		dto.setActive(ticket.getActive());
    		dto.setId(ticket.getId());
    		Site site = ticket.getSite();
    		dto.setSiteId(site.getId());
    		dto.setSiteName(site.getName());
    		dto.setTitle(ticket.getTitle());
    		dto.setDescription(ticket.getDescription());
    		dto.setStatus(ticket.getStatus());
    		dto.setPendingAtClient(ticket.isPendingAtClient());
    		dto.setPendingAtUDS(ticket.isPendingAtUDS());
    		dto.setCategory(ticket.getCategory());
    		dto.setSeverity(ticket.getSeverity());
    		dto.setCreatedBy(ticket.getCreatedBy());
    		dto.setCreatedDate(ticket.getCreatedDate());
    		dto.setAssignedOn(ticket.getAssignedOn());
    		dto.setAssignedToId(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getId() : 0);
    		dto.setAssignedToName(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getName() : null);
    		dto.setAssignedToLastName(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getLastName() : null);
    		dto.setClosedOn(ticket.getClosedOn());
    		dto.setClosedById(ticket.getClosedBy() != null ? ticket.getClosedBy().getId() : 0);
    		dto.setClosedByName(ticket.getClosedBy() != null ? ticket.getClosedBy().getName() : null);
    		dto.setClosedByLastName(ticket.getClosedBy() != null ? ticket.getClosedBy().getLastName() : null);
    		Asset asset = ticket.getAsset();
    		if(asset != null) {
	    		dto.setAssetId(asset.getId());
	    		dto.setAssetTitle(asset.getTitle());
    		}
    		Job job = ticket.getJob();
    		if(job != null) {
    			dto.setJobId(job.getId());
    			dto.setJobName(job.getTitle());
    		}
    		dto.setComments(ticket.getComments());
    		dto.setImage(ticket.getImage());
    		dto.setQuotationId(ticket.getQuotationId());
    		return dto;
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

	private void sendNotifications(Employee ticketOwner, Employee assignedTo,Employee currentUserEmp,  Ticket ticket, Site site, boolean isNew) {
		User assignedToUser = null;
		if(assignedTo != null) {
			Hibernate.initialize(assignedTo.getUser());
			assignedToUser = assignedTo.getUser();
		}
		Hibernate.initialize(ticketOwner.getUser());
		User ticketOwnerUser = ticketOwner.getUser();
		if(assignedTo == null) {
			assignedTo = ticketOwner;
		}
		if(assignedToUser == null) {
			assignedToUser = ticketOwnerUser;
		}
		String ticketUrl = env.getProperty("url.ticket-view");
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
		if(log.isDebugEnabled()) {
			log.debug("ticketUrl -" + ticketUrl);
			log.debug("assignedTo - " + assignedTo);
			log.debug("assignedTo User - " + assignedTo.getUser());
			log.debug("assignedToEmail -"+ assignedToEmail);
			log.debug("site - "+ site.getName());
			log.debug("ticket - "+ ticket);
			log.debug("ticket id -" + ticket.getId());
			log.debug("assignedTouser first name -" + assignedToUser.getFirstName());
			log.debug("assignedTo name -" + assignedTo.getName());
			log.debug("ticket title -" + ticket.getTitle());
			log.debug("ticket desc -" + ticket.getDescription());
			log.debug("ticket status -" + ticket.getStatus());
			log.debug("ticket severity -" + ticket.getSeverity());
		}
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

	public ExportResult generateReport(List<TicketDTO> transactions, SearchCriteria criteria) {
		User user = userRepository.findOne(criteria.getUserId());
		Employee emp = null;
		if(user != null) {
			emp = user.getEmployee();
		}
		long projId = criteria.getProjectId();
		Project proj = null;
		if(projId > 0) {
			proj = projectRepository.findOne(projId);
			criteria.setProjectName(proj.getName());
		}
        return reportUtil.generateTicketReports(transactions, user, emp, null, criteria);
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

	public List<TicketDTO> getAllAssetTickets(long assetId) {
		List<Ticket> tickets = ticketRepository.findByAssetId(assetId);
		return mapperUtil.toModelList(tickets, TicketDTO.class);
	}

	@Transactional
    public TicketDTO uploadFile(TicketDTO ticketDTO) throws JSONException {

        log.debug("Ticket images upload to AWS s3 -"+ticketDTO.getId());
        ticketDTO = amazonS3utils.uploadTicketFile(ticketDTO.getId(), ticketDTO.getImageFile(), ticketDTO);
        Ticket ticket = ticketRepository.findOne(ticketDTO.getId());
        ticket.setImage(ticketDTO.getImage());
        ticketRepository.saveAndFlush(ticket);
        ticketDTO.setImage(ticketDTO.getImage());
        ticketDTO.setUrl(ticketDTO.getUrl());
		return ticketDTO;
	}

	public String getTicketImage(long ticketId, String imageId) {
        String fileUrl = null;
        log.debug("Ticket Image service"+ ticketId +" "+ imageId);
        Ticket ticket = ticketRepository.findOne(ticketId);
        fileUrl = cloudFrontUrl + bucketEnv + ticketFilePath + ticket.getImage();
        return fileUrl;
    }

	public String uploadExistingTicketImg() {
		int currPage = 1;
		int pageSize = 10;
		Pageable pageRequest = createPageRequest(currPage, pageSize);
		log.debug("Curr Page ="+ currPage + ",  pageSize -" + pageSize);
		Page<Ticket> ticketResult = ticketRepository.findAll(pageRequest);
		List<Ticket> tickets = ticketResult.getContent();
		while(CollectionUtils.isNotEmpty(tickets)) {
			for(Ticket ticket : tickets) {
				if(ticket.getImage() != null) {
					if(ticket.getImage().indexOf("data:image") == 0) {
						String base64String = ticket.getImage().split(",")[1];
						boolean isBase64 = Base64.isBase64(base64String);
						long dateTime = new Date().getTime();
						TicketDTO ticketModel = mapperUtil.toModel(ticket, TicketDTO.class);
						if(isBase64){
							ticketModel = amazonS3utils.uploadExistingTicketFile(ticketModel.getId(), ticketModel.getImage(), dateTime, ticketModel);
							ticket.setImage(ticketModel.getImage());
						}
					}
				}
			}
			ticketRepository.save(tickets);
			currPage++;
			pageRequest = createPageRequest(currPage, pageSize);
			ticketResult = ticketRepository.findAll(pageRequest);
			tickets = ticketResult.getContent();
		}

		return "Successfully upload existing ticket file to S3";
	}

	public List<TicketDTO> generateReport(SearchCriteria searchCriteria, boolean b) {
		List<TicketDTO> transactions = null;
		if(log.isDebugEnabled()) {
			log.debug("Search Criteria - " + searchCriteria);
			}
		User user = userRepository.findOne(searchCriteria.getUserId());
		SearchResult<TicketDTO> result = new SearchResult<TicketDTO>();
		if(searchCriteria != null) {
		    //-----
		Pageable pageRequest = null;
		Page<Ticket> page = null;
		List<Ticket> allTicketList = new ArrayList<Ticket>();

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

        //create sql dates
        java.sql.Date sqlFromDate = DateUtil.convertToSQLDate(startCal.getTime());
        java.sql.Date sqlToDate = DateUtil.convertToSQLDate(endCal.getTime());

		page = ticketRepository.findBySiteIdAndDateRange(searchCriteria.getSiteId(), startDate, endDate, sqlFromDate, sqlToDate, pageRequest);
		allTicketList.addAll(page.getContent());
		if(CollectionUtils.isNotEmpty(allTicketList)) {
			if(transactions == null) {
				transactions = new ArrayList<TicketDTO>();
			}
			for(Ticket ticket : allTicketList) {
				transactions.add(mapperUtil.toModel(ticket, TicketDTO.class));
			}
		}
		}
		return transactions;
	}

}
