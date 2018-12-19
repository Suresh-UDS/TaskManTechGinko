package com.ts.app.repository;

import com.ts.app.domain.UserRolePermission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the UserRolePermission entity.
 */
public interface UserRolePermissionRepository extends JpaRepository<UserRolePermission, Long> {

	@Query("SELECT ur FROM UserRolePermission ur WHERE ur.active='Y' order by last_modified_date desc")
	List<UserRolePermission> findActiveUserRolePermissions();
	
	@Query("SELECT ur FROM UserRolePermission ur WHERE ur.role.id = :roleId and ur.active='Y'")
	Page<UserRolePermission> findUserRolePermissionByRoleId(@Param("roleId") long roleId, Pageable pageRequest);
	
	@Query("SELECT ur FROM UserRolePermission ur WHERE ur.active='Y' order by last_modified_date desc")
	Page<UserRolePermission> findUserRolePermissions(Pageable pageRequest);
	
	@Modifying
	@Query("DELETE FROM UserRolePermission ur WHERE ur.role.id = :roleId")
	void deleteByRoleId(@Param("roleId") long roleId);


}
