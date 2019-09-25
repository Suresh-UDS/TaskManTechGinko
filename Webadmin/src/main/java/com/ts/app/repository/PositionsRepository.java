package com.ts.app.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
 
import com.ts.app.domain.Positions;

public interface PositionsRepository extends JpaRepository<Positions, Long> {
 
	List<Positions> findByWbsId(@Param("wbsId") String wbsId);
	
	List<Positions> findByWbsIdAndPositionId(@Param("wbsId") String wbsId,@Param("positionId") String positionId);
	
	Positions findByWbsIdAndPositionIdAndActivity(@Param("wbsId") String wbsId,@Param("positionId") String positionId,@Param("activity") String activity);
	 
}
