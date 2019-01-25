package com.ts.app.web.rest.dto;

public class ApplicationVersionControlDTO extends BaseDTO {

    private static final long serialVersionUID = 1L;

    private long id;

    private String storeName;

    private String applicationVersion;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getApplicationVersion() {
        return applicationVersion;
    }

    public void setApplicationVersion(String applicationVersion) {
        this.applicationVersion = applicationVersion;
    }
}
