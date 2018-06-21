package com.ts.app.web.rest.dto;

import java.util.Date;

public class AssetPpmScheduleDTO extends BaseDTO {
    private long id;
	private String title;
	private long checklistId;
	private String checklistName;
	private Date startDate;
	private Date endDate;
	private String frequencyPrefix;
	private int frequencyDuration;
	private String frequency;
	private long assetId;
	private long empId;
	private String maintenanceType;

	public String getMaintenanceType() {
		return maintenanceType;
	}
	public void setMaintenanceType(String maintenanceType) {
		this.maintenanceType = maintenanceType;
	}
	public long getEmpId() {
		return empId;
	}
	public void setEmpId(long empId) {
		this.empId = empId;
	}
	public String getChecklistName() {
		return checklistName;
	}
	public void setChecklistName(String checklistName) {
		this.checklistName = checklistName;
	}
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
	public long getChecklistId() {
		return checklistId;
	}
	public void setChecklistId(long checklistId) {
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
	public long getAssetId() {
		return assetId;
	}
	public void setAssetId(long assetId) {
		this.assetId = assetId;
	}
	
}
