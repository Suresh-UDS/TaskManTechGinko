package com.ts.app.web.rest.dto;

public class PreviousEmployeeDTO {
	private String name;
	private String designation;

	// ArrayList<AdditionalProperties> additionalProperties = new ArrayList<>();
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}

}
