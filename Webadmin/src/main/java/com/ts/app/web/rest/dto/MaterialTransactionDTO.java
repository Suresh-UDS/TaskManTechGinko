package com.ts.app.web.rest.dto;

import java.sql.Timestamp;
import java.util.List;

import com.ts.app.domain.MaterialTransactionType;
import com.ts.app.domain.MaterialUOMType;

public class MaterialTransactionDTO extends BaseDTO {

	private long id;
	
	private long siteId;
	
	private String siteName;
	
	private long projectId;
	
	private String projectName;
	
	private long jobId;
	
	private long assetId;
	
	private long materialId;
	
	private String materialItemCode;
	
	private String materialName;
	
	private long materialGroupId;
	
	private String materialGroupItemGroup;
	
	private long quantity;
	
	private long storeStock;
	
	private String uom;
	
	private MaterialTransactionType transactionType;
	
	private Timestamp transactionDate;
	
	private long materialIndentId;
	
	private long materialIndentRefNumber;
	
	private long purchaseRefNumber;
	
	private long issuedQuantity;
	
	private long purchaseRequisitionId;
	
	private List<MaterialIndentItemDTO> items;
	
	private List<PurchaseReqItemDTO> prItems;

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

	public long getJobId() {
		return jobId;
	}

	public void setJobId(long jobId) {
		this.jobId = jobId;
	}

	public long getAssetId() {
		return assetId;
	}

	public void setAssetId(long assetId) {
		this.assetId = assetId;
	}

	public long getMaterialId() {
		return materialId;
	}

	public void setMaterialId(long materialId) {
		this.materialId = materialId;
	}

	public String getMaterialItemCode() {
		return materialItemCode;
	}

	public void setMaterialItemCode(String materialItemCode) {
		this.materialItemCode = materialItemCode;
	}

	public String getMaterialName() {
		return materialName;
	}

	public void setMaterialName(String materialName) {
		this.materialName = materialName;
	}

	public long getQuantity() {
		return quantity;
	}

	public void setQuantity(long quantity) {
		this.quantity = quantity;
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

	public long getMaterialGroupId() {
		return materialGroupId;
	}

	public void setMaterialGroupId(long materialGroupId) {
		this.materialGroupId = materialGroupId;
	}

	public String getMaterialGroupItemGroup() {
		return materialGroupItemGroup;
	}

	public void setMaterialGroupItemGroup(String materialGroupItemGroup) {
		this.materialGroupItemGroup = materialGroupItemGroup;
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

	public long getMaterialIndentId() {
		return materialIndentId;
	}

	public void setMaterialIndentId(long materialIndentId) {
		this.materialIndentId = materialIndentId;
	}

	public long getIssuedQuantity() {
		return issuedQuantity;
	}

	public void setIssuedQuantity(long issuedQuantity) {
		this.issuedQuantity = issuedQuantity;
	}

	public long getPurchaseRequisitionId() {
		return purchaseRequisitionId;
	}

	public void setPurchaseRequisitionId(long purchaseRequisitionId) {
		this.purchaseRequisitionId = purchaseRequisitionId;
	}
	
	public long getMaterialIndentRefNumber() {
		return materialIndentRefNumber;
	}

	public void setMaterialIndentRefNumber(long materialIndentRefNumber) {
		this.materialIndentRefNumber = materialIndentRefNumber;
	}

	public List<MaterialIndentItemDTO> getItems() {
		return items;
	}

	public void setItems(List<MaterialIndentItemDTO> items) {
		this.items = items;
	}

	public List<PurchaseReqItemDTO> getPrItems() {
		return prItems;
	}

	public void setPrItems(List<PurchaseReqItemDTO> prItems) {
		this.prItems = prItems;
	}

	public long getPurchaseRefNumber() {
		return purchaseRefNumber;
	}

	public void setPurchaseRefNumber(long purchaseRefNumber) {
		this.purchaseRefNumber = purchaseRefNumber;
	}


	

	
	
}
