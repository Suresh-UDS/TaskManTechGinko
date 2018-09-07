package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.PurchaseRequisition;

public interface PurchaseRequisitionRepository extends JpaRepository<PurchaseRequisition, Long>, JpaSpecificationExecutor<PurchaseRequisition>{

	@Query("SELECT pr FROM PurchaseRequisition pr WHERE pr.project.id = :projectId and pr.site.id = :siteId and pr.active = 'Y'")
	List<PurchaseRequisition> findPurchaseReqBySite(@Param("projectId") long projectId, @Param("siteId") long siteId);

}
