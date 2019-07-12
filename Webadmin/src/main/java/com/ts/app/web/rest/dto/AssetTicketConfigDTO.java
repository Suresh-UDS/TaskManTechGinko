package com.ts.app.web.rest.dto;

import com.ts.app.domain.Asset;

public class AssetTicketConfigDTO extends BaseDTO{

	private static final long serialVersionUID = 1L;

	private Long id;

	private boolean ticket;

	private boolean severity;
	
	private String status;
	
	private Asset asset;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public boolean isTicket() {
		return ticket;
	}

	public void setTicket(boolean ticket) {
		this.ticket = ticket;
	}

	public boolean isSeverity() {
		return severity;
	}

	public void setSeverity(boolean severity) {
		this.severity = severity;
	}

	

	public Asset getAsset() {
		return asset;
	}

	public void setAsset(Asset asset) {
		this.asset = asset;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}	
	
	

}
