package com.ts.app.domain.Measurements;

import org.influxdb.annotation.Column;
import org.influxdb.annotation.Measurement;

import java.time.Instant;

@Measurement(name="QuotationReport")
public class QuotationStatusMeasurement {

    @Column(name="time")
    private Instant Time;

    @Column(name="date", tag = true)
    private String date;

    @Column(name="projectId")
    private long projectId;

    @Column(name="siteId")
    private long siteId;

    @Column(name="category", tag = true)
    private String category;

    @Column(name="status", tag = true)
    private String status;

    @Column(name="statusCount")
    private int statusCount;

    @Column(name="totalCount")
    private int totalCount;

    public Instant getTime() {
        return Time;
    }

    public void setTime(Instant time) {
        Time = time;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
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

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }
}
