package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.AssetPPMSchedule;

public interface AssetPpmScheduleRepository extends JpaRepository<AssetPPMSchedule ,Long>{

	@Query("SELECT a from AssetPPMSchedule a where a.asset.id = :assetId")
    List<AssetPPMSchedule> findAssetPPMScheduleByAssetId(@Param("assetId") long assetId);
}
