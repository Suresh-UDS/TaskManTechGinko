package com.ts.app.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "sla_config")
public class SlaConfig extends AbstractAuditingEntity implements Serializable{

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy =GenerationType.AUTO)
	@Column(name = "SlaId")
	private long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "siteId", nullable = false)
	@Column(nullable = false)
	private Site site;
	
	private String processType;
	
	@Column(nullable = false)
	private ArrayList<String> category = new ArrayList<String>();
	
	@Column(nullable = false)
	private String severity;
	
	@Column(nullable = false)
	private int hours;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinTable(name = "sla_config_esc_config", joinColumns = { @JoinColumn(name = "SlaId") }, inverseJoinColumns = { @JoinColumn(name = "SlaEscId") })
	private List<SlaEscalationConfig> slaesc = new ArrayList<SlaEscalationConfig>();
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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

	public List<SlaEscalationConfig> getSlaesc() {
		return slaesc;
	}

	public void setSlaesc(List<SlaEscalationConfig> slaesc) {
		this.slaesc = slaesc;
	}

}
