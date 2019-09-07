package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.OnboardingDeclaration;

public interface OnboardingDeclarationRepository extends JpaRepository<OnboardingDeclaration, Long>{
	
	@Query("SELECT obd from OnboardingDeclaration obd where obd.active = 'Y'")
	List<OnboardingDeclaration> getDeclartionList();
	 
	OnboardingDeclaration findByLanguageAndActive(@Param("language") String language,@Param("active") String active);

}
