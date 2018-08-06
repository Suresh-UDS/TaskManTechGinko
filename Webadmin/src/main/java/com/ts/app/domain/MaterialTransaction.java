package com.ts.app.domain;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "material_transaction")
public class MaterialTransaction {

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

	public Site getSite() {
		return site;
	}

	public void setSite(Site site) {
		this.site = site;
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

	public Timestamp getTrasactionDate() {
		return trasactionDate;
	}

	public void setTrasactionDate(Timestamp trasactionDate) {
		this.trasactionDate = trasactionDate;
	}

	
	
}
