package com.ts.app.web.rest.dto;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public class QuotationDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;

    private String _id;

    private String title;

    private double grandTotal;

    private String createByUserName;

    private long createdByUserId;

    private String sentByUserName = "Not Submitted";

    private long sentByUserId;

    private String approvedByUserName = "Not Approved";

    private long approvedByUserId;

    private String description;

    private List<RateCardDTO> rateCardDetails;

    private long siteId;

    private String siteName;

    private long projectId;

    private String projectName;

    private long ticketId;

    private long jobId;

    private boolean drafted;

    private boolean submitted;

    private boolean approved;

    private boolean archived;

    private Date submittedDate;

    private Date approvedDate;

    private Date archivedDate;

    private String mode;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public double getGrandTotal() {
		return grandTotal;
	}

	public void setGrandTotal(double grandTotal) {
		this.grandTotal = grandTotal;
	}

	public String getCreateByUserName() {
        return createByUserName;
    }

    public void setCreateByUserName(String createByUserName) {
        this.createByUserName = createByUserName;
    }

    public long getCreatedByUserId() {
		return createdByUserId;
	}

	public void setCreatedByUserId(long createdByUserId) {
		this.createdByUserId = createdByUserId;
	}

	public String getSentByUserName() {
        return sentByUserName;
    }

    public void setSentByUserName(String sentByUserName) {
        this.sentByUserName = sentByUserName;
    }

    public long getSentByUserId() {
		return sentByUserId;
	}

	public void setSentByUserId(long sentByUserId) {
		this.sentByUserId = sentByUserId;
	}

	public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

	public List<RateCardDTO> getRateCardDetails() {
		return rateCardDetails;
	}

	public void setRateCardDetails(List<RateCardDTO> rateCardDetails) {
		this.rateCardDetails = rateCardDetails;
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

	public boolean isDrafted() {
		return drafted;
	}

	public void setDrafted(boolean drafted) {
		this.drafted = drafted;
	}

	public boolean isSubmitted() {
		return submitted;
	}

	public void setSubmitted(boolean submitted) {
		this.submitted = submitted;
	}

	public boolean isApproved() {
		return approved;
	}

	public void setApproved(boolean approved) {
		this.approved = approved;
	}

	public boolean isArchived() {
		return archived;
	}

	public void setArchived(boolean archived) {
		this.archived = archived;
	}

	public String getApprovedByUserName() {
		return approvedByUserName;
	}

	public void setApprovedByUserName(String approvedByUserName) {
		this.approvedByUserName = approvedByUserName;
	}

	public long getApprovedByUserId() {
		return approvedByUserId;
	}

	public void setApprovedByUserId(long approvedByUserId) {
		this.approvedByUserId = approvedByUserId;
	}

	public Date getSubmittedDate() {
		return submittedDate;
	}

	public void setSubmittedDate(Date submittedDate) {
		this.submittedDate = submittedDate;
	}

	public Date getApprovedDate() {
		return approvedDate;
	}

	public void setApprovedDate(Date approvedDate) {
		this.approvedDate = approvedDate;
	}

	public Date getArchivedDate() {
		return archivedDate;
	}

	public void setArchivedDate(Date archivedDate) {
		this.archivedDate = archivedDate;
	}

	public String get_id() {
		return _id;
	}

	public void set_id(String _id) {
		this._id = _id;
	}

	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}


    public long getTicketId() {
        return ticketId;
    }

    public void setTicketId(long ticketId) {
        this.ticketId = ticketId;
    }

    public long getJobId() {
        return jobId;
    }

    public void setJobId(long jobId) {
        this.jobId = jobId;
    }
}
