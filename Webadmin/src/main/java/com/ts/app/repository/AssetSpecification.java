package com.ts.app.repository;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;

import com.ts.app.domain.Asset;
import com.ts.app.web.rest.dto.SearchCriteria;

public class AssetSpecification implements Specification<Asset> {
	SearchCriteria searchCriteria;
	private boolean isAdmin;
	private final Logger log = LoggerFactory.getLogger(AssetSpecification.class);

	/**
	 * @param searchCriteria
	 * @param isAdmin
	 *            - to identify the request from admin site
	 */
	public AssetSpecification(SearchCriteria searchCriteria, boolean isAdmin) {
		this.searchCriteria = searchCriteria;
		this.isAdmin = isAdmin;
	}

	@Override
	public Predicate toPredicate(Root<Asset> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
		List<Predicate> predicates = new ArrayList<>();
		log.debug("AssetSpecification toPredicate - searchCriteria projectid -" + searchCriteria.getProjectId());
		if (searchCriteria.getProjectId() != 0) {
			predicates.add(builder.equal(root.get("site").get("project").get("id"), searchCriteria.getProjectId()));
		}
		log.debug("AssetSpecification toPredicate - searchCriteria siteId -" + searchCriteria.getSiteId());
		if (searchCriteria.getSiteId() != 0) {
			predicates.add(builder.equal(root.get("site").get("id"), searchCriteria.getSiteId()));
		}
		log.debug("AssetSpecification toPredicate - searchCriteria assetTitle -" + searchCriteria.getAssetTitle());
		if (searchCriteria.getAssetTitle() != null && searchCriteria.getAssetTitle() != "") {
			predicates.add(builder.like(builder.lower(root.get("title")),
					"%" + searchCriteria.getAssetTitle().toLowerCase() + "%"));
		}
		log.debug("AssetSpecification toPredicate - searchCriteria asset code -" + searchCriteria.getAssetCode());
		if (searchCriteria.getAssetCode() != null && searchCriteria.getAssetCode() !="") {
			predicates.add(builder.like(builder.lower(root.get("code")),
					"%" + searchCriteria.getAssetCode().toLowerCase() + "%"));
		}
		log.debug("AssetSpecification toPredicate - searchCriteria asset type -" + searchCriteria.getAssetTypeName());
		if (StringUtils.isNotEmpty(searchCriteria.getAssetTypeName())) {
			predicates.add(builder.equal(root.get("assetType"), searchCriteria.getAssetTypeName()));
		}
		log.debug("AssetSpecification toPredicate - searchCriteria assetgroup -" + searchCriteria.getAssetGroupName());
		if (searchCriteria.getAssetGroupName() != null && searchCriteria.getAssetGroupName() !="") {
			predicates.add(builder.equal(root.get("assetGroup"), searchCriteria.getAssetGroupName()));
		}
		log.debug("AssetSpecification toPredicate - searchCriteria acquiredate -" + searchCriteria.getAcquiredDate());
		if (searchCriteria.getAcquiredDate() != null) {
			predicates.add(builder.equal(root.get("acquiredDate"), searchCriteria.getAcquiredDate()));
		}

		/*
		 * if(StringUtils.isNotEmpty(searchCriteria.getMaintenanceType()) &&
		 * searchCriteria.getAssetId() != 0 ) {
		 * predicates.add(builder.and(builder.equal(root.get("maintenanceType"),
		 * searchCriteria.getMaintenanceType()),
		 * builder.equal(root.get("asset").get("id"), searchCriteria.getAssetId()))); }
		 */

		query.orderBy(builder.desc(root.get("title")));

		List<Predicate> orPredicates = new ArrayList<>();
		log.debug("AssetSpecification toPredicate - searchCriteria userId -" + searchCriteria.getUserId());

		/*if (searchCriteria.getSiteId() == 0 && !searchCriteria.isAdmin()) {
			log.debug(">>> asset specification 1 <<<");
			orPredicates.add(builder.equal(root.get("employee").get("user").get("id"), searchCriteria.getUserId()));
		} else if (searchCriteria.getSiteId() > 0) {
			log.debug(">>> asset specification 2 <<<");
			if (!searchCriteria.isAdmin()) {
				orPredicates.add(builder.equal(root.get("employee").get("user").get("id"), searchCriteria.getUserId()));
			}
			if (CollectionUtils.isNotEmpty(searchCriteria.getSubordinateIds())) {
				log.debug(">>> asset specification 3 <<<");
				orPredicates.add(root.get("employee").get("id").in(searchCriteria.getSubordinateIds()));
			}
		}
		if (CollectionUtils.isNotEmpty(searchCriteria.getSiteIds())) {
			log.debug(">>> asset specification 4 <<<");
			Predicate path = root.get("site").get("id").in(searchCriteria.getSiteIds());
			orPredicates.add(path);
		}

		log.debug(
				"AssetSpecification toPredicate - searchCriteria subordinateIds -" + searchCriteria.getSubordinateIds());
		if (searchCriteria.getSiteId() == 0 && CollectionUtils.isNotEmpty(searchCriteria.getSubordinateIds())) {
			log.debug(">>> asset specification 5 <<<");
			orPredicates.add(root.get("employee").get("id").in(searchCriteria.getSubordinateIds()));
		}*/
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
