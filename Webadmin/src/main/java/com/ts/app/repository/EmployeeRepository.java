package com.ts.app.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.Employee;
import com.ts.app.domain.User;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

	@Override
	void delete(Employee t);

	@Query("SELECT e FROM Employee e WHERE e.code = :code and e.active='Y'")
	Employee findByCode(@Param("code") long code);

	@Query("SELECT e FROM Employee e WHERE e.empId = :empId")
	Employee findByEmpId(@Param("empId") String empId);

	@Query("SELECT e FROM Employee e join e.projectSites s WHERE s.site.id = :siteId and e.active='Y' and e.isLeft = FALSE order by e.name")
	List<Employee> findBySiteId(@Param("siteId") long siteId);

	@Query("SELECT distinct e FROM Employee e join e.projectSites s WHERE s.site.id IN (:siteIds) and e.active='Y' and e.isLeft = FALSE order by e.name")
	List<Employee> findBySiteIds(@Param("siteIds") List<Long> siteIds);

	@Query("SELECT distinct e FROM Employee e join e.projectSites s WHERE s.site.id IN (:siteIds) and e.active='Y' and e.isLeft = FALSE order by e.name")
	Page<Employee> findBySiteIds(@Param("siteIds") List<Long> siteIds, Pageable pageRequest);

	@Query("SELECT distinct e FROM Employee e join e.projectSites s WHERE s.site.id = :siteId and e.id IN (:empIds) and e.active='Y' and e.isLeft = FALSE order by e.name")
	List<Employee> findBySiteIdAndEmpIds(@Param("siteId") long siteId, @Param("empIds") List<Long> empIds);

	@Query("SELECT e FROM Employee e join e.projectSites p WHERE p.project.id = :projectId and e.active='Y' and e.isLeft = FALSE order by e.name")
	List<Employee> findByProjectId(@Param("projectId") long projectId);

	@Query("SELECT distinct e FROM Employee e WHERE e.empId IN :empIds and e.active='Y' and e.isLeft = FALSE order by e.empId ")
	Page<Employee> findAllByEmpCodes(@Param("empIds") List<String> empIds, Pageable pageRequest);

	@Query("SELECT distinct e FROM Employee e WHERE e.id IN :empIds and e.active='Y' and e.isLeft = FALSE order by e.empId ")
	Page<Employee> findAllByEmpIds(@Param("empIds") List<Long> empIds, Pageable PageRequest);

    @Query("SELECT e FROM Employee e WHERE e.id = :employeeId")
    Page<Employee> findByEmployeeId(@Param("employeeId") long employeeId, Pageable pageRequest);

	@Query("SELECT e FROM Employee e WHERE e.active='Y' and e.isLeft = FALSE order by e.name")
    Page<Employee> findAll(Pageable pageRequest);

	@Query("SELECT distinct e FROM Employee e WHERE e.id IN :empIds and e.active='Y' and e.isLeft = FALSE order by e.name")
    List<Employee> findAllByIds(@Param("empIds") List<Long> empIds);

	@Query("SELECT e FROM Employee e WHERE e.id <> :empId and e.active='Y' and e.isLeft = FALSE  order by e.empId")
	List<Employee> findAllEligibleManagers(@Param("empId") long empId);

//    @Query("SELECT e FROM Employee e , User u WHERE u.userGroup.id = :userGroupId and e.isReliever=true and e.active='Y' order by e.empId")
//    List<Employee> findAllRelieversByGroupId(@Param("userGroupId") long userGroupId);

    @Query("SELECT e FROM Employee e  WHERE  e.isReliever=true and e.active='Y' order by e.empId")
    List<Employee> findAllRelievers();

    @Query("SELECT distinct e FROM Employee e  WHERE e.id IN :empIds and  e.isReliever=true and e.active='Y' order by e.empId")
    List<Employee> findAllRelieversByIds(@Param("empIds") List<Long> empIds);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ((e.id = :employeeId and ps.project.id = :projectId) or ps.site.id = :siteId) and e.active='Y' and e.isLeft = FALSE order by e.empId")
	Page<Employee> findEmployeesByIdAndProjectIdOrSiteId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ((e.id = :employeeId and ps.site.id = :siteId) or ps.project.id = :projectId) and e.active='Y' and e.isLeft = FALSE order by e.empId")
	Page<Employee> findEmployeesByIdAndSiteIdOrProjectId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE (e.id = :employeeId or (ps.site.id = :siteId and ps.project.id = :projectId)) and e.active='Y' and e.isLeft = FALSE order by e.empId")
	Page<Employee> findEmployeesByIdOrSiteIdAndProjectId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE (e.id = :employeeId and ps.site.id = :siteId and ps.project.id = :projectId) and e.active='Y' and e.isLeft = FALSE order by e.empId")
	Page<Employee> findEmployeesByIdAndSiteIdAndProjectId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId,Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE (ps.site.id = :siteId and ps.project.id = :projectId) and e.active='Y' and e.isLeft = FALSE order by e.empId")
	Page<Employee> findBySiteIdAndProjectId(@Param("projectId") long projectId, @Param("siteId") long siteId, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ((e.id = :employeeId and ps.project.id = :projectId) or ps.site.id = :siteId) and e.active='Y' and e.isLeft = FALSE and e.createdDate between :startDate and :endDate order by e.empId")
	Page<Employee> findEmployeesByIdAndProjectIdOrSiteId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ((e.id = :employeeId and ps.site.id = :siteId) or ps.project.id = :projectId) and e.active='Y' and e.isLeft = FALSE and e.createdDate between :startDate and :endDate order by e.empId")
	Page<Employee> findEmployeesByIdAndSiteIdOrProjectId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate,Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE (e.id = :employeeId or (ps.site.id = :siteId and ps.project.id = :projectId)) and e.active='Y' and e.isLeft = FALSE and e.createdDate between :startDate and :endDate order by e.empId")
	Page<Employee> findEmployeesByIdOrSiteIdAndProjectId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate,Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE (e.id = :employeeId and ps.site.id = :siteId and ps.project.id = :projectId) and e.active='Y' and e.isLeft = FALSE and e.createdDate between :startDate and :endDate order by e.empId")
	Page<Employee> findEmployeesByIdAndSiteIdAndProjectId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate,Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE (ps.site.id = :siteId and ps.project.id = :projectId) and e.active='Y' and e.isLeft = FALSE and e.createdDate between :startDate and :endDate order by e.empId")
	Page<Employee> findBySiteIdAndProjectId(@Param("projectId") long projectId, @Param("siteId") long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ps.site.name like '%' || :siteName || '%' and e.id in (:empIds) and e.active='Y' and e.isLeft = FALSE order by e.empId")
	Page<Employee> findBySiteName(@Param("siteName") String siteId, @Param("empIds") List<Long> empIds, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ps.project.name like '%' || :projectName || '%' and e.id in (:empIds) and e.active='Y' and e.isLeft = FALSE order by e.empId")
	Page<Employee> findByProjectName(@Param("projectName") String projectName, @Param("empIds") List<Long> empIds, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ps.site.id = :siteId and ps.project.id = :projectId and e.empId = :empId and e.active='Y' and e.isLeft = FALSE order by e.empId")
	Page<Employee> findByProjectSiteAndEmployeeEmpId(@Param("projectId") long projectId, @Param("siteId") long siteId, @Param("empId") String empId, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ps.site.id = :siteId and ps.project.id = :projectId and e.name like '%' || :empName || '%' and e.active='Y' and e.isLeft = FALSE order by e.empId")
	Page<Employee> findByProjectSiteAndEmployeeName(@Param("projectId") long projectId, @Param("siteId") long siteId, @Param("empName") String empName, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ps.project.id = :projectId and e.name like '%' || :empName || '%' and e.active='Y' and e.isLeft = FALSE order by e.empId")
	Page<Employee> findByProjectAndEmployeeName(@Param("projectId") long projectId, @Param("empName") String empName, Pageable pageRequest);

    @Query("SELECT e FROM Employee e WHERE e.name like '%' || :empName || '%' and e.active='Y' order by e.empId")
	Page<Employee> findByEmployeeName(@Param("empName") String empName, Pageable pageRequest);

    /*
    @Query("SELECT e FROM Employee e , User u WHERE ((e.id = :employeeId and e.project.id = :projectId) or e.site.id = :siteId) and e.user.id = u.id and u.userGroup.id = :userGroupId and e.active='Y' order by e.empId")
	Page<Employee> findEmployeesByIdAndProjectIdOrSiteId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, @Param("userGroupId") long userGroupId, Pageable pageRequest);

	@Query("SELECT e FROM Employee e , User u WHERE ((e.id = :employeeId and e.site.id = :siteId) or e.project.id = :projectId) and e.user.id = u.id and u.userGroup.id = :userGroupId and e.active='Y' order by e.empId")
	Page<Employee> findEmployeesByIdAndSiteIdOrProjectId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, @Param("userGroupId") long userGroupId, Pageable pageRequest);

	@Query("SELECT e FROM Employee e, User u WHERE (e.id = :employeeId or (e.site.id = :siteId and e.project.id = :projectId)) and e.user.id = u.id and u.userGroup.id = :userGroupId and e.active='Y' order by e.empId")
	Page<Employee> findEmployeesByIdOrSiteIdAndProjectId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, @Param("userGroupId") long userGroupId, Pageable pageRequest);

	@Query("SELECT e FROM Employee e , User u WHERE e.id = :employeeId and e.site.id = :siteId and e.project.id = :projectId and e.user.id = u.id and u.userGroup.id = :userGroupId and e.active='Y' order by e.empId")
	Page<Employee> findEmployeesByIdAndSiteIdAndProjectId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, @Param("userGroupId") long userGroupId, Pageable pageRequest);
	*/

	@Query("SELECT e FROM Employee e where e.user.id = :userId ")
	Employee findByUserId(@Param("userId") Long userId);

	@Query("SELECT e FROM Employee e where e.user.id = :userId ")
	List<Employee> findListByUserId(@Param("userId") Long userId);

	@Query("SELECT distinct u FROM Employee e join e.user u where e.id IN :employeeIds")
	List<User> findUsersByEmployeeIds(@Param("employeeIds") List<Long> employeeIds);

	@Query("SELECT count(e) FROM Employee e join e.projectSites ps  WHERE ps.site.id = :siteId and e.active = 'Y' and e.isLeft = FALSE")
	long findCountBySiteId(@Param("siteId") long siteId);

	@Query("SELECT count(e) FROM Employee e join e.projectSites ps WHERE ps.project.id = :projectId and e.active = 'Y' and e.isLeft = FALSE")
	long findCountByProjectId(@Param("projectId") long projectId);

	@Query("SELECT count(distinct e) FROM Employee e join e.projectSites ps where ps.project.id IN (:projIds) and e.active = 'Y' and e.isLeft = FALSE")
	long findTotalCount(@Param("projIds") List<Long> projectIds);

	@Query("SELECT count(distinct e) FROM Employee e join e.projectSites ps where ps.site.id IN (:siteIds) and e.active = 'Y' and e.isLeft = FALSE")
	long findTotalCountBySites(@Param("siteIds") List<Long> siteIds);

	@Query("SELECT count(e) FROM Employee e where e.active = 'Y' and e.isLeft = FALSE")
	long findTotalCount();

	@Query( "SELECT e FROM Employee e where e.active = 'Y' and e.isLeft = FALSE")
	Page<Employee> findByOrder(Pageable pageRequest);

	//@Query("SELECT count(e) FROM Employee e join e.projectSites eps join eps.shifts es  WHERE eps.employee.id = e.id and eps.id = es.employeeProjectSite.id and eps.site.id = :siteId and es.startTime = :startTime and es.endTime = :endTime and e.active = 'Y' and e.isLeft = FALSE")
	//long findEmployeeCountBySiteAndShift(@Param("siteId") long siteId, @Param("startTime") String startTime, @Param("endTime") String endTime);

	@Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ps.site.id = :siteId and e.id NOT IN :empIds and e.active='Y' and e.isLeft = FALSE order by e.name")
	List<Employee> findNonMatchingBySiteId(@Param("siteId") long siteId, @Param("empIds") List<Long> empIds);

}
