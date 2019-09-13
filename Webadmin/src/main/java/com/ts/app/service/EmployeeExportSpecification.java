package com.ts.app.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;

import com.ts.app.domain.Employee;
import com.ts.app.repository.EmployeeSpecification;
import com.ts.app.service.util.DateUtil;
import com.ts.app.web.rest.dto.SearchCriteria;

public class EmployeeExportSpecification implements Specification<Employee>{
	 SearchCriteria searchCriteria;
	    private boolean isAdmin;
	    private final Logger log = LoggerFactory.getLogger(EmployeeSpecification.class);

	 public EmployeeExportSpecification(SearchCriteria searchCriteria, boolean isAdmin) {
	        this.searchCriteria = searchCriteria;
	        this.isAdmin = isAdmin;
	    }

	    @Override
	    public Predicate toPredicate(Root<Employee> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
	    	List<Predicate> predicates = new ArrayList<>();
	        log.debug("EmpSpecification toPredicate - searchCriteria projectId -" + searchCriteria.getProjectId());
	        Join<Object, Object> projectSiteJoin = null;

	        if (searchCriteria.getProjectId() != 0) {
	            projectSiteJoin = root.join("projectSites");
	            predicates.add(builder.equal(projectSiteJoin.get("project").get("id"), searchCriteria.getProjectId()));
	        }
	        
	        log.debug("EmpSpecification toPredicate - searchCriteria emp Name -" + searchCriteria.getName());
	        if (searchCriteria.getName() != null && searchCriteria.getName() != "") {
	            predicates.add(builder.like(builder.lower(root.get("name")),
	                "%" + searchCriteria.getName().toLowerCase() + "%"));
	        }
	        
	        log.debug("EmpSpecification toPredicate - searchCriteria employeeID -" + searchCriteria.getEmployeeEmpId());
	        if (StringUtils.isNotEmpty(searchCriteria.getEmployeeEmpId())) {
	            predicates.add(builder.equal(root.get("empId"), searchCriteria.getEmployeeEmpId()));
	        }
	        
	        if(StringUtils.isNotEmpty(searchCriteria.getElement())) {
	        	predicates.add(builder.equal(root.get("element"), searchCriteria.getElement()));
	        }
	        
	        if(StringUtils.isNotEmpty(searchCriteria.getElementCode())) {
	        	predicates.add(builder.equal(root.get("elementCode"), searchCriteria.getElementCode()));
	        }

	        if(StringUtils.isNotEmpty(searchCriteria.getElementType())) {
	        	predicates.add(builder.equal(root.get("elementType"),searchCriteria.getElementType()));
	        }
	        
	        if(StringUtils.isNotEmpty(searchCriteria.getElementParent())) {
	        	predicates.add(builder.equal(root.get("elementParent"), searchCriteria.getElementParent()));
	        }
	        
	        log.debug("EmpSpecification toPredicate - searchCriteria projectName -" + searchCriteria.getProjectName());
	        if(searchCriteria.getProjectName() != null && searchCriteria.getProjectName() != "") {
	            if(projectSiteJoin == null) {
	                projectSiteJoin = root.join("projectSites");
	            }
	            predicates.add(builder.equal(projectSiteJoin.get("project").get("name"), searchCriteria.getProjectName()));
	        }
	        
	        log.debug("EmpSpecification toPredicate - searchCriteria branch -" + searchCriteria.getBranch());
	        if(searchCriteria.getBranch() != null && searchCriteria.getBranch() != "") {
	            if(projectSiteJoin == null) {
	                projectSiteJoin = root.join("projectSites");
	            }
	        	predicates.add(builder.equal(projectSiteJoin.get("site").get("branch"), searchCriteria.getBranch()));
	        }

	        if(searchCriteria.getProjectCode() !=null && StringUtils.isNotEmpty(searchCriteria.getProjectCode())){
	            predicates.add(builder.equal(root.get("projectCode"),searchCriteria.getProjectCode()));
	        }

	        if (searchCriteria.getWbsCode()!=null && StringUtils.isNotEmpty(searchCriteria.getWbsCode())){
	            predicates.add(builder.equal(root.get("wbsId"),searchCriteria.getWbsCode()));
	        }
	        
	        List<String> empty = new ArrayList<String>();
			empty.add("-");

	        if(searchCriteria.getProjectCodes()!=null){
	        	
	        	if(CollectionUtils.isEmpty(searchCriteria.getProjectCodes())) {
	        		predicates.add(root.get("projectCode").in(empty));
	        	}
	        	else {
	        		predicates.add(root.get("projectCode").in(searchCriteria.getProjectCodes()));
	        	}
	        }

	        if(searchCriteria.getWbsCodes()!=null ){
	           
	            	if(CollectionUtils.isEmpty(searchCriteria.getWbsCodes())) {
	            		 
	            		predicates.add(root.get("wbsId").in(empty));
	            		
	            	}
	            	else {
	            		
	            		predicates.add(root.get("wbsId").in(searchCriteria.getWbsCodes()));
	            		
	            	}
	                
	            
	        	
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
	        
	        query.orderBy(builder.desc(root.get("createdDate")));

	        query.distinct(true);
	        
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
	            if(CollectionUtils.isNotEmpty(searchCriteria.getSiteIds())){
	                if(projectSiteJoin == null) {
	                    projectSiteJoin = root.join("projectSites");
	                }
	                Predicate path = projectSiteJoin.get("site").get("id").in(searchCriteria.getSiteIds());
	                orPredicates.add(path);
	            }
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