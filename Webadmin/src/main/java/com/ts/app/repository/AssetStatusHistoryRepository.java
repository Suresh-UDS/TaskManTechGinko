package com.ts.app.repository;

import com.ts.app.domain.AssetStatusHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AssetStatusHistoryRepository extends JpaRepository<AssetStatusHistory, Long> {
	@Query("SELECT at FROM AssetStatusHistory at WHERE at.active='Y' order by at.status")
	List<AssetStatusHistory> findAll();

	@Query("SELECT at FROM AssetStatusHistory at WHERE at.status like '%' || :status || '%' and at.active='Y' order by at.status")
	Page<AssetStatusHistory> findAllByName(@Param("status") String status, Pageable pageRequest);

	@Query("SELECT at FROM AssetStatusHistory at WHERE at.status= :status")
	AssetStatusHistory findByName(@Param("status") String name);

	@Query("SELECT at FROM AssetStatusHistory at WHERE at.asset.id = :assetId order by at.createdDate desc")
	Page<AssetStatusHistory> findByAssetId(@Param("assetId") long assetId, Pageable pageRequest);
}
