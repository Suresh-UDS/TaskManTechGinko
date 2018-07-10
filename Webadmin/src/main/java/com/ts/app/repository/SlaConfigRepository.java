package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.ts.app.domain.Site;
import com.ts.app.domain.SlaConfig;

public interface SlaConfigRepository extends JpaRepository<SlaConfig, Long>,JpaSpecificationExecutor<SlaConfig> {

	@Query("SELECT s FROM SlaConfig s WHERE s.active='Y' order by s.lastModifiedBy")
	List<SlaConfig> findAll();
}
