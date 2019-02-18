package com.ts.app.repository;

import com.ts.app.domain.User;
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

public class UserSpecification implements Specification<User> {
    SearchCriteria searchCriteria;
    private boolean isAdmin;
    private final Logger log = LoggerFactory.getLogger(UserSpecification.class);

    /**
     * @param searchCriteria
     * @param isAdmin
     *            - to identify the request from admin site
     */
    public UserSpecification(SearchCriteria searchCriteria, boolean isAdmin) {
        this.searchCriteria = searchCriteria;
        this.isAdmin = isAdmin;
    }

    @Override
    public Predicate toPredicate(Root<User> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

        List<Predicate> predicates = new ArrayList<>();

        log.debug("UserSpecification toPredicate - searchCriteria projectid -" + searchCriteria.getProjectId());
        if (searchCriteria.getProjectId() != 0) {
            predicates.add(builder.equal(root.get("project").get("id"), searchCriteria.getProjectId()));
        }

        log.debug("UserSpecification toPredicate - searchCriteria login-" + searchCriteria.getUserLogin());
        if (searchCriteria.getUserLogin() != null && searchCriteria.getUserLogin() != "") {
            predicates.add(builder.like(builder.lower(root.get("login")),
                "%" + searchCriteria.getUserLogin().toLowerCase() + "%"));
        }

        log.debug("UserSpecification toPredicate - searchCriteria firstname -" + searchCriteria.getUserFirstName());
        if (searchCriteria.getUserFirstName() != null && searchCriteria.getUserFirstName() !="") {
            predicates.add(builder.like(builder.lower(root.get("firstName")),
                "%" + searchCriteria.getUserFirstName().toLowerCase() + "%"));
        }

        log.debug("UserSpecification toPredicate - searchCriteria lastname -" + searchCriteria.getUserLastName());
        if (searchCriteria.getUserLastName() != null && searchCriteria.getUserLastName() !="") {
            predicates.add(builder.like(builder.lower(root.get("lastName")),
                "%" + searchCriteria.getUserLastName().toLowerCase() + "%"));
        }

        log.debug("UserSpecification toPredicate - searchCriteria email -" + searchCriteria.getUserEmail());
        if (searchCriteria.getUserEmail() != null && searchCriteria.getUserEmail() !="") {
            predicates.add(builder.like(builder.lower(root.get("email")),
                "%" + searchCriteria.getUserEmail().toLowerCase() + "%"));
        }

        log.debug("UserSpecification toPredicate - searchCriteria userRole -" + searchCriteria.getUserRole());
        if (searchCriteria.getUserRole() != null && searchCriteria.getUserRole() !="") {
            predicates.add(builder.like(builder.lower(root.get("userRole").get("name")),
                "%" + searchCriteria.getUserRole().toLowerCase() + "%"));
        }

//        predicates.add(builder.equal(root.get("active"), "Y"));

        query.orderBy(builder.desc(root.get("createdDate")));

        List<Predicate> orPredicates = new ArrayList<>();

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
