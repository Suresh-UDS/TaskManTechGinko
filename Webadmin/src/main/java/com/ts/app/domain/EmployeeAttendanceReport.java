package com.ts.app.domain;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Represents the reporting fields from Employee and Attendance entities.
 * 
 * 
 * @author gnana
 *
 */
public class EmployeeAttendanceReport implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String employeeId;
	
	private String name;
	
	private String lastName;
	
	private String siteName;
	
	private String projectName;
	
	private Timestamp checkInTime;
	
	private Timestamp checkOutTime;
	
	public EmployeeAttendanceReport(String employeeId, String name, String lastName, String siteName, String projectName, Timestamp checkInTime, Timestamp checkOutTime) {
		this.employeeId = employeeId;
		this.name = name;
		this.lastName = lastName;
		this.siteName = siteName;
		this.projectName = projectName;
		this.checkInTime = checkInTime;
		this.checkOutTime = checkOutTime;
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

	public Timestamp getCheckInTime() {
		return checkInTime;
	}

	public void setCheckInTime(Timestamp checkInTime) {
		this.checkInTime = checkInTime;
	}

	public Timestamp getCheckOutTime() {
		return checkOutTime;
	}

	public void setCheckOutTime(Timestamp checkOutTime) {
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
	
	

}
