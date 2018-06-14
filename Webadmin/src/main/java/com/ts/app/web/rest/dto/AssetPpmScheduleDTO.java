package com.ts.app.web.rest.dto;

import java.sql.Date;

public class AssetPpmScheduleDTO extends BaseDTO {
	private Long id;
	private String title;
	private Long checklistId;
	private String checklistName;
	private Date startDate;
	private Date endDate;
	private String frequencyPrefix;
	private int frequencyDuration;
	private String frequency;
	private Long assetId;
	
	public String getChecklistName() {
		return checklistName;
	}
	public void setChecklistName(String checklistName) {
		this.checklistName = checklistName;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public Long getChecklistId() {
		return checklistId;
	}
	public void setChecklistId(Long checklistId) {
		this.checklistId = checklistId;
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
	public Long getAssetId() {
		return assetId;
	}
	public void setAssetId(Long assetId) {
		this.assetId = assetId;
	}
	
}
