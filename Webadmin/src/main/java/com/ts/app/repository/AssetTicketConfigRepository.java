package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.ts.app.domain.AssetTicketConfig;

public interface AssetTicketConfigRepository extends JpaRepository<AssetTicketConfig, Long>{
	
	@Query("SELECT a FROM AssetTicketConfig a WHERE a.active='Y'")
	List<AssetTicketConfig> findAll();

}
