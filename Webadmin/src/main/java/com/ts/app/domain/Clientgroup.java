package com.ts.app.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Entity
@Table(name = "clientgroup")
public class Clientgroup extends AbstractAuditingEntity implements Serializable {
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Size(min = 1, max = 250)
    @Column(length = 250, nullable = false)
    private String clientgroup;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getClientgroup() {
		return clientgroup;
	}

	public void setClientgroup(String clientgroup) {
		this.clientgroup = clientgroup;
	}


}
