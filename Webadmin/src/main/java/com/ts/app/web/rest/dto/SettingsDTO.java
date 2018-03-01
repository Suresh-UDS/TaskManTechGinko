package com.ts.app.web.rest.dto;

import java.io.Serializable;
import java.util.List;

public class SettingsDTO extends BaseDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

    private long siteId;
    
    private String siteName;

    private long projectId;
    
    private String projectName; 
    
    private long overdueEmailAlertId;
    
    private boolean overdueEmailAlert;
    
    private long eodJobEmailAlertId;
    
    private boolean eodJobEmailAlert;
    
    private long overdueEmailsId;
    
    private List<String> overdueEmailIds;
    
    private long eodJobEmailsId;
    
    private List<String> eodJobEmailIds;

	public long getSiteId() {
		return siteId;
	}

	public void setSiteId(long siteId) {
		this.siteId = siteId;
	}

	public String getSiteName() {
		return siteName;
	}

	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}

	public long getProjectId() {
		return projectId;
	}

	public void setProjectId(long projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public long getOverdueEmailAlertId() {
		return overdueEmailAlertId;
	}

	public void setOverdueEmailAlertId(long overdueEmailAlertId) {
		this.overdueEmailAlertId = overdueEmailAlertId;
	}

	public long getEodJobEmailAlertId() {
		return eodJobEmailAlertId;
	}

	public void setEodJobEmailAlertId(long eodJobEmailAlertId) {
		this.eodJobEmailAlertId = eodJobEmailAlertId;
	}

	public long getOverdueEmailsId() {
		return overdueEmailsId;
	}

	public void setOverdueEmailsId(long overdueEmailsId) {
		this.overdueEmailsId = overdueEmailsId;
	}

	public long getEodJobEmailsId() {
		return eodJobEmailsId;
	}

	public void setEodJobEmailsId(long eodJobEmailsId) {
		this.eodJobEmailsId = eodJobEmailsId;
	}

	public boolean isOverdueEmailAlert() {
		return overdueEmailAlert;
	}

	public void setOverdueEmailAlert(boolean overdueEmailAlert) {
		this.overdueEmailAlert = overdueEmailAlert;
	}

	public boolean isEodJobEmailAlert() {
		return eodJobEmailAlert;
	}

	public void setEodJobEmailAlert(boolean eodJobEmailAlert) {
		this.eodJobEmailAlert = eodJobEmailAlert;
	}

	public List<String> getOverdueEmailIds() {
		return overdueEmailIds;
	}

	public void setOverdueEmailIds(List<String> overdueEmailIds) {
		this.overdueEmailIds = overdueEmailIds;
	}

	public List<String> getEodJobEmailIds() {
		return eodJobEmailIds;
	}

	public void setEodJobEmailIds(List<String> eodJobEmailIds) {
		this.eodJobEmailIds = eodJobEmailIds;
	}

	
}
