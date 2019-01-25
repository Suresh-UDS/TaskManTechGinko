package com.ts.app.domain;

/**
 * Created by karth on 7/1/2017.
 */
public enum AssetStatus {
//    OPEN,ASSIGNED,INPROGRESS,COMPLETED,OVERDUE,OUTOFSCOPE
	//COMMISSIONED,IN_USE,UNDER_MAINTENANCE,UNDER_REPAIR,STOLEN,MISSING,DE_COMMISSIONED,DISPOSED,RETIRED
	COMMISSIONED("COMMISSIONED"), 
	IN_USE("IN_USE"), 
	UNDER_MAINTENANCE("UNDER_MAINTENANCE"), 
	UNDER_REPAIR("UNDER_REPAIR"), 
	STOLEN("STOLEN"), 
	MISSING("MISSING"), 
	DE_COMMISSIONED("DE_COMMISSIONED"),
	DISPOSED("DISPOSED"),
	BREAKDOWN("BREAKDOWN"),
	RETIRED("RETIRED");
 
    private String status;
 
    private AssetStatus(String status) {
        this.status = status;
    }
    
    public String getStatus() {
		return status;
	}
    
}
