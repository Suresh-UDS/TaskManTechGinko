package com.ts.app.web.rest.dto;

import java.io.Serializable;

public class FeedbackTransactionResultDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String question;

    private Boolean answer;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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
