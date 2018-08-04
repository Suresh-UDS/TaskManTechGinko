package com.ts.app.domain;

public enum UserRoleEnum {
	
	ADMIN("Admin");
	
	private String val;
	
	private UserRoleEnum(String value){
		val = value;
	}
	
	public String toValue() {
		return val;
	}

}
