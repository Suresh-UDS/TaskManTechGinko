package com.ts.app.domain;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.ts.app.domain.util.StringUtil;

@Entity
@Table(name = "job")
public class Job extends AbstractAuditingEntity implements Serializable{

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Size(min = 1, max = 250)
    @Column(length = 250, nullable = false)
    private String title;

    @NotNull
    @Size(min = 1, max = 2500)
    private String description;


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "siteId", nullable = false)
	private Site site;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employeeId", nullable = false)
	private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "relieverId", nullable = true)
    private Employee reliever;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locationId")
    private Location location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assetId", nullable = true)
    private Asset asset;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticketId")
    private Ticket ticket;

	private String comments;
	private JobStatus status;
	
	private int escalationStatus;
	
	private JobType type;

	private boolean relieved;

	@NotNull
    private Date plannedStartTime;
	@NotNull
    private Date plannedEndTime;
	@NotNull
    private int plannedHours;

	private Date actualStartTime;
	private Date actualEndTime;
	private int actualHours;
	private int actualMinutes;

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

	private boolean overDueEmailAlert;

	private int overdueAlertCount;

	private boolean completedDueEmailAlert;

	private String frequency;
	private String duration;

	private boolean pendingAtUDS;

	private boolean pendingAtClient;

    @OneToMany(mappedBy ="job", cascade = {CascadeType.ALL}, fetch = FetchType.LAZY, orphanRemoval = true)
	private List<JobChecklist> checklistItems;

    @ManyToOne(cascade={CascadeType.ALL}, fetch = FetchType.LAZY)
	@JoinColumn(name="parent_job_id")
    private Job parentJob;

    private String block;

    private String floor;

    private String zone;
    
    private String maintenanceType;
    
    @OneToMany(mappedBy="job", cascade = {CascadeType.ALL}, fetch = FetchType.LAZY, orphanRemoval = true)
    private Set<JobMaterial> jobMaterials;

	public String getDuration() {
		return duration;
	}
	public void setDuration(String duration) {
		this.duration = duration;
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

	public Site getSite() {
		return site;
	}
	public void setSite(Site site) {
		this.site = site;
	}
	public Employee getEmployee() {
		return employee;
	}
	public void setEmployee(Employee employee) {
		this.employee = employee;
	}
	public Location getLocation(){
	    return location;
    }
    public void setLocation(Location location){
	    this.location = location;
    }
	public String getComments() {
		return comments;
	}
	public void setComments(String comments) {
		this.comments = comments;
	}
	public JobStatus getStatus() {
		return status;
	}
	public void setStatus(JobStatus status) {
		this.status = status;
	}

	public JobType getType(){return type;}
	public void setType(JobType type){ this.type = type;}

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
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
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

	public boolean isOverDueEmailAlert() {
		return overDueEmailAlert;
	}
	public void setOverDueEmailAlert(boolean overDueEmailAlert) {
		this.overDueEmailAlert = overDueEmailAlert;
	}
	public boolean isCompletedDueEmailAlert() {
		return completedDueEmailAlert;
	}
	public void setCompletedDueEmailAlert(boolean completedDueEmailAlert) {
		this.completedDueEmailAlert = completedDueEmailAlert;
	}

    public Asset getAsset() {
        return asset;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
    }
	public String getFrequency() {
		return frequency;
	}
	public void setFrequency(String frequency) {
		this.frequency = frequency;
	}
	public List<JobChecklist> getChecklistItems() {
		return checklistItems;
	}
	public void setChecklistItems(List<JobChecklist> checklistItems) {
		this.checklistItems = checklistItems;
	}
	public Job getParentJob() {
		return parentJob;
	}
	public void setParentJob(Job parentJob) {
		this.parentJob = parentJob;
	}

    public Employee getReliever() {
        return reliever;
    }

    public void setReliever(Employee reliever) {
        this.reliever = reliever;
    }

    public boolean isRelieved() {
        return relieved;
    }

    public void setRelieved(boolean relieved) {
        this.relieved = relieved;
    }
	public int getOverdueAlertCount() {
		return overdueAlertCount;
	}
	public void setOverdueAlertCount(int overdueAlertCount) {
		this.overdueAlertCount = overdueAlertCount;
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
		sb.append("planned start time :" + plannedStartTime + StringUtil.SPACE);
		sb.append("comments :" + comments + StringUtil.SPACE);
		//sb.append("siteId :" + site.getId() + StringUtil.SPACE);
		//sb.append("siteName :" + site.getName() + StringUtil.SPACE);
		//sb.append("employeeId :" + employee.getId() + StringUtil.SPACE);
		//sb.append("employeeName :" + employee.getName() + StringUtil.SPACE);
		sb.append("jobStatus :" + status + StringUtil.SPACE);
		sb.append("active :" + getActive() + StringUtil.SPACE);
		sb.append(" } ");
		return sb.toString();
	}

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }
	public int getActualMinutes() {
		return actualMinutes;
	}
	public void setActualMinutes(int actualMinutes) {
		this.actualMinutes = actualMinutes;
	}

	public String getMaintenanceType() {
		return maintenanceType;
	}
	public void setMaintenanceType(String maintenanceType) {
		this.maintenanceType = maintenanceType;
	}
    
    public boolean isPendingAtClient() {
        return pendingAtClient;
    }

    public void setPendingAtClient(boolean pendingAtClient) {
        this.pendingAtClient = pendingAtClient;
    }

    public boolean isPendingAtUDS() {
        return pendingAtUDS;
    }

    public void setPendingAtUDS(boolean pendingAtUDS) {
        this.pendingAtUDS = pendingAtUDS;
    }
    
	public int getEscalationStatus() {
		return escalationStatus;
	}
	public void setEscalationStatus(int escalationStatus) {
		this.escalationStatus = escalationStatus;
	}
	public Set<JobMaterial> getJobMaterials() {
		return jobMaterials;
	}
	public void setJobMaterials(Set<JobMaterial> jobMaterials) {
		this.jobMaterials = jobMaterials;
	}
	
    
}
