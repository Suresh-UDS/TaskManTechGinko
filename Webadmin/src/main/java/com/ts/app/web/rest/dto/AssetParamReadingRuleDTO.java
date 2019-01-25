package com.ts.app.web.rest.dto;


import java.io.Serializable;


public class AssetParamReadingRuleDTO extends BaseDTO implements Serializable {
	
	private static final long serialVersionUID = 1;
	
	private long id;

	private long assetId;
	
	private long assetParameterConfigId;
	
	private String rule;
	
	private boolean alertRequired;
	
	private boolean validationRequired;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getAssetId() {
		return assetId;
	}

	public void setAssetId(long assetId) {
		this.assetId = assetId;
	}

	public long getAssetParameterConfigId() {
		return assetParameterConfigId;
	}

	public void setAssetParameterConfigId(long assetParameterConfigId) {
		this.assetParameterConfigId = assetParameterConfigId;
	}

	public String getRule() {
		return rule;
	}

	public void setRule(String rule) {
		this.rule = rule;
	}

	public boolean isAlertRequired() {
		return alertRequired;
	}

	public void setAlertRequired(boolean alertRequired) {
		this.alertRequired = alertRequired;
	}

	public boolean isValidationRequired() {
		return validationRequired;
	}

	public void setValidationRequired(boolean validationRequired) {
		this.validationRequired = validationRequired;
	}
	
	

}

