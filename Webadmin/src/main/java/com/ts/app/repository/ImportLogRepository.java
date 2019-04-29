package com.ts.app.repository;

import com.ts.app.domain.ImportLogs;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImportLogRepository extends JpaRepository<ImportLogs, Long> {

}
