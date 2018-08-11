package com.ts.app.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "material_indent_item")
public class MaterialIndentItem {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	private Material item;
	
	private long quantity; 
	
	@ManyToOne()
	@JoinColumn(name = "material_indent_id")
	private MaterialIndent materialIndent;
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Material getItem() {
		return item;
	}

	public void setItem(Material item) {
		this.item = item;
	}

	public long getQuantity() {
		return quantity;
	}

	public void setQuantity(long quantity) {
		this.quantity = quantity;
	}

	public MaterialIndent getMaterialIndent() {
		return materialIndent;
	}

	public void setMaterialIndent(MaterialIndent materialIndent) {
		this.materialIndent = materialIndent;
	}

	
}
