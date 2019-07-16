package com.ts.app.domain;

import java.util.List;

public class AssetReadingReport {
    private String assetName;
    private String assetCode;
    private List<Readings> readings;
    private boolean parent;

    public AssetReadingReport() {}
    
    public AssetReadingReport(String assetName, String assetCode, List<Readings> readings) {
        this.assetName = assetName;
        this.assetCode = assetCode;
        this.readings = readings;
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }

    public String getAssetCode() {
        return assetCode;
    }

    public void setAssetCode(String assetCode) {
        this.assetCode = assetCode;
    }

    public List<Readings> getReadings() {
        return readings;
    }

    public void setReadings(List<Readings> readings) {
        this.readings = readings;
    }

	public boolean isParent() {
		return parent;
	}

	public void setParent(boolean parent) {
		this.parent = parent;
	}

}
