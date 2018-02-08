package com.ts.app.service;

import com.ts.app.domain.*;
import com.ts.app.repository.*;
import com.ts.app.service.util.*;
import com.ts.app.web.rest.dto.*;
import com.ts.app.web.rest.errors.TimesheetException;
import org.apache.commons.collections.CollectionUtils;
import org.hibernate.Hibernate;
import org.joda.time.DateTime;
import org.joda.time.Seconds;
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

import javax.inject.Inject;
import java.util.*;

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
    private AssetRepository assetRepository;

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
    private PricingRepository priceRepository;

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

	public SearchResult<JobDTO> findBySearchCrieria(SearchCriteria searchCriteria, boolean isAdmin) {
		SearchResult<JobDTO> result = new SearchResult<JobDTO>();
		if(searchCriteria != null) {
			log.debug("findBYSearchCriteria search criteria -"+ (searchCriteria.getJobStatus() != null && searchCriteria.getJobStatus().equals(JobStatus.OVERDUE)));

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
				if(CollectionUtils.isEmpty(subEmpIds)) {
					subEmpIds.add(employee.getId());
				}
				searchCriteria.setSubordinateIds(subEmpIds);
			}
			log.debug("SearchCriteria ="+ searchCriteria);

			Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
			//Pageable pageRequest = new PageRequest(searchCriteria.getCurrPage(), PagingUtil.PAGE_SIZE, new Sort(Direction.DESC,"id"));
			Page<Job> page = null;
			List<Job> allJobsList = new ArrayList<Job>();
			List<JobDTO> transactions = null;

			Date checkInDate = searchCriteria.getCheckInDateTimeFrom();

            log.debug("JobManagementService toPredicate - searchCriteria projectid -"+ searchCriteria.getProjectId());
            log.debug("JobManagementService toPredicate - searchCriteria siteId -"+ searchCriteria.getSiteId());
            log.debug("JobManagementService toPredicate - searchCriteria jobstatus -"+ searchCriteria.getJobStatus());
            log.debug("JobManagementService toPredicate - searchCriteria jobTitle -"+ searchCriteria.getJobTitle());
            log.debug("JobManagementService toPredicate - searchCriteria scheduled -"+ searchCriteria.isScheduled());
            log.debug("JobSpecification toPredicate - searchCriteria get assigned status -"+ searchCriteria.isAssignedStatus());
            log.debug("JobSpecification toPredicate - searchCriteria get completed status -"+ searchCriteria.isCompletedStatus());
            log.debug("JobSpecification toPredicate - searchCriteria get overdue status -"+ searchCriteria.isOverdueStatus());
            log.debug("JobSpecification toPredicate - searchCriteria get consolidated status -"+ searchCriteria.isConsolidated());

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
        			allJobsList.addAll(page.getContent());
        		}else {
	        		List<Site> allSites = siteRepository.findAll();
	        		for(Site site : allSites) {
	        			reportResults.add(reportService.jobCountBySiteAndStatus(site.getId()));
	        		}

        		}
        	}

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

		}
		return result;
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
                transactions = mapperUtil.toModelList(page.getContent(), JobDTO.class);
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
		//List<Job> existingJobs = jobRepository.findJobByTitleSiteAndDate(jobDTO.getTitle(), jobDTO.getSiteId(), startDate, endDate);
		//log.debug("Existing job -"+ existingJobs);
		//if(CollectionUtils.isEmpty(existingJobs)) {
			job = jobRepository.save(job);
		//}

		//if the job is scheduled for recurrence create a scheduled task
		if(!StringUtils.isEmpty(jobDTO.getSchedule()) && !jobDTO.getSchedule().equalsIgnoreCase("ONCE")) {
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
			data.append("&location="+jobDTO.getLocationId());
			data.append("&frequency="+jobDTO.getFrequency());
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

			schedulerService.save(schConfDto,job);
		}

		return mapperUtil.toModel(job, JobDTO.class);
	}



	private void mapToEntity(JobDTO jobDTO, Job job) {
		Employee employee = getEmployee(jobDTO.getEmployeeId());
		Site site = getSite(jobDTO.getSiteId());
		Location location = getLocation(jobDTO.getLocationId());
		Asset asset = getAsset(jobDTO.getAssetId());

		job.setTitle(jobDTO.getTitle());
		job.setDescription(jobDTO.getDescription());
		job.setStatus(jobDTO.getJobStatus());
		job.setType(jobDTO.getJobType());
		if(location != null) {
			job.setLocation(location);
		}
		if(asset!=null){
		    job.setAsset(asset);
        }
		job.setActive(jobDTO.getActive());

		job.setSite(site);
		job.setEmployee(employee);
		job.setComments(jobDTO.getComments());
		job.setPlannedStartTime(jobDTO.getPlannedStartTime());
		job.setPlannedEndTime(jobDTO.getPlannedEndTime());
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

		//add the job checklist items
		if(CollectionUtils.isNotEmpty(jobDTO.getChecklistItems())) {
			List<JobChecklistDTO> jobclDtoList = jobDTO.getChecklistItems();
			List<JobChecklist> checklistItems = new ArrayList<JobChecklist>();
			for(JobChecklistDTO jobclDto : jobclDtoList) {
				JobChecklist checklist = mapperUtil.toEntity(jobclDto, JobChecklist.class);
				checklist.setJob(job);
				checklistItems.add(checklist);
			}
			job.setChecklistItems(checklistItems);
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

	private Location getLocation(Long locationId){
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
		jobDto.setActive(job.getActive());
		jobDto.setLocationId(job.getLocation().getId());
		jobDto.setLocationName(job.getLocation().getName());
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



	public JobDTO updateJob(JobDTO jobDTO) {
		Job job = findJob(jobDTO.getId());
		mapToEntity(jobDTO, job);
		job = jobRepository.save(job);

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
			schedulerService.deleteCurrentSchedule(jobDTO.getId());
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

	public JobDTO completeJob(Long id) {
		Job job = findJob(id);

		if(job.getStatus() != JobStatus.INPROGRESS){
			throw new TimesheetException("Job cannot be completed, Current Status : "+job.getStatus());
		}

		Date endDate = new Date();
		int totalHours = Seconds.secondsBetween(new DateTime(job.getActualStartTime()),new DateTime(endDate)).getSeconds();

		job.setStatus(JobStatus.COMPLETED);
		job.setActualEndTime(endDate);
		job.setActualHours(totalHours);
		jobRepository.save(job);
		return mapperUtil.toModel(job, JobDTO.class);

	}

	public JobDTO onlyCompleteJob(Long id) {
		Job job = findJob(id);

		Date endDate = new Date();
		//int totalHours = Seconds.secondsBetween(new DateTime(job.getActualStartTime()),new DateTime(endDate)).getSeconds();
		job.setStatus(JobStatus.COMPLETED);
		job.setActualEndTime(endDate);
		job.setActualHours(0);
		jobRepository.save(job);
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



    public AssetDTO getAsset(long id){
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

                allJobsList = jobRepository.findByDateRange(searchCriteria.getUserId(),subEmpIds,fromDt,toDt);
                result = mapperUtil.toModelList(allJobsList,JobDTO.class);
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


	public ExportResult export(List<JobDTO> transactions) {
		return exportUtil.writeJobReportToFile(transactions, null, null);
	}


	public ExportResult getExportStatus(String fileId) {
		ExportResult er = new ExportResult();
		fileId += ".csv";
		if(!StringUtils.isEmpty(fileId)) {
			String status = exportUtil.getExportStatus(fileId);
			er.setFile(fileId);
			er.setStatus(status);
		}
		return er;
	}

	public byte[] getExportFile(String fileName) {
		return exportUtil.readExportFile(fileName);
	}

}
