package com.ts.app.web.rest.dto;

import com.ts.app.domain.AssetStatus;
import com.ts.app.domain.AssetType;
import com.ts.app.domain.JobStatus;

import java.util.Date;
import java.util.List;

public class SearchCriteria extends Paginator {

	private long id;

	private String jobTitle;

	private String AssetTitle;

	private AssetType assetType;

	private AssetStatus assetStatus;

	private long employeeId;

	private String employeeEmpId;

	private String name;

	private String fullName;

	private Date checkInDateTimeFrom;

	private Date checkInDateTimeTo;

	private Date fromDate;

	private Date toDate;

	private JobStatus jobStatus;

	private long locationId;

	private long siteId;
	
	private String siteName;

	private long projectId;

	private String projectName;

	private long userGroupId;

	private long userId;

	private long deviceId;

	private String deviceUniqueId;

	private List<String> employeeEmpIds;

	private boolean findAll;

	private String role;

	private List<Long> subordinateIds;

	private String designation;

	private boolean scheduled;

	private boolean sendReport;

	private boolean consolidated;

	private boolean assignedStatus;

	private boolean completedStatus;

	private boolean overdueStatus;

	private long userRoleId;

	private long applicationModuleId;

	private long applicationActionId;

	private long userRolePermissionId;

	private String rateCardTitle;

	private String rateCardType;

	private boolean graphRequest;
	
	private int sort;


	public int getSort() {
		return sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(long employeeId) {
		this.employeeId = employeeId;
	}

	public String getEmployeeEmpId() {
		return employeeEmpId;
	}

	public void setEmployeeEmpId(String employeeEmpId) {
		this.employeeEmpId = employeeEmpId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getCheckInDateTimeFrom() {
		return checkInDateTimeFrom;
	}

	public void setCheckInDateTimeFrom(Date checkInDateTimeFrom) {
		this.checkInDateTimeFrom = checkInDateTimeFrom;
	}

	public Date getCheckInDateTimeTo() {
		return checkInDateTimeTo;
	}

	public void setCheckInDateTimeTo(Date checkInDateTimeTo) {
		this.checkInDateTimeTo = checkInDateTimeTo;
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

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public long getUserGroupId() {
		return userGroupId;
	}

	public void setUserGroupId(long userGroupId) {
		this.userGroupId = userGroupId;
	}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

	public long getDeviceId() {
		return deviceId;
	}

	public void setDeviceId(long deviceId) {
		this.deviceId = deviceId;
	}

	public boolean isFindAll() {
		return findAll;
	}

	public void setFindAll(boolean findAll) {
		this.findAll = findAll;
	}

	public String getDeviceUniqueId() {
		return deviceUniqueId;
	}

	public void setDeviceUniqueId(String deviceUniqueId) {
		this.deviceUniqueId = deviceUniqueId;
	}

	public List<String> getEmployeeEmpIds() {
		return employeeEmpIds;
	}

	public void setEmployeeEmpIds(List<String> employeeEmpIds) {
		this.employeeEmpIds = employeeEmpIds;
	}

	public JobStatus getJobStatus() {
		return jobStatus;
	}

	public void setJobStatus(JobStatus jobStatus) {
		this.jobStatus = jobStatus;
	}

	public long getLocationId(){
	    return locationId;
    }

    public void setLocation(long locationId){this.locationId = locationId;}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public List<Long> getSubordinateIds() {
		return subordinateIds;
	}

	public void setSubordinateIds(List<Long> subordinateIds) {
		this.subordinateIds = subordinateIds;
	}



	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}



	public boolean isScheduled() {
		return scheduled;
	}

	public void setScheduled(boolean scheduled) {
		this.scheduled = scheduled;
	}



	public boolean isSendReport() {
		return sendReport;
	}

	public void setSendReport(boolean sendReport) {
		this.sendReport = sendReport;
	}



	public boolean isConsolidated() {
		return consolidated;
	}

	public void setConsolidated(boolean consolidated) {
		this.consolidated = consolidated;
	}

	public boolean isAssignedStatus() {
		return assignedStatus;
	}

	public void setAssignedStatus(boolean assignedStatus) {
		this.assignedStatus = assignedStatus;
	}

	public boolean isCompletedStatus() {
		return completedStatus;
	}

	public void setCompletedStatus(boolean completedStatus) {
		this.completedStatus = completedStatus;
	}

	public boolean isOverdueStatus() {
		return overdueStatus;
	}

	public void setOverdueStatus(boolean overdueStatus) {
		this.overdueStatus = overdueStatus;
	}

	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("userId="+ userId);
		sb.append("subordinates="+ subordinateIds);
		return sb.toString();
	}

    public AssetStatus getAssetStatus() {
        return assetStatus;
    }

    public void setAssetStatus(AssetStatus assetStatus) {
        this.assetStatus = assetStatus;
    }

    public AssetType getAssetType() {
        return assetType;
    }

    public void setAssetType(AssetType assetType) {
        this.assetType = assetType;
    }

    public String getAssetTitle() {
        return AssetTitle;
    }

    public void setAssetTitle(String assetTitle) {
        AssetTitle = assetTitle;
    }

	public long getUserRoleId() {
		return userRoleId;
	}

	public void setUserRoleId(long userRoleId) {
		this.userRoleId = userRoleId;
	}

	public void setLocationId(long locationId) {
		this.locationId = locationId;
	}

	public long getApplicationModuleId() {
		return applicationModuleId;
	}

	public void setApplicationModuleId(long applicationModuleId) {
		this.applicationModuleId = applicationModuleId;
	}

	public long getApplicationActionId() {
		return applicationActionId;
	}

	public void setApplicationActionId(long applicationActionId) {
		this.applicationActionId = applicationActionId;
	}

	public long getUserRolePermissionId() {
		return userRolePermissionId;
	}

	public void setUserRolePermissionId(long userRolePermissionId) {
		this.userRolePermissionId = userRolePermissionId;
	}

    public String getRateCardType() {
        return rateCardType;
    }

    public void setRateCardType(String rateCardType) {
        this.rateCardType = rateCardType;
    }

    public String getRateCardTitle() {
        return rateCardTitle;
    }

    public void setRateCardTitle(String rateCardTitle) {
        this.rateCardTitle = rateCardTitle;
    }
	public Date getFromDate() {
		return fromDate;
	}

	public void setFromDate(Date fromDate) {
		this.fromDate = fromDate;
	}

	public Date getToDate() {
		return toDate;
	}

	public void setToDate(Date toDate) {
		this.toDate = toDate;
	}

	public boolean isGraphRequest() {
		return graphRequest;
	}

	public void setGraphRequest(boolean graphRequest) {
		this.graphRequest = graphRequest;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getSiteName() {
		return siteName;
	}

	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}

}
