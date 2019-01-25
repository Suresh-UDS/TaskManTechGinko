package com.ts.app.repository;

import com.ts.app.domain.SLANotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SLANotificationLogRepository extends JpaRepository<SLANotificationLog, Long>{

}
