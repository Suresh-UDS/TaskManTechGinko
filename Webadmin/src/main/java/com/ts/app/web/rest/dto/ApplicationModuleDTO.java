package com.ts.app.web.rest.dto;

import java.util.ArrayList;
import java.util.List;

public class ApplicationModuleDTO extends BaseDTO{

	private long id;

	private String name;

	private List<ApplicationActionDTO> moduleActions;

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

	public List<ApplicationActionDTO> getModuleActions() {
		if (moduleActions == null) {
			moduleActions = new ArrayList<>();
		}
		return moduleActions;
	}

	public void setModuleActions(List<ApplicationActionDTO> moduleActions) {
		this.moduleActions = moduleActions;
	}

}
