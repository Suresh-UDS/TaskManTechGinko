package com.ts.app.ext.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class KairosVerifyResponse {

	private Image[] images;
	
	public Image[] getImages() {
		return images;
	}

	public void setImages(Image[] images) {
		this.images = images;
	}

	public static class Image {
		
		private Transaction transaction;

		public Transaction getTransaction() {
			return transaction;
		}

		public void setTransaction(Transaction transaction) {
			this.transaction = transaction;
		}
		
		
	}
	
	public static class Transaction {
		
		private String status;
		
		@JsonProperty("subject_id")
		private String subjectId;
		
		private double quality;
		
		private int width;
		
		private int height;
		
		private int topLeftX;
		
		private int topLeftY;
		
		private double confidence;
		
		@JsonProperty("gallery_name")
		private String galleryName;

		public String getStatus() {
			return status;
		}

		public void setStatus(String status) {
			this.status = status;
		}

		public String getSubjectId() {
			return subjectId;
		}

		public void setSubjectId(String subjectId) {
			this.subjectId = subjectId;
		}

		public double getQuality() {
			return quality;
		}

		public void setQuality(double quality) {
			this.quality = quality;
		}

		public int getWidth() {
			return width;
		}

		public void setWidth(int width) {
			this.width = width;
		}

		public int getHeight() {
			return height;
		}

		public void setHeight(int height) {
			this.height = height;
		}

		public int getTopLeftX() {
			return topLeftX;
		}

		public void setTopLeftX(int topLeftX) {
			this.topLeftX = topLeftX;
		}

		public int getTopLeftY() {
			return topLeftY;
		}

		public void setTopLeftY(int topLeftY) {
			this.topLeftY = topLeftY;
		}

		public double getConfidence() {
			return confidence;
		}

		public void setConfidence(double confidence) {
			this.confidence = confidence;
		}

		public String getGalleryName() {
			return galleryName;
		}

		public void setGalleryName(String galleryName) {
			this.galleryName = galleryName;
		}
		
		
	}
}
