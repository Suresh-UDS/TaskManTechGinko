package com.ts.app.domain;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "sla_escalation_config")
public class SlaEscalationConfig extends AbstractAuditingEntity implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@Column(nullable = false)
	private int level;

	@Column(nullable = false)
	private int hours;
	
	@Column(nullable = false)
	private int minutes;
	
	@Column(nullable = false)
	private String email;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "SlaId")
	private SlaConfig sla;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public int getHours() {
		return hours;
	}

	public void setHours(int hours) {
		this.hours = hours;
	}

	public int getMinutes() {
		return minutes;
	}

	public void setMinutes(int minutes) {
		this.minutes = minutes;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public SlaConfig getSla() {
		return sla;
	}

	public void setSla(SlaConfig sla) {
		this.sla = sla;
	}
	
}
