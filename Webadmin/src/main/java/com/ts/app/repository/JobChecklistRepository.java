package com.ts.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ts.app.domain.JobChecklist;

public interface JobChecklistRepository extends JpaRepository<JobChecklist, Long>{

}
