package com.ts.app.web.rest.dto;

import java.io.Serializable;
import java.util.Date;
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
    
    private long shiftWiseAttendanceEmailAlertId;
    
    private boolean shiftWiseAttendanceEmailAlert;

    private long dayWiseAttendanceEmailAlertId;
    
    private boolean dayWiseAttendanceEmailAlert;

    private long overdueEmailAlertId;
    
    private boolean overdueEmailAlert;
    
    private long eodJobEmailAlertId;
    
    private boolean eodJobEmailAlert;
    
    private long feedbackEmailAlertId;
    
    private boolean feedbackEmailAlert;

    private long quotationEmailAlertId;
    
    private boolean quotationEmailAlert;

    private long ticketEmailAlertId;
    
    private boolean ticketEmailAlert;

    private long shiftWiseAttendanceEmailsId;
    
    private List<String> shiftWiseAttendanceEmailIds;
    
    private long dayWiseAttendanceAlterTimeId;
    
    private Date dayWiseAttendanceAlterTime;
	
    private long lateAttendanceGraceTimeId;
	
    private int lateAttendanceGraceTime;

    private long dayWiseAttendanceEmailsId;
    
    private List<String> dayWiseAttendanceEmailIds;

    private long overdueEmailsId;
    
    private List<String> overdueEmailIds;
    
    private long eodJobEmailsId;
    
    private List<String> eodJobEmailIds;

    private long feedbackEmailsId;
    
    private List<String> feedbackEmailIds;

    private long quotationEmailsId;
    
    private List<String> quotationEmailIds;
    
    private long ticketEmailsId;
    
    private List<String> ticketEmailIds;

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

	public long getTicketEmailAlertId() {
		return ticketEmailAlertId;
	}

	public void setTicketEmailAlertId(long ticketEmailAlertId) {
		this.ticketEmailAlertId = ticketEmailAlertId;
	}

	public boolean isTicketEmailAlert() {
		return ticketEmailAlert;
	}

	public void setTicketEmailAlert(boolean ticketEmailAlert) {
		this.ticketEmailAlert = ticketEmailAlert;
	}

	public long getTicketEmailsId() {
		return ticketEmailsId;
	}

	public void setTicketEmailsId(long ticketEmailsId) {
		this.ticketEmailsId = ticketEmailsId;
	}

	public List<String> getTicketEmailIds() {
		return ticketEmailIds;
	}

	public void setTicketEmailIds(List<String> ticketEmailIds) {
		this.ticketEmailIds = ticketEmailIds;
	}

	public long getShiftWiseAttendanceEmailAlertId() {
		return shiftWiseAttendanceEmailAlertId;
	}

	public void setShiftWiseAttendanceEmailAlertId(long shiftWiseAttendanceEmailAlertId) {
		this.shiftWiseAttendanceEmailAlertId = shiftWiseAttendanceEmailAlertId;
	}

	public boolean isShiftWiseAttendanceEmailAlert() {
		return shiftWiseAttendanceEmailAlert;
	}

	public void setShiftWiseAttendanceEmailAlert(boolean shiftWiseAttendanceEmailAlert) {
		this.shiftWiseAttendanceEmailAlert = shiftWiseAttendanceEmailAlert;
	}

	public long getDayWiseAttendanceEmailAlertId() {
		return dayWiseAttendanceEmailAlertId;
	}

	public void setDayWiseAttendanceEmailAlertId(long dayWiseAttendanceEmailAlertId) {
		this.dayWiseAttendanceEmailAlertId = dayWiseAttendanceEmailAlertId;
	}

	public boolean isDayWiseAttendanceEmailAlert() {
		return dayWiseAttendanceEmailAlert;
	}

	public void setDayWiseAttendanceEmailAlert(boolean dayWiseAttendanceEmailAlert) {
		this.dayWiseAttendanceEmailAlert = dayWiseAttendanceEmailAlert;
	}

	public long getShiftWiseAttendanceEmailsId() {
		return shiftWiseAttendanceEmailsId;
	}

	public void setShiftWiseAttendanceEmailsId(long shiftWiseAttendanceEmailsId) {
		this.shiftWiseAttendanceEmailsId = shiftWiseAttendanceEmailsId;
	}

	public List<String> getShiftWiseAttendanceEmailIds() {
		return shiftWiseAttendanceEmailIds;
	}

	public void setShiftWiseAttendanceEmailIds(List<String> shiftWiseAttendanceEmailIds) {
		this.shiftWiseAttendanceEmailIds = shiftWiseAttendanceEmailIds;
	}

	public long getDayWiseAttendanceEmailsId() {
		return dayWiseAttendanceEmailsId;
	}

	public void setDayWiseAttendanceEmailsId(long dayWiseAttendanceEmailsId) {
		this.dayWiseAttendanceEmailsId = dayWiseAttendanceEmailsId;
	}

	public List<String> getDayWiseAttendanceEmailIds() {
		return dayWiseAttendanceEmailIds;
	}

	public void setDayWiseAttendanceEmailIds(List<String> dayWiseAttendanceEmailIds) {
		this.dayWiseAttendanceEmailIds = dayWiseAttendanceEmailIds;
	}

	public Date getDayWiseAttendanceAlterTime() {
		return dayWiseAttendanceAlterTime;
	}

	public void setDayWiseAttendanceAlterTime(Date dayWiseAttendanceAlterTime) {
		this.dayWiseAttendanceAlterTime = dayWiseAttendanceAlterTime;
	}

	public int getLateAttendanceGraceTime() {
		return lateAttendanceGraceTime;
	}

	public void setLateAttendanceGraceTime(int lateAttendanceGraceTime) {
		this.lateAttendanceGraceTime = lateAttendanceGraceTime;
	}

	public long getDayWiseAttendanceAlterTimeId() {
		return dayWiseAttendanceAlterTimeId;
	}

	public void setDayWiseAttendanceAlterTimeId(long dayWiseAttendanceAlterTimeId) {
		this.dayWiseAttendanceAlterTimeId = dayWiseAttendanceAlterTimeId;
	}

	public long getLateAttendanceGraceTimeId() {
		return lateAttendanceGraceTimeId;
	}

	public void setLateAttendanceGraceTimeId(long lateAttendanceGraceTimeId) {
		this.lateAttendanceGraceTimeId = lateAttendanceGraceTimeId;
	}

	
}
