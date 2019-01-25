package com.ts.app.repository;

import com.ts.app.domain.AssetParameterReadingRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AssetParamRuleRepository extends JpaRepository<AssetParameterReadingRule, Long>{
	
	@Query("SELECT at FROM AssetParameterReadingRule at WHERE at.active='Y' order by at.createdDate")
	List<AssetParameterReadingRule> findAll();

}
