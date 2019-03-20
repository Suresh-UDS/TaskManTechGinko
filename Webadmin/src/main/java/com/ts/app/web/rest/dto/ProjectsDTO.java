package com.ts.app.web.rest.dto;

import java.util.ArrayList;

public class ProjectsDTO {
	private String projectId;
	private String projectName;
	private String projectDes;
	ArrayList<WbsDTO> wbs = new ArrayList<>();
	// ArrayList<AdditionalProperties> additionalProperties = new ArrayList<>();

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getProjectDes() {
		return projectDes;
	}

	public void setProjectDes(String projectDes) {
		this.projectDes = projectDes;
	}

	public ArrayList<WbsDTO> getWbs() {
		return wbs;
	}

	public void setWbs(ArrayList<WbsDTO> wbs) {
		this.wbs = wbs;
	}
}
