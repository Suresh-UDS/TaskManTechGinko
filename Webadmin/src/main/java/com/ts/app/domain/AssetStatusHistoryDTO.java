package com.ts.app.domain;

import com.ts.app.web.rest.dto.BaseDTO;

public class AssetStatusHistoryDTO extends BaseDTO {

	private long id;
	
	private String status;
		
	private String assetTitle;
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getAssetTitle() {
		return assetTitle;
	}

	public void setAssetTitle(String assetTitle) {
		this.assetTitle = assetTitle;
	}
	
	
	 
}
