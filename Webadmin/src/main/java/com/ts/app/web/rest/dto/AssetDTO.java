package com.ts.app.web.rest.dto;

import java.util.Date;

/**
 * Created by karthick on 7/1/2017.
 */
public class AssetDTO extends BaseDTO {

    private long id;
    private String title;
    private String code;
    private String description;
    private long siteId;
    private long projectId;
    private String siteName;
    private Date endTime;
    private Date startTime;
    private boolean udsAsset;
    private String qrCodeImage;
    private String group;
    private String type;
    private String assetType;
    private String assetGroup;
    private String block;
    private String floor;
    private String zone;
    private double addressLat;
	private double addressLng;
	private long manufacturerId;
	private long vendorId;
	private String modelNumber;
    private String serialNumber;
    private Date acquiredDate;
    private double purchasePrice;
    private double currentPrice;
    private double estimatedDisposePrice;
    private Date warrentyExpiryDate;
    private String assetCode;
    private String amcDocumentTitle;
    private String amcDocumentFile;
    private Date amcDocumentUploadDate;
    private String assetPpmTitle;

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
	public Date getWarrentyExpiryDate() {
		return warrentyExpiryDate;
	}
	public void setWarrentyExpiryDate(Date warrentyExpiryDate) {
		this.warrentyExpiryDate = warrentyExpiryDate;
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
}
