package com.ts.app.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "face_profile")
@Cacheable(true)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FaceProfile extends AbstractAuditingEntity implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employeeId", nullable = false)
	private Employee employee;
	
	private String profileData;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public String getProfileData() {
		return profileData;
	}

	public void setProfileData(String profileData) {
		this.profileData = profileData;
	}

	


}
