package com.ts.app.repository;

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

	@Query("SELECT e FROM Employee e join e.sites s WHERE s.id = :siteId")
	List<Employee> findBySiteId(@Param("siteId") long siteId);

	@Query("SELECT e FROM Employee e join e.projects p WHERE p.id = :projectId")
	List<Employee> findByProjectId(@Param("projectId") long projectId);

	@Query("SELECT e FROM Employee e WHERE e.empId IN :empIds order by e.empId")
	List<Employee> findAllByEmpIds(@Param("empIds") List<String> empIds);

	@Query("SELECT e FROM Employee e , User u WHERE e.user.id = u.id and u.userGroup.id = :userGroupId order by e.empId")
	List<Employee> findAllActiveAndInactive(@Param("userGroupId") long userGroupId);

	@Query("SELECT e FROM Employee e , User u WHERE e.user.id = u.id and u.userGroup.id = :userGroupId and e.active='Y' order by e.empId")
	List<Employee> findAll(@Param("userGroupId") long userGroupId);

	@Query("SELECT e FROM Employee e, User u WHERE e.user.id = u.id and u.userGroup.id = :userGroupId and e.active='Y' order by e.empId")
    Page<Employee> findEmployees(@Param("userGroupId") long userGroupId, Pageable pageRequest);

    @Query("SELECT e FROM Employee e WHERE e.id = :employeeId")
    Page<Employee> findByEmployeeId(@Param("employeeId") long employeeId, Pageable pageRequest);

	@Query("SELECT e FROM Employee e WHERE e.active='Y' order by e.createdDate desc")
    Page<Employee> findAll(Pageable pageRequest);

	@Query("SELECT e FROM Employee e WHERE e.id <> :empId and e.active='Y' order by e.empId")
	List<Employee> findAllEligibleManagers(@Param("empId") long empId);


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

	@Query("SELECT u FROM Employee e join e.user u where e.id IN :employeeIds")
	List<User> findUsersByEmployeeIds(@Param("employeeIds") List<Long> employeeIds);

	@Query("SELECT count(e) FROM Employee e join e.sites s WHERE s.id = :siteId")
	long findCountBySiteId(@Param("siteId") long siteId);

	@Query("SELECT count(e) FROM Employee e")
	long findTotalCount();
}
