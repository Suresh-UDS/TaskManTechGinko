package com.ts.app.domain;

public class JobReportCounts {

    private int totalCounts;

    private int assignedCounts;

    private int overdueCounts;

    private int completedCounts;

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

    public int getOverdueCounts() {
        return overdueCounts;
    }

    public void setOverdueCounts(int overdueCounts) {
        this.overdueCounts = overdueCounts;
    }

    public int getCompletedCounts() {
        return completedCounts;
    }

    public void setCompletedCounts(int completedCounts) {
        this.completedCounts = completedCounts;
    }
}
