package com.ts.app.domain;

/**
 * 
 * @author gnana
 *
 */
public enum PaymentType {
	
	CASH("CASH"), 
	CARD("CARD"), 
	NETBANKING("NETBANKING"), 
	CHEQUE("CHEQUE");
 
    private String type;
 
    private PaymentType(String type) {
        this.type = type;
    }
    
    public String getType() {
		return type;
	}
    
}
