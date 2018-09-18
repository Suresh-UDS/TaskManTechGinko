package com.ts.app.web.rest.dto;

import java.sql.Timestamp;
import java.util.List;

import com.ts.app.domain.IndentStatus;

public class MaterialIndentDTO extends BaseDTO {

	private long id;
	
	private long siteId;
	
	private String siteName;
	
	private long projectId;
	
	private String projectName;
	
	private long requestedById;
	
	private String requestedByName;
	
	private long issuedById;
	
	private String issuedByName;
	
	private Timestamp requestedDate;
	
	private Timestamp issuedDate;
	
	private List<MaterialIndentItemDTO> items;
	
	private long indentRefNumber;
	
	private long transactionId;
	
	private String purpose;
	
	private IndentStatus indentStatus;
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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

	public Timestamp getRequestedDate() {
		return requestedDate;
	}

	public void setRequestedDate(Timestamp requestedDate) {
		this.requestedDate = requestedDate;
	}

	public Timestamp getIssuedDate() {
		return issuedDate;
	}

	public void setIssuedDate(Timestamp issuedDate) {
		this.issuedDate = issuedDate;
	}

	public long getRequestedById() {
		return requestedById;
	}

	public void setRequestedById(long requestedById) {
		this.requestedById = requestedById;
	}

	public long getIssuedById() {
		return issuedById;
	}

	public void setIssuedById(long issuedById) {
		this.issuedById = issuedById;
	}

	public List<MaterialIndentItemDTO> getItems() {
		return items;
	}

	public void setItems(List<MaterialIndentItemDTO> items) {
		this.items = items;
	}

	public String getRequestedByName() {
		return requestedByName;
	}

	public void setRequestedByName(String requestedByName) {
		this.requestedByName = requestedByName;
	}

	public String getIssuedByName() {
		return issuedByName;
	}

	public void setIssuedByName(String issuedByName) {
		this.issuedByName = issuedByName;
	}

	public String getSiteName() {
		return siteName;
	}

	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public long getIndentRefNumber() {
		return indentRefNumber;
	}

	public void setIndentRefNumber(long indentRefNumber) {
		this.indentRefNumber = indentRefNumber;
	}

	public long getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(long transactionId) {
		this.transactionId = transactionId;
	}

	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}

	public IndentStatus getIndentStatus() {
		return indentStatus;
	}

	public void setIndentStatus(IndentStatus indentStatus) {
		this.indentStatus = indentStatus;
	}
	
	
}
