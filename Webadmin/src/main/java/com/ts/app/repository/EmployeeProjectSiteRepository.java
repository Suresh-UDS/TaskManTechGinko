package com.ts.app.repository;
 
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.Site;

public interface EmployeeProjectSiteRepository extends JpaRepository<EmployeeProjectSite, Long>,JpaSpecificationExecutor<EmployeeProjectSite>{
 
	@Query("select emp.site.id from EmployeeProjectSite emp where emp.employee.id = :employee")
	List<Long> getSiteIdsByEmployeeId(@Param("employee") long employee);
	
	@Query("select distinct emp.site.id from EmployeeProjectSite emp")
	List<Long> getSiteAllIds();
	
}
