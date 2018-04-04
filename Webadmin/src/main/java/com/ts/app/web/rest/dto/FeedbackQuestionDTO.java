package com.ts.app.web.rest.dto;


import java.io.Serializable;

import com.ts.app.domain.FeedbackAnswerType;

public class FeedbackQuestionDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String question;

    private FeedbackAnswerType answerType;

    private String scoreType;

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


}
