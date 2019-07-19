package com.ts.app.service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Parameter;
import com.ts.app.domain.ParameterConfig;
import com.ts.app.domain.ParameterUOM;
import com.ts.app.repository.ParameterConfigRepository;
import com.ts.app.repository.ParameterRepository;
import com.ts.app.repository.ParameterUOMRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.*;
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
 * Service class for managing ParameterConfig information.
 */
@Service
@Transactional
public class ParameterConfigService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(ParameterConfigService.class);

	@Inject
	private ParameterConfigRepository parameterConfigRepository;

	@Inject
	private ParameterRepository parameterRepository;

	@Inject
	private ParameterUOMRepository parameterUOMRepository;

	@Inject
	private UserRepository userRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private ImportUtil importUtil;

	public ParameterConfigDTO createParameterConfigInformation(ParameterConfigDTO parameterConfigDto) {
		// log.info("The admin Flag value is " +adminFlag);
		ParameterConfig parameterConfig = mapperUtil.toEntity(parameterConfigDto, ParameterConfig.class);
        parameterConfig.setActive(ParameterConfig.ACTIVE_YES);
		parameterConfig = parameterConfigRepository.save(parameterConfig);
		log.debug("Created Information for ParameterConfig: {}", parameterConfig);
		parameterConfigDto = mapperUtil.toModel(parameterConfig, ParameterConfigDTO.class);
		return parameterConfigDto;
	}
	
	public ParameterDTO createParameter(ParameterDTO parameterDto) {
		// log.info("The admin Flag value is " +adminFlag);
		Parameter parameter = mapperUtil.toEntity(parameterDto, Parameter.class);
        parameter.setActive(ParameterConfig.ACTIVE_YES);
		parameter = parameterRepository.save(parameter);
		log.debug("Created Information for Parameter: {}", parameter);
		parameterDto = mapperUtil.toModel(parameter, ParameterDTO.class);
		return parameterDto;
	}
	
	public ParameterUOMDTO createParameterUOM(ParameterUOMDTO parameterUomDto) {
		// log.info("The admin Flag value is " +adminFlag);
		ParameterUOM parameterUom = mapperUtil.toEntity(parameterUomDto, ParameterUOM.class);
		parameterUom.setActive(ParameterConfig.ACTIVE_YES);
		parameterUom = parameterUOMRepository.save(parameterUom);
		log.debug("Created Information for ParameterUOM: {}", parameterUom);
		parameterUomDto = mapperUtil.toModel(parameterUom, ParameterUOMDTO.class);
		return parameterUomDto;
	}

	public void updateParameterConfig(ParameterConfigDTO parameterConfig) {
		log.debug("Inside Update");
		ParameterConfig parameterConfigUpdate = parameterConfigRepository.findOne(parameterConfig.getId());
		mapToEntity(parameterConfig,parameterConfigUpdate);
		parameterConfigRepository.saveAndFlush(parameterConfigUpdate);
	}

	private void mapToEntity(ParameterConfigDTO parameterConfigDTO, ParameterConfig parameterConfig) {
		parameterConfig.setName(parameterConfigDTO.getName());
		parameterConfig.setUom(parameterConfigDTO.getUom());
		parameterConfig.setAssetType(parameterConfigDTO.getAssetType());
		parameterConfig.setRule(parameterConfigDTO.getRule());
		parameterConfig.setAlertRequired(parameterConfigDTO.isAlertRequired());
		parameterConfig.setConsumptionMonitoringRequired(parameterConfigDTO.isConsumptionMonitoringRequired());
		parameterConfig.setValidationRequired(parameterConfigDTO.isValidationRequired());
		parameterConfig.setThreshold(parameterConfigDTO.getThreshold());
		parameterConfig.setMax(parameterConfigDTO.getMax());
		parameterConfig.setMin(parameterConfigDTO.getMin());
	}

	private ParameterConfigDTO mapToModel(ParameterConfig parameterConfig, boolean includeShifts) {
		ParameterConfigDTO parameterConfigDTO = new ParameterConfigDTO();
		parameterConfigDTO.setId(parameterConfig.getId());
		parameterConfigDTO.setName(parameterConfig.getName());
		parameterConfigDTO.setUom(parameterConfig.getUom());
		parameterConfigDTO.setAlertRequired(parameterConfig.isAlertRequired());
		parameterConfigDTO.setValidationRequired(parameterConfig.isValidationRequired());
		parameterConfigDTO.setConsumptionMonitoringRequired(parameterConfig.isConsumptionMonitoringRequired());
		parameterConfigDTO.setAssetType(parameterConfig.getAssetType());
		parameterConfigDTO.setMax(parameterConfig.getMax());
		parameterConfigDTO.setMin(parameterConfig.getMin());
		return parameterConfigDTO;
	}


	public void deleteParameterConfig(Long id) {
		log.debug("Inside Delete");
		ParameterConfig parameterConfigUpdate = parameterConfigRepository.findOne(id);
        parameterConfigUpdate.setActive(ParameterConfig.ACTIVE_NO);
		parameterConfigRepository.save(parameterConfigUpdate);
	}

	public List<ParameterConfigDTO> findAll() {
		List<ParameterConfig> entities = parameterConfigRepository.findAll();
		return mapperUtil.toModelList(entities, ParameterConfigDTO.class);
	}
	
	public List<ParameterDTO> findAllParameters() {
		List<Parameter> entities = parameterRepository.findAll();
		return mapperUtil.toModelList(entities, ParameterDTO.class);
	}
	
	public List<ParameterUOMDTO> findAllParameterUOMs() {
		List<ParameterUOM> entities = parameterUOMRepository.findAll();
		return mapperUtil.toModelList(entities, ParameterUOMDTO.class);
	}

	public ParameterConfigDTO findOne(Long id) {
		ParameterConfig entity = parameterConfigRepository.findOne(id);
		return mapperUtil.toModel(entity, ParameterConfigDTO.class);
	}

	public SearchResult<ParameterConfigDTO> findBySearchCrieria(SearchCriteria searchCriteria) {

        //-------
		SearchResult<ParameterConfigDTO> result = new SearchResult<ParameterConfigDTO>();
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
            Page<ParameterConfig> page = null;
			List<ParameterConfigDTO> transactions = null;
			log.debug("ParameterConfig name = "+ searchCriteria.getName() + " ,  assetType = "+ searchCriteria.getAssetTypeName());
			if(!searchCriteria.isFindAll()) {
				if(!StringUtils.isEmpty(searchCriteria.getAssetType())
						&& !StringUtils.isEmpty(searchCriteria.getName())) {
					page = parameterConfigRepository.findAll(searchCriteria.getAssetTypeName(), searchCriteria.getName(), pageRequest);
				}else if(!StringUtils.isEmpty(searchCriteria.getAssetType())) {
					page = parameterConfigRepository.findAllByAssetType(searchCriteria.getAssetTypeName(), pageRequest);
				}else if(!StringUtils.isEmpty(searchCriteria.getName())) {
					page = parameterConfigRepository.findAllByName(searchCriteria.getName(), pageRequest);
				}
			}else {
				page = parameterConfigRepository.findAllConfig(pageRequest);
			}
			if(page != null) {
				if(transactions == null) {
					transactions = new ArrayList<ParameterConfigDTO>();
				}
				List<ParameterConfig> parameterConfigList =  page.getContent();
				if(CollectionUtils.isNotEmpty(parameterConfigList)) {
					for(ParameterConfig parameterConfig : parameterConfigList) {
						transactions.add(mapToModel(parameterConfig, false));
					}
				}
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}

		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<ParameterConfig> page, List<ParameterConfigDTO> transactions, SearchResult<ParameterConfigDTO> result) {
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

	public List<ParameterConfigDTO> findByAssertType(String type) {
		// TODO Auto-generated method stub
		List<ParameterConfig> entities = parameterConfigRepository.findAllByAssetType(type);
		return mapperUtil.toModelList(entities, ParameterConfigDTO.class);
	}


}
