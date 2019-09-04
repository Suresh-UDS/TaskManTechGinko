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
    
    private String assetTypeCode;

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

	public String getAssetTypeCode() {
		return assetTypeCode;
	}

	public void setAssetTypeCode(String assetTypeCode) {
		this.assetTypeCode = assetTypeCode;
	}
    
    
}
