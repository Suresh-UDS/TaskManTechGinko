package com.ts.app.domain;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "material")
public class Material extends AbstractAuditingEntity implements Serializable{

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
