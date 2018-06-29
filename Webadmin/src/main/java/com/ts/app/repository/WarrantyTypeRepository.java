package com.ts.app.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.WarrantyType;

public interface WarrantyTypeRepository extends JpaRepository<WarrantyType, Long> {

	@Override
	void delete(WarrantyType t);

	@Query("SELECT at FROM WarrantyType at WHERE at.active='Y' order by at.name")
	List<WarrantyType> findAll();

	@Query("SELECT at FROM WarrantyType at WHERE at.name like '%' || :name || '%' and at.active='Y' order by at.name")
	Page<WarrantyType> findAllByName(@Param("name") String name, Pageable pageRequest);

	@Query("SELECT at FROM WarrantyType at WHERE at.name= :name")
	WarrantyType findByName(@Param("name") String name);

}
