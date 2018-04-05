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
    
    private long attendanceEmailAlertId;
    
    private boolean attendanceEmailAlert;

    private long overdueEmailAlertId;
    
    private boolean overdueEmailAlert;
    
    private long eodJobEmailAlertId;
    
    private boolean eodJobEmailAlert;
    
    private long feedbackEmailAlertId;
    
    private boolean feedbackEmailAlert;

    private long quotationEmailAlertId;
    
    private boolean quotationEmailAlert;

    private long attendanceEmailsId;
    
    private List<String> attendanceEmailIds;

    private long overdueEmailsId;
    
    private List<String> overdueEmailIds;
    
    private long eodJobEmailsId;
    
    private List<String> eodJobEmailIds;

    private long feedbackEmailsId;
    
    private List<String> feedbackEmailIds;

    private long quotationEmailsId;
    
    private List<String> quotationEmailIds;

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

	public long getFeedbackEmailAlertId() {
		return feedbackEmailAlertId;
	}

	public void setFeedbackEmailAlertId(long feedbackEmailAlertId) {
		this.feedbackEmailAlertId = feedbackEmailAlertId;
	}

	public boolean isFeedbackEmailAlert() {
		return feedbackEmailAlert;
	}

	public void setFeedbackEmailAlert(boolean feedbackEmailAlert) {
		this.feedbackEmailAlert = feedbackEmailAlert;
	}

	public long getFeedbackEmailsId() {
		return feedbackEmailsId;
	}

	public void setFeedbackEmailsId(long feedbackEmailsId) {
		this.feedbackEmailsId = feedbackEmailsId;
	}

	public List<String> getFeedbackEmailIds() {
		return feedbackEmailIds;
	}

	public void setFeedbackEmailIds(List<String> feedbackEmailIds) {
		this.feedbackEmailIds = feedbackEmailIds;
	}

	public long getAttendanceEmailAlertId() {
		return attendanceEmailAlertId;
	}

	public void setAttendanceEmailAlertId(long attendanceEmailAlertId) {
		this.attendanceEmailAlertId = attendanceEmailAlertId;
	}

	public boolean isAttendanceEmailAlert() {
		return attendanceEmailAlert;
	}

	public void setAttendanceEmailAlert(boolean attendanceEmailAlert) {
		this.attendanceEmailAlert = attendanceEmailAlert;
	}

	public long getAttendanceEmailsId() {
		return attendanceEmailsId;
	}

	public void setAttendanceEmailsId(long attendanceEmailsId) {
		this.attendanceEmailsId = attendanceEmailsId;
	}

	public List<String> getAttendanceEmailIds() {
		return attendanceEmailIds;
	}

	public void setAttendanceEmailIds(List<String> attendanceEmailIds) {
		this.attendanceEmailIds = attendanceEmailIds;
	}

	public long getQuotationEmailAlertId() {
		return quotationEmailAlertId;
	}

	public void setQuotationEmailAlertId(long quotationEmailAlertId) {
		this.quotationEmailAlertId = quotationEmailAlertId;
	}

	public boolean isQuotationEmailAlert() {
		return quotationEmailAlert;
	}

	public void setQuotationEmailAlert(boolean quotationEmailAlert) {
		this.quotationEmailAlert = quotationEmailAlert;
	}

	public long getQuotationEmailsId() {
		return quotationEmailsId;
	}

	public void setQuotationEmailsId(long quotationEmailsId) {
		this.quotationEmailsId = quotationEmailsId;
	}

	public List<String> getQuotationEmailIds() {
		return quotationEmailIds;
	}

	public void setQuotationEmailIds(List<String> quotationEmailIds) {
		this.quotationEmailIds = quotationEmailIds;
	}

	
}
