package com.ts.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ts.app.domain.SlaEscalationConfig;

public interface SLAEscalationConfigRepository extends JpaRepository<SlaEscalationConfig, Long> {

}
