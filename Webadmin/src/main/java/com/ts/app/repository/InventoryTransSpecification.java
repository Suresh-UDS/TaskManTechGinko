package com.ts.app.repository;

import com.ts.app.domain.MaterialTransaction;
import com.ts.app.service.util.DateUtil;
import com.ts.app.web.rest.dto.SearchCriteria;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class InventoryTransSpecification implements Specification<MaterialTransaction> {
	SearchCriteria searchCriteria;
	private boolean isAdmin;
	private final Logger log = LoggerFactory.getLogger(InventorySpecification.class);

	/**
	 * @param searchCriteria
	 * @param isAdmin
	 *            - to identify the request from admin site
	 */
	public InventoryTransSpecification(SearchCriteria searchCriteria, boolean isAdmin) {
		this.searchCriteria = searchCriteria;
		this.isAdmin = isAdmin;
	}

	@Override
	public Predicate toPredicate(Root<MaterialTransaction> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
		List<Predicate> predicates = new ArrayList<>();
		log.debug("InventorySpecification toPredicate - searchCriteria projectid -" + searchCriteria.getProjectId());
		if (searchCriteria.getProjectId() != 0) {
			predicates.add(builder.equal(root.get("project").get("id"), searchCriteria.getProjectId()));
		}
		log.debug("inventorySpecification toPredicate - searchCriteria siteId -" + searchCriteria.getSiteId());
		if (searchCriteria.getSiteId() != 0) {
			predicates.add(builder.equal(root.get("site").get("id"), searchCriteria.getSiteId()));
		}
        if(searchCriteria.getRegion() != null && searchCriteria.getRegion() != "") {
            predicates.add(builder.equal(root.get("site").get("region"), searchCriteria.getRegion()));
        }
        if(searchCriteria.getBranch() != null && searchCriteria.getBranch() != "") {
            predicates.add(builder.equal(root.get("site").get("branch"), searchCriteria.getBranch()));
        }
		if (searchCriteria.getMaterialId() != 0) {
			predicates.add(builder.equal(root.get("material").get("id"), searchCriteria.getMaterialId()));
		}
		if(searchCriteria.getAssetId() != 0) {
			predicates.add(builder.equal(root.get("asset").get("id"), searchCriteria.getAssetId()));
		}
		if(searchCriteria.getJobId() != 0) {
			predicates.add(builder.equal(root.get("job").get("id"), searchCriteria.getJobId()));
		}
		if (StringUtils.isNotEmpty(searchCriteria.getMaterialName())) {

			predicates.add(builder.like(builder.lower(root.get("material").get("name")),
					"%" + searchCriteria.getMaterialName().toLowerCase() + "%"));
		}
		if(searchCriteria.getIndentRefNumber() > 0) {
            predicates.add(builder.equal(root.get("materialIndent").get("indentRefNumber").get("number"), searchCriteria.getIndentRefNumber()));
		}
		if (StringUtils.isNotEmpty(searchCriteria.getItemCode())) {
			predicates.add(builder.like(builder.lower(root.get("material").get("itemCode")),
					"%" + searchCriteria.getItemCode().toLowerCase() + "%"));
		}
		if (searchCriteria.getTransactionType() != null) {
			predicates.add(builder.equal(root.get("transactionType"), searchCriteria.getTransactionType()));
		}
		if(searchCriteria.getTransactionDate() != null) {
			log.debug("Inventory transaction created date -" + searchCriteria.getTransactionDate());
			Calendar endCal = Calendar.getInstance();
			endCal.set(Calendar.HOUR_OF_DAY, 23);
			endCal.set(Calendar.MINUTE, 59);
			endCal.set(Calendar.SECOND, 0);
			predicates.add(builder.between(root.get("transactionDate"), searchCriteria.getTransactionDate(), DateUtil.convertToTimestamp(endCal.getTime())));
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
