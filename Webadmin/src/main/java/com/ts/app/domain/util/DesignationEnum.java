package com.ts.app.domain.util;

public enum DesignationEnum {

	MD("MD"),
	OPERATIONS_MANAGER("Operations Manager"),
	TECHNICIAN("Technician"),
	SUPERVISOR("SUPERVISOR");
	
	private String value;
	
	private DesignationEnum(String value) {
		this.value = value;
	}
	
	public String getValue() {
		return value;
	}
}
