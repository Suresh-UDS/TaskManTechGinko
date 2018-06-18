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
