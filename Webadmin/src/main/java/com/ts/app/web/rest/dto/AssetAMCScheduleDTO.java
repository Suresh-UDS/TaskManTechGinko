package com.ts.app.web.rest.dto;

import java.sql.Date;

public class AssetAMCScheduleDTO extends BaseDTO {

    private long id;
	
	private String title;
	
	private ChecklistDTO checklistDto;
	
	private Date startDate;
	
	private Date endDate;
	
	private String frequencyPrefix;
	
	private int frequencyDuration;
	
	private String frequency;
	
	private long assetId;
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public ChecklistDTO getChecklistDto() {
		return checklistDto;
	}

	public void setChecklistDto(ChecklistDTO checklistDto) {
		this.checklistDto = checklistDto;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public String getFrequencyPrefix() {
		return frequencyPrefix;
	}

	public void setFrequencyPrefix(String frequencyPrefix) {
		this.frequencyPrefix = frequencyPrefix;
	}

	public int getFrequencyDuration() {
		return frequencyDuration;
	}

	public void setFrequencyDuration(int frequencyDuration) {
		this.frequencyDuration = frequencyDuration;
	}

	public String getFrequency() {
		return frequency;
	}

	public void setFrequency(String frequency) {
		this.frequency = frequency;
	}

	public long getAssetId() {
		return assetId;
	}

	public void setAssetId(long assetId) {
		this.assetId = assetId;
	}
	
	

}
