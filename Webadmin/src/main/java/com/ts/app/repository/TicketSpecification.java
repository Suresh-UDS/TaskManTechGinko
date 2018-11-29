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
        log.debug("Ticket specification to predicate - "+searchCriteria.getId());

//        if(searchCriteria.getProjectId() !=0){
//            predicates.add(cb.equal(root.get("projectId"),searchCriteria.getProjectId()));
//        }
//        log.debug("Ticket specification to predicate - "+searchCriteria.getProjectId());

        if(searchCriteria.getSiteId() !=0){
            predicates.add(cb.equal(root.get("site").get("id"),searchCriteria.getSiteId()));
        }
        log.debug("Ticket specification to predicate - "+searchCriteria.getSiteId());

        if(searchCriteria.getEmployeeId() !=0){
            predicates.add(cb.equal(root.get("employee").get("id"),searchCriteria.getEmployeeId()));
        }
        log.debug("Ticket specification to predicate - "+searchCriteria.getEmployeeId());

        if(StringUtils.isNotEmpty(searchCriteria.getTicketStatus())){
            predicates.add(cb.equal(root.get("status"),searchCriteria.getTicketStatus()));
        }
        log.debug("Ticket specification to predicate - "+searchCriteria.getTicketStatus());

        if(StringUtils.isNotEmpty(searchCriteria.getTicketTitle())){
            predicates.add(cb.equal(root.get("title"),searchCriteria.getTicketTitle()));
        }
        log.debug("Ticket specification to predicate - "+searchCriteria.getTicketTitle());

        if(StringUtils.isNotEmpty(searchCriteria.getTicketDescription())){
            predicates.add(cb.equal(root.get("description"),searchCriteria.getTicketDescription()));
        }
        log.debug("Ticket specification to predicate - "+searchCriteria.getTicketDescription());

        if(searchCriteria.getAssetId()!=0){
            predicates.add(cb.equal(root.get("assetId"),searchCriteria.getAssetId()));
        }
        log.debug("Ticket specification to predicate - "+searchCriteria.getAssetId());

//        if(searchCriteria.getFromDate() != null){
//            if(root.get("createdDate") != null) {
//                Date checkInDate = searchCriteria.getFromDate();
//
//                Calendar checkInDateFrom = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
//                checkInDateFrom.setTime(checkInDate);
//
//                checkInDateFrom.set(Calendar.HOUR_OF_DAY, 0);
//                checkInDateFrom.set(Calendar.MINUTE,0);
//                checkInDateFrom.set(Calendar.SECOND,0);
//                Date fromDt = DateUtil.convertUTCToIST(checkInDateFrom);
//                //String fromDt = DateUtil.formatUTCToIST(checkInDateFrom);
//                Calendar checkInDateTo = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
//                if(searchCriteria.getToDate() != null) {
//                    checkInDateTo.setTime(searchCriteria.getToDate());
//                }else {
//                    checkInDateTo.setTime(checkInDate);
//                }
//
//                checkInDateTo.set(Calendar.HOUR_OF_DAY, 23);
//                checkInDateTo.set(Calendar.MINUTE,59);
//                checkInDateTo.set(Calendar.SECOND,0);
//                Date toDt = DateUtil.convertUTCToIST(checkInDateTo);
//                //String toDt = DateUtil.formatUTCToIST(checkInDateTo);
//
//                log.debug("Ticket specification to predicate - "+ fromDt + " , to Date -" + toDt);
//                predicates.add(cb.between(root.get("createdDate"), fromDt,toDt));
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

        //}
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
