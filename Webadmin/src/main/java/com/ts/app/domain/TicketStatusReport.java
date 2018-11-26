package com.ts.app.domain;

import org.joda.time.DateTime;

import java.io.Serializable;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.util.Date;

public class TicketStatusReport implements Serializable {

    private static final long serialVersionUID = 1L;

    final DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    private ZonedDateTime createdDate;

    private long siteId;

    private long employeeId;

    private Long jobId;

    private String category;

    private String status;

    private Date assignedOn;

    private Date closedOn;

    private long projectId;

    private String region;

    private String branch;

    private long statusCount;

    private Date formattedDate;

    private String date;

    public TicketStatusReport() {
    }

    public TicketStatusReport(ZonedDateTime createdDate, long siteId, long employeeId, Long jobId, String category, String status, Date assignedOn, Date closedOn, long projectId, String region, String branch, long statusCount) {
        this.createdDate = createdDate;
        if(this.createdDate != null) {
            this.formattedDate = Date.from(this.createdDate.toInstant());
            this.date = dateFormat.format(this.formattedDate);
        }
        this.siteId = siteId;
        this.employeeId = employeeId;
        this.jobId = jobId;
        this.category = category;
        this.status = status;
        this.assignedOn = assignedOn;
        this.closedOn = closedOn;
        this.projectId = projectId;
        this.region = region;
        this.branch = branch;
        this.statusCount = statusCount;
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

    public long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(long employeeId) {
        this.employeeId = employeeId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
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

    public Date getAssignedOn() {
        return assignedOn;
    }

    public void setAssignedOn(Date assignedOn) {
        this.assignedOn = assignedOn;
    }

    public Date getClosedOn() {
        return closedOn;
    }

    public void setClosedOn(Date closedOn) {
        this.closedOn = closedOn;
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

    public long getStatusCount() {
        return statusCount;
    }

    public void setStatusCount(long statusCount) {
        this.statusCount = statusCount;
    }
}
