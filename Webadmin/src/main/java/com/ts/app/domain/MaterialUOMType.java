package com.ts.app.domain;

import java.util.Arrays;
import java.util.stream.Stream;

/**
 * Created by karth on 7/1/2017.
 */
public enum MaterialUOMType {
    NOS("Nos"),
    LITRE("Litre"),
    ML("Ml"),
    CUBICMETER("CubicMeter"),
    METER("Meter"),
    SQFT("SqFt"),
    KG("Kg");

    private String value;

    private MaterialUOMType(String val){
        value = val;
    }
    
    public String getValue() { 
    	return value;
    }

    public static Stream<MaterialUOMType> stream() {
        return Arrays.stream(MaterialUOMType.values()); 
    }
}
