package com.ts.app.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

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
import com.ts.app.domain.MaterialIndentItem;
import com.ts.app.domain.MaterialTransaction;
import com.ts.app.domain.User;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.InventoryRepository;
import com.ts.app.repository.InventoryTransactionRepository;
import com.ts.app.repository.MaterialIndentRepository;
import com.ts.app.repository.MaterialIndentSpecification;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.MaterialIndentDTO;
import com.ts.app.web.rest.dto.MaterialIndentItemDTO;
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
	private InventoryRepository inventoryRepository;
	
	@Inject
	private InventoryTransactionRepository inventTransactionRepository;
	
	@Inject
	private EmployeeRepository employeeRepository;
	
	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;
	
	public MaterialIndentDTO createIndent(MaterialIndentDTO materialIndentDTO) { 
		MaterialIndent indentEntity = mapperUtil.toEntity(materialIndentDTO, MaterialIndent.class);
		indentEntity.setRequestedDate(DateUtil.convertToTimestamp(materialIndentDTO.getRequestedDate()));
		indentEntity.setSite(siteRepository.findOne(materialIndentDTO.getSiteId()));
		indentEntity.setProject(projectRepository.findOne(materialIndentDTO.getProjectId()));
		indentEntity.setRequestedBy(employeeRepository.findOne(materialIndentDTO.getRequestedById()));
		indentEntity.setIssuedBy(employeeRepository.findOne(materialIndentDTO.getIssuedById()));
		indentEntity.setActive(MaterialIndent.ACTIVE_YES);
		List<MaterialIndentItemDTO> indentItems = materialIndentDTO.getItems();
		List<MaterialIndentItem> indentItemEntity = new ArrayList<MaterialIndentItem>();
		for(MaterialIndentItemDTO indentItm : indentItems) { 
			MaterialIndentItem materialIndentItm = mapperUtil.toEntity(indentItm, MaterialIndentItem.class);
			materialIndentItm.setMaterialIndent(indentEntity);
			materialIndentItm.setMaterial(inventoryRepository.findOne(indentItm.getMaterialId()));
			indentItemEntity.add(materialIndentItm);
		}
		MaterialTransaction materialTranc = null;
		Set<MaterialIndentItem> materialIndentItem = new HashSet<MaterialIndentItem>();
		materialIndentItem.addAll(indentItemEntity);
		indentEntity.setItems(materialIndentItem);
		if(materialIndentDTO.getTransactionId() > 0) {
			materialTranc = inventTransactionRepository.findOne(materialIndentDTO.getTransactionId());
			indentEntity.setTransaction(materialTranc);
		}else {
			indentEntity.setTransaction(null);
		}
		indentEntity = materialIndentRepository.save(indentEntity);
		log.debug("Save object of Inventory: {}" + indentEntity);
		if (materialTranc != null) {
			materialTranc.setMaterialIndent(indentEntity);;
			inventTransactionRepository.save(materialTranc);
		}
		materialIndentDTO = mapperUtil.toModel(indentEntity, MaterialIndentDTO.class);
		return materialIndentDTO;
	}

	public MaterialIndentDTO getMaterial(long id) {
		MaterialIndent materialIndent = materialIndentRepository.findOne(id);
		return mapperUtil.toModel(materialIndent, MaterialIndentDTO.class);
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
		if(materialindentDTO.getProjectId() > 0) { 
			material.setProject(projectRepository.findOne(materialindentDTO.getProjectId()));
		}
		if(materialindentDTO.getRequestedById() > 0) { 
			material.setRequestedBy(employeeRepository.findOne(materialindentDTO.getRequestedById()));
		}
		if(materialindentDTO.getIssuedById() > 0) {
			material.setIssuedBy(employeeRepository.findOne(materialindentDTO.getIssuedById()));
		}
		
		List<MaterialIndentItemDTO> indentItemDTOs = materialindentDTO.getItems();
		List<MaterialIndentItem> indentItemEntity = new ArrayList<MaterialIndentItem>();
		Iterator<MaterialIndentItem> itemsItr = indentItemEntity.iterator();
		while(itemsItr.hasNext()) {
			boolean itemFound = false;
			MaterialIndentItem itemEntity = itemsItr.next();
			for(MaterialIndentItemDTO itemDto : indentItemDTOs) {
				if(itemEntity.getId() == itemDto.getId()) {
					itemFound = true;
					break;
				}
			}
			log.debug("itemFound - "+ itemFound);
			if(!itemFound){
				itemsItr.remove();
			}
		}
		for(MaterialIndentItemDTO itemDto : indentItemDTOs) {
			if(itemDto.getId() == 0) {
				MaterialIndentItem newItem = mapperUtil.toEntity(itemDto, MaterialIndentItem.class);
				newItem.setMaterialIndent(material);
				material.getItems().add(newItem);
			}
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

	public List<MaterialIndentDTO> getMaterialBySite(MaterialIndentDTO indentDTO) {
		List<MaterialIndent> materialIndentList = materialIndentRepository.findIndentBySites(indentDTO.getProjectId(), indentDTO.getSiteId());
		List<MaterialIndentDTO> materialIndentModel = mapperUtil.toModelList(materialIndentList, MaterialIndentDTO.class);
		return materialIndentModel;
	}

	
	
	
	
	
	
	

}