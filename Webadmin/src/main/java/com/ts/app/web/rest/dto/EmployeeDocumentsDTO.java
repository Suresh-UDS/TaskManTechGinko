package com.ts.app.web.rest.dto;

import org.springframework.web.multipart.MultipartFile;

public class EmployeeDocumentsDTO extends BaseDTO{
	
    private long id;
	
	private String docType;
	
	private long employeeId;
	
	private MultipartFile docLocation;

	private String docName;

	private String docUrl;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getDocType() {
		return docType;
	}

	public void setDocType(String docType) {
		this.docType = docType;
	}

    public MultipartFile getDocLocation() {
        return docLocation;
    }

    public void setDocLocation(MultipartFile docLocation) {
        this.docLocation = docLocation;
    }

    public long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(long employeeId) {
        this.employeeId = employeeId;
    }

    public String getDocUrl() {
        return docUrl;
    }

    public void setDocUrl(String docUrl) {
        this.docUrl = docUrl;
    }

    public String getDocName() {
        return docName;
    }

    public void setDocName(String docName) {
        this.docName = docName;
    }
}
