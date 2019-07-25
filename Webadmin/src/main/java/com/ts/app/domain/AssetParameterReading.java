package com.ts.app.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.sql.Timestamp;



@Entity
@Table(name = "asset_parameter_reading")
public class AssetParameterReading extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

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
    private double actualInitialValue;

    @Column(nullable = true)
    private double actualFinalValue;

    @Column(nullable = true)
    private double finalValue;

    @Column(nullable = true)
    private double consumption;

    @Column(nullable = true)
    private double actualConsumption;

    @Column(nullable = true)
    private double actualValue;

    @Column(nullable = true)
    private double value;
    
    @Column(nullable = true)
    private boolean consumptionMonitoringRequired;
    
    @ManyToOne(fetch = FetchType.LAZY, cascade={CascadeType.ALL})
	@JoinColumn(name = "assetId", referencedColumnName = "id", nullable = true)
	private Asset asset;    
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jobId", referencedColumnName = "id", nullable = true)
    private Job job;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assetParameterConfigId", referencedColumnName = "id", nullable = true)
    private AssetParameterConfig assetParameterConfig;
    
    @Column(nullable = true)
    private Timestamp initialReadingTime;
    
    @Column(nullable = true)
    private Timestamp finalReadingTime;
    
    @Column(nullable = true)
    private int runHours;
    
    @Column(nullable = true)
    private int runMinutues;

	public long getId() {
		return id;
	}

	public void setId(long id) {
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

	public AssetParameterConfig getAssetParameterConfig() {
		return assetParameterConfig;
	}

	public void setAssetParameterConfig(AssetParameterConfig assetParameterConfig) {
		this.assetParameterConfig = assetParameterConfig;
	}

	public boolean isConsumptionMonitoringRequired() {
		return consumptionMonitoringRequired;
	}

	public void setConsumptionMonitoringRequired(boolean consumptionMonitoringRequired) {
		this.consumptionMonitoringRequired = consumptionMonitoringRequired;
	}

	public Timestamp getInitialReadingTime() {
		return initialReadingTime;
	}

	public void setInitialReadingTime(Timestamp initialReadingTime) {
		this.initialReadingTime = initialReadingTime;
	}

	public Timestamp getFinalReadingTime() {
		return finalReadingTime;
	}

	public void setFinalReadingTime(Timestamp finalReadingTime) {
		this.finalReadingTime = finalReadingTime;
	}

	public int getRunHours() {
		return runHours;
	}

	public void setRunHours(int runHours) {
		this.runHours = runHours;
	}

	public int getRunMinutues() {
		return runMinutues;
	}

	public void setRunMinutues(int runMinutues) {
		this.runMinutues = runMinutues;
	}


    public double getActualInitialValue() {
        return actualInitialValue;
    }

    public void setActualInitialValue(double actualInitialValue) {
        this.actualInitialValue = actualInitialValue;
    }

    public double getActualFinalValue() {
        return actualFinalValue;
    }

    public void setActualFinalValue(double actualFinalValue) {
        this.actualFinalValue = actualFinalValue;
    }

    public double getActualConsumption() {
        return actualConsumption;
    }

    public void setActualConsumption(double actualConsumption) {
        this.actualConsumption = actualConsumption;
    }

    public double getActualValue() {
        return actualValue;
    }

    public void setActualValue(double actualValue) {
        this.actualValue = actualValue;
    }
}
