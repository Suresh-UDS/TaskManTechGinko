package com.ts.app.repository;

import com.ts.app.domain.JobChecklist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobChecklistRepository extends JpaRepository<JobChecklist, Long>{

}
