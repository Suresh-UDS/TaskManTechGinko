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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.Material;
import com.ts.app.domain.MaterialIndent;
import com.ts.app.domain.MaterialTransaction;
import com.ts.app.domain.MaterialTransactionType;
import com.ts.app.domain.MaterialUOMType;
import com.ts.app.domain.User;
import com.ts.app.repository.AssetRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.InventoryRepository;
import com.ts.app.repository.InventoryTransSpecification;
import com.ts.app.repository.InventoryTransactionRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.MaterialIndentRepository;
import com.ts.app.repository.MaterialItemGroupRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.MaterialTransactionDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;

@Service
@Transactional
public class InventoryTransactionService extends AbstractService{

	private final Logger log = LoggerFactory.getLogger(InventoryTransactionService.class);
	
	@Inject
	private SiteRepository siteRepository;
	
	@Inject
	private ProjectRepository projectRepository;
	
	@Inject
	private InventoryTransactionRepository inventTransactionRepository;
	
	@Inject
	private UserRepository userRepository;
	
	@Inject
	private EmployeeRepository employeeRepository;
	
	@Inject
	private JobRepository jobRepository;
	
	@Inject
	private AssetRepository assetRepository;
	
	@Inject
	private InventoryRepository inventoryRepository;
	
	@Inject
	private MaterialItemGroupRepository materialItemRepository;
	
	@Inject
	private MaterialIndentRepository materialIndentRepository;
	
	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;
	
	public MaterialTransactionDTO createInventoryTransaction(MaterialTransactionDTO materialTransDTO) { 
		MaterialTransaction materialEntity = mapperUtil.toEntity(materialTransDTO, MaterialTransaction.class);
		materialEntity.setSite(siteRepository.findOne(materialTransDTO.getSiteId()));
		materialEntity.setProject(projectRepository.findOne(materialTransDTO.getProjectId()));
		materialEntity.setMaterial(inventoryRepository.findOne(materialTransDTO.getMaterialId()));
		materialEntity.setMaterialGroup(materialItemRepository.findOne(materialTransDTO.getMaterialGroupId()));
		MaterialIndent materialIndent = null;
		if(materialTransDTO.getJobId() > 0) {
			materialEntity.setJob(jobRepository.findOne(materialTransDTO.getJobId()));
		}else {
			materialEntity.setJob(null);
		}
		if(materialTransDTO.getAssetId() > 0) {
			materialEntity.setAsset(assetRepository.findOne(materialTransDTO.getAssetId()));
		}else {
			materialEntity.setAsset(null);
		}
		if(materialTransDTO.getMaterialIndentId() > 0) {
			materialIndent = materialIndentRepository.findOne(materialTransDTO.getMaterialIndentId());
			materialEntity.setMaterialIndent(materialIndent);
		}else {
			materialEntity.setMaterialIndent(null);
		}
		
		/** Create material if does not exists */
		if(!StringUtils.isEmpty(materialTransDTO.getMaterialName())) {
			Material material = inventoryRepository.findByMaterialName(materialTransDTO.getMaterialName());
			if(material == null) { 
				Material materialDomain = new Material();
				materialDomain.setItemGroup(materialTransDTO.getMaterialGroupItemGroup());
				materialDomain.setItemGroupId(materialTransDTO.getMaterialGroupId());
				materialDomain.setName(materialTransDTO.getMaterialName());
				materialDomain.setProject(projectRepository.findOne(materialTransDTO.getProjectId()));
				materialDomain.setSite(siteRepository.findOne(materialTransDTO.getSiteId()));
				materialDomain.setActive(Material.ACTIVE_YES);
				inventoryRepository.save(materialDomain);
			}
		}
		
		if(materialTransDTO.getTransactionType().equals(MaterialTransactionType.ISSUED)) {
			Material material = inventoryRepository.findOne(materialTransDTO.getMaterialId());
			long prevStoreStock = material.getStoreStock();
			if(prevStoreStock == material.getMinimumStock()) {              // send purchase request when stock is minimum level
				
			} else {
				if(prevStoreStock > materialTransDTO.getQuantity()) { 
					long currentStock = prevStoreStock - materialTransDTO.getQuantity();
					materialEntity.setStoreStock(currentStock);
					material.setStoreStock(currentStock);
					inventoryRepository.save(material);
				}
			}
			
		}
		
		if(materialTransDTO.getTransactionType().equals(MaterialTransactionType.RECEIVED)) {
			Material material = inventoryRepository.findOne(materialTransDTO.getMaterialId());
			long prevStoreStock = material.getStoreStock();
			if(prevStoreStock < material.getMaximumStock()) {
				
			}else {
				long currentStock = prevStoreStock + materialTransDTO.getQuantity();
				materialEntity.setStoreStock(currentStock);
				material.setStoreStock(currentStock);
				inventoryRepository.save(material);
			}
		}
		
		materialEntity.setActive(MaterialTransaction.ACTIVE_YES);
		materialEntity.setTransactionDate(DateUtil.convertToTimestamp(materialTransDTO.getTransactionDate()));
		materialEntity.setUom(MaterialUOMType.valueOf(materialTransDTO.getUom().toUpperCase()).getValue());
		materialEntity = inventTransactionRepository.save(materialEntity);
		log.debug("Save object of Inventory: {}" +materialEntity);
		if(materialIndent != null) { 
			materialIndent.setTransaction(materialEntity);
			materialIndentRepository.save(materialIndent);
		}
		materialTransDTO = mapperUtil.toModel(materialEntity, MaterialTransactionDTO.class);
		return materialTransDTO;
	}

	public MaterialTransactionDTO getMaterialTransaction(long id) {
		MaterialTransaction materialTrans = inventTransactionRepository.findOne(id);
		MaterialTransactionDTO materialTransDTO = mapperUtil.toModel(materialTrans, MaterialTransactionDTO.class);
		return materialTransDTO;
	}

	public List<MaterialTransactionDTO> findAll() {
		List<MaterialTransaction> materialTrans = inventTransactionRepository.findAll();
		List<MaterialTransactionDTO> materialTransList = mapperUtil.toModelList(materialTrans, MaterialTransactionDTO.class);
		return materialTransList;
	}

	public void updateMaterialTransaction(MaterialTransactionDTO materialTransDTO) {
		MaterialTransaction materialTrans = inventTransactionRepository.findOne(materialTransDTO.getId());
		mapToModel(materialTrans, materialTransDTO);
		inventTransactionRepository.save(materialTrans);	
	}

	private void mapToModel(MaterialTransaction materialTrans, MaterialTransactionDTO materialTransDTO) {
		// TODO Auto-generated method stub
	
	}

	public void deleteMaterialTrans(long id) {
		MaterialTransaction materialTrans = inventTransactionRepository.findOne(id);
		materialTrans.setActive(MaterialTransaction.ACTIVE_NO);
		inventTransactionRepository.save(materialTrans);
	}

	public MaterialTransactionType[] getTransactionType() { 
		MaterialTransactionType[] materialTransType = MaterialTransactionType.values();
		return materialTransType;
	}
	
	public SearchResult<MaterialTransactionDTO> findBySearchCriteria(SearchCriteria searchCriteria) {
		SearchResult<MaterialTransactionDTO> result = new SearchResult<MaterialTransactionDTO>();
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
			Page<MaterialTransaction> page = null;
			List<MaterialTransaction> allMaterialsTrans = new ArrayList<MaterialTransaction>();
			List<MaterialTransactionDTO> transactions = null;

            log.debug("Specification toPredicate - searchCriteria get consolidated status -"+ searchCriteria.isConsolidated());

			if(!searchCriteria.isConsolidated()) {
				log.debug(">>> inside search consolidate <<<");
    			page = inventTransactionRepository.findAll(new InventoryTransSpecification(searchCriteria,true),pageRequest);
    			allMaterialsTrans.addAll(page.getContent());
    		}

			if(CollectionUtils.isNotEmpty(allMaterialsTrans)) {
				if(transactions == null) {
					transactions = new ArrayList<MaterialTransactionDTO>();
				}
	        		for(MaterialTransaction materialTrans : allMaterialsTrans) {
	        			transactions.add(mapperUtil.toModel(materialTrans, MaterialTransactionDTO.class));
	        		}
				buildSearchResult(searchCriteria, page, transactions,result);
			}
		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<MaterialTransaction> page, List<MaterialTransactionDTO> transactions, SearchResult<MaterialTransactionDTO> result) {
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