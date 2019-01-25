package com.ts.app.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "job_material")
public class JobMaterial extends AbstractAuditingEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@Column(name = "material_id")
	private long materialId;
	
	@Column(name = "material_name")
	private String materialName;
	
	@Column(name = "material_code")
	private String materialCode;
	
	@Column(name = "material_group")
	private String materialGroup;
	
	@Column(name = "material_stock")
	private long materialStock;
	
	@Column(name = "material_quantity")
	private long materialQuantity;
	
	@Column(name = "material_uom")
	private String materialUom;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "job_id")
	private Job job;

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

	public long getMaterialStock() {
		return materialStock;
	}

	public void setMaterialStock(long materialStock) {
		this.materialStock = materialStock;
	}

	public String getMaterialUom() {
		return materialUom;
	}

	public void setMaterialUom(String materialUom) {
		this.materialUom = materialUom;
	}

	public Job getJob() {
		return job;
	}

	public void setJob(Job job) {
		this.job = job;
	}

	public long getMaterialQuantity() {
		return materialQuantity;
	}

	public void setMaterialQuantity(long materialQuantity) {
		this.materialQuantity = materialQuantity;
	}
	
	
}
