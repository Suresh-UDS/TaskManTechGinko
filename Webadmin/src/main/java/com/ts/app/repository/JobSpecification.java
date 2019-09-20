package com.ts.app.repository;

import com.ts.app.domain.Job;
import com.ts.app.domain.JobStatus;
import com.ts.app.domain.JobType;
import com.ts.app.service.util.DateUtil;
import com.ts.app.web.rest.dto.SearchCriteria;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaBuilder.In;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import java.text.DateFormat;
import java.util.*;

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
            if(searchCriteria.getJobId()!=0){
                predicates.add(builder.equal(root.get("id"), searchCriteria.getJobId()));
        }
            log.debug("JobSpecification toPredicate - searchCriteria projectid -"+ searchCriteria.getProjectId());
            if(searchCriteria.getProjectId()!=0){
                    predicates.add(builder.equal(root.get("site").get("project").get("id"), searchCriteria.getProjectId()));
            }
            log.debug("JobSpecification toPredicate - searchCriteria siteId -"+ searchCriteria.getSiteId());
            if(searchCriteria.getSiteId()!=0){
                    predicates.add(builder.equal(root.get("site").get("id"),  searchCriteria.getSiteId()));
            }

            log.debug("JobSpecification toPredicate - searchCriteria locationId -"+ searchCriteria.getLocationId());
            if(searchCriteria.getLocationId()!=0){
                predicates.add(builder.equal(root.get("location").get("id"),  searchCriteria.getLocationId()));
            }
            log.debug("JobSpecification toPredicate - searchCriteria block -"+ searchCriteria.getBlock());
            if(org.apache.commons.lang3.StringUtils.isNotEmpty(searchCriteria.getBlock())){
                predicates.add(builder.equal(root.get("block"),  searchCriteria.getBlock()));
            }
            log.debug("JobSpecification toPredicate - searchCriteria floor -"+ searchCriteria.getFloor());
            if(org.apache.commons.lang3.StringUtils.isNotEmpty(searchCriteria.getFloor())){
                predicates.add(builder.equal(root.get("floor"),  searchCriteria.getFloor()));
            }
            log.debug("JobSpecification toPredicate - searchCriteria zone -"+ searchCriteria.getZone());
            if(org.apache.commons.lang3.StringUtils.isNotEmpty(searchCriteria.getZone())){
                predicates.add(builder.equal(root.get("zone"),  searchCriteria.getZone()));
            }
            log.debug("JobSpecification toPredicate - searchCriteria jobstatus -"+ searchCriteria.getJobStatus());
            if(searchCriteria.getJobStatus()!=null){
                predicates.add(builder.equal(root.get("status"),  searchCriteria.getJobStatus()));
            }else {
            	//predicates.add(builder.notEqual(root.get("status"),  JobStatus.COMPLETED));
            }
            if( CollectionUtils.isNotEmpty( searchCriteria.getJobStatusList())) {
            	predicates.add(builder.in(root.get("status")).value(searchCriteria.getJobStatusList())); 
            }
            log.debug("JobSpecification toPredicate - searchCriteria jobTitle -"+ searchCriteria.getJobTitle());
            if(searchCriteria.getJobTitle()!=null){
                predicates.add(builder.like(builder.lower(root.get("title")),  "%" + searchCriteria.getJobTitle().toLowerCase() + "%"));
            }

            log.debug("JobSpecification toPredicate - searchCriteria scheduled -"+ searchCriteria.isScheduled());
            if(searchCriteria.isScheduled()) {
            	predicates.add(builder.equal(root.get("scheduled"),  searchCriteria.isScheduled()));
            }

            log.debug("JobSpecification to predicate - searchCriteria scheduled - "+searchCriteria.getSchedule());
            if(org.apache.commons.lang.StringUtils.isNotEmpty(searchCriteria.getSchedule())){
                predicates.add(builder.equal(root.get("schedule"),searchCriteria.getSchedule()));
            }

            if(searchCriteria.getEmployeeId()!=0 && !searchCriteria.isAdmin()){
        			predicates.add(builder.equal(root.get("employee").get("id"),  searchCriteria.getEmployeeId()));
        	}

            if(searchCriteria.getEmployeeId()!=0 && searchCriteria.isAdmin()){
    			predicates.add(builder.equal(root.get("employee").get("id"),  searchCriteria.getEmployeeId()));
            }

            if(StringUtils.isNotEmpty(searchCriteria.getJobTypeName())){
        			predicates.add(builder.equal(root.get("type"),  JobType.getType(searchCriteria.getJobTypeName())));
        		}
            /*if(StringUtils.isNotEmpty(searchCriteria.getMaintenanceType()) && searchCriteria.getAssetId() != 0 ) {
            	predicates.add(builder.and(builder.equal(root.get("maintenanceType"), searchCriteria.getMaintenanceType()), builder.equal(root.get("asset").get("id"), searchCriteria.getAssetId())));
            }*/

            log.debug("JobSpecification toPredicate - searchCriteria assetId -"+ searchCriteria.getAssetId());
            if(searchCriteria.getAssetId() != 0) {
            		predicates.add(builder.equal(root.get("asset").get("id"),  searchCriteria.getAssetId()));
            }

            log.debug("JobSpecification toPredicate - searchCriteria maintenanceType -"+ searchCriteria.getMaintenanceType());
            if(StringUtils.isNotEmpty(searchCriteria.getMaintenanceType())) {
            		predicates.add(builder.equal(root.get("maintenanceType"), searchCriteria.getMaintenanceType()));
            		predicates.add(builder.isNotNull(root.get("parentJob")));
            }

            log.debug("JobSpecification toPredicate - searchCriteria region -"+ searchCriteria.getRegion());
            if(StringUtils.isNotEmpty(searchCriteria.getRegion()) && searchCriteria.getRegion() != null) {
                predicates.add(builder.equal(root.get("site").get("region"), searchCriteria.getRegion()));
            }

            log.debug("JobSpecification toPredicate - searchCriteria branch -"+ searchCriteria.getBranch());
            if(StringUtils.isNotEmpty(searchCriteria.getBranch()) && searchCriteria.getBranch() != null) {
                predicates.add(builder.equal(root.get("site").get("branch"), searchCriteria.getBranch()));
            }

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
		            	if(searchCriteria.getCheckInDateTimeTo() != null) {
		            		
			            	checkInDateTo.setTime(searchCriteria.getCheckInDateTimeTo());
			            	checkInDateTo.set(Calendar.HOUR_OF_DAY, 23);
			            	checkInDateTo.set(Calendar.MINUTE,59);
			            	checkInDateTo.set(Calendar.SECOND,0);
			            	Date toDt = DateUtil.convertUTCToIST(checkInDateTo);
			            	log.debug("search Criteria - checkInDateTimeFrom - "+ fromDt + " , to Date -" + toDt);
			        		predicates.add(builder.between(root.get("plannedStartTime"), fromDt,toDt));
			        	} 
		            	else {
 
		            		predicates.add(builder.lessThanOrEqualTo( builder.function("DATE", String.class, root.get("plannedStartTime")) , DateUtil.formatToDateString(fromDt,"yyyy-MM-dd")  ));
		            		predicates.add(builder.greaterThanOrEqualTo(builder.function("DATE", String.class, root.get("plannedEndTime")) , DateUtil.formatToDateString(fromDt,"yyyy-MM-dd")  )  );
		            		
		            	}

		            	//String toDt = DateUtil.formatUTCToIST(checkInDateTo);

//		        		predicates.add(builder.between(root.set, root.get("plannedStartTime"),root.get("plannedEndTime")));
//		        		predicates.add(builder.between(, fromDt,toDt));
//		            	predicates.add(builder.gt(root.get("plannedStartTime"), fromDt))
	            	}
	        	}

            if(searchCriteria.isShowInActive()) {
                predicates.add(builder.equal(root.get("active"), "N"));
            } else {
                predicates.add(builder.equal(root.get("active"), "Y"));
            }

    		query.orderBy(builder.desc(root.get("id")));
            //Predicate firstStage = builder.and(predicates.toArray(new Predicate[predicates.size()]));
            List<Predicate> orPredicates = new ArrayList<>();
            log.debug("JobSpecification toPredicate - searchCriteria userId -"+ searchCriteria.getUserId());
            //if(isAdmin){
	            if(searchCriteria.getSiteId() == 0 && !searchCriteria.isAdmin()){
	            		orPredicates.add(builder.equal(root.get("employee").get("user").get("id"),  searchCriteria.getUserId()));
	            }else if(searchCriteria.getSiteId() > 0) {
	            		if(!searchCriteria.isAdmin()) {
	            			orPredicates.add(builder.equal(root.get("employee").get("user").get("id"),  searchCriteria.getUserId()));
	            		}
	                if(CollectionUtils.isNotEmpty(searchCriteria.getSubordinateIds())){
	                		orPredicates.add(root.get("employee").get("id").in(searchCriteria.getSubordinateIds()));
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
