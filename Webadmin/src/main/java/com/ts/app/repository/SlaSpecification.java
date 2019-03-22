package com.ts.app.repository;

import com.ts.app.domain.SlaConfig;
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
import java.util.TimeZone;

public class SlaSpecification implements Specification<SlaConfig> {

    private final Logger log = LoggerFactory.getLogger(SlaSpecification.class);

    SearchCriteria searchCriteria;
    boolean isAdmin;

    public SlaSpecification(SearchCriteria searchCriteria, boolean isAdmin) {
        this.searchCriteria = searchCriteria;
        this.isAdmin = isAdmin;
    }

    @Override
    public Predicate toPredicate(Root<SlaConfig> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        List<Predicate> predicates = new ArrayList<>();

        log.debug("SlaSpecification toPredicate - searchCriteria projectid -" + searchCriteria.getProjectId());
        if (searchCriteria.getProjectId() != 0) {
            predicates.add(builder.equal(root.get("site").get("project").get("id"), searchCriteria.getProjectId()));
        }

        log.debug("SlaSpecification toPredicate - searchCriteria siteId -" + searchCriteria.getSiteId());
        if (searchCriteria.getSiteId() != 0) {
            predicates.add(builder.equal(root.get("site").get("id"), searchCriteria.getSiteId()));
        }

        log.debug("SlaSpecification toPredicate - searchCriteria processType -" + searchCriteria.getProcessType());
        if (searchCriteria.getProcessType() != null && searchCriteria.getProcessType() != "") {
            predicates.add(builder.like(builder.lower(root.get("processType")),
                "%" + searchCriteria.getProcessType().toLowerCase() + "%"));
        }

        log.debug("SlaSpecification toPredicate - searchCriteria severity -" + searchCriteria.getSeverity());
        if (StringUtils.isNotEmpty(searchCriteria.getSeverity())) {
            predicates.add(builder.equal(root.get("severity"), searchCriteria.getSeverity()));
        }

        log.debug("SlaSpecification toPredicate - searchCriteria category =" + searchCriteria.getCategory());
        if(StringUtils.isNotEmpty(searchCriteria.getCategory())) {
            predicates.add(builder.like(builder.lower(root.get("category")),
                "%" + searchCriteria.getCategory().toLowerCase() + "%"));
        }

        if(searchCriteria.getSlaCreatedDate() != null) {
            log.debug("Slaconfig created date -" + searchCriteria.getSlaCreatedDate());
            Calendar createdDateTo = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
            createdDateTo.setTime(searchCriteria.getSlaCreatedDate());
            createdDateTo.set(Calendar.HOUR_OF_DAY, 23);
            createdDateTo.set(Calendar.MINUTE,59);
            createdDateTo.set(Calendar.SECOND,0);

            predicates.add(builder.between(root.get("createdDate"), DateUtil.convertToZDT(searchCriteria.getSlaCreatedDate()), DateUtil.convertToZDT(createdDateTo.getTime())));
        }

//        predicates.add(builder.equal(root.get("active"), "Y"));

        if(searchCriteria.isShowInActive()) {
            predicates.add(builder.equal(root.get("active"), "N"));
        } else {
            predicates.add(builder.equal(root.get("active"), "Y"));
        }

        query.orderBy(builder.desc(root.get("createdDate")));

        List<Predicate> orPredicates = new ArrayList<>();
        log.debug("sla toPredicate - searchCriteria userId -" + searchCriteria.getUserId());

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
