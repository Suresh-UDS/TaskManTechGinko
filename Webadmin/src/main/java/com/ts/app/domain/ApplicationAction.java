package com.ts.app.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "application_action")
@Cacheable(true)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ApplicationAction extends AbstractAuditingEntity implements Serializable {

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
	private Set<ApplicationModule> module;

	@OneToMany(mappedBy = "action", cascade = CascadeType.ALL)
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

	public Set<ApplicationModule> getModule() {
		if (module == null) {
			module = new HashSet<>();
		}
		return module;
	}

	public void setModule(Set<ApplicationModule> module) {
		this.module = module;
	}

}
