package com.ts.app.web.rest.dto;

import java.time.ZonedDateTime;

public class SLANotificationLogDTO extends BaseDTO{

	private long id;
	
	private long processId;
	
	private long siteId;
	
	private ZonedDateTime beginDate;
	
	private ZonedDateTime escalationDate;
	
	private int Level;
	
	private String emails;
	
	private String processType;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getProcessId() {
		return processId;
	}

	public void setProcessId(long processId) {
		this.processId = processId;
	}

	public long getSiteId() {
		return siteId;
	}

	public void setSiteId(long siteId) {
		this.siteId = siteId;
	}

	public ZonedDateTime getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(ZonedDateTime beginDate) {
		this.beginDate = beginDate;
	}

	public ZonedDateTime getEscalationDate() {
		return escalationDate;
	}

	public void setEscalationDate(ZonedDateTime escalationDate) {
		this.escalationDate = escalationDate;
	}

	public int getLevel() {
		return Level;
	}

	public void setLevel(int level) {
		Level = level;
	}

	public String getEmails() {
		return emails;
	}

	public void setEmails(String emails) {
		this.emails = emails;
	}

	public String getProcessType() {
		return processType;
	}

	public void setProcessType(String processType) {
		this.processType = processType;
	}
}
