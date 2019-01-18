package com.ts.app.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "application_module")
@Cacheable(true)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ApplicationModule extends AbstractAuditingEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue
	@Column(name = "id")
	private long id;

	@Column(name = "module_name")
	private String name;

	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name = "application_module_actions", joinColumns = {
			@JoinColumn(name = "module_id", referencedColumnName = "id") }, inverseJoinColumns = {
					@JoinColumn(name = "action_id", referencedColumnName = "id") })
	private Set<ApplicationAction> moduleActions;

	@OneToMany(mappedBy = "module", cascade = CascadeType.ALL)
	private Set<UserRolePermission> rolePermission;

	public Set<UserRolePermission> getRolePermission() {
		return rolePermission;
	}

	public void setRolePermission(Set<UserRolePermission> rolePermission) {
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

	public Set<ApplicationAction> getModuleActions() {
		if (moduleActions == null) {
			moduleActions = new HashSet<>();
		}
		return moduleActions;
	}

	public void setModuleActions(Set<ApplicationAction> moduleActions) {
		this.moduleActions = moduleActions;
	}

}
