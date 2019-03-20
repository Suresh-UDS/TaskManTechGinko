package com.ts.app.web.rest.dto;

public class EducationQualificationDTO {
	private String qualification;
	private String institute;

	// ArrayList<AdditionalProperties> additionalProperties = new ArrayList<>();
	public String getQualification() {
		return qualification;
	}

	public void setQualification(String qualification) {
		this.qualification = qualification;
	}

	public String getInstitute() {
		return institute;
	}

	public void setInstitute(String institute) {
		this.institute = institute;
	}

}
