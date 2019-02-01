package com.ts.app.repository;

import java.sql.Date;
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

import com.ts.app.domain.Attendance;
import com.ts.app.web.rest.dto.SearchCriteria;

public class AttendanceSpecification implements Specification<Attendance>{

    SearchCriteria searchCriteria;
    private boolean isAdmin;
    
    private final Logger log = LoggerFactory.getLogger(AttendanceSpecification.class);

    /**
     * @param searchCriteria
     * @param isAdmin
     *            - to identify the request from admin site
     */
    public AttendanceSpecification(SearchCriteria searchCriteria, boolean isAdmin) {
        this.searchCriteria = searchCriteria;
        this.isAdmin = isAdmin;
    }

    @Override
    public Predicate toPredicate(Root<Attendance> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        List<Predicate> predicates = new ArrayList<>();
        log.debug("AttSpecification toPredicate - searchCriteria projectId -" + searchCriteria.getProjectId());
        if (searchCriteria.getProjectId() != 0) {
            predicates.add(builder.equal(root.get("site").get("project").get("id"), searchCriteria.getProjectId()));
        }
        log.debug("AttSpecification toPredicate - searchCriteria siteId -" + searchCriteria.getSiteId());
        if (searchCriteria.getSiteId() != 0) {
            predicates.add(builder.equal(root.get("site").get("id"), searchCriteria.getSiteId()));
        }
        log.debug("AttSpecification toPredicate - searchCriteria emp Name -" + searchCriteria.getName());
        if (searchCriteria.getName() != null && searchCriteria.getName() != "") {
            predicates.add(builder.like(builder.lower(root.get("employee").get("name")),
                "%" + searchCriteria.getName().toLowerCase() + "%"));
        }
        log.debug("AttSpecification toPredicate - searchCriteria employeeID -" + searchCriteria.getEmployeeEmpId());
        if (StringUtils.isNotEmpty(searchCriteria.getEmployeeEmpId())) {
            predicates.add(builder.equal(root.get("employee").get("empId"), searchCriteria.getEmployeeEmpId()));
        }
        log.debug("AttSpecification toPredicate - searchCriteria projectName -" + searchCriteria.getProjectName());
        if(searchCriteria.getProjectName() != null && searchCriteria.getProjectName() != "") {
            predicates.add(builder.equal(root.get("site").get("project").get("name"), searchCriteria.getProjectName()));
        }
        log.debug("AttSpecification toPredicate - searchCriteria siteName -" + searchCriteria.getSiteName());
        if(searchCriteria.getSiteName() != null && searchCriteria.getSiteName() != "") {
            predicates.add(builder.equal(root.get("site").get("name"), searchCriteria.getSiteName()));
        }
        log.debug("AttSpecification toPredicate - searchCriteria region -" + searchCriteria.getRegion());
        if(searchCriteria.getRegion() != null && searchCriteria.getRegion() != "") {
        	predicates.add(builder.equal(root.get("site").get("region"), searchCriteria.getRegion()));
        }
        log.debug("AttSpecification toPredicate - searchCriteria branch -" + searchCriteria.getBranch());
        if(searchCriteria.getBranch() != null && searchCriteria.getBranch() != "") {
        	predicates.add(builder.equal(root.get("site").get("branch"), searchCriteria.getBranch()));
        }

        if(searchCriteria.getCheckInDateTimeFrom() != null) {
            log.debug("AttSpecification checkInDate from -" + searchCriteria.getCheckInDateTimeFrom());
            predicates.add(builder.between(root.get("checkInTime"), searchCriteria.getCheckInDateTimeFrom(), searchCriteria.getCheckInDateTimeTo()));
        }

        predicates.add(builder.equal(root.get("active"), "Y"));

        query.orderBy(builder.desc(root.get("createdDate")));

        List<Predicate> orPredicates = new ArrayList<>();
        log.debug("AttSpecification toPredicate - searchCriteria userId -" + searchCriteria.getUserId());

        if(searchCriteria.getSiteId() == 0 && !searchCriteria.isAdmin()){
            orPredicates.add(builder.equal(root.get("employee").get("user").get("id"), searchCriteria.getUserId()));
        }else if(searchCriteria.getSiteId() > 0) {
            if(!searchCriteria.isAdmin()) {
                orPredicates.add(builder.equal(root.get("employee").get("user").get("id"), searchCriteria.getUserId()));
            }
            if(CollectionUtils.isNotEmpty(searchCriteria.getSubordinateIds())){
                orPredicates.add(root.get("employee").get("id").in(searchCriteria.getSubordinateIds()));
            }
        }
        if(!isAdmin) {
            if(CollectionUtils.isNotEmpty(searchCriteria.getSiteIds())){ 
            	Predicate path = root.get("site").get("id").in(searchCriteria.getSiteIds());
            	orPredicates.add(path);
            }
        }

        log.debug("AttSpecification toPredicate - searchCriteria subordinateIds -"+ searchCriteria.getSubordinateIds());
        if(searchCriteria.getSiteId() == 0 && CollectionUtils.isNotEmpty(searchCriteria.getSubordinateIds())){
            orPredicates.add(root.get("employee").get("id").in(searchCriteria.getSubordinateIds()));
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
