package com.ts.app.web.rest.dto;

import java.sql.Timestamp;
import java.util.List;

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
	
	private String indentRefNumber;
	
	private long transactionId;
	
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

	public String getIndentRefNumber() {
		return indentRefNumber;
	}

	public void setIndentRefNumber(String indentRefNumber) {
		this.indentRefNumber = indentRefNumber;
	}

	public long getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(long transactionId) {
		this.transactionId = transactionId;
	}
	
	
}
