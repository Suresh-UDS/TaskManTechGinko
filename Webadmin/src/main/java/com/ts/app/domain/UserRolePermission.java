package com.ts.app.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "user_role_permission")
public class UserRolePermission extends AbstractAuditingEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue
	@Column(name = "id")
	private long id;

	@ManyToOne
	@JoinColumn(name = "role_id",nullable = true)
	private UserRole role;

	@ManyToOne
	@JoinColumn(name = "module_id")
	private ApplicationModule module;

	@ManyToOne
	@JoinColumn(name = "action_id")
	private ApplicationAction action;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = true)
	private User user;

	@Column(name = "permission_type")
	private String permissionType;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public UserRole getRole() {
		return role;
	}

	public void setRole(UserRole role) {
		this.role = role;
	}

	public ApplicationModule getModule() {
		return module;
	}

	public void setModule(ApplicationModule module) {
		this.module = module;
	}

	public ApplicationAction getAction() {
		return action;
	}

	public void setAction(ApplicationAction action) {
		this.action = action;
	}

	public String getPermissionType() {
		return permissionType;
	}

	public void setPermissionType(String permissionType) {
		this.permissionType = permissionType;
	}

}
