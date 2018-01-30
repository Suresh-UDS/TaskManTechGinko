package com.ts.app.web.rest.dto;

import java.io.Serializable;

public class JobChecklistDTO extends BaseDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private long id;

	private String checklistId;

	private String checklistName;
	
	private String checklistItemId;

	private String checklistItemName;
	
	private long jobId;
	
	private String jobTitle;


	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getChecklistId() {
		return checklistId;
	}

	public void setChecklistId(String checklistId) {
		this.checklistId = checklistId;
	}

	public String getChecklistName() {
		return checklistName;
	}

	public void setChecklistName(String checklistName) {
		this.checklistName = checklistName;
	}

	public String getChecklistItemId() {
		return checklistItemId;
	}

	public void setChecklistItemId(String checklistItemId) {
		this.checklistItemId = checklistItemId;
	}

	public String getChecklistItemName() {
		return checklistItemName;
	}

	public void setChecklistItemName(String checklistItemName) {
		this.checklistItemName = checklistItemName;
	}

	public long getJobId() {
		return jobId;
	}

	public void setJobId(long jobId) {
		this.jobId = jobId;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

}
