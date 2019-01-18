package com.ts.app.repository;

import com.ts.app.domain.Vendor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VendorRepository extends JpaRepository<Vendor, Long>,JpaSpecificationExecutor<Vendor> {

	@Override
	void delete(Vendor t);

	@Query("SELECT v FROM Vendor v WHERE v.active='Y' order by v.name")
	List<Vendor> findAll();

	@Query("SELECT v FROM Vendor v WHERE v.name like '%' || :name || '%' and v.active='Y' order by v.name")
	Page<Vendor> findAllByName(@Param("name") String name, Pageable pageRequest);



}
