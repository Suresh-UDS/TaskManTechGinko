package com.ts.app.web.rest.dto;

import java.io.Serializable;
import java.util.Date;

public class EmployeeShiftDTO extends BaseDTO implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	private long id;
	
	private long employeeId;
	
	private String employeeEmpId;
	
	private String employeeFullName;
	
	private long siteId;
	
	private String siteName;

	private Date startTime;
	
	private Date endTime;
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(long employeeId) {
		this.employeeId = employeeId;
	}
	
	public String getEmployeeEmpId() {
		return employeeEmpId;
	}

	public void setEmployeeEmpId(String employeeEmpId) {
		this.employeeEmpId = employeeEmpId;
	}

	public String getEmployeeFullName() {
		return employeeFullName;
	}

	public void setEmployeeFullName(String employeeFullName) {
		this.employeeFullName = employeeFullName;
	}

	public long getSiteId() {
		return siteId;
	}

	public void setSiteId(long siteId) {
		this.siteId = siteId;
	}

	public String getSiteName() {
		return siteName;
	}

	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	

}
