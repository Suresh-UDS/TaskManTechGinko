package com.ts.app.domain;

/**
 * 
 * @author gnana
 *
 */
public enum FeedbackAnswerType {
    YESNO("YesNo"),
    RATING("Rating");

    private String value;

    private FeedbackAnswerType(String val){
        value = val;
    }
}
