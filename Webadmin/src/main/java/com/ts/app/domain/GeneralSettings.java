package com.ts.app.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "general_settings")
public class GeneralSettings {

	
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

	private String settingName;
	
	private boolean switchedOn;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getSettingName() {
		return settingName;
	}

	public void setSettingName(String settingName) {
		this.settingName = settingName;
	}

	public boolean isSwitchedOn() {
		return switchedOn;
	}

	public void setSwitchedOn(boolean switchedOn) {
		this.switchedOn = switchedOn;
	}
	
	

}
