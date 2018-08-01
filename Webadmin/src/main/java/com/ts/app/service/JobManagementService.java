package com.ts.app.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.hibernate.Hibernate;
import org.joda.time.DateTime;
import org.joda.time.Hours;
import org.joda.time.Minutes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Asset;
import com.ts.app.domain.CheckInOut;
import com.ts.app.domain.CheckInOutImage;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.Job;
import com.ts.app.domain.JobChecklist;
import com.ts.app.domain.JobStatus;
import com.ts.app.domain.Location;
import com.ts.app.domain.NotificationLog;
import com.ts.app.domain.Price;
import com.ts.app.domain.Site;
import com.ts.app.domain.Ticket;
import com.ts.app.domain.TicketStatus;
import com.ts.app.domain.User;
import com.ts.app.domain.UserRole;
import com.ts.app.domain.UserRoleEnum;
import com.ts.app.domain.UserRolePermission;
import com.ts.app.repository.AssetRepository;
import com.ts.app.repository.CheckInOutImageRepository;
import com.ts.app.repository.CheckInOutRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.JobSpecification;
import com.ts.app.repository.LocationRepository;
import com.ts.app.repository.NotificationRepository;
import com.ts.app.repository.PricingRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.TicketRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.FileUploadHelper;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.PagingUtil;
import com.ts.app.service.util.QRCodeUtil;
import com.ts.app.service.util.ReportUtil;
import com.ts.app.web.rest.dto.AssetDTO;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.CheckInOutDTO;
import com.ts.app.web.rest.dto.CheckInOutImageDTO;
import com.ts.app.web.rest.dto.EmployeeDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.JobChecklistDTO;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.LocationDTO;
import com.ts.app.web.rest.dto.NotificationLogDTO;
import com.ts.app.web.rest.dto.PriceDTO;
import com.ts.app.web.rest.dto.ReportResult;
import com.ts.app.web.rest.dto.SchedulerConfigDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.TicketDTO;
import com.ts.app.web.rest.errors.TimesheetException;

/**
 * Service class for managing Device information.
 */
@Service
@Transactional
public class JobManagementService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(JobManagementService.class);

	@Inject
	private JobRepository jobRepository;

    @Inject
    private CheckInOutRepository checkInOutRepository;

    @Inject
    private AssetRepository assetRepository;

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
	private NotificationRepository notificationRepository;

	@Inject
	private SchedulerService schedulerService;

	@Inject
	private ExportUtil exportUtil;

	@Inject
	private MailService mailService;

	@Inject
	private ReportService reportService;

    @Inject
    private Environment env;

    @Inject
    private FileUploadHelper fileUploadHelper;

    @Inject
    private ImportUtil importUtil;

    @Inject
    private ReportUtil reportUtil;

    @Inject
    private PricingRepository priceRepository;

    @Inject
    private CheckInOutImageRepository checkInOutImageRepository;

    @Inject
    private TicketManagementService ticketManagementService;

    @Inject
    private PushService pushService;

    public void updateJobStatus(long siteId, JobStatus toBeJobStatus) {
		//UPDATE ALL OVERDUE JOB STATUS
		if(!StringUtils.isEmpty(toBeJobStatus) &&
				toBeJobStatus.equals(JobStatus.OVERDUE)) {
			if(siteId > 0) {
				Calendar cal = Calendar.getInstance();
				java.sql.Date now = new java.sql.Date(cal.getTimeInMillis());
				jobRepository.updateJobOverdueStatus(siteId, JobStatus.OVERDUE, now, JobStatus.ASSIGNED);
			}
		}

    }

    @Transactional(readOnly = true)
    public List<CheckInOutDTO> findCheckInOutByJob(Long jobId){
        List<CheckInOut> dtoList = checkInOutRepository.getCheckInOutByJobId(jobId);
        List<CheckInOutDTO> result = mapperUtil.toModelList(dtoList,CheckInOutDTO.class);
        return result;
    }

	public SearchResult<JobDTO> findBySearchCrieria(SearchCriteria searchCriteria, boolean isAdmin) {
		SearchResult<JobDTO> result = new SearchResult<JobDTO>();
		if(searchCriteria != null) {
			log.debug("findBYSearchCriteria search criteria -"+ (searchCriteria.getJobStatus() != null && searchCriteria.getJobStatus().equals(JobStatus.OVERDUE)));

			User user = userRepository.findOne(searchCriteria.getUserId());
			Employee employee = user.getEmployee();

			//log.debug(""+employee.getEmpId());

			List<Long> subEmpIds = new ArrayList<Long>();
			if(employee != null && !user.isAdmin()) {
				searchCriteria.setDesignation(employee.getDesignation());
				Hibernate.initialize(employee.getSubOrdinates());
				/*
				Set<Employee> subs = employee.getSubOrdinates();
				log.debug("List of subordinates -"+ subs);
				if(CollectionUtils.isNotEmpty(subs)){
					subEmpIds = new ArrayList<Long>();
				}
				for(Employee sub : subs) {
					subEmpIds.add(sub.getId());
				}
				*/
				findAllSubordinates(employee, subEmpIds);
				log.debug("List of subordinate ids -"+ subEmpIds);
				if(CollectionUtils.isEmpty(subEmpIds)) {
					subEmpIds.add(employee.getId());
				}
				searchCriteria.setSubordinateIds(subEmpIds);
			}else if(user.isAdmin()){
				searchCriteria.setAdmin(true);
			}
			log.debug("SearchCriteria ="+ searchCriteria);

			//Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
			//------
            Pageable pageRequest = null;
            if(!StringUtils.isEmpty(searchCriteria.getColumnName())){
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" +sort);
                pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);

            }else{
                log.debug("Sorting object not found",searchCriteria.isReport());
                if (searchCriteria.isReport()) {
                    pageRequest = createPageRequest(searchCriteria.getCurrPage(), true);
                } else {
                    pageRequest = createPageRequest(searchCriteria.getCurrPage());
                }
            }



			//Pageable pageRequest = new PageRequest(searchCriteria.getCurrPage(), PagingUtil.PAGE_SIZE, new Sort(Direction.DESC,"id"));
			Page<Job> page = null;
			List<Job> allJobsList = new ArrayList<Job>();
			List<JobDTO> transactions = null;

			Date checkInDate = searchCriteria.getCheckInDateTimeFrom();

            log.debug("JobManagementService toPredicate - searchCriteria projectid -"+ searchCriteria.getProjectId());
            log.debug("JobManagementService toPredicate - searchCriteria siteId -"+ searchCriteria.getSiteId());
            log.debug("JobManagementService toPredicate - searchCriteria siteId -"+ searchCriteria.getLocationId());
            log.debug("JobManagementService toPredicate - searchCriteria jobstatus -"+ searchCriteria.getJobStatus());
            log.debug("JobManagementService toPredicate - searchCriteria jobTitle -"+ searchCriteria.getJobTitle());
            log.debug("JobManagementService toPredicate - searchCriteria scheduled -"+ searchCriteria.isScheduled());
            log.debug("JobSpecification toPredicate - searchCriteria get assigned status -"+ searchCriteria.isAssignedStatus());
            log.debug("JobSpecification toPredicate - searchCriteria get completed status -"+ searchCriteria.isCompletedStatus());
            log.debug("JobSpecification toPredicate - searchCriteria get overdue status -"+ searchCriteria.isOverdueStatus());
            log.debug("JobSpecification toPredicate - searchCriteria get consolidated status -"+ searchCriteria.isConsolidated());

            boolean hasViewAll = false;
	    		Hibernate.initialize(user.getUserRole());
	    		UserRole userRole = user.getUserRole();
	    		if(userRole != null) {
	    			Set<UserRolePermission> permissions = userRole.getRolePermissions();
	    			if(CollectionUtils.isNotEmpty(permissions)) {
	    				for(UserRolePermission perm : permissions) {
	    					if(perm.getModule().getName().equalsIgnoreCase("Jobs")
	    						&& perm.getAction().getName().equalsIgnoreCase("ViewAll")) {
	    						hasViewAll = true;
	    						break;
	    					}
	    				}
	    			}
	    		}
	    		List<Long> siteIds = new ArrayList<Long>();
	    		if(hasViewAll) {
            		List<EmployeeProjectSite> sites = employee.getProjectSites();
            		if(hasViewAll) {
	            		for(EmployeeProjectSite site : sites) {
	            			siteIds.add(site.getSite().getId());
	            		}
	            		searchCriteria.setSiteIds(siteIds);
            		}
	    		}

            List<ReportResult> reportResults = new ArrayList<ReportResult>();
            log.debug("JobSpecification toPredicate - searchCriteria checkInDateFrom -"+ checkInDate);
	        	if(checkInDate != null) {
	        	    log.debug("check in date is not null");
		        	Calendar checkInDateFrom = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
		        	checkInDateFrom.setTime(checkInDate);

		        	checkInDateFrom.set(Calendar.HOUR_OF_DAY, 0);
		        	checkInDateFrom.set(Calendar.MINUTE,0);
		        	checkInDateFrom.set(Calendar.SECOND,0);
		        	java.sql.Date fromDt = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(checkInDateFrom));
		        	//String fromDt = DateUtil.formatUTCToIST(checkInDateFrom);
		        	Calendar checkInDateTo = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
		        	if(searchCriteria.getCheckInDateTimeTo() != null) {
		        		checkInDateTo.setTime(searchCriteria.getCheckInDateTimeTo());
		        	}else {
		        		checkInDateTo.setTime(checkInDate);
		        	}

		        	checkInDateTo.set(Calendar.HOUR_OF_DAY, 23);
		        	checkInDateTo.set(Calendar.MINUTE,59);
		        	checkInDateTo.set(Calendar.SECOND,0);
		        	java.sql.Date toDt = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(checkInDateTo));

	//				page = jobRepository.findByDateRange(searchCriteria.getSiteId(), searchCriteria.getUserId(), subEmpIds, searchCriteria.getJobStatus(),
	//												fromDt, toDt, searchCriteria.isScheduled(), pageRequest);

		        	if(!searchCriteria.isConsolidated()) {

		        		/*
		                if(searchCriteria.getJobStatus().toString().equalsIgnoreCase("OVERDUE")) {
		                    log.debug("getting overdue jobs");
		                    page = jobRepository.findOverDueJobsByDateRangeAndLocation(searchCriteria.getSiteId(),searchCriteria.getUserId(),subEmpIds,fromDt,toDt,searchCriteria.getLocationId(),pageRequest);
		                }else{
		                    log.debug("getting other jobs");
		                    page = jobRepository.findByDateRangeAndLocation(searchCriteria.getSiteId(),searchCriteria.getUserId(),subEmpIds,searchCriteria.getJobStatus(),fromDt,toDt,searchCriteria.isScheduled(),searchCriteria.getLocationId(),pageRequest);
		                }
		                */
		        		if(searchCriteria.isAssignedStatus()) {
		        		    log.debug("search criteria assigned status true");
		        		    if(searchCriteria.getSiteId() > 0) {
		        		    		page = jobRepository.findByDateRangeAndLocation(searchCriteria.getSiteId(),searchCriteria.getUserId(),subEmpIds, JobStatus.ASSIGNED,fromDt,toDt,searchCriteria.isScheduled(),searchCriteria.getLocationId(),pageRequest);
		        		    }else {
		        		    		page = jobRepository.findByStatusAndDateRange(searchCriteria.getUserId(),subEmpIds,fromDt,toDt, JobStatus.ASSIGNED,pageRequest);
		        		    }
		        		    	allJobsList.addAll(page.getContent());
		        		}
		        		if(searchCriteria.isCompletedStatus()) {
		        		    log.debug("search criteria completed status true");
		        		    if(searchCriteria.getSiteId() > 0) {
		        		    		page = jobRepository.findByDateRangeAndLocation(searchCriteria.getSiteId(),searchCriteria.getUserId(),subEmpIds, JobStatus.COMPLETED,fromDt,toDt,searchCriteria.getLocationId(),pageRequest);
		        		    }else {
		        		    		page = jobRepository.findByStatusAndDateRange(searchCriteria.getUserId(),subEmpIds,fromDt,toDt, JobStatus.COMPLETED,pageRequest);
		        		    }
		        		    	allJobsList.addAll(page.getContent());
		        		}
		        		if(searchCriteria.isOverdueStatus()) {
		        			log.debug("search criteria overdue status true");
		        			if(searchCriteria.getSiteId() > 0) {
		        				page = jobRepository.findOverDueJobsByDateRangeAndLocation(searchCriteria.getSiteId(),searchCriteria.getUserId(),subEmpIds,fromDt,toDt,searchCriteria.getLocationId(),pageRequest);
		        			}else {
		        				page = jobRepository.findByStatusAndDateRange(searchCriteria.getUserId(),subEmpIds,fromDt,toDt, JobStatus.OVERDUE,pageRequest);
		        			}
		        			allJobsList.addAll(page.getContent());
		        		}
		            	if(employee.getUser().getUserRole().getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue())) {
		            		if(searchCriteria.getSiteId() > 0 && searchCriteria.getEmployeeId() >0 ) {
		            		    if(searchCriteria.getLocationId()>0){
                                    page = jobRepository.findByStartDateSiteAndEmployeeAndLocation(searchCriteria.getSiteId(), searchCriteria.getEmployeeId(),searchCriteria.getLocationId(), fromDt, toDt, pageRequest);

                                }else{
                                    page = jobRepository.findByStartDateSiteAndEmployee(searchCriteria.getSiteId(), searchCriteria.getEmployeeId(), fromDt, toDt, pageRequest);

                                }
		            		}else if(searchCriteria.getSiteId() > 0 && searchCriteria.getEmployeeId() == 0) {
		            		    if(searchCriteria.getLocationId()>0){
                                    page = jobRepository.findByStartDateAndSiteAndLocation(searchCriteria.getSiteId(),searchCriteria.getLocationId(), fromDt, toDt, pageRequest);

                                }else if (org.apache.commons.lang3.StringUtils.isNotEmpty(searchCriteria.getBlock())){
		            		        page = jobRepository.findAll(new JobSpecification(searchCriteria,isAdmin),pageRequest);
                                }else{
                                    page = jobRepository.findByStartDateAndSite(searchCriteria.getSiteId(), fromDt, toDt, pageRequest);
                                }
		            		}else if(searchCriteria.getSiteId() == 0 && searchCriteria.getEmployeeId() > 0) {
		            		    if(searchCriteria.getLocationId()>0){
                                    page = jobRepository.findByStartDateAndEmployeeAndLocation(searchCriteria.getEmployeeId(),searchCriteria.getLocationId(), fromDt, toDt, pageRequest);
                                }else if (org.apache.commons.lang3.StringUtils.isNotEmpty(searchCriteria.getBlock())){
                                    page = jobRepository.findAll(new JobSpecification(searchCriteria,isAdmin),pageRequest);
                                }else{
                                    page = jobRepository.findByStartDateAndEmployee(searchCriteria.getEmployeeId(), fromDt, toDt, pageRequest);
                                }
		            		}else if(searchCriteria.getSiteId() > 0 && !StringUtils.isEmpty(searchCriteria.getJobTypeName())) {
		            		    if(searchCriteria.getLocationId()>0){
                                    page = jobRepository.findByStartDateAndSiteAndJobTypeAndLocation(searchCriteria.getSiteId(), searchCriteria.getLocationId(),  searchCriteria.getJobTypeName(), fromDt, toDt, pageRequest);
                                }else if (org.apache.commons.lang3.StringUtils.isNotEmpty(searchCriteria.getBlock())){
                                    page = jobRepository.findAll(new JobSpecification(searchCriteria,isAdmin),pageRequest);
                                }else{
                                    page = jobRepository.findByStartDateAndSiteAndJobType(searchCriteria.getSiteId(),  searchCriteria.getJobTypeName(), fromDt, toDt, pageRequest);
                                }
		            		}else {
			        			page = jobRepository.findAll(new JobSpecification(searchCriteria,isAdmin),pageRequest);
		            		}
		        			allJobsList.addAll(page.getContent());

		            	}else {
		            		if(searchCriteria.getSiteId() > 0 && searchCriteria.getEmployeeId() >0) {
                                if(searchCriteria.getLocationId()>0){
                                    page = jobRepository.findByStartDateSiteAndEmployeeAndLocation(searchCriteria.getSiteId(), searchCriteria.getEmployeeId(),searchCriteria.getLocationId(), fromDt, toDt, pageRequest);

                                }else if (org.apache.commons.lang3.StringUtils.isNotEmpty(searchCriteria.getBlock())){
                                    page = jobRepository.findAll(new JobSpecification(searchCriteria,isAdmin),pageRequest);
                                }else{
                                    page = jobRepository.findByStartDateSiteAndEmployee(searchCriteria.getSiteId(), searchCriteria.getEmployeeId(), fromDt, toDt, pageRequest);

                                }
		            		}else if(searchCriteria.getSiteId() > 0 && searchCriteria.getEmployeeId() == 0) {
                                if(searchCriteria.getLocationId()>0){
                                    page = jobRepository.findByStartDateAndSiteAndLocation(searchCriteria.getSiteId(),searchCriteria.getLocationId(), fromDt, toDt, pageRequest);

                                }else if (org.apache.commons.lang3.StringUtils.isNotEmpty(searchCriteria.getBlock())){
                                    page = jobRepository.findAll(new JobSpecification(searchCriteria,isAdmin),pageRequest);
                                }else{
                                    page = jobRepository.findByStartDateAndSite(searchCriteria.getSiteId(), fromDt, toDt, pageRequest);
                                }
		            		}else if(searchCriteria.getSiteId() == 0 && searchCriteria.getEmployeeId() > 0) {
                                if(searchCriteria.getLocationId()>0){
                                    page = jobRepository.findByStartDateAndEmployeeAndLocation(searchCriteria.getEmployeeId(),searchCriteria.getLocationId(), fromDt, toDt, pageRequest);
                                }else if (org.apache.commons.lang3.StringUtils.isNotEmpty(searchCriteria.getBlock())){
                                    page = jobRepository.findAll(new JobSpecification(searchCriteria,isAdmin),pageRequest);
                                }else{
                                    page = jobRepository.findByStartDateAndEmployee(searchCriteria.getEmployeeId(), fromDt, toDt, pageRequest);
                                }
		            		}else if(searchCriteria.getSiteId() > 0 && !StringUtils.isEmpty(searchCriteria.getJobTypeName())) {
                                if(searchCriteria.getLocationId()>0){
                                    page = jobRepository.findByStartDateAndSiteAndJobTypeAndLocation(searchCriteria.getSiteId(), searchCriteria.getLocationId(),  searchCriteria.getJobTypeName(), fromDt, toDt, pageRequest);
                                }else if (org.apache.commons.lang3.StringUtils.isNotEmpty(searchCriteria.getBlock())){
                                    page = jobRepository.findAll(new JobSpecification(searchCriteria,isAdmin),pageRequest);
                                }else{
                                    page = jobRepository.findByStartDateAndSiteAndJobType(searchCriteria.getSiteId(),  searchCriteria.getJobTypeName(), fromDt, toDt, pageRequest);
                                }
		            		}else if(!StringUtils.isEmpty(searchCriteria.getJobTypeName())) {
			        			page = jobRepository.findAll(new JobSpecification(searchCriteria,isAdmin),pageRequest);
		            		}else {
		            			if(CollectionUtils.isNotEmpty(siteIds)) {
		            				page = jobRepository.findBySiteIdsOrEmpIdsAndDateRange(searchCriteria.getUserId(), siteIds, subEmpIds, fromDt, toDt, pageRequest);
		            			}else {
		            				page = jobRepository.findByDateRange(searchCriteria.getUserId(), subEmpIds, fromDt, toDt, pageRequest);
		            			}
		            		}
		            		allJobsList.addAll(page.getContent());
		            	}

		        	}else {
		        	    log.debug("site reporsitory find all");
		        		List<Site> allSites = siteRepository.findAll();
		        		for(Site site : allSites) {
		        			reportResults.add(reportService.jobCountBySiteAndStatusAndDateRange(site.getId(),fromDt, toDt));
		        		}

		        	}
	        	}else {
	        		if(!searchCriteria.isConsolidated()) {
	        			page = jobRepository.findAll(new JobSpecification(searchCriteria,isAdmin),pageRequest);
	        			if(CollectionUtils.isEmpty(page.getContent())) {
		            		List<EmployeeProjectSite> projectSites = employee.getProjectSites();
		            		if(CollectionUtils.isNotEmpty(projectSites)) {
		            			for(EmployeeProjectSite projSite : projectSites) {
		            				siteIds.add(projSite.getSite().getId());
		            			}
		            			page = jobRepository.findByStartDateAndSites(siteIds, pageRequest);
		            			allJobsList.addAll(page.getContent());
		            		}

	        			}else {
	            			allJobsList.addAll(page.getContent());
	            		}
	        		}else {
		        		List<Site> allSites = siteRepository.findAll();
		        		for(Site site : allSites) {
		        			reportResults.add(reportService.jobCountBySiteAndStatus(site.getId()));
		        		}

	        		}
	        	}

        	/*
			if(CollectionUtils.isNotEmpty(allJobsList)) {
				transactions = mapperUtil.toModelList(allJobsList, JobDTO.class);
				if(CollectionUtils.isNotEmpty(transactions)) {
					//if report generation needed
                    log.debug("transactions exists");
					if(searchCriteria.isSendReport()) {
					    log.debug("send report");
						ExportResult exportResult = new ExportResult();
						exportResult = exportUtil.writeJobReportToFile(transactions, null, exportResult);
						for(Job job : page.getContent()) {
							List<Employee> employees = job.getSite().getEmployees();
							for(Employee emp : employees) {
								User user = emp.getUser();
								String empEmail = emp.getUser().getEmail();
								mailService.sendJobReportEmailFile(user, exportResult.getFile(), null);
//                                log.debug("sending email now disabled");

                            }
						}

					}

					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}
			else{
        	    log.debug("no jobs found on the daterange");
            }


			if(CollectionUtils.isNotEmpty(reportResults)) {
				//if report generation needed
                log.debug("report resulsts");
				if(searchCriteria.isSendReport()) {
				    log.debug("send repost report results");
					ExportResult exportResult = new ExportResult();
					exportResult = exportUtil.writeConsolidatedJobReportToFile(reportResults, null, exportResult);
					for(ReportResult reportResult : reportResults) {
						Site site = siteRepository.findOne(reportResult.getSiteId());
						List<Employee> employees = site.getEmployees();
						for(Employee emp : employees) {
							User user = emp.getUser();
							String empEmail = emp.getUser().getEmail();
							mailService.sendJobReportEmailFile(user, exportResult.getFile(), null);
//                            log.debug("sending email now disabled");
						}
					}

				}
			}
			*/

		if(CollectionUtils.isNotEmpty(allJobsList)) {
			//transactions = mapperUtil.toModelList(allJobsList, JobDTO.class);
			if(transactions == null) {
				transactions = new ArrayList<JobDTO>();
			}
        		for(Job job : allJobsList) {
        			transactions.add(mapToModel(job));
        		}
			buildSearchResult(searchCriteria, page, transactions,result);
		}
	}
		return result;
	}


	public List<ReportResult> generateConsolidatedReport(SearchCriteria searchCriteria, boolean isAdmin) {
		List<ReportResult> reportResults = new ArrayList<ReportResult>();
		if(searchCriteria != null) {
			User user = null;
			if(searchCriteria.getUserId() > 0) {
				Employee employee = employeeRepository.findByUserId(searchCriteria.getUserId());
				user = userRepository.findOne(searchCriteria.getUserId());
				isAdmin = user.isAdmin();
				List<Long> subEmpIds = new ArrayList<Long>();
				if(employee != null) {
					searchCriteria.setDesignation(employee.getDesignation());
					Hibernate.initialize(employee.getSubOrdinates());
					findAllSubordinates(employee, subEmpIds);
					log.debug("List of subordinate ids -"+ subEmpIds);
					if(CollectionUtils.isEmpty(subEmpIds)) {
						subEmpIds.add(employee.getId());
					}
					searchCriteria.setSubordinateIds(subEmpIds);
				}
			}
			log.debug("SearchCriteria ="+ searchCriteria);

			Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
			Page<Job> page = null;
			List<Job> allJobsList = new ArrayList<Job>();
			List<JobDTO> transactions = null;

			Date checkInDate = searchCriteria.getCheckInDateTimeFrom();

            log.debug("JobManagementService toPredicate - searchCriteria projectid -"+ searchCriteria.getProjectId());
            log.debug("JobManagementService toPredicate - searchCriteria siteId -"+ searchCriteria.getSiteId());
            log.debug("JobManagementService toPredicate - searchCriteria jobstatus -"+ searchCriteria.getJobStatus());
            log.debug("JobManagementService toPredicate - searchCriteria jobTitle -"+ searchCriteria.getJobTitle());
            log.debug("JobManagementService toPredicate - searchCriteria scheduled -"+ searchCriteria.isScheduled());
            log.debug("JobManagementService toPredicate - searchCriteria scheduled -"+ searchCriteria.getLocationId());
            log.debug("JobSpecification toPredicate - searchCriteria get assigned status -"+ searchCriteria.isAssignedStatus());
            log.debug("JobSpecification toPredicate - searchCriteria get completed status -"+ searchCriteria.isCompletedStatus());
            log.debug("JobSpecification toPredicate - searchCriteria get overdue status -"+ searchCriteria.isOverdueStatus());
            log.debug("JobSpecification toPredicate - searchCriteria get consolidated status -"+ searchCriteria.isConsolidated());


            log.debug("JobSpecification toPredicate - searchCriteria checkInDateFrom -"+ checkInDate);
        		if(checkInDate != null) {
	        	    log.debug("check in date is not null");
		        	Calendar checkInDateFrom = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
		        	checkInDateFrom.setTime(checkInDate);

		        	checkInDateFrom.set(Calendar.HOUR_OF_DAY, 0);
		        	checkInDateFrom.set(Calendar.MINUTE,0);
		        	checkInDateFrom.set(Calendar.SECOND,0);
		        	java.sql.Date fromDt = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(checkInDateFrom));
		        	//String fromDt = DateUtil.formatUTCToIST(checkInDateFrom);
		        	Calendar checkInDateTo = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
		        	if(searchCriteria.getCheckInDateTimeTo() != null) {
		        		checkInDateTo.setTime(searchCriteria.getCheckInDateTimeTo());
		        	}else {
		        		checkInDateTo.setTime(checkInDate);
		        	}

		        	checkInDateTo.set(Calendar.HOUR_OF_DAY, 23);
		        	checkInDateTo.set(Calendar.MINUTE,59);
		        	checkInDateTo.set(Calendar.SECOND,0);
		        	java.sql.Date toDt = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(checkInDateTo));

		        	if(searchCriteria.isConsolidated()) {

		        	    log.debug("site reporsitory find all");
		        		List<Site> allSites = null;
		        		if(isAdmin) {
		        			allSites = siteRepository.findAll();
		        		}else {
		        			if(user != null) {
		        				allSites = siteRepository.findSiteByEmployeeId(user.getEmployee().getId());
		        			}
		        		}
		        		if(CollectionUtils.isNotEmpty(allSites)) {
			        		for(Site site : allSites) {
			        			if(searchCriteria.isGraphRequest()) {
			        				reportResults.add(reportService.jobCountGroupByDate(site.getId(), fromDt, toDt));
			        			}else {
			        				reportResults.add(reportService.jobCountBySiteAndStatusAndDateRange(site.getId(),fromDt, toDt));
			        			}
			        		}
		        		}

		        	}
	        	}else {
	        		if(!searchCriteria.isConsolidated()) {
	        			page = jobRepository.findAll(new JobSpecification(searchCriteria,isAdmin),pageRequest);
	        			allJobsList.addAll(page.getContent());
	        		}else {
	        			List<Site> allSites = null;
	        			if(isAdmin) {
	        				allSites = siteRepository.findAll();
	        			}else {
		        			user = userRepository.findOne(searchCriteria.getUserId());
		        			allSites = siteRepository.findSiteByEmployeeId(user.getEmployee().getId());
	        			}
		        		for(Site site : allSites) {
		        			reportResults.add(reportService.jobCountBySiteAndStatus(site.getId()));
		        		}

	        		}
	        	}

		}
		return reportResults;
	}





    public SearchResult<JobDTO> findByDateSelected(SearchCriteria searchCriteria, boolean isAdmin) {
        SearchResult<JobDTO> result = new SearchResult<JobDTO>();
        if(searchCriteria != null) {
            log.debug("findBYSearchCriteria search criteria -"+ (searchCriteria.getJobStatus() != null && searchCriteria.getJobStatus().equals(JobStatus.OVERDUE)));
            //UPDATE ALL OVERDUE JOB STATUS
            if(!StringUtils.isEmpty(searchCriteria.getJobStatus()) &&
                searchCriteria.getJobStatus().equals(JobStatus.OVERDUE)) {
                if(searchCriteria.getSiteId() > 0) {
                    Calendar cal = Calendar.getInstance();
                    java.sql.Date now = new java.sql.Date(cal.getTimeInMillis());
                    jobRepository.updateJobOverdueStatus(searchCriteria.getSiteId(), JobStatus.OVERDUE, now, JobStatus.ASSIGNED);
                }
            }

            Employee employee = employeeRepository.findByUserId(searchCriteria.getUserId());
            List<Long> subEmpIds = new ArrayList<Long>();
            if(employee != null) {
                searchCriteria.setDesignation(employee.getDesignation());
                Hibernate.initialize(employee.getSubOrdinates());
				/*
				Set<Employee> subs = employee.getSubOrdinates();
				log.debug("List of subordinates -"+ subs);
				if(CollectionUtils.isNotEmpty(subs)){
					subEmpIds = new ArrayList<Long>();
				}
				for(Employee sub : subs) {
					subEmpIds.add(sub.getId());
				}
				*/
                findAllSubordinates(employee, subEmpIds);
                log.debug("List of subordinate ids -"+ subEmpIds);
                searchCriteria.setSubordinateIds(subEmpIds);
            }
            log.debug("SearchCriteria ="+ searchCriteria);

            Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
            //Pageable pageRequest = new PageRequest(searchCriteria.getCurrPage(), PagingUtil.PAGE_SIZE, new Sort(Direction.DESC,"id"));
            Page<Job> page = null;
            List<JobDTO> transactions = null;

            page = jobRepository.findAll(new JobSpecification(searchCriteria,isAdmin),pageRequest);

            if(page != null) {
                //transactions = mapperUtil.toModelList(page.getContent(), JobDTO.class);
	    			if(transactions == null) {
	    				transactions = new ArrayList<JobDTO>();
	    			}

            		if(CollectionUtils.isNotEmpty(page.getContent())) {
	            		for(Job job : page.getContent()) {
	            			transactions.add(mapToModel(job));
	            		}
            		}
                if(CollectionUtils.isNotEmpty(transactions)) {
                    buildSearchResult(searchCriteria, page, transactions,result);
                }
            }

        }
        return result;
    }

	public List<Long> findAllSubordinates(Employee employee, List<Long> subEmpIds) {
		Set<Employee> subs = employee.getSubOrdinates();
		log.debug("List of subordinates -"+ subs);
		if(subs == null){
			subEmpIds = new ArrayList<Long>();
		}
		for(Employee sub : subs) {
			subEmpIds.add(sub.getId());
			Hibernate.initialize(sub.getSubOrdinates());
			if(CollectionUtils.isNotEmpty(sub.getSubOrdinates())){
				findAllSubordinates(sub, subEmpIds);
			}
		}
		return subEmpIds;
	}



	private void buildSearchResult(SearchCriteria searchCriteria, Page<Job> page, List<JobDTO> transactions, SearchResult<JobDTO> result) {
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

	public JobDTO saveJob(JobDTO jobDTO) {

		Job job = new Job();

		mapToEntity(jobDTO, job);
		if(job.getStatus() == null) {
			job.setStatus(JobStatus.ASSIGNED);
		}

		/*
		Calendar calStart = Calendar.getInstance();
		calStart.set(Calendar.HOUR_OF_DAY, 0);
		calStart.set(Calendar.MINUTE,0);
		Calendar calEnd = Calendar.getInstance();
		calEnd.set(Calendar.HOUR_OF_DAY, 11);
		calEnd.set(Calendar.MINUTE,59);

		java.sql.Date startDate = new java.sql.Date(calStart.getTimeInMillis());
		java.sql.Date endDate = new java.sql.Date(calEnd.getTimeInMillis());
		*/
		log.debug("Before saving new job -"+ job);
		//log.debug("start Date  -"+ startDate + ", end date -" + endDate);
		List<Job> existingJobs = jobRepository.findJobByTitleSiteAndDate(jobDTO.getTitle(), jobDTO.getSiteId(), DateUtil.convertToSQLDate(job.getPlannedStartTime()), DateUtil.convertToSQLDate(job.getPlannedEndTime()));
		log.debug("Existing job -"+ existingJobs);
		Job newScheduledJob = null;
		if(CollectionUtils.isEmpty(existingJobs)) {
			//if job is created against a ticket
			if(jobDTO.getTicketId() > 0) {
				Ticket ticket = ticketRepository.findOne(jobDTO.getTicketId());
				job.setTicket(ticket);
				ticket.setStatus(TicketStatus.ASSIGNED.toValue());
				ticketRepository.save(ticket);
			}

			if(jobDTO.getParentJobId()>0){
			    Job parentJob = jobRepository.findOne(jobDTO.getParentJobId());
			    job.setParentJob(parentJob);
	        }
			newScheduledJob = jobRepository.saveAndFlush(job);

			if(jobDTO.getTicketId() > 0) {
				Ticket ticket = ticketRepository.findOne(jobDTO.getTicketId());
				ticket.setJob(job);
				ticketRepository.saveAndFlush(ticket);
	        }
		}

		//if the job is scheduled for recurrence create a scheduled task
		if(newScheduledJob != null && !StringUtils.isEmpty(jobDTO.getSchedule()) && !jobDTO.getSchedule().equalsIgnoreCase("ONCE")) {
			SchedulerConfigDTO schConfDto = new SchedulerConfigDTO();
			schConfDto.setSchedule(jobDTO.getSchedule());
			schConfDto.setType("CREATE_JOB");
			StringBuffer data = new StringBuffer();
			data.append("title="+jobDTO.getTitle());
			data.append("&description="+jobDTO.getDescription());
			data.append("&siteId="+jobDTO.getSiteId());
			data.append("&empId="+jobDTO.getEmployeeId());
			data.append("&plannedStartTime="+jobDTO.getPlannedStartTime());
			data.append("&plannedEndTime="+job.getPlannedEndTime());
			data.append("&plannedHours="+jobDTO.getPlannedHours());
			data.append("&location="+jobDTO.getLocationId());
			data.append("&frequency="+jobDTO.getFrequency());
			schConfDto.setData(data.toString());
			log.debug("Saving data to scheduler config ==== "+job.getPlannedEndTime());
			schConfDto.setStartDate(jobDTO.getPlannedStartTime());
			schConfDto.setEndDate(job.getPlannedEndTime());
			schConfDto.setScheduleEndDate(jobDTO.getScheduleEndDate());
			schConfDto.setScheduleDailyExcludeWeekend(jobDTO.isScheduleDailyExcludeWeekend());
			schConfDto.setScheduleWeeklySunday(jobDTO.isScheduleWeeklySunday());
			schConfDto.setScheduleWeeklyMonday(jobDTO.isScheduleWeeklyMonday());
			schConfDto.setScheduleWeeklyTuesday(jobDTO.isScheduleWeeklyTuesday());
			schConfDto.setScheduleWeeklyWednesday(jobDTO.isScheduleWeeklyWednesday());
			schConfDto.setScheduleWeeklyThursday(jobDTO.isScheduleWeeklyThursday());
			schConfDto.setScheduleWeeklyFriday(jobDTO.isScheduleWeeklyFriday());
			schConfDto.setScheduleWeeklySaturday(jobDTO.isScheduleWeeklySaturday());

			schedulerService.save(schConfDto,newScheduledJob);
		}

		//send push notification to the employee assigned for the job
		if(!StringUtils.isEmpty(jobDTO.getSchedule()) && jobDTO.getSchedule().equalsIgnoreCase("ONCE")) {
			Employee assignedTo = job.getEmployee();
			if(assignedTo != null) {
				Map<String, Object> values = new HashMap<String, Object>();
				values.put("jobId", job.getId());
				values.put("jobTitle", job.getTitle());
				values.put("jobDateTime", DateUtil.formatToDateTimeString(job.getPlannedStartTime()));
				values.put("site", job.getSite().getName());
				if(assignedTo.getUser() != null) {
					long userId = assignedTo.getUser().getId();
					long[] userIds = new long[1];
					userIds[0] = userId;
					pushService.sendNewJobAlert(userIds, values);
				}
			}
		}

		return mapperUtil.toModel(job, JobDTO.class);
	}


	private JobDTO mapToModel(Job job) {
		JobDTO dto = new JobDTO();
		dto.setId(job.getId());
		dto.setTitle(job.getTitle());
		dto.setSiteId(job.getSite().getId());
		dto.setSiteName(job.getSite().getName());
		dto.setDescription(job.getDescription());
		dto.setJobStatus(job.getStatus());
		dto.setStatus(job.getStatus().name());
		dto.setEmployeeId(job.getEmployee().getId());
		dto.setEmployeeName(job.getEmployee().getName());
		dto.setPlannedStartTime(job.getPlannedStartTime());
		dto.setPlannedEndTime(job.getPlannedEndTime());
		dto.setActualStartTime(job.getActualStartTime());
		dto.setActualEndTime(job.getActualEndTime());
		dto.setActualHours(job.getActualHours());
		dto.setActualMinutes(job.getActualMinutes());
		dto.setSchedule(job.getSchedule());
		dto.setScheduled(job.isScheduled());
		dto.setJobType(job.getType());
		Ticket ticket = job.getTicket();
		if(ticket != null) {
			dto.setTicketId(ticket.getId());
			dto.setTicketName(ticket.getTitle());
		}
		return dto;
	}

	private void mapToEntity(JobDTO jobDTO, Job job) {
		Employee employee = getEmployee(jobDTO.getEmployeeId());
		Site site = getSite(jobDTO.getSiteId());
		Location location = getLocation(jobDTO.getLocationId());
		Asset asset = getAsset(jobDTO.getAssetId());

		Ticket ticket = getTicket(jobDTO.getTicketId());
		//update ticket status
		if(ticket != null) {
			ticket.setStatus(TicketStatus.INPROGRESS.toValue());
			ticketRepository.save(ticket);
		}
		job.setTitle(jobDTO.getTitle());
		job.setDescription(jobDTO.getDescription());
		job.setStatus(jobDTO.getJobStatus());
		job.setType(jobDTO.getJobType());
		if(location != null) {
		    log.debug("Found location in the job");
			job.setLocation(location);
		}
		if(org.apache.commons.lang3.StringUtils.isNotEmpty(jobDTO.getBlock())){
		    log.debug("Found the block in the job");
		    job.setBlock(jobDTO.getBlock());
        }
        if(org.apache.commons.lang3.StringUtils.isNotEmpty(jobDTO.getFloor())){
            log.debug("Found the floor in the job");

            job.setBlock(jobDTO.getFloor());
        }
        if(org.apache.commons.lang3.StringUtils.isNotEmpty(jobDTO.getZone())){
            log.debug("Found the zone in the job");

            job.setBlock(jobDTO.getZone());
        }
		if(asset!=null){
		    job.setAsset(asset);
        }

        if(ticket!=null){
		    job.setTicket(ticket);
        }
		job.setActive(jobDTO.getActive());

		job.setSite(site);
		job.setEmployee(employee);
		job.setComments(jobDTO.getComments());
		job.setPlannedStartTime(jobDTO.getPlannedStartTime());
		if(jobDTO.getPlannedEndTime() == null) {
			Calendar endTimeCal = Calendar.getInstance();
			endTimeCal.setTime(jobDTO.getPlannedStartTime());
			endTimeCal.add(Calendar.HOUR_OF_DAY, jobDTO.getPlannedHours());
			job.setPlannedEndTime(endTimeCal.getTime());
		}else {
			job.setPlannedEndTime(jobDTO.getPlannedEndTime());
		}
		job.setPlannedHours(jobDTO.getPlannedHours());

		job.setActualStartTime(jobDTO.getActualStartTime());
		job.setActualEndTime(jobDTO.getActualEndTime());
		job.setActualHours(jobDTO.getActualHours());
		job.setSchedule(jobDTO.getSchedule());
		job.setScheduleEndDate(jobDTO.getScheduleEndDate());
		job.setScheduleDailyExcludeWeekend(jobDTO.isScheduleDailyExcludeWeekend());
		job.setScheduleWeeklySunday(jobDTO.isScheduleWeeklySunday());
		job.setScheduleWeeklyMonday(jobDTO.isScheduleWeeklyMonday());
		job.setScheduleWeeklyTuesday(jobDTO.isScheduleWeeklyTuesday());
		job.setScheduleWeeklyWednesday(jobDTO.isScheduleWeeklyWednesday());
		job.setScheduleWeeklyThursday(jobDTO.isScheduleWeeklyThursday());
		job.setScheduleWeeklyFriday(jobDTO.isScheduleWeeklyFriday());
		job.setScheduleWeeklySaturday(jobDTO.isScheduleWeeklySaturday());
		job.setScheduled(jobDTO.isScheduled());
		job.setFrequency(jobDTO.getFrequency());
		job.setBlock(jobDTO.getBlock());
		job.setFloor(jobDTO.getFloor());
		job.setZone(jobDTO.getZone());
		if(jobDTO.isPendingAtClient()){
            job.setPendingAtClient(jobDTO.isPendingAtClient());
        }

        if(jobDTO.isPendingAtUDS()){
		    job.setPendingAtUDS(jobDTO.isPendingAtUDS());
        }
		//add the job checklist items
		if(CollectionUtils.isNotEmpty(job.getChecklistItems())) {
			job.getChecklistItems().clear();
		}
		if(CollectionUtils.isNotEmpty(jobDTO.getChecklistItems())) {
			List<JobChecklistDTO> jobclDtoList = jobDTO.getChecklistItems();
			List<JobChecklist> checklistItems = new ArrayList<JobChecklist>();
			for(JobChecklistDTO jobclDto : jobclDtoList) {
			    log.debug("Job checklist remarks"+jobclDto.getRemarks());
				JobChecklist checklist = mapperUtil.toEntity(jobclDto, JobChecklist.class);
                log.debug("Job checklist remarks"+checklist.getImage_1());
                checklist.setJob(job);
				checklistItems.add(checklist);
			}
			if(job.getChecklistItems() != null) {
				job.getChecklistItems().addAll(checklistItems);
			}else {
				job.setChecklistItems(checklistItems);
			}
		}

	}

	private Site getSite(Long siteId) {
		Site site = siteRepository.findOne(siteId);
		if(site == null) throw new TimesheetException("Site not found : "+siteId);
		return site;
	}

	private Employee getEmployee(Long empId) {
		Employee employee = null;
		if(empId != null) {
			employee = employeeRepository.findOne(empId);
			if(employee == null) throw new TimesheetException("Employee not found : "+empId);
		}
		return employee;
	}

	private Location getLocation(long locationId){
	    Location location =null;
	    if(locationId > 0) {
	        location = locationRepository.findOne(locationId);
	        //throw new TimesheetException("Location not found:"+locationId);
        }
        return location;
    }

    private Asset getAsset(Long assetId){
        Asset asset=null;
        if(assetId != null && assetId > 0) {
            asset= assetRepository.findOne(assetId);
        }
        return asset;
    }

	public void updateJob(){

	}

	public void deleteJob(Long id){
		jobRepository.delete(id);
	}

	public List<JobDTO> getJobs(){
		return null;
	}

	public JobDTO getJob(long id){
		Job job = jobRepository.findOne(id);
		JobDTO jobDto = mapperUtil.toModel(job,JobDTO.class);
		CheckInOut checkInOutDTO= checkInOutRepository.getByJobId(id);
		if(checkInOutDTO != null) {
		    jobDto.setCheckInOutId(checkInOutDTO.getId());
			jobDto.setActualEndTime(checkInOutDTO.getCheckOutDateTime());
		}
        log.debug("Actual End time"+jobDto.getActualEndTime());
		jobDto.setActive(job.getActive());
		//jobDto.setLocationId(job.getLocation().getId());
		//jobDto.setLocationName(job.getLocation().getName());
		if(job.getTicket() != null) {
			jobDto.setTicketId(job.getTicket().getId());
			jobDto.setTicketName(job.getTicket().getTitle());
		}
		List<CheckInOutImage> images = checkInOutImageRepository.findAll(job.getId());
		List<CheckInOutImageDTO> imageDtos = new ArrayList<CheckInOutImageDTO>();
		if(CollectionUtils.isNotEmpty(images)) {
			for(CheckInOutImage image : images) {
				imageDtos.add(mapperUtil.toModel(image, CheckInOutImageDTO.class));
			}
		}
		jobDto.setImages(imageDtos);

		return jobDto;
	}

	public List<LocationDTO> findAllLocation(){
	    log.debug("get all alocations");
	    List<Location> locations = locationRepository.findAll();
	    List<LocationDTO> locationDto = new ArrayList<>();
	    for(Location loc: locations){
	        LocationDTO dto = new LocationDTO();
	        dto.setId(loc.getId());
	        dto.setName(loc.getName());
	        locationDto.add(dto);
        }
        return locationDto;
    }



	public SearchResult<JobDTO> getSiteJobs(Long siteId, int	 page) {
		Pageable pageRequest = new PageRequest(page, PagingUtil.PAGE_SIZE, new Sort(Direction.DESC,"id"));

		Page<Job> jobs= jobRepository.findBySiteId(siteId,pageRequest);
		SearchResult<JobDTO> paginatedJobs = new SearchResult<>();
		paginatedJobs.setCurrPage(page);
		paginatedJobs.setTransactions(mapperUtil.toModelList(jobs.getContent(), JobDTO.class));
		paginatedJobs.setTotalCount(jobs.getTotalElements());
		paginatedJobs.setTotalPages(jobs.getTotalPages());
		return paginatedJobs;
	}

	public List<EmployeeDTO> getAsssignableEmployee() {
		List<Employee> employees =  employeeRepository.findAll();
		List<EmployeeDTO> empDto = new ArrayList<>();
		for (Employee emp : employees) {
			EmployeeDTO dto = new EmployeeDTO();
			dto.setId(emp.getId());
			dto.setCode(emp.getCode());
			dto.setFullName(emp.getFullName());
			dto.setName(emp.getName());
			empDto.add(dto);
		}
		return empDto;
	}



	public JobDTO updateJob(JobDTO jobDTO, long userId) {
		Job job = findJob(jobDTO.getId());
		mapToEntity(jobDTO, job);
        log.debug("Ticket in job update ----"+jobDTO.getTicketId());
        Ticket ticket = null;
		if(jobDTO.getTicketId()>0){
		    log.debug("ticket is pressent");
		    log.debug("ticket is pressent----"+jobDTO.isPendingAtUDS());
		    log.debug("ticket is pressent----"+jobDTO.isPendingAtClient());
		    ticket = ticketRepository.findOne(jobDTO.getTicketId());
            TicketDTO ticketDTO = mapperUtil.toModel(ticket,TicketDTO.class);
            if(jobDTO.getJobStatus().equals(JobStatus.COMPLETED)) {
                ticketDTO.setPendingAtClient(false);
                ticketDTO.setPendingAtUDS(false);
            }else if(jobDTO.isPendingAtUDS()){
                ticketDTO.setPendingAtUDS(true);
                ticketDTO.setPendingAtClient(false);
            }else{
                ticketDTO.setPendingAtClient(true);
                ticketDTO.setPendingAtUDS(false);
            }
            ticketManagementService.updateTicketPendingStatus(ticketDTO);
        }
		if(jobDTO.getJobStatus().equals(JobStatus.COMPLETED)) {
			onlyCompleteJob(job, userId);
		}else {
			job = jobRepository.save(job);
		}

		//if the job is scheduled for recurrence create a scheduled task
		if(!StringUtils.isEmpty(jobDTO.getSchedule()) && !jobDTO.getSchedule().equalsIgnoreCase("ONCE")) {
			if(jobDTO.getActive().equalsIgnoreCase("yes")) {
				schedulerService.deleteCurrentSchedule(jobDTO.getId());
				SchedulerConfigDTO schConfDto = new SchedulerConfigDTO();
				schConfDto.setSchedule(jobDTO.getSchedule());
				schConfDto.setType("CREATE_JOB");
				StringBuffer data = new StringBuffer();
				data.append("title="+jobDTO.getTitle());
				data.append("&description="+jobDTO.getDescription());
				data.append("&siteId="+jobDTO.getSiteId());
				data.append("&empId="+jobDTO.getEmployeeId());
				data.append("&plannedStartTime="+jobDTO.getPlannedStartTime());
				data.append("&plannedEndTime="+jobDTO.getPlannedEndTime());
				data.append("&plannedHours="+jobDTO.getPlannedHours());
				schConfDto.setData(data.toString());
				schConfDto.setStartDate(jobDTO.getPlannedStartTime());
				schConfDto.setEndDate(jobDTO.getPlannedEndTime());
				schConfDto.setScheduleEndDate(jobDTO.getScheduleEndDate());
				schConfDto.setScheduleDailyExcludeWeekend(jobDTO.isScheduleDailyExcludeWeekend());
				schConfDto.setScheduleWeeklySunday(jobDTO.isScheduleWeeklySunday());
				schConfDto.setScheduleWeeklyMonday(jobDTO.isScheduleWeeklyMonday());
				schConfDto.setScheduleWeeklyTuesday(jobDTO.isScheduleWeeklyTuesday());
				schConfDto.setScheduleWeeklyWednesday(jobDTO.isScheduleWeeklyWednesday());
				schConfDto.setScheduleWeeklyThursday(jobDTO.isScheduleWeeklyThursday());
				schConfDto.setScheduleWeeklyFriday(jobDTO.isScheduleWeeklyFriday());
				schConfDto.setScheduleWeeklySaturday(jobDTO.isScheduleWeeklySaturday());
				schConfDto.setActive("Y");
				schedulerService.save(schConfDto,job);
			}else {
				schedulerService.deleteCurrentSchedule(jobDTO.getId());
			}
		}else {
			//delete any existing job schedule if
			//schedulerService.deleteCurrentSchedule(jobDTO.getId());
		}


		return mapperUtil.toModel(job, JobDTO.class);
	}



	private Job findJob(Long id) {
		Job job = jobRepository.findOne(id);
		if(job==null)  throw new TimesheetException("Job not found : "+id);
		return job;
	}



	public JobDTO startJob(Long id) {
		Job job = findJob(id);

		if(job.getStatus() != JobStatus.ASSIGNED){
			throw new TimesheetException("Job cannot be started, Current Status : "+job.getStatus());
		}

		job.setStatus(JobStatus.INPROGRESS);
		job.setActualStartTime(new Date());
		jobRepository.save(job);
		return mapperUtil.toModel(job, JobDTO.class);

	}

	public JobDTO completeJob(Long id, long userId) {
		User currUser = userRepository.findOne(userId);
		Hibernate.initialize(currUser.getEmployee());
		Employee currUserEmp = currUser.getEmployee();
		Job job = findJob(id);
		job.setActualStartTime(job.getPlannedStartTime());
		if(job.getStatus() != JobStatus.INPROGRESS){
			throw new TimesheetException("Job cannot be completed, Current Status : "+job.getStatus());
		}

		Date endDate = new Date();
		int totalHours = Hours.hoursBetween(new DateTime(job.getActualStartTime()),new DateTime(endDate)).getHours();
		int totalMinutes = Minutes.minutesBetween(new DateTime(job.getActualStartTime()),new DateTime(endDate)).getMinutes();
		if(totalHours > 0) {
			totalMinutes = totalMinutes % 60;
		}

		job.setStatus(JobStatus.COMPLETED);
		job.setActualEndTime(endDate);
		job.setActualHours(totalHours);
		jobRepository.save(job);
		//send notifications if a ticket is raised
		if(job.getTicket() != null) {
			Ticket ticket = job.getTicket();
			Map<String, String> data = new HashMap<String, String>();
			String ticketUrl = env.getProperty("url.ticket-view");
			data.put("url.ticket-view", ticketUrl);
			String jobUrl = env.getProperty("url.job-view");
			data.put("url.job-view", jobUrl);

			sendJobCompletionNotifications(ticket.getEmployee(), ticket.getAssignedTo(), currUserEmp, job, ticket, job.getSite(), false, data);
		}
		return mapperUtil.toModel(job, JobDTO.class);

	}

    public JobDTO saveJobAndCheckList(JobDTO jobDTO, long userId) {
        Job job = findJob(jobDTO.getId());
        mapToEntity(jobDTO, job);
        job = jobRepository.save(job);
		User currUser = userRepository.findOne(userId);
		Hibernate.initialize(currUser.getEmployee());
		Employee currUserEmp = currUser.getEmployee();

        //	send notifications if a ticket is raised
		if(job.getStatus().equals(JobStatus.COMPLETED) && job.getTicket() != null) {
			Ticket ticket = job.getTicket();
			Map<String, String> data = new HashMap<String, String>();
			String ticketUrl = env.getProperty("url.ticket-view");
			data.put("url.ticket-view", ticketUrl);
			String jobUrl = env.getProperty("url.job-view");
			data.put("url.job-view", jobUrl);

			sendJobCompletionNotifications(ticket.getEmployee(), ticket.getAssignedTo(), currUserEmp, job, ticket, job.getSite(), false, data);
		}
        return mapperUtil.toModel(job, JobDTO.class);
    }

//    @Transactional
//    public JobChecklistDTO uploadCheckListImage(JobChecklistDTO jobChecklistDTO) {
//        log.debug("JOb checklist dto - "+jobChecklistDTO.getImage_1());
//        log.debug("Employee list from check in out images"+jobChecklistDTO.getJobId());
//        String fileName = fileUploadHelper.uploadFile(jobChecklistDTO.getJobId(),jobChecklistDTO.getImage_1(), System.currentTimeMillis());
//        jobChecklistDTO.setImage_1(fileName);
//        CheckInOutImage checkInOutImage = new CheckInOutImage();
//        checkInOutImage.setPhotoOut(fileName);
//        checkInOutImage.setCheckInOut(checkInOutRepository.findOne(checkInOutImageDto.getCheckInOutId()));
//        checkInOutImage.setProject(projectRepository.findOne(checkInOutImageDto.getProjectId()));
//        checkInOutImage.setEmployee(employeeRepository.findOne(checkInOutImageDto.getEmployeeId()));
//        checkInOutImage.setSite(siteRepository.findOne(checkInOutImageDto.getSiteId()));
//        checkInOutImage.setJob(jobRepository.findOne((checkInOutImageDto.getJobId())));
//        log.debug("Before save image::::::"+checkInOutImage);
//        checkInOutImage = checkInOutImageRepository.save(checkInOutImage);
//        return checkInOutImageDto;
//    }

	public JobDTO onlyCompleteJob(Long id, long userId) {
		User currUser = userRepository.findOne(userId);
		Hibernate.initialize(currUser.getEmployee());
		Employee currUserEmp = currUser.getEmployee();

		Job job = findJob(id);
		job.setActualStartTime(job.getPlannedStartTime());
		Date endDate = new Date();
		int totalHours = Hours.hoursBetween(new DateTime(job.getActualStartTime()),new DateTime(endDate)).getHours();
		int totalMinutes = Minutes.minutesBetween(new DateTime(job.getActualStartTime()),new DateTime(endDate)).getMinutes();
		if(totalHours > 0) {
			totalMinutes = totalMinutes % 60;
		}
		job.setStatus(JobStatus.COMPLETED);
		job.setActualEndTime(endDate);
		job.setActualHours(totalHours);
		job.setActualMinutes(totalMinutes);
		jobRepository.save(job);
		//send notifications if a ticket is raised
		if(job.getTicket() != null) {
			Ticket ticket = job.getTicket();
			Map<String, String> data = new HashMap<String, String>();
			String ticketUrl = env.getProperty("url.ticket-view");
			data.put("url.ticket-view", ticketUrl);
			String jobUrl = env.getProperty("url.job-view");
			data.put("url.job-view", jobUrl);

			sendJobCompletionNotifications(ticket.getEmployee(), ticket.getAssignedTo(), currUserEmp, job, ticket, job.getSite(), false, data);
		}
		return mapperUtil.toModel(job, JobDTO.class);

	}

	public JobDTO onlyCompleteJob(Job job, long userId) {
		User currUser = userRepository.findOne(userId);
		Hibernate.initialize(currUser.getEmployee());
		Employee currUserEmp = currUser.getEmployee();

		job.setActualStartTime(job.getPlannedStartTime());
		Date endDate = new Date();
		int totalHours = Hours.hoursBetween(new DateTime(job.getActualStartTime()),new DateTime(endDate)).getHours();
		int totalMinutes = Minutes.minutesBetween(new DateTime(job.getActualStartTime()),new DateTime(endDate)).getMinutes();
		if(totalHours > 0) {
			totalMinutes = totalMinutes % 60;
		}
		job.setStatus(JobStatus.COMPLETED);
		job.setActualEndTime(endDate);
		job.setActualHours(totalHours);
		job.setActualMinutes(totalMinutes);
		jobRepository.save(job);
		//send notifications if a ticket is raised
		if(job.getTicket() != null) {
			Ticket ticket = job.getTicket();
			Map<String, String> data = new HashMap<String, String>();
			String ticketUrl = env.getProperty("url.ticket-view");
			data.put("url.ticket-view", ticketUrl);
			String jobUrl = env.getProperty("url.job-view");
			data.put("url.job-view", jobUrl);
			sendJobCompletionNotifications(ticket.getEmployee(), ticket.getAssignedTo(), currUserEmp, job, ticket, job.getSite(), false, data);
		}
		return mapperUtil.toModel(job, JobDTO.class);

	}

	public void saveNotificationLog(long jobId, long fromUserId, List<User> toUsers, long siteId, String message) {
		User fromUser = userRepository.findOne(fromUserId);
		Site site = siteRepository.findOne(siteId);
		Job job = jobRepository.findOne(jobId);
		for(User toUser : toUsers) {
			NotificationLog notifyLog = new NotificationLog();
			notifyLog.setJob(job);
			notifyLog.setFromUser(fromUser);
			notifyLog.setToUser(toUser);
			notifyLog.setSite(site);
			notifyLog.setMessage(message);
			notifyLog.setRead(false);
			notificationRepository.save(notifyLog);
		}
	}

	public NotificationLogDTO updateNotificationLog(NotificationLogDTO notifyLogDto) {
		NotificationLog notifyLog = notificationRepository.findByJobIdFromUserAndToUser(notifyLogDto.getId(), notifyLogDto.getFromUserId(), notifyLogDto.getToUserId());
		notifyLog.setRead(notifyLogDto.isRead());
		notifyLog = notificationRepository.saveAndFlush(notifyLog);
		return mapperUtil.toModel(notifyLog, NotificationLogDTO.class);
	}

	public List<NotificationLogDTO> getAllNotifications(long userId) {
		Pageable pageRequest = new PageRequest(0, 10);
		Page<NotificationLog> result =  notificationRepository.findAllByToUserId(userId, pageRequest);
		List<NotificationLog> notifyLogs = result.getContent();
		for(NotificationLog nlog : notifyLogs) {
			log.debug("Notification log - jobid -"+nlog.getJob().getId() + ", fromuserid-" + nlog.getFromUser().getId() + ", touserid-"+ nlog.getToUser().getId());
		}
		List<NotificationLogDTO> notifyLogDtos = null;
		if(CollectionUtils.isNotEmpty(notifyLogs)) {
			notifyLogDtos = mapperUtil.toModelList(notifyLogs, NotificationLogDTO.class);
		}
		return notifyLogDtos;
	}

    //Asset
    public AssetDTO saveAsset(AssetDTO assetDTO) {
        log.debug("assets service in job services");
        Asset asset = new Asset();
        Site site = getSite(assetDTO.getSiteId());
        asset.setTitle(assetDTO.getTitle());
        asset.setDescription(assetDTO.getDescription());
        asset.setSite(site);
        asset.setCode(assetDTO.getCode());
        asset.setEndTime(assetDTO.getEndTime());
        asset.setStartTime(assetDTO.getStartTime());
        asset.setUdsAsset(assetDTO.isUdsAsset());


        List<Asset> existingAssets = assetRepository.findAssetByTitle(assetDTO.getTitle());
        log.debug("Existing asset -"+ existingAssets);
        if(CollectionUtils.isEmpty(existingAssets)) {
            asset = assetRepository.save(asset);
        }

        return mapperUtil.toModel(asset, AssetDTO.class);
    }

    public List<AssetDTO> findAllAssets(){
        log.debug("get all assets");
        List<Asset> assets = assetRepository.findAll();
        List<AssetDTO> assetDto = new ArrayList<>();
        for(Asset loc: assets){
            AssetDTO dto = new AssetDTO();
            Long siteId = loc.getSite().getId();
            Site site = getSite(siteId);
            dto.setId(loc.getId());
            dto.setTitle(loc.getTitle());
            dto.setSiteId(site.getId());
            dto.setSiteName(site.getName());
            dto.setStartTime(loc.getStartTime());
            dto.setEndTime(loc.getEndTime());
            dto.setUdsAsset(loc.isUdsAsset());
            dto.setCode(loc.getCode());
            dto.setDescription(loc.getDescription());
            assetDto.add(dto);
        }
        return assetDto;
    }

//    public SearchResult<AssetDTO> getSiteAssets(Long siteId,int	 page) {
//        Pageable pageRequest = new PageRequest(page, PagingUtil.PAGE_SIZE, new Sort(Direction.DESC,"id"));
//
//        Page<Asset> assets= assetRepository.findBySiteId(siteId,pageRequest);
//        SearchResult<AssetDTO> paginatedAssets = new SearchResult<>();
//        paginatedAssets.setCurrPage(page);
//        paginatedAssets.setTransactions(mapperUtil.toModelList(assets.getContent(), AssetDTO.class));
//        paginatedAssets.setTotalCount(assets.getTotalElements());
//        paginatedAssets.setTotalPages(assets.getTotalPages());
//        return paginatedAssets;
//    }

    public List<AssetDTO> getSiteAssets(Long AssetSiteId){
        log.debug("get site assets");
        List<Asset> assets = assetRepository.findBySiteId(AssetSiteId);
        List<AssetDTO> assetDto = new ArrayList<>();
        for(Asset loc: assets){
            AssetDTO dto = new AssetDTO();
            Long siteId = loc.getSite().getId();
            Site site = getSite(siteId);
            dto.setId(loc.getId());
            dto.setTitle(loc.getTitle());
            dto.setSiteId(site.getId());
            dto.setSiteName(site.getName());
            dto.setStartTime(loc.getStartTime());
            dto.setEndTime(loc.getEndTime());
            dto.setUdsAsset(loc.isUdsAsset());
            dto.setCode(loc.getCode());
            dto.setDescription(loc.getDescription());
            assetDto.add(dto);
        }
        return assetDto;
    }

    public Asset getAsset(long id){
        Asset asset = assetRepository.findOne(id);
        return asset;
    }

    public Ticket getTicket(long id){
        Ticket ticket= ticketRepository.findOne(id);
        return ticket;
    }



    public AssetDTO getAssetDTO(long id){
        Asset asset = assetRepository.findOne(id);
        AssetDTO assetDTO = mapperUtil.toModel(asset,AssetDTO.class);
        Site site = getSite(assetDTO.getSiteId());
        assetDTO.setActive(asset.getActive());
        assetDTO.setSiteId(assetDTO.getSiteId());
        assetDTO.setSiteName(assetDTO.getSiteName());
        assetDTO.setTitle(asset.getTitle());
        assetDTO.setCode(asset.getCode());
        assetDTO.setDescription(asset.getDescription());
        assetDTO.setUdsAsset(asset.isUdsAsset());
        assetDTO.setStartTime(asset.getStartTime());
        assetDTO.setEndTime(asset.getEndTime());
        return assetDTO;
    }

    public AssetDTO getAssetByCode(String code){
        Asset asset = assetRepository.findByCode(code);
        AssetDTO assetDTO = mapperUtil.toModel(asset,AssetDTO.class);
        Site site = getSite(assetDTO.getSiteId());
        assetDTO.setActive(asset.getActive());
        assetDTO.setSiteId(assetDTO.getSiteId());
        assetDTO.setSiteName(assetDTO.getSiteName());
        assetDTO.setTitle(asset.getTitle());
        assetDTO.setCode(asset.getCode());
        assetDTO.setDescription(asset.getDescription());
        assetDTO.setUdsAsset(asset.isUdsAsset());
        assetDTO.setStartTime(asset.getStartTime());
        assetDTO.setEndTime(asset.getEndTime());
        return assetDTO;
    }


    private void mapToEntityAssets(AssetDTO assetDTO, Asset asset) {
        Site site = getSite(assetDTO.getSiteId());


        asset.setTitle(assetDTO.getTitle());
        asset.setDescription(assetDTO.getDescription());
        asset.setCode(assetDTO.getCode());
        asset.setStartTime(assetDTO.getStartTime());
        asset.setEndTime(assetDTO.getEndTime());
        asset.setUdsAsset(assetDTO.isUdsAsset());
        asset.setSite(site);

    }

    public AssetDTO updateAsset(AssetDTO assetDTO) {
        Asset asset = assetRepository.findOne(assetDTO.getId());
        mapToEntityAssets(assetDTO, asset);
        asset = assetRepository.save(asset);

        return mapperUtil.toModel(asset, AssetDTO.class);
    }

    public String generateAssetQRCode(long assetId) {
        Asset asset= assetRepository.findOne(assetId);
        byte[] qrCodeImage = null;
        String qrCodeBase64 = null;
        if(asset != null) {
            String code = String.valueOf(asset.getCode());
            qrCodeImage = QRCodeUtil.generateQRCode(code);
            String qrCodePath = env.getProperty("qrcode.file.path");
            String imageFileName = null;
            if(org.apache.commons.lang3.StringUtils.isNotEmpty(qrCodePath)) {
                imageFileName = fileUploadHelper.uploadQrCodeFile(code, qrCodeImage);
                asset.setQrCodeImage(imageFileName);
                assetRepository.save(asset);
            }
            if(qrCodeImage != null && org.apache.commons.lang3.StringUtils.isNotBlank(imageFileName)) {
                qrCodeBase64 = fileUploadHelper.readQrCodeFile(imageFileName);
            }
        }
        return qrCodeBase64;
    }

    public List<PriceDTO> findAllPrices(){
        log.debug("get all Prices");
        List<Price> prices = priceRepository.findAll();
        List<PriceDTO> locationDto = new ArrayList<>();
        for(Price loc: prices){
            PriceDTO dto = new PriceDTO();
            dto.setId(loc.getId());
            dto.setName(loc.getName());
            dto.setAmount(loc.getAmount());
            dto.setSiteId(loc.getSite().getId());
            locationDto.add(dto);
            log.debug("sites"+dto.getName()+" " +dto.getAmount()+" "+dto.getSiteId()+" "+loc.getSite().getId());

        }
        return locationDto;
    }

    public List<PriceDTO> findBySiteId(long siteId) {
        List<Price> entities = null;
            entities = priceRepository.findBySiteId(siteId);

        return mapperUtil.toModelList(entities, PriceDTO.class);
    }

    public List<JobDTO> findByDate(SearchCriteria searchCriteria, boolean isAdmin) {
        List<JobDTO> result = null;
        if(searchCriteria != null) {
            log.debug("findBYSearchCriteria search criteria -"+ (searchCriteria.getCheckInDateTimeFrom()));

            Employee employee = employeeRepository.findByUserId(searchCriteria.getUserId());
            List<Long> subEmpIds = new ArrayList<Long>();
            if(employee != null) {
                searchCriteria.setDesignation(employee.getDesignation());
                Hibernate.initialize(employee.getSubOrdinates());
                findAllSubordinates(employee, subEmpIds);
                log.debug("List of subordinate ids -"+ subEmpIds);
                if(CollectionUtils.isEmpty(subEmpIds)) {
                    subEmpIds.add(employee.getId());
                }
                searchCriteria.setSubordinateIds(subEmpIds);
            }
            log.debug("SearchCriteria ="+ searchCriteria);

            List<Job> allJobsList = new ArrayList<Job>();
            List<JobDTO> transactions = null;

            Date checkInDate = searchCriteria.getCheckInDateTimeFrom();
            log.debug("JobSpecification toPredicate - searchCriteria checkInDateFrom -"+ checkInDate);
            if(checkInDate != null) {
                log.debug("check in date is not null");
                Calendar checkInDateFrom = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
                checkInDateFrom.setTime(checkInDate);

                checkInDateFrom.set(Calendar.HOUR_OF_DAY, 0);
                checkInDateFrom.set(Calendar.MINUTE,0);
                checkInDateFrom.set(Calendar.SECOND,0);
                java.sql.Date fromDt = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(checkInDateFrom));
                //String fromDt = DateUtil.formatUTCToIST(checkInDateFrom);
                Calendar checkInDateTo = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
                checkInDateTo.setTime(checkInDate);

                checkInDateTo.set(Calendar.HOUR_OF_DAY, 23);
                checkInDateTo.set(Calendar.MINUTE,59);
                checkInDateTo.set(Calendar.SECOND,0);
                java.sql.Date toDt = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(checkInDateTo));

//				page = jobRepository.findByDateRange(searchCriteria.getSiteId(), searchCriteria.getUserId(), subEmpIds, searchCriteria.getJobStatus(),
//												fromDt, toDt, searchCriteria.isScheduled(), pageRequest);

	    			Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
	    			//Pageable pageRequest = new PageRequest(searchCriteria.getCurrPage(), PagingUtil.PAGE_SIZE, new Sort(Direction.DESC,"id"));
	    			Page<Job> page = null;

                page = jobRepository.findByDateRange(searchCriteria.getUserId(),subEmpIds,fromDt,toDt, pageRequest);
                allJobsList.addAll(page.getContent());
                if(CollectionUtils.isNotEmpty(allJobsList)) {
                		if(result == null) {
                			result = new ArrayList<JobDTO>();
                		}
                		for(Job job : allJobsList) {
                			result.add(mapToModel(job));
                		}
                }
                return result;


            }else {

                allJobsList = jobRepository.findWithoutDateRange(searchCriteria.getUserId(),subEmpIds);
                result = mapperUtil.toModelList(allJobsList,JobDTO.class);
                return result;
            }



        }
        return result;
    }


    public List<Job> assignReliever(EmployeeDTO employee, EmployeeDTO reliever, Date startDate, Date endDate) {

        Calendar checkInDateFrom = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
        checkInDateFrom.setTime(startDate);

        checkInDateFrom.set(Calendar.HOUR_OF_DAY, 0);
        checkInDateFrom.set(Calendar.MINUTE,0);
        checkInDateFrom.set(Calendar.SECOND,0);
        java.sql.Date fromDt = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(checkInDateFrom));

        Calendar checkInDateTo = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
        checkInDateFrom.setTime(endDate);

        checkInDateTo.set(Calendar.HOUR_OF_DAY, 0);
        checkInDateTo.set(Calendar.MINUTE,0);
        checkInDateTo.set(Calendar.SECOND,0);
        java.sql.Date toDt = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(checkInDateFrom));

        List<Job> allJobsList = new ArrayList<Job>();

        allJobsList= jobRepository.findByDateRangeAndEmployee(employee.getId(), fromDt, toDt);
        Employee relieverDetails = mapperUtil.toEntity(reliever,Employee.class);
        for(Job job: allJobsList){
            job.setRelieved(true);
            job.setReliever(relieverDetails);
            job = jobRepository.save(job);
        }

        return allJobsList;
    }

    public void assignJobsForDifferentEmployee(EmployeeDTO employee, EmployeeDTO reliever,Date fromDate){
        Calendar checkInDateFrom = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
        checkInDateFrom.setTime(fromDate);

        checkInDateFrom.set(Calendar.HOUR_OF_DAY, 0);
        checkInDateFrom.set(Calendar.MINUTE,0);
        checkInDateFrom.set(Calendar.SECOND,0);
        java.sql.Date fromDt = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(checkInDateFrom));

        List<Job> allJobsList = new ArrayList<Job>();

        allJobsList= jobRepository.findByStartDateAndEmployee(employee.getId(), fromDt);
        Employee relieverDetails = mapperUtil.toEntity(reliever,Employee.class);
        for(Job job: allJobsList){
            job.setEmployee(relieverDetails);
            job = jobRepository.save(job);
        }
    }

    public void deleteJobsForEmployee(EmployeeDTO employee, Date fromDate){

        Calendar checkInDateFrom = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
        checkInDateFrom.setTime(fromDate);

        checkInDateFrom.set(Calendar.HOUR_OF_DAY, 0);
        checkInDateFrom.set(Calendar.MINUTE,0);
        checkInDateFrom.set(Calendar.SECOND,0);
        java.sql.Date fromDt = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(checkInDateFrom));

        List<Job> jobList = new ArrayList<Job>();
        jobList = jobRepository.findByStartDateAndEmployee(employee.getId(),fromDt);
        if(CollectionUtils.isNotEmpty(jobList)) {
        		for(Job job : jobList) {
        			job.getChecklistItems().clear();
        			jobRepository.saveAndFlush(job);
        		}
        }
        jobRepository.deleteInBatch(jobList);


    }

    public ExportResult generateReport(List<JobDTO> transactions, SearchCriteria criteria) {
        //return exportUtil.writeJobReportToFile(transactions, null, null);
        //log.debug("REPORT GENERATION PROCESSING HERE ***********");
        //log.debug("CRIITERIA *******"+criteria+"TRANSACTION *********"+transactions);

        return reportUtil.generateJobReports(transactions, null, null, criteria);
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

	public ImportResult importFile(MultipartFile file, long dateTime) {
		return importUtil.importJobData(file, dateTime);
	}

	public ImportResult getImportStatus(String fileId) {
		ImportResult er = new ImportResult();
		//fileId += ".csv";
		if(!StringUtils.isEmpty(fileId)) {
			String status = importUtil.getImportStatus(fileId);
			er.setFile(fileId);
			er.setStatus(status);
		}
		return er;
	}
}
