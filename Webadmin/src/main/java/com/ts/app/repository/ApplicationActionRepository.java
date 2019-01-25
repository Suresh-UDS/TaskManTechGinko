package com.ts.app.repository;

import com.ts.app.domain.ApplicationAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the ApplicationAction entity.
 */
public interface ApplicationActionRepository extends JpaRepository<ApplicationAction, Long> {

	@Query("SELECT aa FROM ApplicationAction aa WHERE aa.active='Y' order by last_modified_date desc")
	List<ApplicationAction> findActiveApplicationActions();
	
	@Query("SELECT aa FROM ApplicationAction aa WHERE aa.id = :actionId and aa.active='Y'")
	Page<ApplicationAction> findApplicationActionById(@Param("actionId") long actionId, Pageable pageRequest);
	
	@Query("SELECT aa FROM ApplicationAction aa WHERE aa.active='Y' order by last_modified_date desc")
	Page<ApplicationAction> findApplicationActions(Pageable pageRequest);


}
