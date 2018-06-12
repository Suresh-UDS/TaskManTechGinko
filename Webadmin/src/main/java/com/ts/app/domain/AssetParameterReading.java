package com.ts.app.domain;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;



@Entity
@Table(name = "asset_parameter_reading")
public class AssetParameterReading extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Size(min = 1, max = 250)
    @Column(length = 250, nullable = false)
    private String name;

    @NotNull
    @Size(min = 1, max = 250)
    @Column(length = 250, nullable = false)
    private String uom;
    
    @Column(nullable = true)
    private double initialValue;

    @Column(nullable = true)
    private double finalValue;

    @Column(nullable = true)
    private double consumption;

    @Column(nullable = true)
    private double value;
    
    @Column(nullable = true)
    private boolean consumptionMonitoringRequired;
    
    @ManyToOne(fetch = FetchType.LAZY, cascade={CascadeType.ALL})
	@JoinColumn(name = "assetId", referencedColumnName = "id", nullable = true)
	private Asset asset;    
    
    @ManyToOne(fetch = FetchType.LAZY, cascade={CascadeType.ALL})
    @JoinColumn(name = "jobId", referencedColumnName = "id", nullable = true)
    private Job job;
    
    @ManyToOne(fetch = FetchType.LAZY, cascade={CascadeType.ALL})
    @JoinColumn(name = "parameterConfigId", referencedColumnName = "id", nullable = true)
    private ParameterConfig parameterConfig;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUom() {
		return uom;
	}

	public void setUom(String uom) {
		this.uom = uom;
	}

	public Asset getAsset() {
		return asset;
	}

	public void setAsset(Asset asset) {
		this.asset = asset;
	}

	public double getInitialValue() {
		return initialValue;
	}

	public void setInitialValue(double initialValue) {
		this.initialValue = initialValue;
	}

	public double getFinalValue() {
		return finalValue;
	}

	public void setFinalValue(double finalValue) {
		this.finalValue = finalValue;
	}

	public double getConsumption() {
		return consumption;
	}

	public void setConsumption(double consumption) {
		this.consumption = consumption;
	}

	public double getValue() {
		return value;
	}

	public void setValue(double value) {
		this.value = value;
	}

	public Job getJob() {
		return job;
	}

	public void setJob(Job job) {
		this.job = job;
	}

	public ParameterConfig getParameterConfig() {
		return parameterConfig;
	}

	public void setParameterConfig(ParameterConfig parameterConfig) {
		this.parameterConfig = parameterConfig;
	}

	public boolean isConsumptionMonitoringRequired() {
		return consumptionMonitoringRequired;
	}

	public void setConsumptionMonitoringRequired(boolean consumptionMonitoringRequired) {
		this.consumptionMonitoringRequired = consumptionMonitoringRequired;
	}

    
}
