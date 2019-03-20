package com.ts.app.web.rest.dto;

import java.util.ArrayList;
import java.util.List;



public class EmpDTO {

	private String id;
	private String employeeName;
	private String employeeCode;
	private String gender;
	private String dateOfBirth;
	private String dateOfJoining;
	private String contactNumber;
	private String religion;
	private String maritalStatus;
	private String bloodGroup;
	private String aadharPhotoCopy;
	private String profilePicture;
	private String employeeSignature;
	private String employeeVoiceSample;
	private String prePrintedStatement;
	private String tempId;
	private boolean isSync;
	private boolean submitted;
	private String thumbImpressenLeft;	   
	private String thumbImpressenRight;
	private String drivingLicense;
	private String pancardCopy;
	private String voterId;
	ArrayList<RelationshipDetailsDTO> relationshipDetails = new ArrayList<>();
	ArrayList<NomineeDetailDTO> nomineeDetail = new ArrayList<>();
	ArrayList<String> identificationMark = new ArrayList<>();
	private String aadharNumber;
	ArrayList<CommunicationAddressDTO> communicationAddress = new ArrayList<>();
	private List<CommunicationAddressDTO> permanentAddress = new ArrayList<>();
	ArrayList<EducationQualificationDTO> educationQualification = new ArrayList<>();
	ArrayList<String> emergencyConatctNo = new ArrayList<>();
	ArrayList<PreviousEmployeeDTO> previousEmployee = new ArrayList<>();
	private String epfNo;
	ArrayList<BankDetailsDTO> bankDetails = new ArrayList<>();
	ArrayList<CustomerDTO> customer = new ArrayList<>();
	private String uanno;
	private String esino;
	private String addressProof;
		
		

	public boolean isSubmitted() {
		return submitted;
	}

	public void setSubmitted(boolean submitted) {
		this.submitted = submitted;
	}

	public List<CommunicationAddressDTO> getPermanentAddress() {
		return permanentAddress;
	}

	public void setPermanentAddress(List<CommunicationAddressDTO> permanentAddress) {
		this.permanentAddress = permanentAddress;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}

	public String getEmployeeCode() {
		return employeeCode;
	}

	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(String dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public String getDateOfJoining() {
		return dateOfJoining;
	}

	public void setDateOfJoining(String dateOfJoining) {
		this.dateOfJoining = dateOfJoining;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

	public String getReligion() {
		return religion;
	}

	public void setReligion(String religion) {
		this.religion = religion;
	}

	public String getMaritalStatus() {
		return maritalStatus;
	}

	public void setMaritalStatus(String maritalStatus) {
		this.maritalStatus = maritalStatus;
	}

	public String getBloodGroup() {
		return bloodGroup;
	}

	public void setBloodGroup(String bloodGroup) {
		this.bloodGroup = bloodGroup;
	}

	public String getAadharPhotoCopy() {
		return aadharPhotoCopy;
	}

	public void setAadharPhotoCopy(String aadharPhotoCopy) {
		this.aadharPhotoCopy = aadharPhotoCopy;
	}

	public String getProfilePicture() {
		return profilePicture;
	}

	public void setProfilePicture(String profilePicture) {
		this.profilePicture = profilePicture;
	}

	public String getEmployeeSignature() {
		return employeeSignature;
	}

	public void setEmployeeSignature(String employeeSignature) {
		this.employeeSignature = employeeSignature;
	}

	public String getEmployeeVoiceSample() {
		return employeeVoiceSample;
	}

	public void setEmployeeVoiceSample(String employeeVoiceSample) {
		this.employeeVoiceSample = employeeVoiceSample;
	}

	public String getPrePrintedStatement() {
		return prePrintedStatement;
	}

	public void setPrePrintedStatement(String prePrintedStatement) {
		this.prePrintedStatement = prePrintedStatement;
	}

	public String getTempId() {
		return tempId;
	}

	public void setTempId(String tempId) {
		this.tempId = tempId;
	}

	public boolean isSync() {
		return isSync;
	}

	public void setSync(boolean isSync) {
		this.isSync = isSync;
	}


	public String getThumbImpressenLeft() {
		return thumbImpressenLeft;
	}

	public void setThumbImpressenLeft(String thumbImpressenLeft) {
		this.thumbImpressenLeft = thumbImpressenLeft;
	}

	public String getThumbImpressenRight() {
		return thumbImpressenRight;
	}

	public void setThumbImpressenRight(String thumbImpressenRight) {
		this.thumbImpressenRight = thumbImpressenRight;
	}

	public ArrayList<RelationshipDetailsDTO> getRelationshipDetails() {
		return relationshipDetails;
	}

	public void setRelationshipDetails(ArrayList<RelationshipDetailsDTO> relationshipDetails) {
		this.relationshipDetails = relationshipDetails;
	}

	public ArrayList<NomineeDetailDTO> getNomineeDetail() {
		return nomineeDetail;
	}

	public void setNomineeDetail(ArrayList<NomineeDetailDTO> nomineeDetail) {
		this.nomineeDetail = nomineeDetail;
	}

	public ArrayList<String> getIdentificationMark() {
		return identificationMark;
	}

	public void setIdentificationMark(ArrayList<String> identificationMark) {
		this.identificationMark = identificationMark;
	}

	public String getAadharNumber() {
		return aadharNumber;
	}

	public void setAadharNumber(String aadharNumber) {
		this.aadharNumber = aadharNumber;
	}

	public ArrayList<CommunicationAddressDTO> getCommunicationAddress() {
		return communicationAddress;
	}

	public void setCommunicationAddress(ArrayList<CommunicationAddressDTO> communicationAddress) {
		this.communicationAddress = communicationAddress;
	}

	public ArrayList<EducationQualificationDTO> getEducationQualification() {
		return educationQualification;
	}

	public void setEducationQualification(ArrayList<EducationQualificationDTO> educationQualification) {
		this.educationQualification = educationQualification;
	}

	public ArrayList<String> getEmergencyConatctNo() {
		return emergencyConatctNo;
	}

	public void setEmergencyConatctNo(ArrayList<String> emergencyConatctNo) {
		this.emergencyConatctNo = emergencyConatctNo;
	}

	public ArrayList<PreviousEmployeeDTO> getPreviousEmployee() {
		return previousEmployee;
	}

	public void setPreviousEmployee(ArrayList<PreviousEmployeeDTO> previousEmployee) {
		this.previousEmployee = previousEmployee;
	}

	public String getEpfNo() {
		return epfNo;
	}

	public void setEpfNo(String epfNo) {
		this.epfNo = epfNo;
	}

	public ArrayList<BankDetailsDTO> getBankDetails() {
		return bankDetails;
	}

	public void setBankDetails(ArrayList<BankDetailsDTO> bankDetails) {
		this.bankDetails = bankDetails;
	}

	public ArrayList<CustomerDTO> getCustomer() {
		return customer;
	}

	public void setCustomer(ArrayList<CustomerDTO> customer) {
		this.customer = customer;
	}

	public String getUanno() {
		return uanno;
	}

	public void setUanno(String uanno) {
		this.uanno = uanno;
	}

	public String getEsino() {
		return esino;
	}

	public void setEsino(String esino) {
		this.esino = esino;
	}

	public String getAddressProof() {
		return addressProof;
	}

	public void setAddressProof(String addressProof) {
		this.addressProof = addressProof;
	}

	public String getDrivingLicense() {
		return drivingLicense;
	}

	public void setDrivingLicense(String drivingLicense) {
		this.drivingLicense = drivingLicense;
	}

	public String getPancardCopy() {
		return pancardCopy;
	}

	public void setPancardCopy(String pancardCopy) {
		this.pancardCopy = pancardCopy;
	}

	public String getVoterId() {
		return voterId;
	}

	public void setVoterId(String voterId) {
		this.voterId = voterId;
	}
	
}
