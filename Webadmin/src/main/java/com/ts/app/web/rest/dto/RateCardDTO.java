package com.ts.app.web.rest.dto;

import java.io.Serializable;

import com.ts.app.domain.RateType;
import com.ts.app.domain.UOMType;


public class RateCardDTO extends BaseDTO implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    private String id;

    private String name;

    private String title;

    private RateType type;

    private UOMType uom;

    private String amount;

    private long siteId;

    private String siteName;

    private long projectId;

    private String projectName;


    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

	public RateType getType() {
		return type;
	}
	public void setType(RateType type) {
		this.type = type;
	}
	public UOMType getUom() {
		return uom;
	}
	public void setUom(UOMType uom) {
		this.uom = uom;
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


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
