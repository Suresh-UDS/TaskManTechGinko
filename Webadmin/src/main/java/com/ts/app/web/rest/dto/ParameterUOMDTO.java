package com.ts.app.web.rest.dto;

import java.io.Serializable;


/**
 * 
 * @author gnana
 *
 */
public class ParameterUOMDTO extends BaseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String uom;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUom() {
        return uom;
    }

    public void setUom(String uom) {
        this.uom = uom;
    }
}
