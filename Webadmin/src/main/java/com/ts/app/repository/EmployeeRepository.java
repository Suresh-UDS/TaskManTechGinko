package com.ts.app.repository;

import com.ts.app.domain.Employee;
import com.ts.app.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.time.ZonedDateTime;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {

	@Override
	void delete(Employee t);

	@Query("SELECT e FROM Employee e WHERE e.code = :code and e.active='Y'")
	Employee findByCode(@Param("code") long code);

	@Query("SELECT e FROM Employee e WHERE e.empId = :empId and e.active='Y'")
	Employee findByEmpId(@Param("empId") String empId);

	@Query("SELECT e FROM Employee e join e.projectSites s WHERE s.site.id = :siteId and e.active='Y' and e.isLeft = FALSE order by e.designation")
	List<Employee> findBySiteId(@Param("siteId") long siteId);

    @Query("SELECT e FROM Employee e join e.projectSites s WHERE s.site.id = :siteId and e.active='Y' and e.isLeft = FALSE order by e.name")
    Page<Employee> findBySiteId(@Param("siteId") long siteId, Pageable pageRequest);

	@Query("SELECT distinct e FROM Employee e join e.projectSites s WHERE s.site.id IN (:siteIds) and e.active='Y' and e.isLeft = FALSE order by e.name")
	List<Employee> findBySiteIds(@Param("siteIds") List<Long> siteIds);

	@Query("SELECT distinct e FROM Employee e join e.projectSites s WHERE s.site.id IN (:siteIds) and e.active='Y' and e.isLeft = FALSE and (client = :isClient or client = FALSE) order by e.name")
	Page<Employee> findBySiteIds(@Param("siteIds") List<Long> siteIds, @Param("isClient") boolean isClient, Pageable pageRequest);

	@Query("SELECT distinct e FROM Employee e join e.projectSites s WHERE s.site.id = :siteId and e.id IN (:empIds) and e.active='Y' and e.isLeft = FALSE order by e.name")
	List<Employee> findBySiteIdAndEmpIds(@Param("siteId") long siteId, @Param("empIds") List<Long> empIds);

    @Query("SELECT distinct e FROM Employee e join e.projectSites s WHERE s.site.id = :siteId and e.id IN (:empIds) and e.active='Y' and e.isLeft = FALSE order by e.name")
    Page<Employee> findBySiteIdAndEmpIds(@Param("siteId") long siteId, @Param("empIds") List<Long> empIds, Pageable pageRequest);

	@Query("SELECT e FROM Employee e join e.projectSites p WHERE p.project.id = :projectId and e.active='Y' and e.isLeft = FALSE order by e.name")
	List<Employee> findByProjectId(@Param("projectId") long projectId);

	@Query("SELECT distinct e FROM Employee e WHERE e.empId IN :empIds and e.active='Y' and e.isLeft = FALSE and (client = :isClient or client = FALSE) order by e.empId ")
	Page<Employee> findAllByEmpCodes(@Param("empIds") List<String> empIds, @Param("isClient") boolean isClient, Pageable pageRequest);

	@Query("SELECT distinct e FROM Employee e join e.projectSites p WHERE p.site.id IN (:siteIds) and e.empId IN :empIds and e.active='Y' and e.isLeft = FALSE and (client = :isClient or client = FALSE) order by e.empId ")
	Page<Employee> findAllBySiteIdsAndEmpCodes(@Param("siteIds") List<Long> siteIds,@Param("empIds") List<String> empIds, @Param("isClient") boolean isClient, Pageable pageRequest);

	@Query("SELECT distinct e FROM Employee e WHERE e.id IN :empIds and e.active='Y' and e.isLeft = FALSE and (client = :isClient or client = FALSE) order by e.empId ")
	Page<Employee> findAllByEmpIds(@Param("empIds") List<Long> empIds, @Param("isClient") boolean isClient, Pageable PageRequest);

    @Query("SELECT e FROM Employee e WHERE e.id = :employeeId and e.active='Y'")
    Page<Employee> findByEmployeeId(@Param("employeeId") long employeeId, Pageable pageRequest);

    @Query("SELECT e FROM Employee e WHERE e.empId = :employeeId and e.active='Y' and (client = :isClient or client = FALSE)")
    Page<Employee> findEmployeeId(@Param("employeeId") String employeeId, @Param("isClient") boolean isClient, Pageable pageRequest);

//	@Query("SELECT e FROM Employee e WHERE e.active='Y' and e.isLeft = FALSE order by e.name")
//    Page<Employee> findAll(Pageable pageRequest);

	@Query("SELECT distinct e FROM Employee e WHERE e.id IN (:empIds) and e.active='Y' and e.isLeft = FALSE order by e.name")
    List<Employee> findAllByIds(@Param("empIds") List<Long> empIds);

	@Query("SELECT e FROM Employee e WHERE e.id <> :empId and e.active='Y' and e.isLeft = FALSE  order by e.empId")
	List<Employee> findAllEligibleManagers(@Param("empId") long empId);

//    @Query("SELECT e FROM Employee e , User u WHERE u.userGroup.id = :userGroupId and e.isReliever=true and e.active='Y' order by e.empId")
//    List<Employee> findAllRelieversByGroupId(@Param("userGroupId") long userGroupId);

    @Query("SELECT e FROM Employee e join e.projectSites ps WHERE ps.site.id = :siteId and e.isReliever=true and e.active='Y' order by e.fullName")
    List<Employee> findAllRelievers(@Param("siteId") long siteId);

    @Query("SELECT distinct e FROM Employee e  WHERE e.id IN :empIds and  e.isReliever=true and e.active='Y' order by e.empId")
    List<Employee> findAllRelieversByIds(@Param("empIds") List<Long> empIds);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ((e.id = :employeeId and ps.project.id = :projectId) or ps.site.id = :siteId) and e.active='Y' and e.isLeft = FALSE and (client = :isClient or client = FALSE) order by e.empId")
	Page<Employee> findEmployeesByIdAndProjectIdOrSiteId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, @Param("isClient") boolean isClient, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ((e.id = :employeeId and ps.site.id = :siteId) or ps.project.id = :projectId) and e.active='Y' and e.isLeft = FALSE and (client = :isClient or client = FALSE) order by e.empId")
	Page<Employee> findEmployeesByIdAndSiteIdOrProjectId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, @Param("isClient") boolean isClient, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE (e.id = :employeeId or (ps.site.id = :siteId and ps.project.id = :projectId)) and e.active='Y' and e.isLeft = FALSE order by e.empId")
	Page<Employee> findEmployeesByIdOrSiteIdAndProjectId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE (e.id = :employeeId and ps.site.id = :siteId and ps.project.id = :projectId) and e.active='Y' and e.isLeft = FALSE order by e.empId")
	Page<Employee> findEmployeesByIdAndSiteIdAndProjectId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId,Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE (ps.site.id = :siteId and ps.project.id = :projectId) and e.active='Y' and e.isLeft = FALSE and (client = :isClient or client = FALSE) order by e.empId")
	Page<Employee> findBySiteIdAndProjectId(@Param("projectId") long projectId, @Param("siteId") long siteId, @Param("isClient") boolean isClient, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ((e.id = :employeeId and ps.project.id = :projectId) or ps.site.id = :siteId) and e.active='Y' and e.isLeft = FALSE and e.createdDate between :startDate and :endDate and (client = :isClient or client = FALSE) order by e.empId")
	Page<Employee> findEmployeesByIdAndProjectIdOrSiteId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, @Param("isClient") boolean isClient, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ((e.id = :employeeId and ps.site.id = :siteId) or ps.project.id = :projectId) and e.active='Y' and e.isLeft = FALSE and e.createdDate between :startDate and :endDate and (client =:isClient or client = FALSE) order by e.empId")
	Page<Employee> findEmployeesByIdAndSiteIdOrProjectId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, @Param("isClient") boolean isClient, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE (e.id = :employeeId or (ps.site.id = :siteId and ps.project.id = :projectId)) and e.active='Y' and e.isLeft = FALSE and e.createdDate between :startDate and :endDate order by e.empId")
	Page<Employee> findEmployeesByIdOrSiteIdAndProjectId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate,Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE (e.id = :employeeId and ps.site.id = :siteId and ps.project.id = :projectId) and e.active='Y' and e.isLeft = FALSE and e.createdDate between :startDate and :endDate order by e.empId")
	Page<Employee> findEmployeesByIdAndSiteIdAndProjectId(@Param("employeeId") long employeeId, @Param("projectId") long projectId, @Param("siteId") long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate,Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE (ps.site.id = :siteId and ps.project.id = :projectId) and e.active='Y' and e.isLeft = FALSE and e.createdDate between :startDate and :endDate and (client = :isClient or client = FALSE) order by e.empId")
	Page<Employee> findBySiteIdAndProjectId(@Param("projectId") long projectId, @Param("siteId") long siteId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, @Param("isClient") boolean isClient, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ps.site.name like '%' || :siteName || '%' and e.id in (:empIds) and e.active='Y' and e.isLeft = FALSE and (client = :isClient or client = FALSE) order by e.empId")
	Page<Employee> findBySiteName(@Param("siteName") String siteId, @Param("empIds") List<Long> empIds, @Param("isClient") boolean isClient, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ps.project.name like '%' || :projectName || '%' and e.id in (:empIds) and e.active='Y' and e.isLeft = FALSE and (client = :isClient or client = FALSE) order by e.empId")
	Page<Employee> findByProjectName(@Param("projectName") String projectName, @Param("empIds") List<Long> empIds, @Param("isClient") boolean isClient, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ps.site.id = :siteId and ps.project.id = :projectId and e.empId = :empId and e.active='Y' and e.isLeft = FALSE order by e.empId")
	Page<Employee> findByProjectSiteAndEmployeeEmpId(@Param("projectId") long projectId, @Param("siteId") long siteId, @Param("empId") String empId, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ps.site.id = :siteId and ps.project.id = :projectId and e.name like '%' || :empName || '%' and e.active='Y' and e.isLeft = FALSE and (client = :isClient or client = FALSE) order by e.empId")
	Page<Employee> findByProjectSiteAndEmployeeName(@Param("projectId") long projectId, @Param("siteId") long siteId, @Param("empName") String empName, @Param("isClient") boolean isClient, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ps.project.id = :projectId and e.name like '%' || :empName || '%' and e.active='Y' and e.isLeft = FALSE and (client = :isClient or client = FALSE) order by e.empId")
	Page<Employee> findByProjectAndEmployeeName(@Param("projectId") long projectId, @Param("empName") String empName, @Param("isClient") boolean isClient, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE  e.name like '%' || :empName || '%' and ps.site.id in (:siteIds) and e.active='Y' and (client = :isClient or client = FALSE) order by e.empId")
	Page<Employee> findByEmployeeName(@Param("siteIds") List<Long> siteIds, @Param("empName") String empName, @Param("isClient") boolean isClient, Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e  WHERE  e.name like '%' || :empName || '%' and e.active='Y' and (client = :isClient or client = FALSE) order by e.empId")
	Page<Employee> findByEmployeeName( @Param("empName") String empName, @Param("isClient") boolean isClient, Pageable pageRequest);

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

	@Query("SELECT e FROM Employee e where e.user.id = :userId and e.active='Y' ")
	Employee findByUserId(@Param("userId") Long userId);

	@Query("SELECT e FROM Employee e where e.user.id = :userId and e.active='Y' ")
	List<Employee> findListByUserId(@Param("userId") Long userId);

	@Query("SELECT distinct u FROM Employee e join e.user u where e.id IN :employeeIds and e.active='Y'")
	List<User> findUsersByEmployeeIds(@Param("employeeIds") List<Long> employeeIds);

    //	isLeft is removed from query as count in employee list mismatches with dashboard employees count - 11-12-2018 - Karthick
    //	@Query("SELECT count(distinct e) FROM Employee e join e.projectSites ps  WHERE ps.site.id = :siteId and e.active = 'Y' and e.isLeft = FALSE")
	@Query("SELECT count(distinct e) FROM Employee e join e.projectSites ps  WHERE ps.site.id = :siteId and e.active = 'Y'")
	long findCountBySiteId(@Param("siteId") long siteId);

    //	isLeft is removed from query as count in employee list mismatches with dashboard employees count - 11-12-2018 - Karthick
    // @Query("SELECT count(distinct e) FROM Employee e join e.projectSites ps WHERE ps.project.id = :projectId and e.active = 'Y' and e.isLeft = FALSE")
    @Query("SELECT count(distinct e) FROM Employee e join e.projectSites ps WHERE ps.project.id = :projectId and e.active = 'Y' ")
	long findCountByProjectId(@Param("projectId") long projectId);

    //	isLeft is removed from query as count in employee list mismatches with dashboard employees count - 11-12-2018 - Karthick
    //    @Query("SELECT count(distinct e) FROM Employee e join e.projectSites ps where ps.project.id IN (:projIds) and e.active = 'Y' and e.isLeft = FALSE")
    @Query("SELECT count(distinct e) FROM Employee e join e.projectSites ps where ps.project.id IN (:projIds) and e.active = 'Y' ")
	long findTotalCount(@Param("projIds") List<Long> projectIds);

    //	isLeft is removed from query as count in employee list mismatches with dashboard employees count - 11-12-2018 - Karthick
    //    @Query("SELECT count(distinct e) FROM Employee e join e.projectSites ps where ps.site.id IN (:siteIds) and e.active = 'Y' and e.isLeft = FALSE")
    @Query("SELECT count(distinct e) FROM Employee e join e.projectSites ps where ps.site.id IN (:siteIds) and e.active = 'Y' ")
	long findTotalCountBySites(@Param("siteIds") List<Long> siteIds);

    //	isLeft is removed from query as count in employee list mismatches with dashboard employees count - 11-12-2018 - Karthick
    //    @Query("SELECT count(e) FROM Employee e where e.active = 'Y' and e.isLeft = FALSE")
    @Query("SELECT count(e) FROM Employee e where e.active = 'Y' ")
	long findTotalCount();

	@Query( "SELECT e FROM Employee e where e.active = 'Y' and e.isLeft = FALSE")
	Page<Employee> findByOrder(Pageable pageRequest);

	//@Query("SELECT count(e) FROM Employee e join e.projectSites eps join eps.shifts es  WHERE eps.employee.id = e.id and eps.id = es.employeeProjectSite.id and eps.site.id = :siteId and es.startTime = :startTime and es.endTime = :endTime and e.active = 'Y' and e.isLeft = FALSE")
	//long findEmployeeCountBySiteAndShift(@Param("siteId") long siteId, @Param("startTime") String startTime, @Param("endTime") String endTime);

	@Query("SELECT distinct e FROM Employee e join e.projectSites ps WHERE ps.site.id = :siteId and e.id NOT IN :empIds and e.active='Y' and e.isLeft = FALSE order by e.designation")
	List<Employee> findNonMatchingBySiteId(@Param("siteId") long siteId, @Param("empIds") List<Long> empIds);

	@Query("SELECT emp FROM Employee emp WHERE emp.enrolled_face is not null and emp.active='Y'")
	Page<Employee> findByImage(Pageable pageRequest);

    @Query("SELECT distinct e FROM Employee e WHERE e.isFaceIdEnrolled = TRUE")
    List<Employee> findEnrolledEmployees();

    @Query("SELECT distinct e FROM Employee e WHERE e.id NOT IN (:subEmpList) and e.active='Y' and e.isLeft = FALSE order by e.name")
	List<Employee> findAllByNonIds(@Param("subEmpList") List<Long> subEmpList);

    @Query("SELECT e FROM Employee e join e.projectSites ps WHERE e.id NOT IN (:empIds) and ps.site.id  IN (:siteIds) and e.active='Y' order by e.name")
    List<Employee> findWithoutLeftEmp(@Param("empIds") List<Long> empIds,@Param("siteIds") List<Long> siteIds);
}
