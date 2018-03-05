package com.ts.app.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.Feedback;

/**
 * Spring Data JPA repository for the Feedback entity.
 */
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {


	@Query("SELECT ft FROM Feedback ft")
	Page<Feedback> findAll(Pageable pageRequest);
	
	@Query("SELECT ft FROM Feedback ft WHERE ft.project.id = :projectId and ft.site.id = :siteId")
	List<Feedback> findBySite(@Param("projectId") long projectId, @Param("siteId") long siteId);


}
