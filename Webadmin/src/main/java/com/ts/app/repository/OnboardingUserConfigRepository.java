package com.ts.app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.ts.app.domain.OnboardingUserConfig;

public interface OnboardingUserConfigRepository extends JpaRepository<OnboardingUserConfig, Long>{
	
	@Query("SELECT ob from OnboardingUserConfig ob where ob.userId = :userId and ob.active = 'Y' and elementType = 'BRANCH' order by ob.element")
	List<OnboardingUserConfig> findbranchListByUserId(@Param("userId") long userId);
	
	@Query("SELECT ob from OnboardingUserConfig ob where ob.userId = :userId and ob.active = 'Y' and elementType = 'PROJECT' order by ob.element")
	List<OnboardingUserConfig> findProjectByBranchId(@Param("userId") long userId);
	
	@Query("SELECT ob from OnboardingUserConfig ob where ob.userId = :userId and ob.active = 'Y' and elementType = 'WBS' order by ob.element")
	List<OnboardingUserConfig> findWBSByProjectId(@Param("userId") long userId);
}
