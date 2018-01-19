package com.ts.app.domain;

/**
 * Created by karth on 6/6/2017.
 */
public enum JobType {
	
	HOUSEKEEPING(1),
    ELECTRICAL(2),
    AC(3), 
    CARPENTRY(4), 
    PESTCONTROL(5), 
    PLUMBING(6),
    MAINTENANCE(7);

	private int value;
    
	private JobType(int val){
		value = val;
	}
	

}
