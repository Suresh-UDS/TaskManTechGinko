package com.ts.app.web.rest.dto;

import java.io.Serializable;


/**
 * 
 * @author gnana
 *
 */
public class ParameterConfigDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String assetType;

    private String name;

    private String uom;
    
    private boolean consumptionMonitoringRequired;
    
    private boolean validationRequired;
    
    private boolean alertRequired;
    
    private double threshold;
    
    private String rule;
    
    private int min;
    
    private int max;

    private long multiplicationFactor;

    private boolean allowTopUp;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getAssetType() {
		return assetType;
	}

	public void setAssetType(String assetType) {
		this.assetType = assetType;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUom() {
		return uom;
	}

	public void setUom(String uom) {
		this.uom = uom;
	}

	public boolean isConsumptionMonitoringRequired() {
		return consumptionMonitoringRequired;
	}

	public void setConsumptionMonitoringRequired(boolean consumptionMonitoringRequired) {
		this.consumptionMonitoringRequired = consumptionMonitoringRequired;
	}

	public boolean isValidationRequired() {
		return validationRequired;
	}

	public void setValidationRequired(boolean validationRequired) {
		this.validationRequired = validationRequired;
	}

	public boolean isAlertRequired() {
		return alertRequired;
	}

	public void setAlertRequired(boolean alertRequired) {
		this.alertRequired = alertRequired;
	}

	public double getThreshold() {
		return threshold;
	}

	public void setThreshold(double threshold) {
		this.threshold = threshold;
	}

	public String getRule() {
		return rule;
	}

	public void setRule(String rule) {
		this.rule = rule;
	}

	public int getMin() {
		return min;
	}

	public void setMin(int min) {
		this.min = min;
	}

	public int getMax() {
		return max;
	}

	public void setMax(int max) {
		this.max = max;
	}


    public long getMultiplicationFactor() {
        return multiplicationFactor;
    }

    public void setMultiplicationFactor(long multiplicationFactor) {
        this.multiplicationFactor = multiplicationFactor;
    }

    public boolean isAllowTopUp() {
        return allowTopUp;
    }

    public void setAllowTopUp(boolean allowTopUp) {
        this.allowTopUp = allowTopUp;
    }
}
