package com.ts.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.ts.app.domain.MaterialTransaction;

public interface InventoryTransactionRepository extends JpaRepository<MaterialTransaction, Long>, JpaSpecificationExecutor<MaterialTransaction>{

}
