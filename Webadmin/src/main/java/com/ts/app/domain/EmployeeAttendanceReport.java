package com.ts.app.domain;

import java.io.Serializable;
import java.util.Date;

/**
 * Represents the reporting fields from Employee and Attendance entities.
 *
 * @author gnana
 */
public class EmployeeAttendanceReport implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;
    
    public static final String PRESENT_STATUS = "PRESENT";
    public static final String ABSENT_STATUS = "ABSENT";


    //private final byte[] Image;

    private long empId;
    
    private String employeeId;

    private String name;

    private String lastName;

    private String siteName;

    private String projectName;

    private Date checkInTime;

    private Date checkOutTime;

    private String shiftStartTime;
    
    private String shiftEndTime;
    
    private String status = "PRESENT";
    
    private boolean shiftContinued;
    
    private String continuedShiftTime;
    
    private boolean late;
    
    public EmployeeAttendanceReport() {
    	
    }


    public EmployeeAttendanceReport(long empId, String employeeId, String name, String lastName, String siteName, 
    								String projectName, Date checkInTime, Date checkOutTime, String shiftStartTime, String shiftEndTime, 
    								Long continuedAttendance, boolean isLate) {
       // this.Image = image;
    		this.empId = empId;
        this.employeeId = employeeId;
        this.name = name;
        this.lastName = lastName;
        this.siteName = siteName;
        this.projectName = projectName;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.shiftStartTime = shiftStartTime;
        this.shiftEndTime = shiftEndTime;
        if(continuedAttendance != null) {
        		shiftContinued = (continuedAttendance > 0 ? true : false);
        }
        this.late = isLate;
    }

    // public byte[] getImage() { return Image; }

    public long getEmpId() {
		return empId;
	}

	public void setEmpId(long empId) {
		this.empId = empId;
	}



	public String getEmployeeIds() {
        return employeeId;
    }

    public void setEmployeeIds(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
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

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
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


	public String getStatus() {
		return status;
	}


	public void setStatus(String status) {
		this.status = status;
	}


	public boolean isShiftContinued() {
		return shiftContinued;
	}


	public void setShiftContinued(boolean shiftContinued) {
		this.shiftContinued = shiftContinued;
	}


	public String getContinuedShiftTime() {
		return continuedShiftTime;
	}


	public void setContinuedShiftTime(String continuedShiftTime) {
		this.continuedShiftTime = continuedShiftTime;
	}


	public boolean isLate() {
		return late;
	}


	public void setLate(boolean late) {
		this.late = late;
	}

    
}
