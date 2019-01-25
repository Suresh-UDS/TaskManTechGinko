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
    ADMIN(8),
    HVAC(9),
    CIVIL(10),
    GENERAL(11),
    PANTRYSERVICES(12);

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
			case "HVAC" :
				result = HVAC;
				break;
			case "CIVIL" :
				result = CIVIL;
				break;
			case "GENERAL" :
				result = GENERAL;
				break;
			case "PANTRYSERVICES" :
				result = PANTRYSERVICES;
				break;
				
			default:
				result = HOUSEKEEPING;
		
		}
		return result;
	}
}
