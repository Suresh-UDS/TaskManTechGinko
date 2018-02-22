package com.ts.app.service.util;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import com.ts.app.web.rest.dto.SearchCriteria;

@Component
public class CacheUtil {

	private static final Map<String, SearchCriteria> reportCriteriaMap = new ConcurrentHashMap<String,SearchCriteria>();

	public void putSearchCriteria(String uid, SearchCriteria criteria) {
		reportCriteriaMap.put(uid, criteria);
	}
	
	public SearchCriteria getSearchCriteria(String uid) {
		return reportCriteriaMap.get(uid);
	}
}
