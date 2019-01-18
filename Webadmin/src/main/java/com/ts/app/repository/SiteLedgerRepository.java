package com.ts.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.SiteLedger;

public interface SiteLedgerRepository extends JpaRepository<SiteLedger, Long> {

	@Query("SELECT sl FROM SiteLedger sl WHERE sl.site.id = :siteId")
	Page<SiteLedger> findSiteLedgersBySiteId(@Param("siteId") long siteId, Pageable pageRequest);

}
