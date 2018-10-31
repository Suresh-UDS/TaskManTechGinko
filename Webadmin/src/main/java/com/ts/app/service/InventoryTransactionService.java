package com.ts.app.service;

import java.util.ArrayList;
import java.util.Date;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.IndentStatus;
import com.ts.app.domain.Material;
import com.ts.app.domain.MaterialIndent;
import com.ts.app.domain.MaterialIndentItem;
import com.ts.app.domain.MaterialTransaction;
import com.ts.app.domain.MaterialTransactionType;
import com.ts.app.domain.MaterialUOMType;
import com.ts.app.domain.Project;
import com.ts.app.domain.PurchaseRequisition;
import com.ts.app.domain.PurchaseRequisitionItem;
import com.ts.app.domain.Setting;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import com.ts.app.domain.PurchaseRequestStatus;
import com.ts.app.repository.AssetRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.InventoryRepository;
import com.ts.app.repository.InventoryTransSpecification;
import com.ts.app.repository.InventoryTransactionRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.MaterialIndentRepository;
import com.ts.app.repository.MaterialItemGroupRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.PurchaseRequisitionRepository;
import com.ts.app.repository.SettingsRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.util.CommonUtil;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.PagingUtil;
import com.ts.app.service.util.ReportUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.MaterialDTO;
import com.ts.app.web.rest.dto.MaterialIndentItemDTO;
import com.ts.app.web.rest.dto.MaterialTransactionDTO;
import com.ts.app.web.rest.dto.PurchaseReqItemDTO;
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
	private MaterialItemGroupRepository materialItemGroupRepository;
	
	@Inject
	private MaterialIndentRepository materialIndentRepository;
	
	@Inject
	private SettingsRepository settingRepository;
	
	@Inject
	private MailService mailService;
	
	@Inject
	private PurchaseRequisitionRepository purchaseReqRepository;
	
	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;
	
	@Inject
	private ReportUtil reportUtil;
	
	@Inject
	private ExportUtil exportUtil;
	
	public static final String EMAIL_NOTIFICATION_PURCHASEREQ = "email.notification.purchasereq";

	public static final String EMAIL_NOTIFICATION_PURCHASEREQ_EMAILS = "email.notification.purchasereq.emails";
	
	public MaterialTransactionDTO createInventoryTransaction(MaterialTransactionDTO materialTransDTO) {
		 
		MaterialTransaction materialEntity = mapperUtil.toEntity(materialTransDTO, MaterialTransaction.class);
		materialEntity.setSite(siteRepository.findOne(materialTransDTO.getSiteId()));
		materialEntity.setProject(projectRepository.findOne(materialTransDTO.getProjectId()));
		MaterialIndent materialIndent = null;
		PurchaseRequisition purchaseRequesition = null;
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
		if(materialTransDTO.getPurchaseRequisitionId() > 0) {
			purchaseRequesition = purchaseReqRepository.findOne(materialTransDTO.getPurchaseRequisitionId());
			materialEntity.setPurchaseRequisition(purchaseRequesition);
		}else {
			materialEntity.setPurchaseRequisition(null);
		}
		
		if(materialTransDTO.getTransactionType().equals(MaterialTransactionType.ISSUED)) {
			List<MaterialIndentItemDTO> indentItemDTOs = materialTransDTO.getItems();
			Set<MaterialIndentItem> itemEntities = materialIndent.getItems();
			Iterator<MaterialIndentItem> itemsItr = itemEntities.iterator();
			
			while(itemsItr.hasNext()) {
				boolean itemFound = false;
				MaterialIndentItem itemEntity = itemsItr.next();
				for(MaterialIndentItemDTO itemDto : indentItemDTOs) {
					if(itemEntity.getId() == itemDto.getId()) {
						itemFound = true;
						long reducedQty = 0;
						long addedQty = 0;
						Material materialItm = inventoryRepository.findOne(itemDto.getMaterialId());
						if(itemEntity.getPendingQuantity() > 0) {
							if(materialItm.getStoreStock() > itemDto.getIssuedQuantity() && itemDto.getIssuedQuantity() > 0) {
								long consumptionStock = materialItm.getStoreStock() - itemDto.getIssuedQuantity();
								reducedQty = itemEntity.getPendingQuantity() - itemDto.getIssuedQuantity();   
								addedQty = itemEntity.getIssuedQuantity() + itemDto.getIssuedQuantity();
								itemEntity.setPendingQuantity(reducedQty); 
								itemEntity.setIssuedQuantity(addedQty);
								materialItm.setStoreStock(consumptionStock);
								inventoryRepository.save(materialItm);
								materialEntity.setMaterialGroup(materialItemGroupRepository.findOne(materialItm.getItemGroupId()));
								materialEntity.setMaterial(inventoryRepository.findOne(materialItm.getId()));
								materialEntity.setUom(materialItm.getUom());
								materialEntity.setStoreStock(consumptionStock);
								materialEntity.setQuantity(itemEntity.getQuantity());
								materialEntity.setIssuedQuantity(itemDto.getIssuedQuantity());
								materialEntity.setTransactionType(MaterialTransactionType.ISSUED);
								materialEntity.setActive(MaterialTransaction.ACTIVE_YES);
								materialEntity.setTransactionDate(DateUtil.convertToTimestamp(materialTransDTO.getTransactionDate()));
								materialEntity = inventTransactionRepository.save(materialEntity);
								log.debug("Save object of Inventory: {}" +materialEntity);
								if(materialIndent != null) { 
									materialIndent.setTransaction(materialEntity);
									materialIndent.setIssuedBy(employeeRepository.findOne(SecurityUtils.getCurrentUserId()));
									materialIndentRepository.save(materialIndent);
								}
							
							} else {
								itemDto.setErrorMessage("Issued quantity not availbale in store stock.");
								itemDto.setErrorStatus(true);
								itemDto.setStatus("400");
							}
							
							if(materialItm.getStoreStock() < materialItm.getMinimumStock()) {   // send purchase request when stock is minimum level
								PurchaseRequisition purchaseRequest = new PurchaseRequisition();
								User user = userRepository.findOne(materialTransDTO.getUserId());
								Employee employee = user.getEmployee();
								purchaseRequest.setRequestedBy(employeeRepository.findOne(employee.getId()));
								purchaseRequest.setRequestedDate(DateUtil.convertToTimestamp(new Date()));
								purchaseRequest.setRequestStatus(PurchaseRequestStatus.PENDING);
								purchaseRequest.setActive(PurchaseRequisition.ACTIVE_YES);
								
								List<PurchaseRequisitionItem> purchaseItem = new ArrayList<PurchaseRequisitionItem>();
								PurchaseRequisitionItem purchaseReqItemEntity = new PurchaseRequisitionItem();
								purchaseReqItemEntity.setActive(PurchaseRequisitionItem.ACTIVE_YES);
								purchaseReqItemEntity.setMaterial(materialItm);
								purchaseReqItemEntity.setPurchaseRequisition(purchaseRequest);
								purchaseReqItemEntity.setQuantity(materialItm.getMaximumStock());
								purchaseReqItemEntity.setUnitPrice(0);
								purchaseReqItemEntity.setApprovedQty(0);
								purchaseReqItemEntity.setPendingQty(materialItm.getMaximumStock());
								purchaseItem.add(purchaseReqItemEntity);
								
								Set<PurchaseRequisitionItem> materialItem = new HashSet<PurchaseRequisitionItem>();
								materialItem.addAll(purchaseItem);
								purchaseRequest.setItems(materialItem);
								purchaseReqRepository.save(purchaseRequest);
								
								Site site = siteRepository.findOne(materialTransDTO.getSiteId());
								String siteName = site.getName();
								
								Setting setting = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_PURCHASEREQ);
								
								log.debug("Setting Email list -" + setting);

								if(setting.getSettingValue().equalsIgnoreCase("true") ) {

									Setting settingEntity = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_PURCHASEREQ_EMAILS);

									if(settingEntity.getSettingValue().length() > 0) {

										List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(), ",");
										for(String email : emailLists) {
											mailService.sendPurchaseRequest(email, materialItm.getItemCode(), siteName, materialItm.getName());
										}

									} else {

										log.info("There is no email ids registered");
									}
								}
								
							} 
							
						}
						
						break;
					}
				}
				log.debug("itemFound - "+ itemFound);
				if(!itemFound){
					itemsItr.remove();
				}
				
			}
		
		}
		
		if(materialTransDTO.getTransactionType().equals(MaterialTransactionType.RECEIVED)) {
			List<PurchaseReqItemDTO> reqItemDTOs = materialTransDTO.getPrItems();
			Set<PurchaseRequisitionItem> itemEntities = purchaseRequesition.getItems();
			Iterator<PurchaseRequisitionItem> itemsItr = itemEntities.iterator();
			
			while(itemsItr.hasNext()) {
				boolean itemFound = false;
				PurchaseRequisitionItem itemEntity = itemsItr.next();
				for(PurchaseReqItemDTO itemDto : reqItemDTOs) {
					if(itemEntity.getId() == itemDto.getId()) {
						itemFound = true;
						long reducedQty = 0;
						Material materialItm = inventoryRepository.findOne(itemDto.getMaterialId());
						if(itemEntity.getPendingQty() > 0) {
							reducedQty = itemEntity.getPendingQty() - itemDto.getApprovedQty();
							itemEntity.setPendingQty(reducedQty);
							itemEntity.setApprovedQty(itemDto.getApprovedQty());
							materialEntity.setMaterialGroup(materialItemGroupRepository.findOne(materialItm.getItemGroupId()));
							long consumptionStock = materialItm.getStoreStock() + itemDto.getApprovedQty();
							materialItm.setStoreStock(consumptionStock);
							inventoryRepository.save(materialItm);
							materialEntity.setMaterial(materialItm);
							materialEntity.setUom(materialItm.getUom());
							materialEntity.setQuantity(itemEntity.getQuantity());
							materialEntity.setStoreStock(consumptionStock);
							materialEntity.setIssuedQuantity(itemDto.getApprovedQty());
							materialEntity.setTransactionType(MaterialTransactionType.RECEIVED);
							materialEntity.setActive(MaterialTransaction.ACTIVE_YES);
							materialEntity.setTransactionDate(DateUtil.convertToTimestamp(materialTransDTO.getTransactionDate()));
							materialEntity = inventTransactionRepository.save(materialEntity);
							log.debug("Save object of Inventory: {}" +materialEntity);
							
							if(purchaseRequesition != null) { 
								purchaseRequesition.setTransaction(materialEntity);
								purchaseReqRepository.save(purchaseRequesition);
							}
						}
						
						break;
					}
				}
				log.debug("itemFound - "+ itemFound);
				if(!itemFound){
					itemsItr.remove();
				}
			}

		}
		
		
		if(materialTransDTO.getTransactionType().equals(MaterialTransactionType.ISSUED)) {
			Set<MaterialIndentItem> materialItem = materialIndent.getItems();
			boolean isPending = checkIfNoItems(materialItem);
			if(isPending) { 
				materialIndent = materialIndentRepository.findOne(materialIndent.getId());
				materialIndent.setIndentStatus(IndentStatus.PENDING);
				materialIndentRepository.save(materialIndent);
			}else {
				materialIndent = materialIndentRepository.findOne(materialIndent.getId());
				materialIndent.setIndentStatus(IndentStatus.ISSUED);
				materialIndentRepository.save(materialIndent);
			}
		}
	
		materialTransDTO = mapperUtil.toModel(materialEntity, MaterialTransactionDTO.class);
		return materialTransDTO;
	
	}
	
	private boolean checkIfNoItems(Set<MaterialIndentItem> materialItem) {
		// TODO Auto-generated method stub
		for(MaterialIndentItem material : materialItem) { 
			if(material.getPendingQuantity() > 0) {
				return true;
			}
		}
		return false;
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
	
	public ExportResult generateReport(List<MaterialTransactionDTO> results, SearchCriteria searchCriteria) {
		return reportUtil.generateTransactionReports(results, null, null, searchCriteria);
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