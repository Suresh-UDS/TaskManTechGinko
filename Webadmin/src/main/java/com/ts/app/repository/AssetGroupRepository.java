package com.ts.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ts.app.domain.AssetGroup;

public interface AssetGroupRepository extends JpaRepository<AssetGroup, Long> {

}
