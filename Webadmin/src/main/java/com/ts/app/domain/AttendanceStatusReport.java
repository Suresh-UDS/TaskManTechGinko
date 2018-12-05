package com.ts.app.domain;

import java.io.Serializable;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.Date;

public class AttendanceStatusReport implements Serializable {

    private ZonedDateTime createdDate;

    private Date checkInTime;

    private Date checkOutTime;

    private long siteId;

    private long employeeId;

    private boolean isLeft;

    private boolean isReliever;

    private long projectId;

    private String region;

    private String branch;

    public AttendanceStatusReport() {
    }

    public AttendanceStatusReport(ZonedDateTime createdDate, Date checkInTime, Date checkOutTime, long siteId, long employeeId, boolean isLeft, boolean isReliever, long projectId, String region, String branch) {
        this.createdDate = createdDate;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.siteId = siteId;
        this.employeeId = employeeId;
        this.isLeft = isLeft;
        this.isReliever = isReliever;
        this.projectId = projectId;
        this.region = region;
        this.branch = branch;
    }

    public ZonedDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
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

    public void setCheckOutTime(Timestamp checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public long getSiteId() {
        return siteId;
    }

    public void setSiteId(long siteId) {
        this.siteId = siteId;
    }

    public long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(long employeeId) {
        this.employeeId = employeeId;
    }

    public boolean isLeft() {
        return isLeft;
    }

    public void setLeft(boolean left) {
        isLeft = left;
    }

    public boolean isReliever() {
        return isReliever;
    }

    public void setReliever(boolean reliever) {
        isReliever = reliever;
    }

    public long getProjectId() {
        return projectId;
    }

    public void setProjectId(long projectId) {
        this.projectId = projectId;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }
}
