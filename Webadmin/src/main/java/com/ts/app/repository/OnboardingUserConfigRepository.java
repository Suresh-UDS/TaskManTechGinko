package com.ts.app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.OnboardingUserConfig;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.security.access.method.P;
import org.springframework.transaction.annotation.Transactional;


public interface OnboardingUserConfigRepository extends JpaRepository<OnboardingUserConfig, Long>{

    @Modifying
    @Query("DELETE from OnboardingUserConfig o where o.user.id= :userId")
    @Transactional
    void deleteByUserId(@Param("userId") long userId);
    
    @Modifying
    @Query("DELETE from OnboardingUserConfig o where o.user.id= :userId and o.branch=:branch")
    @Transactional
    void deleteByUserIdAndBranch(@Param("userId") long userId,@Param("branch") String branch);
    
    OnboardingUserConfig findByUserIdAndElementCode(@Param("userId") long userId, @Param("elementCode") String elementCode);

//    @Query("SELECT o FROM OnboardingUserConfig o WHERE o.user.id =:userId and o.elementParent is null ")
    @Query("SELECT o FROM OnboardingUserConfig o WHERE o.user.id =:userId ")
    List<OnboardingUserConfig> findElementParentsByUserId(@Param("userId") long userId);
    List<OnboardingUserConfig> findElementParentsByUserIdAndBranch(@Param("userId") long userId,@Param("branch") String branch);

    @Query("SELECT o FROM OnboardingUserConfig o WHERE o.user.id =:userId and o.elementParent = :elementParent")
    List<OnboardingUserConfig> findElementChildsByUserId(@Param("userId") long userId, @Param("elementParent") String elementParent);


	@Query("SELECT ob from OnboardingUserConfig ob where ob.user.id = :userId and ob.active = 'Y' and ob.elementType = 'BRANCH' order by ob.element ASC ")
	List<OnboardingUserConfig> findBranchByUserId(@Param("userId") long userId);
	
	@Query("SELECT ob from OnboardingUserConfig ob where ob.user.id = :userId and ob.active = 'Y' and ob.elementType = 'PROJECT' order by ob.element ASC")
	List<OnboardingUserConfig> findProjectByUserId(@Param("userId") long userId);
	
	@Query("SELECT ob from OnboardingUserConfig ob where ob.user.id = :userId and ob.active = 'Y' and ob.elementType = 'WBS' order by ob.element ASC")
	List<OnboardingUserConfig> findWBSByUserId(@Param("userId") long userId);

    @Query("SELECT ob from OnboardingUserConfig ob where ob.user.id = :userId and ob.active = 'Y' and ob.elementType = 'PROJECT' and ob.elementParent = :branchCode order by ob.element ASC")
    List<OnboardingUserConfig> findProjectByBranchId(@Param("userId") long userId, @Param("branchCode") String branchCode );


    @Query("SELECT ob.elementParent from OnboardingUserConfig ob where ob.active = 'Y' and ob.elementType='PROJECT' and ob.elementCode = :elementCode and  ob.user.id = :userId")
    List<String> getParentElementOfProject(@Param("elementCode") String elementCode, @Param("userId") long userId);

    @Query("SELECT ob.elementCode from OnboardingUserConfig ob where ob.user.id = :userId and ob.active = 'Y' and ob.elementType = :elementType ")
    List<String> findElementCodes(@Param("userId") long userId, @Param("elementType") String elementType);

    @Query("SELECT ob.elementCode from OnboardingUserConfig ob where ob.user.id = :userId and ob.active = 'Y' and ob.elementType = :elementType and ob.elementParent = :elementParent" )
    List<String> findElementCodesAndElementParent(@Param("userId") long userId, @Param("elementType") String elementType, @Param("elementParent") String elementParent);

    @Query("SELECT ob.elementCode from OnboardingUserConfig ob where ob.user.id = :userId and ob.active = 'Y' and ob.elementType = :elementType and ob.elementParent in :elementParents " )
    List<String> findElementCodesAndElementParents(@Param("userId") long userId, @Param("elementType") String elementType, @Param("elementParents") List<String> elementParents);

    @Query("SELECT ob from OnboardingUserConfig ob where ob.user.id = :userId and ob.active = 'Y' and ob.elementType = 'WBS' and ob.elementParent = :projectCode order by ob.element ASC")
    List<OnboardingUserConfig> findWBSByProjectId(@Param("userId") long userId, @Param("projectCode") String projectCode);
}
