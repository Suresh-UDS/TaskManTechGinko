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
    
    private long dayWiseAttendanceAlertTimeId;
    
    private Date dayWiseAttendanceAlertTime;
	
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
    
    private long readingEmailsId;
    
    private long readingEmailAlertId;
    
    private boolean readingEmailAlert;
    
    private List<String> readingEmailIds;
    
    private long assetEmailsId;
    
    private long assetEmailAlertId;
    
    private boolean assetEmailAlert;
    
    private List<String> assetEmailIds;
    
    private long ppmEmailsId;
    
    private long ppmEmailAlertId;
    
    private boolean ppmEmailAlert;
    
    private List<String> ppmEmailIds;
    
    private long amcEmailsId;
    
    private long amcEmailAlertId;
    
    private boolean amcEmailAlert;
    
    private List<String> amcEmailIds;
    
    private long warrantyEmailsId;
    
    private long warrantyEmailAlertId;
    
    private boolean warrantyEmailAlert;
    
    private List<String> warrantyEmailIds;
    
    private long purchaseReqEmailsId;
    
    private long purchaseReqEmailAlertId;
    
    private boolean purchaseReqEmailAlert;
    
    private List<String> purchaseReqEmailIds;

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

	public long getReadingEmailsId() {
		return readingEmailsId;
	}

	public void setReadingEmailsId(long readingEmailsId) {
		this.readingEmailsId = readingEmailsId;
	}

	public boolean isReadingEmailAlert() {
		return readingEmailAlert;
	}

	public void setReadingEmailAlert(boolean readingEmailAlert) {
		this.readingEmailAlert = readingEmailAlert;
	}

	public List<String> getReadingEmailIds() {
		return readingEmailIds;
	}

	public void setReadingEmailIds(List<String> readingEmailIds) {
		this.readingEmailIds = readingEmailIds;
	}

	public long getReadingEmailAlertId() {
		return readingEmailAlertId;
	}

	public void setReadingEmailAlertId(long readingEmailAlertId) {
		this.readingEmailAlertId = readingEmailAlertId;
	}

	public long getAssetEmailsId() {
		return assetEmailsId;
	}

	public void setAssetEmailsId(long assetEmailsId) {
		this.assetEmailsId = assetEmailsId;
	}

	public long getAssetEmailAlertId() {
		return assetEmailAlertId;
	}

	public void setAssetEmailAlertId(long assetEmailAlertId) {
		this.assetEmailAlertId = assetEmailAlertId;
	}

	public boolean isAssetEmailAlert() {
		return assetEmailAlert;
	}

	public void setAssetEmailAlert(boolean assetEmailAlert) {
		this.assetEmailAlert = assetEmailAlert;
	}

	public List<String> getAssetEmailIds() {
		return assetEmailIds;
	}

	public void setAssetEmailIds(List<String> assetEmailIds) {
		this.assetEmailIds = assetEmailIds;
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
	
	public long getDayWiseAttendanceAlertTimeId() {
		return dayWiseAttendanceAlertTimeId;
	}

	public void setDayWiseAttendanceAlertTimeId(long dayWiseAttendanceAlertTimeId) {
		this.dayWiseAttendanceAlertTimeId = dayWiseAttendanceAlertTimeId;
	}

	public Date getDayWiseAttendanceAlertTime() {
		return dayWiseAttendanceAlertTime;
	}

	public void setDayWiseAttendanceAlertTime(Date dayWiseAttendanceAlertTime) {
		this.dayWiseAttendanceAlertTime = dayWiseAttendanceAlertTime;
	}

	public int getLateAttendanceGraceTime() {
		return lateAttendanceGraceTime;
	}

	public void setLateAttendanceGraceTime(int lateAttendanceGraceTime) {
		this.lateAttendanceGraceTime = lateAttendanceGraceTime;
	}

	public long getLateAttendanceGraceTimeId() {
		return lateAttendanceGraceTimeId;
	}

	public void setLateAttendanceGraceTimeId(long lateAttendanceGraceTimeId) {
		this.lateAttendanceGraceTimeId = lateAttendanceGraceTimeId;
	}

	public long getPpmEmailsId() {
		return ppmEmailsId;
	}

	public void setPpmEmailsId(long ppmEmailsId) {
		this.ppmEmailsId = ppmEmailsId;
	}

	public long getPpmEmailAlertId() {
		return ppmEmailAlertId;
	}

	public void setPpmEmailAlertId(long ppmEmailAlertId) {
		this.ppmEmailAlertId = ppmEmailAlertId;
	}

	public boolean isPpmEmailAlert() {
		return ppmEmailAlert;
	}

	public void setPpmEmailAlert(boolean ppmEmailAlert) {
		this.ppmEmailAlert = ppmEmailAlert;
	}

	public List<String> getPpmEmailIds() {
		return ppmEmailIds;
	}

	public void setPpmEmailIds(List<String> ppmEmailIds) {
		this.ppmEmailIds = ppmEmailIds;
	}

	public long getAmcEmailsId() {
		return amcEmailsId;
	}

	public void setAmcEmailsId(long amcEmailsId) {
		this.amcEmailsId = amcEmailsId;
	}

	public long getAmcEmailAlertId() {
		return amcEmailAlertId;
	}

	public void setAmcEmailAlertId(long amcEmailAlertId) {
		this.amcEmailAlertId = amcEmailAlertId;
	}

	public boolean isAmcEmailAlert() {
		return amcEmailAlert;
	}

	public void setAmcEmailAlert(boolean amcEmailAlert) {
		this.amcEmailAlert = amcEmailAlert;
	}

	public List<String> getAmcEmailIds() {
		return amcEmailIds;
	}

	public void setAmcEmailIds(List<String> amcEmailIds) {
		this.amcEmailIds = amcEmailIds;
	}

	public long getWarrantyEmailsId() {
		return warrantyEmailsId;
	}

	public void setWarrantyEmailsId(long warrantyEmailsId) {
		this.warrantyEmailsId = warrantyEmailsId;
	}

	public long getWarrantyEmailAlertId() {
		return warrantyEmailAlertId;
	}

	public void setWarrantyEmailAlertId(long warrantyEmailAlertId) {
		this.warrantyEmailAlertId = warrantyEmailAlertId;
	}

	public boolean isWarrantyEmailAlert() {
		return warrantyEmailAlert;
	}

	public void setWarrantyEmailAlert(boolean warrantyEmailAlert) {
		this.warrantyEmailAlert = warrantyEmailAlert;
	}

	public List<String> getWarrantyEmailIds() {
		return warrantyEmailIds;
	}

	public void setWarrantyEmailIds(List<String> warrantyEmailIds) {
		this.warrantyEmailIds = warrantyEmailIds;
	}

	public long getPurchaseReqEmailsId() {
		return purchaseReqEmailsId;
	}

	public void setPurchaseReqEmailsId(long purchaseReqEmailsId) {
		this.purchaseReqEmailsId = purchaseReqEmailsId;
	}

	public long getPurchaseReqEmailAlertId() {
		return purchaseReqEmailAlertId;
	}

	public void setPurchaseReqEmailAlertId(long purchaseReqEmailAlertId) {
		this.purchaseReqEmailAlertId = purchaseReqEmailAlertId;
	}

	public boolean isPurchaseReqEmailAlert() {
		return purchaseReqEmailAlert;
	}

	public void setPurchaseReqEmailAlert(boolean purchaseReqEmailAlert) {
		this.purchaseReqEmailAlert = purchaseReqEmailAlert;
	}

	public List<String> getPurchaseReqEmailIds() {
		return purchaseReqEmailIds;
	}

	public void setPurchaseReqEmailIds(List<String> purchaseReqEmailIds) {
		this.purchaseReqEmailIds = purchaseReqEmailIds;
	}

	
}
