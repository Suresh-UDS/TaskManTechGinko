package com.ts.app.domain;

/**
 * 
 * @author gnana
 *
 */
public enum MaintenanceType {
	
    PPM("ppm"),
    AMC("amc");

    private String value;

    private MaintenanceType(String val){
        value = val;
    }
    
    public String getValue() {
    		return value;
    }
}
