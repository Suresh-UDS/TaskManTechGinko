package com.ts.app.repository;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;

import com.ts.app.domain.PurchaseRequisition;
import com.ts.app.service.util.DateUtil;
import com.ts.app.web.rest.dto.SearchCriteria;

public class PurchaseRequestSpecification implements Specification<PurchaseRequisition>{


	SearchCriteria searchCriteria;
	private boolean isAdmin;
	private final Logger log = LoggerFactory.getLogger(PurchaseRequestSpecification.class);

	/**
	 * @param searchCriteria
	 * @param isAdmin
	 *            - to identify the request from admin site
	 */
	public PurchaseRequestSpecification(SearchCriteria searchCriteria, boolean isAdmin) {
		this.searchCriteria = searchCriteria;
		this.isAdmin = isAdmin;
	}

	@Override
	public Predicate toPredicate(Root<PurchaseRequisition> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
		List<Predicate> predicates = new ArrayList<>();
		log.debug("PurchaseRequestSpecification toPredicate - searchCriteria projectid -" + searchCriteria.getProjectId());
		log.debug("PurchaseRequestSpecification toPredicate - searchCriteria siteId -" + searchCriteria.getSiteId());
		if (searchCriteria.getSiteId() != 0) {
			predicates.add(builder.equal(root.get("site").get("id"), searchCriteria.getSiteId()));
		}
		if(searchCriteria.getProjectId() != 0) {
			predicates.add(builder.equal(root.get("project").get("id"), searchCriteria.getProjectId()));
		}
		if (searchCriteria.getPurchaseRefNumber() != null && searchCriteria.getPurchaseRefNumber() != "") {
			predicates.add(builder.like(builder.lower(root.get("purchaseRefNumber")),
					"%" + searchCriteria.getPurchaseRefNumber().toLowerCase() + "%"));
		}
		if(searchCriteria.getRequestStatus() != null ) {
			predicates.add(builder.equal(root.get("requestStatus"), searchCriteria.getRequestStatus()));
		}
		if(searchCriteria.getRequestedDate() != null) {
			log.debug("PurchaseRequest created date -" + searchCriteria.getRequestedDate());
			Calendar endCal = Calendar.getInstance();
			endCal.set(Calendar.HOUR_OF_DAY, 23);
			endCal.set(Calendar.MINUTE, 59);
			endCal.set(Calendar.SECOND, 0);
			predicates.add(builder.between(root.get("requestedDate"), searchCriteria.getRequestedDate(), DateUtil.convertToTimestamp(endCal.getTime())));
		}
		if(searchCriteria.getApprovedDate() != null) {
			log.debug("PurchaseRequest transaction approved date -" + searchCriteria.getApprovedDate());
			Calendar endCaltime = Calendar.getInstance();
			endCaltime.set(Calendar.HOUR_OF_DAY, 23);
			endCaltime.set(Calendar.MINUTE, 59);
			endCaltime.set(Calendar.SECOND, 0);
			predicates.add(builder.between(root.get("approvedDate"), searchCriteria.getApprovedDate(), DateUtil.convertToTimestamp(endCaltime.getTime())));
		}

//		predicates.add(builder.equal(root.get("active"), "Y"));

        if(searchCriteria.isShowInActive()) {
            predicates.add(builder.equal(root.get("active"), "N"));
        } else {
            predicates.add(builder.equal(root.get("active"), "Y"));
        }

		query.orderBy(builder.desc(root.get("createdDate")));

		List<Predicate> orPredicates = new ArrayList<>();
		log.debug("PurchaseRequestSpecification toPredicate - searchCriteria userId -" + searchCriteria.getUserId());

		if(searchCriteria.getSiteId() == 0 && !searchCriteria.isAdmin()){
    		orPredicates.add(builder.equal(root.get("site").get("user").get("id"),  searchCriteria.getUserId()));
		}else if(searchCriteria.getSiteId() > 0) {
    		if(!searchCriteria.isAdmin()) {
    			orPredicates.add(builder.equal(root.get("site").get("user").get("id"),  searchCriteria.getUserId()));
    		}
		}
		if(CollectionUtils.isNotEmpty(searchCriteria.getSiteIds())){
    		Predicate path = root.get("site").get("id").in(searchCriteria.getSiteIds());
			orPredicates.add(path);
		}

		Predicate finalExp = null;
		if (orPredicates.size() > 0) {
			finalExp = builder.or(orPredicates.toArray(new Predicate[orPredicates.size()]));
			predicates.add(finalExp);
			finalExp = builder.and(predicates.toArray(new Predicate[predicates.size()]));
		} else {
			finalExp = builder.and(predicates.toArray(new Predicate[predicates.size()]));
		}

		return finalExp;
	}



}
