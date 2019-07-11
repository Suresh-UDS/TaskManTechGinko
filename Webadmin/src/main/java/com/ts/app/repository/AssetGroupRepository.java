package com.ts.app.repository;

import com.ts.app.domain.AssetGroup;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AssetGroupRepository extends JpaRepository<AssetGroup, Long> {

	@Query("SELECT at FROM AssetGroup at WHERE at.assetgroup= :assetgroup")
	AssetGroup findByName(@Param("assetgroup") String assetgroup);
	
	List<AssetGroup> findBySiteIdAndActiveAndParentGroup(long siteId,String active, AssetGroup parentAssetGroup);
}
