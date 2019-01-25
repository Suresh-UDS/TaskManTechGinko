package com.ts.app.repository;

import com.ts.app.domain.AssetAMCSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * 
 * @author gnana
 *
 */
public interface AssetAMCRepository extends JpaRepository<AssetAMCSchedule, Long>,JpaSpecificationExecutor<AssetAMCSchedule> {


    @Query("SELECT a from AssetAMCSchedule a where a.title = :title")
    List<AssetAMCSchedule> findAssetAMCScheduleByTitle(@Param("title") String title);
    
    @Query("SELECT a from AssetAMCSchedule a where a.asset.id = :assetId order by a.createdDate DESC")
    List<AssetAMCSchedule> findAssetAMCScheduleByAssetId(@Param("assetId") long assetId);


}
