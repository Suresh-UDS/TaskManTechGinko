package com.ts.app.web.rest.dto;

import java.io.Serializable;
import java.util.List;


public class FeedbackTransactionDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String name;

    private String reviewerName;

    private String reviewerCode;

    private long siteId;

    private String siteName;

    private long projectId;

    private String projectName;

    private long feedbackId;

    private String feedbackName;

    private List<FeedbackTransactionResultDTO> results;

    private String block;

    private String floor;

    private String zone;

    private float rating;

    private String remarks;
    
    private boolean overallFeedback;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

	public String getReviewerName() {
		return reviewerName;
	}

	public void setReviewerName(String reviewerName) {
		this.reviewerName = reviewerName;
	}

	public long getSiteId() {
		return siteId;
	}

	public void setSiteId(long siteId) {
		this.siteId = siteId;
	}

	public String getSiteName() {
		return siteName;
	}

	public void setSiteName(String siteName) {
		this.siteName = siteName;
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

	public float getRating() {
		return rating;
	}

	public void setRating(float rating) {
		this.rating = rating;
	}

	public long getFeedbackId() {
		return feedbackId;
	}

	public void setFeedbackId(long feedbackId) {
		this.feedbackId = feedbackId;
	}

	public String getFeedbackName() {
		return feedbackName;
	}

	public void setFeedbackName(String feedbackName) {
		this.feedbackName = feedbackName;
	}

	public List<FeedbackTransactionResultDTO> getResults() {
		return results;
	}

	public void setResults(List<FeedbackTransactionResultDTO> results) {
		this.results = results;
	}


    public String getReviewerCode() {
        return reviewerCode;
    }

    public void setReviewerCode(String reviewerCode) {
        this.reviewerCode = reviewerCode;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

	public boolean isOverallFeedback() {
		return overallFeedback;
	}

	public void setOverallFeedback(boolean overallFeedback) {
		this.overallFeedback = overallFeedback;
	}
	
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("id ="+ id);
		sb.append(", site id ="+ siteId);
		sb.append(", site name ="+ siteName);
		sb.append(", block ="+ block);
		sb.append(", floor ="+ floor);
		sb.append(", zone ="+ zone);
		return sb.toString();
	}
    
}
