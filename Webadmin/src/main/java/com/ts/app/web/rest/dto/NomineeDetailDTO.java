package com.ts.app.web.rest.dto;

public class NomineeDetailDTO {

	  private String name;
	  private String relationship;
	  private String contactNumber;
	  private String nominePercentage;
	//ArrayList<AdditionalProperties> additionalProperties = new ArrayList<>();
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getRelationship() {
		return relationship;
	}
	public void setRelationship(String relationship) {
		this.relationship = relationship;
	}
	public String getContactNumber() {
		return contactNumber;
	}
	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}
	public String getNominePercentage() {
		return nominePercentage;
	}
	public void setNominePercentage(String nominePercentage) {
		this.nominePercentage = nominePercentage;
	}
}
