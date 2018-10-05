package com.ts.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.Clientgroup;

public interface ClientGroupRepository extends JpaRepository<Clientgroup, Long>{

	@Query("SELECT cg FROM Clientgroup cg WHERE cg.clientgroup= :clientgroup")
	Clientgroup findByName(@Param("clientgroup") String clientgroup);

}
