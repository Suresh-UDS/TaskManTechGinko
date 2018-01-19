package com.ts.app.repository;

import com.ts.app.domain.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by karth on 7/5/2017.
 */
public interface AssetRepository extends JpaRepository<Asset, Long>,JpaSpecificationExecutor<Asset> {


    @Query("SELECT a from Asset a where a.title = :title")
    List<Asset> findAssetByTitle(@Param("title") String title);

    @Query("SELECT a from Asset a where a.code = :code")
    Asset findByCode(@Param("code") String code);

    List<Asset> findBySiteId(Long siteId);

}
