package com.ts.app.web.rest.dto;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.ts.app.domain.Site;
import org.apache.commons.collections.CollectionUtils;

import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import java.sql.Date;
import java.util.List;

/**
 * A DTO representing a Employee
 */
public class EmployeeDTO extends BaseDTO {

    @Size(min = 1, max = 50)
    private String name;

    private String lastName;

    private long id;

    @Size(min = 1, max = 10)
    private String empId;

    @Size(min = 1, max = 50)
    private String fullName;

    @Size(min = 1, max = 50)
    private String designation;

    private String qrCodeImage;

    private String enrolled_face;

    private boolean isFaceAuthorised;

    private boolean isFaceIdEnrolled;

    private long projectId;

    private String projectName;

    private long siteId;

    private String siteName;

    private String userUserGroupName;

    private long managerId;

    private String managerName;

    private long code;

    private boolean checkedIn;

    private long jobId;

    private String jobTitle;

    private List<EmployeeProjectSiteDTO> projectSites;

    private List<EmployeeLocationDTO> locations;

    private List<EmployeeRelieverDTO> relievers;

    private boolean isLeft;

    private boolean isReliever;

    private boolean isRelieved;

    private boolean createUser;

    private String phone;

    private String email;

    private boolean notCheckedOut;

    @JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class, property="@id")
    private EmployeeDTO manager;

    private long userRoleId;

    private String userRoleName;

    private boolean client;

    private long attendanceId;

    private String url;

    private String faceId;

    private String region;

    private String branch;

/*************************Modified by Vinoth***********************************************************/    
    
    @Size(min = 1, max = 50)
    private String fatherName;
    
    private String motherName;
    
    @Size(min = 1, max = 10)
    private String gender;
    
    @Size(min =10, max = 50)
    private String maritalStatus;
    
    private Date dob;

    private Date doj;
    
    private String religion;
    
    private String bloodGroup;
    
    @Size(min = 1, max = 2500)
    private String personalIdentificationMark1;
    
    @Size(min = 1, max = 2500)
    private String personalIdentificationMark2;
    
    private String educationalQulification;
    
    private String boardInstitute;
    
    @Size(min = 1, max = 16)
    private String adharCardNumber;

    @Size(min = 1, max =10)
    private String mobile;
    
    private String emergencyContactNumber;

    private String permanentAddress;

    private String permanentCity;

    private String permanentState;
   
    private String presentAddress;
   
    private String presentCity;
 
    private String presentState;
    
    private String addressProofImage;

    private String nomineeName;

    private String nomineeRelationship;
    
    private String nomineeContactNumber;

    private double percentage;
    
    private String employer;
    
    private String previousDesignation;

    private String accountNumber;

    private String ifscCode;
    
    private String bankPassbookImage;
    
    private String adharFrontImage;
    
    private String adharBackImage;
    
    private String fingerPrintLeft;
    
    private String fingerPrintRight;
    
    private String drivingLicense;
    
    private String voterId;
    
    private String panCard;

    private String clientName;

    private String clientDescription;

    private String wbsId;

    private String wbsDescription;
    
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

	public String getAddressProofImage() {
		return addressProofImage;
	}

	public void setAddressProofImage(String addressProofImage) {
		this.addressProofImage = addressProofImage;
	}

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

	public String getBankPassbookImage() {
		return bankPassbookImage;
	}

	public void setBankPassbookImage(String bankPassbookImage) {
		this.bankPassbookImage = bankPassbookImage;
	}

	public String getAdharFrontImage() {
		return adharFrontImage;
	}

	public void setAdharFrontImage(String adharFrontImage) {
		this.adharFrontImage = adharFrontImage;
	}

	public String getAdharBackImage() {
		return adharBackImage;
	}

	public void setAdharBackImage(String adharBackImage) {
		this.adharBackImage = adharBackImage;
	}

	public String getFingerPrintLeft() {
		return fingerPrintLeft;
	}

	public void setFingerPrintLeft(String fingerPrintLeft) {
		this.fingerPrintLeft = fingerPrintLeft;
	}

	public String getFingerPrintRight() {
		return fingerPrintRight;
	}

	public void setFingerPrintRight(String fingerPrintRight) {
		this.fingerPrintRight = fingerPrintRight;
	}

	public String getDrivingLicense() {
		return drivingLicense;
	}

	public void setDrivingLicense(String drivingLicense) {
		this.drivingLicense = drivingLicense;
	}

	public String getVoterId() {
		return voterId;
	}

	public void setVoterId(String voterId) {
		this.voterId = voterId;
	}

	public String getPanCard() {
		return panCard;
	}

	public void setPanCard(String panCard) {
		this.panCard = panCard;
	}

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

/**************************************************************************************/    

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
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

    public long getSiteId() {
        return siteId;
    }

    public void setSiteId(long siteId) {
        this.siteId = siteId;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public long getManagerId() {return managerId;}

    public void setManagerId(long managerId) {this.managerId = managerId;}

    public String getManagerName() {return managerName;}

    public void setManagerName(String managerName) {this.managerName = managerName;}

    public long getCode() {
        return code;
    }

    public void setCode(long code) {
        this.code = code;
    }

    public EmployeeDTO() {
    }

    public EmployeeDTO(Site site) {
        this(site.getName());
    }

    public EmployeeDTO(String name) {

        this.name = name;

    }



    public boolean isCheckedIn() {
        return checkedIn;
    }

    public void setCheckedIn(boolean checkedIn) {
        this.checkedIn = checkedIn;
    }

    public long getJobId() {
        return jobId;
    }

    public void setJobId(long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public EmployeeDTO getManager() {
        return manager;
    }

    public void setManager(EmployeeDTO manager) {
        this.manager = manager;
    }

    public String getUserUserGroupName() {
        return userUserGroupName;
    }

    public void setUserUserGroupName(String userUserGroupName) {
        this.userUserGroupName = userUserGroupName;
    }


    public String getEnrolled_face() {
        return enrolled_face;
    }

    public void setEnrolled_face(String enrolled_face) {
        this.enrolled_face = enrolled_face;
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

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }


    public boolean isLeft() {
        return isLeft;
    }

    public void setLeft(boolean left) {
        isLeft = left;
    }

    public boolean isReliever() {
        return isReliever;
    }

    public void setReliever(boolean reliever) {
        isReliever = reliever;
    }

    public boolean isRelieved() {
        return isRelieved;
    }

    public void setRelieved(boolean relieved) {
        isRelieved = relieved;
    }
    public List<EmployeeProjectSiteDTO> getProjectSites() {
        return projectSites;
    }

    public void setProjectSites(List<EmployeeProjectSiteDTO> projectSites) {
        this.projectSites = projectSites;
    }

    public boolean isCreateUser() {
        return createUser;
    }

    public void setCreateUser(boolean createUser) {
        this.createUser = createUser;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public long getUserRoleId() {
        return userRoleId;
    }

    public void setUserRoleId(long userRoleId) {
        this.userRoleId = userRoleId;
    }

    public String getUserRoleName() {
        return userRoleName;
    }

    public void setUserRoleName(String userRoleName) {
        this.userRoleName = userRoleName;
    }

    public List<EmployeeLocationDTO> getLocations() {
        return locations;
    }

    public void setLocations(List<EmployeeLocationDTO> locations) {
        this.locations = locations;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public boolean isNotCheckedOut() {
        return notCheckedOut;
    }

    public void setNotCheckedOut(boolean notCheckedOut) {
        this.notCheckedOut = notCheckedOut;
    }

    public boolean isClient() {
        return client;
    }

    public void setClient(boolean client) {
        this.client = client;
    }


    public long getAttendanceId() {
        return attendanceId;
    }

    public void setAttendanceId(long attendanceId) {
        this.attendanceId = attendanceId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getFaceId() {
        return faceId;
    }

    public void setFaceId(String faceId) {
        this.faceId = faceId;
    }

	public List<EmployeeRelieverDTO> getRelievers() {
		return relievers;
	}

	public void setRelievers(List<EmployeeRelieverDTO> relievers) {
		this.relievers = relievers;
	}

    public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getBranch() {
		return branch;
	}

	public void setBranch(String branch) {
		this.branch = branch;
	}

	@Override
    public String toString() {
        String details = "EmployeeDTO{" +
            "name='" + name +
            "managerID -" + (manager!=null ? manager.getId() : "")+
            "managerName-"+ (manager!=null ? manager.getName() : "");
        StringBuffer sb = new StringBuffer();
        sb.append(details);
        sb.append("userId-" + getUserId() +" ");
        if(CollectionUtils.isNotEmpty(projectSites)) {
            for(EmployeeProjectSiteDTO projSite : projectSites) {
                sb.append(projSite);
            }
        }
        return sb.toString();
    }
}
