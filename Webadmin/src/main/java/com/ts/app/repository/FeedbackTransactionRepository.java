package com.ts.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.FeedbackTransaction;

/**
 * Spring Data JPA repository for the FeedbackTransaction entity.
 */
public interface FeedbackTransactionRepository extends JpaRepository<FeedbackTransaction, Long> {

	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.block = :block and ft.floor = :floor and ft.zone = :zone")
	Page<FeedbackTransaction> findByLocation(@Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor, @Param("zone") String zone, Pageable pageRequest);
	
	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.block = :block and ft.floor = :floor and ft.name = :name")
	Page<FeedbackTransaction> findByLocationAndName(@Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor, @Param("name") String name, Pageable pageRequest);

	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.block = :block and ft.name = :name")
	Page<FeedbackTransaction> findByLocationAndName(@Param("siteId") long siteId, @Param("block") String block, @Param("name") String name, Pageable pageRequest);

	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.name = :name")
	Page<FeedbackTransaction> findBySiteAndName(@Param("siteId") long siteId, @Param("name") String name, Pageable pageRequest);

	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.projectId = :projectId and ft.name = :name")
	Page<FeedbackTransaction> findByProjectAndName(@Param("projectId") long projectId, @Param("name") String name, Pageable pageRequest);

	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.projectId = :projectId")
	Page<FeedbackTransaction> findByProject(@Param("projectId") long projectId, Pageable pageRequest);

	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.siteId = :siteId")
	Page<FeedbackTransaction> findBySite(@Param("siteId") long siteId, Pageable pageRequest);
	
	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.projectId = :projectId and ft.siteId = :siteId and ft.block = :block")
	Page<FeedbackTransaction> findByBlock(@Param("siteId") long siteId, @Param("block") String block,Pageable pageRequest);

	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.projectId = :projectId and ft.siteId = :siteId and ft.block = :block and ft.floor = :floor")
	Page<FeedbackTransaction> findByFloor(@Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor, Pageable pageRequest);


}
