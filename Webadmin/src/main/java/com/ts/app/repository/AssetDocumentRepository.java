package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ts.app.domain.AssetDocument;

public interface AssetDocumentRepository extends JpaRepository<AssetDocument, Long>{
	
	@Query("SELECT at FROM AssetDocument at WHERE at.active='Y' order by at.file")
	List<AssetDocument> findAll();
	

}
