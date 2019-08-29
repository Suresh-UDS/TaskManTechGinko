package com.ts.app.web.rest.dto;

import java.util.List;

public class OnboardingUserConfigDTO extends BaseDTO{
	
	private long id;
	
	private long userId;

	private long onBoardingUserId;
	
	private String elementParent;
	
	private String element;
	
	private String elementType;

	private String elementCode;
	
	private String branch;

	private boolean isSelected;

    private List<OnboardingUserConfigDTO> childElements;

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

    public long getOnBoardingUserId() {
        return onBoardingUserId;
    }

    public void setOnBoardingUserId(long onBoardingUserId) {
        this.onBoardingUserId = onBoardingUserId;
    }

    public List<OnboardingUserConfigDTO> getChildElements() {
        return childElements;
    }

    public void setChildElements(List<OnboardingUserConfigDTO> childElements) {
        this.childElements = childElements;
    }

    public String getElementCode() {
        return elementCode;
    }

    public void setElementCode(String elementCode) {
        this.elementCode = elementCode;
    }

    public boolean isSelected() {
        return isSelected;
    }

    public void setSelected(boolean selected) {
        isSelected = selected;
    }

	public String getBranch() {
		return branch;
	}

	public void setBranch(String branch) {
		this.branch = branch;
	}

	
    
    
}
