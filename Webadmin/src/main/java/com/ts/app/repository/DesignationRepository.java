package com.ts.app.repository;


import org.springframework.data.jpa.repository.JpaRepository;


import com.ts.app.domain.Designation;

public interface DesignationRepository extends JpaRepository<Designation, Long> {


}
