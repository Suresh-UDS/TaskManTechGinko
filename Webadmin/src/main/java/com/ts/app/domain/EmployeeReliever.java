package com.ts.app.domain;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Table(name = "employee_reliever")
public class EmployeeReliever extends AbstractAuditingEntity implements Serializable {

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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "relieverId")
	private Employee relieverEmployee;

	private String relieverName;

	private String relieverMobile;


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

	public String getRelieverName() {
		return relieverName;
	}

	public void setRelieverName(String relieverName) {
		this.relieverName = relieverName;
	}

	public String getRelieverMobile() {
		return relieverMobile;
	}

	public void setRelieverMobile(String relieverMobile) {
		this.relieverMobile = relieverMobile;
	}

    public Employee getRelieverEmployee() {
        return relieverEmployee;
    }

    public void setRelieverEmployee(Employee relieverEmployee) {
        this.relieverEmployee = relieverEmployee;
    }
}
