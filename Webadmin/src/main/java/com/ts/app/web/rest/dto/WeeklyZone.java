package com.ts.app.web.rest.dto;

import java.util.Date;

public class WeeklyZone {
	
	private double rating;
	private long day;
	
	private String date;
	
	public double getRating() {
		return rating;
	}
	public void setRating(double rating) {
		this.rating = rating;
	}
	public long getDay() {
		return day;
	}
	public void setDay(long day) {
		this.day = day;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	

}
