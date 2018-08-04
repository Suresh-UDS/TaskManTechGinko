package com.ts.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ts.app.domain.SLANotificationLog;

public interface SLANotificationLogRepository extends JpaRepository<SLANotificationLog, Long>{

}
