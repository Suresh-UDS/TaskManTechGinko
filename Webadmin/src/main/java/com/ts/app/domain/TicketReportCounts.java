package com.ts.app.domain;

public class TicketReportCounts {

    private long totalCounts;

    private long assignedCounts;

    private long inProgressCounts;

    private long openCounts;

    private long closedCounts;

    private String status;

    private long count;

    private long lowSeverityTicketCount;

    private long mediumSeverityTicketCount;

    private long highSeverityTicketCount;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getTotalCounts() {
        return totalCounts;
    }

    public void setTotalCounts(long totalCounts) {
        this.totalCounts = totalCounts;
    }

    public long getAssignedCounts() {
        return assignedCounts;
    }

    public void setAssignedCounts(long assignedCounts) {
        this.assignedCounts = assignedCounts;
    }

    public long getOpenCounts() {
        return openCounts;
    }

    public void setOpenCounts(long openCounts) {
        this.openCounts = openCounts;
    }

    public long getClosedCounts() {
        return closedCounts;
    }

    public void setClosedCounts(long closedCounts) {
        this.closedCounts = closedCounts;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public long getInProgressCounts() {
        return inProgressCounts;
    }

    public void setInProgressCounts(long inProgressCounts) {
        this.inProgressCounts = inProgressCounts;
    }

    public long getLowSeverityTicketCount() {
        return lowSeverityTicketCount;
    }

    public void setLowSeverityTicketCount(long lowSeverityTicketCount) {
        this.lowSeverityTicketCount = lowSeverityTicketCount;
    }

    public long getMediumSeverityTicketCount() {
        return mediumSeverityTicketCount;
    }

    public void setMediumSeverityTicketCount(long mediumSeverityTicketCount) {
        this.mediumSeverityTicketCount = mediumSeverityTicketCount;
    }

    public long getHighSeverityTicketCount() {
        return highSeverityTicketCount;
    }

    public void setHighSeverityTicketCount(long highSeverityTicketCount) {
        this.highSeverityTicketCount = highSeverityTicketCount;
    }
}
