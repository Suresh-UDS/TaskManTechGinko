package com.ts.app.domain;

import java.io.Serializable;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * 
 * @author gnana
 *
 */
@Entity
@Table(name = "settings")
@Cacheable(true)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Setting extends AbstractAuditingEntity implements Serializable {

    /**a
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

	private long projectId;
	
	private String projectName;
	
	private long siteId;
	
	private String siteName;
	
	@NotNull
    @Size(min = 1, max = 250)
    @Column(length = 250, nullable = false)
    private String settingKey;

    @NotNull
    @Size(min = 1, max = 2000)
    @Column(length = 2000)
    private String settingValue;

    @Size(min = 1, max = 2500)
    private String description;
    
    private boolean clientGroupAlert;

    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    
    public String getSettingKey() {
		return settingKey;
	}
	public void setSettingKey(String key) {
		this.settingKey = key;
	}

	public String getSettingValue() {
		return settingValue;
	}

	public void setSettingValue(String settingValue) {
		this.settingValue = settingValue;
	}
	
	public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
	public boolean isClientGroupAlert() {
		return clientGroupAlert;
	}
	public void setClientGroupAlert(boolean clientGroupAlert) {
		this.clientGroupAlert = clientGroupAlert;
	}
	
}

