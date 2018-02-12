package com.ts.app.domain;

import java.io.Serializable;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "job_checklist")
@Cacheable(true)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class JobChecklist extends AbstractAuditingEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue
	@Column(name = "id")
	private long id;

	@Column(name = "checklist_id")
	private String checklistId;

	@Column(name = "checklist_name")
	private String checklistName;
	
	@Column(name = "checklist_item_id")
	private String checklistItemId;

	@Column(name = "checklist_item_name")
	private String checklistItemName;
	
	@ManyToOne()
	@JoinColumn(name = "job_id")
	private Job job;
	
	@Column(name = "is_completed")
	private boolean completed;


	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getChecklistId() {
		return checklistId;
	}

	public void setChecklistId(String checklistId) {
		this.checklistId = checklistId;
	}

	public String getChecklistName() {
		return checklistName;
	}

	public void setChecklistName(String checklistName) {
		this.checklistName = checklistName;
	}

	public String getChecklistItemId() {
		return checklistItemId;
	}

	public void setChecklistItemId(String checklistItemId) {
		this.checklistItemId = checklistItemId;
	}

	public String getChecklistItemName() {
		return checklistItemName;
	}

	public void setChecklistItemName(String checklistItemName) {
		this.checklistItemName = checklistItemName;
	}

	public boolean isCompleted() {
		return completed;
	}

	public void setCompleted(boolean completed) {
		this.completed = completed;
	}

	public Job getJob() {
		return job;
	}

	public void setJob(Job job) {
		this.job = job;
	}

	
}
