package com.ts.app.repository;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;

import com.ts.app.domain.Vendor;
import com.ts.app.web.rest.dto.SearchCriteria;

public class VendorSpecification implements Specification<Vendor> {
	SearchCriteria searchCriteria;
	private final Logger log = LoggerFactory.getLogger(VendorSpecification.class);

	/**
	 * @param searchCriteria
	 * @param isAdmin
	 *            - to identify the request from admin site
	 */
	public VendorSpecification(SearchCriteria searchCriteria, boolean isAdmin) {
		this.searchCriteria = searchCriteria;
	}

	@Override
	public Predicate toPredicate(Root<Vendor> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
		List<Predicate> predicates = new ArrayList<>();
		log.debug("VendorSpecification toPredicate - searchCriteria vendor name -" + searchCriteria.getVendorName());
		if (searchCriteria.getVendorName() != null && searchCriteria.getVendorName() != "") {
			predicates.add(builder.like(builder.lower(root.get("name")),
					"%" + searchCriteria.getVendorName().toLowerCase() + "%"));
		}
		
		predicates.add(builder.equal(root.get("active"), "Y"));

		query.orderBy(builder.desc(root.get("name")));

		List<Predicate> orPredicates = new ArrayList<>();
		log.debug("ManufacturerSpecification toPredicate - searchCriteria userId -" + searchCriteria.getUserId());

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
