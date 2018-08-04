package com.ts.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.ts.app.domain.FaceProfile;

public interface FaceProfileRepository extends JpaRepository<FaceProfile, Long>,JpaSpecificationExecutor<FaceProfile> {

	FaceProfile findByEmployeeId(Long employeeId);
	
}
