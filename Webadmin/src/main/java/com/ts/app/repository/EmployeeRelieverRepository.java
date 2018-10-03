package com.ts.app.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.EmployeeReliever;

public interface EmployeeRelieverRepository extends JpaRepository<EmployeeReliever, Long> {

	@Query("SELECT es FROM EmployeeReliever er where er.employee.id = :employeeId and er.site.id = :siteId and er.startTime between :startTime and :endTime")
	public List<EmployeeReliever> findRelieversBySiteAndShift(@Param("employeeId") long employeeId, @Param("siteId") long siteId, @Param("startTime") Date startTime, @Param("endTime") Date endTime);
	
	@Query("SELECT es FROM EmployeeReliever er where er.employee.id = :employeeId")
	public List<EmployeeReliever> findRelievers(@Param("employeeId") long employeeId);

	@Query("SELECT es FROM EmployeeReliever er where er.employee.id = :employeeId")
	public Page<EmployeeReliever> findRelievers(@Param("employeeId") long employeeId, Pageable pageRequest);
}
