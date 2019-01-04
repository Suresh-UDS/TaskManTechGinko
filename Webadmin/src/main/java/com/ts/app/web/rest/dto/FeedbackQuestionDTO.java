package com.ts.app.web.rest.dto;


import com.ts.app.domain.FeedbackAnswerType;

import java.io.Serializable;

public class FeedbackQuestionDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String question;

    private FeedbackAnswerType answerType;

    private boolean remarksRequired;

    private String scoreType;

    private String image;

    private String remarks;

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

	public FeedbackAnswerType getAnswerType() {
		return answerType;
	}

	public void setAnswerType(FeedbackAnswerType answerType) {
		this.answerType = answerType;
	}

	public String getScoreType() {
		return scoreType;
	}

	public void setScoreType(String scoreType) {
		this.scoreType = scoreType;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}


    public boolean isRemarksRequired() {
        return remarksRequired;
    }

    public void setRemarksRequired(boolean remarksRequired) {
        this.remarksRequired = remarksRequired;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
