package com.ts.app.web.rest.dto;

/**
 *
 * @author gnana
 *
 */
public class AssetTypeDTO extends BaseDTO {
	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	private Long id;

	private String name;

    private boolean isRelationShipBased;

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


    public boolean isRelationShipBased() {
        return isRelationShipBased;
    }

    public void setRelationShipBased(boolean relationShipBased) {
        isRelationShipBased = relationShipBased;
    }
}
