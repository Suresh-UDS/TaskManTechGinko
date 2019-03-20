package com.ts.app.web.rest.dto;

public class WbsDTO {
	private String wbsId;
	private String wbsName;
	private String wbsDes;
	private String position;
	private String positionDescription;
	private String activityDescription;
	private String activityNo;
	private String activityId;
	private String gross;

	// ArrayList<AdditionalProperties> additionalProperties = new ArrayList<>();
	
	public String getWbsId() {
		return wbsId;
	}

	public void setWbsId(String wbsId) {
		this.wbsId = wbsId;
	}

	public String getWbsName() {
		return wbsName;
	}

	public void setWbsName(String wbsName) {
		this.wbsName = wbsName;
	}

	public String getWbsDes() {
		return wbsDes;
	}

	public void setWbsDes(String wbsDes) {
		this.wbsDes = wbsDes;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public String getPositionDescription() {
		return positionDescription;
	}

	public void setPositionDescription(String positionDescription) {
		this.positionDescription = positionDescription;
	}

	public String getActivityDescription() {
		return activityDescription;
	}

	public void setActivityDescription(String activityDescription) {
		this.activityDescription = activityDescription;
	}

	public String getActivityNo() {
		return activityNo;
	}

	public void setActivityNo(String activityNo) {
		this.activityNo = activityNo;
	}

	public String getActivityId() {
		return activityId;
	}

	public void setActivityId(String activityId) {
		this.activityId = activityId;
	}

	public String getGross() {
		return gross;
	}

	public void setGross(String gross) {
		this.gross = gross;
	}
}
