package com.ts.app.domain;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "employee_project_site")
public class EmployeeProjectSite extends AbstractAuditingEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employeeId", referencedColumnName = "id", nullable = true)
	private Employee employee;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "projectId", referencedColumnName = "id", nullable = true)
	private Project project;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "siteId", referencedColumnName = "id", nullable = true)
	private Site site;
	
//	@OneToMany(mappedBy="employeeProjectSite",cascade={CascadeType.ALL}, fetch = FetchType.LAZY, orphanRemoval = true)
//    private List<EmployeeShift> shifts;
	
//	private long projectId;
//	
//	private String projectName;
//	
//	private long siteId;
//	
//	private String siteName;

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
	}

	public Site getSite() {
		return site;
	}

	public void setSite(Site site) {
		this.site = site;
	}

//	public List<EmployeeShift> getShifts() {
//		return shifts;
//	}
//
//	public void setShifts(List<EmployeeShift> shifts) {
//		this.shifts = shifts;
//	}
//	
	

//	public long getProjectId() {
//		return projectId;
//	}
//
//	public void setProjectId(long projectId) {
//		this.projectId = projectId;
//	}
//
//	public long getSiteId() {
//		return siteId;
//	}
//
//	public void setSiteId(long siteId) {
//		this.siteId = siteId;
//	}
//
//	public String getProjectName() {
//		return projectName;
//	}
//
//	public void setProjectName(String projectName) {
//		this.projectName = projectName;
//	}
//
//	public String getSiteName() {
//		return siteName;
//	}
//
//	public void setSiteName(String siteName) {
//		this.siteName = siteName;
//	}

//	public Project getProject() {
//		return project;
//	}
//
//	public void setProject(Project project) {
//		this.project = project;
//	}
//
//	public Site getSite() {
//		return site;
//	}
//
//	public void setSite(Site site) {
//		this.site = site;
//	}
	
	
	
}
