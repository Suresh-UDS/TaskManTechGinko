package com.ts.app.repository;


import com.ts.app.domain.Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DesignationRepository extends JpaRepository<Designation, Long> {

    @Query("SELECT d FROM Designation d WHERE d.designation = :designation")
    List<Designation> findByDesignation(@Param("designation") String designation);

}
