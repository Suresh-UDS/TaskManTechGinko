package com.ts.app.web.rest.dto;

import java.util.Date;

public class RelieverDTO extends BaseDTO {

    private Long employeeId;
    private Long relieverId ;
    private long siteId;
    private String employeeEmpId;
    private String relieverEmpId;
    private Date relievedFromDate;
    private Date relievedToDate;
    
    private String relieverName;
    
    private String relieverMobile;

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Long getRelieverId() {
        return relieverId;
    }

    public void setRelieverId(Long relieverId) {
        this.relieverId = relieverId;
    }

    public long getSiteId() {
		return siteId;
	}

	public void setSiteId(long siteId) {
		this.siteId = siteId;
	}

	public String getEmployeeEmpId() {
        return employeeEmpId;
    }

    public void setEmployeeEmpId(String employeeEmpId) {
        this.employeeEmpId = employeeEmpId;
    }

    public String getRelieverEmpId() {
        return relieverEmpId;
    }

    public void setRelieverEmpId(String relieverEmpId) {
        this.relieverEmpId = relieverEmpId;
    }

    public Date getRelievedFromDate() {
        return relievedFromDate;
    }

    public void setRelievedFromDate(Date relievedFromDate) {
        this.relievedFromDate = relievedFromDate;
    }

    public Date getRelievedToDate() {
        return relievedToDate;
    }

    public void setRelievedToDate(Date relievedToDate) {
        this.relievedToDate = relievedToDate;
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
    
    
}
