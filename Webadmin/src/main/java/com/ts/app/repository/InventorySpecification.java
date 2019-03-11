package com.ts.app.repository;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;

import com.ts.app.domain.Material;
import com.ts.app.service.util.DateUtil;
import com.ts.app.web.rest.dto.SearchCriteria;

public class InventorySpecification implements Specification<Material> {
	SearchCriteria searchCriteria;
	private boolean isAdmin;
	private final Logger log = LoggerFactory.getLogger(InventorySpecification.class);

	/**
	 * @param searchCriteria
	 * @param isAdmin
	 *            - to identify the request from admin site
	 */
	public InventorySpecification(SearchCriteria searchCriteria, boolean isAdmin) {
		this.searchCriteria = searchCriteria;
		this.isAdmin = isAdmin;
	}

	@Override
	public Predicate toPredicate(Root<Material> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
		List<Predicate> predicates = new ArrayList<>();
		log.debug("InventorySpecification toPredicate - searchCriteria projectid -" + searchCriteria.getProjectId());
		if (searchCriteria.getProjectId() != 0) {
			predicates.add(builder.equal(root.get("project").get("id"), searchCriteria.getProjectId()));
		}
		log.debug("inventorySpecification toPredicate - searchCriteria siteId -" + searchCriteria.getSiteId());
		if (searchCriteria.getSiteId() != 0) {
			predicates.add(builder.equal(root.get("site").get("id"), searchCriteria.getSiteId()));
		}
		if (searchCriteria.getManufacturerId() != 0) {
			predicates.add(builder.equal(root.get("manufacturer").get("id"), searchCriteria.getManufacturerId()));
		}
		if (searchCriteria.getMaterialName() != null && searchCriteria.getMaterialName() != "") {
			predicates.add(builder.like(builder.lower(root.get("name")),
					"%" + searchCriteria.getMaterialName().toLowerCase() + "%"));
		}
		if (searchCriteria.getItemCode() != null && searchCriteria.getItemCode() !="") {
			predicates.add(builder.like(builder.lower(root.get("itemCode")),
					"%" + searchCriteria.getItemCode().toLowerCase() + "%"));
		}
		if (searchCriteria.getItemGroup() != null && searchCriteria.getItemGroup() != "") {
			predicates.add(builder.like(builder.lower(root.get("itemGroup")),
					"%" + searchCriteria.getItemGroup().toLowerCase() + "%"));
		}

		if(searchCriteria.getMaterialCreatedDate() != null) {
			log.debug("Inventory created date -" + searchCriteria.getMaterialCreatedDate());
			Calendar createdDateTo = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
			createdDateTo.setTime(searchCriteria.getMaterialCreatedDate());
			createdDateTo.set(Calendar.HOUR_OF_DAY, 23);
			createdDateTo.set(Calendar.MINUTE,59);
			createdDateTo.set(Calendar.SECOND,0);

			predicates.add(builder.between(root.get("createdDate"), DateUtil.convertToZDT(searchCriteria.getMaterialCreatedDate()), DateUtil.convertToZDT(createdDateTo.getTime())));
		}

        if(searchCriteria.isShowInActive()) {
            predicates.add(builder.equal(root.get("active"), "N"));
        } else {
            predicates.add(builder.equal(root.get("active"), "Y"));
        }

		query.orderBy(builder.desc(root.get("createdDate")));

		List<Predicate> orPredicates = new ArrayList<>();
		log.debug("InventorySpecification toPredicate - searchCriteria userId -" + searchCriteria.getUserId());

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
