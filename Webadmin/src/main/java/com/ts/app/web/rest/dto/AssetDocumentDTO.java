package com.ts.app.web.rest.dto;

import java.io.Serializable;
import java.util.Date;

import org.springframework.web.multipart.MultipartFile;

public class AssetDocumentDTO extends BaseDTO implements Serializable {

	 private static final long serialVersionUID = 1L;
	
	 private Long id; 
	 
	 private String title;
	 
	 private String file;
	 	 
	 private long assetId;
	 
	 private Date uploadedDate;

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
	
	public String getFile() {
		return file;
	}

	public void setFile(String file) {
		this.file = file;
	}

	public long getAssetId() {
		return assetId;
	}
	
	public void setAssetId(long assetId) {
		this.assetId = assetId;
	}
	
	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public Date getUploadedDate() {
		return uploadedDate;
	}

	public void setUploadedDate(Date uploadedDate) {
		this.uploadedDate = uploadedDate;
	}
	 
	 
	
}
