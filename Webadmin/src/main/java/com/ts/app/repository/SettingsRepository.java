package com.ts.app.repository;

import java.util.List;

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
public interface SettingsRepository extends JpaRepository<Setting, Long>,JpaSpecificationExecutor<Setting> {

    @Query("SELECT s from Setting s where s.settingKey = :key")
    Setting findSettingByKey(@Param("key") String key);

    @Query("SELECT s from Setting s where s.settingKey = :key and s.projectId = :projectId")
    Setting findSettingByKeyAndProjectId(@Param("key") String key,@Param("projectId") long projectId);

    @Query("SELECT s from Setting s where s.settingKey = :key and s.siteId = :siteId")
    Setting findSettingByKeyAndSiteId(@Param("key") String key,@Param("siteId") long siteId);

    @Query("SELECT s from Setting s where s.projectId = :projectId")
    List<Setting> findSettingByProjectId(@Param("projectId") long projectId);

    @Query("SELECT s from Setting s where s.siteId = :siteId")
    List<Setting> findSettingBySiteId(@Param("siteId") long siteId);
    
    @Query("SELECT s from Setting s where s.projectId = :projectId and s.siteId = :siteId")
    List<Setting> findSettingByProjectAndSiteId(@Param("projectId") long projectId, @Param("siteId") long siteId);


}
