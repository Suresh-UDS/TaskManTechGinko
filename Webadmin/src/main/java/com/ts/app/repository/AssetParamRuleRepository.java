package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ts.app.domain.AssetParameterReadingRule;

public interface AssetParamRuleRepository extends JpaRepository<AssetParameterReadingRule, Long>{
	
	@Query("SELECT at FROM AssetParameterReadingRule at WHERE at.active='Y' order by at.createdDate")
	List<AssetParameterReadingRule> findAll();

}
