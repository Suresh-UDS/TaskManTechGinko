package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ts.app.domain.SlaConfig;

public interface SlaConfigRepository extends JpaRepository<SlaConfig, Long>{
	
	@Query("SELECT s FROM SlaConfig s WHERE s.active='Y' order by last_modified_date desc")
	List<SlaConfig> findActiveSlaConfig();
}
