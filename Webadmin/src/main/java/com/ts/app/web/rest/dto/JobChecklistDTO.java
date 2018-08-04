package com.ts.app.web.rest.dto;

import java.io.Serializable;

public class JobChecklistDTO extends BaseDTO implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	private long id;

	private String checklistId;

	private String checklistName;

	private String checklistItemId;

	private String checklistItemName;

	private long jobId;

	private String jobTitle;

	private boolean completed;

	private String image_1;

	private String image_2;

	private String image_3;

	private String remarks;
	
	private String imageUrl_1;
	
	private String imageUrl_2;
	
	private String imageUrl_3;

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

	public long getJobId() {
		return jobId;
	}

	public void setJobId(long jobId) {
		this.jobId = jobId;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public boolean isCompleted() {
		return completed;
	}

	public void setCompleted(boolean completed) {
		this.completed = completed;
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

	public String getImageUrl_1() {
		return imageUrl_1;
	}

	public void setImageUrl_1(String imageUrl_1) {
		this.imageUrl_1 = imageUrl_1;
	}

	public String getImageUrl_2() {
		return imageUrl_2;
	}

	public void setImageUrl_2(String imageUrl_2) {
		this.imageUrl_2 = imageUrl_2;
	}

	public String getImageUrl_3() {
		return imageUrl_3;
	}

	public void setImageUrl_3(String imageUrl_3) {
		this.imageUrl_3 = imageUrl_3;
	}
}
