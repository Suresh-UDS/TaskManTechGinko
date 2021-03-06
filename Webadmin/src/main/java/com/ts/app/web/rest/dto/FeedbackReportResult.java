package com.ts.app.web.rest.dto;

import java.io.Serializable;
import java.util.List;

public class FeedbackReportResult implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	long projectId;
	
	String projectName;
	
	long siteId;

	String siteName;
	
	String block;
	
	String floor;
	
	String zone;
	
	String feedbackName;
	
	long feedbackCount;
	
	String overallRating;
	
	List<FeedbackQuestionRating> questionRatings;
	
	List<WeeklyZone> weeklyZone;
	
	List<WeeklySite> weeklySite;
	

	public String getSiteName() {
		return siteName;
	}

	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}

	public long getSiteId() {
		return siteId;
	}

	public void setSiteId(long siteId) {
		this.siteId = siteId;
	}

	public long getProjectId() {
		return projectId;
	}

	public void setProjectId(long projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getBlock() {
		return block;
	}

	public void setBlock(String block) {
		this.block = block;
	}

	public String getFloor() {
		return floor;
	}

	public void setFloor(String floor) {
		this.floor = floor;
	}

	public String getZone() {
		return zone;
	}

	public void setZone(String zone) {
		this.zone = zone;
	}

	public String getFeedbackName() {
		return feedbackName;
	}

	public void setFeedbackName(String feedbackName) {
		this.feedbackName = feedbackName;
	}

	public String getOverallRating() {
		return overallRating;
	}

	public void setOverallRating(String overallRating) {
		this.overallRating = overallRating;
	}

	public List<FeedbackQuestionRating> getQuestionRatings() {
		return questionRatings;
	}

	public void setQuestionRatings(List<FeedbackQuestionRating> questionRatings) {
		this.questionRatings = questionRatings;
	}

	public long getFeedbackCount() {
		return feedbackCount;
	}

	public void setFeedbackCount(long feedbackCount) {
		this.feedbackCount = feedbackCount;
	}
	
	public List<WeeklyZone> getWeeklyZone() {
		return weeklyZone;
	}

	public void setWeeklyZone(List<WeeklyZone> weeklyZone) {
		this.weeklyZone = weeklyZone;
	}

	public List<WeeklySite> getWeeklySite() {
		return weeklySite;
	}

	public void setWeeklySite(List<WeeklySite> weeklySite) {
		this.weeklySite = weeklySite;
	}

    
}
