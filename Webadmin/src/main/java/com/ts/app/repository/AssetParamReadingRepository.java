package com.ts.app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.AssetParameterReading;

public interface AssetParamReadingRepository extends JpaRepository<AssetParameterReading ,Long>{

	@Query("SELECT at FROM AssetParameterReading at WHERE at.active='Y' order by at.name")
	List<AssetParameterReading> findAll();
	
	@Query("SELECT a FROM AssetParameterReading a WHERE a.asset.id= :assetId and a.active='Y'")
	List<AssetParameterReading> findByAssetId(@Param("assetId") long assetId);
	
	
}