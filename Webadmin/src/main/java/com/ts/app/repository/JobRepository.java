package com.ts.app.repository;

import com.ts.app.domain.Job;
import com.ts.app.domain.JobStatus;
import com.ts.app.domain.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.sql.Date;
import java.util.List;
import java.util.Map;

public interface JobRepository extends JpaRepository<Job, Long>,JpaSpecificationExecutor<Job> {

	Page<Job> findBySiteId(Long siteId, Pageable pageRequest);

    @Temporal(TemporalType.DATE)

	@Modifying
	@Query("UPDATE Job j SET j.status = :jobStatus WHERE j.site.id = :siteId and j.plannedEndTime < :now and j.status = :currentJobStatus")
	@Transactional
	void updateJobOverdueStatus(@Param("siteId") Long siteId, @Param("jobStatus") JobStatus jobStatus, @Param("now") Date now, @Param("currentJobStatus") JobStatus currentJobStatus);

    @Query("SELECT count(j.id) from Job j where j.site.id = :siteId and j.plannedStartTime = :selDate and j.status = :currentJobStatus")
    long findJobCountBySiteIdAndStatus(@Param("siteId") Long siteId, @Param("selDate") Date selDate, @Param("currentJobStatus") JobStatus currentJobStatus);

    @Query("SELECT count(j.id) from Job j where j.site.id = :siteId and (j.plannedStartTime between :selDate and :endDate)")
    long findTotalJobCountBySiteIdAndDateRange(@Param("siteId") Long siteId, @Param("selDate") Date selDate, @Param("endDate") Date endDate);

    @Query("SELECT count(j.id) from Job j where j.site.id = :siteId and (j.plannedStartTime between :selDate and :endDate) and j.status = :currentJobStatus")
    long findJobCountBySiteIdAndStatusDateRange(@Param("siteId") Long siteId, @Param("selDate") Date selDate, @Param("endDate") Date endDate, @Param("currentJobStatus") JobStatus currentJobStatus);

    @Query("SELECT count(j.id) from Job j where j.site.id = :siteId and (j.plannedStartTime between :selDate and :endDate) and j.status = :currentJobStatus group by j.plannedStartTime")
    long findJobCountForReports(@Param("siteId") Long siteId, @Param("selDate") Date selDate, @Param("endDate") Date endDate, @Param("currentJobStatus") JobStatus currentJobStatus);

    @Query("SELECT new map(j.plannedStartTime as date ,count(j.id) as count) from Job j where j.site.id = :siteId and (j.plannedStartTime between :selDate and :endDate) and j.status = :currentJobStatus group by j.plannedStartTime order by j.plannedStartTime")
    Map<Date, Long> findJobCountByDateForReports(@Param("siteId") Long siteId, @Param("selDate") Date selDate, @Param("endDate") Date endDate, @Param("currentJobStatus") JobStatus currentJobStatus);

    @Query("SELECT new map(j.plannedStartTime as date ,count(j.id) as count) from Job j where j.site.id = :siteId and (j.plannedStartTime between :selDate and :endDate) group by j.plannedStartTime order by j.plannedStartTime")
    Map<Date, Long> findTotalJobCountByDateForReports(@Param("siteId") Long siteId, @Param("selDate") Date selDate, @Param("endDate") Date endDate);

    @Query("SELECT j from Job j where (j.plannedEndTime < :currDateTime) and (j.status < 3 or j.status = 4) ")
    List<Job> findOverdueJobsByStatusAndEndDateTime(@Param("currDateTime") java.util.Date endDate);

    @Query("SELECT new map(type as jobType ,count(j.id) as count) from Job j where j.site.id = :siteId and j.plannedStartTime = :selDate group by j.type")
    Map<JobType, Long> findJobCountByType(@Param("siteId") Long siteId, @Param("selDate") Date selDate);

    @Query("SELECT new map(type as jobType ,count(j.id) as count) from Job j where j.site.id = :siteId and (j.plannedStartTime between :selDate and :endDate) group by j.type")
    Map<JobType, Long> findJobCountByTypeDateRange(@Param("siteId") Long siteId, @Param("selDate") Date selDate, @Param("endDate") Date endDate);

    @Query("SELECT j from Job j where j.title = :title and j.site.id = :siteId and j.plannedStartTime between :startDate and :endDate ")
    List<Job> findJobByTitleSiteAndDate(@Param("title") String title, @Param("siteId") Long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT j from Job j where j.site.id = :siteId and j.status = :currentJobStatus and j.scheduled = :scheduled and (j.plannedStartTime between :startDate and :endDate) and (j.employee.user.id = :userId or j.employee.id in (:subEmpIds))")
    Page<Job> findByDateRange(@Param("siteId") long siteId, @Param("userId") long userId, @Param("subEmpIds") List<Long> subEmpIds, @Param("currentJobStatus") JobStatus currentJobStatus, @Param("startDate") Date startDate, @Param("endDate") Date endDate, @Param("scheduled") boolean scheduled, Pageable pageRequest);

    @Query("SELECT j from Job j where j.site.id = :siteId and j.status = :currentJobStatus and j.scheduled = :scheduled and j.location.id=:locationId and (j.plannedStartTime between :startDate and :endDate) and (j.employee.user.id = :userId or j.employee.id in (:subEmpIds))")
    Page<Job> findByDateRangeAndLocation(@Param("siteId") long siteId, @Param("userId") long userId, @Param("subEmpIds") List<Long> subEmpIds, @Param("currentJobStatus") JobStatus currentJobStatus, @Param("startDate") Date startDate, @Param("endDate") Date endDate, @Param("scheduled") boolean scheduled, @Param("locationId") long locationId, Pageable pageRequest);

    @Query("SELECT j from Job j where j.site.id = :siteId and j.status = :currentJobStatus and j.location.id=:locationId and (j.plannedStartTime between :startDate and :endDate) and (j.employee.user.id = :userId or j.employee.id in (:subEmpIds))")
    Page<Job> findByDateRangeAndLocation(@Param("siteId") long siteId, @Param("userId") long userId, @Param("subEmpIds") List<Long> subEmpIds, @Param("currentJobStatus") JobStatus currentJobStatus, @Param("startDate") Date startDate, @Param("endDate") Date endDate, @Param("locationId") long locationId, Pageable pageRequest);

    @Query("SELECT j from Job j where j.site.id = :siteId and j.status = 4 and j.location.id=:locationId and (j.plannedStartTime between :startDate and :endDate) and (j.employee.user.id = :userId or j.employee.id in (:subEmpIds))")
    Page<Job> findOverDueJobsByDateRangeAndLocation(@Param("siteId") long siteId, @Param("userId") long userId, @Param("subEmpIds") List<Long> subEmpIds, @Param("startDate") Date startDate, @Param("endDate") Date endDate, @Param("locationId") long locationId, Pageable pageRequest);

    @Query("SELECT count(j.id) from Job j where j.site.id = :siteId and (j.plannedStartTime between :selDate and :endDate) and j.status = :currentJobStatus and j.location.id = :locationId" )
    long jobCountByLocationSiteIdAndStatus (@Param("siteId") Long siteId, @Param("selDate") Date selDate, @Param("endDate") Date endDate, @Param("currentJobStatus") JobStatus currentJobStatus, @Param("locationId") Long locationId);
//    @Query("SELECT j from Job j where j.site.id =:siteId and (j.plannedStartTime between :startDate and :endDate)")
//     List<Job>findAll(@Param("employeeId") Long id,@Param("siteId") long siteId,@Param("startDate") Date startDate,@Param("endDate") Date endDate);



//    @Query("select j from Job j where j.site.id = :siteId and j.plannedStartTime = :selDate and j.status = :jobStatus order by j.plannedStartTime asc")
//    Job findByDateSelected(@Param("siteId") Long siteId, @Param("jobStatus") JobStatus jobStatus,@Param("now") Date now, @Param("selDate") Date selDate );

    @Query("SELECT count(j.id) from Job j where j.site.id = :siteId and j.status = :currentJobStatus" )
    long jobCountBySiteAndStatus(@Param("siteId") Long siteId, @Param("currentJobStatus") JobStatus currentJobStatus);

    @Query("SELECT count(j.id) from Job j where j.site.id = :siteId" )
    long jobCountBySite(@Param("siteId") Long siteId);

    //    @Query("SELECT count(j.id) from Job j where j.site.id = :siteId and j.status = :currentJobStatus and j.jobType = :jobType" )
//    long jobCountBySiteAndStatusAndType(@Param("siteId") Long siteId, @Param("currentJobStatus") JobStatus currentJobStatus, @Param("jobType") JobType jobType);

    @Query("SELECT count(j.id) from Job j where j.site.id = :siteId and j.status = :currentJobStatus and j.plannedEndTime < j.actualEndTime" )
    long jobCountTAT (@Param("siteId") Long siteId, @Param("currentJobStatus") JobStatus currentJobStatus);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and (j.employee.user.id = :userId or j.employee.id in (:subEmpIds))")
    Page<Job> findByDateRange(@Param("userId") long userId, @Param("subEmpIds") List<Long> subEmpIds, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and j.employee.id = :empId")
    List<Job> findByDateRangeAndEmployee(@Param("empId")Long empId,@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and j.employee.id = :empId")
    Page<Job> findByStartDateAndEmployee(@Param("empId")Long empId,@Param("startDate") Date startDate, @Param("endDate") Date endDate,Pageable pageRequest);

    @Query("SELECT j from Job j where  (j.plannedStartTime >= :startDate) and j.employee.id = :empId")
    Page<Job> findByStartDateAndEmployee(@Param("empId")Long empId,@Param("startDate") Date startDate,Pageable pageRequest);

    @Query("SELECT j from Job j where  (j.plannedStartTime >= :startDate) and j.employee.id = :empId")
    List<Job> findByStartDateAndEmployee(@Param("empId")Long empId,@Param("startDate") Date startDate);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and j.employee.id = :empId and j.site.id = :siteId")
    Page<Job> findByStartDateSiteAndEmployee(@Param("siteId") long siteId, @Param("empId") long empId,@Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and j.site.id = :siteId")
    Page<Job> findByStartDateAndSite(@Param("siteId") long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate,Pageable pageRequest);

    @Query("SELECT j from Job j where  j.site.id IN (:siteIds) order by j.plannedStartTime desc")
    Page<Job> findByStartDateAndSites(@Param("siteIds") List<Long> siteIds, Pageable pageRequest);


    @Query("SELECT j from Job j where  (j.employee.user.id = :userId or j.employee.id in (:subEmpIds))")
    List<Job> findWithoutDateRange(@Param("userId") long userId, @Param("subEmpIds") List<Long> subEmpIds);

    @Query("DELETE from Job j where j.parentJob.id = :parentJobId and j.plannedStartTime between :startDate and :endDate ")
    void deleteScheduledJobs(@Param("parentJobId") long parentJobId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Modifying
    @Query("DELETE from Job j where j.employee.id=:empId and j.plannedStartTime>=:startDate ")
    @Transactional
    void deleteEmployeeUpcomingJobs(@Param("empId") long empId, @Param("startDate") Date startDate);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and (j.employee.user.id = :userId or j.employee.id in (:subEmpIds)) and j.status = :currentJobStatus")
    Page<Job> findByStatusAndDateRange(@Param("userId") long userId, @Param("subEmpIds") List<Long> subEmpIds, @Param("startDate") Date startDate, @Param("endDate") Date endDate, @Param("currentJobStatus") JobStatus currentJobStatus, Pageable pageRequest);

    @Query("SELECT j from Job j where  (j.site.id = :siteId and j.plannedStartTime between :startDate and :endDate) and (j.employee.user.id = :userId or j.employee.id in (:subEmpIds)) and j.status = :currentJobStatus")
    Page<Job> findBySiteIdAndStatusAndDateRange(@Param("siteId") Long siteId, @Param("userId") long userId, @Param("subEmpIds") List<Long> subEmpIds, @Param("startDate") Date startDate, @Param("endDate") Date endDate, @Param("currentJobStatus") JobStatus currentJobStatus, Pageable pageRequest);

    @Query("SELECT j from Job j where  (j.site.project.id = :projectId and j.plannedStartTime between :startDate and :endDate) and (j.employee.user.id = :userId or j.employee.id in (:subEmpIds)) and j.status = :currentJobStatus")
    Page<Job> findByProjectIdAndStatusAndDateRange(@Param("projectId") Long projectId, @Param("userId") long userId, @Param("subEmpIds") List<Long> subEmpIds, @Param("startDate") Date startDate, @Param("endDate") Date endDate, @Param("currentJobStatus") JobStatus currentJobStatus, Pageable pageRequest);

}
