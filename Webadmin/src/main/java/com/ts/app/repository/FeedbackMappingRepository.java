package com.ts.app.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.FeedbackMapping;

/**
 * Spring Data JPA repository for the Feedback Mapping entity.
 */
public interface FeedbackMappingRepository extends JpaRepository<FeedbackMapping, Long> {



	@Query("SELECT ft FROM FeedbackMapping ft")
	Page<FeedbackMapping> findAll(Pageable pageRequest);

	@Query("SELECT ft FROM FeedbackMapping ft WHERE ft.site.id = :siteId and ft.block = :block and ft.floor = :floor and ft.zone = :zone")
	Page<FeedbackMapping> findByLocation(@Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor, @Param("zone") String zone, Pageable pageRequest);

	@Query("SELECT ft FROM FeedbackMapping ft WHERE ft.site.id = :siteId and ft.block = :block and ft.floor = :floor and ft.zone = :zone")
	FeedbackMapping findOneByLocation(@Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor, @Param("zone") String zone);
	
	@Query("SELECT ft FROM FeedbackMapping ft WHERE ft.site.id = :siteId")
	FeedbackMapping findSiteByLocation(@Param("siteId") long siteId);

	@Query("SELECT ft FROM FeedbackMapping ft WHERE ft.site.id in (:siteIds)")
	Page<FeedbackMapping> findBySites(@Param("siteIds") List<Long> siteIds, Pageable pageRequest);

}
