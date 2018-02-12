package com.ts.app.web.rest.dto;

import java.io.Serializable;
import java.util.List;

public class ChecklistDTO extends BaseDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private long id;

	private String name;
	
    private long siteId;
    
    private String siteName;

    private long projectId;
    
    private String projectName; 

	private List<ChecklistItemDTO> items;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public List<ChecklistItemDTO> getItems() {
		return items;
	}

	public void setItems(List<ChecklistItemDTO> items) {
		this.items = items;
	}


}
