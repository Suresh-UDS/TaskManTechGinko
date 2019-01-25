package com.ts.app.web.rest.dto;

import java.io.Serializable;

public class AssetgroupDTO extends BaseDTO implements Serializable {
	
	private static final long serialVersionUID = 1L;
	private long id;
    private String assetgroup;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getAssetgroup() {
		return assetgroup;
	}

	public void setAssetgroup(String assetgroup) {
		this.assetgroup = assetgroup;
	}

	
}
