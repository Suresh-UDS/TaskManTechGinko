package com.ts.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.ts.app.domain.SlaConfig;

public interface SlaConfigRepository extends JpaRepository<SlaConfig, Long>,JpaSpecificationExecutor<SlaConfig> {

}
