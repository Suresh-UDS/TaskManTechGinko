package com.ts.app.web.rest.dto;

import java.util.List;

public class UserRolePermissionDTO extends BaseDTO {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private long id;

	private long roleId;
	
	private String roleName;

	private long moduleId;
	
	private String moduleName;

	private long actionId;
	
	private String actionName;

	private long userId;

	private String permissionType;
	
	private List<ApplicationModuleDTO> applicationModules;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getRoleId() {
		return roleId;
	}

	public void setRoleId(long roleId) {
		this.roleId = roleId;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public long getModuleId() {
		return moduleId;
	}

	public void setModuleId(long moduleId) {
		this.moduleId = moduleId;
	}

	public String getModuleName() {
		return moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	public long getActionId() {
		return actionId;
	}

	public void setActionId(long actionId) {
		this.actionId = actionId;
	}

	public String getActionName() {
		return actionName;
	}

	public void setActionName(String actionNaame) {
		this.actionName = actionNaame;
	}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

	public String getPermissionType() {
		return permissionType;
	}

	public void setPermissionType(String permissionType) {
		this.permissionType = permissionType;
	}

	public List<ApplicationModuleDTO> getApplicationModules() {
		return applicationModules;
	}

	public void setApplicationModules(List<ApplicationModuleDTO> applicationModules) {
		this.applicationModules = applicationModules;
	}
	
	
	
}
