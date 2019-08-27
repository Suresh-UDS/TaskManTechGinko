package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.NomineeRelationship;

public interface NomineeRelationshipRepository extends JpaRepository<NomineeRelationship, Long>,JpaSpecificationExecutor<NomineeRelationship> {

	List<NomineeRelationship> findByTitle(@Param("title") String title);
	
}
