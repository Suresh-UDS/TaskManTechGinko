package com.ts.app.domain;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "notification_log")
public class NotificationLog extends AbstractAuditingEntity implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@ManyToOne()
	@JoinColumn(name = "jobId", nullable = false)
	private Job job;

	@ManyToOne()
	@JoinColumn(name = "fromUserId", nullable = false)
	private User fromUser;

	@ManyToOne()
	@JoinColumn(name = "toUserId", nullable = false)
	private User toUser;

	@ManyToOne()
	@JoinColumn(name = "siteId", nullable = false)
	private Site site;

	private String message;

	private boolean isRead;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getFromUser() {
		return fromUser;
	}

	public void setFromUser(User fromUser) {
		this.fromUser = fromUser;
	}

	public User getToUser() {
		return toUser;
	}

	public void setToUser(User toUser) {
		this.toUser = toUser;
	}

	public Site getSite() {
		return site;
	}

	public void setSite(Site site) {
		this.site = site;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public boolean isRead() {
		return isRead;
	}

	public void setRead(boolean isRead) {
		this.isRead = isRead;
	}

	public Job getJob() {
		return job;
	}

	public void setJob(Job job) {
		this.job = job;
	}


}
