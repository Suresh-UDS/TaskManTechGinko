package com.ts.app.web.rest.dto;

import java.io.Serializable;

public class NotificationLogDTO extends BaseDTO implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	private Long id;

	private UserDTO fromUser;

	private UserDTO toUser;

	private long fromUserId;

	private long toUserId;

	private long siteId;

	private String siteName;

	private String message;

	private boolean isRead;

	private long jobId;
	
	private String event;
	
	private String status;

	public Long getId() {
		return id;
	}

	public long getFromUserId() {
		return fromUserId;
	}


	public void setFromUserId(long fromUserId) {
		this.fromUserId = fromUserId;
	}


	public long getToUserId() {
		return toUserId;
	}


	public void setToUserId(long toUserId) {
		this.toUserId = toUserId;
	}


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

	public void setId(Long id) {
		this.id = id;
	}


	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public UserDTO getFromUser() {
		return fromUser;
	}

	public void setFromUser(UserDTO fromUser) {
		this.fromUser = fromUser;
	}

	public UserDTO getToUser() {
		return toUser;
	}

	public void setToUser(UserDTO toUser) {
		this.toUser = toUser;
	}

	public long getJobId() {
		return jobId;
	}

	public void setJobId(long jobId) {
		this.jobId = jobId;
	}

	public boolean isRead() {
		return isRead;
	}

	public void setRead(boolean isRead) {
		this.isRead = isRead;
	}

	public String getEvent() {
		return event;
	}

	public void setEvent(String event) {
		this.event = event;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}


}
