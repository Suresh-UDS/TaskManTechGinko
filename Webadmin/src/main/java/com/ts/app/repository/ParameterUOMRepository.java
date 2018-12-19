package com.ts.app.repository;

import com.ts.app.domain.ParameterUOM;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ParameterUOMRepository extends JpaRepository<ParameterUOM, Long> {

	@Override
	void delete(ParameterUOM p);

	@Query("SELECT p FROM ParameterUOM p WHERE p.active='Y' order by p.uom")
	List<ParameterUOM> findAll();

	@Query("SELECT p FROM ParameterUOM p WHERE p.uom like '%' || :uom || '%' and p.active='Y' order by p.uom")
	Page<ParameterUOM> findAllByName(@Param("uom") String uom, Pageable pageRequest);



}
