package com.ts.app.service;

import java.util.List;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private final Logger log = LoggerFactory.getLogger(AssetManagementService.class);

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

    //Find One By SiteId
    public List<AssetTicketConfigDTO> findOneByAssetId(Long assetId) {
	    log.debug("Asset id in find on by assetId - "+assetId);
        List<AssetTicketConfig> entity = assetTicketConfigRepository.findByAssetId(assetId);
        log.debug("Asset ticket config list size "+entity.size());
        return mapperUtil.toModelList(entity, AssetTicketConfigDTO.class);
    }
}
