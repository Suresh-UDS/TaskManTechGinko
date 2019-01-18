package com.ts.app.web.rest.dto;


/**
 * A DTO representing a EmployeeHistory
 */
public class EmployeeHistoryDTO extends BaseDTO {  

    private long id;
    
    private long employeeId;

    private String employeeName;

    private long projectId;

    private String projectName;
    
    private long siteId;
    
    private String siteName;
    

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
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

	public long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(long employeeId) {
		this.employeeId = employeeId;
	}

	public EmployeeHistoryDTO() {
    }

   

    @Override
    public String toString() {
        return "EmployeeHistoryDTO{" +
            "name='" + employeeName +
           
            "}";
    }
}
