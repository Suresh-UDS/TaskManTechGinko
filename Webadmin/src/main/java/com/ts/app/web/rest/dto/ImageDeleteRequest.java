package com.ts.app.web.rest.dto;

import java.util.List;

public class ImageDeleteRequest {

	private List<String> imageIds;
	
	private List<Long> transIds;

	public List<String> getImageIds() {
		return imageIds;
	}

	public void setImageIds(List<String> imageIds) {
		this.imageIds = imageIds;
	}

	public List<Long> getTransIds() {
		return transIds;
	}

	public void setTransIds(List<Long> transIds) {
		this.transIds = transIds;
	}
	
	
}
