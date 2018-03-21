package com.ts.app.web.rest.dto;

import java.util.Date;

public class WeeklyZone {
	
	private double rating;
	private Long day;
	
	private Date date;
	
	public double getRating() {
		return rating;
	}
	public void setRating(double rating) {
		this.rating = rating;
	}
	public long getDay() {
		return day;
	}
	public void setDay(Long day) {
		this.day = day;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	

}
