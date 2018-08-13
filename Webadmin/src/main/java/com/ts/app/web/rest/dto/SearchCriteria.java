package com.ts.app.web.rest.dto;

import com.ts.app.domain.AssetStatus;
import com.ts.app.domain.AssetType;
import com.ts.app.domain.JobStatus;
import com.ts.app.domain.MaterialTransactionType;

import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

public class SearchCriteria extends Paginator {

	private long id;

	private String jobTitle;

	private String assetTitle;

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

	private boolean list;

	private String quotationTitle;

	private String quotationCreatedBy;

	private String quotationApprovedBy;

	private String quotationStatus;

	private Date quotationCreatedDate;

	private Date quotationSubmittedDate;

	private Date quotationApprovedDate;
	
	private long manufacturerId;
	
	private String manufacturerName;
	
	private String assetTypeName;
	
	private String warrantyTypeName;
	
	private String assetGroupName;
	
	private String assetName;
	
	private String vendorName;
	
	private long assetId;
	
	private List<Long> siteIds;

	private boolean notCheckedOut;
	
	private String maintenanceType;
	
	private String assetCode;
	
	private Date acquiredDate;
	
	private ZonedDateTime readingFromDate;
	
	private ZonedDateTime readingToDate;
	
	private String paramName;
	
	private Date assetCreatedDate;
	
	private String materialName;
	
	private String itemCode;
	
	private Date materialCreatedDate;
	
	private Timestamp transactionDate;
	
	private MaterialTransactionType transactionType;
	
	private int roleLevel;

	public String getWarrantyTypeName() {
		return warrantyTypeName;
	}

	public void setWarrantyTypeName(String warrantyTypeName) {
		this.warrantyTypeName = warrantyTypeName;
	}

	public Date getAcquiredDate() {
		return acquiredDate;
	}

	public void setAcquiredDate(Date acquiredDate) {
		this.acquiredDate = acquiredDate;
	}

	public String getAssetGroupName() {
		return assetGroupName;
	}

	public void setAssetGroupName(String assetGroupName) {
		this.assetGroupName = assetGroupName;
	}

	public String getAssetCode() {
		return assetCode;
	}

	public void setAssetCode(String assetCode) {
		this.assetCode = assetCode;
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
        sb.append(", assetTitle='").append(assetTitle).append('\'');
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
		return assetTitle;
	}

	public void setAssetTitle(String assetTitle) {
		this.assetTitle = assetTitle;
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

	public boolean isList() {
		return list;
	}

	public void setList(boolean list) {
		this.list = list;
	}

	public String getQuotationTitle() {
		return quotationTitle;
	}

	public void setQuotationTitle(String quotationTitle) {
		this.quotationTitle = quotationTitle;
	}

	public String getQuotationCreatedBy() {
		return quotationCreatedBy;
	}

	public void setQuotationCreatedBy(String quotationCreatedBy) {
		this.quotationCreatedBy = quotationCreatedBy;
	}

	public String getQuotationApprovedBy() {
		return quotationApprovedBy;
	}

	public void setQuotationApprovedBy(String quotationApprovedBy) {
		this.quotationApprovedBy = quotationApprovedBy;
	}

	public String getQuotationStatus() {
		return quotationStatus;
	}

	public void setQuotationStatus(String quotationStatus) {
		this.quotationStatus = quotationStatus;
	}

	public Date getQuotationCreatedDate() {
		return quotationCreatedDate;
	}

	public void setQuotationCreatedDate(Date quotationCreatedDate) {
		this.quotationCreatedDate = quotationCreatedDate;
	}

	public Date getQuotationApprovedDate() {
		return quotationApprovedDate;
	}

	public void setQuotationApprovedDate(Date quotationApprovedDate) {
		this.quotationApprovedDate = quotationApprovedDate;
	}

	public Date getQuotationSubmittedDate() {
		return quotationSubmittedDate;
	}

	public void setQuotationSubmittedDate(Date quotationSubmittedDate) {
		this.quotationSubmittedDate = quotationSubmittedDate;
	}

	public long getManufacturerId() {
		return manufacturerId;
	}

	public void setManufacturerId(long manufacturerId) {
		this.manufacturerId = manufacturerId;
	}

	public String getManufacturerName() {
		return manufacturerName;
	}

	public void setManufacturerName(String manufacturerName) {
		this.manufacturerName = manufacturerName;
	}

	public String getAssetTypeName() {
		return assetTypeName;
	}

	public void setAssetTypeName(String assetTypeName) {
		this.assetTypeName = assetTypeName;
	}

	public String getAssetName() {
		return assetName;
	}

	public void setAssetName(String assetName) {
		this.assetName = assetName;
	}

	public String getVendorName() {
		return vendorName;
	}

	public void setVendorName(String vendorName) {
		this.vendorName = vendorName;
	}

	public long getAssetId() {
		return assetId;
	}

	public void setAssetId(long assetId) {
		this.assetId = assetId;
	}
    
	
	public List<Long> getSiteIds() {
		return siteIds;
	}

	public void setSiteIds(List<Long> siteIds) {
		this.siteIds = siteIds;
	}


    public boolean isNotCheckedOut() {
        return notCheckedOut;
    }

    public void setNotCheckedOut(boolean notCheckedOut) {
        this.notCheckedOut = notCheckedOut;
    }

	public String getMaintenanceType() {
		return maintenanceType;
	}

	public void setMaintenanceType(String maintenanceType) {
		this.maintenanceType = maintenanceType;
	}

	public ZonedDateTime getReadingFromDate() {
		return readingFromDate;
	}

	public void setReadingFromDate(ZonedDateTime readingFromDate) {
		this.readingFromDate = readingFromDate;
	}

	public ZonedDateTime getReadingToDate() {
		return readingToDate;
	}

	public void setReadingToDate(ZonedDateTime readingToDate) {
		this.readingToDate = readingToDate;
	}

	public String getParamName() {
		return paramName;
	}

	public void setParamName(String paramName) {
		this.paramName = paramName;
	}

	public Date getAssetCreatedDate() {
		return assetCreatedDate;
	}

	public void setAssetCreatedDate(Date assetCreatedDate) {
		this.assetCreatedDate = assetCreatedDate;
	}

	public String getMaterialName() {
		return materialName;
	}

	public void setMaterialName(String materialName) {
		this.materialName = materialName;
	}

	public String getItemCode() {
		return itemCode;
	}

	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}

	public Date getMaterialCreatedDate() {
		return materialCreatedDate;
	}

	public void setMaterialCreatedDate(Date materialCreatedDate) {
		this.materialCreatedDate = materialCreatedDate;
	}

	public Timestamp getTransactionDate() {
		return transactionDate;
	}

	public void setTransactionDate(Timestamp transactionDate) {
		this.transactionDate = transactionDate;
	}

	public MaterialTransactionType getTransactionType() {
		return transactionType;
	}

	public void setTransactionType(MaterialTransactionType transactionType) {
		this.transactionType = transactionType;
	}

	public int getRoleLevel() {
		return roleLevel;
	}

	public void setRoleLevel(int roleLevel) {
		this.roleLevel = roleLevel;
	}


	
}
