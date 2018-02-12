package com.ts.app.domain;

/**
 * Created by karth on 7/1/2017.
 */
public enum UOMType {
    PER_HOUR("PerHour"),
    PER_QTY("PerQty"),
    FIXED("Fixed");

    private String value;

    private UOMType(String val){
        value = val;
    }
}
