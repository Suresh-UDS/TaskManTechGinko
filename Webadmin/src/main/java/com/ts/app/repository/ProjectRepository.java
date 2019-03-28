package com.ts.app.repository;

import com.ts.app.domain.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

	// Optional<User> findOneByActivationKey(String activationKey);

	// List<User> findAllByActivatedIsFalseAndCreatedDateBefore(ZonedDateTime
	// dateTime);

	// Optional<User> findOneByResetKey(String resetKey);

	// Optional<User> findOneByEmail(String email);

	// Optional<Project> findOneByLogin(String login);

	@Query("SELECT p FROM Project p join p.employeeProjSites e WHERE e.employee.id = :empId and p.active = 'Y'")
	List<Project> findAll(@Param("empId") long empId);

//	@Query("SELECT distinct p FROM Project p join p.employees e WHERE e.id in (:empIds) and p.active = 'Y'")
//	List<Project> findAll(@Param("empIds") List<Long> empIds);

	@Query("SELECT distinct p FROM Project p join p.employeeProjSites e WHERE e.employee.id in (:empIds) and p.active = 'Y' order by p.name ASC")
	List<Project> findAll(@Param("empIds") List<Long> empIds);

	@Query("SELECT p FROM Project p where p.active='Y' order by p.name ASC ")
    List<Project> findAll();

	@Query("SELECT p FROM Project p join p.employeeProjSites e WHERE e.employee.id = :empId and p.active = 'Y'")
	List<Project> findAllByUserGroupId(@Param("empId") long empId);

	@Query("SELECT p FROM Project p WHERE p.name = :name and p.active = 'Y'")
	List<Project> findAllByName(@Param("name") String name);

	@Override
	void delete(Project t);

	@Query("SELECT distinct p FROM Project p join p.employeeProjSites e WHERE p.id = :projectId and e.employee.id in (:empIds) and p.active = 'Y'")
	Page<Project> findProjectsById(@Param("projectId") long projectId, @Param("empIds") List<Long> empIds, Pageable pageRequest);

	@Query("SELECT p FROM Project p WHERE p.id = :projectId and p.active = 'Y'")
	Page<Project> findProjectsById(@Param("projectId") long projectId, Pageable pageRequest);

	@Query("SELECT p FROM Project p join p.employeeProjSites e WHERE e.employee.id = :empId and p.active = 'Y'")
	Page<Project> findProjects(@Param("empId") long empId, Pageable pageRequest);

	@Query("SELECT distinct p FROM Project p join p.employeeProjSites e WHERE e.employee.id in (:empIds) and p.active = 'Y'")
	Page<Project> findProjects(@Param("empIds") List<Long> empIds, Pageable pageRequest);

	@Query("SELECT p FROM Project p WHERE p.active = 'Y'")
	Page<Project> findAllProjects(Pageable pageRequest);

	@Query("SELECT p FROM Project p WHERE p.name like '%' || :name || '%' and p.active = 'Y'")
	Page<Project> findAllByName(@Param("name") String name, Pageable pageRequest);

	@Query(value = "SELECT p FROM Project p where p.name =:name")
    List<Project> findNames(@Param("name") String name);

	@Query("SELECT distinct p FROM Project p join p.employeeProjSites e WHERE p.name like '%' || :name || '%' and e.employee.id in (:empIds) and p.active = 'Y'")
	Page<Project> findAllByName(@Param("name") String name, @Param("empIds") List<Long> empIds, Pageable pageRequest);

	@Query("SELECT distinct p FROM Project p WHERE p.id in (:projectIds) and p.active = 'Y'")
	List<Project> findProjectsByIds(@Param("projectIds") List<String> projectIds);
 
	Project findById(long id);
}
