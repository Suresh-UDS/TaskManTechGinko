package com.ts.app.web.rest.dto;

public class CommunicationAddressDTO {

	private String type;
	private String address;
	private String city;
	private String state;

	// ArrayList<AdditionalProperties> additionalProperties = new ArrayList<>();
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}
}
