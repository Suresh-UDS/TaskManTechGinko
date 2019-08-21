package com.ts.app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.ts.app.domain.OnboardingUserConfig;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.List;

public interface OnboardingUserConfigRepository extends JpaRepository<OnboardingUserConfig, Long>{

    @Modifying
    @Query("DELETE from OnboardingUserConfig o where o.user.id= :userId")
    @Transactional
    void deleteByUserId(@Param("userId") long userId);

//    @Query("SELECT o FROM OnboardingUserConfig o WHERE o.user.id =:userId and o.elementParent is null ")
    @Query("SELECT o FROM OnboardingUserConfig o WHERE o.user.id =:userId ")
    List<OnboardingUserConfig> findElementParentsByUserId(@Param("userId") long userId);

    @Query("SELECT o FROM OnboardingUserConfig o WHERE o.user.id =:userId and o.elementParent = :elementParent")
    List<OnboardingUserConfig> findElementChildsByUserId(@Param("userId") long userId, @Param("elementParent") String elementParent);


	@Query("SELECT ob from OnboardingUserConfig ob where ob.user.id = :userId and ob.active = 'Y' and ob.elementType = 'BRANCH' order by ob.element")
	List<OnboardingUserConfig> findBranchByUserId(@Param("userId") long userId);
	
	@Query("SELECT ob from OnboardingUserConfig ob where ob.user.id = :userId and ob.active = 'Y' and ob.elementType = 'PROJECT' order by ob.element")
	List<OnboardingUserConfig> findProjectByUserId(@Param("userId") long userId);
	
	@Query("SELECT ob from OnboardingUserConfig ob where ob.user.id = :userId and ob.active = 'Y' and ob.elementType = 'WBS' order by ob.element")
	List<OnboardingUserConfig> findWBSByUserId(@Param("userId") long userId);

    @Query("SELECT ob from OnboardingUserConfig ob where ob.user.id = :userId and ob.active = 'Y' and ob.elementType = 'PROJECT' and ob.elementParent = :branchCode order by ob.element")
    List<OnboardingUserConfig> findProjectByBranchId(@Param("userId") long userId, @Param("branchCode") String branchCode );

    @Query("SELECT ob from OnboardingUserConfig ob where ob.user.id = :userId and ob.active = 'Y' and ob.elementType = 'WBS' and ob.elementParent = :projectCode order by ob.element")
    List<OnboardingUserConfig> findWBSByProjectId(@Param("userId") long userId, @Param("projectCode") String projectCode);
}
