package com.ts.app.web.rest.dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ts.app.domain.Job;
import com.ts.app.domain.JobStatus;
import com.ts.app.domain.JobType;
import com.ts.app.domain.util.StringUtil;

public class JobDTO extends BaseDTO {

	private long id;
	private String title;
	private String description;
	private String comments;

	private String siteProjectId;
	private String siteProjectName;

	private long siteId;
	private String siteName;

	private long ticketId;
	private String ticketName;

	private long employeeId;
	private String employeeEmpId;
	private String employeeName;

	private long relieverId;
	private String relieverName;

	private boolean relieved;

	private long locationId;
	private String locationName;

	private long assetId;
	private String assetTitle;

	private Date plannedStartTime;
	private Date plannedEndTime;
	private int plannedHours;


	private Date actualStartTime;
	private Date actualEndTime;
	private int actualHours;
	private int actualMinutes;

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

	private int scheduleMonthlyDay;

	private boolean scheduled;

	private String frequency;
	private String duration;
	private List<JobChecklistDTO> checklistItems;

	private List<CheckInOutImageDTO> images;

	private long checkInOutId;

	private long parentJobId;

	private Job parentJob;

	private boolean pendingAtUDS;

	private boolean pendingAtClient;

	@JsonIgnoreProperties
	private String block;

	@JsonIgnoreProperties
	private String floor;

	@JsonIgnoreProperties
	private String zone;
	
	private String maintenanceType;
	
	private List<JobMaterialDTO> jobMaterials;

	public String getDuration() {
		return duration;
	}
	public void setDuration(String duration) {
		this.duration = duration;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
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
	public long getEmployeeId() {
		return employeeId;
	}
	public void setEmployeeId(long employeeId) {
		this.employeeId = employeeId;
	}
	public String getEmployeeName() {
		return employeeName;
	}
	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}
	public long getLocationId(){
	    return locationId;
    }
    public void setLocationId(long locationId){
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
	public long getSiteId() {
		return siteId;
	}
	public void setSiteId(long siteId) {
		this.siteId = siteId;
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
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

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public long getAssetId() {
        return assetId;
    }

    public void setAssetId(long assetId) {
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
	public List<JobChecklistDTO> getChecklistItems() {
		return checklistItems;
	}
	public void setChecklistItems(List<JobChecklistDTO> checklistItems) {
		this.checklistItems = checklistItems;
	}


    public long getRelieverId() {
        return relieverId;
    }

    public void setRelieverId(long relieverId) {
        this.relieverId = relieverId;
    }

    public String getRelieverName() {
        return relieverName;
    }

    public void setRelieverName(String relieverName) {
        this.relieverName = relieverName;
    }

    public boolean isRelieved() {
        return relieved;
    }

    public void setRelieved(boolean relieved) {
        this.relieved = relieved;
    }
	public int getScheduleMonthlyDay() {
		return scheduleMonthlyDay;
	}
	public void setScheduleMonthlyDay(int scheduleMonthlyDay) {
		this.scheduleMonthlyDay = scheduleMonthlyDay;
	}
	public String getEmployeeEmpId() {
		return employeeEmpId;
	}
	public void setEmployeeEmpId(String employeeEmpId) {
		this.employeeEmpId = employeeEmpId;
	}
	public List<CheckInOutImageDTO> getImages() {
		return images;
	}
	public void setImages(List<CheckInOutImageDTO> images) {
		this.images = images;
	}
	public String getBlock() {
		return block;
	}
	public void setBlock(String block) {
		this.block = block;
	}
	public String getFloor() {
		return floor;
	}
	public void setFloor(String floor) {
		this.floor = floor;
	}
	public String getZone() {
		return zone;
	}
	public void setZone(String zone) {
		this.zone = zone;
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
		sb.append("relieverId:"+relieverId+StringUtil.SPACE);
		sb.append("relieverName:"+relieverName+StringUtil.SPACE);
		sb.append("asset :" + assetId + StringUtil.SPACE);
		sb.append("active :" + getActive() + StringUtil.SPACE);
		sb.append("relieved:"+relieved+ StringUtil.SPACE);
		sb.append(" } ");
		return sb.toString();
	}

    public long getTicketId() {
        return ticketId;
    }

    public void setTicketId(long ticketId) {
        this.ticketId = ticketId;
    }

    public String getTicketName() {
        return ticketName;
    }

    public void setTicketName(String ticketName) {
        this.ticketName = ticketName;
    }
	public int getActualMinutes() {
		return actualMinutes;
	}
	public void setActualMinutes(int actualMinutes) {
		this.actualMinutes = actualMinutes;
	}


    public long getCheckInOutId() {
        return checkInOutId;
    }

    public void setCheckInOutId(long checkInOutId) {
        this.checkInOutId = checkInOutId;
    }
	
    public String getMaintenanceType() {
		return maintenanceType;
	}

	public void setMaintenanceType(String maintenanceType) {
		this.maintenanceType = maintenanceType;
	}
	
    public long getParentJobId() {
        return parentJobId;
    }

    public void setParentJobId(long parentJobId) {
        this.parentJobId = parentJobId;
    }

    public Job getParentJob() {
        return parentJob;
    }

    public void setParentJob(Job parentJob) {
        this.parentJob = parentJob;
    }

    public boolean isPendingAtUDS() {
        return pendingAtUDS;
    }

    public void setPendingAtUDS(boolean pendingAtUDS) {
        this.pendingAtUDS = pendingAtUDS;
    }

    public boolean isPendingAtClient() {
        return pendingAtClient;
    }

    public void setPendingAtClient(boolean pendingAtClient) {
        this.pendingAtClient = pendingAtClient;
    }
	public List<JobMaterialDTO> getJobMaterials() {
		return jobMaterials;
	}
	public void setJobMaterials(List<JobMaterialDTO> jobMaterials) {
		this.jobMaterials = jobMaterials;
	}
}
