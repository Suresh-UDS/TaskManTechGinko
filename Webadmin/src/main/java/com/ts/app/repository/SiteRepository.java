package com.ts.app.repository;

import com.ts.app.domain.Shift;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface SiteRepository extends JpaRepository<Site, Long> {

	@Override
	void delete(Site t);

	@Query("SELECT s FROM Site s WHERE s.active='Y' order by s.name")
	List<Site> findAll();

	@Query("SELECT s FROM Site s join s.employeeProjSites e WHERE e.employee.id = :empId and s.active='Y' order by s.name")
	List<Site> findAll(@Param("empId") long empId);

	@Query("SELECT distinct s FROM Site s join s.employeeProjSites e WHERE e.employee.id in (:empIds) and s.active='Y' order by s.name")
	List<Site> findAll(@Param("empIds") Set<Long> empIds);

    @Query("SELECT distinct s FROM Site s join s.employeeProjSites e WHERE e.employee.id=:empId")
    List<Site> findSiteByEmployeeId(@Param("empId") Long empId);

	@Query("SELECT u FROM Site s join s.employeeProjSites e join e.employee.user u WHERE s.id = :siteId and s.active='Y'")
	List<User> findUsers(@Param("siteId") long siteId);

	@Query("SELECT s FROM Site s join s.employeeProjSites e WHERE e.employee.id = :empId and s.active='Y'")
	Page<Site> findSites(@Param("empId") long empId, Pageable pageRequest);

	@Query("SELECT distinct s FROM Site s join s.employeeProjSites e WHERE e.employee.id in (:empIds) and s.active='Y'")
	Page<Site> findSites(@Param("empIds") List<Long> empIds, Pageable pageRequest);

	@Query("SELECT s FROM Site s WHERE s.active='Y'")
	Page<Site> findSites(Pageable pageRequest);

	@Query("SELECT s FROM Site s WHERE s.project.id = :projectId and s.active='Y' order by s.name ASC")
	List<Site> findSites(@Param("projectId") long projectId);

	@Query("SELECT s FROM Site s join s.employeeProjSites e WHERE s.project.id = :projectId and e.employee.id = :empId and s.active='Y'")
	List<Site> findSites(@Param("projectId") long projectId, @Param("empId") long empId);

	@Query("SELECT distinct s FROM Site s join s.employeeProjSites e WHERE s.project.id = :projectId and e.employee.id in (:empIds) and s.active='Y'")
	List<Site> findSites(@Param("projectId") long projectId, @Param("empIds") List<Long> empId);

	@Query("SELECT distinct s FROM Site s join s.employeeProjSites e WHERE (s.id = :siteId or s.name like '%' || :siteName || '%' ) and (s.project.id = :projectId or s.project.name like '%' || :projectName || '%' ) and e.employee.id in (:empIds) and s.active='Y'")
	Page<Site> findSitesByIdAndProjectId(@Param("siteId") long siteId, @Param("siteName") String siteName, @Param("projectId") long projectId, @Param("projectName") String projectName, @Param("empIds") List<Long> empIds, Pageable pageRequest);

	@Query("SELECT s FROM Site s WHERE s.id = :siteId and (s.project.id = :projectId or s.project.name like '%' || :projectName || '%' ) and s.active='Y'")
	Page<Site> findSitesByIdAndProjectId(@Param("siteId") long siteId, @Param("projectId") long projectId, @Param("projectName") String projectName, Pageable pageRequest);

	@Query("SELECT distinct s FROM Site s join s.employeeProjSites e  WHERE (s.id = :siteId or s.name like '%' || :siteName || '%' ) or (s.project.id = :projectId or s.project.name like '%' || :projectName || '%' ) and e.employee.id in (:empIds)  and s.active='Y'")
	Page<Site> findSitesByIdOrProjectId(@Param("siteId") long siteId, @Param("siteName") String siteName, @Param("projectId") long projectId, @Param("projectName") String projectName,  @Param("empIds") List<Long> empIds, Pageable pageRequest);

	@Query("SELECT s FROM Site s WHERE ((s.id = :siteId or s.name like '%' || :siteName || '%' ) or  (s.project.id = :projectId or s.project.name like '%' || :projectName || '%' )) and s.active='Y'")
	Page<Site> findSitesByIdOrProjectId(@Param("siteId") long siteId,  @Param("siteName") String siteName, @Param("projectId") long projectId, @Param("projectName") String projectName, Pageable pageRequest);


    @Query("SELECT s FROM Site s WHERE s.name like %:name% and s.active='Y'")
    List<Site> findSitesByName(@Param("name") String name);

    @Query("SELECT s.id FROM Site s WHERE s.project.id=:projectId and s.region =:region and s.active='Y'")
    List<Long> findByRegion(@Param("projectId") long projectId, @Param("region") String region);

    @Query("SELECT s.id FROM Site s WHERE s.project.id=:projectId and s.region =:region and s.branch =:branch and s.active='Y'")
    List<Long> findByRegionAndBranch(@Param("projectId") long projectId, @Param("region") String region, @Param("branch") String branch);

    @Query("SELECT s FROM Shift s where s.site.id = :siteId order by CAST(substring(s.startTime,1,locate(':',s.startTime)-1)  as int)")
    List<Shift> findShiftsBySite(@Param("siteId") long siteId);

    @Query("SELECT s FROM Site s WHERE s.project.id=:projectId and s.region =:region and s.active='Y'")
    List<Site> findSitesByRegion(@Param("projectId") long projectId, @Param("region") String region);

    @Query("SELECT s FROM Site s WHERE s.project.id=:projectId and s.region =:region and s.branch =:branch and s.active='Y'")
    List<Site> findSitesByRegionAndBranch(@Param("projectId") long projectId, @Param("region") String region, @Param("branch") String branch);


}
