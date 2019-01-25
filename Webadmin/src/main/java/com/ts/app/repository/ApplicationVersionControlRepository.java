package com.ts.app.repository;

import com.ts.app.domain.ApplicationVersionControl;
import com.ts.app.domain.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ApplicationVersionControlRepository extends JpaRepository<ApplicationVersionControl, Long>,JpaSpecificationExecutor<Setting> {
    @Query("SELECT a from ApplicationVersionControl a where a.storeName = :storeName")
    ApplicationVersionControl findByApplicationStoreName(@Param("storeName") String storeName);
}
