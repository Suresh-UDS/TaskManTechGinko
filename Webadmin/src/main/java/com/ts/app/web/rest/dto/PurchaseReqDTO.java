package com.ts.app.web.rest.dto;

import java.sql.Timestamp;
import java.util.List;

import com.ts.app.domain.purchaseRequestStatus;

public class PurchaseReqDTO extends BaseDTO{

	private long id;
	
	private long projectId;
	
	private long siteId;
	
	private long requestedById;
	
	private String requestedByName;
	
	private long approvedById;
	
	private String approvedByName;
	
	private Timestamp requestedDate;
	
	private Timestamp approvedDate;
	
	private List<PurchaseReqItemDTO> items;
	
	private String purchaseRefNumber;
	
	private purchaseRequestStatus requestStatus;
	
	private long transactionId;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getProjectId() {
		return projectId;
	}

	public void setProjectId(long projectId) {
		this.projectId = projectId;
	}

	public long getSiteId() {
		return siteId;
	}

	public void setSiteId(long siteId) {
		this.siteId = siteId;
	}

	public long getRequestedById() {
		return requestedById;
	}

	public void setRequestedById(long requestedById) {
		this.requestedById = requestedById;
	}

	public String getRequestedByName() {
		return requestedByName;
	}

	public void setRequestedByName(String requestedByName) {
		this.requestedByName = requestedByName;
	}

	public long getApprovedById() {
		return approvedById;
	}

	public void setApprovedById(long approvedById) {
		this.approvedById = approvedById;
	}

	public String getApprovedByName() {
		return approvedByName;
	}

	public void setApprovedByName(String approvedByName) {
		this.approvedByName = approvedByName;
	}

	public Timestamp getRequestedDate() {
		return requestedDate;
	}

	public void setRequestedDate(Timestamp requestedDate) {
		this.requestedDate = requestedDate;
	}

	public Timestamp getApprovedDate() {
		return approvedDate;
	}

	public void setApprovedDate(Timestamp approvedDate) {
		this.approvedDate = approvedDate;
	}

	public List<PurchaseReqItemDTO> getItems() {
		return items;
	}

	public void setItems(List<PurchaseReqItemDTO> items) {
		this.items = items;
	}

	public String getPurchaseRefNumber() {
		return purchaseRefNumber;
	}

	public void setPurchaseRefNumber(String purchaseRefNumber) {
		this.purchaseRefNumber = purchaseRefNumber;
	}

	public purchaseRequestStatus getRequestStatus() {
		return requestStatus;
	}

	public void setRequestStatus(purchaseRequestStatus requestStatus) {
		this.requestStatus = requestStatus;
	}

	public long getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(long transactionId) {
		this.transactionId = transactionId;
	}
	
	
	
}
