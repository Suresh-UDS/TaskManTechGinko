package com.ts.app.web.rest.dto;

import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Asset;
import com.ts.app.service.util.MapperUtil;
 

/**
 * Created by karthick on 7/1/2017.
 */
public class AssetDTO extends BaseDTO {

    private long id;
    private int rowNumber; 
    private String title;
    private String code;
    private String description;
    private long siteId;
    private long siteSiteId;
    private long projectId;
    private String projectName;
    private String siteName;
    private Date endTime;
    private Date startTime;
    private boolean udsAsset;
    private String qrCodeImage;
    private String group;
    private String type;
    private String assetType;
    private long assetTypeId;
    private String assetGroup;
    private long assetGroupId;
    private String status;
    private String block;
    private String floor;
    private String zone;
	private double addressLat;
	private double addressLng;
	private long manufacturerId;
	private String manufacturerName;
	private long vendorId;
	private String amcVendorName;
	private String modelNumber;
    private String serialNumber;
    private Date acquiredDate;
    private double purchasePrice;
    private double currentPrice;
    private double estimatedDisposePrice;
    private Date warrantyExpiryDate;
    private Date warrantyFromDate;
    private Date warrantyToDate;
    private String assetCode;
    private String amcDocumentTitle;
    private String amcDocumentFile;
    private Date amcDocumentUploadDate;
    private String assetPpmTitle;
    private String warrantyType;
    private String url;
    private String parentAssetCode;
    private long parentAssetId;
    
    private Asset parentAsset;
    
    private boolean inserted;
    private List<Asset> assets;
    private List<AssetDTO> childAssets;
    private List<AssetTicketConfigDTO> criticalStatusList;

    @Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;
    
	public Date getWarrantyFromDate() {
		return warrantyFromDate;
	}
	public void setWarrantyFromDate(Date warrantyFromDate) {
		this.warrantyFromDate = warrantyFromDate;
	}
	public Date getWarrantyToDate() {
		return warrantyToDate;
	}
	public void setWarrantyToDate(Date warrantyToDate) {
		this.warrantyToDate = warrantyToDate;
	}
	public long getAssetTypeId() {
		return assetTypeId;
	}
	public void setAssetTypeId(long assetTypeId) {
		this.assetTypeId = assetTypeId;
	}
	public long getAssetGroupId() {
		return assetGroupId;
	}
	public void setAssetGroupId(long assetGroupId) {
		this.assetGroupId = assetGroupId;
	}
	public long getSiteSiteId() {
		return siteSiteId;
	}
	public void setSiteSiteId(long siteSiteId) {
		this.siteSiteId = siteSiteId;
	}
	public String getManufacturerName() {
		return manufacturerName;
	}
	public void setManufacturerName(String manufacturerName) {
		this.manufacturerName = manufacturerName;
	}
	public String getAmcVendorName() {
		return amcVendorName;
	}
	public void setAmcVendorName(String amcVendorName) {
		this.amcVendorName = amcVendorName;
	}
	public long getProjectId() {
		return projectId;
	}
	public void setProjectId(long projectId) {
		this.projectId = projectId;
	}
	public String getAssetType() {
		return assetType;
	}
	public void setAssetType(String assetType) {
		this.assetType = assetType;
	}
	public String getAssetGroup() {
		return assetGroup;
	}
	public void setAssetGroup(String assetGroup) {
		this.assetGroup = assetGroup;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getBlock() {
		return block;
	}
	public void setBlock(String block) {
		this.block = block;
	}
	public String getFloor() {
		return floor;
	}
	public void setFloor(String floor) {
		this.floor = floor;
	}
	public String getZone() {
		return zone;
	}
	public void setZone(String zone) {
		this.zone = zone;
	}
	public double getAddressLat() {
		return addressLat;
	}
	public void setAddressLat(double addressLat) {
		this.addressLat = addressLat;
	}
	public double getAddressLng() {
		return addressLng;
	}
	public void setAddressLng(double addressLng) {
		this.addressLng = addressLng;
	}
	public long getManufacturerId() {
		return manufacturerId;
	}
	public void setManufacturerId(long manufacturerId) {
		this.manufacturerId = manufacturerId;
	}
	public long getVendorId() {
		return vendorId;
	}
	public void setVendorId(long vendorId) {
		this.vendorId = vendorId;
	}
	public String getModelNumber() {
		return modelNumber;
	}
	public void setModelNumber(String modelNumber) {
		this.modelNumber = modelNumber;
	}
	public String getSerialNumber() {
		return serialNumber;
	}
	public void setSerialNumber(String serialNumber) {
		this.serialNumber = serialNumber;
	}
	
	public Date getAcquiredDate() {
		return acquiredDate;
	}
	public void setAcquiredDate(Date acquiredDate) {
		this.acquiredDate = acquiredDate;
	}
	public double getPurchasePrice() {
		return purchasePrice;
	}
	public void setPurchasePrice(double purchasePrice) {
		this.purchasePrice = purchasePrice;
	}
	public double getCurrentPrice() {
		return currentPrice;
	}
	public void setCurrentPrice(double currentPrice) {
		this.currentPrice = currentPrice;
	}
	public double getEstimatedDisposePrice() {
		return estimatedDisposePrice;
	}
	public void setEstimatedDisposePrice(double estimatedDisposePrice) {
		this.estimatedDisposePrice = estimatedDisposePrice;
	}
	public Date getWarrantyExpiryDate() {
		return warrantyExpiryDate;
	}
	public void setWarrantyExpiryDate(Date warrentyExpiryDate) {
		this.warrantyExpiryDate = warrentyExpiryDate;
	}
	public String getAssetCode() {
		return assetCode;
	}
	public void setAssetCode(String assetCode) {
		this.assetCode = assetCode;
	}
	public String getGroup() {
		return group;
	}
	public void setGroup(String group) {
		this.group = group;
	}
	public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String desc) {
        this.description = desc;
    }


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public long getSiteId() {
        return siteId;
    }

    public void setSiteId(long siteId) {
        this.siteId = siteId;
    }

    public boolean isUdsAsset() {
		return udsAsset;
	}
	public void setUdsAsset(boolean udsAsset) {
		this.udsAsset = udsAsset;
	}
	public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }


    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public String getQrCodeImage() {
        return qrCodeImage;
    }

    public void setQrCodeImage(String qrCodeImage) {
        this.qrCodeImage = qrCodeImage;
    }

	public String getAmcDocumentTitle() {
		return amcDocumentTitle;
	}

	public void setAmcDocumentTitle(String amcDocumentTitle) {
		this.amcDocumentTitle = amcDocumentTitle;
	}

	public String getAmcDocumentFile() {
		return amcDocumentFile;
	}

	public void setAmcDocumentFile(String amcDocumentFile) {
		this.amcDocumentFile = amcDocumentFile;
	}

	public Date getAmcDocumentUploadDate() {
		return amcDocumentUploadDate;
	}

	public void setAmcDocumentUploadDate(Date amcDocumentUploadDate) {
		this.amcDocumentUploadDate = amcDocumentUploadDate;
	}
	public String getAssetPpmTitle() {
		return assetPpmTitle;
	}
	public void setAssetPpmTitle(String assetPpmTitle) {
		this.assetPpmTitle = assetPpmTitle;
	}

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
	public String getWarrantyType() {
		return warrantyType;
	}
	public void setWarrantyType(String warrantyType) {
		this.warrantyType = warrantyType;
	}
	public String getProjectName() {
		return projectName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getParentAssetCode() {
		return parentAssetCode;
	}
	public void setParentAssetCode(String parentAssetCode) {
		this.parentAssetCode = parentAssetCode;
	}
	public boolean isInserted() {
		return inserted;
	}
	public void setInserted(boolean inserted) {
		this.inserted = inserted;
	}
	public long getParentAssetId() {
		return parentAssetId;
	}
	public void setParentAssetId(long parentAssetId) {
		this.parentAssetId = parentAssetId;
	}
	public long getParentAsset() {
		return parentAsset.getId();
	}
	public void setParentAsset(Asset parentAsset) {
	    if(parentAsset!=null) {
            this.parentAssetId= parentAsset.getId();
        }
	}
	public int getRowNumber() {
		return rowNumber;
	}
	public void setRowNumber(int rowNumber) {
		this.rowNumber = rowNumber;
	}
	public List<AssetDTO> getAssets() {
		return childAssets;
	}
	public void setAssets(List<Asset> assets) {
		this.assets = assets;
	}
	public List<AssetDTO> getChildAssets() {
		return childAssets;
	}
	public void setChildAssets(List<AssetDTO> childAssets) {
		this.childAssets = childAssets;
	}
	public List<AssetTicketConfigDTO> getCriticalStatusList() {
		return criticalStatusList;
	}
	public void setCriticalStatusList(List<AssetTicketConfigDTO> criticalStatusList) {
		this.criticalStatusList = criticalStatusList;
	}
	
}
