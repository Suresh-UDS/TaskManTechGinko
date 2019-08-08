package com.ts.app.web.rest.dto;

public class SapBusinessCategoriesDTO extends BaseDTO {

    private long id;

    private String elementsJson;

    public String getElementsJson() {
        return elementsJson;
    }

    public void setElementsJson(String elementsJson) {
        this.elementsJson = elementsJson;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
