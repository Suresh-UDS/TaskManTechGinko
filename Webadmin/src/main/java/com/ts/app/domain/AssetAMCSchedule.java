package com.ts.app.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.sql.Date;
import java.time.ZonedDateTime;

@Entity
@Table(name = "asset_amc_schedule")
//@Cacheable(true)
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AssetAMCSchedule extends AbstractAuditingEntity {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
	
    @NotNull
    @Size(min = 1, max = 250)
    @Column(length = 250, nullable = false)
	private String title;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "checklistId", referencedColumnName = "id", nullable = true)
	private Checklist checklist;
	
    @NotNull
	private Date startDate;

    @NotNull
	private Date endDate;
	
    @NotNull
    @Size(min = 1, max = 100)
    @Column(length = 100, nullable = false)
	private String frequencyPrefix;
	
    @NotNull
	private int frequencyDuration;
	
    @NotNull
    @Size(min = 1, max = 100)
    @Column(length = 100, nullable = false)
	private String frequency;
	
	@ManyToOne(fetch = FetchType.LAZY, cascade={CascadeType.ALL})
	@JoinColumn(name = "assetId", referencedColumnName = "id", nullable = true)
	private Asset asset;
	
	private String maintenanceType;

	private long empId;
	
	private String employeeName;
	
	private ZonedDateTime jobStartTime;
	private ZonedDateTime jobEndTime;
	private int plannedHours;	

	private String[] shiftTimings;
	
	public String getMaintenanceType() {
		return maintenanceType;
	}

	public void setMaintenanceType(String maintenanceType) {
		this.maintenanceType = maintenanceType;
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

	public Checklist getChecklist() {
		return checklist;
	}

	public void setChecklist(Checklist checklist) {
		this.checklist = checklist;
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

	public Asset getAsset() {
		return asset;
	}

	public void setAsset(Asset asset) {
		this.asset = asset;
	}

	public long getEmpId() {
		return empId;
	}

	public void setEmpId(long empId) {
		this.empId = empId;
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

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}
	
	
}
