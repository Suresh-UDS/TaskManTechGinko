package com.ts.app.domain;

public enum AssetReadingRule {
	CURRENT_READING_GREATER_THAN_PREVIOUS_READING("CURRENT_READING_GREATER_THAN_PREVIOUS_READING"),
	CURRENT_CONSUMPTION_GREATER_THAN_PREVIOUS_CONSUMPTION("CURRENT_CONSUMPTION_GREATER_THAN_PREVIOUS_CONSUMPTION"),
	CURRENT_RUNHOUR_GREATER_THAN_PREVIOUS_RUNHOUR("CURRENT_RUNHOUR_GREATER_THAN_PREVIOUS_RUNHOUR");
	
	private String rule;
	 
    private AssetReadingRule(String rule) {
        this.rule = rule;
    }
    
    public String getRule() {
		return rule;
	}
}
