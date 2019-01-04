package com.ts.app.domain;

public class TicketReportCounts {

    private int totalCounts;

    private int assignedCounts;

    private int openCounts;

    private int closedCounts;

    public int getTotalCounts() {
        return totalCounts;
    }

    public void setTotalCounts(int totalCounts) {
        this.totalCounts = totalCounts;
    }

    public int getAssignedCounts() {
        return assignedCounts;
    }

    public void setAssignedCounts(int assignedCounts) {
        this.assignedCounts = assignedCounts;
    }

    public int getOpenCounts() {
        return openCounts;
    }

    public void setOpenCounts(int openCounts) {
        this.openCounts = openCounts;
    }

    public int getClosedCounts() {
        return closedCounts;
    }

    public void setClosedCounts(int closedCounts) {
        this.closedCounts = closedCounts;
    }
}
