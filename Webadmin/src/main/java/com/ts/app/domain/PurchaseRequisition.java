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
@Table(name = "purchase_requisition")
public class PurchaseRequisition extends AbstractAuditingEntity implements Serializable{

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	@ManyToOne()
	@JoinColumn(name = "projectId", nullable= true)
	private Project project;

	@ManyToOne()
	@JoinColumn(name = "siteId", nullable= true)
	private Site site;

	@ManyToOne()
	@JoinColumn(name = "requestedBy", nullable= true)
	private Employee requestedBy;

	@ManyToOne()
	@JoinColumn(name = "approvedBy", nullable= true)
	private Employee approvedBy;

	private Timestamp requestedDate;

	private Timestamp approvedDate;

	@OneToMany(mappedBy = "purchaseRequisition", fetch = FetchType.EAGER, cascade = {CascadeType.ALL}, orphanRemoval=true)
	private Set<PurchaseRequisitionItem> items;

	private PurchaseRequestStatus requestStatus;

	@OneToOne()
	@JoinColumn(name = "materialTransacationId", nullable= true)
	private MaterialTransaction transaction;
	
	@OneToOne(cascade = {CascadeType.ALL})
	@JoinColumn(name = "purchase_ref_gen_id", nullable= true)
	private PurchaseRefGen purchaseRefNumber;
	
	@Column(name = "purchaseOrderNumber")
	private String purchaseOrderNumber;

    @Column(name = "purpose", nullable = true)
    private String purpose;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
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

	public Employee getApprovedBy() {
		return approvedBy;
	}

	public void setApprovedBy(Employee approvedBy) {
		this.approvedBy = approvedBy;
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

	public Set<PurchaseRequisitionItem> getItems() {
		return items;
	}

	public void setItems(Set<PurchaseRequisitionItem> items) {
		this.items = items;
	}

	public PurchaseRequestStatus getRequestStatus() {
		return requestStatus;
	}

	public void setRequestStatus(PurchaseRequestStatus requestStatus) {
		this.requestStatus = requestStatus;
	}

	public MaterialTransaction getTransaction() {
		return transaction;
	}

	public void setTransaction(MaterialTransaction transaction) {
		this.transaction = transaction;
	}

	public String getPurchaseOrderNumber() {
		return purchaseOrderNumber;
	}

	public void setPurchaseOrderNumber(String purchaseOrderNumber) {
		this.purchaseOrderNumber = purchaseOrderNumber;
	}

	public PurchaseRefGen getPurchaseRefNumber() {
		return purchaseRefNumber;
	}

	public void setPurchaseRefNumber(PurchaseRefGen purchaseRefNumber) {
		this.purchaseRefNumber = purchaseRefNumber;
	}

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }
}
