package com.ts.app.domain;

public enum TicketStatus {
	
	OPEN("Open"),
	ASSIGNED("Assigned"),
	CLOSED("Closed");
	
	private String val;
	
	private TicketStatus(String value){
		val = value;
	}
	
	public String toValue() {
		return val;
	}

}
