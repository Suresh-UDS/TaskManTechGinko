package com.ts.app.repository;

import com.ts.app.domain.Employee;
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
import java.util.*;

public class EmployeeSpecification implements Specification<Employee> {
    SearchCriteria searchCriteria;
    private boolean isAdmin;
    private final Logger log = LoggerFactory.getLogger(EmployeeSpecification.class);

    /**
     * @param searchCriteria
     * @param isAdmin
     *            - to identify the request from admin site
     */
    public EmployeeSpecification(SearchCriteria searchCriteria, boolean isAdmin) {
        this.searchCriteria = searchCriteria;
        this.isAdmin = isAdmin;
    }

    @Override
    public Predicate toPredicate(Root<Employee> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        List<Predicate> predicates = new ArrayList<>();
        log.debug("EmpSpecification toPredicate - searchCriteria projectId -" + searchCriteria.getProjectId());
        if (searchCriteria.getProjectId() != 0) {
            predicates.add(builder.equal(root.join("projectSites").get("project").get("id"), searchCriteria.getProjectId()));
        }
        log.debug("EmpSpecification toPredicate - searchCriteria siteId -" + searchCriteria.getSiteId());
        if (searchCriteria.getSiteId() != 0) {
            predicates.add(builder.equal(root.join("projectSites").get("site").get("id"), searchCriteria.getSiteId()));
        }
        log.debug("EmpSpecification toPredicate - searchCriteria emp Name -" + searchCriteria.getName());
        if (searchCriteria.getName() != null && searchCriteria.getName() != "") {
            predicates.add(builder.like(builder.lower(root.get("name")),
                "%" + searchCriteria.getName().toLowerCase() + "%"));
        }
        log.debug("EmpSpecification toPredicate - searchCriteria Designation -" + searchCriteria.getDesignation());
        if (searchCriteria.getDesignation() != null && searchCriteria.getDesignation() !="") {
            predicates.add(builder.like(builder.lower(root.get("designation")),
                "%" + searchCriteria.getDesignation().toLowerCase() + "%"));
        }
        log.debug("EmpSpecification toPredicate - searchCriteria employeeID -" + searchCriteria.getEmployeeEmpId());
        if (StringUtils.isNotEmpty(searchCriteria.getEmployeeEmpId())) {
            predicates.add(builder.equal(root.get("empId"), searchCriteria.getEmployeeEmpId()));
        }
        log.debug("EmpSpecification toPredicate - searchCriteria isLeft -" + searchCriteria.isLeft());
        if (searchCriteria.isLeft()) {
            predicates.add(builder.equal(root.get("isLeft"), true));
        }else {
        	predicates.add(builder.equal(root.get("isLeft"), false));
        }
        log.debug("EmpSpecification toPredicate - searchCriteria projectName -" + searchCriteria.getProjectName());
        if(searchCriteria.getProjectName() != null && searchCriteria.getProjectName() != "") {
            predicates.add(builder.equal(root.join("projectSites").get("project").get("name"), searchCriteria.getProjectName()));
        }
        log.debug("EmpSpecification toPredicate - searchCriteria siteName -" + searchCriteria.getSiteName());
        if(searchCriteria.getSiteName() != null && searchCriteria.getSiteName() != "") {
            predicates.add(builder.equal(root.join("projectSites").get("site").get("name"), searchCriteria.getSiteName()));
        }
        log.debug("EmpSpecification toPredicate - searchCriteria region -" + searchCriteria.getRegion());
        if(searchCriteria.getRegion() != null && searchCriteria.getRegion() != "") {
        	predicates.add(builder.equal(root.join("projectSites").get("site").get("region"), searchCriteria.getRegion()));
        }
        log.debug("EmpSpecification toPredicate - searchCriteria branch -" + searchCriteria.getBranch());
        if(searchCriteria.getBranch() != null && searchCriteria.getBranch() != "") {
        	predicates.add(builder.equal(root.join("projectSites").get("site").get("branch"), searchCriteria.getBranch()));
        }

        if(searchCriteria.getFromDate() != null) {
            if(searchCriteria.getToDate() != null) {
                log.debug("Employee created to date -" + searchCriteria.getFromDate());
                predicates.add(builder.between(root.get("createdDate"), DateUtil.convertToZDT(searchCriteria.getFromDate()), DateUtil.convertToZDT(searchCriteria.getToDate())));
            } else {
                log.debug("Employee created from date -" + searchCriteria.getFromDate());
                Calendar createdDateTo = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
                createdDateTo.setTime(searchCriteria.getFromDate());
                createdDateTo.set(Calendar.HOUR_OF_DAY, 23);
                createdDateTo.set(Calendar.MINUTE,59);
                createdDateTo.set(Calendar.SECOND,0);
                predicates.add(builder.between(root.get("createdDate"), DateUtil.convertToZDT(searchCriteria.getFromDate()), DateUtil.convertToZDT(createdDateTo.getTime())));
            }
        }

        predicates.add(builder.equal(root.get("active"), "Y"));

        query.orderBy(builder.desc(root.get("createdDate")));

        List<Predicate> orPredicates = new ArrayList<>();
        log.debug("EmpSpecification toPredicate - searchCriteria userId -" + searchCriteria.getUserId());

        if(searchCriteria.getSiteId() == 0 && !searchCriteria.isAdmin()){
            orPredicates.add(builder.equal(root.get("user").get("id"), searchCriteria.getUserId()));
        }else if(searchCriteria.getSiteId() > 0) {
            if(!searchCriteria.isAdmin()) {
                orPredicates.add(builder.equal(root.get("user").get("id"), searchCriteria.getUserId()));
            }
            if(CollectionUtils.isNotEmpty(searchCriteria.getSubordinateIds())){
                orPredicates.add(root.get("id").in(searchCriteria.getSubordinateIds()));
            }
        }
        if(!isAdmin) {
            if(CollectionUtils.isNotEmpty(searchCriteria.getSiteIds())){ Predicate path = root.get("projectSites").get("site").get("id").in(searchCriteria.getSiteIds());orPredicates.add(path); }
        }

        log.debug("EmpSpecification toPredicate - searchCriteria subordinateIds -"+ searchCriteria.getSubordinateIds());
        if(searchCriteria.getSiteId() == 0 && CollectionUtils.isNotEmpty(searchCriteria.getSubordinateIds())){
            orPredicates.add(root.get("id").in(searchCriteria.getSubordinateIds()));
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
