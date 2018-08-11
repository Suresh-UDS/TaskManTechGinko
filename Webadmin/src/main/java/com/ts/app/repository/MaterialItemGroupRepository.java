package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.MaterialItemGroup;

public interface MaterialItemGroupRepository extends JpaRepository<MaterialItemGroup, Long>{

	@Query("SELECT mg FROM MaterialItemGroup mg WHERE mg.active='Y'")
	List<MaterialItemGroup> findAll();
	
	@Query("SELECT mg FROM MaterialItemGroup mg WHERE mg.itemGroup = :itemGroup")
	MaterialItemGroup findByName(@Param("itemGroup") String itemGroup);

}
