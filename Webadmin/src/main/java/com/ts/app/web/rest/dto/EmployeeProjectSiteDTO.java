package com.ts.app.web.rest.dto;

import java.io.Serializable;

public class EmployeeProjectSiteDTO extends BaseDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long id;
	
	private long employeeId;
	
	private String employeeName;

	private long projectId;
	
	private String projectName;
	
	private long siteId;
	
	private String siteName;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(long employeeId) {
		this.employeeId = employeeId;
	}

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}

	public long getProjectId() {
		return projectId;
	}

	public void setProjectId(long projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
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

	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append("employee id ="+ employeeId);
		sb.append(", employee name ="+ employeeName);
		sb.append(", project id ="+ projectId);
		sb.append(", project name ="+ projectName);
		sb.append(", site id ="+ siteId);
		sb.append(", site name ="+ siteName);
		return sb.toString();
	}
	
	
}
