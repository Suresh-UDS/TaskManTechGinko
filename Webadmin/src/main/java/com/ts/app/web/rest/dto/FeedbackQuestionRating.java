package com.ts.app.web.rest.dto;

import java.io.Serializable;

public class FeedbackQuestionRating implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String question;

    private float rating;
    
    private int yesCount;
    
    private int noCount;

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

	public int getYesCount() {
		return yesCount;
	}

	public void setYesCount(int yesCount) {
		this.yesCount = yesCount;
	}

	public int getNoCount() {
		return noCount;
	}

	public void setNoCount(int noCount) {
		this.noCount = noCount;
	}
    
    
}
