package com.ts.app.web.rest.dto;

import java.io.Serializable;

public class DesignationDTO extends BaseDTO implements Serializable {


    private static final long serialVersionUID = 1L;

    private long id;

    private String designation;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }


    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }
}
