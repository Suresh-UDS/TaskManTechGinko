package com.ts.app.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.Cacheable;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import org.hibernate.annotations.Cascade;


@Entity
@Table(name = "employee")
@Cacheable(true)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Employee extends AbstractAuditingEntity implements Serializable {

	/**
	*
	*/
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@NotNull
	@Size(min = 1, max = 10)
	@Column(length = 10, unique = true, nullable = false)
	private String empId;

	@NotNull
	@Size(min = 1, max = 50)
	@Column(length = 50, unique = true, nullable = false)
	private String fullName;

	@NotNull
	@Size(min = 1, max = 50)
	@Column(length = 50, nullable = true, unique = true)
	private String name;

    private String lastName;

	@Column(name="qr_code_image")
	private String qrCodeImage;

	@OneToOne(fetch = FetchType.LAZY,optional=true)
	@JoinColumn(name = "userId", nullable = true)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY, cascade={CascadeType.MERGE,CascadeType.PERSIST,CascadeType.REFRESH})
	@JoinColumn(name = "managerId", referencedColumnName = "id", nullable = true)
	private Employee manager;

	@OneToMany(mappedBy="manager")
	private Set<Employee> subOrdinates;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(length = 50, nullable = true)
    private String designation;

    @ManyToMany(cascade={CascadeType.ALL}, fetch = FetchType.LAZY)
    @JoinTable(
        name = "employee_project",
        joinColumns = {@JoinColumn(name = "employee_id", referencedColumnName = "id")},
        inverseJoinColumns = {@JoinColumn(name = "project_id", referencedColumnName = "id")})
	private List<Project> projects;

    @ManyToMany(cascade={CascadeType.ALL}, fetch = FetchType.LAZY)
    @JoinTable(
        name = "employee_site",
        joinColumns = {@JoinColumn(name = "employee_id", referencedColumnName = "id")},
        inverseJoinColumns = {@JoinColumn(name = "site_id", referencedColumnName = "id")})
	private List<Site> sites;

	@OneToMany(mappedBy="employee",cascade={CascadeType.ALL}, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<EmployeeProjectSite> projectSites;

	@OneToMany(mappedBy="employee",cascade={CascadeType.ALL}, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<EmployeeLocation> locations;

	@NotNull
	@Column(length = 10, nullable = true)
	private long code;
	
	private boolean isFaceIdEnrolled;

	private boolean isFaceAuthorised;

	private String enrolled_face;

	private boolean isLeft;

	private boolean isRelieved;

	private boolean isReliever;
	
	private String phone;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getQrCodeImage() {
		return qrCodeImage;
	}

	public void setQrCodeImage(String qrCodeImage) {
		this.qrCodeImage = qrCodeImage;
	}

	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public List<Project> getProjects() {
		if(projects == null) {
			projects = new ArrayList<Project>();
		}
		return projects;
	}

	public void setProjects(List<Project> projects) {
		this.projects = projects;
	}

	public List<Site> getSites() {
		return sites;
	}

	public void setSites(List<Site> sites) {
		if(sites == null) {
			sites = new ArrayList<Site>();
		}
		this.sites = sites;
	}

	public long getCode() {
		return code;
	}

	public void setCode(long code) {
		this.code = code;
	}

	public String getEmpId() {
		return empId;
	}

	public void setEmpId(String empId) {
		this.empId = empId;
	}

	public Employee getManager() {
		return manager;
	}

	public void setManager(Employee manager) {
		this.manager = manager;
	}

	public Set<Employee> getSubOrdinates() {
		return subOrdinates;
	}

	public void setSubOrdinates(Set<Employee> subOrdinates) {
		this.subOrdinates = subOrdinates;
	}

	@Override
    public String toString() {
        return "Employee{" +
            "name='" + name +
            "managerID -" + (manager != null ? manager.getId() : "")+
            "managerName-"+ (manager != null ? manager.getName() : "")+
            "projects-" + (projects !=null ? projects.size() : 0) +
            "sites-" + (sites !=null ? sites.size() : 0) +
            "userId-" + (user!=null ? user.getId() : 0) +
            "}";
    }


    public boolean isFaceAuthorised() {
        return isFaceAuthorised;
    }

    public void setFaceAuthorised(boolean faceAuthorised) {
        isFaceAuthorised = faceAuthorised;
    }

    public boolean isFaceIdEnrolled() {
        return isFaceIdEnrolled;
    }

    public void setFaceIdEnrolled(boolean faceIdEnrolled) {
        isFaceIdEnrolled = faceIdEnrolled;
    }

    public String getEnrolled_face() {
        return enrolled_face;
    }

    public void setEnrolled_face(String enrolled_face) {
        this.enrolled_face = enrolled_face;
    }

    public boolean isLeft() {
        return isLeft;
    }

    public void setLeft(boolean left) {
        isLeft = left;
    }

    public boolean isRelieved() {
        return isRelieved;
    }

    public void setRelieved(boolean relieved) {
        isRelieved = relieved;
    }

    public boolean isReliever() {
        return isReliever;
    }

    public void setReliever(boolean reliever) {
        isReliever = reliever;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
	public List<EmployeeProjectSite> getProjectSites() {
		return projectSites;
	}

	public void setProjectSites(List<EmployeeProjectSite> projectSites) {
		this.projectSites = projectSites;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public List<EmployeeLocation> getLocations() {
		return locations;
	}

	public void setLocations(List<EmployeeLocation> locations) {
		this.locations = locations;
	}


}
