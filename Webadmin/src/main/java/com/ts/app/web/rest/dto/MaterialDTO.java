package com.ts.app.web.rest.dto;

import com.ts.app.domain.MaterialUOMType;


public class MaterialDTO extends BaseDTO {

	private long id;

	private long siteId;
	
	private String itemCode;
	
	private String name;
	
	private long minimumStock;
	
	private long maximumStock;
	
	private long storeStock;
	
	private MaterialUOMType uom;

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

	public String getItemCode() {
		return itemCode;
	}

	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public long getMinimumStock() {
		return minimumStock;
	}

	public void setMinimumStock(long minimumStock) {
		this.minimumStock = minimumStock;
	}

	public long getMaximumStock() {
		return maximumStock;
	}

	public void setMaximumStock(long maximumStock) {
		this.maximumStock = maximumStock;
	}

	public long getStoreStock() {
		return storeStock;
	}

	public void setStoreStock(long storeStock) {
		this.storeStock = storeStock;
	}

	public MaterialUOMType getUom() {
		return uom;
	}

	public void setUom(MaterialUOMType uom) {
		this.uom = uom;
	}
	
		
	
}
