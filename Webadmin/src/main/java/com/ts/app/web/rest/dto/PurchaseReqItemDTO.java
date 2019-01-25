package com.ts.app.web.rest.dto;

public class PurchaseReqItemDTO extends BaseDTO {
	
	private long id;
	
	private long materialId;
	
	private String materialName;
	
	private String materialItemCode;
	
	private long materialStoreStock;
	
	private long materialItemGroupId;
	
	private String materialUom;
		
	private long quantity;
	
	private double unitPrice;
	
	private long approvedQty;
	
	private long currentAprQty;
	
	private long pendingQty;

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

	public double getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(double unitPrice) {
		this.unitPrice = unitPrice;
	}

	public long getApprovedQty() {
		return approvedQty;
	}

	public void setApprovedQty(long approvedQty) {
		this.approvedQty = approvedQty;
	}

	public long getPendingQty() {
		return pendingQty;
	}

	public void setPendingQty(long pendingQty) {
		this.pendingQty = pendingQty;
	}

	public long getCurrentAprQty() {
		return currentAprQty;
	}

	public void setCurrentAprQty(long currentAprQty) {
		this.currentAprQty = currentAprQty;
	}


}
