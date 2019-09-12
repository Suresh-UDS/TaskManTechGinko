package com.ts.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.GeneralSettings;
import com.ts.app.domain.User;

public interface GeneralSettingsRepository extends JpaRepository<GeneralSettings, Long>{

	GeneralSettings findBySettingName(@Param("settingName") String settingName);
}
