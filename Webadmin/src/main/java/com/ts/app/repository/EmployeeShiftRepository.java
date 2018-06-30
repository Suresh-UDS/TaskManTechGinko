package com.ts.app.repository;

import java.sql.Date;
import java.sql.Timestamp;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.EmployeeShift;

public interface EmployeeShiftRepository extends JpaRepository<EmployeeShift, Long> {

	@Query("SELECT count(distinct es) FROM EmployeeShift es where es.site.id = :siteId and es.startTime = :startTime and es.endTime = :endTime")
	public long findEmployeeCountBySiteAndShift(@Param("siteId") long siteId, @Param("startTime") Date startTime, @Param("endTime") Date endTime);
	
	@Query("SELECT es FROM EmployeeShift es where es.site.id = :siteId and es.startTime = :startTime and es.endTime = :endTime")
	public EmployeeShift findEmployeeShiftBySiteAndShift(@Param("siteId") long siteId, @Param("startTime") Timestamp startTime, @Param("endTime") Timestamp endTime);

	@Query("SELECT es FROM EmployeeShift es where es.site.id = :siteId and es.startTime between :startTime and :endTime")
	public Page<EmployeeShift> findEmployeeShiftBySiteAndDate(@Param("siteId") long siteId, @Param("startTime") Timestamp startTime, @Param("endTime") Timestamp endTime, Pageable pageRequest);

	@Query("SELECT es FROM EmployeeShift es where es.site.project.id = :projectId and es.startTime between :startTime and :endTime")
	public Page<EmployeeShift> findEmployeeShiftByProjectAndDate(@Param("projectId") long projectId, @Param("startTime") Timestamp startTime, @Param("endTime") Timestamp endTime, Pageable pageRequest);

}
