package com.ts.app.web.rest.dto;

import java.io.Serializable;

public class JobMaterialDTO extends BaseDTO implements Serializable {

	private static final long serialVersionUID = 1L;

	private long id;
	
	private long materialId;
	
	private String materialName;
	
	private String materialCode;
	
	private String materialGroup;
	
	private String materialUom;
	
	private long materialStock;
	
	private long materialQuantity;
	
	private long jobId;

	private String jobTitle;

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

	public String getMaterialCode() {
		return materialCode;
	}

	public void setMaterialCode(String materialCode) {
		this.materialCode = materialCode;
	}

	public String getMaterialGroup() {
		return materialGroup;
	}

	public void setMaterialGroup(String materialGroup) {
		this.materialGroup = materialGroup;
	}

	public String getMaterialUom() {
		return materialUom;
	}

	public void setMaterialUom(String materialUom) {
		this.materialUom = materialUom;
	}

	public long getMaterialStock() {
		return materialStock;
	}

	public void setMaterialStock(long materialStock) {
		this.materialStock = materialStock;
	}

	public long getJobId() {
		return jobId;
	}

	public void setJobId(long jobId) {
		this.jobId = jobId;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public long getMaterialQuantity() {
		return materialQuantity;
	}

	public void setMaterialQuantity(long materialQuantity) {
		this.materialQuantity = materialQuantity;
	}
	
	
}
