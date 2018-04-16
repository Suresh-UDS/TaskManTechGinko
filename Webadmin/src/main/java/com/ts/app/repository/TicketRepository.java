package com.ts.app.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.Ticket;

public interface TicketRepository extends JpaRepository<Ticket,Long>, JpaSpecificationExecutor<Ticket> {

    @Query("SELECT t FROM Ticket t")
    Page<Ticket> findAll(Pageable pageRequest);
    
    @Query("SELECT t FROM Ticket t where t.createdBy.id = :userId ")
    Page<Ticket> findByUserId(@Param("userId") Long userId, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where (t.employee.id in (:empIds) or t.assignedTo.id in (:empIds)) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findByEmpId(@Param("empIds") List<Long> empIds,@Param("startDate") Date startDate,@Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.id = :siteId and (t.employee.id in (:empIds) or t.assignedTo.id in (:empIds) ) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findBySiteIdUserIdAndEmpId(@Param("siteId") long siteId,@Param("empIds") List<Long> empIds,@Param("startDate") Date startDate,@Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.site.id = :siteId and t.status = :status and (t.employee.id in (:empIds) or t.assignedTo.id in (:empIds) ) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findBySiteIdUserIdAndEmpId(@Param("siteId") long siteId,@Param("status") String status,@Param("empIds") List<Long> empIds,@Param("startDate") Date startDate,@Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT t FROM Ticket t where t.status = :status and (t.employee.id in (:empIds) or t.assignedTo.id in (:empIds) ) and t.createdDate between :startDate and :endDate")
    Page<Ticket> findBySiteIdUserIdAndEmpId(@Param("status") String status,@Param("empIds") List<Long> empIds,@Param("startDate") Date startDate,@Param("endDate") Date endDate, Pageable pageRequest);
}
