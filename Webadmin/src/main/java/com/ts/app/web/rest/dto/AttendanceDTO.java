package com.ts.app.web.rest.dto;

import org.springframework.web.multipart.MultipartFile;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.io.Serializable;
import java.util.Date;

public class AttendanceDTO extends BaseDTO implements Serializable{

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private Date checkInTime;

	private Date checkOutTime;

	private String checkInImage;

	private String checkOutImage;

//	private Timestamp checkOutTime;

	private double longitudeIn;
	private double longitudeOut;

	private double latitudeIn;
	private double latitudeOut;

	private long employeeId;

	private String employeeFullName;
	
	private String employeeName;
	
	private String employeeLastName;

	private long siteId;

	private String siteName;

	private String employeeEmpId;

    private MultipartFile photoOutFile;

    private String action;

    private String attendanceIn;

    private String attendanceOut;

	private String shiftStartTime;

	private String shiftEndTime;

	private boolean notCheckedOut;
	
	private String url;
	
	private boolean offline;

	private long continuedAttendanceId;

	private boolean late;
	
	private String checkInImgUrl;
	
	private String checkOutImgUrl;
	
	private String enrollImgUrl;

	private String remarks;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}


	public long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(long employeeId) {
		this.employeeId = employeeId;
	}

	public String getEmployeeFullName() {
		return employeeFullName;
	}

	public void setEmployeeFullName(String employeeFullName) {
		this.employeeFullName = employeeFullName;
	}

	public long getSiteId() {
		return siteId;
	}

	public void setSiteId(long siteId) {
		this.siteId = siteId;
	}

	public String getSiteName() {
		return siteName;
	}

	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}

	public String getEmployeeEmpId() {
		return employeeEmpId;
	}

	public void setEmployeeEmpId(String employeeEmpId) {
		this.employeeEmpId = employeeEmpId;
	}


    public MultipartFile getPhotoOutFile() {
        return photoOutFile;
    }

    public void setPhotoOutFile(MultipartFile photoOutFile) {
        this.photoOutFile = photoOutFile;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getAttendanceOut() {
        return attendanceOut;
    }

    public void setAttendanceOut(String attendanceOut) {
        this.attendanceOut = attendanceOut;
    }

    public String getAttendanceIn() {
        return attendanceIn;
    }

    public void setAttendanceIn(String attendanceIn) {
        this.attendanceIn = attendanceIn;
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

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
    
    public boolean isOffline() {
        return offline;
    }

    public void setOffline(boolean offline) {
        this.offline = offline;
    }

	public Date getCheckInTime() {
		return checkInTime;
	}

	public void setCheckInTime(Date checkInTime) {
		this.checkInTime = checkInTime;
	}

	public Date getCheckOutTime() {
		return checkOutTime;
	}

	public void setCheckOutTime(Date checkOutTime) {
		this.checkOutTime = checkOutTime;
	}

	public long getContinuedAttendanceId() {
		return continuedAttendanceId;
	}

	public void setContinuedAttendanceId(long continuedAttendanceId) {
		this.continuedAttendanceId = continuedAttendanceId;
	}


    public boolean isLate() {
        return late;
    }

    public void setLate(boolean late) {
        this.late = late;
    }

	public String getCheckInImgUrl() {
		return checkInImgUrl;
	}

	public void setCheckInImgUrl(String checkInImgUrl) {
		this.checkInImgUrl = checkInImgUrl;
	}

	public String getCheckOutImgUrl() {
		return checkOutImgUrl;
	}

	public void setCheckOutImgUrl(String checkOutImgUrl) {
		this.checkOutImgUrl = checkOutImgUrl;
	}

	public String getEnrollImgUrl() {
		return enrollImgUrl;
	}

	public void setEnrollImgUrl(String enrollImgUrl) {
		this.enrollImgUrl = enrollImgUrl;
	}

	public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}

	public String getEmployeeLastName() {
		return employeeLastName;
	}

	public void setEmployeeLastName(String employeeLastName) {
		this.employeeLastName = employeeLastName;
	}
}
