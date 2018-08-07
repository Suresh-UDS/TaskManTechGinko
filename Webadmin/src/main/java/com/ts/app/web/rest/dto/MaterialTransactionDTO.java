package com.ts.app.web.rest.dto;

import java.sql.Timestamp;

import com.ts.app.domain.MaterialTransactionType;
import com.ts.app.domain.MaterialUOMType;

public class MaterialTransactionDTO extends BaseDTO {

	private long id;
	
	private long siteId;
	
	private String itemCode;
	
	private String name;
	
	private long quantity;
	
	private long storeStock;
	
	private MaterialUOMType uom;
	
	private MaterialTransactionType transactionType;
	
	private Timestamp trasactionDate;

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

	public MaterialUOMType getUom() {
		return uom;
	}

	public void setUom(MaterialUOMType uom) {
		this.uom = uom;
	}

	public MaterialTransactionType getTransactionType() {
		return transactionType;
	}

	public void setTransactionType(MaterialTransactionType transactionType) {
		this.transactionType = transactionType;
	}

	public Timestamp getTrasactionDate() {
		return trasactionDate;
	}

	public void setTrasactionDate(Timestamp trasactionDate) {
		this.trasactionDate = trasactionDate;
	}
	
	
}
