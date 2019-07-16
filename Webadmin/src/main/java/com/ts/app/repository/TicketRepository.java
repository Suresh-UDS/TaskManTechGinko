package com.ts.app.repository;

import com.ts.app.domain.Ticket;
import com.ts.app.domain.TicketStatus;

import org.junit.runners.Parameterized.Parameters;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.time.ZonedDateTime;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket,Long>, JpaSpecificationExecutor<Ticket> {

    @Query("SELECT t FROM Ticket t where t.createdDate between :startDate and :endDate")
    Page<Ticket> findAll(@Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.id = :siteId and t.createdDate between :startDate and :endDate")
    Page<Ticket> findBySiteId(@Param("siteId") long siteId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.id = :siteId and (t.createdDate between :startDate and :endDate or  t.closedOn between :fromDate and :toDate)")
    Page<Ticket> findBySiteIdAndDateRange(@Param("siteId") long siteId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, @Param("fromDate") Date fromDate, @Param("toDate") Date toDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.id = :siteId and  t.status = :status and t.createdDate between :startDate and :endDate")
    Page<Ticket> findBySiteIdAndStatus(@Param("siteId") long siteId, @Param("status") String status, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.project.id = :projectId and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByProjectId(@Param("projectId") long projectId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.project.id = :projectId and  t.status = :status and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByProjectIdAndStatus(@Param("projectId") long projectId, @Param("status") String status, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.status = :status and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByStatus(@Param("status") String status, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.asset.id = :assetId and t.status = :status and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByAssetIdAndStatus(@Param("assetId") long assetId, @Param("status") String status, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.asset.id = :assetId and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByAssetId(@Param("assetId") long assetId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.createdDate between :startDate and :endDate")
    Page<Ticket> findByDateRange(@Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.createdBy.id = :userId and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByUserId(@Param("userId") Long userId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where (t.employee.id in (:empIds) or t.assignedTo.id in (:empIds)) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByEmpId(@Param("empIds") List<Long> empIds, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where (t.site.id in (:siteIds) or t.employee.id in (:empIds) or t.assignedTo.id in (:empIds)) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByEmpId(@Param("siteIds") List<Long> siteIds, @Param("empIds") List<Long> empIds, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.id = :siteId and (t.employee.id in (:empIds) or t.assignedTo.id in (:empIds) ) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findBySiteIdUserIdAndEmpId(@Param("siteId") long siteId, @Param("empIds") List<Long> empIds, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.project.id = :projectId and (t.employee.id in (:empIds) or t.assignedTo.id in (:empIds) ) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByProjectIdAndEmpId(@Param("projectId") long siteId, @Param("empIds") List<Long> empIds, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.id = :siteId and t.status = :status and (t.employee.id in (:empIds) or t.assignedTo.id in (:empIds) ) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findBySiteIdStatusAndEmpId(@Param("siteId") long siteId, @Param("status") String status, @Param("empIds") List<Long> empIds, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.project.id = :projectId and t.status = :status and (t.employee.id in (:empIds) or t.assignedTo.id in (:empIds) ) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByProjectIdStatusAndEmpId(@Param("projectId") long siteId, @Param("status") String status, @Param("empIds") List<Long> empIds, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.status = :status and (t.site.id in (:siteIds) or t.employee.id in (:empIds) or t.assignedTo.id in (:empIds) ) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByStatusAndEmpId(@Param("siteIds") List<Long> siteIds, @Param("status") String status, @Param("empIds") List<Long> empIds, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t WHERE t.asset.id = :assetId and t.active = 'Y' order by t.title")
	List<Ticket> findByAssetId(@Param("assetId") long assetId);

    @Query("SELECT count(t) FROM Ticket WHERE t.asset.id = assetId and t.status = :status")
    long findOpenCountByAssetId(@Param("assetId") long assetId,@Param("status") String status);

    @Query("SELECT count(t) FROM Ticket WHERE t.asset.id = assetId and t.status :status")
    long findAssignedCountByAssetId(@Param("assetId") long assetId,@Param("status") String status);
    
    @Query("SELECT count(t) FROM Ticket t WHERE asset.id = assetId and t.status = :status")
    long findInProgressCountByAssetId(@Param("assetId") long assetId,@Param("status") String status);
    
    @Query("SELECT count(t) FROM Ticket t WHERE site.id = siteId and t.status = :status and t.asset.id is not null")
    long findOpenTicketsCountBySiteId(@Param("siteId") long siteId,@Param("status") String status);
    
    @Query("SELECT count(t) FROM Ticket WHERE site.id = siteId and t.status = :status and t.asset.id is not null")
    long findAssignedTicketsCountBySiteId(@Param("siteId") long siteId,@Param("status") String status);
    
    @Query("SELECT count(t) FROM Ticket WHERE site.id = siteId and t.status = :status and t.asset.id is not null")
    long  findInProgressTicketsCountBySiteId(@Param("siteId") long siteId,@Param("status") String status);
    
    @Query("SELECT count(t) from Ticket t where t.site.id IN (:siteIds) and  t.createdDate between :startDate and :endDate ")
	long findCountBySiteIdAndDateRange(@Param("siteIds") List<Long> siteIds, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

    @Query("SELECT count(t) from Ticket t where t.site.id IN (:siteIds) and t.status = 'Open' and  t.createdDate between :startDate and :endDate ")
	long findOpenTicketsBySiteIdAndDateRange(@Param("siteIds") List<Long> siteIds, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

    @Query("SELECT count(t) from Ticket t where t.site.id IN (:siteIds) and t.status = 'In Progress' and  t.createdDate between :startDate and :endDate ")
	long findInProgressTicketsBySiteIdAndDateRange(@Param("siteIds") List<Long> siteIds, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

    @Query("SELECT count(t) from Ticket t where t.site.id IN (:siteIds) and t.status = :status and t.createdDate between :startDate and :endDate ")
	long findCountBySiteIdStatusAndDateRange(@Param("siteIds") List<Long> siteIds, @Param("status") String status, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

    @Query("SELECT count(t) from Ticket t where t.site.id IN (:siteIds) and t.status = 'Assigned' and t.createdDate between :startDate and :endDate ")
	long findAssignedCountBySiteIdStatusAndDateRange(@Param("siteIds") List<Long> siteIds, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

    @Query("SELECT count(t) from Ticket t where t.site.id IN (:siteIds) and t.status = 'Closed' and t.closedOn between :fromDate and :toDate ")
	long findClosedCountBySiteIdStatusAndDateRange(@Param("siteIds") List<Long> siteIds, @Param("fromDate") Date fromDate, @Param("toDate") Date toDate);

    @Query("SELECT count(t) from Ticket t where t.site.id IN (:siteIds) and t.status <> 'Closed' and t.createdDate between :startDate and :endDate ")
	long findOpenCountBySiteIdAndDateRange(@Param("siteIds") List<Long> siteIds, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

    @Query("SELECT count(t) from Ticket t where t.site.id IN (:siteIds) and t.status <> 'Closed' and t.pendingAtClient = TRUE and t.createdDate between :startDate and :endDate ")
	long findOpenCountBySiteIdAndDateRangeDueToClient(@Param("siteIds") List<Long> siteIds, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

    @Query("SELECT count(t) from Ticket t where t.site.id IN (:siteIds) and t.status <> 'Closed' and t.pendingAtUDS = TRUE and t.createdDate between :startDate and :endDate ")
	long findOpenCountBySiteIdAndDateRangeDueToCompany(@Param("siteIds") List<Long> siteIds, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

    @Query("SELECT t from Ticket t WHERE t.site.id = :siteId and t.asset.id = :assetId order by t.createdDate desc ")
    Page<Ticket> findTicketsBySiteId(@Param("siteId") long siteId, @Param("assetId") long assetId, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t WHERE t.asset.id = :assetId order by t.createdDate desc ")
    Page<Ticket> findTicketsByAssetId(@Param("assetId") long assetId, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t WHERE t.status <> 'Closed' order by t.createdDate asc ")
    List<Ticket> findAllActiveUnClosedTicket();

    @Query("SELECT t FROM Ticket t WHERE t.status <> 'Closed' and t.site.id = :siteId order by t.createdDate asc ")
    List<Ticket> findAllActiveUnClosedTicket(@Param("siteId") long siteId);

    @Query("SELECT t FROM Ticket t WHERE t.assignedTo.id =:empId")
    List<Ticket> findByEmployee(@Param("empId") long empId);

    @Query("SELECT count(t.id) from Ticket t where t.site.id in (:siteIds) and (t.assignedOn between :selDate and :endDate) ")
    long findCurrentTicketsCountBySiteIdsAndDateRange(@Param("siteIds") List<Long> siteIds, @Param("selDate") Date selDate, @Param("endDate") Date endDate);

    @Query("SELECT count(t.id) from Ticket t where (t.assignedOn between :selDate and :endDate) ")
    long findCurrentTicketsCountByDateRange( @Param("selDate") Date selDate, @Param("endDate") Date endDate);

    @Query("SELECT t FROM Ticket t WHERE t.assignedTo.id =:empId and (t.status= 'Assigned' or t.status = 'In Progress' or t.status = 'Open') ")
    List<Ticket> findEmployeeUnClosedTickets(@Param("empId") long empId);

    //@Query("select sum(cnt) from (select timediff, count(id) as cnt from (SELECT datediff(now(),t.createdDate) as timediff, t.id as id from Ticket t where t.site.id IN (:siteIds) and t.status <> 'Closed'  and t.createdDate between :startDate and :endDate) as timediffresult group by timediff) as result where timediff >= :min and timediff <= :max ")
	//long findPendingCountBySiteIdDateRangeAndGroupByDays(@Param("siteIds") List<Long> siteIds,  @Param("min") int min, @Param("max") int max, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    //@Query("select sum(result.cnt) from (select timediff, count(id) as cnt from (SELECT datediff(now(),t.createdDate) as timediff, t.id as id from Ticket t where t.site.id IN (:siteIds) and t.status = 'Closed' and t.createdDate between :startDate and :endDate) as timediffresult group by timediff) as result where timediff >= :min and timediff <= :max ")
	//long findClosedCountBySiteIdDateRangeAndGroupByDays(@Param("siteIds") List<Long> siteIds,  @Param("min") int min, @Param("max") int max, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    //@Query("SELECT count(t) from Ticket t where t.site.id IN (:siteIds) and t.status = :status and t.createdDate between :startDate and :endDate ")
	//long findCountBySiteIdStatusAndDateRange(@Param("siteIds") List<Long> siteIds, @Param("status") String status, @Param("startDate") Date startDate, @Param("endDate") Date endDate);
}
