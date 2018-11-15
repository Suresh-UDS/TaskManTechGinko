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
import org.springframework.security.access.method.P;
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

    @Query("SELECT count(j.id) from Job j where j.site.project.id = :projectId and (j.plannedStartTime between :selDate and :endDate)")
    long findTotalJobCountByProjectAndDateRange(@Param("projectId") Long projectId, @Param("selDate") Date selDate, @Param("endDate") Date endDate);
    
    @Query("SELECT count(j.id) from Job j where j.site.project.id = :projectId and j.site.region = :region and (j.plannedStartTime between :selDate and :endDate)")
    long findTotalJobCountByProjectRegionAndDateRange(@Param("projectId") Long projectId, @Param("region") String region, @Param("selDate") Date selDate, @Param("endDate") Date endDate);

    @Query("SELECT count(j.id) from Job j where j.site.project.id = :projectId and j.site.region = :region and j.site.branch = :branch and (j.plannedStartTime between :selDate and :endDate)")
    long findTotalJobCountByProjectRegionBranchAndDateRange(@Param("projectId") Long projectId, @Param("region") String region,@Param("branch") String branch, @Param("selDate") Date selDate, @Param("endDate") Date endDate);

    @Query("SELECT count(j.id) from Job j where j.site.id = :siteId and (j.plannedStartTime between :selDate and :endDate) and j.status = :currentJobStatus")
    long findJobCountBySiteIdAndStatusDateRange(@Param("siteId") Long siteId, @Param("selDate") Date selDate, @Param("endDate") Date endDate, @Param("currentJobStatus") JobStatus currentJobStatus);

    @Query("SELECT count(j.id) from Job j where j.site.project.id = :projectId and (j.plannedStartTime between :selDate and :endDate) and j.status = :currentJobStatus")
    long findJobCountByProjectAndStatusDateRange(@Param("projectId") Long projectId, @Param("selDate") Date selDate, @Param("endDate") Date endDate, @Param("currentJobStatus") JobStatus currentJobStatus);

    @Query("SELECT count(j.id) from Job j where j.site.project.id = :projectId and j.site.region = :region and (j.plannedStartTime between :selDate and :endDate) and j.status = :currentJobStatus")
    long findJobCountByProjectRegionAndStatusDateRange(@Param("projectId") Long projectId, @Param("region") String region, @Param("selDate") Date selDate, @Param("endDate") Date endDate, @Param("currentJobStatus") JobStatus currentJobStatus);

    @Query("SELECT count(j.id) from Job j where j.site.project.id = :projectId and j.site.region = :region and j.site.branch = :branch and (j.plannedStartTime between :selDate and :endDate) and j.status = :currentJobStatus")
    long findJobCountByProjectRegionBranchAndStatusDateRange(@Param("projectId") Long projectId, @Param("region") String region, @Param("branch") String branch, @Param("selDate") Date selDate, @Param("endDate") Date endDate, @Param("currentJobStatus") JobStatus currentJobStatus);

    @Query("SELECT count(j.id) from Job j where j.site.id = :siteId and (j.plannedStartTime between :selDate and :endDate) and j.status = :currentJobStatus group by j.plannedStartTime")
    long findJobCountForReports(@Param("siteId") Long siteId, @Param("selDate") Date selDate, @Param("endDate") Date endDate, @Param("currentJobStatus") JobStatus currentJobStatus);

    @Query("SELECT new map(j.plannedStartTime as date ,count(j.id) as count) from Job j where j.site.id = :siteId and (j.plannedStartTime between :selDate and :endDate) and j.status = :currentJobStatus group by j.plannedStartTime order by j.plannedStartTime")
    Map<Date, Long> findJobCountByDateForReports(@Param("siteId") Long siteId, @Param("selDate") Date selDate, @Param("endDate") Date endDate, @Param("currentJobStatus") JobStatus currentJobStatus);

    @Query("SELECT new map(j.plannedStartTime as date ,count(j.id) as count) from Job j where j.site.id = :siteId and (j.plannedStartTime between :selDate and :endDate) group by j.plannedStartTime order by j.plannedStartTime")
    Map<Date, Long> findTotalJobCountByDateForReports(@Param("siteId") Long siteId, @Param("selDate") Date selDate, @Param("endDate") Date endDate);

    @Query("SELECT j from Job j where (j.plannedEndTime < :currDateTime) and (j.status < 3) ")
    List<Job> findOverdueJobsByStatusAndEndDateTime(@Param("currDateTime") Date endDate);

    @Query("SELECT new map(type as jobType ,count(j.id) as count) from Job j where j.site.id = :siteId and j.plannedStartTime = :selDate group by j.type")
    Map<JobType, Long> findJobCountByType(@Param("siteId") Long siteId, @Param("selDate") Date selDate);

    @Query("SELECT new map(type as jobType ,count(j.id) as count) from Job j where j.site.id = :siteId and (j.plannedStartTime between :selDate and :endDate) group by j.type")
    Map<JobType, Long> findJobCountByTypeDateRange(@Param("siteId") Long siteId, @Param("selDate") Date selDate, @Param("endDate") Date endDate);

    @Query("SELECT j from Job j where j.title = :title and j.site.id = :siteId and j.plannedStartTime between :startDate and :endDate ")
    List<Job> findJobByTitleSiteAndDate(@Param("title") String title, @Param("siteId") Long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT j from Job j where j.title = :title and j.site.id = :siteId and j.plannedStartTime between :startDate and :endDate and scheduled = true")
    List<Job> findScheduledJobByTitleSiteAndDate(@Param("title") String title, @Param("siteId") Long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT j from Job j where j.title = :title and j.site.id = :siteId and j.plannedStartTime between :startDate and :endDate and j.plannedEndTime between :startDate and :endDate and block = :block and floor = :floor and zone = :zone and j.parentJob <> null")
    List<Job> findChildJobByTitleSiteDateAndLocation(@Param("title") String title, @Param("siteId") Long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, @Param("block") String block, @Param("floor") String floor,@Param("zone") String zone);

    @Query("SELECT j from Job j where j.title = :title and j.site.id = :siteId and j.plannedStartTime between :startDate and :endDate and j.plannedEndTime between :startDate and :endDate and block = :block and floor = :floor and zone = :zone and j.parentJob = null")
    List<Job> findParentJobByTitleSiteDateAndLocation(@Param("title") String title, @Param("siteId") Long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, @Param("block") String block, @Param("floor") String floor,@Param("zone") String zone);

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

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and (j.employee.user.id = :userId or j.employee.id in (:subEmpIds) or j.site.id in (:siteIds))")
    Page<Job> findBySiteIdsOrEmpIdsAndDateRange(@Param("userId") long userId, @Param("siteIds") List<Long> siteIds, @Param("subEmpIds") List<Long> subEmpIds, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and j.employee.id = :empId")
    List<Job> findByDateRangeAndEmployee(@Param("empId")Long empId,@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and j.employee.id = :empId")
    Page<Job> findByStartDateAndEmployee(@Param("empId")Long empId,@Param("startDate") Date startDate, @Param("endDate") Date endDate,Pageable pageRequest);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and j.employee.id = :empId and j.location.id=:locationId")
    Page<Job> findByStartDateAndEmployeeAndLocation(@Param("empId")Long empId,@Param("locationId") long locationId,@Param("startDate") Date startDate, @Param("endDate") Date endDate,Pageable pageRequest);


    @Query("SELECT j from Job j where  (j.plannedStartTime >= :startDate) and j.employee.id = :empId")
    Page<Job> findByStartDateAndEmployee(@Param("empId")Long empId,@Param("startDate") Date startDate,Pageable pageRequest);

    @Query("SELECT j from Job j where  (j.plannedStartTime >= :startDate) and j.employee.id = :empId")
    List<Job> findByStartDateAndEmployee(@Param("empId")Long empId,@Param("startDate") Date startDate);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and j.employee.id = :empId and j.site.id = :siteId")
    List<Job> findByStartDateSiteAndEmployee(@Param("siteId") long siteId, @Param("empId") long empId,@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and j.employee.id = :empId and j.site.id = :siteId")
    Page<Job> findByStartDateSiteAndEmployee(@Param("siteId") long siteId, @Param("empId") long empId,@Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and j.location.id=:locationId and j.employee.id = :empId and j.site.id = :siteId")
    Page<Job> findByStartDateSiteAndEmployeeAndLocation(@Param("siteId") long siteId, @Param("empId") long empId, @Param("locationId") long locationId,@Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and j.site.id = :siteId")
    Page<Job> findByStartDateAndSite(@Param("siteId") long siteId,  @Param("startDate") Date startDate, @Param("endDate") Date endDate,Pageable pageRequest);
    
    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and j.site.id = :siteId")
    List<Job> findByStartDateAndSiteReport(@Param("siteId") long siteId,  @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and j.site.id = :siteId and j.location.id=:locationId")
    Page<Job> findByStartDateAndSiteAndLocation(@Param("siteId") long siteId, @Param("locationId") long locationId,  @Param("startDate") Date startDate, @Param("endDate") Date endDate,Pageable pageRequest);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and j.site.id = :siteId and j.type = :type")
    Page<Job> findByStartDateAndSiteAndJobType(@Param("siteId") long siteId, @Param("type") String type, @Param("startDate") Date startDate, @Param("endDate") Date endDate,Pageable pageRequest);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :startDate and :endDate) and j.site.id = :siteId and j.type = :type and j.location.id=:locationId")
    Page<Job> findByStartDateAndSiteAndJobTypeAndLocation(@Param("siteId") long siteId, @Param("locationId") long locationId, @Param("type") String type, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);


    @Query("SELECT j from Job j where  j.site.id IN (:siteIds) order by j.plannedStartTime desc")
    Page<Job> findByStartDateAndSites(@Param("siteIds") List<Long> siteIds, Pageable pageRequest);


    @Query("SELECT j from Job j where  (j.employee.user.id = :userId or j.employee.id in (:subEmpIds))")
    List<Job> findWithoutDateRange(@Param("userId") long userId, @Param("subEmpIds") List<Long> subEmpIds);

    @Query("SELECT j from Job j where j.parentJob.id = :parentJobId and j.plannedStartTime between :startDate and :endDate ")
    List<Job> findJobsByParentJobIdAndDate(@Param("parentJobId") long parentJobId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT j from Job j where j.parentJob.id = :parentJobId order by j.plannedStartTime desc")
    List<Job> findLastJobByParentJobId(@Param("parentJobId") long parentJobId, Pageable pageRequest);

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

    @Query("SELECT j from Job j where  j.ticket.id=:ticketId")
    Job findByTicketId(@Param("ticketId")Long ticketId);

    //find jobs for asset
    @Query("SELECT j from Job j where j.asset.id = :assetId and j.plannedStartTime >= :startDate ")
    List<Job> findByAssetAndStartDate(@Param("assetId") long assetId, @Param("startDate") Date startDate);

    @Query("SELECT j FROM Job j WHERE (j.status < 3) order by j.createdDate asc")
    List<Job> findAllActiveUnClosedTicket();

    @Query("SELECT j FROM Job j WHERE j.maintenanceType = :ppmType")
	List<Job> findAllPPMJobs(@Param("ppmType") String ppmType);
    
    @Query("SELECT j FROM Job j WHERE j.maintenanceType = :amcType")
	List<Job> findAllAMCJobs(@Param("amcType") String amcType);

    @Query("SELECT j from Job j where  (j.plannedStartTime between :fromDt and :toDt) and j.site.id = :siteId and j.status = :jobStatus")
	Page<Job> findByStartDateAndStatus(@Param("siteId") long siteId, @Param("jobStatus") JobStatus jobStatus, @Param("fromDt") Date fromDt, @Param("toDt") Date toDt, Pageable pageRequest);
    
    @Query("SELECT j from Job j where  (j.plannedStartTime between :fromDt and :toDt) and j.site.id = :siteId and j.employee.id = :employeeId and j.status = :jobStatus")
	Page<Job> findByEmployeeAndStatus(@Param("siteId") long siteId, @Param("employeeId") long employeeId, @Param("jobStatus") JobStatus jobStatus, @Param("fromDt") Date fromDt, @Param("toDt") Date toDt, Pageable pageRequest);
    
}
