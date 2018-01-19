package com.ts.app.web.rest.dto;

import java.util.Date;

/**
 * Created by karthick on 7/1/2017.
 */
public class AssetDTO extends BaseDTO {

    private Long id;
    private String title;
    private String code;
    private String description;
    private Long siteId;
    private String siteName;
    private Date endTime;
    private Date startTime;
    private boolean udsAsset;
    private String qrCodeImage;

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


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public Long getSiteId() {
        return siteId;
    }

    public void setSiteId(Long siteId) {
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
}
