package com.ts.app.repository;

import java.sql.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.EmployeeShift;

public interface EmployeeShiftRepository extends JpaRepository<EmployeeShift, Long> {

	@Query("SELECT count(distinct e) FROM EmployeeShift es where es.site.id = :siteId and es.startTime = :startTime and es.endTime = :endTime")
	public long findEmployeeCountBySiteAndShift(@Param("siteId") long siteId, @Param("startTime") Date startTime, @Param("endTime") Date endTime);
}
