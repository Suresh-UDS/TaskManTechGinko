package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.AssetDocument;

public interface AssetDocumentRepository extends JpaRepository<AssetDocument, Long>{
	
	@Query("SELECT at FROM AssetDocument at WHERE at.active='Y' order by at.file")
	List<AssetDocument> findAll();

	@Query("SELECT ad FROM AssetDocument ad WHERE ad.asset.id = :assetId and ad.type = :type and ad.active='Y' order by ad.title")
	List<AssetDocument> findAllByType(@Param("type") String type, @Param("assetId") Long assetId);
	

}
