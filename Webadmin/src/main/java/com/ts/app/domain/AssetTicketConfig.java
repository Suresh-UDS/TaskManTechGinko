package com.ts.app.domain;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "asset_ticket_config")
@Cacheable(true)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AssetTicketConfig extends AbstractAuditingEntity{

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assetId", referencedColumnName = "id", nullable = false)
	private Asset asset;
	
	@Column(name="ticket")
	private boolean ticket;
	
	@Column(name="severity")
	private boolean severity;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Asset getAsset() {
		return asset;
	}

	public void setAsset(Asset asset) {
		this.asset = asset;
	}

	public boolean isTicket() {
		return ticket;
	}

	public void setTicket(boolean ticket) {
		this.ticket = ticket;
	}

	public boolean isSeverity() {
		return severity;
	}

	public void setSeverity(boolean severity) {
		this.severity = severity;
	}
}
