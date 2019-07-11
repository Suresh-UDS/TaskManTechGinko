package com.ts.app.service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.AssetType;
import com.ts.app.repository.AssetTypeRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.AssetTypeDTO;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

/**
 * Service class for managing AssetType information.
 */
@Service
@Transactional
public class AssetTypeService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(AssetTypeService.class);

	@Inject
	private AssetTypeRepository assetTypeRepository;

	@Inject
	private UserRepository userRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private ImportUtil importUtil;

	public AssetTypeDTO createAssetTypeInformation(AssetTypeDTO assetTypeDto) {
		// log.info("The admin Flag value is " +adminFlag);
		AssetType assetType = mapperUtil.toEntity(assetTypeDto, AssetType.class);
		AssetType existingType = assetTypeRepository.findByName(assetTypeDto.getName());
		if(existingType == null)  { 
			assetType.setActive(AssetType.ACTIVE_YES);
			assetType.setAssetTypeCode(assetType.getAssetTypeCode());
			assetType.setRelationShipBased(assetType.isRelationShipBased());
			assetType = assetTypeRepository.save(assetType);
			log.debug("Created Information for AssetType: {}", assetType);
			assetTypeDto = mapperUtil.toModel(assetType, AssetTypeDTO.class);
		}else {
			assetTypeDto.setMessage("Asset Type already exists");
			assetTypeDto.setStatus("400");
			assetTypeDto.setErrorStatus(true);
		}
		return assetTypeDto;
       
	}

	public void updateAssetType(AssetTypeDTO assetType) {
		log.debug("Inside Update");
		AssetType assetTypeUpdate = assetTypeRepository.findOne(assetType.getId());
		mapToEntity(assetType,assetTypeUpdate);
		assetTypeRepository.saveAndFlush(assetTypeUpdate);
	}

	private void mapToEntity(AssetTypeDTO assetTypeDTO, AssetType assetType) {
		assetType.setName(assetTypeDTO.getName());
	}

	private AssetTypeDTO mapToModel(AssetType assetType, boolean includeShifts) {
		AssetTypeDTO assetTypeDTO = new AssetTypeDTO();
		assetTypeDTO.setId(assetType.getId());
		assetTypeDTO.setName(assetType.getName());
		return assetTypeDTO;
	}


	public void deleteAssetType(Long id) {
		log.debug("Inside Delete");
		AssetType assetTypeUpdate = assetTypeRepository.findOne(id);
        assetTypeUpdate.setActive(AssetType.ACTIVE_NO);
		assetTypeRepository.save(assetTypeUpdate);
	}

	public List<AssetTypeDTO> findAll() {
		List<AssetType> entities = assetTypeRepository.findAll();
		return mapperUtil.toModelList(entities, AssetTypeDTO.class);
	}

	public AssetTypeDTO findOne(Long id) {
		AssetType entity = assetTypeRepository.findOne(id);
		return mapperUtil.toModel(entity, AssetTypeDTO.class);
	}

	public SearchResult<AssetTypeDTO> findBySearchCrieria(SearchCriteria searchCriteria) {

        //-------
		SearchResult<AssetTypeDTO> result = new SearchResult<AssetTypeDTO>();
		if(searchCriteria != null) {
            Pageable pageRequest = null;
            if(!StringUtils.isEmpty(searchCriteria.getColumnName())){
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" +sort);
                pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);
            }else{
            		if(searchCriteria.isList()) {
            			pageRequest = createPageRequest(searchCriteria.getCurrPage(), true);
            		}else {
            			pageRequest = createPageRequest(searchCriteria.getCurrPage());
            		}
            }
            Page<AssetType> page = null;
			List<AssetTypeDTO> transactions = null;
			log.debug("AssetType name = "+ searchCriteria.getAssetTypeName() + " ,  assetType = "+ searchCriteria.getAssetTypeName());
			if(!searchCriteria.isFindAll()) {
				if(!StringUtils.isEmpty(searchCriteria.getAssetTypeName())) {
					page = assetTypeRepository.findAllByName(searchCriteria.getAssetTypeName(), pageRequest);
				}
			}else {
				page = assetTypeRepository.findAll(pageRequest);
			}
			if(page != null) {
				if(transactions == null) {
					transactions = new ArrayList<AssetTypeDTO>();
				}
				List<AssetType> assetTypeList =  page.getContent();
				if(CollectionUtils.isNotEmpty(assetTypeList)) {
					for(AssetType assetType : assetTypeList) {
						transactions.add(mapToModel(assetType, false));
					}
				}
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}

		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<AssetType> page, List<AssetTypeDTO> transactions, SearchResult<AssetTypeDTO> result) {
		if(page != null) {
			result.setTotalPages(page.getTotalPages());
		}
		result.setCurrPage(page.getNumber() + 1);
		result.setTotalCount(page.getTotalElements());
        result.setStartInd((result.getCurrPage() - 1) * 10 + 1);
        result.setEndInd((result.getTotalCount() > 10  ? (result.getCurrPage()) * 10 : result.getTotalCount()));

		result.setTransactions(transactions);
		return;
	}


}
