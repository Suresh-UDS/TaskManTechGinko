package com.ts.app.repository;

import com.ts.app.domain.AssetParameterReadingRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AssetReadingRuleRepository extends JpaRepository<AssetParameterReadingRule , Long> { 
	
	@Query("SELECT ar FROM AssetParameterReadingRule ar WHERE ar.active='Y' order by ar.createdDate")
	List<AssetParameterReadingRule> findAll();
	
	@Query("SELECT a FROM AssetParameterReadingRule a WHERE a.assetParameterConfig.id= :assetConfigId and a.active='Y'")
	List<AssetParameterReadingRule> findByAssetConfigId(@Param("assetConfigId") long assetConfigId);

}
