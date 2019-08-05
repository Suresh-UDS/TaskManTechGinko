package com.ts.app.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Entity
@Table(name = "onboarding_user_config")
public class OnboardingUserConfig extends AbstractAuditingEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@NotNull
	@Size(min = 1, max = 250)
	@Column(length = 250, nullable = false)
	private long userId;
	
	@NotNull
	@Size(min = 1, max = 250)
	@Column(length = 250,nullable = false)
	private String elementParent;
	
	@NotNull
	@Size(min = 1, max =250)
	@Column(length = 250, nullable = false)
	private String element;
	
	@NotNull
	@Size(min = 1, max =250)
	@Column(length = 250, nullable = false)
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
