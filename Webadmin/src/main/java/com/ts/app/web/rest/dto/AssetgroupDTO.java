package com.ts.app.web.rest.dto;

import java.io.Serializable;

import com.ts.app.domain.AssetGroup;

public class AssetgroupDTO extends BaseDTO implements Serializable {
	
	private static final long serialVersionUID = 1L;
	private long id;
    private String assetgroup;
	private String assetGroupCode;
	private AssetGroup parentGeroup;
	private long parentGroupId;
	private long siteId;
	
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

	public String getAssetGroupCode() {
		return assetGroupCode;
	}

	public void setAssetGroupCode(String assetGroupCode) {
		this.assetGroupCode = assetGroupCode;
	}

	public AssetGroup getParentGeroup() {
		return parentGeroup;
	}

	public void setParentGeroup(AssetGroup parentGeroup) {
		this.parentGeroup = parentGeroup;
	}


    public long getParentGroupId() {
        return parentGroupId;
    }

    public void setParentGroupId(long parentGroupId) {
        this.parentGroupId = parentGroupId;
    }

    public long getSiteId() {
        return siteId;
    }

    public void setSiteId(long siteId) {
        this.siteId = siteId;
    }
}
