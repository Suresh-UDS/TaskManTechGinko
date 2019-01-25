package com.ts.app.repository;

import com.ts.app.domain.Manufacturer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ManufacturerRepository extends JpaRepository<Manufacturer, Long>,JpaSpecificationExecutor<Manufacturer> {

	@Override
	void delete(Manufacturer t);

	@Query("SELECT m FROM Manufacturer m WHERE m.active='Y' order by m.name")
	List<Manufacturer> findAll();

	@Query("SELECT m FROM Manufacturer m WHERE m.assetType = :assetType and m.active='Y' order by m.name")
	List<Manufacturer> findAllByAssetType(@Param("assetType") String assetType);

	@Query("SELECT m FROM Manufacturer m WHERE m.assetType = :assetType and m.active='Y' order by m.name")
	Page<Manufacturer> findAllByAssetType(@Param("assetType") String assetType, Pageable pageRequest);

	@Query("SELECT m FROM Manufacturer m WHERE m.name like '%' || :name || '%' and m.active='Y' order by m.name")
	Page<Manufacturer> findAllByName(@Param("name") String name, Pageable pageRequest);

	@Query("SELECT m FROM Manufacturer m WHERE m.assetType = :assetType and m.name like '%' || :name || '%' and m.active='Y' order by m.name")
	Page<Manufacturer> findAll(@Param("assetType") String assetType, @Param("name") String name, Pageable pageRequest);


}
