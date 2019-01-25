package com.ts.app.domain;

import java.io.Serializable;

/**
 * To hold the category wise expense details for reporting.
 * @author gnana
 *
 */
public class CategoryWiseExpense implements Serializable {

    private static final long serialVersionUID = 1L;

    private String category;

    private double amount;
    
    public CategoryWiseExpense(String category, double amount) {
    		this.category = category;
    		this.amount = amount;
    }

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}
    
    

}
