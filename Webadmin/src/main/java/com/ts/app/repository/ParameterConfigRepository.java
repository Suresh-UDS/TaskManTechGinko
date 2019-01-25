package com.ts.app.repository;

import com.ts.app.domain.ParameterConfig;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
 
public interface ParameterConfigRepository extends JpaRepository<ParameterConfig, Long> {

	@Override
	void delete(ParameterConfig t);

	@Query("SELECT m FROM ParameterConfig m WHERE m.active='Y' order by m.name")
	List<ParameterConfig> findAll();

	@Query("SELECT m FROM ParameterConfig m WHERE m.assetType = :assetType and m.active='Y' order by m.name")
	List<ParameterConfig> findAllByAssetType(@Param("assetType") String assetType);

	@Query("SELECT m FROM ParameterConfig m WHERE m.assetType = :assetType and m.active='Y' order by m.name")
	Page<ParameterConfig> findAllByAssetType(@Param("assetType") String assetType, Pageable pageRequest);

	@Query("SELECT m FROM ParameterConfig m WHERE m.name like '%' || :name || '%' and m.active='Y' order by m.name")
	Page<ParameterConfig> findAllByName(@Param("name") String name, Pageable pageRequest);

	@Query("SELECT m FROM ParameterConfig m WHERE m.assetType = :assetType and m.name like '%' || :name || '%' and m.active='Y' order by m.name")
	Page<ParameterConfig> findAll(@Param("assetType") String assetType, @Param("name") String name, Pageable pageRequest);

	@Query("SELECT c FROM ParameterConfig c WHERE c.active='Y' order by c.createdDate DESC")
	Page<ParameterConfig> findAllConfig(Pageable pageRequest);


}
