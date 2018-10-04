package com.ts.app.web.rest.dto;

import java.io.Serializable;
import java.util.Date;

public class EmployeeRelieverDTO extends BaseDTO implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	private long id;

	private long employeeId;

	private String employeeFullName;

	private long siteId;

	private String siteName;

	private Date startTime;

	private Date endTime;

	private long relieverEmployeeId;


    private String relieverEmployeeFullName;

	private String relieverName;

	private String relieverMobile;

	public long getId() {
		return id;
	}

	public void setId(long id) {
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

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public String getRelieverName() {
		return relieverName;
	}

	public void setRelieverName(String relieverName) {
		this.relieverName = relieverName;
	}

	public String getRelieverMobile() {
		return relieverMobile;
	}

	public void setRelieverMobile(String relieverMobile) {
		this.relieverMobile = relieverMobile;
	}


    public long getRelieverEmployeeId() {
        return relieverEmployeeId;
    }

    public void setRelieverEmployeeId(long relieverEmployeeId) {
        this.relieverEmployeeId = relieverEmployeeId;
    }

    public String getRelieverEmployeeFullName() {
        return relieverEmployeeFullName;
    }

    public void setRelieverEmployeeFullName(String relieverEmployeeFullName) {
        this.relieverEmployeeFullName = relieverEmployeeFullName;
    }




}
