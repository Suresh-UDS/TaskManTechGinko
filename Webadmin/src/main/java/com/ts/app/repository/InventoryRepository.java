package com.ts.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.ts.app.domain.Material;

public interface InventoryRepository extends JpaRepository<Material, Long>, JpaSpecificationExecutor<Material> {

}