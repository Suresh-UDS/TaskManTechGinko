package com.ts.app.domain;

import java.util.Arrays;
import java.util.stream.Stream;

public enum Frequency {
	
	 	HOUR("Hour"), 
	    DAY("Day"), 
	    WEEK("Week"), 
	    FORTNIGHT("Fortnight"), 
	    MONTH("Month"), 
	    QUARTER("Quarter"), 
	    HALFYEAR("HalfYear"),
		YEAR("Year");
	 
	    private String typeFrequency;
	 
	    Frequency(String typeFrequency) {
	        this.typeFrequency = typeFrequency;
	    }
	     
	    public static Stream<Frequency> stream() {
	        return Arrays.stream(Frequency.values()); 
	    }
}
