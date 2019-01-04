package com.ts.app.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

@Entity
@Table(name = "user_role")
@Cacheable(true)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserRole extends AbstractAuditingEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue
	@Column(name = "id")
	private Long id;

	@Column(name = "name")
	private String name;

	@Column(name = "description")
	private String description;

	@Column(name = "Is_Active")
	private boolean activeFlag;

	@Column(name = "Is_Deleted")
	private boolean isDeleted;
	
	@Column(name = "level")
	private int roleLevel;

	@OneToMany(mappedBy = "role", cascade = CascadeType.ALL, fetch=FetchType.LAZY,orphanRemoval = true)
	private Set<UserRolePermission> rolePermissions;

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

	public Set<UserRolePermission> getRolePermissions() {
		return rolePermissions;
	}

	public void setRolePermissions(Set<UserRolePermission> rolePermission) {
		this.rolePermissions = rolePermission;
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
