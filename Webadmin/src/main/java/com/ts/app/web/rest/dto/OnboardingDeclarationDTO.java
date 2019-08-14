package com.ts.app.web.rest.dto;

public class OnboardingDeclarationDTO extends BaseDTO{
	
	private long id;
	
	private String langCode;
	
	private String language;
	
	private String declarationText;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getLangCode() {
		return langCode;
	}

	public void setLangCode(String langCode) {
		this.langCode = langCode;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String getDeclarationText() {
		return declarationText;
	}

	public void setDeclarationText(String declarationText) {
		this.declarationText = declarationText;
	}
}
