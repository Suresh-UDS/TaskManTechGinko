package com.ts.app.web.rest.dto;

import java.util.List;

public class SearchResult<T extends BaseDTO> extends Paginator {

	private List<T> transactions;
	
	private String employeeEmpId;
	
	private String checkInDateFrom;
	
	private String checkInDateTo;
	
	private String totalHours;
	
	private long totalHrs;
	
	private long totalMins;
	
	public String getEmployeeEmpId() {
		return employeeEmpId;
	}

	public void setEmployeeEmpId(String employeeEmpId) {
		this.employeeEmpId = employeeEmpId;
	}

	public List<T> getTransactions() {
		return transactions;
	}

	public void setTransactions(List<T> results) {
		this.transactions = results;
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

	public long getTotalHrs() {
		return totalHrs;
	}

	public void setTotalHrs(long totalHrs) {
		this.totalHrs = totalHrs;
	}

	public long getTotalMins() {
		return totalMins;
	}

	public void setTotalMins(long totalMins) {
		this.totalMins = totalMins;
	}

	
	
	
}
