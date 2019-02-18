package com.ts.app.repository;

import com.ts.app.domain.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the UserRole entity.
 */
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {

	@Query("SELECT ur FROM UserRole ur WHERE ur.id = :userRoleId")
	UserRole findRoleById(@Param("userRoleId") long userRoleId);
	
	@Query("SELECT ur FROM UserRole ur WHERE ur.name = :name")
	Page<UserRole> findRoleByName(@Param("name") String name, Pageable pageRequest);
	
	@Query("SELECT ur FROM UserRole ur WHERE ur.active='Y' order by last_modified_date desc")
	List<UserRole> findActiveUserRoles();

    @Query("SELECT ur FROM UserRole ur WHERE NOT ur.name='Admin' order by last_modified_date desc")
    List<UserRole> findExcludeAdminRole();

	@Query("SELECT ur FROM UserRole ur WHERE ur.id = :userRoleId and ur.active='Y'")
	Page<UserRole> findRoleById(@Param("userRoleId") long userRoleId, Pageable pageRequest);

	/*@Query("SELECT ur FROM UserRole ur WHERE ur.active='Y' order by last_modified_date desc")
	Page<UserRole> findUserRoles(Pageable pageRequest);*/

    @Query("SELECT ur FROM UserRole ur WHERE ur.active='Y'")
    Page<UserRole> findUserRoles(Pageable pageRequest);

    @Query("SELECT ur FROM UserRole ur WHERE ur.roleLevel = :roleLevel and ur.active='Y'")
	Page<UserRole> findRoleByLevel(@Param("roleLevel") int roleLevel, Pageable pageRequest);


}
