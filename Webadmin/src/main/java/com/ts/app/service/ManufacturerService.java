package com.ts.app.service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Manufacturer;
import com.ts.app.repository.ManufacturerRepository;
import com.ts.app.repository.ManufacturerSpecification;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ManufacturerDTO;
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
 * Service class for managing Manufacturer information.
 */
@Service
@Transactional
public class ManufacturerService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(ManufacturerService.class);

	@Inject
	private ManufacturerRepository manufacturerRepository;

	@Inject
	private UserRepository userRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private ImportUtil importUtil;

	public ManufacturerDTO createManufacturerInformation(ManufacturerDTO manufacturerDto) {
		// log.info("The admin Flag value is " +adminFlag);
		Manufacturer manufacturer = mapperUtil.toEntity(manufacturerDto, Manufacturer.class);
        manufacturer.setActive(Manufacturer.ACTIVE_YES);
		manufacturer = manufacturerRepository.save(manufacturer);
		log.debug("Created Information for Manufacturer: {}", manufacturer);
		manufacturerDto = mapperUtil.toModel(manufacturer, ManufacturerDTO.class);
		return manufacturerDto;
	}

	public void updateManufacturer(ManufacturerDTO manufacturer) {
		log.debug("Inside Update");
		Manufacturer manufacturerUpdate = manufacturerRepository.findOne(manufacturer.getId());
		mapToEntity(manufacturer,manufacturerUpdate);
		manufacturerRepository.saveAndFlush(manufacturerUpdate);
	}

	private void mapToEntity(ManufacturerDTO manufacturerDTO, Manufacturer manufacturer) {
		manufacturer.setAssetType(manufacturerDTO.getAssetType());
		manufacturer.setName(manufacturerDTO.getName());
		manufacturer.setContactFirstName(manufacturerDTO.getContactFirstName());
		manufacturer.setContactLastName(manufacturerDTO.getContactLastName());
		manufacturer.setPhone(manufacturerDTO.getPhone());
		manufacturer.setEmail(manufacturerDTO.getEmail());
		manufacturer.setAddressLine1(manufacturerDTO.getAddressLine1());
		manufacturer.setAddressLine2(manufacturerDTO.getAddressLine2());
		manufacturer.setCountry(manufacturerDTO.getCountry());
		manufacturer.setState(manufacturerDTO.getState());
		manufacturer.setCity(manufacturerDTO.getCity());
		manufacturer.setPincode(manufacturerDTO.getPincode());
	}

	private ManufacturerDTO mapToModel(Manufacturer manufacturer, boolean includeShifts) {
		ManufacturerDTO manufacturerDTO = new ManufacturerDTO();
		manufacturerDTO.setId(manufacturer.getId());
		manufacturerDTO.setAssetType(manufacturer.getAssetType());
		manufacturerDTO.setName(manufacturer.getName());
		manufacturerDTO.setContactFirstName(manufacturer.getContactFirstName());
		manufacturerDTO.setContactLastName(manufacturer.getContactLastName());
		manufacturerDTO.setPhone(manufacturer.getPhone());
		manufacturerDTO.setEmail(manufacturer.getEmail());
		manufacturerDTO.setAddressLine1(manufacturer.getAddressLine1());
		manufacturerDTO.setAddressLine2(manufacturer.getAddressLine2());
		manufacturerDTO.setCountry(manufacturer.getCountry());
		manufacturerDTO.setState(manufacturer.getState());
		manufacturerDTO.setCity(manufacturer.getCity());
		manufacturerDTO.setPincode(manufacturer.getPincode());
		return manufacturerDTO;
	}


	public void deleteManufacturer(Long id) {
		log.debug("Inside Delete");
		Manufacturer manufacturerUpdate = manufacturerRepository.findOne(id);
        manufacturerUpdate.setActive(Manufacturer.ACTIVE_NO);
		manufacturerRepository.save(manufacturerUpdate);
	}

	public List<ManufacturerDTO> findAll() {
		List<Manufacturer> entities = manufacturerRepository.findAll();
		return mapperUtil.toModelList(entities, ManufacturerDTO.class);
	}

	public ManufacturerDTO findOne(Long id) {
		Manufacturer entity = manufacturerRepository.findOne(id);
		return mapperUtil.toModel(entity, ManufacturerDTO.class);
	}

	public SearchResult<ManufacturerDTO> findBySearchCrieria(SearchCriteria searchCriteria) {

        //-------
		SearchResult<ManufacturerDTO> result = new SearchResult<ManufacturerDTO>();
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
            Page<Manufacturer> page = null;
			List<Manufacturer> allManufacturerList = new ArrayList<Manufacturer>();
			List<ManufacturerDTO> transactions = null;
			log.debug("Manufacturer id = "+ searchCriteria.getManufacturerId() + ", name = "+ searchCriteria.getManufacturerName() + " ,  assetType = "+ searchCriteria.getAssetTypeName());
			/*if(!searchCriteria.isFindAll()) {
				if(!StringUtils.isEmpty(searchCriteria.getAssetTypeName()) && StringUtils.isEmpty(searchCriteria.getManufacturerName())) {
					page = manufacturerRepository.findAllByAssetType(searchCriteria.getAssetTypeName(), pageRequest);
				}else if(StringUtils.isEmpty(searchCriteria.getAssetTypeName()) && !StringUtils.isEmpty(searchCriteria.getManufacturerName())) {
					page = manufacturerRepository.findAllByName(searchCriteria.getManufacturerName(), pageRequest);
				}else if(!StringUtils.isEmpty(searchCriteria.getAssetTypeName()) && !StringUtils.isEmpty(searchCriteria.getManufacturerName())) {
					page = manufacturerRepository.findAll(searchCriteria.getAssetTypeName(), searchCriteria.getManufacturerName(), pageRequest);
				}
			}else {
				page = manufacturerRepository.findAll(pageRequest);
			}*/
			if(!searchCriteria.isConsolidated()) {
				log.debug(">>> inside search consolidate <<<");
    			page = manufacturerRepository.findAll(new ManufacturerSpecification(searchCriteria,true),pageRequest);
    			allManufacturerList.addAll(page.getContent());
    		}
			/*if(page != null) {
				if(transactions == null) {
					transactions = new ArrayList<ManufacturerDTO>();
				}
				List<Manufacturer> manufacturerList =  page.getContent();
				if(CollectionUtils.isNotEmpty(manufacturerList)) {
					for(Manufacturer manufacturer : manufacturerList) {
						transactions.add(mapToModel(manufacturer, false));
					}
				}
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}*/
			if(CollectionUtils.isNotEmpty(allManufacturerList)) {
				if(transactions == null) {
					transactions = new ArrayList<ManufacturerDTO>();
				}
	        		for(Manufacturer manufacturer : allManufacturerList) {
	        			transactions.add(mapperUtil.toModel(manufacturer, ManufacturerDTO.class));
	        		}
				buildSearchResult(searchCriteria, page, transactions,result);
			}
		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<Manufacturer> page, List<ManufacturerDTO> transactions, SearchResult<ManufacturerDTO> result) {
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
