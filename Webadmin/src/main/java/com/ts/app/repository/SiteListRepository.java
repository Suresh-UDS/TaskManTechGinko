package com.ts.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.StateList;

public interface SiteListRepository extends JpaRepository<StateList, Long>{

	StateList findByName(@Param("name") String name);
	
}
