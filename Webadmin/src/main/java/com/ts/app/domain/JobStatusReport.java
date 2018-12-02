package com.ts.app.domain;

import java.io.Serializable;
import java.util.Date;

public class JobStatusReport implements Serializable {

    private static final long serialVersionUID = 1L;

    private Date jobCreatedDate;

    private JobStatus jobStatus;

    private JobType jobType;

    private long siteId;

    private long projectId;

    private String region;

    private String branch;

    private float statusCount;

    public JobStatusReport() {
    }

    public JobStatusReport(Date jobCreatedDate, JobStatus jobStatus, JobType jobType, long siteId, long projectId, String region, String branch, long statusCount) {
        this.jobCreatedDate = jobCreatedDate;
        this.jobStatus = jobStatus;
        this.jobType = jobType;
        this.siteId = siteId;
        this.projectId = projectId;
        this.region = region;
        this.branch = branch;
        this.statusCount = (float)statusCount;
    }

    public Date getJobCreatedDate() {
        return jobCreatedDate;
    }

    public void setJobCreatedDate(Date jobCreatedDate) {
        this.jobCreatedDate = jobCreatedDate;
    }

    public JobStatus getJobStatus() {
        return jobStatus;
    }

    public void setJobStatus(JobStatus jobStatus) {
        this.jobStatus = jobStatus;
    }

    public JobType getJobType() {
        return jobType;
    }

    public void setJobType(JobType jobType) {
        this.jobType = jobType;
    }

    public float getStatusCount() {
        return statusCount;
    }

    public void setStatusCount(float statusCount) {
        this.statusCount = statusCount;
    }

    public long getSiteId() {
        return siteId;
    }

    public void setSiteId(long siteId) {
        this.siteId = siteId;
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
}
