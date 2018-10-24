package com.ts.app.repository;

import java.sql.Date;
import java.time.ZonedDateTime;
import java.util.List;

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

	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.block = :block and ft.floor = :floor and ft.zone = :zone and ft.createdDate between :startDate and :endDate")
	Page<FeedbackTransaction> findByLocation(@Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor, @Param("zone") String zone, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);
	
	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.block = :block and ft.floor = :floor and ft.name = :name")
	Page<FeedbackTransaction> findByLocationAndName(@Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor, @Param("name") String name, Pageable pageRequest);

	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.block = :block and ft.name = :name")
	Page<FeedbackTransaction> findByLocationAndName(@Param("siteId") long siteId, @Param("block") String block, @Param("name") String name, Pageable pageRequest);

	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.name = :name")
	Page<FeedbackTransaction> findBySiteAndName(@Param("siteId") long siteId, @Param("name") String name, Pageable pageRequest);

	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.projectId = :projectId and ft.name = :name")
	Page<FeedbackTransaction> findByProjectAndName(@Param("projectId") long projectId, @Param("name") String name, Pageable pageRequest);

	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.projectId = :projectId and ft.createdDate between :startDate and :endDate")
	Page<FeedbackTransaction> findByProject(@Param("projectId") long projectId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate,Pageable pageRequest);

	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.siteId = :siteId")
	Page<FeedbackTransaction> findBySite(@Param("siteId") long siteId, Pageable pageRequest);
	
	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.createdDate between :startDate and :endDate")
	Page<FeedbackTransaction> findBySite(@Param("siteId") long siteId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.projectId = :projectId and ft.siteId = :siteId and ft.block = :block and  ft.createdDate between :startDate and :endDate")
	Page<FeedbackTransaction> findByBlock(@Param("siteId") long siteId, @Param("block") String block,@Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);

	@Query("SELECT ft FROM FeedbackTransaction ft WHERE ft.projectId = :projectId and ft.siteId = :siteId and ft.block = :block and ft.floor = :floor and  ft.createdDate between :startDate and :endDate")
	Page<FeedbackTransaction> findByFloor(@Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate, Pageable pageRequest);
	
	//report queries
	@Query("SELECT count(ft) FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.block = :block and ft.floor = :floor and ft.zone = :zone and ft.createdDate between :startDate and :endDate")
	long getFeedbackCount(@Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor, @Param("zone") String zone, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

	@Query("SELECT avg(ft.rating) FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.block = :block and ft.floor = :floor and ft.zone = :zone and ft.createdDate between :startDate and :endDate")
	Float getFeedbackOverallRating(@Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor, @Param("zone") String zone, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

	@Query("SELECT distinct ftr.question as question, ftr.answer as answer, count(ftr.answer) as count FROM FeedbackTransactionResult ftr WHERE ftr.feedbackTransaction.siteId = :siteId and ftr.feedbackTransaction.block = :block and ftr.feedbackTransaction.floor = :floor and ftr.feedbackTransaction.zone = :zone and ftr.feedbackTransaction.feedback.id = :feedbackMasterId and ftr.createdDate between :startDate and :endDate group by ftr.question, ftr.answer")
	List<Object[]> getFeedbackAnswersCountForYesNo(@Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor, @Param("zone") String zone, @Param("feedbackMasterId") long feedbackMasterId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

	@Query("SELECT distinct ftr.question as question, ftr.answer as answer, count(ftr.answer) as avg FROM FeedbackTransactionResult ftr WHERE ftr.feedbackTransaction.feedback.id = :feedbackMasterId and ftr.createdDate between :startDate and :endDate and ftr.answerType = 1 group by ftr.question, ftr.answer")
	List<Object[]> getFeedbackAnswersCountForRating(@Param("feedbackMasterId") long feedbackMasterId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

	@Query("SELECT distinct ftr.question as question, ftr.answer as answer, count(ftr.answer) as count FROM FeedbackTransactionResult ftr WHERE ftr.feedbackTransaction.siteId = :siteId and ftr.createdDate between :startDate and :endDate and ftr.answerType = 0 group by ftr.question, ftr.answer")
	List<Object[]> getFeedbackAnswersCountForYesNoBySite(@Param("siteId") long siteId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

	
	/*@Query("SELECT avg(ft.rating), ft.zone FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.createdDate >= DATE(NOW()) - INTERVAL 7 DAY")
	List<Object[]> getWeeklySite(@Param("siteId") long siteId);

	@Query("SELECT avg(ft.rating),  DAY(ft.createdDate) FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.zone= :zone and ft.createdDate >= DATE(NOW()) - INTERVAL 7 DAY")
	List<Object[]> getWeeklyZone(@Param("siteId") long siteId, @Param("zone") String zone);*/

	@Query("SELECT avg(ft.rating), ft.zone FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.createdDate between :startDate and :endDate group by ft.zone")
	List<Object[]> getWeeklySite(@Param("siteId") long siteId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

	@Query("SELECT avg(ft.rating), ft.siteName FROM FeedbackTransaction ft WHERE ft.projectId = :projectId and ft.createdDate between :startDate and :endDate group by ft.siteName")
	List<Object[]> getSitewiseAverageRating(@Param("projectId") long projectId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

	@Query("SELECT avg(ft.rating), date_format(ft.createdDate,'%d-%M-%Y') as reportDate FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.block= :block  and ft.floor= :floor and ft.zone= :zone and ft.createdDate between :startDate and :endDate group by date_format(ft.createdDate,'%d-%M-%Y')")
	List<Object[]> getWeeklyZone(@Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor, @Param("zone") String zone, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);
	
	//weekly feedback count
	@Query("SELECT count(ft) FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.createdDate between :startDate and :endDate")
	long getWeeklyFeedbackCount(@Param("siteId") long siteId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);
	
	@Query("SELECT count(ft) FROM FeedbackTransaction ft WHERE ft.projectId = :projectId and ft.createdDate between :startDate and :endDate")
	long getWeeklyFeedbackCountByProject(@Param("projectId") long projectId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

	// weekly overall Rating
	@Query("SELECT avg(ft.rating) FROM FeedbackTransaction ft WHERE ft.siteId = :siteId and ft.createdDate between :startDate and :endDate")
	Float getWeeklyOverallRating(@Param("siteId") long siteId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

	@Query("SELECT avg(ft.rating) FROM FeedbackTransaction ft WHERE ft.projectId = :projectId and ft.createdDate between :startDate and :endDate")
	Float getWeeklyOverallRatingByProject(@Param("projectId") long siteId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

	// weekly getWeeklyFeedbackAnswersCountForYesNo
	@Query("SELECT distinct ftr.question as question, ftr.answer as answer, count(ftr.answer) as count FROM FeedbackTransactionResult ftr WHERE ftr.feedbackTransaction.siteId = :siteId and ftr.createdDate between :startDate and :endDate and ftr.answerType = 0 group by ftr.question, ftr.answer")
	List<Object[]> getWeeklyFeedbackAnswersCountForYesNo(@Param("siteId") long siteId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

	// weekly getWeeklyFeedbackAnswersCountForRating
	@Query("SELECT distinct ftr.question as question, ftr.answer as answer, count(ftr.answer) as avg FROM FeedbackTransactionResult ftr WHERE ftr.feedbackTransaction.siteId = :siteId and ftr.createdDate between :startDate and :endDate and ftr.answerType = 1 group by ftr.question, ftr.answer")
	List<Object[]> getWeeklyFeedbackAnswersCountForRating(@Param("siteId") long feedbackMasterId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

	// weekly getWeeklyFeedbackAnswersCountForYesNo
	@Query("SELECT count(ftr.answer) as count FROM FeedbackTransactionResult ftr WHERE ftr.feedbackTransaction.siteId = :siteId and ftr.createdDate between :startDate and :endDate and ftr.answerType = 0")
	List<Object[]> getWeeklyOverallFeedbackAnswerCountForYesNoBySite(@Param("siteId") long siteId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

	// weekly getWeeklyFeedbackAnswersCountForRating
	@Query("SELECT count(ftr.answer) as count FROM FeedbackTransactionResult ftr WHERE ftr.feedbackTransaction.siteId = :siteId and ftr.createdDate between :startDate and :endDate and ftr.answerType = 1")
	List<Object[]> getWeeklyOverallFeedbackAnswerCountForRatingBySite(@Param("siteId") long feedbackMasterId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

	// weekly getWeeklyFeedbackAnswersCountForYesNo
	@Query("SELECT count(ftr.answer) as count FROM FeedbackTransactionResult ftr WHERE ftr.feedbackTransaction.feedback.id = :feedbackMasterId and ftr.createdDate between :startDate and :endDate and ftr.answerType = 0")
	List<Object[]> getWeeklyOverallFeedbackAnswerCountForYesNoByFeedbackZone(@Param("feedbackMasterId") long feedbackMasterId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

	// weekly getWeeklyFeedbackAnswersCountForRating
	@Query("SELECT count(ftr.answer) as count FROM FeedbackTransactionResult ftr WHERE ftr.feedbackTransaction.feedback.id = :feedbackMasterId and ftr.createdDate between :startDate and :endDate and ftr.answerType = 1")
	List<Object[]> getWeeklyOverallFeedbackAnswerCountForRatingByFeedbackZone(@Param("feedbackMasterId") long feedbackMasterId, @Param("startDate") ZonedDateTime startDate, @Param("endDate") ZonedDateTime endDate);

}
