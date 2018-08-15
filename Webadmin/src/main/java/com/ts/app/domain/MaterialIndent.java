package com.ts.app.domain;

import java.sql.Timestamp;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "material_indent")
public class MaterialIndent {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "siteId", nullable = true)
	private Site site;

	private Employee requestedBy;
	
	private Employee issuedBy;
	
	private Timestamp requestedDate;
	
	private Timestamp issuedDate;
	
	@OneToMany(mappedBy = "materialIndent", cascade = {CascadeType.ALL}, orphanRemoval=true)
	private Set<MaterialIndentItem> items;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Site getSite() {
		return site;
	}

	public void setSite(Site site) {
		this.site = site;
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

	public Timestamp getIssuedDate() {
		return issuedDate;
	}

	public void setIssuedDate(Timestamp issuedDate) {
		this.issuedDate = issuedDate;
	}

	public void setItems(Set<MaterialIndentItem> items) {
		this.items = items;
	}

	public Timestamp getRequestedDate() {
		return requestedDate;
	}

	public void setRequestedDate(Timestamp requestedDate) {
		this.requestedDate = requestedDate;
	}

	public Timestamp getApprovedDate() {
		return issuedDate;
	}

	public void setApprovedDate(Timestamp approvedDate) {
		this.issuedDate = approvedDate;
	}

}