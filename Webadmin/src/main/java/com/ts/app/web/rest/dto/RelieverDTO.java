package com.ts.app.web.rest.dto;

import java.util.Date;

public class RelieverDTO extends BaseDTO {

    private Long employeeId;
    private Long relieverId ;
    private String employeeEmpId;
    private String relieverEmpId;
    private Date relievedFromDate;
    private Date relievedToDate;

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
}
