package com.ts.app.web.rest.dto;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.ts.app.domain.AbstractAuditingEntity;

@Entity
@Table(name = "application_action")
public class ApplicationActionDTO extends BaseDTO {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue
	@Column(name = "id")
	private long id;

	@Column(name = "action_name")
	private String name;

	@ManyToMany(mappedBy = "moduleActions")
	private Set<ApplicationModuleDTO> module;

	@OneToMany(mappedBy = "action", cascade = CascadeType.ALL)
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

	public Set<ApplicationModuleDTO> getModule() {
		if (module == null) {
			module = new HashSet<>();
		}
		return module;
	}

	public void setModule(Set<ApplicationModuleDTO> module) {
		this.module = module;
	}

}
