package com.ts.app.web.rest.dto;

/**
 * Created by karthick on 18/07/2019.
 */

public class AssetCountDTO extends BaseDTO {

    private long totalAssets;

    private long breakDownAssets;

    private long assetsUnderMaintenance;

    private long workingAssets;

    public long getTotalAssets() {
        return totalAssets;
    }

    public void setTotalAssets(long totalAssets) {
        this.totalAssets = totalAssets;
    }

    public long getBreakDownAssets() {
        return breakDownAssets;
    }

    public void setBreakDownAssets(long breakDownAssets) {
        this.breakDownAssets = breakDownAssets;
    }

    public long getAssetsUnderMaintenance() {
        return assetsUnderMaintenance;
    }

    public void setAssetsUnderMaintenance(long assetsUnderMaintenance) {
        this.assetsUnderMaintenance = assetsUnderMaintenance;
    }

    public long getWorkingAssets() {
        return workingAssets;
    }

    public void setWorkingAssets(long workingAssets) {
        this.workingAssets = workingAssets;
    }
}
