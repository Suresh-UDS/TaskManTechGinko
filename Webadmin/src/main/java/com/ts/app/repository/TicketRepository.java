package com.ts.app.repository;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.Ticket;

public interface TicketRepository extends JpaRepository<Ticket,Long>, JpaSpecificationExecutor<Ticket> {

    @Query("SELECT t FROM Ticket t where t.createdDate between :startDate and :endDate")
    Page<Ticket> findAll(@Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate,Pageable pageRequest);
    
    @Query("SELECT t FROM Ticket t where t.site.id = :siteId and t.createdDate between :startDate and :endDate")
    Page<Ticket> findBySiteId(@Param("siteId") long siteId,@Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate,Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.id = :siteId and  t.status = :status and t.createdDate between :startDate and :endDate")
    Page<Ticket> findBySiteIdAndStatus(@Param("siteId") long siteId,@Param("status") String status,@Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate,Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.project.id = :projectId and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByProjectId(@Param("projectId") long projectId,@Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate,Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.project.id = :projectId and  t.status = :status and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByProjectIdAndStatus(@Param("projectId") long projectId,@Param("status") String status,@Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate,Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.status = :status and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByStatus(@Param("status") String status,@Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate,Pageable pageRequest);
    
    @Query("SELECT t FROM Ticket t where t.asset.id = :assetId and t.status = :status and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByAssetIdAndStatus(@Param("assetId") long assetId, @Param("status") String status,@Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate,Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.asset.id = :assetId and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByAssetId(@Param("assetId") long assetId,@Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate,Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.createdDate between :startDate and :endDate")
    Page<Ticket> findByDateRange(@Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate,Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.createdBy.id = :userId and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByUserId(@Param("userId") Long userId, @Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where (t.employee.id in (:empIds) or t.assignedTo.id in (:empIds)) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByEmpId(@Param("empIds") List<Long> empIds,@Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where (t.site.id in (:siteIds) or t.employee.id in (:empIds) or t.assignedTo.id in (:empIds)) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByEmpId(@Param("siteIds") List<Long> siteIds,@Param("empIds") List<Long> empIds,@Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.id = :siteId and (t.employee.id in (:empIds) or t.assignedTo.id in (:empIds) ) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findBySiteIdUserIdAndEmpId(@Param("siteId") long siteId,@Param("empIds") List<Long> empIds,@Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.project.id = :projectId and (t.employee.id in (:empIds) or t.assignedTo.id in (:empIds) ) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByProjectIdAndEmpId(@Param("projectId") long siteId,@Param("empIds") List<Long> empIds,@Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate, Pageable pageRequest);
    
    @Query("SELECT t FROM Ticket t where t.site.id = :siteId and t.status = :status and (t.employee.id in (:empIds) or t.assignedTo.id in (:empIds) ) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findBySiteIdStatusAndEmpId(@Param("siteId") long siteId,@Param("status") String status,@Param("empIds") List<Long> empIds,@Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.project.id = :projectId and t.status = :status and (t.employee.id in (:empIds) or t.assignedTo.id in (:empIds) ) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByProjectIdStatusAndEmpId(@Param("projectId") long siteId,@Param("status") String status,@Param("empIds") List<Long> empIds,@Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.status = :status and (t.site.id in (:siteIds) or t.employee.id in (:empIds) or t.assignedTo.id in (:empIds) ) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByStatusAndEmpId(@Param("siteIds") List<Long> siteIds, @Param("status") String status,@Param("empIds") List<Long> empIds,@Param("startDate") ZonedDateTime startDate,@Param("endDate") ZonedDateTime endDate, Pageable pageRequest);
    
    @Query("SELECT t FROM Ticket t WHERE t.asset.id = :assetId and t.active = 'Y' order by t.title")
	List<Ticket> findByAssetId(@Param("assetId") long assetId);

}
