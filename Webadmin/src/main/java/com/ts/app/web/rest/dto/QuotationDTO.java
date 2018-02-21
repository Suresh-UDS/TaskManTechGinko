package com.ts.app.web.rest.dto;

import java.io.Serializable;

public class QuotationDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;

    private String title;

    private Number grandTotal;

    private String createByUserName;

    private String createdByUserId;

    private String sentByUserName;

    private String sentByUserId;

    private String description;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Number getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(Number grandTotal) {
        this.grandTotal = grandTotal;
    }

    public String getCreateByUserName() {
        return createByUserName;
    }

    public void setCreateByUserName(String createByUserName) {
        this.createByUserName = createByUserName;
    }

    public String getCreatedByUserId() {
        return createdByUserId;
    }

    public void setCreatedByUserId(String createdByUserId) {
        this.createdByUserId = createdByUserId;
    }

    public String getSentByUserName() {
        return sentByUserName;
    }

    public void setSentByUserName(String sentByUserName) {
        this.sentByUserName = sentByUserName;
    }

    public String getSentByUserId() {
        return sentByUserId;
    }

    public void setSentByUserId(String sentByUserId) {
        this.sentByUserId = sentByUserId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
