package com.ts.app.repository;

import com.ts.app.domain.FaceProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface FaceProfileRepository extends JpaRepository<FaceProfile, Long>,JpaSpecificationExecutor<FaceProfile> {

	FaceProfile findByEmployeeId(Long employeeId);
	
}
