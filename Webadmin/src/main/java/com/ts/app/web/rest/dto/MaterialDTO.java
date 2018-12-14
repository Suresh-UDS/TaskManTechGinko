package com.ts.app.web.rest.dto;

import java.util.List;

import com.ts.app.domain.MaterialTransaction;

public class MaterialDTO extends BaseDTO {

	private long id;

	private long siteId;
	
	private String siteName;
	
	private long projectId;
	
	private String projectName;
	
	private long manufacturerId;
	
	private String manufacturerName;
	
	private String itemCode;
	
	private String name;
	
	private long minimumStock;
	
	private long maximumStock;
	
	private long storeStock;
	
	private String uom;
	
	private String itemGroup;
	
	private long itemGroupId;
	
	private String description;
	
	private List<MaterialTransactionDTO> materialTransactions;

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

	public long getManufacturerId() {
		return manufacturerId;
	}

	public void setManufacturerId(long manufacturerId) {
		this.manufacturerId = manufacturerId;
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

	public String getUom() {
		return uom;
	}

	public void setUom(String uom) {
		this.uom = uom;
	}

	public String getItemGroup() {
		return itemGroup;
	}

	public void setItemGroup(String itemGroup) {
		this.itemGroup = itemGroup;
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

	public String getManufacturerName() {
		return manufacturerName;
	}

	public void setManufacturerName(String manufacturerName) {
		this.manufacturerName = manufacturerName;
	}

	public long getItemGroupId() {
		return itemGroupId;
	}

	public void setItemGroupId(long itemGroupId) {
		this.itemGroupId = itemGroupId;
	}

	public List<MaterialTransactionDTO> getMaterialTransactions() {
		return materialTransactions;
	}

	public void setMaterialTransactions(List<MaterialTransactionDTO> materialTransactions) {
		this.materialTransactions = materialTransactions;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
}
