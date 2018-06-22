package com.ts.app.web.rest.dto;

import java.io.Serializable;
import java.sql.Timestamp;


public class AssetParameterReadingDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String name;

    private String uom;
    
    private double initialValue;

    private double finalValue;

    private double consumption;

    private double value;
    
	private long assetId;
	
	private String assetName;
	
	private long jobId;
	
	private long assetParameterConfigId;
	
	private boolean consumptionMonitoringRequired;
	
	private Timestamp initialReadingTime;
	
	private Timestamp finalReadingTime;
	
	private int runHours;
	
	private int runMinutes;
	
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

	public String getUom() {
		return uom;
	}

	public void setUom(String uom) {
		this.uom = uom;
	}

	public double getInitialValue() {
		return initialValue;
	}

	public void setInitialValue(double initialValue) {
		this.initialValue = initialValue;
	}

	public double getFinalValue() {
		return finalValue;
	}

	public void setFinalValue(double finalValue) {
		this.finalValue = finalValue;
	}

	public double getConsumption() {
		return consumption;
	}

	public void setConsumption(double consumption) {
		this.consumption = consumption;
	}

	public double getValue() {
		return value;
	}

	public void setValue(double value) {
		this.value = value;
	}

	public long getAssetId() {
		return assetId;
	}

	public void setAssetId(long assetId) {
		this.assetId = assetId;
	}

	public String getAssetName() {
		return assetName;
	}

	public void setAssetName(String assetName) {
		this.assetName = assetName;
	}

	public long getJobId() {
		return jobId;
	}

	public void setJobId(long jobId) {
		this.jobId = jobId;
	}

	public long getAssetParameterConfigId() {
		return assetParameterConfigId;
	}

	public void setAssetParameterConfigId(long assetParameterConfigId) {
		this.assetParameterConfigId = assetParameterConfigId;
	}

	public boolean isConsumptionMonitoringRequired() {
		return consumptionMonitoringRequired;
	}

	public void setConsumptionMonitoringRequired(boolean consumptionMonitoringRequired) {
		this.consumptionMonitoringRequired = consumptionMonitoringRequired;
	}

	public Timestamp getInitialReadingTime() {
		return initialReadingTime;
	}

	public void setInitialReadingTime(Timestamp initialReadingTime) {
		this.initialReadingTime = initialReadingTime;
	}

	public Timestamp getFinalReadingTime() {
		return finalReadingTime;
	}

	public void setFinalReadingTime(Timestamp finalReadingTime) {
		this.finalReadingTime = finalReadingTime;
	}

	public int getRunHours() {
		return runHours;
	}

	public void setRunHours(int runHours) {
		this.runHours = runHours;
	}

	public int getRunMinutes() {
		return runMinutes;
	}

	public void setRunMinutes(int runMinutes) {
		this.runMinutes = runMinutes;
	}

	
    
}
