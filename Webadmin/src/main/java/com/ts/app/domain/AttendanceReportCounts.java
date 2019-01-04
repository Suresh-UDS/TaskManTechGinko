package com.ts.app.domain;

public class AttendanceReportCounts {

    private int totalEmployees;

    private int totalPresent;

    private int totalAbsent;

    private int totalLeft;

    public int getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(int totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public int getTotalPresent() {
        return totalPresent;
    }

    public void setTotalPresent(int totalPresent) {
        this.totalPresent = totalPresent;
    }

    public int getTotalAbsent() {
        return totalAbsent;
    }

    public void setTotalAbsent(int totalAbsent) {
        this.totalAbsent = totalAbsent;
    }

    public int getTotalLeft() {
        return totalLeft;
    }

    public void setTotalLeft(int totalLeft) {
        this.totalLeft = totalLeft;
    }
}
