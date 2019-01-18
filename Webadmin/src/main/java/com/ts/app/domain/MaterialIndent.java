package com.ts.app.domain;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;


@Entity
@Table(name = "material_indent")
public class MaterialIndent extends AbstractAuditingEntity implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id")
	private long id;
	
	@ManyToOne()
	@JoinColumn(name = "siteId", nullable = true)
	private Site site;
	
	@ManyToOne()
	@JoinColumn(name = "projectId", nullable = true)
	private Project project;

	@ManyToOne()
	@JoinColumn(name = "requestedBy", nullable = true)
	private Employee requestedBy;
	
	@ManyToOne()
	@JoinColumn(name = "issuedBy", nullable = true)
	private Employee issuedBy;
	
	private Timestamp requestedDate;
	
	private Timestamp issuedDate;
	
	@OneToMany(mappedBy = "materialIndent", fetch = FetchType.EAGER, cascade = {CascadeType.ALL}, orphanRemoval=true)
	private Set<MaterialIndentItem> items;
	
	@OneToOne(cascade = {CascadeType.ALL})
	@JoinColumn(name = "indentRefNumber", nullable= true)
	private MaterialIndentGen indentRefNumber;
	
	@OneToOne()
	@JoinColumn(name = "materialTransacationId", nullable= true)
	private MaterialTransaction transaction;
	
	@Column(name = "purpose")
	private String purpose;
	
	@Column(name = "indentStatus")
	private IndentStatus indentStatus; 
	
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

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
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

	public Set<MaterialIndentItem> getItems() {
		return items;
	}

	public void setItems(Set<MaterialIndentItem> items) {
		this.items = items;
	}

	public MaterialTransaction getTransaction() {
		return transaction;
	}

	public void setTransaction(MaterialTransaction transaction) {
		this.transaction = transaction;
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

	public MaterialIndentGen getIndentRefNumber() {
		return indentRefNumber;
	}

	public void setIndentRefNumber(MaterialIndentGen indentRefNumber) {
		this.indentRefNumber = indentRefNumber;
	}


}
