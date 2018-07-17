package com.ts.app.web.rest.dto;

import org.springframework.web.multipart.MultipartFile;

/**
 * Created by karth on 6/2/2017.
 */
public class CheckInOutImageDTO extends BaseDTO {

    private long id;

    private long employeeId;

    private String employeeEmpId;

    private long projectId;

    private long checkInOutId;

    private long jobId;

    private long siteId;

    private String action; //in or out

    private MultipartFile photoOutFile;

    private String photoOut;
    
    private String url;

    public CheckInOutImageDTO() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public long getProjectId() {
        return projectId;
    }

    public void setProjectId(long projectId) {
        this.projectId = projectId;
    }

    public long getSiteId() {
        return siteId;
    }

    public void setSiteId(long siteId) {
        this.siteId = siteId;
    }

    public long getJobId() {
        return jobId;
    }

    public void setJobId(long jobId) {
        this.jobId = jobId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getPhotoOut() {
        return photoOut;
    }

    public void setPhotoOut(String photoOut) {
        this.photoOut = photoOut;
    }

    public MultipartFile getPhotoOutFile() {
        return photoOutFile;
    }

    public void setPhotoOutFile(MultipartFile photoOutFile) {
        this.photoOutFile = photoOutFile;
    }

    public long getCheckInOutId(){return checkInOutId;}

    public void setCheckInOutId(long checkInOutId) {this.checkInOutId = checkInOutId;}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
}
