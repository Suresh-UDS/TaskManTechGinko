package com.ts.app.web.rest.dto;

import java.util.List;

public class SearchResponse<T extends BaseDTO> {

	private List<SearchResult<T>> results;
	
	private String checkInDateFrom;
	
	private String checkInDateTo;
	
	private String totalHours;
	
	private List<String> empIds;

	public List<SearchResult<T>> getResults() {
		return results;
	}

	public void setResults(List<SearchResult<T>> results) {
		this.results = results;
	}

	public String getTotalHours() {
		return totalHours;
	}

	public void setTotalHours(String totalHours) {
		this.totalHours = totalHours;
	}

	public String getCheckInDateFrom() {
		return checkInDateFrom;
	}

	public void setCheckInDateFrom(String checkInDateFrom) {
		this.checkInDateFrom = checkInDateFrom;
	}

	public String getCheckInDateTo() {
		return checkInDateTo;
	}

	public void setCheckInDateTo(String checkInDateTo) {
		this.checkInDateTo = checkInDateTo;
	}

	public List<String> getEmpIds() {
		return empIds;
	}

	public void setEmpIds(List<String> empIds) {
		this.empIds = empIds;
	}
	
	
}
