package com.ts.app.repository;

import com.ts.app.domain.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BranchRepository extends JpaRepository<Branch,Long> {

    @Query("SELECT b FROM Branch b WHERE b.project.id = :projectId and b.region.id =:regionId")
    List<Branch> findBranchByProjectAndRegion(@Param("projectId") long projectId, @Param("regionId") long regionId);

}
