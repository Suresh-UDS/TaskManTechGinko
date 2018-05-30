package com.ts.app.domain;

import java.io.Serializable;
import java.sql.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Created by karthick on 7/1/2017.
 */

@Entity
@Table(name = "asset")
//@Cacheable(true)
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Asset extends AbstractAuditingEntity implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Size(min = 1, max = 250)
    @Column(length = 250, nullable = false)
    private String title;

    @NotNull
    @Size(min = 1, max = 250)
    @Column(length = 250, nullable = false)
    private String code;

    @Size(min = 1, max = 2500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "siteId", nullable = false)
    private Site site;
    
    @Column(name="qr_code_image")
    private String qrCodeImage;
    
    private String assetType;
    
    private String assetGroup;
    
    private String block;
    
    private String floor;
    
    private String zone;
    
	private double addressLat;
	private double addressLng;

    private Date startTime;
    private Date endTime;
    
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "manufacturerId", referencedColumnName = "id", nullable = true, insertable = true, updatable = false)
    private Manufacturer manufacturer;
    
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vendorId", referencedColumnName = "id", nullable = true, insertable = true, updatable = false)
    private Vendor amcVendor;
    
    private String modelNumber;
    
    private String serialNumber;
    
    private Date acquiredDate;
    
    private double purchasePrice;
    
    private double currentPrice;
    
    private double estimatedDisposePrice;
    
    private Date warrentyExpiryDate;
        
	@OneToMany(mappedBy="asset",cascade={CascadeType.ALL}, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<AssetPPMSchedule> ppmSchedules;
    
	@OneToMany(mappedBy="asset",cascade={CascadeType.ALL}, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<AssetAMCSchedule> amcSchedules;

	@OneToMany(mappedBy="asset",cascade={CascadeType.ALL}, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<AssetDocument> amcDocuments;
	
	private boolean udsAsset;

	public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
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

    public void setDescription(String description) {
        this.description = description;
    }

    public Site getSite() {
        return site;
    }

    public void setSite(Site site) {
        this.site = site;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
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

    public String getQrCodeImage() {
        return qrCodeImage;
    }

    public void setQrCodeImage(String qrCodeImage) {
        this.qrCodeImage = qrCodeImage;
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
	public Manufacturer getManufacturer() {
		return manufacturer;
	}
	public void setManufacturer(Manufacturer manufacturer) {
		this.manufacturer = manufacturer;
	}
	public Vendor getAmcVendor() {
		return amcVendor;
	}
	public void setAmcVendor(Vendor amcVendor) {
		this.amcVendor = amcVendor;
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
	public List<AssetPPMSchedule> getPpmSchedules() {
		return ppmSchedules;
	}
	public void setPpmSchedules(List<AssetPPMSchedule> ppmSchedules) {
		this.ppmSchedules = ppmSchedules;
	}
	public List<AssetAMCSchedule> getAmcSchedules() {
		return amcSchedules;
	}
	public void setAmcSchedules(List<AssetAMCSchedule> amcSchedules) {
		this.amcSchedules = amcSchedules;
	}
	public List<AssetDocument> getAmcDocuments() {
		return amcDocuments;
	}
	public void setAmcDocuments(List<AssetDocument> amcDocuments) {
		this.amcDocuments = amcDocuments;
	}
    
}

