package com.ts.app.domain.Measurements;

import org.influxdb.annotation.Column;
import org.influxdb.annotation.Measurement;

import java.time.Instant;

@Measurement(name="ticketAgeReportStatus")
public class TicketAgeMeasurement {

    @Column(name="time")
    private Instant time;

    @Column(name="date", tag = true)
    private String date;

    @Column(name="assignedOn", tag = true)
    private String assignedOn;

    @Column(name="closedOn", tag = true)
    private String closedOn;

    @Column(name="siteId", tag = true)
    private float siteId;

    @Column(name="projectId", tag = true)
    private float projectId;

    @Column(name="region", tag = true)
    private String region;

    @Column(name="branch", tag = true)
    private String branch;

    @Column(name="category", tag = true)
    private String category;

    @Column(name="status", tag = true)
    private String status;

    @Column(name="statusCount", tag = true)
    private int statusCount;

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

    public String getAssignedOn() {
        return assignedOn;
    }

    public void setAssignedOn(String assignedOn) {
        this.assignedOn = assignedOn;
    }

    public String getClosedOn() {
        return closedOn;
    }

    public void setClosedOn(String closedOn) {
        this.closedOn = closedOn;
    }

    public float getSiteId() {
        return siteId;
    }

    public void setSiteId(float siteId) {
        this.siteId = siteId;
    }

    public float getProjectId() {
        return projectId;
    }

    public void setProjectId(float projectId) {
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getStatusCount() {
        return statusCount;
    }

    public void setStatusCount(int statusCount) {
        this.statusCount = statusCount;
    }
}
