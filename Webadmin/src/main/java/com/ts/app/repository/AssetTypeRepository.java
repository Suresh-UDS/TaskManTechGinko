package com.ts.app.repository;

import com.ts.app.domain.AssetType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AssetTypeRepository extends JpaRepository<AssetType, Long> {

	@Override
	void delete(AssetType t);

	@Query("SELECT at FROM AssetType at WHERE at.active='Y' order by at.name")
	List<AssetType> findAll();

	@Query("SELECT at FROM AssetType at WHERE at.name like '%' || :name || '%' and at.active='Y' order by at.name")
	Page<AssetType> findAllByName(@Param("name") String name, Pageable pageRequest);

	@Query("SELECT at FROM AssetType at WHERE at.name= :name")
	AssetType findByName(@Param("name") String name);

}
