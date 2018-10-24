package com.ts.app.web.rest.dto;

import javax.validation.constraints.Size;

public class RegionDTO extends BaseDTO {

    @Size(min = 1, max = 50)
    private String name;

    private long id;

    private long projectId;

    private String projectName;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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
}
