package com.ts.app.domain;

public class QuotationReportCounts {

    private int totalQuotations;

    private int waitingForApproveCnts;

    private int pendingCounts;

    private int approvedCounts;

    private int rejectedCounts;

    public int getTotalQuotations() {
        return totalQuotations;
    }

    public void setTotalQuotations(int totalQuotations) {
        this.totalQuotations = totalQuotations;
    }

    public int getWaitingForApproveCnts() {
        return waitingForApproveCnts;
    }

    public void setWaitingForApproveCnts(int waitingForApproveCnts) {
        this.waitingForApproveCnts = waitingForApproveCnts;
    }

    public int getPendingCounts() {
        return pendingCounts;
    }

    public void setPendingCounts(int pendingCounts) {
        this.pendingCounts = pendingCounts;
    }

    public int getApprovedCounts() {
        return approvedCounts;
    }

    public void setApprovedCounts(int approvedCounts) {
        this.approvedCounts = approvedCounts;
    }

    public int getRejectedCounts() {
        return rejectedCounts;
    }

    public void setRejectedCounts(int rejectedCounts) {
        this.rejectedCounts = rejectedCounts;
    }
}
