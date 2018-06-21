package com.ts.app.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.Asset;
import com.ts.app.domain.AssetAMCSchedule;
import com.ts.app.domain.AssetParameterReading;
import com.ts.app.domain.Employee;

/**
 * Created by karth on 7/5/2017.
 */
public interface AssetRepository extends JpaRepository<Asset, Long>,JpaSpecificationExecutor<Asset> {


    @Query("SELECT a from Asset a where a.title = :title")
    List<Asset> findAssetByTitle(@Param("title") String title);
    
    @Query("SELECT a from AssetAMCSchedule a where a.title = :title")
    List<AssetAMCSchedule> findAssetAMCScheduleByTitle(@Param("title") String title);
    

    @Query("SELECT a from Asset a where a.code = :code")
    Asset findByCode(@Param("code") String code);
    
    @Query("SELECT a from Asset a where a.title = :title")
    Asset findByTitle(@Param("title") String title);

    @Query("SELECT a from Asset a where a.code like '%' || :code || '%' and a.active = 'Y'  order by a.title")
    Page<Asset> findByAssetCode(@Param("code") String code, Pageable pageRequest);
    
    @Query("SELECT a from Asset a where a.assetType = :assetType and a.active = 'Y'  order by a.title")
    Page<Asset> findAssetByTypeName(@Param("assetType") String assetType, Pageable pageRequest);
    
    @Query("SELECT a from Asset a where a.assetGroup = :assetGroup and a.active = 'Y'  order by a.title")
    Page<Asset> findAssetByGroupName(@Param("assetGroup") String assetGroup, Pageable pageRequest);
    
    @Query("SELECT a from Asset a where a.acquiredDate = :acquiredDate and a.active = 'Y'  order by a.title")
    Page<Asset> findAssetByAcquireDate(@Param("acquiredDate") Date acquiredDate, Pageable pageRequest);
    
    @Query("SELECT a from Asset a where a.title like '%' || :name || '%' and a.active = 'Y'  order by a.title")
    Page<Asset> findByAssetTitle(@Param("name") String name, Pageable pageRequest);
    
    List<Asset> findBySiteId(Long siteId);
    
    @Query("SELECT a from Asset a where a.site.id = :siteId and a.active = 'Y'  order by a.title")
    Page<Asset> findBySiteId(@Param("siteId") long siteId, Pageable pageRequest);
    
    @Query("SELECT a from Asset a where a.site.project.id = :projectId and a.active = 'Y'  order by a.title")
    Page<Asset> findByProjectId(@Param("projectId") long projectId, Pageable pageRequest);

    @Query("SELECT a from Asset a where a.site.id in (:siteIds) and a.title like '%' || :name || '%' and a.active = 'Y'  order by a.title")
    Page<Asset> findByName(@Param("siteIds") List<Long> siteIds, @Param("name") String name, Pageable pageRequest);

    @Query("SELECT a from Asset a where a.site.id in (:siteIds) and a.assetType = :assetType  and a.active = 'Y'  order by a.title")
    Page<Asset> findByAssetType(@Param("siteIds") List<Long> siteIds, @Param("assetType") String assetType, Pageable pageRequest);

    @Query("SELECT a from Asset a where a.assetType = :assetType and a.title like '%' || :name || '%' and a.site.project.id = :projectId and a.site.id = :siteId and a.active = 'Y'  order by a.title")
    Page<Asset> findByAllCriteria(@Param("assetType") String assetType, @Param("name") String name,@Param("projectId") long projectId,@Param("siteId") long siteId, Pageable pageRequest);
    
    @Query("SELECT a from Asset a where a.title like '%' || :title || '%' and a.code like '%' || :code || '%' and a.active = 'Y'  order by a.title")
    Page<Asset> findAssetByTitleAndCode(@Param("title") String title, @Param("code") String code, Pageable pageRequest);
    
    @Query("SELECT a from Asset a where a.title like '%' || :title || '%' and a.assetType = :assetType and a.active = 'Y'  order by a.title")
    Page<Asset> findAssetByTitleAndType(@Param("title") String title, @Param("assetType") String assetType, Pageable pageRequest);
    
    @Query("SELECT a from Asset a where a.title like '%' || :title || '%' and a.site.id = :siteId and a.active = 'Y'  order by a.title")
    Page<Asset> findAssetByTitleAndSiteId(@Param("title") String title, @Param("siteId") long siteId, Pageable pageRequest);
    
    @Query("SELECT a from Asset a where a.title like '%' || :title || '%' and a.assetGroup = :assetGroup and a.active = 'Y'  order by a.title")
    Page<Asset> findAssetByTitleAndGroup(@Param("title") String title, @Param("assetGroup") String assetGroup, Pageable pageRequest);
    
    @Query("SELECT a from Asset a where a.site.id in (:siteIds) and a.active = 'Y'  order by a.title")
    Page<Asset> findAll(@Param("siteIds") List<Long> siteIds,  Pageable pageRequest);

    @Query("SELECT e FROM Asset e WHERE e.active='Y' order by e.title")
    Page<Asset> findAllAsset(Pageable pageRequest);

    @Query("SELECT r FROM AssetParameterReading r WHERE r.asset.id = :assetId and r.active = 'Y' order by r.createdDate DESC")
	List<AssetParameterReading> findByAssetReading(@Param("assetId") long assetId);
    
    @Query("SELECT r FROM AssetParameterReading r WHERE r.asset.id = :assetId and r.assetParameterConfig.id = :assetParamId and r.active = 'Y' order by r.createdDate DESC")
	List<AssetParameterReading> findAssetReadingById(@Param("assetId") long assetId, @Param("assetParamId") long assetParamId);

}
