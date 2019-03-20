package com.ts.app.web.rest.dto;

public class RelationshipDetailsDTO {
	private String name;
	private String relationship;
	private String contactNumber;

	// ArrayList<AdditionalProperties> additionalProperties = new ArrayList<>();
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
}
