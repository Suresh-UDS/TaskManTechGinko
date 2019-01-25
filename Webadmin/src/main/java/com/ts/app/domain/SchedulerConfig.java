package com.ts.app.domain;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "scheduler_config")
@Cacheable(true)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SchedulerConfig extends AbstractAuditingEntity implements
		Serializable {

	/*
	 *
	 * INSERT INTO `scheduler_config` (`id`, `active`, `created_by`, `created_date`, `last_modified_by`, `last_modified_date`, `data`, `end_date`, `last_run`, `schedule`, `start_date`, `type`)
		VALUES
	(2, NULL, '1', '2017-02-01 00:00:00', 'system', '2017-03-13 22:49:42', 'title=Scheduled Job Title&description=Scheduled Job Description&siteId=4&empId=3', NULL, '2017-03-13 22:49:42', 'DAILY', NULL, 'CREATE_JOB');

	 */
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@NotNull
	private String schedule; // DAILY,WEEKLY etc

	@NotNull
	private String type; // Type of schedule processor

	@NotNull
	@Size(min = 1, max = 2000)
	@Column(length = 2000, nullable = false)
	private String data;

	private Date startDate;

	private Date endDate;

	private Date lastRun;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "jobId", nullable = true)
	private Job job;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assetId", nullable = true)
    private Asset asset;

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

	public Job getJob() {
		return job;
	}

	public void setJob(Job job) {
		this.job = job;
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


    public Asset getAsset() {
        return asset;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
    }

	public int getScheduleMonthlyDay() {
		return scheduleMonthlyDay;
	}

	public void setScheduleMonthlyDay(int scheduleMonthlyDay) {
		this.scheduleMonthlyDay = scheduleMonthlyDay;
	}
    
}
