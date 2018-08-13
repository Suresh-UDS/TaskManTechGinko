package com.ts.app.web.rest.dto;

public class MaterialItemGroupDTO extends BaseDTO {
	
	private long id;
    private String itemGroup;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getItemGroup() {
		return itemGroup;
	}

	public void setItemGroup(String itemGroup) {
		this.itemGroup = itemGroup;
	}
	

	
}
