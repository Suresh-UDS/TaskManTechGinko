package com.ts.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.ts.app.domain.MaterialIndent;

public interface MaterialIndentRepository extends JpaRepository<MaterialIndent, Long>, JpaSpecificationExecutor<MaterialIndent> {

}
