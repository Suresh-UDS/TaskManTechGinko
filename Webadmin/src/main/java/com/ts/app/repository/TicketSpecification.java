package com.ts.app.repository;

import com.google.common.base.Predicates;
import com.ts.app.domain.Ticket;
import com.ts.app.domain.util.StringUtil;
import com.ts.app.service.util.DateUtil;
import com.ts.app.web.rest.dto.SearchCriteria;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

public class TicketSpecification implements Specification<Ticket> {

    SearchCriteria searchCriteria;
    private boolean isAdmin;
    private final Logger log = LoggerFactory.getLogger(JobSpecification.class);
    /**
     * @param searchCriteria
     * @param isAdmin - to identify the request from admin site
     */
    public TicketSpecification(SearchCriteria searchCriteria, boolean isAdmin) {
        this.searchCriteria=searchCriteria;
        this.isAdmin = isAdmin;
    }

    @Override
    public Predicate toPredicate(Root<Ticket> root, CriteriaQuery<?> query, CriteriaBuilder cb) {

        List<Predicate> predicates = new ArrayList<>();

        if(searchCriteria.getId()!=0){
            predicates.add(cb.equal(root.get("id"), searchCriteria.getId()));
        }
        log.debug("Ticket specification to predicate ticket Id - "+searchCriteria.getId());

        if(searchCriteria.getProjectId() !=0){
            predicates.add(cb.equal(root.get("site").get("project").get("id"),searchCriteria.getProjectId()));
        }
        log.debug("Ticket specification to predicate project Id - "+searchCriteria.getProjectId());

        if(searchCriteria.getSiteId() !=0){
            predicates.add(cb.equal(root.get("site").get("id"),searchCriteria.getSiteId()));
        }
        log.debug("Ticket specification to predicate site Id - "+searchCriteria.getSiteId());

        if(searchCriteria.getEmployeeId() !=0 && !searchCriteria.isAdmin()){
            predicates.add(cb.equal(root.get("employee").get("id"),searchCriteria.getEmployeeId()));
        }
        log.debug("Ticket specification to predicate Employee Id - "+searchCriteria.getEmployeeId());

        if(searchCriteria.getEmployeeId() !=0 && searchCriteria.isAdmin()){
            predicates.add(cb.equal(root.get("employee").get("id"),searchCriteria.getEmployeeId()));
        }
        log.debug("Ticket specification to predicate Employee Id - "+searchCriteria.getEmployeeId());

        if(StringUtils.isNotEmpty(searchCriteria.getTicketStatus())){
            predicates.add(cb.equal(root.get("status"),searchCriteria.getTicketStatus()));
        }
        log.debug("Ticket specification to predicate ticket status - "+searchCriteria.getTicketStatus());

        if(StringUtils.isNotEmpty(searchCriteria.getTicketTitle())){
            predicates.add(cb.equal(root.get("title"),searchCriteria.getTicketTitle()));
        }
        log.debug("Ticket specification to predicate ticket title - "+searchCriteria.getTicketTitle());

        if(StringUtils.isNotEmpty(searchCriteria.getTicketDescription())){
            predicates.add(cb.equal(root.get("description"),searchCriteria.getTicketDescription()));
        }
        log.debug("Ticket specification to predicate ticket description - "+searchCriteria.getTicketDescription());

        if(searchCriteria.getAssetId()!=0){
            predicates.add(cb.equal(root.get("asset").get("id"),searchCriteria.getAssetId()));
        }
        log.debug("Ticket specification to predicate asset id - "+searchCriteria.getAssetId());

//        if(searchCriteria.getFromDate() != null){
//            if(root.get("createdDate") != null) {
//                Calendar startCal = Calendar.getInstance();
//                if (searchCriteria.getFromDate() != null) {
//                    startCal.setTime(searchCriteria.getFromDate());
//                }
//                startCal.set(Calendar.HOUR_OF_DAY, 0);
//                startCal.set(Calendar.MINUTE, 0);
//                startCal.set(Calendar.SECOND, 0);
//                Calendar endCal = Calendar.getInstance();
//                if (searchCriteria.getToDate() != null) {
//                    endCal.setTime(searchCriteria.getToDate());
//                }
//                endCal.set(Calendar.HOUR_OF_DAY, 23);
//                endCal.set(Calendar.MINUTE, 59);
//                endCal.set(Calendar.SECOND, 0);
//                //searchCriteria.setFromDate(startCal.getTime());
//                //searchCriteria.setToDate(endCal.getTime());
//                ZonedDateTime startDate = ZonedDateTime.ofInstant(startCal.toInstant(), ZoneId.systemDefault());
//                ZonedDateTime endDate = ZonedDateTime.ofInstant(endCal.toInstant(), ZoneId.systemDefault());
//
//                log.debug("Ticket specification to predicate - "+ startDate + " , to Date -" + endDate);
//                predicates.add(cb.between(root.get("createdDate"), startDate,endDate));
//            }
//        }



        predicates.add(cb.equal(root.get("active"),"Y"));

        query.orderBy(cb.desc(root.get("id")));

        List<Predicate> orPredicates = new ArrayList<>();

        if(searchCriteria.getSiteId() == 0 && !searchCriteria.isAdmin()){
            orPredicates.add(cb.equal(root.get("employee").get("user").get("id"),  searchCriteria.getUserId()));
            log.debug("Ticket specification to predicate - "+searchCriteria.getUserId());
            log.debug("Ticket specification to predicate site id is 0 - "+root.get("employee").get("user").get("id"));
        }else if(searchCriteria.getSiteId() > 0) {
            if(!searchCriteria.isAdmin()) {
                orPredicates.add(cb.equal(root.get("employee").get("user").get("id"),  searchCriteria.getUserId()));
                log.debug("Ticket specification to predicate with site id - "+root.get("employee").get("user").get("id"));

            }
            if(CollectionUtils.isNotEmpty(searchCriteria.getSubordinateIds())){
                orPredicates.add(root.get("employee").get("id").in(searchCriteria.getSubordinateIds()));
                log.debug("Ticket specification to predicate with subordinates - "+root.get("employee").get("user").get("id"));

            }
        }
        if(!isAdmin)
        {
            if(CollectionUtils.isNotEmpty(searchCriteria.getSiteIds())){
                Predicate path = root.get("site").get("id").in(searchCriteria.getSiteIds());
                orPredicates.add(path);
            }
        }

        log.debug("Ticket specification toPredicate - searchCriteria subordinateIds -"+ searchCriteria.getSubordinateIds());
        if(searchCriteria.getSiteId() == 0 && CollectionUtils.isNotEmpty(searchCriteria.getSubordinateIds())){
            orPredicates.add(root.get("employee").get("id").in(searchCriteria.getSubordinateIds()));
        }
        Predicate finalExp = null;
        if(orPredicates.size() > 0) {
            finalExp = cb.or(orPredicates.toArray(new Predicate[orPredicates.size()]));
            predicates.add(finalExp);
            finalExp = cb.and(predicates.toArray(new Predicate[predicates.size()]));
        }else {
            finalExp = cb.and(predicates.toArray(new Predicate[predicates.size()]));;
        }

        log.debug("Ticket specification - "+finalExp.toString());

        return finalExp;
    }
}
