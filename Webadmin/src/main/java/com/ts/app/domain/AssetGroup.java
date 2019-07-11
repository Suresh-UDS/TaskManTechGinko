package com.ts.app.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "assetgroup")
public class AssetGroup extends AbstractAuditingEntity implements Serializable {
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Size(min = 1, max = 250)
    @Column(length = 250, nullable = false)
    private String assetgroup;
    
    @Column(name="asset_code")
    private String assetCode;
    
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="site_id")
    private Site site;
    
    @JsonIgnore
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="parent_group_id")    
    private AssetGroup parentGroup;
    
    @OneToMany( mappedBy = "parentGroup",fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval=true)
    private List<AssetGroup> assetGroup;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getAssetgroup() {
		return assetgroup;
	}

	public void setAssetgroup(String assetgroup) {
		this.assetgroup = assetgroup;
	}

	public Site getSite() {
		return site;
	}

	public void setSite(Site site) {
		this.site = site;
	}

	 

	public String getAssetCode() {
		return assetCode;
	}

	public void setAssetCode(String assetCode) {
		this.assetCode = assetCode;
	}

	public AssetGroup getParentGroup() {
		return parentGroup;
	}
 
	public List<AssetGroup> getAssetGroup() {
		return assetGroup;
	}

	public void setAssetGroup(List<AssetGroup> assetGroup) {
		this.assetGroup = assetGroup;
	}

	public void setParentGroup(AssetGroup parentGroup) {
		this.parentGroup = parentGroup;
	}
	
}
