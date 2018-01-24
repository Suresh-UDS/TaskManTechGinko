package com.ts.app.domain;

public enum UserGroupEnum {
	
	ADMIN("Admin");
	
	private String val;
	
	private UserGroupEnum(String value){
		val = value;
	}
	
	public String toValue() {
		return val;
	}

}
