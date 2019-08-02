package com.ts.app.web.rest.dto;

public class OnboardingUserConfigDTO extends BaseDTO{
	
	private long id;
	
	private long userId;
	
	private String elementParent;
	
	private String element;
	
	private String elementType;
	

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

	public String getElementParent() {
		return elementParent;
	}

	public void setElementParent(String elementParent) {
		this.elementParent = elementParent;
	}

	public String getElement() {
		return element;
	}

	public void setElement(String element) {
		this.element = element;
	}

	public String getElementType() {
		return elementType;
	}

	public void setElementType(String elementType) {
		this.elementType = elementType;
	}
	
	
}
