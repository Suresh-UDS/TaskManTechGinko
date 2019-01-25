package com.ts.app.web.rest.dto;

import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * A DTO representing a Check in /out transaction
 */
public class CheckInOutDTO extends BaseDTO {

	private long id;

	private long userId;

	private long employeeId;

	private String employeeEmpId;

	private String name;

	private String employeeFullName;

	private Timestamp checkInDateTime;

	private Timestamp checkOutDateTime;

	private String checkInDateTimeDisplay;

	private String checkInTimeDisplay;

	private String checkOutDateTimeDisplay;

	private String checkOutTimeDisplay;

	private String photoIn;

	private MultipartFile photoInFile;

	private String photoOut;

	private MultipartFile photoOutFile;

	private String photoOut2;

	private MultipartFile photoOutFile2;

	private double longitudeIn;

	private double latitudeIn;

	private double longitudeOut;

	private double latitudeOut;

	private long projectId;

	private String projectName;

	private long jobId;

	private String jobTitle;

	private long siteId;

	private String siteName;

	private String hoursWorked;

	private int deviceInId;

	private String deviceInUniqueId;

	private int deviceOutId;

	private String deviceOutUniqueId;

	private String action; //in or out

	private String photoInImage;

	private long minsWorked;

	private String remarks;

	private boolean completeJob;

	private List<CheckInOutImageDTO> checkInOutImages;


	public CheckInOutDTO() {
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}


	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

	public long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(long employeeId) {
		this.employeeId = employeeId;
	}

	public String getEmployeeEmpId() {
		return employeeEmpId;
	}

	public void setEmployeeEmpId(String employeeEmpId) {
		this.employeeEmpId = employeeEmpId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}



	public String getEmployeeFullName() {
		return employeeFullName;
	}

	public void setEmployeeFullName(String employeeFullName) {
		this.employeeFullName = employeeFullName;
	}

	public Date getCheckInDateTime() {
		return checkInDateTime;
	}

	private void setCheckInDateTimeDisplay() {
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MMM-yyyy");
		checkInDateTimeDisplay = sdf.format(checkInDateTime);
	}

	private void setCheckInTimeDisplay() {
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
		checkInTimeDisplay = sdf.format(checkInDateTime);
	}

	public String getCheckInDateTimeDisplay() {
		return checkInDateTimeDisplay;
	}

	public void setCheckInDateTime(Timestamp checkInDateTime) {
		this.checkInDateTime = checkInDateTime;
		setCheckInDateTimeDisplay();
		setCheckInTimeDisplay();
	}

	public String getCheckInTimeDisplay(){
		return checkInTimeDisplay;
	}

	public Date getCheckOutDateTime() {
		return checkOutDateTime;
	}

	private void setCheckOutDateTimeDisplay() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		checkOutDateTimeDisplay = sdf.format(checkOutDateTime);
	}

	private void setCheckOutTimeDisplay() {
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
		checkOutTimeDisplay = sdf.format(checkOutDateTime);
	}

	public String getCheckOutDateTimeDisplay() {
		return checkOutDateTimeDisplay;
	}

	public String getCheckOutTimeDisplay(){
		return checkOutTimeDisplay;
	}


	public void setCheckOutDateTime(Timestamp checkOutDateTime) {
		this.checkOutDateTime = checkOutDateTime;
		if(checkOutDateTime!= null) {
			setCheckOutDateTimeDisplay();
			setCheckOutTimeDisplay();
			computeHours();
		}
	}

	public void computeHours() {
		if(checkOutDateTime != null && checkInDateTime != null) {
			long duration = checkOutDateTime.getTime() - checkInDateTime.getTime();
			long secs = duration / 1000;
			long mins = secs / 60;
			long hrs = mins / 60;
			mins = (mins % 60);
			hoursWorked = (hrs < 10 ? ("0" + hrs) : hrs )+":" + (mins < 10 ? ("0" + mins) : mins);
		}

//		totalHours.set(totalHours.get() + hrs);
//		totalMins += mins;
//
//		if(totalMins > 60) {
//			totalHours += (totalMins / 60);
//			totalMins = (totalMins % 60);
//		}
	}

	public String getPhotoIn() {
		return photoIn;
	}

	public void setPhotoIn(String photoIn) {
		this.photoIn = photoIn;
	}

	public String getPhotoOut() {
		return photoOut;
	}

	public void setPhotoOut(String photoOut) {
		this.photoOut = photoOut;
	}

	public double getLongitudeIn() {
		return longitudeIn;
	}

	public void setLongitudeIn(double longitudeIn) {
		this.longitudeIn = longitudeIn;
	}

	public double getLatitudeIn() {
		return latitudeIn;
	}

	public void setLatitudeIn(double latitudeIn) {
		this.latitudeIn = latitudeIn;
	}

	public double getLongitudeOut() {
		return longitudeOut;
	}

	public void setLongitudeOut(double longitudeOut) {
		this.longitudeOut = longitudeOut;
	}

	public double getLatitudeOut() {
		return latitudeOut;
	}

	public void setLatitudeOut(double latitudeOut) {
		this.latitudeOut = latitudeOut;
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

	public String getHoursWorked() {
		return hoursWorked;
	}

	public void setHoursWorked(String hoursWorked) {
		this.hoursWorked = hoursWorked;
	}

	public MultipartFile getPhotoInFile() {
		return photoInFile;
	}

	public void setPhotoInFile(MultipartFile photoInFile) {
		this.photoInFile = photoInFile;
	}

	public MultipartFile getPhotoOutFile() {
		return photoOutFile;
	}

	public void setPhotoOutFile(MultipartFile photoOutFile) {
		this.photoOutFile = photoOutFile;
	}

	public int getDeviceInId() {
		return deviceInId;
	}

	public void setDeviceInId(int deviceInId) {
		this.deviceInId = deviceInId;
	}

	public String getDeviceInUniqueId() {
		return deviceInUniqueId;
	}

	public void setDeviceInUniqueId(String deviceInUniqueId) {
		this.deviceInUniqueId = deviceInUniqueId;
	}

	public int getDeviceOutId() {
		return deviceOutId;
	}

	public void setDeviceOutId(int deviceOutId) {
		this.deviceOutId = deviceOutId;
	}

	public String getDeviceOutUniqueId() {
		return deviceOutUniqueId;
	}

	public void setDeviceOutUniqueId(String deviceOutUniqueId) {
		this.deviceOutUniqueId = deviceOutUniqueId;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public String getPhotoInImage() {
		return photoInImage;
	}

	public void setPhotoInImage(String photoInImage) {
		this.photoInImage = photoInImage;
	}

	public long getMinsWorked() {
		return minsWorked;
	}

	public void setMinsWorked(long minsWorked) {
		this.minsWorked = minsWorked;
	}

	@Override
	public String toString() {
		return "SiteDTO{" + "name='" + name +

		"}";
	}

	public long getJobId() {
		return jobId;
	}

	public void setJobId(long jobId) {
		this.jobId = jobId;
	}

	public String getPhotoOut2() {
		return photoOut2;
	}

	public void setPhotoOut2(String photoOut2) {
		this.photoOut2 = photoOut2;
	}

	public MultipartFile getPhotoOutFile2() {
		return photoOutFile2;
	}

	public void setPhotoOutFile2(MultipartFile photoOutFile2) {
		this.photoOutFile2 = photoOutFile2;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public List<CheckInOutImageDTO> getCheckInOutImages() {
		return checkInOutImages;
	}

	public void setCheckInOutImages(List<CheckInOutImageDTO> checkInOutImages) {
		this.checkInOutImages = checkInOutImages;
	}

	public void setCheckOutTimeDisplay(String checkOutTimeDisplay) {
		this.checkOutTimeDisplay = checkOutTimeDisplay;
	}


    public boolean isCompleteJob() {
        return completeJob;
    }

    public void setCompleteJob(boolean completeJob) {
        this.completeJob = completeJob;
    }
}
