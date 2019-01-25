package com.ts.app.repository;

import com.ts.app.domain.Clientgroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClientGroupRepository extends JpaRepository<Clientgroup, Long>{

	@Query("SELECT cg FROM Clientgroup cg WHERE cg.clientgroup= :clientgroup")
	Clientgroup findByName(@Param("clientgroup") String clientgroup);

}
