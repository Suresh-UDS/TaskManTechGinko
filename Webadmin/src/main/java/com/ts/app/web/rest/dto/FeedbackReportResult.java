package com.ts.app.web.rest.dto;

import java.io.Serializable;
import java.util.List;

public class FeedbackReportResult implements Serializable {

	long projectId;
	
	String projectName;
	
	long siteId;

	String siteName;
	
	String block;
	
	String floor;
	
	String zone;
	
	String feedbackName;
	
	long feedbackCount;
	
	float overallRating;
	
	List<FeedbackQuestionRating> questionRatings;
	

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

	public float getOverallRating() {
		return overallRating;
	}

	public void setOverallRating(float overallRating) {
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
	
	
    
}
