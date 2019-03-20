package com.ts.app.web.rest.dto;

public class SiteListDTO {

	private String pareaId;
	private String projectId;
	private String wbsId;
	private String wbsDesc;
	private String startDate;
	private String endDate;
	private String networkId;
	
	public String getPareaId() {
		return pareaId;
	}
	public void setPareaId(String pareaId) {
		this.pareaId = pareaId;
	}
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public String getWbsId() {
		return wbsId;
	}
	public void setWbsId(String wbsId) {
		this.wbsId = wbsId;
	}
	public String getWbsDesc() {
		return wbsDesc;
	}
	public void setWbsDesc(String wbsDesc) {
		this.wbsDesc = wbsDesc;
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
	public String getNetworkId() {
		return networkId;
	}
	public void setNetworkId(String networkId) {
		this.networkId = networkId;
	}
}
