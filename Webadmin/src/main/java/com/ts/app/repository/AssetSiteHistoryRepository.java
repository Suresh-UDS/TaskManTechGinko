package com.ts.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.AssetSiteHistory;

public interface AssetSiteHistoryRepository extends JpaRepository<AssetSiteHistory, Long> {
	
	@Query("SELECT at FROM AssetSiteHistory at WHERE at.asset.id = :assetId order by at.createdDate")
	Page<AssetSiteHistory> findAllByAsset(@Param("assetId") long assetId, Pageable pageRequest);

}
