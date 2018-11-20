package com.ts.app.web.rest.dto;


import com.ts.app.domain.Site;

import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;

/**
 * A DTO representing a Site
 */
public class SiteDTO extends BaseDTO {



    @Size(min = 1, max = 50)
    private String name;

    private long id;

    private long projectId;

    private String projectName;


	private Date startDate;
	private Date endDate;

	private String address;
	private String country;
	private String state;

	private double addressLat;
	private double addressLng;

	private double radius;

	private String branch;

	private String region;

	private List<ShiftDTO> shifts;

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

	public long getProjectId() {
		return projectId;
	}

	public void setProjectId(long projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public SiteDTO() {
    }

    public SiteDTO(Site site) {
        this(site.getName());
    }

    public SiteDTO(String name) {

        this.name = name;

    }


    @Override
    public String toString() {
        return "SiteDTO{" +
            "name='" + name +

            "}";
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

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public double getAddressLat() {
		return addressLat;
	}

	public void setAddressLat(double addressLat) {
		this.addressLat = addressLat;
	}

	public double getAddressLng() {
		return addressLng;
	}

	public void setAddressLng(double addressLng) {
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

    public double getRadius() {
        return radius;
    }

    public void setRadius(double radius) {
        this.radius = radius;
    }

	public List<ShiftDTO> getShifts() {
		return shifts;
	}

	public void setShifts(List<ShiftDTO> shifts) {
		this.shifts = shifts;
	}


    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }
}
