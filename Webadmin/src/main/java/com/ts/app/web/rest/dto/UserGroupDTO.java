package com.ts.app.web.rest.dto;


import com.ts.app.domain.Site;

import javax.validation.constraints.Size;

/**
 * A DTO representing a UserGroup
 */
public class UserGroupDTO extends BaseDTO {  

   
	
    @Size(min = 1, max = 50)
    private String name;
    
    private long id;

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
	
	public UserGroupDTO() {
    }

    public UserGroupDTO(Site site) {
        this(site.getName());
    }

    public UserGroupDTO(String name) {

        this.name = name;
        
    }
   

    @Override
    public String toString() {
        return "UserGroupDTO{" +
            "name='" + name +
           
            "}";
    }
}
