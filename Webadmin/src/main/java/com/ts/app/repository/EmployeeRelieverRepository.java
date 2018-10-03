package com.ts.app.repository;

import java.sql.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.EmployeeReliever;

public interface EmployeeRelieverRepository extends JpaRepository<EmployeeReliever, Long> {

	@Query("SELECT es FROM EmployeeReliever er where er.employee.id = :employeeId and er.site.id = :siteId and er.startTime between :startTime and :endTime")
	public long findRelieversBySiteAndShift(@Param("employeeId") long employeeId, @Param("siteId") long siteId, @Param("startTime") Date startTime, @Param("endTime") Date endTime);
	

}
