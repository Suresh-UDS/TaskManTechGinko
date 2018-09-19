package com.ts.app.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "purchase_ref_gen")
public class PurchaseRefGen {
	
	@Id
	@GenericGenerator(name = "seq_ref_number", strategy = "com.ts.app.domain.util.PurchaseUnique")
	@GeneratedValue(generator = "seq_ref_number")  
	@Column(name="reference_number")
	private long number;
	
	@OneToOne()
	@JoinColumn(name = "purchaseRequisitionId", nullable = true)
	private PurchaseRequisition purchaseRequisition;

	public long getNumber() {
		return number;
	}

	public void setNumber(long number) {
		this.number = number;
	}

	public PurchaseRequisition getPurchaseRequisition() {
		return purchaseRequisition;
	}

	public void setPurchaseRequisition(PurchaseRequisition purchaseRequisition) {
		this.purchaseRequisition = purchaseRequisition;
	}

	

}
