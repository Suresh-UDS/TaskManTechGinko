package com.ts.app.web.rest.dto;

public class UserRolePermissionDTO extends BaseDTO {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private long id;

	private long roleId;
	
	private String roleName;

	private long moduleId;
	
	private String moduleNaame;

	private long actionId;
	
	private String actionNaame;

	private long userId;

	private String permissionType;

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

	public String getModuleNaame() {
		return moduleNaame;
	}

	public void setModuleNaame(String moduleNaame) {
		this.moduleNaame = moduleNaame;
	}

	public long getActionId() {
		return actionId;
	}

	public void setActionId(long actionId) {
		this.actionId = actionId;
	}

	public String getActionNaame() {
		return actionNaame;
	}

	public void setActionNaame(String actionNaame) {
		this.actionNaame = actionNaame;
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
	
}
