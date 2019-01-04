package com.ts.app.service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.WarrantyType;
import com.ts.app.repository.WarrantyTypeRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.WarrantyTypeDTO;
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

@Service
@Transactional
public class WarrantyTypeService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(WarrantyTypeService.class);

	@Inject
	private WarrantyTypeRepository warrantyTypeRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	public WarrantyTypeDTO createWarrantyTypeInformation(WarrantyTypeDTO warrantyTypeDto) {
		// log.info("The admin Flag value is " +adminFlag);
		WarrantyType warrantyType = mapperUtil.toEntity(warrantyTypeDto, WarrantyType.class);
        warrantyType.setActive(WarrantyType.ACTIVE_YES);
		warrantyType = warrantyTypeRepository.save(warrantyType);
		log.debug("Created Information for WarrantyType: {}", warrantyType);
		warrantyTypeDto = mapperUtil.toModel(warrantyType, WarrantyTypeDTO.class);
		return warrantyTypeDto;
	}

	public void updateWarrantyType(WarrantyTypeDTO warrantyType) {
		log.debug("Inside Update");
		WarrantyType warrantyTypeUpdate = warrantyTypeRepository.findOne(warrantyType.getId());
		mapToEntity(warrantyType,warrantyTypeUpdate);
		warrantyTypeRepository.saveAndFlush(warrantyTypeUpdate);
	}

	private void mapToEntity(WarrantyTypeDTO warrantyTypeDTO, WarrantyType warrantyType) {
		warrantyType.setName(warrantyTypeDTO.getName());
	}

	private WarrantyTypeDTO mapToModel(WarrantyType warrantyType, boolean includeShifts) {
		WarrantyTypeDTO warrantyTypeDTO = new WarrantyTypeDTO();
		warrantyTypeDTO.setId(warrantyType.getId());
		warrantyTypeDTO.setName(warrantyType.getName());
		return warrantyTypeDTO;
	}


	public void deleteWarrantyType(Long id) {
		log.debug("Inside Delete");
		WarrantyType warrantyTypeUpdate = warrantyTypeRepository.findOne(id);
        warrantyTypeUpdate.setActive(WarrantyType.ACTIVE_NO);
		warrantyTypeRepository.save(warrantyTypeUpdate);
	}

	public List<WarrantyTypeDTO> findAll() {
		List<WarrantyType> entities = warrantyTypeRepository.findAll();
		return mapperUtil.toModelList(entities, WarrantyTypeDTO.class);
	}

	public WarrantyTypeDTO findOne(Long id) {
		WarrantyType entity = warrantyTypeRepository.findOne(id);
		return mapperUtil.toModel(entity, WarrantyTypeDTO.class);
	}

	public SearchResult<WarrantyTypeDTO> findBySearchCrieria(SearchCriteria searchCriteria) {

        //-------
		SearchResult<WarrantyTypeDTO> result = new SearchResult<WarrantyTypeDTO>();
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
            Page<WarrantyType> page = null;
			List<WarrantyTypeDTO> transactions = null;
			log.debug("WarrantyType name = "+ searchCriteria.getWarrantyTypeName() + " ,  warrantyType = "+ searchCriteria.getWarrantyTypeName());
			if(!searchCriteria.isFindAll()) {
				if(!StringUtils.isEmpty(searchCriteria.getWarrantyTypeName())) {
					page = warrantyTypeRepository.findAllByName(searchCriteria.getWarrantyTypeName(), pageRequest);
				}
			}else {
				page = warrantyTypeRepository.findAll(pageRequest);
			}
			if(page != null) {
				if(transactions == null) {
					transactions = new ArrayList<WarrantyTypeDTO>();
				}
				List<WarrantyType> warrantyTypeList =  page.getContent();
				if(CollectionUtils.isNotEmpty(warrantyTypeList)) {
					for(WarrantyType warrantyType : warrantyTypeList) {
						transactions.add(mapToModel(warrantyType, false));
					}
				}
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}

		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<WarrantyType> page, List<WarrantyTypeDTO> transactions, SearchResult<WarrantyTypeDTO> result) {
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
