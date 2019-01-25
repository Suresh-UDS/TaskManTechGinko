package com.ts.app.domain;

import java.util.Arrays;
import java.util.stream.Stream;

public enum FrequencyPrefix {
	
	EVERY("Every");
	
	private String prefixFrequency;
	 
	FrequencyPrefix(String prefixFrequency) {
        this.prefixFrequency = prefixFrequency;
    }
     
    public static Stream<FrequencyPrefix> stream() {
        return Arrays.stream(FrequencyPrefix.values()); 
    }

}
