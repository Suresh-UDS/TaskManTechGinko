package com.ts.app.web.rest.dto;

import java.io.Serializable;
import java.util.Map;

public class FeedbackQuestionRating implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;
    
    private String location;
    
    private String question;

    private Map<String, Long> rating;
    
    private long yesCount;
    
    private long noCount;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

	public Map<String, Long> getRating() {
		return rating;
	}

	public void setRating(Map<String, Long> rating) {
		this.rating = rating;
	}

	public long getYesCount() {
		return yesCount;
	}

	public void setYesCount(long yesCount) {
		this.yesCount = yesCount;
	}

	public long getNoCount() {
		return noCount;
	}

	public void setNoCount(long noCount) {
		this.noCount = noCount;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}
    
    
}
