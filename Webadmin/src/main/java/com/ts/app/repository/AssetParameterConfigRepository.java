package com.ts.app.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.AssetParameterConfig;
import com.ts.app.web.rest.dto.AssetParameterConfigDTO;

public interface AssetParameterConfigRepository extends JpaRepository<AssetParameterConfig ,Long>{

	@Query("SELECT at FROM AssetParameterConfig at WHERE at.active='Y' order by at.name")
	List<AssetParameterConfig> findAll();
	
	@Query("SELECT a FROM AssetParameterConfig a WHERE a.assetType like %:assetType% and a.active='Y' order by a.assetType")
	List<AssetParameterConfig> findByAssetType(@Param("assetType") String assetType);
	
	@Query("SELECT a FROM AssetParameterConfig a WHERE a.asset.id= :assetId and a.active='Y'")
	List<AssetParameterConfig> findByAssetId(@Param("assetId") long assetId);
	
	@Query("SELECT a FROM AssetParameterConfig a WHERE a.asset.id= :assetId and a.assetType= :assetType and a.active='Y'")
	List<AssetParameterConfig> findByAssetConfig(@Param("assetType") String assetType, @Param("assetId") long assetId);
	
}
