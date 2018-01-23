package com.ts.app.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.UserRolePermission;

/**
 * Spring Data JPA repository for the UserRolePermission entity.
 */
public interface UserRolePermissionRepository extends JpaRepository<UserRolePermission, Long> {

	@Query("SELECT ur FROM UserRolePermission ur WHERE ur.active='Y' order by last_modified_date desc")
	List<UserRolePermission> findActiveUserRolePermissions();
	
	@Query("SELECT ur FROM UserRolePermission ur WHERE ur.id = :permissionId and ur.active='Y'")
	Page<UserRolePermission> findUserRolePermissionById(@Param("permissionId") long permissionId, Pageable pageRequest);
	
	@Query("SELECT ur FROM UserRolePermission ur WHERE ur.active='Y' order by last_modified_date desc")
	Page<UserRolePermission> findUserRolePermissions(Pageable pageRequest);


}
