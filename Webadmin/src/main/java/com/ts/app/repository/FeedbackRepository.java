package com.ts.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ts.app.domain.Feedback;

/**
 * Spring Data JPA repository for the Feedback entity.
 */
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {


	@Query("SELECT ft FROM Feedback ft")
	Page<Feedback> findAll(Pageable pageRequest);


}
