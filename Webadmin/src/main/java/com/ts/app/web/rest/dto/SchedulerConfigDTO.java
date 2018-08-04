package com.ts.app.web.rest.dto;

import java.util.Date;

public class SchedulerConfigDTO extends BaseDTO {
	private Long id;

	private String schedule; // DAILY,WEEKLY etc

	private String type; // Type of schedule processor

	private String data;

	private Date startDate;

	private Date endDate;

	private Date lastRun;
	
	private long jobId;
	
	private Date scheduleEndDate;
	private boolean scheduleDailyExcludeWeekend;
	
	private boolean scheduleWeeklySunday;
	private boolean scheduleWeeklyMonday;
	private boolean scheduleWeeklyTuesday;
	private boolean scheduleWeeklyWednesday;
	private boolean scheduleWeeklyThursday;
	private boolean scheduleWeeklyFriday;
	private boolean scheduleWeeklySaturday;
	
	private int scheduleMonthlyDay;
	
	private long assetId;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSchedule() {
		return schedule;
	}

	public void setSchedule(String schedule) {
		this.schedule = schedule;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
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

	public Date getLastRun() {
		return lastRun;
	}

	public void setLastRun(Date lastRun) {
		this.lastRun = lastRun;
	}

	public long getJobId() {
		return jobId;
	}

	public void setJobId(long jobId) {
		this.jobId = jobId;
	}

	public Date getScheduleEndDate() {
		return scheduleEndDate;
	}

	public void setScheduleEndDate(Date scheduleEndDate) {
		this.scheduleEndDate = scheduleEndDate;
	}

	public boolean isScheduleDailyExcludeWeekend() {
		return scheduleDailyExcludeWeekend;
	}

	public void setScheduleDailyExcludeWeekend(boolean scheduleDailyExcludeWeekend) {
		this.scheduleDailyExcludeWeekend = scheduleDailyExcludeWeekend;
	}

	public boolean isScheduleWeeklySunday() {
		return scheduleWeeklySunday;
	}

	public void setScheduleWeeklySunday(boolean scheduleWeeklySunday) {
		this.scheduleWeeklySunday = scheduleWeeklySunday;
	}

	public boolean isScheduleWeeklyMonday() {
		return scheduleWeeklyMonday;
	}

	public void setScheduleWeeklyMonday(boolean scheduleWeeklyMonday) {
		this.scheduleWeeklyMonday = scheduleWeeklyMonday;
	}

	public boolean isScheduleWeeklyTuesday() {
		return scheduleWeeklyTuesday;
	}

	public void setScheduleWeeklyTuesday(boolean scheduleWeeklyTuesday) {
		this.scheduleWeeklyTuesday = scheduleWeeklyTuesday;
	}

	public boolean isScheduleWeeklyWednesday() {
		return scheduleWeeklyWednesday;
	}

	public void setScheduleWeeklyWednesday(boolean scheduleWeeklyWednesday) {
		this.scheduleWeeklyWednesday = scheduleWeeklyWednesday;
	}

	public boolean isScheduleWeeklyThursday() {
		return scheduleWeeklyThursday;
	}

	public void setScheduleWeeklyThursday(boolean scheduleWeeklyThursday) {
		this.scheduleWeeklyThursday = scheduleWeeklyThursday;
	}

	public boolean isScheduleWeeklyFriday() {
		return scheduleWeeklyFriday;
	}

	public void setScheduleWeeklyFriday(boolean scheduleWeeklyFriday) {
		this.scheduleWeeklyFriday = scheduleWeeklyFriday;
	}

	public boolean isScheduleWeeklySaturday() {
		return scheduleWeeklySaturday;
	}

	public void setScheduleWeeklySaturday(boolean scheduleWeeklySaturday) {
		this.scheduleWeeklySaturday = scheduleWeeklySaturday;
	}

	public int getScheduleMonthlyDay() {
		return scheduleMonthlyDay;
	}

	public void setScheduleMonthlyDay(int scheduleMonthlyDay) {
		this.scheduleMonthlyDay = scheduleMonthlyDay;
	}

	public long getAssetId() {
		return assetId;
	}

	public void setAssetId(long assetId) {
		this.assetId = assetId;
	}
	
	
}
