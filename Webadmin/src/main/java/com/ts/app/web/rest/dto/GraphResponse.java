package com.ts.app.web.rest.dto;

import com.ts.app.domain.JobType;

import java.util.Date;
import java.util.List;
import java.util.Map;

public class GraphResponse {

	Map<JobType,Long> jobCountByType;

	List<Date> dateSeries;
	
	Map<Long,Map<String,Long>> dataGroupedMap;
	
	Map<Long,Map<String,Long>> dataMap;

	public Map<JobType, Long> getJobCountByType() {
		return jobCountByType;
	}

	public void setJobCountByType(Map<JobType, Long> jobCountByType) {
		this.jobCountByType = jobCountByType;
	}

	public List<Date> getDateSeries() {
		return dateSeries;
	}

	public void setDateSeries(List<Date> dateSeries) {
		this.dateSeries = dateSeries;
	}

	public Map<Long, Map<String, Long>> getDataMap() {
		return dataMap;
	}

	public void setDataMap(Map<Long, Map<String, Long>> dataMap) {
		this.dataMap = dataMap;
	}

	public Map<Long, Map<String, Long>> getDataGroupedMap() {
		return dataGroupedMap;
	}

	public void setDataGroupedMap(Map<Long, Map<String, Long>> dataGroupedMap) {
		this.dataGroupedMap = dataGroupedMap;
	}

		
    
}
