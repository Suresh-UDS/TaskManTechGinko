package com.ts.app.domain;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "purchase_requisition_item")
public class PurchaseRequisitionItem extends AbstractAuditingEntity implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@ManyToOne()
	@JoinColumn(name = "material_id")
	private Material material;
	
	private long quantity; 
	
	private double unitPrice;
	
	private long issuedQuantity;
	
	@ManyToOne()
	@JoinColumn(name = "purchase_requisition_id")
	private PurchaseRequisition purchaseRequisition;
	
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

	public double getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(double unitPrice) {
		this.unitPrice = unitPrice;
	}

	public PurchaseRequisition getPurchaseRequisition() {
		return purchaseRequisition;
	}

	public void setPurchaseRequisition(PurchaseRequisition purchaseRequisition) {
		this.purchaseRequisition = purchaseRequisition;
	}

	public long getIssuedQuantity() {
		return issuedQuantity;
	}

	public void setIssuedQuantity(long issuedQuantity) {
		this.issuedQuantity = issuedQuantity;
	}

	
	
	
}