package com.ts.app.repository;

import com.ts.app.domain.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BranchRepository extends JpaRepository<Branch,Long> {

    @Query("SELECT b FROM Branch b WHERE b.project.id = :projectId and b.region.id =:regionId")
    List<Branch> findBranchByProjectAndRegion(@Param("projectId") long projectId, @Param("regionId") long regionId);

    @Query("SELECT b FROM Branch b join b.region r WHERE b.project.id = :projectId and r.name =:region")
    List<Branch> findBranchByProjectAndRegionName(@Param("projectId") long projectId, @Param("region") String region);

    @Query("SELECT b FROM Branch b WHERE b.name=:name and b.project.id =:projectId and b.region.id =:regionId")
    Branch findByName(@Param("name") String name, @Param("projectId") long projectId, @Param("regionId") long regionId);

    @Query("SELECT b FROM Branch b join b.region r WHERE b.project.id = :projectId and r.id =:regionId and b.name =:name")
    List<Branch> findBranchByProjectAndRegionId(@Param("projectId") long projectId, @Param("regionId") long regionId, @Param("name") String name);

    @Query("SELECT distinct b FROM Site s, Branch b join s.employeeProjSites e WHERE s.project.id = :projectId and b.region.id = :regionId and b.project.id = :projectId and s.branch = b.name and e.employee.id in (:empIds) and s.active='Y'")
    List<Branch> findSiteBranches(@Param("projectId") long projectId, @Param("empIds") List<Long> empId, @Param("regionId") long regionId);

}
