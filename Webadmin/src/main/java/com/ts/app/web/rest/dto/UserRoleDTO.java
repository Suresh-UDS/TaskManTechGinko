package com.ts.app.web.rest.dto;

import java.io.Serializable;

public class UserRoleDTO extends BaseDTO  implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long id;

	private String name;
	
	private String description;

	private boolean activeFlag;

	private boolean isDeleted;
	
	private int roleLevel;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

	public boolean isActiveFlag() {
		return activeFlag;
	}

	public void setActiveFlag(boolean activeFlag) {
		this.activeFlag = activeFlag;
	}

	public int getRoleLevel() {
		return roleLevel;
	}

	public void setRoleLevel(int roleLevel) {
		this.roleLevel = roleLevel;
	}

	
	/*@Override
	public String toString() {
		return "TblUserRole [id=" + id + ", name=" + name + ", level=" + level + ", description=" + description
				+ ", activeFlag=" + activeFlag + ", isDeleted=" + isDeleted + ", rolePermission=" + rolePermission
				+ "]";
	}*/

}
