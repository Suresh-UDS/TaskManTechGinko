package com.ts.app.repository;

import java.sql.Date;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.AssetPPMSchedule;

public interface AssetPpmScheduleRepository extends JpaRepository<AssetPPMSchedule, Long>,JpaSpecificationExecutor<AssetPPMSchedule> {

	@Query("SELECT a from AssetPPMSchedule a where a.asset.id = :assetId and a.maintenanceType = :type order by a.createdDate DESC")
    List<AssetPPMSchedule> findAssetPPMScheduleByAssetId(@Param("assetId") long assetId, @Param("type") String type);
	
	 @Query("SELECT a from AssetPPMSchedule a where a.asset.id = :assetId and a.active = 'Y'  order by a.title")
    Page<AssetPPMSchedule> findAllPPMSchedule(@Param("assetId") long assetId, Pageable pageRequest);
	 
	 @Query("SELECT a from AssetPPMSchedule a where a.title = :title and a.asset.id = :assetId and a.maintenanceType = :type and a.startDate = :startDate and a.jobStartTime between :fromDate and :toDate")
	 List<AssetPPMSchedule> findAssetPPMScheduleByTitle(@Param("assetId") long assetId, @Param("title") String title, @Param("type") String maintenanceType, @Param("startDate") Date startDate, @Param("fromDate") ZonedDateTime fromDate, @Param("toDate") ZonedDateTime toDate);
}
