package com.ts.app.web.rest.dto;

public class MaterialIndentItemDTO extends BaseDTO {
	
	private long id;
	
	private long materialId;
	
	private String materialName;
	
	private String materialItemCode;
	
	private long materialStoreStock;
	
	private long materialItemGroupId;
	
	private String materialUom;
		
	private long quantity;
	
	private long issuedQuantity;
	
	private long currentQuantity;
	
	private long pendingQuantity;
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getMaterialId() {
		return materialId;
	}

	public void setMaterialId(long materialId) {
		this.materialId = materialId;
	}

	public String getMaterialName() {
		return materialName;
	}

	public void setMaterialName(String materialName) {
		this.materialName = materialName;
	}

	public String getMaterialItemCode() {
		return materialItemCode;
	}

	public void setMaterialItemCode(String materialItemCode) {
		this.materialItemCode = materialItemCode;
	}

	public String getMaterialUom() {
		return materialUom;
	}

	public void setMaterialUom(String materialUom) {
		this.materialUom = materialUom;
	}

	public long getQuantity() {
		return quantity;
	}

	public void setQuantity(long quantity) {
		this.quantity = quantity;
	}

	public long getMaterialStoreStock() {
		return materialStoreStock;
	}

	public void setMaterialStoreStock(long materialStoreStock) {
		this.materialStoreStock = materialStoreStock;
	}

	public long getMaterialItemGroupId() {
		return materialItemGroupId;
	}

	public void setMaterialItemGroupId(long materialItemGroupId) {
		this.materialItemGroupId = materialItemGroupId;
	}

	public long getIssuedQuantity() {
		return issuedQuantity;
	}

	public void setIssuedQuantity(long issuedQuantity) {
		this.issuedQuantity = issuedQuantity;
	}

	public long getPendingQuantity() {
		return pendingQuantity;
	}

	public void setPendingQuantity(long pendingQuantity) {
		this.pendingQuantity = pendingQuantity;
	}

	public long getCurrentQuantity() {
		return currentQuantity;
	}

	public void setCurrentQuantity(long currentQuantity) {
		this.currentQuantity = currentQuantity;
	} 
	
		
	
}
