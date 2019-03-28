package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.Material;

public interface InventoryRepository extends JpaRepository<Material, Long>, JpaSpecificationExecutor<Material> {

	@Query("SELECT m FROM Material m WHERE m.id = :id and m.active='Y'")
	Material findByMaterialId(@Param("id") long id);

	@Query("SELECT m FROM Material m WHERE m.itemGroupId = :itemGroupId and m.active='Y'")
	List<Material> findByMaterialGroupId(@Param("itemGroupId") long itemGroupId);

	@Query("SELECT m FROM Material m WHERE m.name = :materialName and m.active='Y'")
	Material findByMaterialName(@Param("materialName") String materialName);

	@Query("SELECT m FROM Material m WHERE m.itemCode = :materialItemCode and m.active='Y'")
    List<Material> findByItemCode(@Param("materialItemCode") String materialItemCode);
	

}
