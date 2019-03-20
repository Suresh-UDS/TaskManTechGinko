package com.ts.app.web.rest.dto;

import org.springframework.web.multipart.MultipartFile;

import java.time.ZonedDateTime;
import java.util.Date;

public class TicketDTO extends BaseDTO {
    private long id;

    private String title;

    private String description;

    private long siteId;

    private String siteName;

    private long projectId;

    private String projectName;

    private long employeeId;

    private String employeeName;
    
    private String employeeLastName;

    private String employeeEmpId;

    private long locationId;

    private long locationName;

    private String block;

    private String floor;

    private String zone;

    private long jobId;

    private String quotationId;

    private String jobName;

    private String severity;

    private long assignedToId;

    private String assignedToName;
    
    private String assignedToLastName;

    private ZonedDateTime assignedOn;

    private long closedById;

    private String closedByName;
    
    private String closedByLastName;

    private ZonedDateTime closedOn;

    private String comments;
    
    private String remarks;

    private String category;

    private String image;

    private MultipartFile imageFile;
    
    private String url;

    private boolean pendingAtUDS;

    private boolean pendingAtClient;
    
    private String assetTitle;
    
    private long assetId;

    private String branch;

    private String region;

    private ZonedDateTime createdDate;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public long getSiteId() {
        return siteId;
    }

    public void setSiteId(long siteId) {
        this.siteId = siteId;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getEmployeeEmpId() {
        return employeeEmpId;
    }

    public void setEmployeeEmpId(String employeeEmpId) {
        this.employeeEmpId = employeeEmpId;
    }

    public long getLocationId() {
        return locationId;
    }

    public void setLocationId(long locationId) {
        this.locationId = locationId;
    }

    public long getLocationName() {
        return locationName;
    }

    public void setLocationName(long locationName) {
        this.locationName = locationName;
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

    public long getJobId() {
        return jobId;
    }

    public void setJobId(long jobId) {
        this.jobId = jobId;
    }

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

	public long getAssignedToId() {
		return assignedToId;
	}

	public void setAssignedToId(long assignedToId) {
		this.assignedToId = assignedToId;
	}

	public String getAssignedToName() {
		return assignedToName;
	}

	public void setAssignedToName(String assignedToName) {
		this.assignedToName = assignedToName;
	}

	public ZonedDateTime getAssignedOn() {
		return assignedOn;
	}

	public void setAssignedOn(ZonedDateTime assignedOn) {
		this.assignedOn = assignedOn;
	}

	public long getClosedById() {
		return closedById;
	}

	public void setClosedById(long closedById) {
		this.closedById = closedById;
	}

	public String getClosedByName() {
		return closedByName;
	}

	public void setClosedByName(String closedByName) {
		this.closedByName = closedByName;
	}

	public ZonedDateTime getClosedOn() {
		return closedOn;
	}

	public void setClosedOn(ZonedDateTime closedOn) {
		this.closedOn = closedOn;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}
	
	
	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getQuotationId() {
		return quotationId;
	}

	public void setQuotationId(String quotationId) {
		this.quotationId = quotationId;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public MultipartFile getImageFile() {
		return imageFile;
	}

	public void setImageFile(MultipartFile imageFile) {
		this.imageFile = imageFile;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

    public boolean isPendingAtClient() {
        return pendingAtClient;
    }

    public void setPendingAtClient(boolean pendingAtClient) {
        this.pendingAtClient = pendingAtClient;
    }

    public boolean isPendingAtUDS() {
        return pendingAtUDS;
    }

    public void setPendingAtUDS(boolean pendingAtUDS) {
        this.pendingAtUDS = pendingAtUDS;
    }

	public String getAssetTitle() {
		return assetTitle;
	}

	public void setAssetTitle(String assetTitle) {
		this.assetTitle = assetTitle;
	}

	public long getAssetId() {
		return assetId;
	}

	public void setAssetId(long assetId) {
		this.assetId = assetId;
	}

	public long getProjectId() {
		return projectId;
	}

	public void setProjectId(long projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getEmployeeLastName() {
		return employeeLastName;
	}

	public void setEmployeeLastName(String employeeLastName) {
		this.employeeLastName = employeeLastName;
	}

	public String getAssignedToLastName() {
		return assignedToLastName;
	}

	public void setAssignedToLastName(String assignedToLastName) {
		this.assignedToLastName = assignedToLastName;
	}

	public String getClosedByLastName() {
		return closedByLastName;
	}

	public void setClosedByLastName(String closedByLastName) {
		this.closedByLastName = closedByLastName;
	}

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    @Override
    public ZonedDateTime getCreatedDate() {
        return createdDate;
    }

    @Override
    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
