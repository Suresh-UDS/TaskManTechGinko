package com.ts.app.repository;

import com.ts.app.domain.ApplicationModule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the UserRole entity.
 */
public interface ApplicationModuleRepository extends JpaRepository<ApplicationModule, Long> {

	@Query("SELECT am FROM ApplicationModule am WHERE am.active='Y' order by last_modified_date desc")
	List<ApplicationModule> findActiveApplicationModules();

	@Query("SELECT am FROM ApplicationModule am WHERE am.id = :moduleId and am.active='Y'")
	Page<ApplicationModule> findApplicationModuleById(@Param("moduleId") long moduleId, Pageable pageRequest);

	/*@Query("SELECT am FROM ApplicationModule am WHERE am.active='Y' order by last_modified_date desc")
	Page<ApplicationModule> findApplicationModules(Pageable pageRequest);*/

    @Query("SELECT am FROM ApplicationModule am WHERE am.active='Y'")
    Page<ApplicationModule> findApplicationModules(Pageable pageRequest);

}
