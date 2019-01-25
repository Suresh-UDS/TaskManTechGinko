package com.ts.app.repository;

import com.ts.app.domain.Parameter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ParameterRepository extends JpaRepository<Parameter, Long> {

	@Override
	void delete(Parameter p);

	@Query("SELECT p FROM Parameter p WHERE p.active='Y' order by p.name")
	List<Parameter> findAll();

	@Query("SELECT p FROM Parameter p WHERE p.name like '%' || :name || '%' and p.active='Y' order by p.name")
	Page<Parameter> findAllByName(@Param("name") String name, Pageable pageRequest);



}
