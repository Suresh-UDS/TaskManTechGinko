package com.ts.app.domain;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "material_transaction")
public class MaterialTransaction extends AbstractAuditingEntity implements Serializable {

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
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "projectId", nullable = true)
	private Project project;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "jobId", nullable = true)
	private Job job;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assetId", nullable = true)
	private Asset asset;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "materialId", nullable = true)
	private Material material;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "materialGroupId", nullable = true)
	private MaterialItemGroup materialGroup;
	
	@OneToOne()
	@JoinColumn(name = "materialIndentId", nullable = true)
	private MaterialIndent materialIndent;
	
	@OneToOne()
	@JoinColumn(name = "purchaseRequisitionId", nullable = true)
	private PurchaseRequisition purchaseRequisition;
	
	private long quantity;
	
	private long storeStock;
	
	private String uom;
	
	private MaterialTransactionType transactionType;
	
	private Timestamp transactionDate;
	
	private long issuedQuantity;
	
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

	public Job getJob() {
		return job;
	}

	public void setJob(Job job) {
		this.job = job;
	}

	public Asset getAsset() {
		return asset;
	}

	public void setAsset(Asset asset) {
		this.asset = asset;
	}

	public Material getMaterial() {
		return material;
	}

	public void setMaterial(Material material) {
		this.material = material;
	}

	public long getStoreStock() {
		return storeStock;
	}

	public void setStoreStock(long storeStock) {
		this.storeStock = storeStock;
	}

	public String getUom() {
		return uom;
	}

	public void setUom(String uom) {
		this.uom = uom;
	}

	public long getQuantity() {
		return quantity;
	}

	public void setQuantity(long quantity) {
		this.quantity = quantity;
	}

	public MaterialTransactionType getTransactionType() {
		return transactionType;
	}

	public void setTransactionType(MaterialTransactionType transactionType) {
		this.transactionType = transactionType;
	}

	public Timestamp getTransactionDate() {
		return transactionDate;
	}

	public void setTransactionDate(Timestamp transactionDate) {
		this.transactionDate = transactionDate;
	}

	public MaterialItemGroup getMaterialGroup() {
		return materialGroup;
	}

	public void setMaterialGroup(MaterialItemGroup materialGroup) {
		this.materialGroup = materialGroup;
	}

	public MaterialIndent getMaterialIndent() {
		return materialIndent;
	}

	public void setMaterialIndent(MaterialIndent materialIndent) {
		this.materialIndent = materialIndent;
	}

	public long getIssuedQuantity() {
		return issuedQuantity;
	}

	public void setIssuedQuantity(long issuedQuantity) {
		this.issuedQuantity = issuedQuantity;
	}

	public PurchaseRequisition getPurchaseRequisition() {
		return purchaseRequisition;
	}

	public void setPurchaseRequisition(PurchaseRequisition purchaseRequisition) {
		this.purchaseRequisition = purchaseRequisition;
	}

	

	
	
}
