package com.ts.app.domain;

/**
 * Created by karth on 7/1/2017.
 */
public enum RateType {
    SERVICE("Service"),
    MATERIAL("Material"),
    LABOUR("Labour");

    private String value;

    private RateType(String val){
        value = val;
    }
}
