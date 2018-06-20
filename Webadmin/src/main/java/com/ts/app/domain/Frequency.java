package com.ts.app.domain;

import java.util.Arrays;
import java.util.stream.Stream;

public enum Frequency {
	
	 	HOURLY("HOUR"), 
	    DAILY("DAY"), 
	    WEEKLY("WEEK"), 
	    FORTNIGHTLY("FORTNIGHT"), 
	    MONTHLY("MONTH"), 
	    QUARTERLY("QUARTER"), 
	    HALFYEARLY("HALFYEAR"),
		YEARLY("YEAR");
	 
	    private String value;
	 
	    private Frequency(String value) {
	        this.value = value;
	    }
	    
	    public String getValue() {
			return value;
		}

		public static Stream<Frequency> stream() {
	        return Arrays.stream(Frequency.values()); 
	    }
}
