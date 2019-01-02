package com.ts.app.service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.JobStatus;
import com.ts.app.domain.JobType;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import com.ts.app.repository.AttendanceRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.TicketRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.DateUtil;
import com.ts.app.web.rest.dto.ReportResult;

@Service
@Transactional
public class ReportService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(ReportService.class);

	@Inject
	private JobRepository jobRepository;

	@Inject
	private ProjectRepository projectRepository;

	@Inject
	private SiteRepository siteRepository;

    @Inject
    private EmployeeRepository employeeRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private AttendanceRepository attendanceRepository;

    @Inject
    private TicketRepository ticketRepository;

    @PersistenceContext
	private EntityManager manager;

	public ReportResult getJobStats(Long siteId, Date selectedDate) {
		java.sql.Date sqlDate = new java.sql.Date(DateUtils.toCalendar(selectedDate).getTimeInMillis());
		long assignedJobCount = jobRepository.findJobCountBySiteIdAndStatus(siteId, sqlDate, JobStatus.ASSIGNED);
		long completedJobCount = jobRepository.findJobCountBySiteIdAndStatus(siteId, sqlDate, JobStatus.COMPLETED);
		long overdueJobCount = jobRepository.findJobCountBySiteIdAndStatus(siteId, sqlDate, JobStatus.OVERDUE);
		ReportResult reportResult = new ReportResult();
		reportResult.setSiteId(siteId);
		reportResult.setAssignedJobCount(assignedJobCount);
		reportResult.setCompletedJobCount(completedJobCount);
		reportResult.setOverdueJobCount(overdueJobCount);
		return reportResult;
	}

    public ReportResult getJobStatsDateRange(Long siteId, Date selectedDate, Date endDate) {
        java.sql.Date sqlDate = new java.sql.Date(DateUtils.toCalendar(selectedDate).getTimeInMillis());
        java.sql.Date sqlEndDate = new java.sql.Date(DateUtils.toCalendar(endDate).getTimeInMillis());
        long assignedJobCount = jobRepository.findJobCountBySiteIdAndStatusDateRange(siteId, sqlDate,sqlEndDate, JobStatus.ASSIGNED);
        long completedJobCount = jobRepository.findJobCountBySiteIdAndStatusDateRange(siteId, sqlDate,sqlEndDate, JobStatus.COMPLETED);
        long overdueJobCount = jobRepository.findJobCountBySiteIdAndStatusDateRange(siteId, sqlDate,sqlEndDate, JobStatus.OVERDUE);
        ReportResult reportResult = new ReportResult();
        reportResult.setSiteId(siteId);
        reportResult.setAssignedJobCount(assignedJobCount);
        reportResult.setCompletedJobCount(completedJobCount);
        reportResult.setOverdueJobCount(overdueJobCount);
        return reportResult;
    }

    public ReportResult jobCountByLocationSiteIdAndStatus(Long siteId, Date selectedDate, Date endDate, Long locationId) {
    	Calendar startDate = DateUtils.toCalendar(selectedDate);
    	startDate.set(Calendar.HOUR_OF_DAY, 0);
    	startDate.set(Calendar.MINUTE, 0);
    	Calendar endCal = DateUtils.toCalendar(endDate);
    	endCal.set(Calendar.HOUR_OF_DAY, 23);
    	endCal.set(Calendar.MINUTE, 59);
    	java.sql.Date sqlDate = new java.sql.Date(startDate.getTimeInMillis());
        java.sql.Date sqlEndDate = new java.sql.Date(endCal.getTimeInMillis());
        log.debug("selected Date  in report result"+selectedDate);
        log.debug("end date in report result"+endDate);
        log.debug("SiteId in report result"+siteId);
        log.debug("Location Id in report result"+locationId);
        long assignedJobCount = jobRepository.jobCountByLocationSiteIdAndStatus(siteId,sqlDate,sqlEndDate, JobStatus.ASSIGNED,locationId);
        long completedJobCount = jobRepository.jobCountByLocationSiteIdAndStatus(siteId, sqlDate,sqlEndDate, JobStatus.COMPLETED,locationId);
        long overdueJobCount = jobRepository.jobCountByLocationSiteIdAndStatus(siteId, sqlDate,sqlEndDate, JobStatus.OVERDUE,locationId);
        long completedJobTAT = jobRepository.jobCountTAT(siteId, JobStatus.COMPLETED);
        log.debug("completed job turn around time jobCountByLocationSiteIdAndStatus");
        log.debug(String.valueOf(completedJobTAT));
        ReportResult reportResult = new ReportResult();
        reportResult.setSiteId(siteId);
        reportResult.setAssignedJobCount(assignedJobCount);
        reportResult.setCompletedJobCount(completedJobCount);
        reportResult.setOverdueJobCount(overdueJobCount);
        reportResult.setLocationId(locationId);
        return reportResult;
    }

    public ReportResult jobCountBySiteAndStatusAndDateRange(Long siteId, Date selectedDate, Date endDate) {
        java.sql.Date sqlDate = new java.sql.Date(DateUtils.toCalendar(selectedDate).getTimeInMillis());
        java.sql.Date sqlEndDate = new java.sql.Date(DateUtils.toCalendar(endDate).getTimeInMillis());

        log.debug("selected Date  in report result"+selectedDate);
        log.debug("end date in report result"+endDate);

        long assignedJobCount = jobRepository.findJobCountBySiteIdAndStatusDateRange(siteId, sqlDate,sqlEndDate, JobStatus.ASSIGNED);
        long completedJobCount = jobRepository.findJobCountBySiteIdAndStatusDateRange(siteId,sqlDate,sqlEndDate, JobStatus.COMPLETED);
        long overdueJobCount = jobRepository.findJobCountBySiteIdAndStatusDateRange(siteId, sqlDate,sqlEndDate, JobStatus.OVERDUE);
        long totalJobCount = jobRepository.findTotalJobCountBySiteIdAndDateRange(siteId, sqlDate, sqlEndDate);
        long completedJobTAT = jobRepository.jobCountTAT(siteId, JobStatus.COMPLETED);

        ReportResult reportResult = new ReportResult();
        reportResult.setSiteId(siteId);
        reportResult.setSiteName(siteRepository.findOne(siteId).getName());
        reportResult.setTotalJobCount(totalJobCount);
        reportResult.setAssignedJobCount(assignedJobCount);
        reportResult.setCompletedJobCount(completedJobCount);
        reportResult.setTat(completedJobTAT);
        reportResult.setOverdueJobCount(overdueJobCount);
        log.debug("completed job turn around time jobCountBySiteAndStatusAndDateRange");
        log.debug(String.valueOf(completedJobTAT));
        return reportResult;
    }
    
    public ReportResult jobCountByProjectAndStatusAndDateRange(Long projectId, Date selectedDate, Date endDate) {
        java.sql.Date sqlDate = new java.sql.Date(DateUtils.toCalendar(selectedDate).getTimeInMillis());
        java.sql.Date sqlEndDate = new java.sql.Date(DateUtils.toCalendar(endDate).getTimeInMillis());

        log.debug("selected Date  in report result"+selectedDate);
        log.debug("end date in report result"+endDate);
 
        long assignedJobCount = jobRepository.findJobCountByProjectAndStatusDateRange(projectId, sqlDate,sqlEndDate, JobStatus.ASSIGNED);
        long completedJobCount = jobRepository.findJobCountByProjectAndStatusDateRange(projectId,sqlDate,sqlEndDate, JobStatus.COMPLETED);
        long overdueJobCount = jobRepository.findJobCountByProjectAndStatusDateRange(projectId, sqlDate,sqlEndDate, JobStatus.OVERDUE);
        long totalJobCount = jobRepository.findTotalJobCountByProjectAndDateRange(projectId, sqlDate, sqlEndDate);
        //long completedJobTAT = jobRepository.jobCountTAT(siteId, JobStatus.COMPLETED);

        ReportResult reportResult = new ReportResult();
        reportResult.setProjectId(projectId);
        reportResult.setProjectName(projectRepository.findOne(projectId).getName());
        reportResult.setTotalJobCount(totalJobCount);
        reportResult.setAssignedJobCount(assignedJobCount);
        reportResult.setCompletedJobCount(completedJobCount);
        //reportResult.setTat(completedJobTAT);
        reportResult.setOverdueJobCount(overdueJobCount);
        log.debug("completed job turn around time jobCountByProjectAndStatusAndDateRange");
        //log.debug(String.valueOf(completedJobTAT));
        return reportResult;
    }
    
    public ReportResult jobCountByProjectRegionAndStatusAndDateRange(Long projectId, String region, Date selectedDate, Date endDate) {
        java.sql.Date sqlDate = new java.sql.Date(DateUtils.toCalendar(selectedDate).getTimeInMillis());
        java.sql.Date sqlEndDate = new java.sql.Date(DateUtils.toCalendar(endDate).getTimeInMillis());

        log.debug("selected Date  in report result"+selectedDate);
        log.debug("end date in report result"+endDate);

        long assignedJobCount = jobRepository.findJobCountByProjectRegionAndStatusDateRange(projectId, region, sqlDate,sqlEndDate, JobStatus.ASSIGNED);
        long completedJobCount = jobRepository.findJobCountByProjectRegionAndStatusDateRange(projectId, region, sqlDate,sqlEndDate, JobStatus.COMPLETED);
        long overdueJobCount = jobRepository.findJobCountByProjectRegionAndStatusDateRange(projectId, region, sqlDate,sqlEndDate, JobStatus.OVERDUE);
        long totalJobCount = jobRepository.findTotalJobCountByProjectRegionAndDateRange(projectId, region, sqlDate, sqlEndDate);
        //long completedJobTAT = jobRepository.jobCountTAT(siteId, JobStatus.COMPLETED);

        ReportResult reportResult = new ReportResult();
        reportResult.setProjectId(projectId);
        reportResult.setProjectName(projectRepository.findOne(projectId).getName());
        reportResult.setTotalJobCount(totalJobCount);
        reportResult.setAssignedJobCount(assignedJobCount);
        reportResult.setCompletedJobCount(completedJobCount);
        //reportResult.setTat(completedJobTAT);
        reportResult.setOverdueJobCount(overdueJobCount);
        log.debug("completed job turn around time jobCountByProjectRegionAndStatusAndDateRange");
        //log.debug(String.valueOf(completedJobTAT));
        return reportResult;
    }
    
    public ReportResult jobCountByProjectRegionBranchAndStatusAndDateRange(Long projectId, String region, String branch, Date selectedDate, Date endDate) {
        java.sql.Date sqlDate = new java.sql.Date(DateUtils.toCalendar(selectedDate).getTimeInMillis());
        java.sql.Date sqlEndDate = new java.sql.Date(DateUtils.toCalendar(endDate).getTimeInMillis());

        log.debug("selected Date  in report result"+selectedDate);
        log.debug("end date in report result"+endDate);

        long assignedJobCount = jobRepository.findJobCountByProjectRegionBranchAndStatusDateRange(projectId, region, branch, sqlDate,sqlEndDate, JobStatus.ASSIGNED);
        long completedJobCount = jobRepository.findJobCountByProjectRegionBranchAndStatusDateRange(projectId, region, branch, sqlDate,sqlEndDate, JobStatus.COMPLETED);
        long overdueJobCount = jobRepository.findJobCountByProjectRegionBranchAndStatusDateRange(projectId, region, branch, sqlDate,sqlEndDate, JobStatus.OVERDUE);
        long totalJobCount = jobRepository.findTotalJobCountByProjectRegionBranchAndDateRange(projectId, region, branch, sqlDate, sqlEndDate);
        //long completedJobTAT = jobRepository.jobCountTAT(siteId, JobStatus.COMPLETED);

        ReportResult reportResult = new ReportResult();
        reportResult.setProjectId(projectId);
        reportResult.setProjectName(projectRepository.findOne(projectId).getName());
        reportResult.setTotalJobCount(totalJobCount);
        reportResult.setAssignedJobCount(assignedJobCount);
        reportResult.setCompletedJobCount(completedJobCount);
        //reportResult.setTat(completedJobTAT);
        reportResult.setOverdueJobCount(overdueJobCount);
        log.debug("completed job turn around time jobCountByProjectRegionBranchAndStatusAndDateRange");
        //log.debug(String.valueOf(completedJobTAT));
        return reportResult;
    }

    public ReportResult jobCountGroupByDate(Long siteId, Date selectedDate, Date endDate) {
        java.sql.Date sqlDate = new java.sql.Date(DateUtils.toCalendar(selectedDate).getTimeInMillis());
        java.sql.Date sqlEndDate = new java.sql.Date(DateUtils.toCalendar(endDate).getTimeInMillis());

        log.debug("selected Date  in report result"+selectedDate);
        log.debug("end date in report result"+endDate);

        Map<java.sql.Date, Long> assignedCountMap = jobRepository.findJobCountByDateForReports(siteId, sqlDate,sqlEndDate, JobStatus.ASSIGNED);
        Map<java.sql.Date, Long> completedCountMap = jobRepository.findJobCountByDateForReports(siteId,sqlDate,sqlEndDate, JobStatus.COMPLETED);
        Map<java.sql.Date, Long> overdueCountMap = jobRepository.findJobCountByDateForReports(siteId, sqlDate,sqlEndDate, JobStatus.OVERDUE);
        Map<java.sql.Date, Long> totalCountMap = jobRepository.findTotalJobCountByDateForReports(siteId, sqlDate, sqlEndDate);
        long completedJobTAT = jobRepository.jobCountTAT(siteId, JobStatus.COMPLETED);

        ReportResult reportResult = new ReportResult();
        reportResult.setSiteId(siteId);
        reportResult.setSiteName(siteRepository.findOne(siteId).getName());
        reportResult.setTotalCountMap(totalCountMap);
        reportResult.setAssignedCountMap(assignedCountMap);
        reportResult.setCompletedCountMap(completedCountMap);
        reportResult.setTat(completedJobTAT);
        reportResult.setOverdueCountMap(overdueCountMap);
        log.debug("completed job turn around time jobCountBySiteAndStatusAndDateRange");
        log.debug(String.valueOf(completedJobTAT));
        return reportResult;
    }

    public ReportResult jobCountBySiteAndStatus(Long siteId) {
        long assignedJobCount = jobRepository.jobCountBySiteAndStatus(siteId, JobStatus.ASSIGNED);
        long completedJobCount = jobRepository.jobCountBySiteAndStatus(siteId, JobStatus.COMPLETED);
        long completedJobTAT = jobRepository.jobCountTAT(siteId, JobStatus.COMPLETED);
        long overdueJobCount = jobRepository.jobCountBySiteAndStatus(siteId, JobStatus.OVERDUE);
        long totalJobCount = jobRepository.jobCountBySite(siteId);
        ReportResult reportResult = new ReportResult();
        reportResult.setSiteId(siteId);
        reportResult.setSiteName(siteRepository.findOne(siteId).getName());
        reportResult.setAssignedJobCount(assignedJobCount);
        reportResult.setCompletedJobCount(completedJobCount);
        reportResult.setOverdueJobCount(overdueJobCount);
        reportResult.setTotalJobCount(totalJobCount);
        reportResult.setTat(completedJobTAT);
        log.debug("completed job turn around time jobCountBySiteAndStatus");
        log.debug(String.valueOf(completedJobTAT));
        return reportResult;
    }

//    public ReportResult jobCountBySiteAndStatusAndType(Long siteId){
//        long assignedJobCountAc = jobRepository.jobCountBySiteAndStatusAndType(siteId, JobStatus.ASSIGNED,JobType.AC);
//        long assignedJobCountCarpentry = jobRepository.jobCountBySiteAndStatusAndType(siteId, JobStatus.ASSIGNED,JobType.CARPENTRY);
//        long assignedJobCountElectrical = jobRepository.jobCountBySiteAndStatusAndType(siteId, JobStatus.ASSIGNED,JobType.ELECTRICAL);
//        long assignedJobCountHouseKeeping = jobRepository.jobCountBySiteAndStatusAndType(siteId, JobStatus.ASSIGNED,JobType.HOUSEKEEPING);
//        long assignedJobCountMaintenance = jobRepository.jobCountBySiteAndStatusAndType(siteId, JobStatus.ASSIGNED,JobType.MAINTENANCE);
//        long assignedJobCountPestControl = jobRepository.jobCountBySiteAndStatusAndType(siteId, JobStatus.ASSIGNED,JobType.PESTCONTROL);
//        long assignedJobCountPlumbing = jobRepository.jobCountBySiteAndStatusAndType(siteId, JobStatus.ASSIGNED,JobType.PLUMBING);
//        long completedJobCountPlumbing = jobRepository.jobCountBySiteAndStatusAndType(siteId,JobStatus.COMPLETED,JobType.PLUMBING);
//        long completedJobCountMaintenance = jobRepository.jobCountBySiteAndStatusAndType(siteId,JobStatus.COMPLETED,JobType.MAINTENANCE);
//        long completedJobCountPestControl = jobRepository.jobCountBySiteAndStatusAndType(siteId,JobStatus.COMPLETED,JobType.PESTCONTROL);
//        long completedJobCountHouseKeeping = jobRepository.jobCountBySiteAndStatusAndType(siteId,JobStatus.COMPLETED,JobType.HOUSEKEEPING);
//        long completedJobCountElectrical = jobRepository.jobCountBySiteAndStatusAndType(siteId,JobStatus.COMPLETED,JobType.ELECTRICAL);
//        long completedJobCountCarpentry = jobRepository.jobCountBySiteAndStatusAndType(siteId,JobStatus.COMPLETED,JobType.CARPENTRY);
//        long completedJobCountAc = jobRepository.jobCountBySiteAndStatusAndType(siteId,JobStatus.COMPLETED,JobType.AC);
//        long overdueJobCountAc = jobRepository.jobCountBySiteAndStatusAndType(siteId, JobStatus.OVERDUE,JobType.AC);
//        long overdueJobCountCarpentry = jobRepository.jobCountBySiteAndStatusAndType(siteId, JobStatus.OVERDUE,JobType.CARPENTRY);
//        long overdueJobCountElectrical = jobRepository.jobCountBySiteAndStatusAndType(siteId, JobStatus.OVERDUE,JobType.ELECTRICAL);
//        long overdueJobCountHousekeeping = jobRepository.jobCountBySiteAndStatusAndType(siteId, JobStatus.OVERDUE,JobType.HOUSEKEEPING);
//        long overdueJobCountPestControl = jobRepository.jobCountBySiteAndStatusAndType(siteId, JobStatus.OVERDUE,JobType.PESTCONTROL);
//        long overdueJobCountMaintenance = jobRepository.jobCountBySiteAndStatusAndType(siteId, JobStatus.OVERDUE,JobType.MAINTENANCE);
//        long overdueJobCountPlumbing = jobRepository.jobCountBySiteAndStatusAndType(siteId, JobStatus.OVERDUE,JobType.PLUMBING);
//        ReportResult reportResult = new ReportResult();
//        reportResult.setSiteId(siteId);
//        reportResult.setSiteName(siteRepository.findOne(siteId).getName());
//        reportResult.setAssignedJobCountPestControl(assignedJobCountPestControl);
//        reportResult.setAssignedJobCountPlumbing(assignedJobCountPlumbing);
//        reportResult.setAssignedJobCountElectrical(assignedJobCountElectrical);
//        reportResult.setAssignedJobCountCarpentry(assignedJobCountCarpentry);
//        reportResult.setAssignedJobCountHousekeeping(assignedJobCountHouseKeeping);
//        reportResult.setAssignedJobCountMaintenance(assignedJobCountMaintenance);
//        reportResult.setAssignedJobCountAc(assignedJobCountAc);
//        reportResult.setCompletedJobCountAc(completedJobCountAc);
//        reportResult.setCompletedJobCountMaintenance(completedJobCountMaintenance);
//        reportResult.setCompletedJobCountHousekeeping(completedJobCountHouseKeeping);
//        reportResult.setCompletedJobCountElectrical(completedJobCountElectrical);
//        reportResult.setCompletedJobCountCarpentry(completedJobCountCarpentry);
//        reportResult.setCompletedJobCountPestControl(completedJobCountPestControl);
//        reportResult.setCompletedJobCountPlumbing(completedJobCountPlumbing);
//        reportResult.setOverdueJobCountAc(overdueJobCountAc);
//        reportResult.setOverdueJobCountElectrical(overdueJobCountElectrical);
//        reportResult.setOverdueJobCountCarpentry(overdueJobCountCarpentry);
//        reportResult.setOverdueJobCountPlumbing(overdueJobCountPlumbing);
//        reportResult.setOverdueJobCountHouseKeeping(overdueJobCountHousekeeping);
//        reportResult.setOverdueJobCountPestControl(overdueJobCountPestControl);
//        reportResult.setOverdueJobCountMaintenance(overdueJobCountMaintenance);
//        return reportResult;
//    }

	public ReportResult getJobStatsByJobType(Long siteId, Date selectedDate) {
		java.sql.Date sqlDate = new java.sql.Date(DateUtils.toCalendar(selectedDate).getTimeInMillis());
		Map<JobType, Long> typeMap = jobRepository.findJobCountByType(siteId, sqlDate);
		ReportResult reportResult = new ReportResult();
		reportResult.setSiteId(siteId);
		reportResult.setJobCountByType(typeMap);
		return reportResult;
	}

    public ReportResult getJobStatsByJobTypeDateRange(Long siteId, Date selectedDate, Date endDate) {
        java.sql.Date sqlDate = new java.sql.Date(DateUtils.toCalendar(selectedDate).getTimeInMillis());
        java.sql.Date sqlEndDate = new java.sql.Date(DateUtils.toCalendar(endDate).getTimeInMillis());
        Map<JobType, Long> typeMap = jobRepository.findJobCountByTypeDateRange(siteId, sqlDate, sqlEndDate);
        ReportResult reportResult = new ReportResult();
        reportResult.setSiteId(siteId);
        reportResult.setJobCountByType(typeMap);
        return reportResult;
    }

    public ReportResult getAttendanceStatsDateRange(long userId, Long siteId, Date selectedDate, Date endDate) {
        log.info("Attendance report params : siteId - "+ siteId + ", selectedDate - " + selectedDate + ", endDate -" + endDate );
        Calendar startCal = DateUtils.toCalendar(selectedDate);
	    	startCal.set(Calendar.HOUR_OF_DAY, 0);
	    	startCal.set(Calendar.MINUTE, 0);
	    	Calendar endCal = DateUtils.toCalendar(endDate);
	    	endCal.set(Calendar.HOUR_OF_DAY, 23);
	    	endCal.set(Calendar.MINUTE, 59);

        java.sql.Date sqlDate = new java.sql.Date(startCal.getTimeInMillis());
        java.sql.Date sqlEndDate = new java.sql.Date(endCal.getTimeInMillis());
        long totalEmployeeCount = 0;
        long presentEmployeeCount = 0;
        long absentEmployeeCount = 0;
        if(siteId > 0) {
            totalEmployeeCount = employeeRepository.findCountBySiteId(siteId);
        }else {
        		if(userId > 0) {
        			User user = userRepository.findOne(userId);
        			if(!user.getUserRole().getName().equalsIgnoreCase("Admin")) {
	        			Employee emp = user.getEmployee();
	        			List<EmployeeProjectSite> projSites = emp.getProjectSites();
	        			List<Long> siteIds = new ArrayList<Long>();
	        			if(CollectionUtils.isNotEmpty(projSites)) {
	        				for(EmployeeProjectSite projSite : projSites) {
	        					siteIds.add(projSite.getSite().getId());
	        				}
	        			}
	        			totalEmployeeCount = employeeRepository.findTotalCountBySites(siteIds);
        			}else {
        				totalEmployeeCount = employeeRepository.findTotalCount();
        			}
        		}else {
        			totalEmployeeCount = employeeRepository.findTotalCount();
        		}
        }
        if(siteId > 0) {
            presentEmployeeCount = attendanceRepository.findCountBySiteAndCheckInTime(siteId, sqlDate, sqlEndDate);
        }else {
        		if(userId > 0) {
        			User user = userRepository.findOne(userId);
        			if(!user.getUserRole().getName().equalsIgnoreCase("Admin")) {
	        			Employee emp = user.getEmployee();
	        			List<EmployeeProjectSite> projSites = emp.getProjectSites();
	        			List<Long> siteIds = new ArrayList<Long>();
	        			if(CollectionUtils.isNotEmpty(projSites)) {
	        				for(EmployeeProjectSite projSite : projSites) {
	        					siteIds.add(projSite.getSite().getId());
	        				}
	        			}
	        			presentEmployeeCount = attendanceRepository.findCountByCheckInTime(siteIds, sqlDate, sqlEndDate);
        			}else {
        				presentEmployeeCount = attendanceRepository.findCountByCheckInTime(sqlDate, sqlEndDate);
        			}
        		}else {
        			presentEmployeeCount = attendanceRepository.findCountByCheckInTime(sqlDate, sqlEndDate);
        		}

        }
        absentEmployeeCount = totalEmployeeCount - presentEmployeeCount;
        ReportResult reportResult = new ReportResult();
        reportResult.setSiteId(siteId);
        reportResult.setTotalEmployeeCount(totalEmployeeCount);
        reportResult.setPresentEmployeeCount(presentEmployeeCount);
        reportResult.setAbsentEmployeeCount(absentEmployeeCount);
        return reportResult;
    }

    public ReportResult getAttendanceStatsByProjectIdDateRange(long userId, Long projectId, Date selectedDate, Date endDate) {
        log.info("Attendance report params : projectId - "+ projectId + ", selectedDate - " + selectedDate + ", endDate -" + endDate );
        Calendar startCal = DateUtils.toCalendar(selectedDate);
	    	startCal.set(Calendar.HOUR_OF_DAY, 0);
	    	startCal.set(Calendar.MINUTE, 0);
	    	Calendar endCal = DateUtils.toCalendar(endDate);
	    	endCal.set(Calendar.HOUR_OF_DAY, 23);
	    	endCal.set(Calendar.MINUTE, 59);

        java.sql.Date sqlDate = new java.sql.Date(startCal.getTimeInMillis());
        java.sql.Date sqlEndDate = new java.sql.Date(endCal.getTimeInMillis());
        long totalEmployeeCount = 0;
        long presentEmployeeCount = 0;
        long absentEmployeeCount = 0;
        if(projectId > 0) {
            totalEmployeeCount = employeeRepository.findCountByProjectId(projectId);
        }else {
        		if(userId > 0) {
        			User user = userRepository.findOne(userId);
        			if(user.getUserRole().getName().equalsIgnoreCase("Admin")) {
        				totalEmployeeCount = employeeRepository.findTotalCount();
        			}else {
	        			Employee emp = user.getEmployee();
	        			List<EmployeeProjectSite> projSites = emp.getProjectSites();
	        			List<Long> projIds = new ArrayList<Long>();
	        			if(CollectionUtils.isNotEmpty(projSites)) {
	        				for(EmployeeProjectSite projSite : projSites) {
	        					projIds.add(projSite.getProject().getId());
	        				}
	        			}
	        			totalEmployeeCount = employeeRepository.findTotalCount(projIds);
        			}
        		}else {
        			totalEmployeeCount = employeeRepository.findTotalCount();
        		}
        }
        if(projectId > 0) {
            presentEmployeeCount = attendanceRepository.findCountBySiteAndCheckInTime(projectId, sqlDate, sqlEndDate);
        }else {
        		if(userId > 0) {
        			User user = userRepository.findOne(userId);
        			if(user.getUserRole().getName().equalsIgnoreCase("Admin")) {
        				presentEmployeeCount = attendanceRepository.findCountByCheckInTime(sqlDate, sqlEndDate);
        			}else {
	        			Employee emp = user.getEmployee();
	        			List<EmployeeProjectSite> projSites = emp.getProjectSites();
	        			List<Long> siteIds = new ArrayList<Long>();
	        			if(CollectionUtils.isNotEmpty(projSites)) {
	        				for(EmployeeProjectSite projSite : projSites) {
	        					siteIds.add(projSite.getSite().getId());
	        				}
	        			}
	        			presentEmployeeCount = attendanceRepository.findCountByCheckInTime(siteIds, sqlDate, sqlEndDate);
        			}
        		}else {
        			presentEmployeeCount = attendanceRepository.findCountByCheckInTime(sqlDate, sqlEndDate);
        		}
        }
        absentEmployeeCount = totalEmployeeCount - presentEmployeeCount;
        ReportResult reportResult = new ReportResult();
        reportResult.setProjectId(projectId);
        reportResult.setTotalEmployeeCount(totalEmployeeCount);
        reportResult.setPresentEmployeeCount(presentEmployeeCount);
        reportResult.setAbsentEmployeeCount(absentEmployeeCount);
        return reportResult;
    }


    public ReportResult getAttendanceStatsByRegion(long userId, Long projectId,String region, Date selectedDate, Date endDate) {
        log.info("Attendance report params : projectId - "+ projectId + ", selectedDate - " + selectedDate + ", endDate -" + endDate );
        Calendar startCal = DateUtils.toCalendar(selectedDate);
        startCal.set(Calendar.HOUR_OF_DAY, 0);
        startCal.set(Calendar.MINUTE, 0);
        Calendar endCal = DateUtils.toCalendar(endDate);
        endCal.set(Calendar.HOUR_OF_DAY, 23);
        endCal.set(Calendar.MINUTE, 59);

        java.sql.Date sqlDate = new java.sql.Date(startCal.getTimeInMillis());
        java.sql.Date sqlEndDate = new java.sql.Date(endCal.getTimeInMillis());
        long totalEmployeeCount = 0;
        long presentEmployeeCount = 0;
        long absentEmployeeCount = 0;
        if(projectId > 0) {
            List<Long> siteIds = siteRepository.findByRegion(projectId,region);
            if(siteIds.size()>0){
                totalEmployeeCount = employeeRepository.findTotalCountBySites(siteIds);
                presentEmployeeCount = attendanceRepository.findCountBySiteAndCheckInTime(projectId, sqlDate, sqlEndDate);
            }
        }
        absentEmployeeCount = totalEmployeeCount - presentEmployeeCount;
        ReportResult reportResult = new ReportResult();
        reportResult.setProjectId(projectId);
        reportResult.setTotalEmployeeCount(totalEmployeeCount);
        reportResult.setPresentEmployeeCount(presentEmployeeCount);
        reportResult.setAbsentEmployeeCount(absentEmployeeCount);
        return reportResult;
    }

    public ReportResult getAttendanceStatsByBranch(long userId, Long projectId,String region,String branch, Date selectedDate, Date endDate) {
        log.info("Attendance report params : projectId - "+ projectId + ", selectedDate - " + selectedDate + ", endDate -" + endDate );
        Calendar startCal = DateUtils.toCalendar(selectedDate);
        startCal.set(Calendar.HOUR_OF_DAY, 0);
        startCal.set(Calendar.MINUTE, 0);
        Calendar endCal = DateUtils.toCalendar(endDate);
        endCal.set(Calendar.HOUR_OF_DAY, 23);
        endCal.set(Calendar.MINUTE, 59);

        java.sql.Date sqlDate = new java.sql.Date(startCal.getTimeInMillis());
        java.sql.Date sqlEndDate = new java.sql.Date(endCal.getTimeInMillis());
        long totalEmployeeCount = 0;
        long presentEmployeeCount = 0;
        long absentEmployeeCount = 0;
        if(projectId > 0) {
            List<Long> siteIds = siteRepository.findByRegionAndBranch(projectId,region,branch);
            if(siteIds.size()>0){
                totalEmployeeCount = employeeRepository.findTotalCountBySites(siteIds);
                presentEmployeeCount = attendanceRepository.findCountBySiteAndCheckInTime(projectId, sqlDate, sqlEndDate);
            }
        }
        absentEmployeeCount = totalEmployeeCount - presentEmployeeCount;
        ReportResult reportResult = new ReportResult();
        reportResult.setProjectId(projectId);
        reportResult.setTotalEmployeeCount(totalEmployeeCount);
        reportResult.setPresentEmployeeCount(presentEmployeeCount);
        reportResult.setAbsentEmployeeCount(absentEmployeeCount);
        return reportResult;
    }


    public ReportResult getAttendanceStatsDateRange(Long siteId) {
        log.info("Attendance report params : siteId - "+ siteId);
        Calendar toCal = Calendar.getInstance();
        Calendar fromCal = Calendar.getInstance();
        	fromCal.add(Calendar.DAY_OF_MONTH, -10);
	    	fromCal.set(Calendar.HOUR_OF_DAY, 0);
	    	fromCal.set(Calendar.MINUTE, 0);
	    	toCal.set(Calendar.HOUR_OF_DAY, 23);
	    	toCal.set(Calendar.MINUTE, 59);

        java.sql.Date sqlDate = new java.sql.Date(fromCal.getTimeInMillis());
        java.sql.Date sqlEndDate = new java.sql.Date(toCal.getTimeInMillis());
        long totalEmployeeCount = 0;
        long presentEmployeeCount = 0;
        long absentEmployeeCount = 0;
        if(siteId > 0) {
            totalEmployeeCount = employeeRepository.findCountBySiteId(siteId);
        }else {
            totalEmployeeCount = employeeRepository.findTotalCount();
        }
        if(siteId > 0) {
            presentEmployeeCount = attendanceRepository.findCountBySiteAndCheckInTime(siteId, sqlDate, sqlEndDate);
        }else {
            presentEmployeeCount = attendanceRepository.findCountByCheckInTime(sqlDate, sqlEndDate);
        }
        absentEmployeeCount = totalEmployeeCount - presentEmployeeCount;
        ReportResult reportResult = new ReportResult();
        reportResult.setSiteId(siteId);
        reportResult.setTotalEmployeeCount(totalEmployeeCount);
        reportResult.setPresentEmployeeCount(presentEmployeeCount);
        reportResult.setAbsentEmployeeCount(absentEmployeeCount);
        return reportResult;
    }

    public ReportResult getTicketStatsByProjectAndDateRange(long userId, long projectId, Date selectedDate, Date endDate) {
    		List<Site> sites = siteRepository.findSites(projectId);
    		if(CollectionUtils.isNotEmpty(sites)) {
    			List<Long> siteIds = new ArrayList<Long>();
    			for(Site site : sites) {
    				siteIds.add(site.getId());
    			}
    			return getTicketStatsDateRange(userId, siteIds, selectedDate, endDate);
    		}
    		return new ReportResult();
    }


    public ReportResult getTicketStatsDateRange(long userId, List<Long> siteIds, Date selectedDate, Date endDate) {
        log.info("Ticket report params : siteId - "+ siteIds + ", selectedDate - " + selectedDate + ", endDate -" + endDate );
        Calendar startCal = DateUtils.toCalendar(selectedDate);
	    	startCal.set(Calendar.HOUR_OF_DAY, 0);
	    	startCal.set(Calendar.MINUTE, 0);
	    	//startCal.setTimeZone(TimeZone.getDefault());
	    	Calendar endCal = DateUtils.toCalendar(endDate);
	    	endCal.set(Calendar.HOUR_OF_DAY, 23);
	    	endCal.set(Calendar.MINUTE, 59);
	    	//endCal.setTimeZone(TimeZone.getDefault());
        //java.sql.Date sqlDate = new java.sql.Date(startCal.getTimeInMillis());
        Timestamp sqlDate = DateUtil.convertToTimestamp(startCal.getTime());
	    	ZoneId  zone = ZoneId.of("Asia/Kolkata");
        ZonedDateTime startZDate = sqlDate.toLocalDateTime().atZone(zone).withHour(0).withMinute(0);

        //java.sql.Date sqlEndDate = new java.sql.Date(endCal.getTimeInMillis());
        Timestamp sqlEndDate = DateUtil.convertToTimestamp(endCal.getTime());
        ZonedDateTime endZDate = sqlEndDate.toLocalDateTime().atZone(zone).withHour(23).withMinute(59);
        //create sql dates
        java.sql.Date sqlFromDate = DateUtil.convertToSQLDate(startCal.getTime());
        java.sql.Date sqlToDate = DateUtil.convertToSQLDate(endCal.getTime());
        
        long totalNewTicketCount = 0;
        long totalOpenTicketCount = 0;
        long totalInProgressTicketCount = 0;
        long totalAssignedTicketCount = 0;
        long totalClosedTicketCount = 0;
        long totalPendingTicketCount = 0;
        long totalPendingDueToClientTicketCount = 0;
        long totalPendingDueToCompanyTicketCount = 0;
        log.info("Ticket report params : siteId - "+ siteIds + ", startZDate - " + startZDate + ", endZDate -" + endZDate );

        totalNewTicketCount = ticketRepository.findCountBySiteIdAndDateRange(siteIds, startZDate, endZDate);
        
        totalOpenTicketCount = ticketRepository.findOpenTicketsBySiteIdAndDateRange(siteIds, startZDate, endZDate);
        
        totalInProgressTicketCount = ticketRepository.findInProgressTicketsBySiteIdAndDateRange(siteIds, startZDate, endZDate);

        totalPendingTicketCount = ticketRepository.findOpenCountBySiteIdAndDateRange(siteIds, startZDate, endZDate);
        
        totalAssignedTicketCount = ticketRepository.findAssignedCountBySiteIdStatusAndDateRange(siteIds, startZDate, endZDate);

        totalClosedTicketCount = ticketRepository.findClosedCountBySiteIdStatusAndDateRange(siteIds, sqlFromDate, sqlToDate);

        totalPendingDueToClientTicketCount = ticketRepository.findOpenCountBySiteIdAndDateRangeDueToClient(siteIds, startZDate, endZDate);

        totalPendingDueToCompanyTicketCount = ticketRepository.findOpenCountBySiteIdAndDateRangeDueToCompany(siteIds, startZDate, endZDate);

        //open ticket counts for different day range
        Map<String, Long> openTicketCounts = new HashMap<String, Long>();
        int min = 0;
        int max = 3;
        String range = min +"-"+max;


        openTicketCounts.put(range, getPendingTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));
        min = 4;
        max = 5;
        range = min +"-"+max;
        openTicketCounts.put(range, getPendingTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));
        min = 6;
        max = 7;
        range = min +"-"+max;
        openTicketCounts.put(range, getPendingTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));
        min = 8;
        max = 10;
        range = min +"-"+max;
        openTicketCounts.put(range, getPendingTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));
        min = 11;
        max = 365;
        range = min +"-"+max;
        openTicketCounts.put(range, getPendingTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));

        //closed ticket counts for different day range
        Map<String, Long> closedTicketCounts = new HashMap<String, Long>();

        min = 0;
        max = 3;
        range = min +"-"+max;
        closedTicketCounts.put(range, getClosedTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));
        min = 4;
        max = 5;
        range = min +"-"+max;
        closedTicketCounts.put(range, getClosedTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));
        min = 6;
        max = 7;
        range = min +"-"+max;
        closedTicketCounts.put(range, getClosedTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));
        min = 8;
        max = 10;
        range = min +"-"+max;
        closedTicketCounts.put(range, getClosedTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));
        min = 11;
        max = 365;
        range = "> " + min;
        closedTicketCounts.put(range, getClosedTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));


        ReportResult reportResult = new ReportResult();
        //reportResult.setSiteId(siteId);
        reportResult.setTotalTicketCount(totalOpenTicketCount + totalInProgressTicketCount + totalAssignedTicketCount + totalClosedTicketCount);
        reportResult.setTotalNewTicketCount(totalNewTicketCount);
        reportResult.setTotalOpenTicketCount(totalOpenTicketCount);
        reportResult.setTotalInProgressTicketCount(totalInProgressTicketCount);
        reportResult.setTotalAssignedTicketCount(totalAssignedTicketCount + totalInProgressTicketCount);
        reportResult.setTotalPendingTicketCount(totalPendingTicketCount);
        reportResult.setTotalClosedTicketCount(totalClosedTicketCount);
        reportResult.setTotalPendingDueToClientTicketCount(totalPendingDueToClientTicketCount);
        reportResult.setTotalPendingDueToCompanyTicketCount(totalPendingDueToCompanyTicketCount);

        reportResult.setOpenTicketCounts(openTicketCounts);

        reportResult.setClosedTicketCounts(closedTicketCounts);

        //site name and project name
        long siteId = siteIds.get(0);
        Site site = siteRepository.findOne(siteId);
        reportResult.setProjectName(site.getProject().getName());

        return reportResult;
    }

    public ReportResult getTicketStatsDateRangeByRegion(long userId,long projectId, String region, Date selectedDate, Date endDate) {
        log.info("Ticket report params : projectId - " + projectId + ", selectedDate - " + selectedDate + ", endDate -" + endDate);
        List<Long> siteIds = siteRepository.findByRegion(projectId, region);

        return getTicketStatsDateRangeByBranchorRegion(siteIds,selectedDate,endDate);
    }

    public ReportResult getTicketStatsDateRangeByBranch(long userId, long projectId, String region, String branch, Date selectedDate, Date endDate) {
        List<Long> siteIds = siteRepository.findByRegionAndBranch(projectId,region,branch);
        return getTicketStatsDateRangeByBranchorRegion(siteIds,selectedDate,endDate);
    }

    public ReportResult getTicketStatsDateRangeByBranchorRegion(List<Long> siteIds,Date selectedDate, Date endDate){

        Calendar startCal = DateUtils.toCalendar(selectedDate);
        startCal.set(Calendar.HOUR_OF_DAY, 0);
        startCal.set(Calendar.MINUTE, 0);
        //startCal.setTimeZone(TimeZone.getDefault());
        Calendar endCal = DateUtils.toCalendar(endDate);
        endCal.set(Calendar.HOUR_OF_DAY, 23);
        endCal.set(Calendar.MINUTE, 59);
        //endCal.setTimeZone(TimeZone.getDefault());
        //java.sql.Date sqlDate = new java.sql.Date(startCal.getTimeInMillis());
        Timestamp sqlDate = DateUtil.convertToTimestamp(startCal.getTime());
        ZoneId  zone = ZoneId.of("Asia/Kolkata");
        ZonedDateTime startZDate = sqlDate.toLocalDateTime().atZone(zone).withHour(0).withMinute(0);

        //java.sql.Date sqlEndDate = new java.sql.Date(endCal.getTimeInMillis());
        Timestamp sqlEndDate = DateUtil.convertToTimestamp(endCal.getTime());
        ZonedDateTime endZDate = sqlEndDate.toLocalDateTime().atZone(zone).withHour(23).withMinute(59);
        long totalNewTicketCount = 0;
        long totalClosedTicketCount = 0;
        long totalPendingTicketCount = 0;
        long totalPendingDueToClientTicketCount = 0;
        long totalPendingDueToCompanyTicketCount = 0;
        log.info("Ticket report params : siteId - "+ siteIds + ", startZDate - " + startZDate + ", endZDate -" + endZDate );

        totalNewTicketCount = ticketRepository.findCountBySiteIdAndDateRange(siteIds, startZDate, endZDate);

        totalPendingTicketCount = ticketRepository.findOpenCountBySiteIdAndDateRange(siteIds, startZDate, endZDate);

        totalClosedTicketCount = ticketRepository.findCountBySiteIdStatusAndDateRange(siteIds, "Closed", startZDate, endZDate);

        totalPendingDueToClientTicketCount = ticketRepository.findOpenCountBySiteIdAndDateRangeDueToClient(siteIds, startZDate, endZDate);

        totalPendingDueToCompanyTicketCount = ticketRepository.findOpenCountBySiteIdAndDateRangeDueToCompany(siteIds, startZDate, endZDate);

        //open ticket counts for different day range
        Map<String, Long> openTicketCounts = new HashMap<String, Long>();
        int min = 0;
        int max = 3;
        String range = min +"-"+max;


        openTicketCounts.put(range, getPendingTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));
        min = 4;
        max = 5;
        range = min +"-"+max;
        openTicketCounts.put(range, getPendingTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));
        min = 6;
        max = 7;
        range = min +"-"+max;
        openTicketCounts.put(range, getPendingTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));
        min = 8;
        max = 10;
        range = min +"-"+max;
        openTicketCounts.put(range, getPendingTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));
        min = 11;
        max = 365;
        range = min +"-"+max;
        openTicketCounts.put(range, getPendingTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));

        //closed ticket counts for different day range
        Map<String, Long> closedTicketCounts = new HashMap<String, Long>();

        min = 0;
        max = 3;
        range = min +"-"+max;
        closedTicketCounts.put(range, getClosedTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));
        min = 4;
        max = 5;
        range = min +"-"+max;
        closedTicketCounts.put(range, getClosedTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));
        min = 6;
        max = 7;
        range = min +"-"+max;
        closedTicketCounts.put(range, getClosedTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));
        min = 8;
        max = 10;
        range = min +"-"+max;
        closedTicketCounts.put(range, getClosedTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));
        min = 11;
        max = 365;
        range = "> " + min;
        closedTicketCounts.put(range, getClosedTicketCountByDayRange(siteIds, min, max, sqlDate, sqlEndDate));


        ReportResult reportResult = new ReportResult();
        //reportResult.setSiteId(siteId);
        reportResult.setTotalNewTicketCount(totalNewTicketCount);
        reportResult.setTotalPendingTicketCount(totalPendingTicketCount);
        reportResult.setTotalClosedTicketCount(totalClosedTicketCount);
        reportResult.setTotalPendingDueToClientTicketCount(totalPendingDueToClientTicketCount);
        reportResult.setTotalPendingDueToCompanyTicketCount(totalPendingDueToCompanyTicketCount);

        reportResult.setOpenTicketCounts(openTicketCounts);

        reportResult.setClosedTicketCounts(closedTicketCounts);

        //site name and project name
        long siteId = siteIds.get(0);
        Site site = siteRepository.findOne(siteId);
        reportResult.setProjectName(site.getProject().getName());

        return reportResult;
    }


    private Long getPendingTicketCountByDayRange(List<Long> siteIds, int min, int max, Date sqlDate, Date sqlEndDate) {
        Query query = manager.createNativeQuery("select sum(cnt) from (select timediff, count(id) as cnt from (SELECT datediff(now(),t.created_date) as timediff, t.id as id from ticket t where t.site_id IN (:siteIds) and t.status <> 'Closed'  and t.created_date between :startDate and :endDate) as timediffresult group by timediff) as result where timediff >= :min and timediff <= :max ");
        query.setParameter("siteIds", siteIds);
        query.setParameter("min", min);
        query.setParameter("max", max);
        query.setParameter("startDate", sqlDate);
        query.setParameter("endDate", sqlEndDate);

        Object result = query.getSingleResult();
        BigDecimal resultVal = (BigDecimal)result;
        log.debug("Pending result counts ----"+result);
        return resultVal != null ? resultVal.longValue() : 0;

    }

    private Long getClosedTicketCountByDayRange(List<Long> siteIds, int min, int max, Date sqlDate, Date sqlEndDate) {
        Query query = manager.createNativeQuery("select sum(result.cnt) from (select timediff, count(id) as cnt from (SELECT datediff(now(),t.created_date) as timediff, t.id as id from ticket t where t.site_id IN (:siteIds) and t.status = 'Closed' and t.created_date between :startDate and :endDate) as timediffresult group by timediff) as result where timediff >= :min and timediff <= :max ");
        query.setParameter("siteIds", siteIds);
        query.setParameter("min", min);
        query.setParameter("max", max);
        query.setParameter("startDate", sqlDate);
        query.setParameter("endDate", sqlEndDate);

        Object result = query.getSingleResult();
        BigDecimal resultVal = (BigDecimal)result;
        return resultVal != null ? resultVal.longValue() : 0;

    }
}
