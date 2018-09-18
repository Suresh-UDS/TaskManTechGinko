package com.ts.app.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "material_indent_gen")
public class MaterialIndentGen {
	
	@Id
	@GenericGenerator(name = "seq_ref_number", strategy = "com.ts.app.domain.util.MaterialIndentUnique")
	@GeneratedValue(generator = "seq_ref_number")  
	@Column(name="reference_number")
	private long number;
	
	@OneToOne()
	@JoinColumn(name = "MaterialIndentId", nullable = true)
	private MaterialIndent MaterialIndent;

	public long getNumber() {
		return number;
	}

	public void setNumber(long number) {
		this.number = number;
	}

	public MaterialIndent getMaterialIndent() {
		return MaterialIndent;
	}

	public void setMaterialIndent(MaterialIndent materialIndent) {
		MaterialIndent = materialIndent;
	}


}
