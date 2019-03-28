package com.ts.app.service;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import com.ts.app.web.rest.errors.TimesheetException;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.AssetGroup;
import com.ts.app.domain.AssetParameterReading;
import com.ts.app.domain.AssetStatusHistoryDTO;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.Material;
import com.ts.app.domain.MaterialItemGroup;
import com.ts.app.domain.MaterialTransaction;
import com.ts.app.domain.MaterialUOMType;
import com.ts.app.domain.User;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.InventoryRepository;
import com.ts.app.repository.InventorySpecification;
import com.ts.app.repository.InventoryTransactionRepository;
import com.ts.app.repository.ManufacturerRepository;
import com.ts.app.repository.MaterialItemGroupRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.PagingUtil;
import com.ts.app.service.util.ReportUtil;
import com.ts.app.web.rest.dto.AssetParameterReadingDTO;
import com.ts.app.web.rest.dto.AssetgroupDTO;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.MaterialDTO;
import com.ts.app.web.rest.dto.MaterialItemGroupDTO;
import com.ts.app.web.rest.dto.MaterialTransactionDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;

@Service
@Transactional
public class InventoryManagementService extends AbstractService{

	private final Logger log = LoggerFactory.getLogger(InventoryManagementService.class);

	@Inject
	private SiteRepository siteRepository;

	@Inject
	private ProjectRepository projectRepository;

	@Inject
	private InventoryRepository inventRepository;

	@Inject
	private UserRepository userRepository;

	@Inject
	private EmployeeRepository employeeRepository;

	@Inject
	private ManufacturerRepository manufacturerRepository;

	@Inject
	private MaterialItemGroupRepository materialItemRepository;

	@Inject
	private InventoryTransactionRepository inventTransactionRepository;

	@Inject
	private ImportUtil importUtil;

	@Inject
	private ReportUtil reportUtil;

	@Inject
	private ExportUtil exportUtil;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	public MaterialDTO createInventory(MaterialDTO materialDTO) {
		Material materialEntity = mapperUtil.toEntity(materialDTO, Material.class);
		materialEntity.setSite(siteRepository.findOne(materialDTO.getSiteId()));
		materialEntity.setProject(projectRepository.findOne(materialDTO.getProjectId()));
		materialEntity.setManufacturer(manufacturerRepository.findOne(materialDTO.getManufacturerId()));

		//create material item group if does not exist
		if(!StringUtils.isEmpty(materialEntity.getItemGroup())) {
			MaterialItemGroup itemGroup = materialItemRepository.findByName(materialEntity.getItemGroup());
			if(itemGroup == null) {
				itemGroup = new MaterialItemGroup();
				itemGroup.setItemGroup(materialDTO.getItemGroup());
				itemGroup.setActive("Y");
				materialItemRepository.save(itemGroup);
			}
		}

		if(!StringUtils.isEmpty(materialDTO.getItemCode())) {
            List<Material> itemCodeExists = inventRepository.findByItemCode(materialDTO.getItemCode());
            if(CollectionUtils.isNotEmpty(itemCodeExists)) {
                materialDTO.setErrorMessage("Already same item code exists");
                materialDTO.setErrorStatus(true);
                materialDTO.setStatus("400");
            } else {
                materialEntity.setActive(Material.ACTIVE_YES);
                materialEntity.setUom(MaterialUOMType.valueOf(materialDTO.getUom()).getValue());
                materialEntity = inventRepository.save(materialEntity);
                log.debug("Save object of Inventory: {}" +materialEntity);
                materialDTO = mapperUtil.toModel(materialEntity, MaterialDTO.class);
            }
        }

        return materialDTO;
	}

	public MaterialDTO getMaterial(long id) {
		Material material = inventRepository.findOne(id);
		MaterialDTO materialDTO = mapperUtil.toModel(material, MaterialDTO.class);
		List<MaterialTransaction> transactions = inventTransactionRepository.findByMaterialId(id);
		List<MaterialTransactionDTO> transactionsDTO = mapperUtil.toModelList(transactions, MaterialTransactionDTO.class);
		materialDTO.setMaterialTransactions(transactionsDTO);
		return materialDTO;
	}

	public List<MaterialDTO> findAll() {
		List<Material> materials = inventRepository.findAll();
		List<MaterialDTO> materialList = mapperUtil.toModelList(materials, MaterialDTO.class);
		return materialList;
	}

	public MaterialDTO updateInventory(MaterialDTO materialDTO) {
		Material material = inventRepository.findOne(materialDTO.getId());
		mapToModel(material, materialDTO);
		inventRepository.saveAndFlush(material);
		return materialDTO;
	}

	private void mapToModel(Material material, MaterialDTO materialDTO) {
		material.setName(materialDTO.getName());
		material.setItemCode(materialDTO.getItemCode());
		if(materialDTO.getSiteId() > 0) {
			material.setSite(siteRepository.findOne(materialDTO.getSiteId()));
		}
		if(materialDTO.getProjectId() > 0) {
			material.setProject(projectRepository.findOne(materialDTO.getProjectId()));
		}
		if(materialDTO.getManufacturerId() > 0) {
			material.setManufacturer(manufacturerRepository.findOne(materialDTO.getManufacturerId()));
		}
		material.setItemGroup(materialDTO.getItemGroup());
		material.setMaximumStock(materialDTO.getMaximumStock());
		material.setMinimumStock(materialDTO.getMinimumStock());
		material.setStoreStock(materialDTO.getStoreStock());
		if(materialDTO.getUom() != null) {
			material.setUom(MaterialUOMType.valueOf(materialDTO.getUom()).getValue());
		}
	}

	public void deleteMaterial(long id) {
		Material material = inventRepository.findOne(id);
		material.setActive(Material.ACTIVE_NO);
		inventRepository.save(material);
	}

	public MaterialUOMType[] getAllMaterialUom() {
		MaterialUOMType[] uoms = MaterialUOMType.values();
		return uoms;
	}

	public MaterialItemGroupDTO createMaterialGroup(MaterialItemGroupDTO materialGroupDTO) {
		MaterialItemGroup materialItmGroup = mapperUtil.toEntity(materialGroupDTO, MaterialItemGroup.class);
		MaterialItemGroup existingGroup = materialItemRepository.findByName(materialItmGroup.getItemGroup());
		if(existingGroup == null) {
			materialItmGroup.setActive(MaterialItemGroup.ACTIVE_YES);
			materialItemRepository.save(materialItmGroup);
			materialGroupDTO = mapperUtil.toModel(materialItmGroup, MaterialItemGroupDTO.class);
			materialGroupDTO.setErrorStatus(false);
		}else {
			materialGroupDTO.setErrorMessage("Already material item group exists.");
			materialGroupDTO.setErrorStatus(true);
			materialGroupDTO.setStatus("400");
		}

		return materialGroupDTO;
	}

	public List<MaterialItemGroupDTO> findAllItemGroups() {
		List<MaterialItemGroup> materialItmList = materialItemRepository.findAll();
		List<MaterialItemGroupDTO> materialItmModel = mapperUtil.toModelList(materialItmList, MaterialItemGroupDTO.class);
		return materialItmModel;
	}

	public List<MaterialDTO> getMaterialGroup(long itemGroupId) {
		List<Material> materialList = inventRepository.findByMaterialGroupId(itemGroupId);
		List<MaterialDTO> materialModelList = mapperUtil.toModelList(materialList, MaterialDTO.class);
		return materialModelList;
	}

	public ImportResult importFile(MultipartFile file, long dateTime) throws Exception {
		return importUtil.importInventoryMaster(file, dateTime, false, false);
	}

	public ImportResult getImportStatus(String fileId) {
		ImportResult er = new ImportResult();
		// fileId += ".csv";
		if (!StringUtils.isEmpty(fileId)) {
			String status = importUtil.getImportStatus(fileId);
			er.setFile(fileId);
			er.setStatus(status);
		}
		return er;
	}

	public SearchResult<MaterialDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		SearchResult<MaterialDTO> result = new SearchResult<MaterialDTO>();
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
			Page<Material> page = null;
			List<Material> allMaterialsList = new ArrayList<Material>();
			List<MaterialDTO> transactions = null;

            log.debug("InventorySpecification toPredicate - searchCriteria get consolidated status -"+ searchCriteria.isConsolidated());

			if(!searchCriteria.isConsolidated()) {
				log.debug(">>> inside search consolidate <<<");
    			page = inventRepository.findAll(new InventorySpecification(searchCriteria,true),pageRequest);
//    			page = inventRepository.findAll(new InventorySpecification(searchCriteria,true),pageRequest);

    			allMaterialsList.addAll(page.getContent());
    		}

			if(CollectionUtils.isNotEmpty(allMaterialsList)) {
				if(transactions == null) {
					transactions = new ArrayList<MaterialDTO>();
				}
	        		for(Material material : allMaterialsList) {
	        			transactions.add(mapperUtil.toModel(material, MaterialDTO.class));
	        		}
				buildSearchResult(searchCriteria, page, transactions,result);
			}
		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<Material> page, List<MaterialDTO> transactions, SearchResult<MaterialDTO> result) {
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

	public SearchResult<MaterialTransactionDTO> viewMaterialTransactions(SearchCriteria searchCriteria) {
		SearchResult<MaterialTransactionDTO> result = new SearchResult<MaterialTransactionDTO>();

		Pageable pageRequest = null;
		if(searchCriteria != null) {
			if (!StringUtils.isEmpty(searchCriteria.getColumnName())) {
				Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
				log.debug("Sorting object" + sort);
				pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);
				if (searchCriteria.isReport()) {
					pageRequest = createPageSort(searchCriteria.getCurrPage(), Integer.MAX_VALUE, sort);
				} else {
					pageRequest = createPageSort(searchCriteria.getCurrPage(), PagingUtil.PAGE_SIZE, sort);
				}
			} else {
				if (searchCriteria.isList()) {
					pageRequest = createPageRequest(searchCriteria.getCurrPage(), true);
				} else {
					pageRequest = createPageRequest(searchCriteria.getCurrPage());
				}
			}

			Page<MaterialTransaction> page = null;
			List<MaterialTransaction> allTransactionsList = new ArrayList<MaterialTransaction>();
			List<MaterialTransactionDTO> transactions = null;

			if(searchCriteria.getTransactionFromDate() != null && searchCriteria.getTransactionToDate() != null) {
				page = inventTransactionRepository.findByTransactionDate(DateUtil.convertToTimestamp(searchCriteria.getTransactionFromDate()), DateUtil.convertToTimestamp(searchCriteria.getTransactionToDate()), pageRequest);
			}else {
				page = inventTransactionRepository.findByMaterialTransaction(searchCriteria.getMaterialId(), pageRequest);
			}

			allTransactionsList.addAll(page.getContent());

			if(CollectionUtils.isNotEmpty(allTransactionsList)) {
				if(transactions == null) {
					transactions = new ArrayList<MaterialTransactionDTO>();
				}
	        		for(MaterialTransaction materialTrans : allTransactionsList) {
	        			transactions.add(mapperUtil.toModel(materialTrans, MaterialTransactionDTO.class));
	        		}
				buildSearchResultTransax(searchCriteria, page, transactions,result);
			}
		}

		return result;
	}

	private void buildSearchResultTransax(SearchCriteria searchCriteria, Page<MaterialTransaction> page,
		List<MaterialTransactionDTO> transactions, SearchResult<MaterialTransactionDTO> result) {
	// TODO Auto-generated method stub
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

	public ExportResult generateReport(List<MaterialDTO> results, SearchCriteria searchCriteria) {
		return reportUtil.generateInventoryReports(results, null, null, searchCriteria);
	}

	public byte[] getExportFile(String fileName) {
		// return exportUtil.readExportFile(fileName);
		return exportUtil.readJobExportFile(fileName);
	}

	public ExportResult getExportStatus(String fileId) {
		ExportResult er = new ExportResult();

		fileId += ".xlsx";
		// log.debug("FILE ID INSIDE OF getExportStatus CALL ***********"+fileId);

		if (!StringUtils.isEmpty(fileId)) {
			String status = exportUtil.getExportStatus(fileId);
			er.setFile(fileId);
			er.setStatus(status);
		}
		return er;
	}


    public void deleteTransaction(long id) {
        MaterialTransaction materialTrsn = inventTransactionRepository.findOne(id);
        materialTrsn.setActive(MaterialTransaction.ACTIVE_NO);
        inventTransactionRepository.save(materialTrsn);
    }
}
