package com.ts.app.web.rest.dto;


import java.util.List;

import javax.validation.constraints.Size;

import org.apache.commons.collections.CollectionUtils;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.ts.app.domain.Site;

/**
 * A DTO representing a Employee
 */
public class EmployeeDTO extends BaseDTO {

    @Size(min = 1, max = 50)
    private String name;

    private String lastName;

    private long id;

    @Size(min = 4, max = 10)
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

    private List<ProjectDTO> projects;

    private List<SiteDTO> sites;

    private List<EmployeeProjectSiteDTO> projectSites;

    private List<EmployeeLocationDTO> locations;

    private boolean isLeft;

    private boolean isReliever;

    private boolean isRelieved;
    
    private boolean createUser;
    
    private String phone;

    @JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class, property="@id")
    private EmployeeDTO manager;
    
	private long userRoleId;
	
	private String userRoleName;

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

	@Override
    public String toString() {
        String details = "EmployeeDTO{" +
            "name='" + name +
            "managerID -" + (manager!=null ? manager.getId() : "")+
            "managerName-"+ (manager!=null ? manager.getName() : "");
        StringBuffer sb = new StringBuffer();
        sb.append(details);
        if(CollectionUtils.isNotEmpty(projects)) {
        	for(ProjectDTO proj : projects) {
        		sb.append(proj);
        	}
        }
        if(CollectionUtils.isNotEmpty(sites)) {
	        	for(SiteDTO site : sites) {
	        		sb.append(site);
	        	}
        }
        sb.append("userId-" + getUserId() +" ");
        if(CollectionUtils.isNotEmpty(projectSites)) {
        		for(EmployeeProjectSiteDTO projSite : projectSites) {
        			sb.append(projSite);
        		}
        }
        return sb.toString();
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

	public List<ProjectDTO> getProjects() {
		return projects;
	}

	public void setProjects(List<ProjectDTO> projects) {
		this.projects = projects;
	}

	public List<SiteDTO> getSites() {
		return sites;
	}

	public void setSites(List<SiteDTO> sites) {
		this.sites = sites;
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

	
}
