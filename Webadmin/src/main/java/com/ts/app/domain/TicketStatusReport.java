package com.ts.app.domain;

import java.io.Serializable;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.util.Date;

public class TicketStatusReport implements Serializable {

    private static final long serialVersionUID = 1L;

    final DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    private long ticketId;

    private ZonedDateTime createdDate;

    private long siteId;

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

    public TicketStatusReport(long ticketId, ZonedDateTime createdDate, long siteId, String category, String status, Date assignedOn, Date closedOn, long projectId, String region, String branch, long statusCount) {
        this.ticketId = ticketId;
        this.createdDate = createdDate;
        if(this.createdDate != null) {
            this.formattedDate = Date.from(this.createdDate.toInstant());
            this.date = dateFormat.format(this.formattedDate);
        }
        this.siteId = siteId;
        this.category = category;
        this.status = status;
        this.assignedOn = assignedOn;
        this.closedOn = closedOn;
        this.projectId = projectId;
        this.region = region;
        this.branch = branch;
        this.statusCount = statusCount;
    }

    public long getTicketId() {
        return ticketId;
    }

    public void setTicketId(long ticketId) {
        this.ticketId = ticketId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Date getFormattedDate() {
        return formattedDate;
    }

    public void setFormattedDate(Date formattedDate) {
        this.formattedDate = formattedDate;
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

    public ZonedDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
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
}
