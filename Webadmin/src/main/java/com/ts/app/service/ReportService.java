package com.ts.app.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.JobStatus;
import com.ts.app.domain.JobType;
import com.ts.app.domain.User;
import com.ts.app.repository.AttendanceRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.web.rest.dto.ReportResult;

@Service
public class ReportService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(ReportService.class);

	@Inject
	private JobRepository jobRepository;

	@Inject
	private SiteRepository siteRepository;

    @Inject
    private EmployeeRepository employeeRepository;
    
    @Inject
    private UserRepository userRepository;

    @Inject
    private AttendanceRepository attendanceRepository;

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
        			if(!user.isAdmin()) {
	        			Employee emp = user.getEmployee();
	        			List<EmployeeProjectSite> projSites = emp.getProjectSites();
	        			List<Long> projIds = new ArrayList<Long>(); 
	        			if(CollectionUtils.isNotEmpty(projSites)) {
	        				for(EmployeeProjectSite projSite : projSites) {
	        					projIds.add(projSite.getProjectId());
	        				}
	        			}
	        			totalEmployeeCount = employeeRepository.findTotalCount(projIds);
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
        			if(!user.isAdmin()) {
	        			Employee emp = user.getEmployee();
	        			List<EmployeeProjectSite> projSites = emp.getProjectSites();
	        			List<Long> siteIds = new ArrayList<Long>(); 
	        			if(CollectionUtils.isNotEmpty(projSites)) {
	        				for(EmployeeProjectSite projSite : projSites) {
	        					siteIds.add(projSite.getSiteId());
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
            totalEmployeeCount = employeeRepository.findCountBySiteId(projectId);
        }else {
        		if(userId > 0) {
        			User user = userRepository.findOne(userId);
        			Employee emp = user.getEmployee();
        			List<EmployeeProjectSite> projSites = emp.getProjectSites();
        			List<Long> projIds = new ArrayList<Long>(); 
        			if(CollectionUtils.isNotEmpty(projSites)) {
        				for(EmployeeProjectSite projSite : projSites) {
        					projIds.add(projSite.getProjectId());
        				}
        			}
        			totalEmployeeCount = employeeRepository.findTotalCount(projIds);	
        		}else {
        			totalEmployeeCount = employeeRepository.findTotalCount();
        		}
        }
        if(projectId > 0) {
            presentEmployeeCount = attendanceRepository.findCountBySiteAndCheckInTime(projectId, sqlDate, sqlEndDate);
        }else {
        		if(userId > 0) {
        			User user = userRepository.findOne(userId);
        			Employee emp = user.getEmployee();
        			List<EmployeeProjectSite> projSites = emp.getProjectSites();
        			List<Long> siteIds = new ArrayList<Long>(); 
        			if(CollectionUtils.isNotEmpty(projSites)) {
        				for(EmployeeProjectSite projSite : projSites) {
        					siteIds.add(projSite.getSiteId());
        				}
        			}
        			presentEmployeeCount = attendanceRepository.findCountByCheckInTime(siteIds, sqlDate, sqlEndDate);	
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


}
