package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.NomineeRelationship;
import com.ts.app.domain.Religion;

public interface ReligionRepository  extends JpaRepository<Religion, Long>,JpaSpecificationExecutor<Religion> {

	List<Religion> findByTitle(@Param("title") String title);
	
	@Query("SELECT r from Religion r ORDER BY r.title ASC")
	List<Religion> findAll();
}