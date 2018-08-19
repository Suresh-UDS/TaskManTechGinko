package com.ts.app.service;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.Material;
import com.ts.app.domain.MaterialIndent;
import com.ts.app.domain.MaterialItemGroup;
import com.ts.app.domain.MaterialTransaction;
import com.ts.app.domain.MaterialUOMType;
import com.ts.app.domain.User;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.InventoryRepository;
import com.ts.app.repository.InventorySpecification;
import com.ts.app.repository.InventoryTransactionRepository;
import com.ts.app.repository.ManufacturerRepository;
import com.ts.app.repository.MaterialIndentRepository;
import com.ts.app.repository.MaterialIndentSpecification;
import com.ts.app.repository.MaterialItemGroupRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.MaterialDTO;
import com.ts.app.web.rest.dto.MaterialIndentDTO;
import com.ts.app.web.rest.dto.MaterialItemGroupDTO;
import com.ts.app.web.rest.dto.MaterialTransactionDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;

@Service
public class MaterialIndentService extends AbstractService {


	private final Logger log = LoggerFactory.getLogger(MaterialIndentService.class);
	
	@Inject
	private SiteRepository siteRepository;
	
	@Inject
	private ProjectRepository projectRepository;
	
	@Inject
	private MaterialIndentRepository materialIndentRepository;
	
	@Inject
	private UserRepository userRepository;
	
	@Inject
	private MaterialItemGroupRepository materialItemRepository;
	
	@Inject
	private InventoryTransactionRepository inventTransactionRepository;
	
	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;
	
	public MaterialIndentDTO createIndent(MaterialIndentDTO materialIndentDTO) { 
		MaterialIndent indentEntity = mapperUtil.toEntity(materialIndentDTO, MaterialIndent.class);
		indentEntity.setSite(siteRepository.findOne(materialIndentDTO.getSiteId()));
		indentEntity.setActive(MaterialIndent.ACTIVE_YES);
		indentEntity = materialIndentRepository.save(indentEntity);
		log.debug("Save object of Inventory: {}" + indentEntity);
		materialIndentDTO = mapperUtil.toModel(indentEntity, MaterialIndentDTO.class);
		return materialIndentDTO;
	}

	public MaterialIndentDTO getMaterial(long id) {
		MaterialIndent materialIndent = materialIndentRepository.findOne(id);
		MaterialIndentDTO materialIndentDTO = mapperUtil.toModel(materialIndent, MaterialIndentDTO.class);
		return materialIndentDTO;
	}

	public List<MaterialIndentDTO> findAll() {
		List<MaterialIndent> indents = materialIndentRepository.findAll();
		List<MaterialIndentDTO> indentList = mapperUtil.toModelList(indents, MaterialIndentDTO.class);
		return indentList;
	}

	public void updateMaterialIndents(MaterialIndentDTO materialIndentDTO) {
		MaterialIndent materialIndent = materialIndentRepository.findOne(materialIndentDTO.getId());
		mapToModel(materialIndent, materialIndentDTO);
		materialIndentRepository.saveAndFlush(materialIndent);		
	}

	private void mapToModel(MaterialIndent material, MaterialIndentDTO materialindentDTO) {
		if(materialindentDTO.getSiteId() > 0) { 
			material.setSite(siteRepository.findOne(materialindentDTO.getSiteId()));
		}
	}

	public void deleteMaterialIndent(long id) {
		MaterialIndent materialIndent = materialIndentRepository.findOne(id);
		materialIndent.setActive(Material.ACTIVE_NO);
		materialIndentRepository.save(materialIndent);
	}

	public SearchResult<MaterialIndentDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		SearchResult<MaterialIndentDTO> result = new SearchResult<MaterialIndentDTO>();
		User user = userRepository.findOne(searchCriteria.getUserId());
		log.debug(">>> user <<<"+ user.getFirstName() +" and "+user.getId());
		Employee employee = user.getEmployee();
		log.debug(">>> user <<<"+ employee.getFullName() +" and "+ employee.getId());
		List<EmployeeProjectSite> sites = employee.getProjectSites();

		if (searchCriteria != null) {

			List<Long> siteIds = new ArrayList<Long>();
			if(employee != null && !user.isAdmin()) {
				for (EmployeeProjectSite site : sites) {
					siteIds.add(site.getSite().getId());
					searchCriteria.setSiteIds(siteIds);
				}
			}else if(user.isAdmin()){
				searchCriteria.setAdmin(true);
			}

			Pageable pageRequest = null;
			if (!StringUtils.isEmpty(searchCriteria.getColumnName())) {
				Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
				log.debug("Sorting object" + sort);
				pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);
			} else {
				if (searchCriteria.isList()) {
					pageRequest = createPageRequest(searchCriteria.getCurrPage(), true);
				} else {
					pageRequest = createPageRequest(searchCriteria.getCurrPage());
				}
			}
			Page<MaterialIndent> page = null;
			List<MaterialIndent> allIndentsList = new ArrayList<MaterialIndent>();
			List<MaterialIndentDTO> transactions = null;

            log.debug("MaterialIndentSpecification toPredicate - searchCriteria get consolidated status -"+ searchCriteria.isConsolidated());

			if(!searchCriteria.isConsolidated()) {
				log.debug(">>> inside search consolidate <<<");
    			page = materialIndentRepository.findAll(new MaterialIndentSpecification(searchCriteria,true),pageRequest);
    			allIndentsList.addAll(page.getContent());
    		}

			if(CollectionUtils.isNotEmpty(allIndentsList)) {
				if(transactions == null) {
					transactions = new ArrayList<MaterialIndentDTO>();
				}
	        		for(MaterialIndent material : allIndentsList) {
	        			transactions.add(mapperUtil.toModel(material, MaterialIndentDTO.class));
	        		}
				buildSearchResult(searchCriteria, page, transactions,result);
			}
		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<MaterialIndent> page, List<MaterialIndentDTO> transactions, SearchResult<MaterialIndentDTO> result) {
		if (page != null) {
			result.setTotalPages(page.getTotalPages());
		}
		result.setCurrPage(page.getNumber() + 1);
		result.setTotalCount(page.getTotalElements());
		result.setStartInd((result.getCurrPage() - 1) * 10 + 1);
		result.setEndInd((result.getTotalCount() > 10 ? (result.getCurrPage()) * 10 : result.getTotalCount()));

		result.setTransactions(transactions);
		return;
	}

	
	
	
	
	
	
	

}
