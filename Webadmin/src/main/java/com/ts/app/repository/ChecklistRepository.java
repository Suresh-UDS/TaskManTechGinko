package com.ts.app.repository;

import com.ts.app.domain.Checklist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Checklist entity.
 */
public interface ChecklistRepository extends JpaRepository<Checklist, Long> {

	@Query("SELECT cl FROM Checklist cl WHERE cl.active='Y' order by last_modified_date desc")
	List<Checklist> findActiveChecklists();
	
	@Query("SELECT cl FROM Checklist cl WHERE cl.site.id = :siteId and cl.active='Y'")
	Page<Checklist> findBySiteId(@Param("siteId") long siteId, Pageable pageRequest);
	
	@Query("SELECT cl FROM Checklist cl WHERE cl.active='Y' order by last_modified_date desc")
	Page<Checklist> findActiveChecklists(Pageable pageRequest);

	@Query("SELECT cl FROM Checklist cl WHERE cl.project.id = :projectId and cl.active='Y'")
	Page<Checklist> findByProjectId(@Param("projectId") long projectId, Pageable pageRequest);

	@Query("SELECT cl FROM Checklist cl WHERE cl.name = :name and cl.active='Y'")
	Page<Checklist> findByName(@Param("name") String name, Pageable pageRequest);
}
