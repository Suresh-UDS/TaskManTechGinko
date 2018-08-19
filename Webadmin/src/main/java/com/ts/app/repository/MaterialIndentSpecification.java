package com.ts.app.repository;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;

import com.ts.app.domain.MaterialIndent;
import com.ts.app.web.rest.dto.SearchCriteria;

public class MaterialIndentSpecification implements Specification<MaterialIndent> {

	SearchCriteria searchCriteria;
	private boolean isAdmin;
	private final Logger log = LoggerFactory.getLogger(MaterialIndentSpecification.class);

	/**
	 * @param searchCriteria
	 * @param isAdmin
	 *            - to identify the request from admin site
	 */
	public MaterialIndentSpecification(SearchCriteria searchCriteria, boolean isAdmin) {
		this.searchCriteria = searchCriteria;
		this.isAdmin = isAdmin;
	}

	@Override
	public Predicate toPredicate(Root<MaterialIndent> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
		List<Predicate> predicates = new ArrayList<>();
		log.debug("MaterialIndentSpecification toPredicate - searchCriteria projectid -" + searchCriteria.getProjectId());
		log.debug("MaterialIndentSpecification toPredicate - searchCriteria siteId -" + searchCriteria.getSiteId());
		if (searchCriteria.getSiteId() != 0) {
			predicates.add(builder.equal(root.get("site").get("id"), searchCriteria.getSiteId()));
		}
		if (searchCriteria.getMaterialName() != null && searchCriteria.getMaterialName() != "") {
			predicates.add(builder.like(builder.lower(root.get("name")),
					"%" + searchCriteria.getMaterialName().toLowerCase() + "%"));
		}
		if (searchCriteria.getItemGroup() != null && searchCriteria.getItemGroup() != "") {
			predicates.add(builder.like(builder.lower(root.get("itemGroup")),
					"%" + searchCriteria.getItemGroup().toLowerCase() + "%"));
		}
	
		
		predicates.add(builder.equal(root.get("active"), "Y"));

		query.orderBy(builder.desc(root.get("createdDate")));

		List<Predicate> orPredicates = new ArrayList<>();
		log.debug("MaterialIndentSpecification toPredicate - searchCriteria userId -" + searchCriteria.getUserId());
		
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
