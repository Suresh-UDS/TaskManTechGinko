package com.ts.app.domain;

import java.sql.Timestamp;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "site_expense")
public class SiteExpense extends AbstractAuditingEntity {

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
	
	private String description;

	private double totalAmount;
	
	private String currency;
	
	private Timestamp expenseDate;
	
	private String receiptNumber;
	
	private boolean billable;
	
	private boolean reimbursable;
	
	private PaymentType paymentType;
	
	private String billImage1;
	
	private String billImage2;
	
	private String billImage3;
	
	@OneToMany(mappedBy = "siteExpense", cascade = {CascadeType.ALL}, orphanRemoval=true)
	private Set<SiteExpenseItem> items;

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
	
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public double getAmount() {
		return totalAmount;
	}

	public void setAmount(double amount) {
		this.totalAmount = amount;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public Timestamp getExpenseDate() {
		return expenseDate;
	}

	public void setExpenseDate(Timestamp expenseDate) {
		this.expenseDate = expenseDate;
	}

	public String getReceiptNumber() {
		return receiptNumber;
	}

	public void setReceiptNumber(String receiptNumber) {
		this.receiptNumber = receiptNumber;
	}

	public boolean isBillable() {
		return billable;
	}

	public void setBillable(boolean billable) {
		this.billable = billable;
	}

	public boolean isReimbursable() {
		return reimbursable;
	}

	public void setReimbursable(boolean reimbursable) {
		this.reimbursable = reimbursable;
	}

	public PaymentType getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(PaymentType paymentType) {
		this.paymentType = paymentType;
	}

	public String getBillImage1() {
		return billImage1;
	}

	public void setBillImage1(String billImage1) {
		this.billImage1 = billImage1;
	}

	public String getBillImage2() {
		return billImage2;
	}

	public void setBillImage2(String billImage2) {
		this.billImage2 = billImage2;
	}

	public String getBillImage3() {
		return billImage3;
	}

	public void setBillImage3(String billImage3) {
		this.billImage3 = billImage3;
	}

	public double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public Set<SiteExpenseItem> getItems() {
		return items;
	}

	public void setItems(Set<SiteExpenseItem> items) {
		this.items = items;
	}

	
	
	
}
