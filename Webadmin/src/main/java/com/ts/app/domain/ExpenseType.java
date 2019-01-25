package com.ts.app.domain;

/**
 * 
 * @author gnana
 *
 */
public enum ExpenseType {
	
	MATERIAL_PURCHASE("MATERIAL_PURCHASE"), 
	ADVANCE("ADVANCE"), 
	FOOD("FOOD"), 
	TRAVEL("TRAVEL");
 
    private String type;
 
    private ExpenseType(String type) {
        this.type = type;
    }
    
    public String getType() {
		return type;
	}
    
}
