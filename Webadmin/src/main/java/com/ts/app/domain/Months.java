package com.ts.app.domain;

public enum Months {

    JAN(1),FEB(2),MAR(3),APR(4),MAY(5),JUN(6),JUL(7),AUG(8),SEP(9),OCT(10),NOV(11),DEC(12);

    private int months;
    private Months(int months){
        this.months=months;
    }

    public int getMonths(){
        return months;
    }
}
