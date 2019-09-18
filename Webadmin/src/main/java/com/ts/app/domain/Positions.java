package com.ts.app.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "sap_positions")
public class Positions {
 
	@Id
	@GeneratedValue
	private long id;
	
	private String positionDesc;
	
	private String positionId;
	
	private double grossAmount;
	
	private String wbsId;

	public String getPositionDesc() {
		return positionDesc;
	}

	public void setPositionDesc(String positionDesc) {
		this.positionDesc = positionDesc;
	}

	public String getPositionId() {
		return positionId;
	}

	public void setPositionId(String positionId) {
		this.positionId = positionId;
	}

	public double getGrossAmount() {
		return grossAmount;
	}

	public void setGrossAmount(double grossAmount) {
		this.grossAmount = grossAmount;
	}

	public String getWbsId() {
		return wbsId;
	}

	public void setWbsId(String wbsId) {
		this.wbsId = wbsId;
	}
	
	
}
