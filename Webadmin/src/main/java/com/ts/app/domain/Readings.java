package com.ts.app.domain;

import java.util.Date;

public class Readings {
    private String date;
    private double value;
    private double openingValue;
    private double closingValue;

    public Readings() {}
    
    public Readings(String date, double value) {
        this.date = date;
        this.value = value;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

	public double getOpeningValue() {
		return openingValue;
	}

	public void setOpeningValue(double openingValue) {
		this.openingValue = openingValue;
	}

	public double getClosingValue() {
		return closingValue;
	}

	public void setClosingValue(double closingValue) {
		this.closingValue = closingValue;
	}
    
}
