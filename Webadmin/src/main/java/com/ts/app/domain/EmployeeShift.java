package com.ts.app.domain;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Table(name = "employee_shift")
//@Cacheable(true)
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class EmployeeShift extends AbstractAuditingEntity implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employeeId")
	private Employee employee;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "siteId")
	private Site site;

	private Timestamp startTime;
	
	private Timestamp endTime;
	
//	@ManyToOne(fetch = FetchType.LAZY)
//	@JoinColumn(name = "employeeProjectSiteId", nullable = true)
//	private EmployeeProjectSite employeeProjectSite;
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public Site getSite() {
		return site;
	}

	public void setSite(Site site) {
		this.site = site;
	}

	

//	public EmployeeProjectSite getEmployeeProjectSite() {
//		return employeeProjectSite;
//	}
//
//	public void setEmployeeProjectSite(EmployeeProjectSite employeeProjectSite) {
//		this.employeeProjectSite = employeeProjectSite;
//	}

}
