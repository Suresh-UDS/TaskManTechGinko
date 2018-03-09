package com.ts.app.web.rest.dto;

import java.io.Serializable;

public class FeedbackQuestionRating implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String question;

    private float rating;
    
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

	public float getRating() {
		return rating;
	}

	public void setRating(float rating) {
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
    
    
}
