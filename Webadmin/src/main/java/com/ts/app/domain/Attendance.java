package com.ts.app.domain;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Table(name = "attendance")
//@Cacheable(true)
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Attendance extends AbstractAuditingEntity implements Serializable{

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private Timestamp checkInTime;

	private Timestamp checkOutTime;

	private String checkInImage;

	private String checkOutImage;

	private double longitudeIn;

	private double longitudeOut;

	private double latitudeIn;

	private double latitudeOut;

	private String attendanceIn;

	private String attendanceOut;

	private String action;

	private boolean offline;

	private boolean late;

	private String remarks;

	@ManyToOne(fetch = FetchType.LAZY, cascade={CascadeType.REFRESH})
	@JoinColumn(name = "siteId", nullable = false)
	private Site site;

	@ManyToOne(fetch = FetchType.LAZY, cascade={CascadeType.REFRESH})
	@JoinColumn(name = "employeeId", nullable = false)
	private Employee employee;

	private String shiftStartTime;

	private String shiftEndTime;

	private boolean notCheckedOut;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "continuedAttendanceId", referencedColumnName = "id", nullable = true)
	private Attendance continuedAttendance;

	private boolean lateAttendance;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public Timestamp getCheckInTime() {
		return checkInTime;
	}

	public void setCheckInTime(Timestamp checkInTime) {
		this.checkInTime = checkInTime;
	}

	public Site getSite() {
		return site;
	}

	public void setSite(Site site) {
		this.site = site;
	}

    public Timestamp getCheckOutTime() {  return checkOutTime;    }

    public void setCheckOutTime(Timestamp checkOutTime) {   this.checkOutTime = checkOutTime;    }

    public String getAttendanceIn() {
        return attendanceIn;
    }

    public void setAttendanceIn(String attendanceIn) {
        this.attendanceIn = attendanceIn;
    }

    public String getAttendanceOut() {
        return attendanceOut;
    }

    public void setAttendanceOut(String attendanceOut) {
        this.attendanceOut = attendanceOut;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getCheckInImage() {
        return checkInImage;
    }

    public void setCheckInImage(String checkInImage) {
        this.checkInImage = checkInImage;
    }

    public String getCheckOutImage() {
        return checkOutImage;
    }

    public void setCheckOutImage(String checkOutImage) {
        this.checkOutImage = checkOutImage;
    }

    public double getLongitudeIn() {
        return longitudeIn;
    }

    public void setLongitudeIn(double longitudeIn) {
        this.longitudeIn = longitudeIn;
    }

    public double getLongitudeOut() {
        return longitudeOut;
    }

    public void setLongitudeOut(double longitudeOut) {
        this.longitudeOut = longitudeOut;
    }

    public double getLatitudeIn() {
        return latitudeIn;
    }

    public void setLatitudeIn(double latitudeIn) {
        this.latitudeIn = latitudeIn;
    }

    public double getLatitudeOut() {
        return latitudeOut;
    }

    public void setLatitudeOut(double latitudeOut) {
        this.latitudeOut = latitudeOut;
    }

	public String getShiftStartTime() {
		return shiftStartTime;
	}

	public void setShiftStartTime(String shiftStartTime) {
		this.shiftStartTime = shiftStartTime;
	}

	public String getShiftEndTime() {
		return shiftEndTime;
	}

	public void setShiftEndTime(String shiftEndTime) {
		this.shiftEndTime = shiftEndTime;
	}

	public boolean isNotCheckedOut() {
		return notCheckedOut;
	}

	public void setNotCheckedOut(boolean notCheckedOut) {
		this.notCheckedOut = notCheckedOut;
	}


    public boolean isOffline() {
        return offline;
    }

    public void setOffline(boolean offline) {
        this.offline = offline;
    }

	public Attendance getContinuedAttendance() {
		return continuedAttendance;
	}

	public void setContinuedAttendance(Attendance continuedAttendance) {
		this.continuedAttendance = continuedAttendance;
	}

    public boolean isLate() {
        return late;
    }

    public void setLate(boolean late) {
        this.late = late;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
