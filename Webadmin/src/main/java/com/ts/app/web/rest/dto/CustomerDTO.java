package com.ts.app.web.rest.dto;

import java.util.ArrayList;

public class CustomerDTO {
	private String branchName;
	ArrayList<ProjectsDTO> project = new ArrayList<>();
	// ArrayList<AdditionalProperties> additionalProperties = new ArrayList<>();

	public String getBranchName() {
		return branchName;
	}

	public void setBranchName(String branchName) {
		this.branchName = branchName;
	}

	public ArrayList<ProjectsDTO> getProject() {
		return project;
	}

	public void setProject(ArrayList<ProjectsDTO> project) {
		this.project = project;
	}
}
