package com.ts.app.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "SlaConfig")
public class SlaConfig extends AbstractAuditingEntity implements Serializable{

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy =GenerationType.AUTO)
	private long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "siteId", nullable = false)
	private Site site;
	
	private String processType;
	
	@Column(nullable = false)
	private String category;
	
	private String severity;
	
	private int hrs;
	
	private int level;
	
	private int ehrs1;
	
	private int emins1;
	
	private int ehrs2;
	
	private int emins2;
	
	private int ehrs3;
	
	private int emins3;
	
	private int ehrs4;
	
	private int emins4;
	
	private String email1;
	
	private String email2;

	private String email3;
	
	private String email4;

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

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getSeverity() {
		return severity;
	}

	public void setSeverity(String severity) {
		this.severity = severity;
	}

	public int getHrs() {
		return hrs;
	}

	public void setHrs(int hrs) {
		this.hrs = hrs;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public int getEhrs1() {
		return ehrs1;
	}

	public void setEhrs1(int ehrs1) {
		this.ehrs1 = ehrs1;
	}

	public int getEmins1() {
		return emins1;
	}

	public void setEmins1(int emins1) {
		this.emins1 = emins1;
	}

	public int getEhrs2() {
		return ehrs2;
	}

	public void setEhrs2(int ehrs2) {
		this.ehrs2 = ehrs2;
	}

	public int getEmins2() {
		return emins2;
	}

	public void setEmins2(int emins2) {
		this.emins2 = emins2;
	}

	public int getEhrs3() {
		return ehrs3;
	}

	public void setEhrs3(int ehrs3) {
		this.ehrs3 = ehrs3;
	}

	public int getEmins3() {
		return emins3;
	}

	public void setEmins3(int emins3) {
		this.emins3 = emins3;
	}

	public int getEhrs4() {
		return ehrs4;
	}

	public void setEhrs4(int ehrs4) {
		this.ehrs4 = ehrs4;
	}

	public int getEmins4() {
		return emins4;
	}

	public void setEmins4(int emins4) {
		this.emins4 = emins4;
	}

	public String getEmail1() {
		return email1;
	}

	public void setEmail1(String email1) {
		this.email1 = email1;
	}

	public String getEmail2() {
		return email2;
	}

	public void setEmail2(String email2) {
		this.email2 = email2;
	}

	public String getEmail3() {
		return email3;
	}

	public void setEmail3(String email3) {
		this.email3 = email3;
	}

	public String getEmail4() {
		return email4;
	}

	public void setEmail4(String email4) {
		this.email4 = email4;
	}
	
}
