package com.ts.app.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "onboarding_declaration")
public class OnboardingDeclaration extends AbstractAuditingEntity implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@NotNull
	private String langCode;
	
	private String language;
	
	@Lob
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
