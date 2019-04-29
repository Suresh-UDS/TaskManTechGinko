package com.ts.app.domain.util;

public enum LogImportType {

	JOB("Job"),
	ASSET("Asset"),
	EMPLOYEE("Employee"),
	SITE("Site");
	
	private String value;
	
	private LogImportType(String value) {
		this.value = value;
	}
	
	public String getValue() {
		return value;
	}
}
