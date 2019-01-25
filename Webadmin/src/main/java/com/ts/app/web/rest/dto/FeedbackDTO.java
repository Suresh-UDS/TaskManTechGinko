package com.ts.app.web.rest.dto;

import java.io.Serializable;
import java.util.List;


public class FeedbackDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String name;

    private long projectId;

    private String projectName;

    private long siteId;

    private String siteName;

    private List<FeedbackQuestionDTO> questions;

    private String displayType;

    private String remarks;

    private boolean remarksRequired;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

	public List<FeedbackQuestionDTO> getQuestions() {
		return questions;
	}

	public void setQuestions(List<FeedbackQuestionDTO> questions) {
		this.questions = questions;
	}

    public String getDisplayType() {
        return displayType;
    }

    public void setDisplayType(String displayType) {
        this.displayType = displayType;
    }

    public boolean isRemarksRequired() {
        return remarksRequired;
    }

    public void setRemarksRequired(boolean remarksRequired) {
        this.remarksRequired = remarksRequired;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
