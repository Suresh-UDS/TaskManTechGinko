package com.ts.app.web.rest.dto;

import com.ts.app.domain.JobStatus;
import com.ts.app.domain.JobType;
import com.ts.app.domain.util.StringUtil;

import java.util.Date;

public class JobDTO extends BaseDTO {

	private Long id;
	private String title;
	private String description;
	private String comments;

	private String siteProjectId;
	private String siteProjectName;

	private Long siteId;
	private String siteName;

	private Long employeeId;
	private String employeeName;

	private Long locationId;
	private String locationName;

	private Long assetId;
	private String assetTitle;

	private Date plannedStartTime;
	private Date plannedEndTime;
	private int plannedHours;


	private Date actualStartTime;
	private Date actualEndTime;
	private int actualHours;


	private JobStatus jobStatus;
	private JobType jobType;

	private String schedule;
	private Date scheduleEndDate;
	private boolean scheduleDailyExcludeWeekend;

	private boolean scheduleWeeklySunday;
	private boolean scheduleWeeklyMonday;
	private boolean scheduleWeeklyTuesday;
	private boolean scheduleWeeklyWednesday;
	private boolean scheduleWeeklyThursday;
	private boolean scheduleWeeklyFriday;
	private boolean scheduleWeeklySaturday;

	private boolean scheduled;

	private String frequency;
	
	private JobChecklistDTO jobChecklistItems;

	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String desc) {
		this.description = desc;
	}
	public Date getPlannedStartTime() {
		return plannedStartTime;
	}
	public void setPlannedStartTime(Date plannedStartTime) {
		this.plannedStartTime = plannedStartTime;
	}
	public Date getPlannedEndTime() {
		return plannedEndTime;
	}
	public void setPlannedEndTime(Date plannedEndTime) {
		this.plannedEndTime = plannedEndTime;
	}
	public int getPlannedHours() {
		return plannedHours;
	}
	public void setPlannedHours(int plannedHours) {
		this.plannedHours = plannedHours;
	}

	public String getComments() {
		return comments;
	}
	public void setComments(String comments) {
		this.comments = comments;
	}

	public String getSiteName() {
		return siteName;
	}
	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}
	public Long getEmployeeId() {
		return employeeId;
	}
	public void setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
	}
	public String getEmployeeName() {
		return employeeName;
	}
	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}
	public Long getLocationId(){
	    return locationId;
    }
    public void setLocationId(Long locationId){
	    this.locationId = locationId;
    }
	public JobStatus getJobStatus() {
		return jobStatus;
	}
	public void setJobStatus(JobStatus jobStatus) {
		this.jobStatus = jobStatus;
	}
	public JobType getJobType(){ return jobType;}
	public void setJobType(JobType jobType){this.jobType = jobType;}
	public Long getSiteId() {
		return siteId;
	}
	public void setSiteId(Long siteId) {
		this.siteId = siteId;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getSiteProjectId() {
		return siteProjectId;
	}
	public void setSiteProjectId(String siteProjectId) {
		this.siteProjectId = siteProjectId;
	}
	public String getSiteProjectName() {
		return siteProjectName;
	}
	public void setSiteProjectName(String siteProjectName) {
		this.siteProjectName = siteProjectName;
	}
	public String getDesc() {
		return description;
	}
	public void setDesc(String desc) {
		this.description = desc;
	}
	public Date getActualStartTime() {
		return actualStartTime;
	}
	public void setActualStartTime(Date actualStartTime) {
		this.actualStartTime = actualStartTime;
	}
	public Date getActualEndTime() {
		return actualEndTime;
	}
	public void setActualEndTime(Date actualEndTime) {
		this.actualEndTime = actualEndTime;
	}
	public int getActualHours() {
		return actualHours;
	}
	public void setActualHours(int actualHours) {
		this.actualHours = actualHours;
	}
	public String getSchedule() {
		return schedule;
	}
	public void setSchedule(String schedule) {
		this.schedule = schedule;
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


	public Date getScheduleEndDate() {
		return scheduleEndDate;
	}
	public void setScheduleEndDate(Date scheduleEndDate) {
		this.scheduleEndDate = scheduleEndDate;
	}



	public boolean isScheduled() {
		return scheduled;
	}
	public void setScheduled(boolean scheduled) {
		this.scheduled = scheduled;
	}
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("Job Details - {" + StringUtil.SPACE);
		sb.append("Id :" + id + StringUtil.SPACE);
		sb.append("title :" + title + StringUtil.SPACE);
		sb.append("description :" + description + StringUtil.SPACE);
		sb.append("comments :" + comments + StringUtil.SPACE);
		sb.append("siteId :" + siteId + StringUtil.SPACE);
		sb.append("siteName :" + siteName + StringUtil.SPACE);
		sb.append("employeeId :" + employeeId + StringUtil.SPACE);
		sb.append("employeeName :" + employeeName + StringUtil.SPACE);
		sb.append("jobStatus :" + jobStatus + StringUtil.SPACE);
		sb.append("location :" + locationId + StringUtil.SPACE);
		sb.append("asset :" + assetId + StringUtil.SPACE);
		sb.append("active :" + getActive() + StringUtil.SPACE);
		sb.append(" } ");
		return sb.toString();
	}

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public Long getAssetId() {
        return assetId;
    }

    public void setAssetId(Long assetId) {
        this.assetId = assetId;
    }


    public String getAssetTitle() {
        return assetTitle;
    }

    public void setAssetTitle(String assetTitle) {
        this.assetTitle = assetTitle;
    }
	public String getFrequency() {
		return frequency;
	}
	public void setFrequency(String frequency) {
		this.frequency = frequency;
	}
	public JobChecklistDTO getJobChecklistItems() {
		return jobChecklistItems;
	}
	public void setJobChecklistItems(JobChecklistDTO jobChecklistItems) {
		this.jobChecklistItems = jobChecklistItems;
	}
	
	
	

}
