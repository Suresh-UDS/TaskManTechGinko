package com.ts.app.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.SlaConfig;

public interface SlaConfigRepository extends JpaRepository<SlaConfig, Long>{
	
	@Query("SELECT s FROM SlaConfig s WHERE s.active='Y' order by last_modified_date desc")
	List<SlaConfig> findActiveSlaConfig();
	
	@Query("SELECT s FROM SlaConfig s WHERE s.site.id = :siteId and s.active='Y'")
	Page<SlaConfig> findSlaBySiteId(@Param("siteId") long siteId, Pageable pageRequest);
	
	@Query("SELECT s FROM SlaConfig s WHERE s.active='Y' order by last_modified_date desc")
	Page<SlaConfig> findActiveAllSlaConfig(Pageable pageRequest);
	
	@Query("SELECT s FROM SlaConfig s ")
	Page<SlaConfig> findSlaBySiteName(Pageable pageRequest);
	
}
