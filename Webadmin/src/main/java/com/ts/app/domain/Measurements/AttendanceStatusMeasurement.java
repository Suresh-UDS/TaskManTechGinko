package com.ts.app.domain.Measurements;

import org.influxdb.annotation.Column;
import org.influxdb.annotation.Measurement;

import java.time.Instant;

@Measurement(name="AttendanceReport")
public class AttendanceStatusMeasurement {

    @Column(name="time")
    private Instant time;

    @Column(name="date", tag = true)
    private String date;

    @Column(name="checkInTime", tag = true)
    private String checkInTime;

    @Column(name="checkOutTime", tag = true)
    private String checkOutTime;

    @Column(name="projectId", tag = true)
    private long projectId;

    @Column(name="siteId", tag = true)
    private long siteId;

    @Column(name="employeeId", tag = true)
    private long employeeId;

    @Column(name="isLeft", tag = true)
    private boolean isLeft;

    @Column(name="isReliever", tag = true)
    private boolean isReliever;

    @Column(name="region", tag = true)
    private String region;

    @Column(name="branch", tag = true)
    private String branch;

    public Instant getTime() {
        return time;
    }

    public void setTime(Instant time) {
        this.time = time;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(String checkInTime) {
        this.checkInTime = checkInTime;
    }

    public String getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(String checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public long getProjectId() {
        return projectId;
    }

    public void setProjectId(long projectId) {
        this.projectId = projectId;
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
