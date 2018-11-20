package com.ts.app.domain;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Set;

@Entity
@Table(name = "sla_config")
public class SlaConfig extends AbstractAuditingEntity implements Serializable{

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy =GenerationType.AUTO)
	private long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "projectId", nullable = false)
	private Project project;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "siteId", nullable = false)
	private Site site;
	
	private String processType;
	
	@Column(nullable = false)
	private ArrayList<String> category;
	
	@Column(nullable = false)
	private String severity;
	
	@Column(nullable = false)
	private int hours;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "sla", fetch = FetchType.LAZY)
	private Set<SlaEscalationConfig> slaesc;
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
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

	public String getProcessType() {
		return processType;
	}

	public void setProcessType(String processType) {
		this.processType = processType;
	}

	public ArrayList<String> getCategory() {
		return category;
	}

	public void setCategory(ArrayList<String> category) {
		this.category = category;
	}

	public String getSeverity() {
		return severity;
	}

	public void setSeverity(String severity) {
		this.severity = severity;
	}

	public int getHours() {
		return hours;
	}

	public void setHours(int hours) {
		this.hours = hours;
	}

	public Set<SlaEscalationConfig> getSlaesc() {
		return slaesc;
	}

	public void setSlaesc(Set<SlaEscalationConfig> slaesc) {
		this.slaesc = slaesc;
	}


}
