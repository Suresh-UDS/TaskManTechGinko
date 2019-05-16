package com.ts.app.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;
import java.util.Set;


@Entity
@Table(name = "employee")
//@Cacheable(true)
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
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
    @Column(length = 50, nullable = false)
    private String fullName;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(length = 50, nullable = true)
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


    @OneToMany(mappedBy="employee",cascade={CascadeType.ALL}, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<EmployeeProjectSite> projectSites;

    @OneToMany(mappedBy="employee",cascade={CascadeType.ALL}, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<EmployeeLocation> locations;

    @OneToMany(mappedBy="employee",cascade={CascadeType.ALL}, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<EmployeeReliever> relievers;

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

    private String email;

    private boolean client;

    private String faceId;

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

    public Set<Employee> getSubOrdinates() 
    {
        return subOrdinates;
    }

    public void setSubOrdinates(Set<Employee> subOrdinates) {
        this.subOrdinates = subOrdinates;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isClient() {
        return client;
    }

    public void setClient(boolean client) {
        this.client = client;
    }

    public String getFaceId() {
        return faceId;
    }

    public void setFaceId(String faceId) {
        this.faceId = faceId;
    }

	public List<EmployeeReliever> getRelievers() {
		return relievers;
	}

	public void setRelievers(List<EmployeeReliever> relievers) {
		this.relievers = relievers;
	}
    
    @Override
    public String toString() {
        return "Employee{" +
            "name='" + name +
            "managerID -" + (manager != null ? manager.getId() : "")+
            "managerName-"+ (manager != null ? manager.getName() : "")+
            "}";
    }


    
}
