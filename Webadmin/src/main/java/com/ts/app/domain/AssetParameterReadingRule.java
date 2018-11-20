package com.ts.app.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Entity
@Table(name = "asset_parameter_reading_rule")
public class AssetParameterReadingRule extends AbstractAuditingEntity implements Serializable {
	
	private static final long serialVersionUID = 1;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@ManyToOne(fetch = FetchType.LAZY, cascade={CascadeType.ALL})
	@JoinColumn(name= "assetId", referencedColumnName = "id", nullable = true)
	private Asset asset;
	
	@ManyToOne(fetch = FetchType.LAZY, cascade={CascadeType.ALL})
	@JoinColumn(name= "assetParameterConfigId", referencedColumnName = "id", nullable = true)
	private AssetParameterConfig assetParameterConfig;
	
	@NotNull
	@Size(min = 1, max = 250)
	@Column(length = 250, nullable = false)
	private String rule;
	
	private boolean alertRequired;
	
	private boolean validationRequired;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Asset getAsset() {
		return asset;
	}

	public void setAsset(Asset asset) {
		this.asset = asset;
	}

	public AssetParameterConfig getAssetParameterConfig() {
		return assetParameterConfig;
	}

	public void setAssetParameterConfig(AssetParameterConfig assetParameterConfig) {
		this.assetParameterConfig = assetParameterConfig;
	}

	public String getRule() {
		return rule;
	}

	public void setRule(String rule) {
		this.rule = rule;
	}

	public boolean isAlertRequired() {
		return alertRequired;
	}

	public void setAlertRequired(boolean alertRequired) {
		this.alertRequired = alertRequired;
	}

	public boolean isValidationRequired() {
		return validationRequired;
	}

	public void setValidationRequired(boolean validationRequired) {
		this.validationRequired = validationRequired;
	}
	
	

}
