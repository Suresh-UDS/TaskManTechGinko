package com.ts.app.domain;

import java.util.Arrays;
import java.util.stream.Stream;

public enum Frequency {
	
		DAILY("DAILY"),
		WEEKLY("WEEKLY"),
		MONTHLY("MONTHLY"),
	 	HOUR("HOURLY"), 
	    DAY("DAILY"), 
	    WEEK("WEEKLY"), 
	    FORTNIGHT("FORTNIGHTLY"), 
	    MONTH("MONTHLY"), 
	    QUARTER("QUARTERLY"), 
	    HALFYEAR("HALFYEARLY"),
		YEAR("YEARLY");
	 
	    private String typeFrequency;
	 
	    private Frequency(String typeFrequency) {
	        this.typeFrequency = typeFrequency;
	    }
	    
	    public String getTypeFrequency() {
			return typeFrequency;
		}

		public static Stream<Frequency> stream() {
	        return Arrays.stream(Frequency.values()); 
	    }
}
