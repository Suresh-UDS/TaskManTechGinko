package com.ts.app.web.rest.dto;

import java.text.SimpleDateFormat;
import java.util.Date;


/**
 * Created by karth on 6/14/2017.
 */
public class LocationDTO  extends BaseDTO{

    private Long id;
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
