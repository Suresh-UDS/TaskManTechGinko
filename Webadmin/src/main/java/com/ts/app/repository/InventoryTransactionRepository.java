package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.MaterialTransaction;

public interface InventoryTransactionRepository extends JpaRepository<MaterialTransaction, Long>, JpaSpecificationExecutor<MaterialTransaction>{

	@Query("SELECT mt FROM MaterialTransaction mt WHERE mt.material.id = :id and mt.active='Y'")
	List<MaterialTransaction> findByMaterialId(@Param("id") long id);

}
