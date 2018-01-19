package com.ts.app.ext.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class KairosResponse {

	private Image[] images;
	
	@JsonProperty("uploaded_image_url")
	private String uploadedImageUrl;
	
	@JsonProperty("Errors")
	private Error[] errors;
	
	public Image[] getImages() {
		return images;
	}

	public void setImages(Image[] images) {
		this.images = images;
	}

	public String getUploadedImageUrl() {
		return uploadedImageUrl;
	}

	public void setUploadedImageUrl(String uploadedImageUrl) {
		this.uploadedImageUrl = uploadedImageUrl;
	}
	

	public Error[] getErrors() {
		return errors;
	}

	public void setErrors(Error[] errors) {
		this.errors = errors;
	}




	public static class Image {
		
		private String status;
		
		private String width;
		
		private String height;
		
		private String file;
		
		private Face[] faces;

		public String getStatus() {
			return status;
		}

		public void setStatus(String status) {
			this.status = status;
		}

		public String getWidth() {
			return width;
		}

		public void setWidth(String width) {
			this.width = width;
		}

		public String getHeight() {
			return height;
		}

		public void setHeight(String height) {
			this.height = height;
		}

		public String getFile() {
			return file;
		}

		public void setFile(String file) {
			this.file = file;
		}

		public Face[] getFaces() {
			return faces;
		}

		public void setFaces(Face[] faces) {
			this.faces = faces;
		}
		
		
	}
	
	public static class Face {
		
		private int topLeftX;
		
		private int topLeftY;
		
		private int height;
		
		private int rightEyeCenterY;
		
		private int rightEyeCenterX;
		
		private int pitch;
		
		private double quality;
		
		private double confidence;
		
		private int chinTipX;
		
		private int yaw;
		
		private int chinTipY;
		
		private int eyeDistance;
		
		private int width;
		
		private int leftEyeCenterY;
		
		private int leftEyeCenterX;
		
		private Attribute attributes;
		
		@JsonProperty("face_id")
		private int faceId;
		
		private int roll;

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

		public int getHeight() {
			return height;
		}

		public void setHeight(int height) {
			this.height = height;
		}

		public int getRightEyeCenterY() {
			return rightEyeCenterY;
		}

		public void setRightEyeCenterY(int rightEyeCenterY) {
			this.rightEyeCenterY = rightEyeCenterY;
		}

		public int getRightEyeCenterX() {
			return rightEyeCenterX;
		}

		public void setRightEyeCenterX(int rightEyeCenterX) {
			this.rightEyeCenterX = rightEyeCenterX;
		}

		public int getPitch() {
			return pitch;
		}

		public void setPitch(int pitch) {
			this.pitch = pitch;
		}

		public double getQuality() {
			return quality;
		}

		public void setQuality(double quality) {
			this.quality = quality;
		}

		public double getConfidence() {
			return confidence;
		}

		public void setConfidence(double confidence) {
			this.confidence = confidence;
		}

		public int getChinTipX() {
			return chinTipX;
		}

		public void setChinTipX(int chinTipX) {
			this.chinTipX = chinTipX;
		}

		public int getYaw() {
			return yaw;
		}

		public void setYaw(int yaw) {
			this.yaw = yaw;
		}

		public int getChinTipY() {
			return chinTipY;
		}

		public void setChinTipY(int chinTipY) {
			this.chinTipY = chinTipY;
		}

		public int getEyeDistance() {
			return eyeDistance;
		}

		public void setEyeDistance(int eyeDistance) {
			this.eyeDistance = eyeDistance;
		}

		public int getWidth() {
			return width;
		}

		public void setWidth(int width) {
			this.width = width;
		}

		public int getLeftEyeCenterY() {
			return leftEyeCenterY;
		}

		public void setLeftEyeCenterY(int leftEyeCenterY) {
			this.leftEyeCenterY = leftEyeCenterY;
		}

		public int getLeftEyeCenterX() {
			return leftEyeCenterX;
		}

		public void setLeftEyeCenterX(int leftEyeCenterX) {
			this.leftEyeCenterX = leftEyeCenterX;
		}

		public Attribute getAttributes() {
			return attributes;
		}

		public void setAttributes(Attribute attributes) {
			this.attributes = attributes;
		}

		public int getFaceId() {
			return faceId;
		}

		public void setFaceId(int faceId) {
			this.faceId = faceId;
		}

		public int getRoll() {
			return roll;
		}

		public void setRoll(int roll) {
			this.roll = roll;
		}
		
		
		
	}
	
	public static class Attribute {
		
		private String lips;
		
		private double asian;
		
		private Gender gender;
		
		private int age;
		
		private double hispanic;
		
		private double other;
		
		private double black;
		
		private double white;
		
		private String glasses;

		public String getLips() {
			return lips;
		}

		public void setLips(String lips) {
			this.lips = lips;
		}

		public double getAsian() {
			return asian;
		}

		public void setAsian(double asian) {
			this.asian = asian;
		}

		public Gender getGender() {
			return gender;
		}

		public void setGender(Gender gender) {
			this.gender = gender;
		}

		public int getAge() {
			return age;
		}

		public void setAge(int age) {
			this.age = age;
		}

		public double getHispanic() {
			return hispanic;
		}

		public void setHispanic(double hispanic) {
			this.hispanic = hispanic;
		}

		public double getOther() {
			return other;
		}

		public void setOther(double other) {
			this.other = other;
		}

		public double getBlack() {
			return black;
		}

		public void setBlack(double black) {
			this.black = black;
		}

		public double getWhite() {
			return white;
		}

		public void setWhite(double white) {
			this.white = white;
		}

		public String getGlasses() {
			return glasses;
		}

		public void setGlasses(String glasses) {
			this.glasses = glasses;
		}

		
	}
	
	public static class Gender {
		
		private double femaleConfidence;
		
		private String type;
		
		private String maleConfidence;

		public double getFemaleConfidence() {
			return femaleConfidence;
		}

		public void setFemaleConfidence(double femaleConfidence) {
			this.femaleConfidence = femaleConfidence;
		}

		public String getType() {
			return type;
		}

		public void setType(String type) {
			this.type = type;
		}

		public String getMaleConfidence() {
			return maleConfidence;
		}

		public void setMaleConfidence(String maleConfidence) {
			this.maleConfidence = maleConfidence;
		}
		
		
	}
	
	public static class Error {
		
		@JsonProperty("Message")
		private String message;
		
		@JsonProperty("ErrCode")
		private String errCode;

		public String getMessage() {
			return message;
		}

		public void setMessage(String message) {
			this.message = message;
		}

		public String getErrCode() {
			return errCode;
		}

		public void setErrCode(String errCode) {
			this.errCode = errCode;
		}
		
	}
	
	
}


