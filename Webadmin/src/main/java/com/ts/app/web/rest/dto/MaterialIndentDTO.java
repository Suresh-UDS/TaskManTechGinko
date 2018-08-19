package com.ts.app.web.rest.dto;

import java.sql.Timestamp;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.ts.app.domain.Employee;
import com.ts.app.domain.MaterialIndentItem;
import com.ts.app.domain.Site;

public class MaterialIndentDTO extends BaseDTO{

	private long id;
	
	private long siteId;

	private Employee requestedBy;
	
	private Employee issuedBy;
	
	private Timestamp requestedDate;
	
	private Timestamp issuedDate;
	
	private Set<MaterialIndentItem> items;

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

	public Employee getRequestedBy() {
		return requestedBy;
	}

	public void setRequestedBy(Employee requestedBy) {
		this.requestedBy = requestedBy;
	}

	public Employee getIssuedBy() {
		return issuedBy;
	}

	public void setIssuedBy(Employee issuedBy) {
		this.issuedBy = issuedBy;
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

	public Set<MaterialIndentItem> getItems() {
		return items;
	}

	public void setItems(Set<MaterialIndentItem> items) {
		this.items = items;
	}
	
	
}
