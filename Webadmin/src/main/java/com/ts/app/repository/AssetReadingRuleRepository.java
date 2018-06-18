package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.AssetParameterReadingRule;

public interface AssetReadingRuleRepository extends JpaRepository<AssetParameterReadingRule , Long> { 
	
	@Query("SELECT ar FROM AssetParameterReadingRule ar WHERE ar.active='Y' order by ar.createdDate")
	List<AssetParameterReadingRule> findAll();
	
	@Query("SELECT a FROM AssetParameterReadingRule a WHERE a.asseParameterConfig.id= :assetConfigId and a.active='Y'")
	List<AssetParameterReadingRule> findByAssetConfigId(@Param("assetConfigId") long assetConfigId);

}
