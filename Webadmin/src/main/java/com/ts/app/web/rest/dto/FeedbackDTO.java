package com.ts.app.web.rest.dto;

import java.io.Serializable;
import java.util.List;
import java.util.Set;


public class FeedbackDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String name;

    private List<FeedbackQuestionDTO> questions;

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

	public List<FeedbackQuestionDTO> getQuestions() {
		return questions;
	}

	public void setQuestions(List<FeedbackQuestionDTO> questions) {
		this.questions = questions;
	}

}
