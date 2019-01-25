package com.ts.app.web.rest.dto;


import java.util.Date;

import javax.validation.constraints.Size;

import com.ts.app.domain.Project;

/**
 * A DTO representing a Project.
 */
public class ProjectDTO extends BaseDTO {  

   
	
    @Size(min = 1, max = 50)
    private String name;
    
    private long id;
    
    private String contactFirstName;
    
    private String contactLastName;
    
    private String phone;
	private String email;
	private String address;
	private String country;
	private String state;
	
	private Date startDate;
	private Date endDate;
	
	private float addressLat;
	private float addressLng;
	
	private String clientGroup;
    

    public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ProjectDTO() {
    }

    public ProjectDTO(Project project) {
        this(project.getName());
    }

    public ProjectDTO(String name) {

        this.name = name;
        
    }
   

    @Override
    public String toString() {
        return "ProjectDTO{" +
            "name='" + name +
           
            "}";
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

	public String getClientGroup() {
		return clientGroup;
	}

	public void setClientGroup(String clientGroup) {
		this.clientGroup = clientGroup;
	}
	
	
}
