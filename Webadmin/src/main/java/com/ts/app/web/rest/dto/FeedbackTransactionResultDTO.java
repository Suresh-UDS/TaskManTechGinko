package com.ts.app.web.rest.dto;

import java.io.Serializable;

public class FeedbackTransactionResultDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String question;

    private Boolean answer;

    private FeedbackTransactionDTO feedbackTransaction;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public FeedbackTransactionDTO getFeedbackTransaction() {
		return feedbackTransaction;
	}

	public void setFeedbackTransaction(FeedbackTransactionDTO feedbackTransaction) {
		this.feedbackTransaction = feedbackTransaction;
	}

	public Boolean getAnswer() {
        return answer;
    }

    public void setAnswer(Boolean answer) {
        this.answer = answer;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}
