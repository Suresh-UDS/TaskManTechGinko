package com.ts.app.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.ts.app.service.util.PagingUtil;

public abstract class AbstractService {
	
	protected Pageable createPageRequest(int page) {
		if(page == 0) {
			page = 1;
		}
		page -= 1;
        return new PageRequest(page, PagingUtil.PAGE_SIZE); 
    }

}
