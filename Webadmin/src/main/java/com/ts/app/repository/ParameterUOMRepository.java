package com.ts.app.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.ParameterUOM;

public interface ParameterUOMRepository extends JpaRepository<ParameterUOM, Long> {

	@Override
	void delete(ParameterUOM p);

	@Query("SELECT p FROM ParameterUOM p WHERE p.active='Y' order by p.name")
	List<ParameterUOM> findAll();

	@Query("SELECT p FROM ParameterUOM p WHERE p.name like '%' || :name || '%' and p.active='Y' order by p.name")
	Page<ParameterUOM> findAllByName(@Param("name") String name, Pageable pageRequest);



}
