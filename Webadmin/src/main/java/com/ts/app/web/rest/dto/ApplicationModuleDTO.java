package com.ts.app.web.rest.dto;

import java.util.HashSet;
import java.util.Set;

public class ApplicationModuleDTO extends BaseDTO{

	private long id;

	private String name;

	private Set<ApplicationActionDTO> moduleActions;

	private Set<UserRolePermissionDTO> rolePermission;

	public Set<UserRolePermissionDTO> getRolePermission() {
		return rolePermission;
	}

	public void setRolePermission(Set<UserRolePermissionDTO> rolePermission) {
		this.rolePermission = rolePermission;
	}

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

	public Set<ApplicationActionDTO> getModuleActions() {
		if (moduleActions == null) {
			moduleActions = new HashSet<>();
		}
		return moduleActions;
	}

	public void setModuleActions(Set<ApplicationActionDTO> moduleActions) {
		this.moduleActions = moduleActions;
	}

}
