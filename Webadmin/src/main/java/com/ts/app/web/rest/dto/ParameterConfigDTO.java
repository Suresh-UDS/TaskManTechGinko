package com.ts.app.web.rest.dto;

import java.io.Serializable;


/**
 * 
 * @author gnana
 *
 */
public class ParameterConfigDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String assetType;

    private String name;

    private String uom;
    
    private boolean consumptionMonitoringRequired;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

	public String getAssetType() {
		return assetType;
	}

	public void setAssetType(String assetType) {
		this.assetType = assetType;
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

	public boolean isConsumptionMonitoringRequired() {
		return consumptionMonitoringRequired;
	}

	public void setConsumptionMonitoringRequired(boolean consumptionMonitoringRequired) {
		this.consumptionMonitoringRequired = consumptionMonitoringRequired;
	}

    
}
