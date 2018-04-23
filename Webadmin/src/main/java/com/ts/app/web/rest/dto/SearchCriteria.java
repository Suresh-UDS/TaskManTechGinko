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

	private String columnName;

	private boolean sortByAsc;

	private String exportType;

	private String block;

	private String floor;

	private String zone;

	private String feedbackName;

	private String userLogin;

	private String userFirstName;

	private String userLastName;

	private String userEmail;

	private double lat;

	private double lng;
	
	private boolean report;
	
	private String jobTypeName;
	
	private String ticketStatus;
	
	private boolean admin;

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
	
	/*public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("userId="+ userId);
		sb.append("subordinates="+ subordinateIds);
		return sb.toString();
	}*/

    public String getJobTypeName() {
		return jobTypeName;
	}

	public void setJobTypeName(String jobTypeName) {
		this.jobTypeName = jobTypeName;
	}

	@Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("SearchCriteria{");
        sb.append("id=").append(id);
        sb.append(", jobTitle='").append(jobTitle).append('\'');
        sb.append(", AssetTitle='").append(AssetTitle).append('\'');
        sb.append(", assetType=").append(assetType);
        sb.append(", assetStatus=").append(assetStatus);
        sb.append(", employeeId=").append(employeeId);
        sb.append(", employeeEmpId='").append(employeeEmpId).append('\'');
        sb.append(", name='").append(name).append('\'');
        sb.append(", fullName='").append(fullName).append('\'');
        sb.append(", checkInDateTimeFrom=").append(checkInDateTimeFrom);
        sb.append(", checkInDateTimeTo=").append(checkInDateTimeTo);
        sb.append(", fromDate=").append(fromDate);
        sb.append(", toDate=").append(toDate);
        sb.append(", jobStatus=").append(jobStatus);
        sb.append(", locationId=").append(locationId);
        sb.append(", siteId=").append(siteId);
        sb.append(", siteName='").append(siteName).append('\'');
        sb.append(", projectId=").append(projectId);
        sb.append(", projectName='").append(projectName).append('\'');
        sb.append(", userGroupId=").append(userGroupId);
        sb.append(", userId=").append(userId);
        sb.append(", deviceId=").append(deviceId);
        sb.append(", deviceUniqueId='").append(deviceUniqueId).append('\'');
        sb.append(", employeeEmpIds=").append(employeeEmpIds);
        sb.append(", findAll=").append(findAll);
        sb.append(", role='").append(role).append('\'');
        sb.append(", subordinateIds=").append(subordinateIds);
        sb.append(", designation='").append(designation).append('\'');
        sb.append(", scheduled=").append(scheduled);
        sb.append(", sendReport=").append(sendReport);
        sb.append(", consolidated=").append(consolidated);
        sb.append(", assignedStatus=").append(assignedStatus);
        sb.append(", completedStatus=").append(completedStatus);
        sb.append(", overdueStatus=").append(overdueStatus);
        sb.append(", userRoleId=").append(userRoleId);
        sb.append(", applicationModuleId=").append(applicationModuleId);
        sb.append(", applicationActionId=").append(applicationActionId);
        sb.append(", userRolePermissionId=").append(userRolePermissionId);
        sb.append(", rateCardTitle='").append(rateCardTitle).append('\'');
        sb.append(", rateCardType='").append(rateCardType).append('\'');
        sb.append(", graphRequest=").append(graphRequest);
        sb.append(", sort=").append(sort);
        sb.append(", columnName='").append(columnName).append('\'');
        sb.append(", sortByAsc=").append(sortByAsc);
        sb.append(", exportType='").append(exportType).append('\'');
        sb.append(", block='").append(block).append('\'');
        sb.append(", floor='").append(floor).append('\'');
        sb.append(", zone='").append(zone).append('\'');
        sb.append(", feedbackName='").append(feedbackName).append('\'');
        sb.append(", userLogin='").append(userLogin).append('\'');
        sb.append(", userFirstName='").append(userFirstName).append('\'');
        sb.append(", userLastName='").append(userLastName).append('\'');
        sb.append(", userEmail='").append(userEmail).append('\'');
        sb.append(", lat=").append(lat);
        sb.append(", lng=").append(lng);
        sb.append('}');
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

	public boolean isSortByAsc() {
		return sortByAsc;
	}

	public void setSortByAsc(boolean sortByAsc) {
		this.sortByAsc = sortByAsc;
	}

	public String getColumnName() {
		return columnName;
	}

	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}

	public int getSort() {
		return sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	public String getExportType() {
		return exportType;
	}

	public void setExportType(String exportType) {
		this.exportType = exportType;
	}

	public String getBlock() {
		return block;
	}

	public void setBlock(String block) {
		this.block = block;
	}

	public String getFloor() {
		return floor;
	}

	public void setFloor(String floor) {
		this.floor = floor;
	}

	public String getZone() {
		return zone;
	}

	public void setZone(String zone) {
		this.zone = zone;
	}

	public String getFeedbackName() {
		return feedbackName;
	}

	public void setFeedbackName(String feedbackName) {
		this.feedbackName = feedbackName;
	}

	public String getUserLogin() {
		return userLogin;
	}

	public void setUserLogin(String userLogin) {
		this.userLogin = userLogin;
	}

	public String getUserFirstName() {
		return userFirstName;
	}

	public void setUserFirstName(String userFirstName) {
		this.userFirstName = userFirstName;
	}

	public String getUserLastName() {
		return userLastName;
	}

	public void setUserLastName(String userLastName) {
		this.userLastName = userLastName;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}


    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

	public boolean isReport() {
		return report;
	}

	public void setReport(boolean report) {
		this.report = report;
	}

	public String getTicketStatus() {
		return ticketStatus;
	}

	public void setTicketStatus(String ticketStatus) {
		this.ticketStatus = ticketStatus;
	}

	public boolean isAdmin() {
		return admin;
	}

	public void setAdmin(boolean admin) {
		this.admin = admin;
	}
    
    
}
