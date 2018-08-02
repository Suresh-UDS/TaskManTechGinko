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
@Table(name = "site_expense")
public class SiteExpense {

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

	private double amount;
	
	private String currency;
	
	private Timestamp expenseDate;
	
	private String receiptNumber;
	
	private ExpenseType expenseType;
	
	private boolean billable;
	
	private boolean reimbursable;
	
	private PaymentType paymentType;
	
	private String billImage1;
	
	private String billImage2;
	
	private String billImage3;

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
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
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

	public ExpenseType getExpenseType() {
		return expenseType;
	}

	public void setExpenseType(ExpenseType expenseType) {
		this.expenseType = expenseType;
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

	
	
	
}
