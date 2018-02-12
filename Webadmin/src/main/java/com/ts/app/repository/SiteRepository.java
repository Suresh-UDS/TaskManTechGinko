package com.ts.app.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.Employee;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;

public interface SiteRepository extends JpaRepository<Site, Long> {

	@Override
	void delete(Site t);

	@Query("SELECT s FROM Site s WHERE s.active='Y' order by s.name")
	List<Site> findAll();

	@Query("SELECT s FROM Site s join s.employees e WHERE e.id = :empId and s.active='Y' order by s.name")
	List<Site> findAll(@Param("empId") long empId);

	@Query("SELECT distinct s FROM Site s join s.employees e WHERE e.id in (:empIds) and s.active='Y' order by s.name")
	List<Site> findAll(@Param("empIds") List<Long> empIds);

    @Query("SELECT distinct s FROM Site s join s.employees e WHERE e.id=:empId")
    List<Site> findSiteByEmployeeId(@Param("empId") Long empId);

	@Query("SELECT e FROM Site s join s.employees e WHERE s.id = :siteId and s.active='Y'")
	List<Employee> findEmployees(@Param("siteId") long siteId);

	@Query("SELECT u FROM Site s join s.employees e join e.user u WHERE s.id = :siteId and s.active='Y'")
	List<User> findUsers(@Param("siteId") long siteId);

	@Query("SELECT s FROM Site s join s.employees e WHERE e.id = :empId and s.active='Y'")
	Page<Site> findSites(@Param("empId") long empId, Pageable pageRequest);

	@Query("SELECT distinct s FROM Site s join s.employees e WHERE e.id in (:empIds) and s.active='Y'")
	Page<Site> findSites(@Param("empIds") List<Long> empIds, Pageable pageRequest);

	@Query("SELECT s FROM Site s WHERE s.active='Y'")
	Page<Site> findSites(Pageable pageRequest);

	@Query("SELECT s FROM Site s WHERE s.project.id = :projectId and s.active='Y'")
	List<Site> findSites(@Param("projectId") long projectId);

	@Query("SELECT s FROM Site s join s.employees e WHERE s.project.id = :projectId and e.id = :empId and s.active='Y'")
	List<Site> findSites(@Param("projectId") long projectId, @Param("empId") long empId);

	@Query("SELECT distinct s FROM Site s join s.employees e WHERE s.project.id = :projectId and e.id in (:empIds) and s.active='Y'")
	List<Site> findSites(@Param("projectId") long projectId, @Param("empIds") List<Long> empId);

	@Query("SELECT s FROM Site s join s.employees e WHERE s.id = :siteId and s.project.id = :projectId and e.id = :empId and s.active='Y'")
	Page<Site> findSitesByIdAndProjectId(@Param("siteId") long siteId, @Param("projectId") long projectId, @Param("empId") long empId, Pageable pageRequest);

	@Query("SELECT s FROM Site s WHERE s.id = :siteId and s.project.id = :projectId and s.active='Y'")
	Page<Site> findSitesByIdAndProjectId(@Param("siteId") long siteId, @Param("projectId") long projectId, Pageable pageRequest);

	@Query("SELECT s FROM Site s join s.employees e  WHERE (s.id = :siteId or s.project.id = :projectId) and e.id = :empId  and s.active='Y'")
	Page<Site> findSitesByIdOrProjectId(@Param("siteId") long siteId, @Param("projectId") long projectId, @Param("empId") long empId, Pageable pageRequest);

	@Query("SELECT s FROM Site s WHERE (s.id = :siteId or s.project.id = :projectId) and s.active='Y'")
	Page<Site> findSitesByIdOrProjectId(@Param("siteId") long siteId, @Param("projectId") long projectId, Pageable pageRequest);


    @Query("SELECT s FROM Site s WHERE s.name like %:name% and s.active='Y'")
    List<Site> findSitesByName(@Param("name") String name);

}
