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
    
    public static FeedbackAnswerType fromValue(String val) {
    		switch(val) {
    			case "YesNo" :
    				return FeedbackAnswerType.YESNO;
    			case "Rating" :
    				return FeedbackAnswerType.RATING;
    			default :
    				return FeedbackAnswerType.YESNO;
    		}
    }
}
