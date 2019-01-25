package com.ts.app.domain;

import java.util.Arrays;
import java.util.stream.Stream;

public enum Frequency {
	
	 	HOUR("HOUR"), 
	    DAY("DAY"), 
	    WEEK("WEEK"), 
	    FORTNIGHT("FORTNIGHT"), 
	    MONTH("MONTH"), 
	    QUARTER("QUARTER"), 
	    HALFYEAR("HALFYEAR"),
		YEAR("YEAR");
	 
	    private String value;
	 
	    private Frequency(String value) {
	        this.value = value;
	    }
	    
	    public String getValue() {
			return value;
		}
	    
	    public static Frequency fromValue(String value) {
	    		Frequency result = null;
	    		switch(value) {
	    			case "HOUR":
	    				result = HOUR;
	    				break;
	    			case "DAY" :
	    				result = DAY;
	    				break;
	    			case "WEEK":
	    				result = WEEK;
	    				break;
	    			case "FORTNIGHT":
	    				result = FORTNIGHT;
	    				break;
	    			case "MONTH":
	    				result = MONTH;
	    				break;
	    			case "QUARTER":
	    				result = QUARTER;
	    				break;
	    			case "HALFYEAR":
	    				result = HALFYEAR;
	    				break;
	    			case "YEAR":
	    				result = YEAR;
	    				break;
	    			default:
	    				result = DAY;
	    		}
	    		return result;
	    }

		public static Stream<Frequency> stream() {
	        return Arrays.stream(Frequency.values()); 
	    }
}
