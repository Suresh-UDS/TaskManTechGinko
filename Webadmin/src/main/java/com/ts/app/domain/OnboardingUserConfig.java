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

    @OneToOne(fetch = FetchType.LAZY,optional=true)
    @JoinColumn(name = "userId", nullable = true)
    private User user;
	
	@Size(min = 1, max = 250)
	@Column(length = 250)
	private String elementParent;
	
	@NotNull
	@Size(min = 1, max =250)
	@Column(length = 250, nullable = false)
	private String element;
	
	@NotNull
	@Size(min = 1, max =250)
	@Column(length = 250, nullable = false)
	private String elementType;

    @NotNull
    @Size(min = 1, max =250)
    @Column(length = 250, nullable = false)
    private String elementCode;
    
    @NotNull
    @Size(min = 1, max =250)
    @Column(length = 250, nullable = false)
    private String branch;

	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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

    public String getElementCode() { return elementCode;    }

    public void setElementCode(String elementCode) { this.elementCode = elementCode; }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

	public String getBranch() {
		return branch;
	}

	public void setBranch(String branch) {
		this.branch = branch;
	}
    
    
}
