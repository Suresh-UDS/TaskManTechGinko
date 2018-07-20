package com.ts.app.web.rest.dto;

import java.util.ArrayList;
import java.util.Set;

public class SlaConfigDTO extends BaseDTO{

	
	private long id;
	
	private long projectId;
	
	private String projectName;
	
	private long siteId;
	
	private String siteName;
	
	private String processType;
	
	private ArrayList<String> category;
	
	private String severity;
	
	private int hours;
	
	private Set<SlaEscalationConfigDTO> slaesc;
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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

	public String getProcessType() {
		return processType;
	}

	public void setProcessType(String processType) {
		this.processType = processType;
	}

	public ArrayList<String> getCategory() {
		return category;
	}

	public void setCategory(ArrayList<String> category) {
		this.category = category;
	}

	public String getSeverity() {
		return severity;
	}

	public void setSeverity(String severity) {
		this.severity = severity;
	}

	public int getHours() {
		return hours;
	}

	public void setHours(int hours) {
		this.hours = hours;
	}

	public Set<SlaEscalationConfigDTO> getSlaesc() {
		return slaesc;
	}

	public void setSlaesc(Set<SlaEscalationConfigDTO> slaesc) {
		this.slaesc = slaesc;
	}

}
