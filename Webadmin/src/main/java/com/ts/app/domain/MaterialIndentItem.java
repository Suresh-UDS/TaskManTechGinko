package com.ts.app.domain;

import java.io.Serializable;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "material_indent_item")
public class MaterialIndentItem extends AbstractAuditingEntity implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "material_id")
	private Material material;
	
	@Column(name = "quantity")
	private long quantity; 
	
	private long issuedQuantity;
	
	private long pendingQuantity;
	
	@ManyToOne()
	@JoinColumn(name = "material_indent_id")
	private MaterialIndent materialIndent;
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Material getMaterial() {
		return material;
	}

	public void setMaterial(Material material) {
		this.material = material;
	}

	public long getQuantity() {
		return quantity;
	}

	public void setQuantity(long quantity) {
		this.quantity = quantity;
	}

	public MaterialIndent getMaterialIndent() {
		return materialIndent;
	}

	public void setMaterialIndent(MaterialIndent materialIndent) {
		this.materialIndent = materialIndent;
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


	
}
