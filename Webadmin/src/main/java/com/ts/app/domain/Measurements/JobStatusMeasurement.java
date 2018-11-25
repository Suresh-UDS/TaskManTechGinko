package com.ts.app.domain.Measurements;

import com.ts.app.domain.JobStatus;
import org.influxdb.annotation.Column;
import org.influxdb.annotation.Measurement;

import java.time.Instant;

@Measurement(name = "jobReportStatus")
public class JobStatusMeasurement {

    @Column(name="time")
    private Instant time;

    @Column(name="date")
    private String date;

    @Column(name="status")
    private String status;

    @Column(name="type")
    private String type;

    @Column(name="projectId")
    private long projectId;

    @Column(name="region")
    private String region;

    @Column(name="branch")
    private String branch;

    @Column(name="siteId")
    private long siteId;

    @Column(name="statusCount")
    private int statusCount;

    @Column(name="categoryCount")
    private int categoryCount;

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public long getSiteId() {
        return siteId;
    }

    public void setSiteId(long siteId) {
        this.siteId = siteId;
    }

    public long getStatusCount() {
        return statusCount;
    }

    public void setStatusCount(int statusCount) {
        this.statusCount = statusCount;
    }

    public int getCategoryCount() {
        return categoryCount;
    }

    public void setCategoryCount(int categoryCount) {
        this.categoryCount = categoryCount;
    }
}
