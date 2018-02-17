package com.ts.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.Setting;

/**
 * 
 * @author gnana
 *
 */
public interface SettingRepository extends JpaRepository<Setting, Long>,JpaSpecificationExecutor<Setting> {


    @Query("SELECT s from Setting s where s.key = :key")
    Setting findSettingByKey(@Param("key") String key);

}
