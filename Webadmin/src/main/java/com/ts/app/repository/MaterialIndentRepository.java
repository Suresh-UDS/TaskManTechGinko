package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.MaterialIndent;

public interface MaterialIndentRepository extends JpaRepository<MaterialIndent, Long>, JpaSpecificationExecutor<MaterialIndent> {

	@Query("SELECT md FROM MaterialIndent md WHERE md.project.id = :projectId and md.site.id = :siteId and md.active='Y'")
	List<MaterialIndent> findIndentBySites(@Param("projectId") long projectId, @Param("siteId") long siteId);

}
