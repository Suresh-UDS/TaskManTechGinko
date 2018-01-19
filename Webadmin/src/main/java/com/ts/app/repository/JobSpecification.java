package com.ts.app.repository;

import com.ts.app.domain.Job;
import com.ts.app.web.rest.dto.SearchCriteria;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

public class JobSpecification implements Specification<Job> {
		SearchCriteria searchCriteria;
		private boolean isAdmin;
		private final Logger log = LoggerFactory.getLogger(JobSpecification.class);
        /**
         * @param searchCriteria
         * @param isAdmin - to identify the request from admin site
         */
        public JobSpecification(SearchCriteria searchCriteria, boolean isAdmin) {
                this.searchCriteria=searchCriteria;
                this.isAdmin = isAdmin;
        }
        @Override
        public Predicate toPredicate(Root<Job> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
            List<Predicate> predicates = new ArrayList<>();
            log.debug("JobSpecification toPredicate - searchCriteria projectid -"+ searchCriteria.getProjectId());
            if(searchCriteria.getProjectId()!=0){
                    predicates.add(builder.equal(root.get("site").get("project").get("id"), searchCriteria.getProjectId()));
            }
            log.debug("JobSpecification toPredicate - searchCriteria siteId -"+ searchCriteria.getSiteId());
            if(searchCriteria.getSiteId()!=0){
                    predicates.add(builder.equal(root.get("site").get("id"),  searchCriteria.getSiteId()));
            }
            log.debug("JobSpecification toPredicate - searchCriteria jobstatus -"+ searchCriteria.getJobStatus());
            if(searchCriteria.getJobStatus()!=null){
                predicates.add(builder.equal(root.get("status"),  searchCriteria.getJobStatus()));
            }else {
            	//predicates.add(builder.notEqual(root.get("status"),  JobStatus.COMPLETED));
            }
            log.debug("JobSpecification toPredicate - searchCriteria jobTitle -"+ searchCriteria.getJobTitle());
            if(searchCriteria.getJobTitle()!=null){
                predicates.add(builder.like(builder.lower(root.get("title")),  "%" + searchCriteria.getJobTitle().toLowerCase() + "%"));
            }

            log.debug("JobSpecification toPredicate - searchCriteria scheduled -"+ searchCriteria.isScheduled());
            if(searchCriteria.isScheduled()) {
            	predicates.add(builder.equal(root.get("scheduled"),  searchCriteria.isScheduled()));
            }

//            if(searchCriteria.getEmployeeId()!=0){
//        		predicates.add(builder.equal(root.get("employee").get("id"),  searchCriteria.getEmployeeId()));
//        	}

            /*
            if(searchCriteria.getCheckInDateTimeFrom() != null){
            	if(root.get("plannedStartTime") != null) {
	            	//Date plannedDate = (Date)root.get("plannedStartTime");
	            	Date checkInDate = searchCriteria.getCheckInDateTimeFrom();

	            	Calendar checkInDateFrom = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
	            	checkInDateFrom.setTime(checkInDate);

	            	checkInDateFrom.set(Calendar.HOUR_OF_DAY, 0);
	            	checkInDateFrom.set(Calendar.MINUTE,0);
	            	checkInDateFrom.set(Calendar.SECOND,0);
	            	Date fromDt = DateUtil.convertUTCToIST(checkInDateFrom);
	            	//String fromDt = DateUtil.formatUTCToIST(checkInDateFrom);
	            	Calendar checkInDateTo = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
	            	checkInDateTo.setTime(checkInDate);

	            	checkInDateTo.set(Calendar.HOUR_OF_DAY, 23);
	            	checkInDateTo.set(Calendar.MINUTE,59);
	            	checkInDateTo.set(Calendar.SECOND,0);
	            	Date toDt = DateUtil.convertUTCToIST(checkInDateTo);
	            	//String toDt = DateUtil.formatUTCToIST(checkInDateTo);

	            	log.debug("search Criteria - checkInDateTimeFrom - "+ fromDt + " , to Date -" + toDt);
	        		predicates.add(builder.between(root.get("plannedStartTime"), fromDt,toDt));
            	}
        	}
        	*/
    		query.orderBy(builder.desc(root.get("id")));
            //Predicate firstStage = builder.and(predicates.toArray(new Predicate[predicates.size()]));
            List<Predicate> orPredicates = new ArrayList<>();
            log.debug("JobSpecification toPredicate - searchCriteria userId -"+ searchCriteria.getUserId());
            //if(isAdmin){
	            if(searchCriteria.getSiteId() == 0){
	            	orPredicates.add(builder.equal(root.get("employee").get("user").get("id"),  searchCriteria.getUserId()));
	            }else if(searchCriteria.getSiteId() > 0) {
	            	orPredicates.add(builder.equal(root.get("employee").get("user").get("id"),  searchCriteria.getUserId()));
	                if(CollectionUtils.isNotEmpty(searchCriteria.getSubordinateIds())){
	                	orPredicates.add(root.get("employee").get("id").in(searchCriteria.getSubordinateIds()));
	                }
	            }
            //}
	        log.debug("JobSpecification toPredicate - searchCriteria subordinateIds -"+ searchCriteria.getSubordinateIds());
            if(searchCriteria.getSiteId() == 0 && CollectionUtils.isNotEmpty(searchCriteria.getSubordinateIds())){
            	orPredicates.add(root.get("employee").get("id").in(searchCriteria.getSubordinateIds()));
            }
            Predicate finalExp = null;
            if(orPredicates.size() > 0) {
            	//if(searchCriteria.getSiteId() > 0) {
            	//	finalExp = builder.and(orPredicates.toArray(new Predicate[orPredicates.size()]));
            	//}else {
            		finalExp = builder.or(orPredicates.toArray(new Predicate[orPredicates.size()]));
            	//}
            	predicates.add(finalExp);
            	finalExp = builder.and(predicates.toArray(new Predicate[predicates.size()]));
            }else {
            	finalExp = builder.and(predicates.toArray(new Predicate[predicates.size()]));;
            }


           //predicates.add(builder.equal(root.get("site.id"),  searchCriteria.getSiteId()));

            return finalExp;
        }

}
