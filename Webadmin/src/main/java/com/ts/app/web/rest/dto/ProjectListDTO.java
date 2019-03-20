package com.ts.app.web.rest.dto;

import java.util.Date;

public class ProjectListDTO {

	private String projectId;
	private String projectDesc;
	private String businessAreaId;
	private String startDate;
	private String endDate;
	private String status;
	
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public String getProjectDesc() {
		return projectDesc;
	}
	public void setProjectDesc(String projectDesc) {
		this.projectDesc = projectDesc;
	}
	public String getBusinessAreaId() {
		return businessAreaId;
	}
	public void setBusinessAreaId(String businessAreaId) {
		this.businessAreaId = businessAreaId;
	}
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
}
