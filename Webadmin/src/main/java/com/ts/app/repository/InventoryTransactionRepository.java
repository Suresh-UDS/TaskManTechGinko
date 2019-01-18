package com.ts.app.repository;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.MaterialTransaction;

public interface InventoryTransactionRepository extends JpaRepository<MaterialTransaction, Long>, JpaSpecificationExecutor<MaterialTransaction>{

	@Query("SELECT mt FROM MaterialTransaction mt WHERE mt.material.id = :id and mt.active='Y'")
	List<MaterialTransaction> findByMaterialId(@Param("id") long id);
	
	@Query("SELECT mt FROM MaterialTransaction mt WHERE mt.material.id = :materialId and mt.active='Y'")
	Page<MaterialTransaction> findByMaterialTransaction(@Param("materialId") long materialId, Pageable pageRequest);

	@Query("SELECT mt FROM MaterialTransaction mt WHERE mt.transactionDate between :transactionFromDate and :transactionToDate and mt.active='Y'")
	Page<MaterialTransaction> findByTransactionDate(@Param("transactionFromDate") Timestamp transactionFromDate, @Param("transactionToDate") Timestamp transactionToDate, Pageable pageRequest);

}
