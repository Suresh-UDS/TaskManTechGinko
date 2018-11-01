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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.google.api.client.repackaged.org.apache.commons.codec.binary.Base64;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Asset;
import com.ts.app.domain.CheckInOut;
import com.ts.app.domain.CheckInOutImage;
import com.ts.app.domain.Checklist;
import com.ts.app.domain.ChecklistItem;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.Frequency;
import com.ts.app.domain.Job;
import com.ts.app.domain.JobChecklist;
import com.ts.app.domain.JobStatus;
import com.ts.app.domain.JobType;
import com.ts.app.domain.Location;
import com.ts.app.domain.NotificationLog;
import com.ts.app.domain.Price;
import com.ts.app.domain.Project;
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
import com.ts.app.repository.ChecklistRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.JobChecklistRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.JobSpecification;
import com.ts.app.repository.LocationRepository;
import com.ts.app.repository.NotificationRepository;
import com.ts.app.repository.PricingRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.TicketRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.AmazonS3Utils;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.FileUploadHelper;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.PagingUtil;
import com.ts.app.service.util.ReportUtil;
import com.ts.app.web.rest.dto.AssetAMCScheduleDTO;
import com.ts.app.web.rest.dto.AssetPpmScheduleDTO;
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
    private TicketRepository ticketRepository;

    @Inject
	private EmployeeRepository employeeRepository;

    @Inject
    private LocationRepository locationRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private ProjectRepository projectRepository;

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
    private AssetRepository assetRepository;

    @Inject
    private AmazonS3Utils amazonS3utils;

    @Value("${AWS.s3-cloudfront-url}")
    private String cloudFrontUrl;

    @Value("${AWS.s3-bucketEnv}")
    private String bucketEnv;

    @Value("${AWS.s3-checklist-path}")
    private String checkListpath;

    @Value("${AWS.s3-checkinout-path}")
    private String checkInOutImagePath;

    @Inject
    private PushService pushService;

    @Inject
    private ChecklistRepository checkListRepository;

    @Inject
    private JobChecklistRepository jobChecklistRepository;


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
				int levelCnt = 1;
				findAllSubordinates(employee, subEmpIds, levelCnt);
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
                if(searchCriteria.isReport()) {
                		pageRequest = createPageSort(searchCriteria.getCurrPage(), Integer.MAX_VALUE, sort);
                }else {
                		pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);
                }

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

                                }else if(!StringUtils.isEmpty(searchCriteria.getJobStatus())){
                                    page = jobRepository.findByEmployeeAndStatus(searchCriteria.getSiteId(), searchCriteria.getEmployeeId(), searchCriteria.getJobStatus(), fromDt, toDt, pageRequest);
                                }else{
                                    page = jobRepository.findByStartDateSiteAndEmployee(searchCriteria.getSiteId(), searchCriteria.getEmployeeId(), fromDt, toDt, pageRequest);

                                }
		            		}else if(searchCriteria.getSiteId() > 0 && searchCriteria.getEmployeeId() == 0) {
		            		    if(searchCriteria.getLocationId()>0){
                                    page = jobRepository.findByStartDateAndSiteAndLocation(searchCriteria.getSiteId(),searchCriteria.getLocationId(), fromDt, toDt, pageRequest);

                                }else if (org.apache.commons.lang3.StringUtils.isNotEmpty(searchCriteria.getBlock())){
		            		        		page = jobRepository.findAll(new JobSpecification(searchCriteria,isAdmin),pageRequest);
                                }else if(!StringUtils.isEmpty(searchCriteria.getJobStatus())){
                                    page = jobRepository.findByStartDateAndStatus(searchCriteria.getSiteId(), searchCriteria.getJobStatus(), fromDt, toDt, pageRequest);
                                }else {
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
                                }else if(!StringUtils.isEmpty(searchCriteria.getJobStatus())){
                                    page = jobRepository.findByEmployeeAndStatus(searchCriteria.getSiteId(), searchCriteria.getEmployeeId(), searchCriteria.getJobStatus(), fromDt, toDt, pageRequest);
                                }else{
                                    page = jobRepository.findByStartDateSiteAndEmployee(searchCriteria.getSiteId(), searchCriteria.getEmployeeId(), fromDt, toDt, pageRequest);

                                }
		            		}else if(searchCriteria.getSiteId() > 0 && searchCriteria.getEmployeeId() == 0) {
                                if(searchCriteria.getLocationId()>0){
                                    page = jobRepository.findByStartDateAndSiteAndLocation(searchCriteria.getSiteId(),searchCriteria.getLocationId(), fromDt, toDt, pageRequest);

                                }else if (org.apache.commons.lang3.StringUtils.isNotEmpty(searchCriteria.getBlock())){
                                    page = jobRepository.findAll(new JobSpecification(searchCriteria,isAdmin),pageRequest);
                                }else if(!StringUtils.isEmpty(searchCriteria.getJobStatus())){
                                    page = jobRepository.findByStartDateAndStatus(searchCriteria.getSiteId(), searchCriteria.getJobStatus(), fromDt, toDt, pageRequest);
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
		            		//}else if(searchCriteria.getAssetId() > 0) {
		            		//	page = jobRepository.findAll(new JobSpecification(searchCriteria,isAdmin),pageRequest);
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
	        			if(log.isDebugEnabled()) {
	        				log.debug("Asset id in job search criteria " + searchCriteria.getAssetId());
	        			}
	        			page = jobRepository.findAll(new JobSpecification(searchCriteria,isAdmin),pageRequest);
	        			if(searchCriteria.getAssetId() == 0 && CollectionUtils.isEmpty(page.getContent())) {
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
        			transactions.add(mapToModel(job, searchCriteria.isReport()));
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
					int levelCnt = 1;
					findAllSubordinates(employee, subEmpIds, levelCnt);
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
		        		if(CollectionUtils.isEmpty(allSites)) {
		        			allSites = new ArrayList<Site>();
		        			if(searchCriteria.getSiteId() > 0) {
		        				allSites.add(siteRepository.findOne(searchCriteria.getSiteId()));
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
	
	public List<JobDTO> generateReport(SearchCriteria searchCriteria, boolean isAdmin) {
		List<JobDTO> transactions = null;
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
					int levelCnt = 1;
					findAllSubordinates(employee, subEmpIds, levelCnt);
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
		        	if(searchCriteria.getCheckInDateTimeTo() != null) {
		        		checkInDateTo.setTime(searchCriteria.getCheckInDateTimeTo());
		        	}else {
		        		checkInDateTo.setTime(checkInDate);
		        	}

		        	checkInDateTo.set(Calendar.HOUR_OF_DAY, 23);
		        	checkInDateTo.set(Calendar.MINUTE,59);
		        	checkInDateTo.set(Calendar.SECOND,0);
		        	java.sql.Date toDt = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(checkInDateTo));
		  
		        	allJobsList = jobRepository.findByStartDateAndSiteReport(searchCriteria.getSiteId(), fromDt, toDt);
//		        	allJobsList.addAll(page.getContent());
		        	if(CollectionUtils.isNotEmpty(allJobsList)) {
		        		if(transactions == null) {
		    				transactions = new ArrayList<JobDTO>();
		    			}
		        		for(Job jobList : allJobsList) {
		        			transactions.add(mapperUtil.toModel(jobList, JobDTO.class));
		        		}
		        	} 	
	        	}
        		
			}
		return transactions;
		
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
                int levelCnt = 1;
                findAllSubordinates(employee, subEmpIds, levelCnt);
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
	            			transactions.add(mapToModel(job, false));
	            		}
            		}
                if(CollectionUtils.isNotEmpty(transactions)) {
                    buildSearchResult(searchCriteria, page, transactions,result);
                }
            }

        }
        return result;
    }

	public List<Long> findAllSubordinates(Employee employee, List<Long> subEmpIds, int levelCnt) {
		if(levelCnt > 5 ) {
			return subEmpIds;
		}
		Set<Employee> subs = employee.getSubOrdinates();
		//log.debug("List of subordinates -"+ subs);
		if(subs == null){
			subEmpIds = new ArrayList<Long>();
		}
		for(Employee sub : subs) {
			subEmpIds.add(sub.getId());
			Hibernate.initialize(sub.getSubOrdinates());
			if(CollectionUtils.isNotEmpty(sub.getSubOrdinates())){
				levelCnt++;
				findAllSubordinates(sub, subEmpIds, levelCnt);
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
	
	@Transactional(propagation=Propagation.REQUIRES_NEW)
	public void saveScheduledJob(List<JobDTO> jobDTOs) {
		if(CollectionUtils.isNotEmpty(jobDTOs)) {
			List<Job> jobs = new ArrayList<Job>();
			for(JobDTO jobDTO : jobDTOs) {
				Job job = new Job();
	
				mapToEntity(jobDTO, job);
	
				if(job.getStatus() == null) {
					job.setStatus(JobStatus.ASSIGNED);
				}
				
				if(jobDTO.getParentJobId()>0){
				    Job parentJob = jobRepository.findOne(jobDTO.getParentJobId());
				    job.setParentJob(parentJob);
		        }
				jobs.add(job);
			}
			jobRepository.save(jobs);
		}
	}
	
	public JobDTO saveScheduledJob(JobDTO jobDTO) {
		Job job = new Job();

		jobDTO = validate(jobDTO, job);

		if(!StringUtils.isEmpty(jobDTO.getErrorMessage())) {
			return jobDTO;
		}

		mapToEntity(jobDTO, job);


		if(job.getStatus() == null) {
			job.setStatus(JobStatus.ASSIGNED);
		}
		
		if(jobDTO.getParentJobId()>0){
		    Job parentJob = jobRepository.findOne(jobDTO.getParentJobId());
		    job.setParentJob(parentJob);
        }
		Job newScheduledJob = jobRepository.saveAndFlush(job);
		
		return mapperUtil.toModel(job, JobDTO.class);
	}

	public JobDTO saveJob(JobDTO jobDTO) {

		Job job = new Job();

		jobDTO = validate(jobDTO, job);

		if(!StringUtils.isEmpty(jobDTO.getErrorMessage())) {
			return jobDTO;
		}

		mapToEntity(jobDTO, job);


		if(job.getStatus() == null) {
			job.setStatus(JobStatus.ASSIGNED);
		}

		if(job.getSchedule().equalsIgnoreCase("ONCE")) {
			Calendar startTime = Calendar.getInstance();
			startTime.setTime(job.getPlannedStartTime());
			Calendar today = Calendar.getInstance();
			today.set(Calendar.HOUR_OF_DAY, 0);
			today.set(Calendar.MINUTE,0);
			today.set(Calendar.SECOND,0);
			if(startTime.before(today)) { // for one time jobs if the planned start time is before today job should not be created
				jobDTO.setErrorMessage("Job start time cannot be earlier than current day");
				return jobDTO;
			}

		}else {
			Calendar startTime = Calendar.getInstance();
			startTime.setTime(job.getPlannedStartTime());
			Calendar today = Calendar.getInstance();
			today.set(Calendar.HOUR_OF_DAY, 0);
			today.set(Calendar.MINUTE,0);
			today.set(Calendar.SECOND,0);
			if(startTime.before(today)) { // if the planned start time is before today then the start time to be set to today.
				startTime.set(Calendar.YEAR, today.get(Calendar.YEAR));
				startTime.set(Calendar.MONTH, today.get(Calendar.MONTH));
				startTime.set(Calendar.DAY_OF_MONTH, today.get(Calendar.DAY_OF_MONTH));
				job.setPlannedStartTime(startTime.getTime());
			}
		}
		/*
		Calendar calStart = Calendar.getInstance();
		calStart.set(Calendar.HOUR_OF_DAY, 0);
		calStart.set(Calendar.MINUTE,0);
		Calendar calEnd = Calendar.getInstance();
		calEnd.set(Calendar.HOUR_OF_DAY, 11);
		calEnd.set(Calendar.MINUTE,59);

		job.setMaintenanceType(jobDTO.getMaintenanceType());

		java.sql.Date startDate = new java.sql.Date(calStart.getTimeInMillis());
		java.sql.Date endDate = new java.sql.Date(calEnd.getTimeInMillis());
		*/
		log.debug("Before saving new job -"+ job);
//		job.setActive(Job.ACTIVE_YES);
		//log.debug("start Date  -"+ startDate + ", end date -" + endDate);
		List<Job> existingJobs = null;
		if(job.getSchedule().equalsIgnoreCase("ONCE")) {
			existingJobs = jobRepository.findChildJobByTitleSiteDateAndLocation(jobDTO.getTitle(), jobDTO.getSiteId(), DateUtil.convertToSQLDate(job.getPlannedStartTime()), DateUtil.convertToSQLDate(job.getPlannedEndTime()), job.getBlock(), job.getFloor(), job.getZone());
		}else {
			existingJobs = jobRepository.findParentJobByTitleSiteDateAndLocation(jobDTO.getTitle(), jobDTO.getSiteId(), DateUtil.convertToSQLDate(job.getPlannedStartTime()), DateUtil.convertToSQLDate(job.getPlannedEndTime()), job.getBlock(), job.getFloor(), job.getZone());
		}
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
			data.append("&frequency="+ (StringUtils.isEmpty(jobDTO.getFrequency()) ? "" : jobDTO.getFrequency()));
			data.append("&duration="+(StringUtils.isEmpty(jobDTO.getDuration()) ? "1" : jobDTO.getDuration()));
			schConfDto.setData(data.toString());
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


	public ResponseEntity<?> createJob(AssetPpmScheduleDTO assetPpmScheduleDTO) {
		log.debug(">>> assetPpmSchedule Title from CreateJOb <<<"+assetPpmScheduleDTO.getTitle()+" Employee Id "+assetPpmScheduleDTO.getEmpId());

		Job job = new Job();
		Site site = null;

		Employee employee = employeeRepository.findOne(assetPpmScheduleDTO.getEmpId());
		Asset asset = null;
		if(assetPpmScheduleDTO.getAssetId() > 0) {
			asset = assetRepository.findOne(assetPpmScheduleDTO.getAssetId());
			job.setAsset(asset);
			site = getSite(asset.getSite().getId());
		}

		if(job.getStatus() == null) {
			job.setStatus(JobStatus.OPEN);
		}

//		Calendar calStart = Calendar.getInstance();
//		calStart.set(Calendar.HOUR_OF_DAY, 0);
//		calStart.set(Calendar.MINUTE,0);
//		Calendar calEnd = Calendar.getInstance();
//		calEnd.set(Calendar.HOUR_OF_DAY, 11);
//		calEnd.set(Calendar.MINUTE,59);

		//java.sql.Date startDate = new java.sql.Date(calStart.getTimeInMillis());
		//java.sql.Date endDate = new java.sql.Date(calEnd.getTimeInMillis());
		log.debug("Before saving new job -"+ job);
		//log.debug("start Date  -"+ startDate + ", end date -" + endDate);

		job.setEmployee(employee);
		if(employee != null) {
			job.setStatus(JobStatus.ASSIGNED);
		}
		job.setSite(site);
		job.setBlock(asset.getBlock());
		job.setFloor(asset.getFloor());
		job.setZone(asset.getZone());
		Calendar jobStartTime = Calendar.getInstance();
		jobStartTime.setTimeInMillis(assetPpmScheduleDTO.getJobStartTime().toInstant().toEpochMilli());

		Calendar startTime = Calendar.getInstance();
		startTime.setTime(assetPpmScheduleDTO.getStartDate());
		startTime.set(Calendar.HOUR_OF_DAY, jobStartTime.get(Calendar.HOUR_OF_DAY));
		startTime.set(Calendar.MINUTE, jobStartTime.get(Calendar.MINUTE));
		startTime.getTime();

		Calendar plannedEndTime = Calendar.getInstance();
		plannedEndTime.setTime(jobStartTime.getTime());
		plannedEndTime.add(Calendar.HOUR_OF_DAY, assetPpmScheduleDTO.getPlannedHours());
		plannedEndTime.getTime();

		Calendar scheduleEndDateTime = Calendar.getInstance();
		scheduleEndDateTime.setTime(assetPpmScheduleDTO.getEndDate());
		scheduleEndDateTime.set(Calendar.HOUR_OF_DAY, 23);
		scheduleEndDateTime.set(Calendar.MINUTE, 59);
		scheduleEndDateTime.getTime();

		job.setPlannedStartTime(startTime.getTime());
		job.setPlannedEndTime(plannedEndTime.getTime());
		job.setScheduleEndDate(scheduleEndDateTime.getTime());
		log.debug("**** job dates **** " + startTime.getTime() + " " + plannedEndTime.getTime() + " " + scheduleEndDateTime.getTime());
		job.setTitle(assetPpmScheduleDTO.getTitle());
		job.setDescription(assetPpmScheduleDTO.getTitle() +" "+ assetPpmScheduleDTO.getFrequencyPrefix()+" "+assetPpmScheduleDTO.getFrequencyDuration()+" "+assetPpmScheduleDTO.getFrequency());
		job.setMaintenanceType(assetPpmScheduleDTO.getMaintenanceType());
		job.setSchedule(Frequency.valueOf(assetPpmScheduleDTO.getFrequency()).getValue());
		job.setActive(AbstractAuditingEntity.ACTIVE_YES);
		job.setEscalationStatus(0);
		job.setType(JobType.MAINTENANCE);
		job.setPlannedHours(assetPpmScheduleDTO.getPlannedHours());
		if(assetPpmScheduleDTO.getChecklistId() > 0)
		{
			Checklist checkList = checkListRepository.findOne(assetPpmScheduleDTO.getChecklistId());
			Set<ChecklistItem> checkListItemset = checkList.getItems();
			List<JobChecklist> jobCheckLists = new ArrayList<JobChecklist>();
			for(ChecklistItem checkListItem : checkListItemset)
			{
			JobChecklist jobChecklist = new JobChecklist();
			jobChecklist.setChecklistId(String.valueOf(checkList.getId()));
			jobChecklist.setChecklistName(checkList.getName());
			jobChecklist.setChecklistItemId(String.valueOf(checkListItem.getId()));
			jobChecklist.setChecklistItemName(checkListItem.getName());
			jobChecklist.setJob(job);
			jobCheckLists.add(jobChecklist);
			}
			job.setChecklistItems(jobCheckLists);
		}
		job = jobRepository.save(job);

		log.debug(">>> After Save Job: <<<"+job.getId());

		//if the job is scheduled for recurrence create a scheduled task
		log.debug(">>> ID <<< "+assetPpmScheduleDTO.getId());
		if(!StringUtils.isEmpty(assetPpmScheduleDTO.getId())) {
			log.debug(">>> Scheduler Service <<<");
			SchedulerConfigDTO schConfDto = new SchedulerConfigDTO();
			//schConfDto.setSchedule(jobDTO.getSchedule());
			schConfDto.setType("CREATE_JOB");
			StringBuffer data = new StringBuffer();
			data.append("title="+assetPpmScheduleDTO.getTitle());
			data.append("&description="+assetPpmScheduleDTO.getFrequencyPrefix()+" "+assetPpmScheduleDTO.getFrequencyDuration()+" "+assetPpmScheduleDTO.getFrequency());
			data.append("&siteId="+site.getId());
			data.append("&empId="+employee.getId());
			//data.append("&empId="+assetPpmScheduleDTO.getEmployeeId());
			data.append("&plannedStartTime="+startTime.getTime());
			data.append("&plannedEndTime="+plannedEndTime.getTime());
			data.append("&plannedHours="+assetPpmScheduleDTO.getPlannedHours());
			//data.append("&location="+assetPpmScheduleDTO.getLocationId());
			//data.append("&frequency="+assetPpmScheduleDTO.getFrequency());
			data.append("&duration="+assetPpmScheduleDTO.getFrequencyDuration());
			data.append("&assetId="+assetPpmScheduleDTO.getAssetId());
			//data.append("&schedule="+Frequency.valueOf(assetPpmScheduleDTO.getFrequency()).getTypeFrequency());
			schConfDto.setData(data.toString());
			schConfDto.setSchedule(Frequency.valueOf(assetPpmScheduleDTO.getFrequency()).getValue());
			schConfDto.setStartDate(assetPpmScheduleDTO.getStartDate());
			schConfDto.setEndDate(assetPpmScheduleDTO.getEndDate());
			schConfDto.setScheduleEndDate(assetPpmScheduleDTO.getEndDate());
			schConfDto.setAssetId(assetPpmScheduleDTO.getAssetId());

			schedulerService.save(schConfDto,job);
		}

		JobDTO jobDto = mapperUtil.toModel(job, JobDTO.class);

		return new ResponseEntity<>(jobDto, HttpStatus.CREATED);
	}
	private JobDTO mapToModel(Job job, boolean isReport) {
		JobDTO dto = new JobDTO();
		dto.setId(job.getId());
		dto.setTitle(job.getTitle());
		if(job.getAsset() != null) {
			dto.setAssetId(job.getAsset().getId());
		}
		dto.setBlock(job.getBlock());
		dto.setFloor(job.getFloor());
		dto.setZone(job.getZone());
		dto.setSiteId(job.getSite().getId());
		dto.setSiteName(job.getSite().getName());
		dto.setSiteProjectId(String.valueOf(job.getSite().getProject().getId()));
		dto.setSiteProjectName(job.getSite().getProject().getName());
		dto.setDescription(job.getDescription());
		dto.setJobStatus(job.getStatus());
		dto.setStatus(job.getStatus().name());
		dto.setEmployeeId(job.getEmployee().getId());
		dto.setEmployeeName(job.getEmployee().getName());
		dto.setPlannedStartTime(job.getPlannedStartTime());
		dto.setPlannedEndTime(job.getPlannedEndTime());
		dto.setPlannedHours(job.getPlannedHours());
		dto.setActualStartTime(job.getActualStartTime());
		dto.setActualEndTime(job.getActualEndTime());
		dto.setActualHours(job.getActualHours());
		dto.setActualMinutes(job.getActualMinutes());
		dto.setMaintenanceType(job.getMaintenanceType());
		dto.setSchedule(job.getSchedule());
		dto.setScheduled(job.isScheduled());
		dto.setScheduleEndDate(job.getScheduleEndDate());
		dto.setJobType(job.getType());
		Ticket ticket = job.getTicket();
		if(ticket != null) {
			dto.setTicketId(ticket.getId());
			dto.setTicketName(ticket.getTitle());
		}
		List<JobChecklist> jobCheckList = job.getChecklistItems();
		if(CollectionUtils.isNotEmpty(jobCheckList)) {
			List<JobChecklistDTO> checklistDtos = new ArrayList<JobChecklistDTO>();
			for(JobChecklist item : jobCheckList) {
				JobChecklistDTO itemDto = new JobChecklistDTO();
				itemDto.setChecklistItemName(item.getChecklistItemName());
				itemDto.setChecklistName(item.getChecklistName());
				itemDto.setCompleted(item.isCompleted());
				itemDto.setRemarks(item.getRemarks());
				String imageUrl_1 = !StringUtils.isEmpty(item.getImage_1()) ? cloudFrontUrl + bucketEnv + checkListpath + item.getImage_1() : "";
				itemDto.setImage_1(item.getImage_1());
				itemDto.setImageUrl_1(imageUrl_1);

				checklistDtos.add(itemDto);
			}
			dto.setChecklistItems(checklistDtos);
		}
		return dto;
	}

	private void mapToEntity(JobDTO jobDTO, Job job) {
		Employee employee = getEmployee(jobDTO.getEmployeeId());
		Site site = getSite(jobDTO.getSiteId());
		Location location = getLocation(jobDTO.getLocationId());
		Asset asset = assetRepository.findOne(jobDTO.getAssetId());

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
			job.setLocation(location);
		}
		if(org.apache.commons.lang3.StringUtils.isNotEmpty(jobDTO.getBlock())){
		    job.setBlock(jobDTO.getBlock());
        }
        if(org.apache.commons.lang3.StringUtils.isNotEmpty(jobDTO.getFloor())){

            job.setFloor(jobDTO.getFloor());
        }
        if(org.apache.commons.lang3.StringUtils.isNotEmpty(jobDTO.getZone())){

            job.setZone(jobDTO.getZone());
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
			Calendar startTimeCal = Calendar.getInstance();
			startTimeCal.setTime(jobDTO.getPlannedStartTime());
			if(endTimeCal.before(startTimeCal)) {
				endTimeCal.add(Calendar.DAY_OF_MONTH, 1);
			}
			job.setPlannedEndTime(endTimeCal.getTime());
		}else {
			job.setPlannedEndTime(jobDTO.getPlannedEndTime());
		}
		job.setPlannedHours(jobDTO.getPlannedHours());

		job.setActualStartTime(jobDTO.getActualStartTime());
		job.setActualEndTime(jobDTO.getActualEndTime());
		job.setActualHours(jobDTO.getActualHours());
		job.setSchedule(jobDTO.getSchedule());
		if(StringUtils.isEmpty(jobDTO.getSchedule())){
		    job.setSchedule("ONCE");
        }
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
		//maintenance type PPM or AMC
		job.setMaintenanceType(jobDTO.getMaintenanceType());
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
				JobChecklist checklist = mapperUtil.toEntity(jobclDto, JobChecklist.class);
				if(checklist.getImage_1() != null) {
					long jobId = checklist.getJob().getId();
					String fileName = amazonS3utils.uploadCheckListImage(checklist.getImage_1(), checklist.getChecklistItemName(), jobId, "image_1");
					String Imageurl_1 = cloudFrontUrl + bucketEnv + checkListpath + fileName;
					checklist.setImage_1(fileName);
					jobclDto.setImageUrl_1(Imageurl_1);
				}
				if(checklist.getImage_2() != null) {
					long jobId = checklist.getJob().getId();
					String fileName = amazonS3utils.uploadCheckListImage(checklist.getImage_2(), checklist.getChecklistItemName(), jobId, "image_2");
					String Imageurl_2 = cloudFrontUrl + bucketEnv + checkListpath + fileName;
					checklist.setImage_2(fileName);
					jobclDto.setImageUrl_2(Imageurl_2);
				}
				if(checklist.getImage_3() != null) {
					long jobId = checklist.getJob().getId();
					String fileName = amazonS3utils.uploadCheckListImage(checklist.getImage_3(), checklist.getChecklistItemName(), jobId, "image_3");
					String Imageurl_3 = cloudFrontUrl + bucketEnv + checkListpath + fileName;
					checklist.setImage_3(fileName);
					jobclDto.setImageUrl_3(Imageurl_3);

				}
                //log.debug("Job checklist remarks"+checklist.getImage_1());
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

    public Ticket getTicket(long id){
        Ticket ticket= ticketRepository.findOne(id);
        return ticket;
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
		if(jobDto.getChecklistItems() != null) {
			List<JobChecklistDTO> jobChecklists = jobDto.getChecklistItems();
			for(JobChecklistDTO jobChecklist : jobChecklists) {
				if(jobChecklist.getImage_1() != null) {
					String imageUrl_1 =  cloudFrontUrl + bucketEnv + checkListpath + jobChecklist.getImage_1();
					jobChecklist.setImageUrl_1(imageUrl_1);
				}
				if(jobChecklist.getImage_2() != null) {
					String imageUrl_2 =  cloudFrontUrl + bucketEnv + checkListpath + jobChecklist.getImage_2();
					jobChecklist.setImageUrl_2(imageUrl_2);
				}
				if(jobChecklist.getImage_3() != null) {
					String imageUrl_3 =  cloudFrontUrl + bucketEnv + checkListpath + jobChecklist.getImage_3();
					jobChecklist.setImageUrl_3(imageUrl_3);
				}
			}
		}
		List<CheckInOutImage> images = checkInOutImageRepository.findAll(job.getId());
		List<CheckInOutImageDTO> imageDtos = new ArrayList<CheckInOutImageDTO>();
		if(CollectionUtils.isNotEmpty(images)) {
			for(CheckInOutImage image : images) {
				CheckInOutImageDTO imageDTO = mapperUtil.toModel(image, CheckInOutImageDTO.class);
				imageDTO.setUrl(cloudFrontUrl + bucketEnv + checkInOutImagePath + image.getPhotoOut());
				imageDtos.add(imageDTO);
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

	public List<EmployeeDTO> getAsssignableEmployee(long userId) {
		User user = userRepository.findOne(userId);
		Employee employee = user.getEmployee();

		//log.debug(""+employee.getEmpId());

		List<Long> subEmpIds = new ArrayList<Long>();
		if(employee != null && !user.isAdmin()) {
			Hibernate.initialize(employee.getSubOrdinates());
			int levelCnt = 1;
			findAllSubordinates(employee, subEmpIds, levelCnt);
			log.debug("List of subordinate ids -"+ subEmpIds);
			if(CollectionUtils.isEmpty(subEmpIds)) {
				subEmpIds.add(employee.getId());
			}
		}
		Sort sort = new Sort(Sort.Direction.ASC , "name");
		Pageable pageRequest = createPageSort(1, sort);
		Page<Employee> result = null;
		if(user.isAdmin()) {
			result = employeeRepository.findAll(pageRequest);
		}else {
			result = employeeRepository.findAllByEmpIds(subEmpIds, false, pageRequest);
		}
		List<Employee> employees =  result.getContent();
		List<EmployeeDTO> empDto = new ArrayList<>();
		if(CollectionUtils.isNotEmpty(employees)) {
			for (Employee emp : employees) {
				EmployeeDTO dto = new EmployeeDTO();
				dto.setId(emp.getId());
				dto.setCode(emp.getCode());
				dto.setFullName(emp.getFullName());
				dto.setName(emp.getName());
				empDto.add(dto);
			}
		}
		return empDto;
	}



	public JobDTO updateJob(JobDTO jobDTO, long userId) {
		Job job = findJob(jobDTO.getId());

		jobDTO = validate(jobDTO, job);

		if(!StringUtils.isEmpty(jobDTO.getErrorMessage())) {
			return jobDTO;
		}

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
			JobDTO jobDto = onlyCompleteJob(job, userId);
			if(jobDto != null && org.apache.commons.lang3.StringUtils.isNotEmpty(jobDto.getErrorMessage())) {
				return jobDto;
			}
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
		Job job = findJob(id);
		JobDTO jobDTO = new JobDTO(); 
		Calendar now = Calendar.getInstance();
		Calendar plannedStartTime = Calendar.getInstance();
		plannedStartTime.setTime(job.getPlannedStartTime());
		if(plannedStartTime.before(now)) { //Future jobs cannot be completed. 
			User currUser = userRepository.findOne(userId);
			Hibernate.initialize(currUser.getEmployee());
			Employee currUserEmp = currUser.getEmployee();
			
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
			jobDTO = mapperUtil.toModel(job, JobDTO.class);
		}else { //if the job is in the future 
			jobDTO = mapperUtil.toModel(job, JobDTO.class);
			jobDTO.setErrorStatus(true);
			jobDTO.setErrorMessage("Cannot complete a future job");
		}
		return jobDTO;

	}

    public JobDTO saveJobAndCheckList(JobDTO jobDTO, long userId) {
        Job job = findJob(jobDTO.getId());
		Calendar now = Calendar.getInstance();
		Calendar plannedStartTime = Calendar.getInstance();
		plannedStartTime.setTime(job.getPlannedStartTime());
		if(plannedStartTime.before(now)) { //Future jobs cannot be completed. 
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
			jobDTO = mapperUtil.toModel(job, JobDTO.class);
		}else {
			jobDTO = mapperUtil.toModel(job, JobDTO.class);
			jobDTO.setErrorStatus(true);
			jobDTO.setErrorMessage("Cannot complete a future job");
		}
        return jobDTO;
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
                int levelCnt = 1;
                findAllSubordinates(employee, subEmpIds,levelCnt);
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
                			result.add(mapToModel(job, false));
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


    public List<Job> assignReliever(EmployeeDTO employee, EmployeeDTO reliever, Date startDate, Date endDate, long siteId) {

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

        allJobsList= jobRepository.findByStartDateSiteAndEmployee( siteId, employee.getId(), fromDt, toDt);
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
        return reportUtil.generateJobReports(transactions, user, emp, null, criteria);
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


	public ResponseEntity<?> createAMCJobs(AssetAMCScheduleDTO assetAMCScheduleDTO) {

		log.debug(">>> assetAMCSchedule Title from CreateAMCJob <<<"+assetAMCScheduleDTO.getTitle());

		Job job = new Job();

		Site site = null;

		Employee employee = employeeRepository.findOne(assetAMCScheduleDTO.getEmpId());

		if(assetAMCScheduleDTO.getAssetId() > 0) {
			Asset asset = assetRepository.findOne(assetAMCScheduleDTO.getAssetId());
			job.setAsset(asset);
			site = getSite(asset.getSite().getId());
		}

		if(job.getStatus() == null) {
			job.setStatus(JobStatus.OPEN);
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
		log.debug("Before saving new job -"+ job);
		log.debug("start Date  -"+ startDate + ", end date -" + endDate);

		Calendar startTime = Calendar.getInstance();
		startTime.setTime(assetAMCScheduleDTO.getStartDate());
		startTime.set(Calendar.HOUR_OF_DAY, 0);
		startTime.set(Calendar.MINUTE, 0);
		startTime.getTime();

		Calendar endTime = Calendar.getInstance();
		endTime.setTime(assetAMCScheduleDTO.getEndDate());
		endTime.set(Calendar.HOUR_OF_DAY, 11);
		endTime.set(Calendar.MINUTE, 59);
		endTime.getTime();
		*/

		Calendar jobStartTime = Calendar.getInstance();
		jobStartTime.setTimeInMillis(assetAMCScheduleDTO.getJobStartTime().toInstant().toEpochMilli());

		Calendar startTime = Calendar.getInstance();
		startTime.setTime(assetAMCScheduleDTO.getStartDate());
		startTime.set(Calendar.HOUR_OF_DAY, jobStartTime.get(Calendar.HOUR_OF_DAY));
		startTime.set(Calendar.MINUTE, jobStartTime.get(Calendar.MINUTE));
		startTime.getTime();

		Calendar plannedEndTime = Calendar.getInstance();
		plannedEndTime.setTime(jobStartTime.getTime());
		plannedEndTime.add(Calendar.HOUR_OF_DAY, assetAMCScheduleDTO.getPlannedHours());
		plannedEndTime.getTime();

		Calendar scheduleEndDateTime = Calendar.getInstance();
		scheduleEndDateTime.setTime(assetAMCScheduleDTO.getEndDate());
		scheduleEndDateTime.set(Calendar.HOUR_OF_DAY, 11);
		scheduleEndDateTime.set(Calendar.MINUTE, 59);
		scheduleEndDateTime.getTime();

		job.setPlannedStartTime(startTime.getTime());
		job.setPlannedEndTime(plannedEndTime.getTime());
		job.setPlannedHours(assetAMCScheduleDTO.getPlannedHours());
		job.setScheduleEndDate(scheduleEndDateTime.getTime());
		Asset asset = assetRepository.findOne(assetAMCScheduleDTO.getAssetId());
		job.setBlock(asset.getBlock());
		job.setFloor(asset.getFloor());
		job.setZone(asset.getZone());

		job.setEmployee(employee);
		if(employee != null) {
			job.setStatus(JobStatus.ASSIGNED);
		}
		job.setSite(site);
		job.setTitle(assetAMCScheduleDTO.getTitle());
		job.setDescription(assetAMCScheduleDTO.getTitle() +" "+ assetAMCScheduleDTO.getFrequencyPrefix()+" "+assetAMCScheduleDTO.getFrequencyDuration()+" "+assetAMCScheduleDTO.getFrequency());
		job.setMaintenanceType(assetAMCScheduleDTO.getMaintenanceType());
		job.setSchedule(Frequency.valueOf(assetAMCScheduleDTO.getFrequency()).getValue());
		job.setActive(job.ACTIVE_YES);
		job.setEscalationStatus(0);
		job.setType(JobType.MAINTENANCE);
		if(assetAMCScheduleDTO.getChecklistId() > 0)
		{
			Checklist checkList = checkListRepository.findOne(assetAMCScheduleDTO.getChecklistId());
			Set<ChecklistItem> checkListItemset = checkList.getItems();
			List<JobChecklist> jobCheckLists = new ArrayList<JobChecklist>();
			for(ChecklistItem checkListItem : checkListItemset)
			{
			JobChecklist jobChecklist = new JobChecklist();
			jobChecklist.setChecklistId(String.valueOf(checkList.getId()));
			jobChecklist.setChecklistName(checkList.getName());
			jobChecklist.setChecklistItemId(String.valueOf(checkListItem.getId()));
			jobChecklist.setChecklistItemName(checkListItem.getName());
			jobChecklist.setJob(job);
			jobCheckLists.add(jobChecklist);
			}
			job.setChecklistItems(jobCheckLists);
		}
		job = jobRepository.saveAndFlush(job);

		log.debug(">>> After Save Job: <<<"+job.getId());

		//if the job is scheduled for recurrence create a scheduled task
		if(!StringUtils.isEmpty(assetAMCScheduleDTO.getId())) {
			log.debug(">>> Scheduler Service <<<");
			SchedulerConfigDTO schConfDto = new SchedulerConfigDTO();
			//schConfDto.setSchedule(jobDTO.getSchedule());
			schConfDto.setType("CREATE_JOB");
			StringBuffer data = new StringBuffer();
			data.append("title="+assetAMCScheduleDTO.getTitle());
			data.append("&description="+assetAMCScheduleDTO.getFrequencyPrefix()+" "+assetAMCScheduleDTO.getFrequencyDuration()+" "+assetAMCScheduleDTO.getFrequency());
			data.append("&siteId="+site.getId());
			data.append("&empId="+employee.getId());
			//data.append("&empId="+assetPpmScheduleDTO.getEmployeeId());
			data.append("&plannedStartTime="+startTime.getTime());
			data.append("&plannedEndTime="+plannedEndTime.getTime());
			data.append("&plannedHours="+assetAMCScheduleDTO.getPlannedHours());
			//data.append("&location="+assetPpmScheduleDTO.getLocationId());
			//data.append("&frequency="+assetAMCScheduleDTO.getFrequency());
			data.append("&duration="+assetAMCScheduleDTO.getFrequencyDuration());
			schConfDto.setData(data.toString());
			schConfDto.setSchedule(Frequency.valueOf(assetAMCScheduleDTO.getFrequency()).getValue());
			schConfDto.setStartDate(assetAMCScheduleDTO.getStartDate());
			schConfDto.setEndDate(assetAMCScheduleDTO.getEndDate());
			schConfDto.setScheduleEndDate(assetAMCScheduleDTO.getEndDate());
			schConfDto.setAssetId(assetAMCScheduleDTO.getAssetId());

			schedulerService.save(schConfDto,job);
		}

		JobDTO jobDto = mapperUtil.toModel(job, JobDTO.class);

		return new ResponseEntity<>(jobDto, HttpStatus.CREATED);


	}

	public String uploadExistingChecklistImg() {
		int currPage = 1;
		int pageSize = 10;
		Pageable pageRequest = createPageRequest(currPage, pageSize);
		log.debug("Curr Page ="+ currPage + ",  pageSize -" + pageSize);
		Page<JobChecklist> checkResult = jobChecklistRepository.findAll(pageRequest);
		List<JobChecklist> jobchecklists = checkResult.getContent();
		while(CollectionUtils.isNotEmpty(jobchecklists)) {
			for(JobChecklist jobChecklist : jobchecklists) {
				if(jobChecklist.getImage_1() != null) {
					if(jobChecklist.getImage_1().indexOf("data:image") == 0) {
						String base64String = jobChecklist.getImage_1().split(",")[1];
						boolean isBase64 = Base64.isBase64(base64String);
						JobChecklistDTO checklist = mapperUtil.toModel(jobChecklist, JobChecklistDTO.class);
						if(isBase64){
							String image1 = amazonS3utils.uploadCheckListImage(checklist.getImage_1(), checklist.getChecklistItemName(), checklist.getJobId(), "image_1");
							jobChecklist.setImage_1(image1);
						}
					}
				}
				if(jobChecklist.getImage_2() != null) {
					if(jobChecklist.getImage_2().indexOf("data:image") == 0) {
						String base64String = jobChecklist.getImage_2().split(",")[1];
						boolean isBase64 = Base64.isBase64(base64String);
						JobChecklistDTO checklist = mapperUtil.toModel(jobChecklist, JobChecklistDTO.class);
						if(isBase64){
							String image2 = amazonS3utils.uploadCheckListImage(checklist.getImage_2(), checklist.getChecklistItemName(), checklist.getJobId(), "image_2");
							jobChecklist.setImage_2(image2);
						}
					}
				}
				if(jobChecklist.getImage_3() != null) {
					if(jobChecklist.getImage_3().indexOf("data:image") == 0) {
						String base64String = jobChecklist.getImage_3().split(",")[1];
						boolean isBase64 = Base64.isBase64(base64String);
						JobChecklistDTO checklist = mapperUtil.toModel(jobChecklist, JobChecklistDTO.class);
						if(isBase64){
							String image3 = amazonS3utils.uploadCheckListImage(checklist.getImage_3(), checklist.getChecklistItemName(), checklist.getJobId(), "image_3");
							jobChecklist.setImage_3(image3);
						}
					}
				}
			}
			jobChecklistRepository.save(jobchecklists);
			currPage++;
			pageRequest = createPageRequest(currPage, pageSize);
			checkResult = jobChecklistRepository.findAll(pageRequest);
			jobchecklists = checkResult.getContent();
		}

		return "Successfully upload checklist images";
	}

	/*
	 * Validate job date information
	 */
	private JobDTO validate(JobDTO jobDTO, Job job) {

		if(job.getStatus() != null && job.getStatus().equals(JobStatus.COMPLETED)) {
			jobDTO.setErrorMessage("Job details cannot be updated in COMPLETED state");
			return jobDTO;
		}

		//Date Validation for job
		if(jobDTO.getScheduleEndDate() != null) {
			Calendar startCal = Calendar.getInstance();
			startCal.setTime(jobDTO.getPlannedStartTime());
			Calendar scheduleEndCal = Calendar.getInstance();
			scheduleEndCal.setTime(jobDTO.getScheduleEndDate());
			if(scheduleEndCal.before(startCal)) {
				jobDTO.setErrorMessage("Job schedule end date cannot be earlier than start date");
				return jobDTO;
			}
		}
		Job parentJob = job.getParentJob();
		if(parentJob != null) {
			Calendar startCal = Calendar.getInstance();
			startCal.setTime(jobDTO.getPlannedStartTime());
			Calendar parentStartCal = Calendar.getInstance();
			parentStartCal.setTime(parentJob.getPlannedStartTime());
			Calendar parentEndCal = Calendar.getInstance();
			parentEndCal.setTime(parentJob.getScheduleEndDate());
			if(parentStartCal.after(startCal)) {
				jobDTO.setErrorMessage("Job schedule start date cannot be earlier than parent job start date");
				return jobDTO;
			}
			if(parentEndCal.before(startCal)) {
				jobDTO.setErrorMessage("Job schedule start date cannot be later than parent job schedule end date");
				return jobDTO;
			}
		}

		//validate job completion time
		if(jobDTO.getJobStatus() != null && jobDTO.getJobStatus().equals(JobStatus.COMPLETED)) {
			Calendar now = Calendar.getInstance();
			Calendar jobStartTime = Calendar.getInstance();
			jobStartTime.setTime(jobDTO.getPlannedStartTime());
			if(now.before(jobStartTime)) {
				JobDTO jobDto = mapperUtil.toModel(job, JobDTO.class);
				jobDto.setErrorMessage("Cannot complete job before the scheduled job start time");
				return jobDto;
			}
		}
		return jobDTO;
	}
}
