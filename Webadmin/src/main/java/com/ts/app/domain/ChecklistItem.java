package com.ts.app.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "checklist_item")
@Cacheable(true)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ChecklistItem extends AbstractAuditingEntity implements Serializable {

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
	
	@ManyToOne()
	@JoinColumn(name = "checklist_id")
	private Checklist checklist;


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

	public Checklist getChecklist() {
		return checklist;
	}

	public void setChecklist(Checklist checklist) {
		this.checklist = checklist;
	}

	public boolean equals(Object obj) {
		boolean result = false;
		if(obj != null && obj instanceof ChecklistItem) {
			ChecklistItem other = (ChecklistItem)obj;
			if(id == other.getId()) {
				result = true;
			}
		}
		return result;
	}

}
