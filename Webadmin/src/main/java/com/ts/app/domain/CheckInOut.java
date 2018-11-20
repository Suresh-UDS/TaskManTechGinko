package com.ts.app.domain;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "in_out_transaction")
public class CheckInOut extends AbstractAuditingEntity implements Serializable,Cloneable {

	/**
	*
	*/
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employeeId", nullable = false)
	private Employee employee;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "projectId", nullable = true)
	private Project project;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "siteId", nullable = false)
	private Site site;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "jobId", nullable = true)
	private Job job;


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "deviceInId", nullable = true)
	private Device deviceIn;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "deviceOutId", nullable = true)
	private Device deviceOut;

    @OneToMany(mappedBy = "checkInOut",fetch=FetchType.EAGER)
	private List<CheckInOutImage> checkInOutImages;


	private Timestamp checkInDateTime;

	private Timestamp checkOutDateTime;

	private String photoIn;

	private String photoOut;

	private String photoOut2;

	private double longitudeIn;

	private double latitudeIn;

	private double longitudeOut;

	private double latitudeOut;

	private long minsWorked;

	private String remarks;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
	}

	public Site getSite() {
		return site;
	}

	public void setSite(Site site) {
		this.site = site;
	}

	public Device getDeviceIn() {
		return deviceIn;
	}

	public void setDeviceIn(Device deviceIn) {
		this.deviceIn = deviceIn;
	}

	public Device getDeviceOut() {
		return deviceOut;
	}

	public void setDeviceOut(Device deviceOut) {
		this.deviceOut = deviceOut;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public Timestamp getCheckInDateTime() {
		return checkInDateTime;
	}

	public void setCheckInDateTime(Timestamp checkInDateTime) {
		this.checkInDateTime = checkInDateTime;
	}

	public Timestamp getCheckOutDateTime() {
		return checkOutDateTime;
	}

	public void setCheckOutDateTime(Timestamp checkOutDateTime) {
		this.checkOutDateTime = checkOutDateTime;
	}

	public String getPhotoIn() {
		return photoIn;
	}

	public void setPhotoIn(String photoIn) {
		this.photoIn = photoIn;
	}

	public String getPhotoOut() {
		return photoOut;
	}

	public void setPhotoOut(String photoOut) {
		this.photoOut = photoOut;
	}

	public double getLongitudeIn() {
		return longitudeIn;
	}

	public void setLongitudeIn(double longitudeIn) {
		this.longitudeIn = longitudeIn;
	}

	public double getLatitudeIn() {
		return latitudeIn;
	}

	public void setLatitudeIn(double latitudeIn) {
		this.latitudeIn = latitudeIn;
	}

	public double getLongitudeOut() {
		return longitudeOut;
	}

	public void setLongitudeOut(double longitudeOut) {
		this.longitudeOut = longitudeOut;
	}

	public double getLatitudeOut() {
		return latitudeOut;
	}

	public void setLatitudeOut(double latitudeOut) {
		this.latitudeOut = latitudeOut;
	}

	public long getMinsWorked() {
		return minsWorked;
	}

	public void setMinsWorked(long minsWorked) {
		this.minsWorked = minsWorked;
	}

	public Object clone() throws CloneNotSupportedException {
        return (CheckInOut)super.clone();
    }

	public Job getJob() {
		return job;
	}

	public void setJob(Job job) {
		this.job = job;
	}

	public String getPhotoOut2() {
		return photoOut2;
	}

	public void setPhotoOut2(String photoOut2) {
		this.photoOut2 = photoOut2;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

    public List<CheckInOutImage> getCheckInOutImages() {
        return checkInOutImages;
    }

    public void setCheckInOutImages(List<CheckInOutImage> checkInOutImages) {
        this.checkInOutImages = checkInOutImages;
    }


}
