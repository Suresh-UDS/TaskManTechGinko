package com.ts.app.web.rest.dto;

/**
 * Created by karthick on 18/07/2019.
 */

public class AssetCountDTO extends BaseDTO {

    private long totalAssets;

    private long breakDownAssets;

    private long assetsUnderMaintenance;

    private long workingAssets;

    private double maintenanceHours;

    private double maintenanceMins;

    private double maintenanceSecs;

    private long assetTicketsCount;

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

    public double getMaintenanceHours() {
        return maintenanceHours;
    }

    public void setMaintenanceHours(double maintenanceHours) {
        this.maintenanceHours = maintenanceHours;
    }

    public long getAssetTicketsCount() {
        return assetTicketsCount;
    }

    public void setAssetTicketsCount(long assetTicketsCount) {
        this.assetTicketsCount = assetTicketsCount;
    }

    public double getMaintenanceMins() {
        return maintenanceMins;
    }

    public void setMaintenanceMins(double maintenanceMins) {
        this.maintenanceMins = maintenanceMins;
    }

    public double getMaintenanceSecs() {
        return maintenanceSecs;
    }

    public void setMaintenanceSecs(double maintenanceSecs) {
        this.maintenanceSecs = maintenanceSecs;
    }
}
