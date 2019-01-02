package com.ts.app.domain;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Project
 */
@Entity
@Table(name = "project")
@Cacheable(true)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Project extends AbstractAuditingEntity implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull  
    @Size(min = 1, max = 50)
    @Column(length = 50, unique = true, nullable = false)
    private String name;   

    @OneToMany(mappedBy = "project")  
    private Set<Site> site;  

    @OneToMany(mappedBy = "project",fetch=FetchType.LAZY)  
    private Set<EmployeeProjectSite> employeeProjSites;  

    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userId", nullable = false)
	private User user;
	
    @Column(name = "contact_first_name", length = 50)
    private String contactFirstName;
    
    @Column(name = "contact_last_name", length = 50)
    private String contactLastName;
	
	private String phone;
	private String email;
	
	private Date startDate;
	private Date endDate;
	
	private String address;
	private String country;
	private String state;
	
	private float addressLat;
	private float addressLng;
	
	@OneToMany(mappedBy="project", fetch = FetchType.LAZY)
	private List<Shift> shifts;
	
	@Column(name = "client_group", nullable = true)
	private String clientGroup;

	public Long getId() {
		return id;
	}



	public void setId(Long id) {
		this.id = id;
	}



	public String getName() {
		return name;
	}



	public void setName(String name) {
		this.name = name;
	}

	public Set<Site> getSite() {
		return site;
	}



	public void setSite(Set<Site> site) {
		this.site = site;
	}



	public User getUser() {
		return user;
	}



	public void setUser(User user) {
		this.user = user;
	}



	public String getPhone() {
		return phone;
	}



	public void setPhone(String phone) {
		this.phone = phone;
	}



	public String getEmail() {
		return email;
	}



	public void setEmail(String email) {
		this.email = email;
	}



	public String getAddress() {
		return address;
	}



	public void setAddress(String address) {
		this.address = address;
	}



	public Date getStartDate() {
		return startDate;
	}



	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}



	public Date getEndDate() {
		return endDate;
	}



	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}



	public float getAddressLat() {
		return addressLat;
	}



	public void setAddressLat(float addressLat) {
		this.addressLat = addressLat;
	}



	public float getAddressLng() {
		return addressLng;
	}



	public void setAddressLng(float addressLng) {
		this.addressLng = addressLng;
	}



	public String getCountry() {
		return country;
	}



	public void setCountry(String country) {
		this.country = country;
	}



	public String getState() {
		return state;
	}



	public void setState(String state) {
		this.state = state;
	}



	public String getContactFirstName() {
		return contactFirstName;
	}



	public void setContactFirstName(String contactFirstName) {
		this.contactFirstName = contactFirstName;
	}



	public String getContactLastName() {
		return contactLastName;
	}



	public void setContactLastName(String contactLastName) {
		this.contactLastName = contactLastName;
	}



	public List<Shift> getShifts() {
		return shifts;
	}



	public void setShifts(List<Shift> shifts) {
		this.shifts = shifts;
	}



	public Set<EmployeeProjectSite> getEmployeeProjSites() {
		return employeeProjSites;
	}



	public void setEmployeeProjSites(Set<EmployeeProjectSite> employeeProjSites) {
		this.employeeProjSites = employeeProjSites;
	}



	public String getClientGroup() {
		return clientGroup;
	}



	public void setClientGroup(String clientGroup) {
		this.clientGroup = clientGroup;
	}

	

}
