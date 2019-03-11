package com.ts.app.repository;

import com.ts.app.domain.Expense;
import com.ts.app.service.util.DateUtil;
import com.ts.app.web.rest.dto.SearchCriteria;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.*;

public class ExpenseSpecification implements Specification<Expense> {

    SearchCriteria searchCriteria;
    private boolean isAdmin;
    private final Logger log = LoggerFactory.getLogger(ExpenseSpecification.class);

    public ExpenseSpecification(SearchCriteria searchCriteria, boolean isAdmin) {
        this.searchCriteria=searchCriteria;
        this.isAdmin = isAdmin;
    }

    @Override
    public Predicate toPredicate(Root<Expense> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        List<Predicate> predicates = new ArrayList<>();
        log.debug("Expense Specification toPredicate - searchCriteria projectid -"+ searchCriteria.getProjectId());
        if(searchCriteria.getProjectId()!=0){
            predicates.add(builder.equal(root.get("site").get("project").get("id"), searchCriteria.getProjectId()));
        }
        log.debug("Expense Specification toPredicate - searchCriteria siteId -"+ searchCriteria.getSiteId());
        if(searchCriteria.getSiteId()!=0){
            predicates.add(builder.equal(root.get("site").get("id"),  searchCriteria.getSiteId()));
        }

        log.debug("Expense Specification toPredicate - expense category -"+ searchCriteria.getExpenseCategory());
        if(org.apache.commons.lang3.StringUtils.isNotEmpty(searchCriteria.getExpenseCategory())){
            predicates.add(builder.equal(root.get("expenseCategory"),  searchCriteria.getExpenseCategory()));
        }

        log.debug("Expense Specification toPredicate - expense mode -"+ searchCriteria.getExpenseMode());
        if(org.apache.commons.lang3.StringUtils.isNotEmpty(searchCriteria.getExpenseMode())){
            predicates.add(builder.equal(root.get("mode"),  searchCriteria.getExpenseMode()));
        }

        log.debug("Expense Specification toPredicate - expense date -"+ searchCriteria.getExpenseFromDate());
        if(searchCriteria.getExpenseFromDate() != null){
            Date expenseFromDate = searchCriteria.getExpenseFromDate();

            Calendar fromDate = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
            fromDate.setTime(expenseFromDate);

            fromDate.set(Calendar.HOUR_OF_DAY, 0);
            fromDate.set(Calendar.MINUTE,0);
            fromDate.set(Calendar.SECOND,0);
            Date fromDt = DateUtil.convertUTCToIST(fromDate);


            Calendar expenseToDate = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
            if(searchCriteria.getExpenseToDate() != null) {
                expenseToDate.setTime(searchCriteria.getExpenseToDate());
            }else {
                expenseToDate.setTime(expenseFromDate);
            }

            expenseToDate.set(Calendar.HOUR_OF_DAY, 23);
            expenseToDate.set(Calendar.MINUTE,59);
            expenseToDate.set(Calendar.SECOND,0);
            Date toDt = DateUtil.convertUTCToIST(expenseToDate);

            log.debug("search Criteria - expense date from  - "+ fromDt + " , to Date -" + toDt);
            predicates.add(builder.between(root.get("expenseDate"), fromDt,toDt));

        }

        if(searchCriteria.getCreditedFromDate() != null){
            Date creditedFromDate = searchCriteria.getCreditedFromDate();

            Calendar fromDate = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
            fromDate.setTime(creditedFromDate);

            fromDate.set(Calendar.HOUR_OF_DAY, 0);
            fromDate.set(Calendar.MINUTE,0);
            fromDate.set(Calendar.SECOND,0);
            Date fromDt = DateUtil.convertUTCToIST(fromDate);


            Calendar creditedToDate = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
            if(searchCriteria.getExpenseToDate() != null) {
                creditedToDate.setTime(searchCriteria.getExpenseToDate());
            }else {
                creditedToDate.setTime(creditedFromDate);
            }

            creditedToDate.set(Calendar.HOUR_OF_DAY, 23);
            creditedToDate.set(Calendar.MINUTE,59);
            creditedToDate.set(Calendar.SECOND,0);
            Date toDt = DateUtil.convertUTCToIST(creditedToDate);

            log.debug("search Criteria - expense date from  - "+ fromDt + " , to Date -" + toDt);
            predicates.add(builder.between(root.get("creditedDate"), fromDt,toDt));

        }

//        predicates.add(builder.equal(root.get("active"), "Y"));

        if(searchCriteria.isShowInActive()) {
            predicates.add(builder.equal(root.get("active"), "N"));
        } else {
            predicates.add(builder.equal(root.get("active"), "Y"));
        }

        query.orderBy(builder.desc(root.get("id")));

        List<Predicate> orPredicates = new ArrayList<>();

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

        if(orPredicates.size() > 0) {
            finalExp = builder.or(orPredicates.toArray(new Predicate[orPredicates.size()]));
            predicates.add(finalExp);
            finalExp = builder.and(predicates.toArray(new Predicate[predicates.size()]));
        }else {
            finalExp = builder.and(predicates.toArray(new Predicate[predicates.size()]));;
        }

        return finalExp;

    }
}
