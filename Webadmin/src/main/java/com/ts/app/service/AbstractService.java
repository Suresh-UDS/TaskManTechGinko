package com.ts.app.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.ts.app.domain.Employee;
import com.ts.app.service.util.PagingUtil;

public abstract class AbstractService {
	
	private static final Logger logger = LoggerFactory.getLogger(AbstractService.class);
	
	protected Pageable createPageRequest(int page) {
		if(page == 0) {
			page = 1;
		}
		page -= 1;
        return new PageRequest(page, PagingUtil.PAGE_SIZE); 
    }
	
	protected Pageable createPageRequest(int page, int pageSize) {
		if(page == 0) {
			page = 1;
		}
		page -= 1;
        return new PageRequest(page, pageSize); 
    }
	
    public List<Long> findAllSubordinates(Employee employee, List<Long> subEmpIds) {
        Set<Employee> subs = employee.getSubOrdinates();
        if(logger.isDebugEnabled()) {
        		logger.debug("List of subordinates -"+ subs);
        }
        if(subEmpIds == null){
            subEmpIds = new ArrayList<Long>();
        }
        subEmpIds.add(employee.getId());
        for(Employee sub : subs) {
            subEmpIds.add(sub.getId());
            Hibernate.initialize(sub.getSubOrdinates());
            if(CollectionUtils.isNotEmpty(sub.getSubOrdinates())){
                findAllSubordinates(sub, subEmpIds);
            }
        }
        return subEmpIds;
    }

}
