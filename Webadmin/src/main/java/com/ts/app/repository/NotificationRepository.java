package com.ts.app.repository;

import com.ts.app.domain.NotificationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<NotificationLog, Long>{

	@Query("SELECT n FROM NotificationLog n WHERE n.toUser.id = :userId order by n.createdDate desc")
	Page<NotificationLog> findAllByToUserId(@Param("userId") long userId,Pageable pageRequest);

	@Query("SELECT n FROM NotificationLog n WHERE n.id = :jobId and n.fromUser.id = :fromUserId and n.toUser.id = :toUserId ")
	NotificationLog findByJobIdFromUserAndToUser(@Param("jobId") long jobId,@Param("fromUserId") long fromUserId,@Param("toUserId") long toUserId);

    @Query("SELECT n FROM NotificationLog n WHERE n.id = :assetId and n.fromUser.id = :fromUserId and n.toUser.id = :toUserId ")
    NotificationLog findByAssetIdFromUserAndToUser(@Param("assetId") long assetId,@Param("fromUserId") long fromUserId,@Param("toUserId") long toUserId);
}
