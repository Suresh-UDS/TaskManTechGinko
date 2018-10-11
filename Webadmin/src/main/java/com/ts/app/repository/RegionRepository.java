package com.ts.app.repository;

import com.ts.app.domain.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RegionRepository extends JpaRepository<Region,Long> {

    @Query("SELECT r FROM Region r WHERE r.project.id = :projectId")
    List<Region> findRegionByProject(@Param("projectId") long projectId);
}
