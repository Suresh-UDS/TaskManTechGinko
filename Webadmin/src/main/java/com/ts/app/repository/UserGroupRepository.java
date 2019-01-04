package com.ts.app.repository;

import com.ts.app.domain.UserGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Authority entity.
 */
public interface UserGroupRepository extends JpaRepository<UserGroup, Long> {

	@Query("SELECT ug FROM UserGroup ug WHERE ug.id = :userGroupId and ug.active='Y'")
	Page<UserGroup> findGroupsById(@Param("userGroupId") long userGroupId, Pageable pageRequest);

	@Query("SELECT ug FROM UserGroup ug WHERE ug.active='Y' and ug.name <> 'admin' order by last_modified_date desc")
	Page<UserGroup> findUserGroups(Pageable pageRequest);

	@Query("SELECT ug FROM UserGroup ug WHERE ug.active='Y' and ug.name <> 'admin' order by last_modified_date desc")
	List<UserGroup> findActiveUserGroups();
}
