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
    MAINTENANCE(7),
    ADMIN(8);

	private int value;
    
	private JobType(int val){
		value = val;
	}
	
	public static JobType getType(String name) {
		JobType result = null;
		switch(name) {
			case "HOUSEKEEPING" :
				result = HOUSEKEEPING;
				break;
			case "ELECTRICAL" :
				result = ELECTRICAL;
				break;
			case "AC" :
				result = AC;
				break;
			case "CARPENTRY" :
				result = CARPENTRY;
				break;
			case "PESTCONTROL" :
				result = PESTCONTROL;
				break;
			case "PLUMBING" :
				result = PLUMBING;
				break;
			case "MAINTENANCE" :
				result = MAINTENANCE;
				break;
			case "ADMIN" :
				result = ADMIN;
				break;
				
			default:
				result = HOUSEKEEPING;
		
		}
		return result;
	}
}
