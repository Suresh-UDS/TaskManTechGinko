package com.ts.app.repository;

import com.ts.app.domain.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RegionRepository extends JpaRepository<Region,Long> {

    @Query("SELECT r FROM Region r WHERE r.project.id = :projectId")
    List<Region> findRegionByProject(@Param("projectId") long projectId);

    @Query("SELECT r FROM Region r WHERE r.project.id = :projectId")
    List<Region> findRegionNameByProject(@Param("projectId") long projectId);

    @Query("SELECT r FROM Region r WHERE r.name = :name and r.project.id = :projectId")
    Region findByName(@Param("name") String name, @Param("projectId") long projectId);

    @Query("SELECT r.id FROM Region r WHERE r.name = :name and r.project.id = :projectId")
    List<Long> findByRegion(@Param("name") String name, @Param("projectId") long projectId);

    @Query("SELECT distinct r FROM Site s, Region r join s.employeeProjSites e WHERE s.project.id = :projectId and s.region = r.name and r.project.id = :projectId and e.employee.id in (:empIds) and s.active='Y'")
    List<Region> findSiteRegions(@Param("projectId") long projectId, @Param("empIds") List<Long> empId);
}
