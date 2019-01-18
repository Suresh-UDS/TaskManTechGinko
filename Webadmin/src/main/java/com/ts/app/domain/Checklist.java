package com.ts.app.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

@Entity
@Table(name = "checklist")
@Cacheable(true)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Checklist extends AbstractAuditingEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue
	@Column(name = "id")
	private long id;

	@Column(name = "name")
	private String name;
	
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "siteId", nullable = true)
    private Site site;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projectId", nullable = true)
    private Project project;

	@OneToMany(mappedBy = "checklist", cascade = {CascadeType.ALL}, orphanRemoval=true)
	private Set<ChecklistItem> items;

	
	public Set<ChecklistItem> getItems() {
		return items;
	}

	public void setItems(Set<ChecklistItem> items) {
		this.items = items;
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

	public Site getSite() {
		return site;
	}

	public void setSite(Site site) {
		this.site = site;
	}

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
	}
	
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("Checklist details - id : "+id);
		sb.append(", name : "+name);
		if(items != null) {
			sb.append(", items : ");
			for(ChecklistItem item : items) {
				sb.append("[ id :"+ item.getId() + ", name : "+ item.getName() +"]");
			}
		}
		return sb.toString();
	}


}
