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
    
    private boolean reliever;
    
    private String designation;

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

    private long difference;

    private long differenceInHours;

    private long differenceInMinutes;

    private String differenceText;

    private String remarks;
    
    private String shiftKey;

    public EmployeeAttendanceReport() {

    }


    public EmployeeAttendanceReport(long empId, String employeeId, String name, String lastName, String designation, String siteName,
    								String projectName, Date checkInTime, Date checkOutTime, String shiftStartTime, String shiftEndTime,
    								Long continuedAttendance, boolean isLate, String remarks) {
       // this.Image = image;
    		this.empId = empId;
        this.employeeId = employeeId;
        this.name = name;
        this.lastName = lastName;
        this.designation = designation;
        this.siteName = siteName;
        this.projectName = projectName;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.shiftStartTime = shiftStartTime;
        this.shiftEndTime = shiftEndTime;
        this.remarks = remarks;
        if(this.checkOutTime!=null){
            this.difference = this.checkOutTime.getTime() - this.checkInTime.getTime();
            this.differenceInHours = this.difference/ (60 * 60 * 1000);//Converting duration in hours
            this.differenceInMinutes = this.difference / (60 * 1000) % 60;//Converting duration in Minutes
            if(this.differenceInHours<9 && this.differenceInMinutes<9){
                this.differenceText = '0'+String.valueOf(this.differenceInHours)+':'+'0'+String.valueOf(this.differenceInMinutes);
            }else if(this.differenceInHours<9 ){
                this.differenceText = '0'+String.valueOf(this.differenceInHours)+':'+String.valueOf(this.differenceInMinutes);
            }else if(this.differenceInMinutes<9){
                this.differenceText = String.valueOf(this.differenceInHours)+':'+'0'+String.valueOf(this.differenceInMinutes);
            }else{
                this.differenceText = String.valueOf(this.differenceInHours)+':'+String.valueOf(this.differenceInMinutes);
            }
        }else{
            this.differenceText = "0";
        }
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


    public long getDifference() {
        return difference;
    }

    public void setDifference(long difference) {
        this.difference = difference;
    }

    public long getDifferenceInHours() {
        return differenceInHours;
    }

    public void setDifferenceInHours(long differenceInHours) {
        this.differenceInHours = differenceInHours;
    }

    public long getDifferenceInMinutes() {
        return differenceInMinutes;
    }

    public void setDifferenceInMinutes(long differenceInMinutes) {
        this.differenceInMinutes = differenceInMinutes;
    }

    public String getDifferenceText() {
        return differenceText;
    }

    public void setDifferenceText(String differenceText) {
        this.differenceText = differenceText;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}


	public String getShiftKey() {
		return shiftKey;
	}


	public void setShiftKey(String shiftKey) {
		this.shiftKey = shiftKey;
	}


	public boolean isReliever() {
		return reliever;
	}


	public void setReliever(boolean reliever) {
		this.reliever = reliever;
	}
    
}
