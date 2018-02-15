package com.ts.app.web.rest.dto;

import com.ts.app.domain.JobType;

import java.util.Map;

public class ReportResult {

	long projectId;
	
	long projectName;
	
	long siteId;

	String siteName;

	long totalJobCount;
	
	long assignedJobCount;

	long completedJobCount;

	long overdueJobCount;

	long locationId;

	String locatinName;

    private String clientName;

    private String Manager;

    private String jobType;

    private long tat;

    long totalEmployeeCount;

    long presentEmployeeCount;

    long absentEmployeeCount;

	Map<JobType,Long> jobCountByType;

	Map<java.sql.Date,Long> totalCountMap;
	
	Map<java.sql.Date,Long> assignedCountMap;
	
	Map<java.sql.Date,Long> completedCountMap;
	
	Map<java.sql.Date,Long> overdueCountMap;

	public String getSiteName() {
		return siteName;
	}

	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}

	public String getLocatinName() {
		return locatinName;
	}

	public void setLocatinName(String locatinName) {
		this.locatinName = locatinName;
	}

	public long getSiteId() {
		return siteId;
	}

	public void setSiteId(long siteId) {
		this.siteId = siteId;
	}

	public long getLocationId(){
	    return locationId;
    }

    public void setLocationId(long locationId){
	    this.locationId = locationId;
    }

	public long getAssignedJobCount() {
		return assignedJobCount;
	}

	public void setAssignedJobCount(long assignedJobCount) {
		this.assignedJobCount = assignedJobCount;
	}

	public long getCompletedJobCount() {
		return completedJobCount;
	}

	public void setCompletedJobCount(long completedJobCount) {
		this.completedJobCount = completedJobCount;
	}

	public long getOverdueJobCount() {
		return overdueJobCount;
	}

	public void setOverdueJobCount(long overdueJobCount) {
		this.overdueJobCount = overdueJobCount;
	}

	public Map<JobType, Long> getJobCountByType() {
		return jobCountByType;
	}

	public void setJobCountByType(Map<JobType, Long> jobCountByType) {
		this.jobCountByType = jobCountByType;
	}


    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getManager() {
        return Manager;
    }

    public void setManager(String manager) {
        Manager = manager;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public long getTat() {
        return tat;
    }

    public void setTat(long tat) {
        this.tat = tat;
    }

    public long getTotalEmployeeCount() {
        return totalEmployeeCount;
    }

    public void setTotalEmployeeCount(long totalEmployeeCount) {
        this.totalEmployeeCount = totalEmployeeCount;
    }

    public long getPresentEmployeeCount() {
        return presentEmployeeCount;
    }

    public void setPresentEmployeeCount(long presentEmployeeCount) {
        this.presentEmployeeCount = presentEmployeeCount;
    }

    public long getAbsentEmployeeCount() {
        return absentEmployeeCount;
    }

    public void setAbsentEmployeeCount(long absentEmployeeCount) {
        this.absentEmployeeCount = absentEmployeeCount;
    }

	public long getTotalJobCount() {
		return totalJobCount;
	}

	public void setTotalJobCount(long totalJobCount) {
		this.totalJobCount = totalJobCount;
	}

	public Map<java.sql.Date, Long> getTotalCountMap() {
		return totalCountMap;
	}

	public void setTotalCountMap(Map<java.sql.Date, Long> totalCountMap) {
		this.totalCountMap = totalCountMap;
	}

	public Map<java.sql.Date, Long> getAssignedCountMap() {
		return assignedCountMap;
	}

	public void setAssignedCountMap(Map<java.sql.Date, Long> assignedCountMap) {
		this.assignedCountMap = assignedCountMap;
	}

	public Map<java.sql.Date, Long> getCompletedCountMap() {
		return completedCountMap;
	}

	public void setCompletedCountMap(Map<java.sql.Date, Long> completedCountMap) {
		this.completedCountMap = completedCountMap;
	}

	public Map<java.sql.Date, Long> getOverdueCountMap() {
		return overdueCountMap;
	}

	public void setOverdueCountMap(Map<java.sql.Date, Long> overdueCountMap) {
		this.overdueCountMap = overdueCountMap;
	}

	public long getProjectId() {
		return projectId;
	}

	public void setProjectId(long projectId) {
		this.projectId = projectId;
	}

	public long getProjectName() {
		return projectName;
	}

	public void setProjectName(long projectName) {
		this.projectName = projectName;
	}
    
    
}
