package com.ts.app.web.rest.dto;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

public class AssetAMCScheduleDTO extends BaseDTO {

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
	
	private String employeeName;
	
	private String maintenanceType;
	
	private ZonedDateTime jobStartTime;
	private ZonedDateTime jobEndTime;
	private int plannedHours;

	private String[] shiftTimings;
	
	private List<ChecklistItemDTO> checkListItems;
	
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

	public long getChecklistId() {
		return checklistId;
	}

	public void setChecklistId(long checklistId) {
		this.checklistId = checklistId;
	}

	public String getChecklistName() {
		return checklistName;
	}

	public void setChecklistName(String checklistName) {
		this.checklistName = checklistName;
	}

	public long getEmpId() {
		return empId;
	}

	public void setEmpId(long empId) {
		this.empId = empId;
	}

	public String getMaintenanceType() {
		return maintenanceType;
	}

	public void setMaintenanceType(String maintenanceType) {
		this.maintenanceType = maintenanceType;
	}

	public ZonedDateTime getJobStartTime() {
		return jobStartTime;
	}

	public void setJobStartTime(ZonedDateTime jobStartTime) {
		this.jobStartTime = jobStartTime;
	}

	public ZonedDateTime getJobEndTime() {
		return jobEndTime;
	}

	public void setJobEndTime(ZonedDateTime jobEndTime) {
		this.jobEndTime = jobEndTime;
	}

	public int getPlannedHours() {
		return plannedHours;
	}

	public void setPlannedHours(int plannedHours) {
		this.plannedHours = plannedHours;
	}

	public String[] getShiftTimings() {
		return shiftTimings;
	}

	public void setShiftTimings(String[] shiftTimings) {
		this.shiftTimings = shiftTimings;
	}

	public List<ChecklistItemDTO> getCheckListItems() {
		return checkListItems;
	}

	public void setCheckListItems(List<ChecklistItemDTO> checkListItems) {
		this.checkListItems = checkListItems;
	}

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}
	
	
}
