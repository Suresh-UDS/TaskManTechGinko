package com.ts.app.domain;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "job_checklist")
//@Cacheable(true)
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "job_id")
	private Job job;

	@Column(name = "is_completed")
	private boolean completed;

	@Column(name = "image_1")
    private String image_1;

    @Column(name = "image_2")
    private String image_2;

    @Column(name = "image_3")
    private String image_3;

    @Column(name = "remarks")
    private String remarks;


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

	public String getChecklistItemId() {
		return checklistItemId;
	}

	public void setChecklistItemId(String checklistItemId) {
		this.checklistItemId = checklistItemId;
	}

	public String getChecklistName() {
		return checklistName;
	}

	public void setChecklistName(String checklistName) {
		this.checklistName = checklistName;
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


    public String getImage_1() {
        return image_1;
    }

    public void setImage_1(String image_1) {
        this.image_1 = image_1;
    }

    public String getImage_2() {
        return image_2;
    }

    public void setImage_2(String image_2) {
        this.image_2 = image_2;
    }

    public String getImage_3() {
        return image_3;
    }

    public void setImage_3(String image_3) {
        this.image_3 = image_3;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
