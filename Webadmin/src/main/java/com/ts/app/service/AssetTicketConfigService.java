package com.ts.app.service;

import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Asset;
import com.ts.app.domain.AssetTicketConfig;
import com.ts.app.repository.AssetRepository;
import com.ts.app.repository.AssetTicketConfigRepository;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.AssetTicketConfigDTO;
import com.ts.app.web.rest.dto.BaseDTO;

@Service
@Transactional
public class AssetTicketConfigService extends AbstractService{

	@Inject
    ImportUtil importUtil;
	
	@Inject 
	AssetTicketConfigRepository assetTicketConfigRepository;
	
	@Inject
	MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;
	
	@Inject
	AssetRepository assetRepository;
	
	@Inject
	AssetManagementService assetManagementService;
	
	//Save asset ticket config
	public AssetTicketConfigDTO createTicketConfigInfo(AssetTicketConfigDTO assetTicketConfigDTO){
		AssetTicketConfig assetTicketConfig = mapperUtil.toEntity(assetTicketConfigDTO, AssetTicketConfig.class);
		assetTicketConfig.setActive(AssetTicketConfig.ACTIVE_YES);
		assetTicketConfig = assetTicketConfigRepository.save(assetTicketConfig);
		assetTicketConfigDTO = mapperUtil.toModel(assetTicketConfig, AssetTicketConfigDTO.class);
		return assetTicketConfigDTO;
	}
	
    //Update asset ticket config
	public void updateAssetTicketConfig(AssetTicketConfigDTO assetTicketConfig) {
		AssetTicketConfig assetTicketUpdate = assetTicketConfigRepository.findOne(assetTicketConfig.getId());
		Asset asset = assetRepository.findById(assetTicketConfig.getAssetId());
		assetTicketUpdate.setAsset(asset);
		assetTicketUpdate.setTicket(assetTicketUpdate.isTicket());
		assetTicketUpdate.setSeverity(assetTicketUpdate.isSeverity());
		assetTicketConfigRepository.saveAndFlush(assetTicketUpdate);
	}
	
	//Find all 
	public List<AssetTicketConfigDTO> findAll() {
		List<AssetTicketConfig> entities = assetTicketConfigRepository.findAll();
		return mapperUtil.toModelList(entities, AssetTicketConfigDTO.class);
	}
	
	//Find One
	public AssetTicketConfigDTO findOne(Long id) {
		AssetTicketConfig entity = assetTicketConfigRepository.findOne(id);
		return mapperUtil.toModel(entity, AssetTicketConfigDTO.class);
	}
}
