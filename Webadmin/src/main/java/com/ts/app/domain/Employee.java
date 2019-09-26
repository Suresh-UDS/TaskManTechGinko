package com.ts.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.sql.Date;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;
//import java.util.Date;


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
 
    @Size(min = 1, max = 10)
    @Column(length = 10, unique = true, nullable = false)
    private String empId;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(length = 50, nullable = false)
    private String fullName;

    //@NotNull
    @Size(min = 1, max = 50)
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

    //@NotNull
    @Size(min = 1, max = 50)
    private String designation;

    @OneToMany(mappedBy="employee",cascade={CascadeType.ALL}, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<EmployeeProjectSite> projectSites;

    @OneToMany(mappedBy="employee",cascade={CascadeType.ALL}, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<EmployeeLocation> locations;

    @OneToMany(mappedBy="employee",cascade={CascadeType.ALL}, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<EmployeeReliever> relievers;

//    @NotNull
//    @Column(length = 10, nullable = true)
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
    
    private String activity;

/*************************Modified by Vinoth***********************************************************/    
    
    @NotNull
    @Size(max = 50)
    private String projectCode;
    
    @NotNull
    @Size(max = 2500)
    private String projectDescription;
    
    @NotNull
    @Size(max = 50)
    private String fatherName;
    
    private String motherName;
    
    @NotNull
    @Size(max = 10)
    @Column(length = 10, nullable = true)
    private String gender;
    
    @NotNull
    @Size(max = 50)
    @Column(length = 50, nullable = true)
    private String maritalStatus;
    
    @NotNull
    private Date dob;
    
    @NotNull
    private Date doj;
    
    private String religion;
    
    private String bloodGroup;
    
    @Size( max = 2500)
    private String personalIdentificationMark1;
    
    @Size(max = 2500)
    private String personalIdentificationMark2;
    
    private String educationalQulification;
    
    private String boardInstitute;
    
    @NotNull
    @Size(max = 16)
    private String adharCardNumber;

    @NotNull
    @Size(max =10)
    private String mobile;
    
    private String emergencyContactNumber;
    
    @NotNull
    private String permanentAddress;
    
    @NotNull
    private String permanentCity;
    
    @NotNull
    private String permanentState;
    
    @NotNull
    private String presentAddress;
    
    private String position;
    
    @NotNull
    private String presentCity;
    
    @NotNull
    private String presentState;
    
    //private String addressProofImage;
    
    @NotNull
    private String nomineeName;
    
    @NotNull 
    private String nomineeRelationship;
    
    private String nomineeContactNumber;
    
    @NotNull
    private double percentage;
    
    private String employer;
    
    private String previousDesignation;
    
    private String accountNumber;
    
    private String ifscCode;
    
    //private String bankPassbookImage;
    
//    private String adharFrontImage;
//    
//    private String adharBackImage;
//    
//    private String fingerPrintLeft;
//    
//    private String fingerPrintRight;
//    
//    private String drivingLicense;
//    
//    private String voterId;
//    
//    private String panCard;
    
    //@NotNull
    private String clientName;
    
    //@NotNull
    private String clientDescription;
    
    @NotNull
    private String wbsId;
    
    @NotNull
    private String wbsDescription;

    private String onBoardSource;

    private String onBoardedFrom;

    private boolean imported;

    private boolean verified;

    private boolean submitted;
    
    private String submittedBy;
    
    private ZonedDateTime submittedOn;
    
    private boolean syncToSAP;

    private boolean newEmployee;
    
    private double gross;
    
    private String onboardedPlace;
    
    private String remarks;
    
    private boolean rejected;
    
    private boolean nonUdsEmployee;

    @OneToOne(fetch = FetchType.LAZY,optional=true,cascade={CascadeType.MERGE,CascadeType.PERSIST,CascadeType.REFRESH})
    @JoinColumn(name = "verified_by", referencedColumnName = "id", nullable = true)
    private User verifiedBy;

    @Column(name = "verified_date")
    private ZonedDateTime verifiedDate;

    @Column(name="synced_by", length = 50)
    private String syncedBy;

    public Employee() {
    }


    public String getOnboardedPlace() {
		return onboardedPlace;
	}


	public void setOnboardedPlace(String onboardedPlace) {
		this.onboardedPlace = onboardedPlace;
	}



	public String getFatherName() {
		return fatherName;
	}

	public void setFatherName(String fatherName) {
		this.fatherName = fatherName;
	}

	public String getMotherName() {
		return motherName;
	}

	public void setMotherName(String motherName) {
		this.motherName = motherName;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getMaritalStatus() {
		return maritalStatus;
	}

	public void setMaritalStatus(String maritalStatus) {
		this.maritalStatus = maritalStatus;
	}

	public Date getDob() {
		return dob;
	}

	public void setDob(Date dob) {
		this.dob = dob;
	}

	public Date getDoj() {
		return doj;
	}

	public void setDoj(Date doj) {
		this.doj = doj;
	}

	public String getReligion() {
		return religion;
	}

	public void setReligion(String religion) {
		this.religion = religion;
	}

	public String getBloodGroup() {
		return bloodGroup;
	}

	public void setBloodGroup(String bloodGroup) {
		this.bloodGroup = bloodGroup;
	}

	public String getPersonalIdentificationMark1() {
		return personalIdentificationMark1;
	}

	public void setPersonalIdentificationMark1(String personalIdentificationMark1) {
		this.personalIdentificationMark1 = personalIdentificationMark1;
	}

	public String getPersonalIdentificationMark2() {
		return personalIdentificationMark2;
	}

	public void setPersonalIdentificationMark2(String personalIdentificationMark2) {
		this.personalIdentificationMark2 = personalIdentificationMark2;
	}

	public String getEducationalQulification() {
		return educationalQulification;
	}

	public void setEducationalQulification(String educationalQulification) {
		this.educationalQulification = educationalQulification;
	}

	public String getBoardInstitute() {
		return boardInstitute;
	}

	public void setBoardInstitute(String boardInstitute) {
		this.boardInstitute = boardInstitute;
	}

	public String getAdharCardNumber() {
		return adharCardNumber;
	}

	public void setAdharCardNumber(String adharCardNumber) {
		this.adharCardNumber = adharCardNumber;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getEmergencyContactNumber() {
		return emergencyContactNumber;
	}

	public void setEmergencyContactNumber(String emergencyContactNumber) {
		this.emergencyContactNumber = emergencyContactNumber;
	}

	public String getPermanentAddress() {
		return permanentAddress;
	}

	public void setPermanentAddress(String permanentAddress) {
		this.permanentAddress = permanentAddress;
	}

	public String getPermanentCity() {
		return permanentCity;
	}

	public void setPermanentCity(String permanentCity) {
		this.permanentCity = permanentCity;
	}

	public String getPermanentState() {
		return permanentState;
	}

	public void setPermanentState(String permanentState) {
		this.permanentState = permanentState;
	}

	public String getPresentAddress() {
		return presentAddress;
	}

	public void setPresentAddress(String presentAddress) {
		this.presentAddress = presentAddress;
	}

	public String getPresentCity() {
		return presentCity;
	}

	public void setPresentCity(String presentCity) {
		this.presentCity = presentCity;
	}

	public String getPresentState() {
		return presentState;
	}

	public void setPresentState(String presentState) {
		this.presentState = presentState;
	}

//	public String getAddressProofImage() {
//		return addressProofImage;
//	}
//
//	public void setAddressProofImage(String addressProofImage) {
//		this.addressProofImage = addressProofImage;
//	}

	public String getNomineeName() {
		return nomineeName;
	}

	public void setNomineeName(String nomineeName) {
		this.nomineeName = nomineeName;
	}

	public String getNomineeRelationship() {
		return nomineeRelationship;
	}

	public void setNomineeRelationship(String nomineeRelationship) {
		this.nomineeRelationship = nomineeRelationship;
	}

	public String getNomineeContactNumber() {
		return nomineeContactNumber;
	}

	public void setNomineeContactNumber(String nomineeContactNumber) {
		this.nomineeContactNumber = nomineeContactNumber;
	}

	public double getPercentage() {
		return percentage;
	}

	public void setPercentage(double percentage) {
		this.percentage = percentage;
	}

	public String getEmployer() {
		return employer;
	}

	public void setEmployer(String employer) {
		this.employer = employer;
	}

	public String getPreviousDesignation() {
		return previousDesignation;
	}

	public void setPreviousDesignation(String previousDesignation) {
		this.previousDesignation = previousDesignation;
	}

	public String getAccountNumber() {
		return accountNumber;
	}

	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}

	public String getIfscCode() {
		return ifscCode;
	}

	public void setIfscCode(String ifscCode) {
		this.ifscCode = ifscCode;
	}

//	public String getBankPassbookImage() {
//		return bankPassbookImage;
//	}
//
//	public void setBankPassbookImage(String bankPassbookImage) {
//		this.bankPassbookImage = bankPassbookImage;
//	}
//
//	public String getAdharFrontImage() {
//		return adharFrontImage;
//	}
//
//	public void setAdharFrontImage(String adharFrontImage) {
//		this.adharFrontImage = adharFrontImage;
//	}
//
//	public String getAdharBackImage() {
//		return adharBackImage;
//	}
//
//	public void setAdharBackImage(String adharBackImage) {
//		this.adharBackImage = adharBackImage;
//	}
//
//	public String getFingerPrintLeft() {
//		return fingerPrintLeft;
//	}
//
//	public void setFingerPrintLeft(String fingerPrintLeft) {
//		this.fingerPrintLeft = fingerPrintLeft;
//	}
//
//	public String getFingerPrintRight() {
//		return fingerPrintRight;
//	}
//
//	public void setFingerPrintRight(String fingerPrintRight) {
//		this.fingerPrintRight = fingerPrintRight;
//	}
//
//	public String getDrivingLicense() {
//		return drivingLicense;
//	}
//
//	public void setDrivingLicense(String drivingLicense) {
//		this.drivingLicense = drivingLicense;
//	}
//
//	public String getVoterId() {
//		return voterId;
//	}
//
//	public void setVoterId(String voterId) {
//		this.voterId = voterId;
//	}
//
//	public String getPanCard() {
//		return panCard;
//	}
//
//	public void setPanCard(String panCard) {
//		this.panCard = panCard;
//	}

	public String getClientName() {
		return clientName;
	}

	public void setClientName(String clientName) {
		this.clientName = clientName;
	}

	public String getClientDescription() {
		return clientDescription;
	}

	public void setClientDescription(String clientDescription) {
		this.clientDescription = clientDescription;
	}

	public String getWbsId() {
		return wbsId;
	}

	public void setWbsId(String wbsId) {
		this.wbsId = wbsId;
	}

	public String getWbsDescription() {
		return wbsDescription;
	}

	public void setWbsDescription(String wbsDescription) {
		this.wbsDescription = wbsDescription;
	}

	public String getProjectCode() {
		return projectCode;
	}

	public void setProjectCode(String projectCode) {
		this.projectCode = projectCode;
	}

	public String getProjectDescription() {
		return projectDescription;
	}

	public void setProjectDescription(String projectDescription) {
		this.projectDescription = projectDescription;
	}


/*********************************************************************************************************/
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


    public String getOnBoardSource() {
        return onBoardSource;
    }

    public void setOnBoardSource(String onBoardSource) {
        this.onBoardSource = onBoardSource;
    }

    public String getOnBoardedFrom() {
        return onBoardedFrom;
    }

    public void setOnBoardedFrom(String onBoardedFrom) {
        this.onBoardedFrom = onBoardedFrom;
    }

    public boolean isImported() {
        return imported;
    }

    public void setImported(boolean imported) {
        this.imported = imported;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public boolean isSyncToSAP() {
        return syncToSAP;
    }

    public void setSyncToSAP(boolean syncToSAP) {
        this.syncToSAP = syncToSAP;
    }

    public void setSyncedBy(String syncedBy) {
        this.syncedBy = syncedBy;
    }

    public String getSyncedBy(){
        return syncedBy;
    }

    public void setVerifiedDate(ZonedDateTime verifiedDate) {
        this.verifiedDate = verifiedDate;
    }

    public ZonedDateTime getVerifiedDate(){
        return verifiedDate;
    }

    public User getVerifiedBy() {
        return verifiedBy;
    }

    public void setVerifiedBy(User verifiedBy) {
        this.verifiedBy = verifiedBy;
    }

    public boolean isNewEmployee() {
        return newEmployee;
    }

    public void setNewEmployee(boolean newEmployee) {
        this.newEmployee = newEmployee;
    }


	public String getPosition() {
		return position;
	}


	public void setPosition(String position) {
		this.position = position;
	}

	public boolean isSubmitted() {
		return submitted;
	}


	public void setSubmitted(boolean submitted) {
		this.submitted = submitted;
	}


	public String getSubmittedBy() {
		return submittedBy;
	}


	public void setSubmittedBy(String submittedBy) {
		this.submittedBy = submittedBy;
	}


	public ZonedDateTime getSubmittedOn() {
		return submittedOn;
	}


	public void setSubmittedOn(ZonedDateTime submittedOn) {
		this.submittedOn = submittedOn;
	}


	public double getGross() {
		return gross;
	}


	public void setGross(double gross) {
		this.gross = gross;
	}


	public String getActivity() {
		return activity;
	}


	public void setActivity(String activity) {
		this.activity = activity;
	}


	public boolean isNonUdsEmployee() {
		return nonUdsEmployee;
	}


	public void setNonUdsEmployee(boolean nonUdsEmployee) {
		this.nonUdsEmployee = nonUdsEmployee;
	}


	public String getRemarks() {
		return remarks;
	}


	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}


	public boolean isRejected() {
		return rejected;
	}


	public void setRejected(boolean rejected) {
		this.rejected = rejected;
	}
	
}
