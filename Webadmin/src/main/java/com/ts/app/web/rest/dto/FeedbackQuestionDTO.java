package com.ts.app.web.rest.dto;


import java.io.Serializable;

public class FeedbackQuestionDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String question;

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
}
