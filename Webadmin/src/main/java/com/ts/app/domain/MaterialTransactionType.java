package com.ts.app.domain;

/**
 * Created by karth on 7/1/2017.
 */
public enum MaterialTransactionType {
    RECEIVED("Received"),
    ISSUED("Issued");

    private String value;

    private MaterialTransactionType(String val){
        value = val;
    }
    
    public String getValue() { 
    	return value;
    }
}
