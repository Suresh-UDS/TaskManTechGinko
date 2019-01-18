package com.ts.app.domain.Measurements;

import org.influxdb.annotation.Column;
import org.influxdb.annotation.Measurement;

@Measurement(name="TicketAvgStatus")
public class TicketAvgStatus {
	
	@Column(name="category", tag = true)
	private String category;
	
	@Column(name="counts", tag = true)
	private int counts;
	
	@Column(name="avgCount", tag = true)
	private int avgCount;

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public int getCounts() {
		return counts;
	}

	public void setCounts(int counts) {
		this.counts = counts;
	}

	public int getAvgCount() {
		return avgCount;
	}

	public void setAvgCount(int avgCount) {
		this.avgCount = avgCount;
	}
	
	

}
