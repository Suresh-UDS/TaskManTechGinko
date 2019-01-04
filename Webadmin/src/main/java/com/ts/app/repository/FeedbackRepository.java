package com.ts.app.repository;

import com.ts.app.domain.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Feedback entity.
 */
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {


	@Query("SELECT ft FROM Feedback ft")
	Page<Feedback> findAll(Pageable pageRequest);
	
	@Query("SELECT ft FROM Feedback ft WHERE ft.project.id = :projectId and ft.site.id = :siteId")
	Page<Feedback> findBySite(@Param("projectId") long projectId, @Param("siteId") long siteId, Pageable pageRequest);

	@Query("SELECT ft FROM Feedback ft WHERE ft.site.id in (:siteIds)")
	Page<Feedback> findBySites(@Param("siteIds") List<Long> siteIds, Pageable pageRequest);

}
