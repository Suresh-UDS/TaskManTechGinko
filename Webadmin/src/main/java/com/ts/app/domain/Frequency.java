package com.ts.app.domain;

import java.util.Arrays;
import java.util.stream.Stream;

public enum Frequency {
	
	 	HOUR("Hourly"), 
	    DAY("Daily"), 
	    WEEK("Weekly"), 
	    FORTNIGHT("Fortnightly"), 
	    MONTH("Monthly"), 
	    QUARTER("Quarterly"), 
	    HALFYEAR("HalfYearly"),
		YEAR("Yearly");
	 
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
