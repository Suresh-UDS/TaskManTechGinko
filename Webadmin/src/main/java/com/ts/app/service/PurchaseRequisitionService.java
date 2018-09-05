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
import org.springframework.util.StringUtils;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.Material;
import com.ts.app.domain.MaterialIndent;
import com.ts.app.domain.MaterialIndentItem;
import com.ts.app.domain.MaterialTransaction;
import com.ts.app.domain.MaterialTransactionType;
import com.ts.app.domain.PurchaseRequisition;
import com.ts.app.domain.PurchaseRequisitionItem;
import com.ts.app.domain.Setting;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.InventoryRepository;
import com.ts.app.repository.InventoryTransactionRepository;
import com.ts.app.repository.MaterialIndentItemRepository;
import com.ts.app.repository.MaterialIndentRepository;
import com.ts.app.repository.MaterialIndentSpecification;
import com.ts.app.repository.MaterialItemGroupRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.PurchaseRequestSpecification;
import com.ts.app.repository.PurchaseRequisitionRepository;
import com.ts.app.repository.SettingsRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.CommonUtil;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.MaterialIndentDTO;
import com.ts.app.web.rest.dto.MaterialIndentItemDTO;
import com.ts.app.web.rest.dto.PurchaseReqDTO;
import com.ts.app.web.rest.dto.PurchaseReqItemDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;

@Service
public class PurchaseRequisitionService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(PurchaseRequisitionService.class);
	
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
	private PurchaseRequisitionRepository purchaseReqRepository;
	
	@Inject
	private MaterialItemGroupRepository materialItemGroupRepository;
	
	@Inject
	private SettingsRepository settingRepository;
	
	@Inject
	private MailService mailService;
	
	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;
	
	public static final String EMAIL_NOTIFICATION_PURCHASEREQ = "email.notification.purchasereq";

	public static final String EMAIL_NOTIFICATION_PURCHASEREQ_EMAILS = "email.notification.purchasereq.emails";
	
	public PurchaseReqDTO createPurchaseRequest(PurchaseReqDTO purchaseReqDTO) { 
		PurchaseRequisition purchaseEntity = mapperUtil.toEntity(purchaseReqDTO, PurchaseRequisition.class);
		purchaseEntity.setRequestedDate(DateUtil.convertToTimestamp(purchaseReqDTO.getRequestedDate()));
		purchaseEntity.setSite(siteRepository.findOne(purchaseReqDTO.getSiteId()));
		purchaseEntity.setProject(projectRepository.findOne(purchaseReqDTO.getProjectId()));
		purchaseEntity.setRequestedBy(employeeRepository.findOne(purchaseReqDTO.getRequestedById()));
		purchaseEntity.setApprovedBy(employeeRepository.findOne(purchaseReqDTO.getApprovedById()));
		purchaseEntity.setActive(MaterialIndent.ACTIVE_YES);
		List<PurchaseReqItemDTO> purchaseItems = purchaseReqDTO.getItems();
		List<PurchaseRequisitionItem> purchaseItemEntity = new ArrayList<PurchaseRequisitionItem>();
		for(PurchaseReqItemDTO purchaseItm : purchaseItems) { 
			PurchaseRequisitionItem purchaseIndentItm = mapperUtil.toEntity(purchaseItm, PurchaseRequisitionItem.class);
			purchaseIndentItm.setPurchaseRequisition(purchaseEntity);
			purchaseIndentItm.setActive(PurchaseRequisitionItem.ACTIVE_YES);
			purchaseIndentItm.setMaterial(inventoryRepository.findOne(purchaseItm.getMaterialId()));
			purchaseItemEntity.add(purchaseIndentItm);
		}
		Set<PurchaseRequisitionItem> purchaseReqItem = new HashSet<PurchaseRequisitionItem>();
		purchaseReqItem.addAll(purchaseItemEntity);
		purchaseEntity.setItems(purchaseReqItem);
	
		purchaseEntity = purchaseReqRepository.save(purchaseEntity);
		log.debug("Save object of Inventory: {}" + purchaseEntity);

		purchaseReqDTO = mapperUtil.toModel(purchaseEntity, PurchaseReqDTO.class);
		return purchaseReqDTO;
	}

	public PurchaseReqDTO getPurchaseReq(long id) {
		PurchaseRequisition purchaseReq = purchaseReqRepository.findOne(id);
		return mapperUtil.toModel(purchaseReq, PurchaseReqDTO.class);
	}

	public List<PurchaseReqDTO> findAll() {
		List<PurchaseRequisition> purchases = purchaseReqRepository.findAll();
		List<PurchaseReqDTO> purchaseList = mapperUtil.toModelList(purchases, PurchaseReqDTO.class);
		return purchaseList;
	}

	public void updatePurchaseRequest(PurchaseReqDTO purchaseReqDTO) {
		PurchaseRequisition purchaseRequest = purchaseReqRepository.findOne(purchaseReqDTO.getId());
		mapToModel(purchaseRequest, purchaseReqDTO);
		purchaseReqRepository.saveAndFlush(purchaseRequest);		
	}

	private void mapToModel(PurchaseRequisition purchaseRequest, PurchaseReqDTO purchaseReqDTO) {
		if(purchaseReqDTO.getSiteId() > 0) { 
			purchaseRequest.setSite(siteRepository.findOne(purchaseReqDTO.getSiteId()));
		}
		if(purchaseReqDTO.getProjectId() > 0) { 
			purchaseRequest.setProject(projectRepository.findOne(purchaseReqDTO.getProjectId()));
		}
		if(purchaseReqDTO.getRequestedById() > 0) { 
			purchaseRequest.setRequestedBy(employeeRepository.findOne(purchaseReqDTO.getRequestedById()));
		}
		if(purchaseReqDTO.getApprovedById() > 0) {
			purchaseRequest.setApprovedBy(employeeRepository.findOne(purchaseReqDTO.getApprovedById()));
		}
		
		List<PurchaseReqItemDTO> purchaseItemDTOs = purchaseReqDTO.getItems();
		Set<PurchaseRequisitionItem> itemEntities = purchaseRequest.getItems();
		Iterator<PurchaseRequisitionItem> itemsItr = itemEntities.iterator();
		while(itemsItr.hasNext()) {
			boolean itemFound = false;
			PurchaseRequisitionItem itemEntity = itemsItr.next();
			for(PurchaseReqItemDTO itemDto : purchaseItemDTOs) {
				if(itemEntity.getId() == itemDto.getId()) {
					itemFound = true;
					itemEntity.setQuantity(itemDto.getQuantity());
					break;
				}
			}
			log.debug("itemFound - "+ itemFound);
			if(!itemFound){
				itemsItr.remove();
			}
		}
		for(PurchaseReqItemDTO itemDto : purchaseItemDTOs) {
			if(itemDto.getId() == 0) {
				PurchaseRequisitionItem newItem = mapperUtil.toEntity(itemDto, PurchaseRequisitionItem.class);
				newItem.setPurchaseRequisition(purchaseRequest);
				purchaseRequest.getItems().add(newItem);
			}
		}	
	}

	public void deletePurchaseReq(long id) {
		PurchaseRequisition purchaseReq = purchaseReqRepository.findOne(id);
		purchaseReq.setActive(Material.ACTIVE_NO);
		purchaseReqRepository.save(purchaseReq);
	}

	public SearchResult<PurchaseReqDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		SearchResult<PurchaseReqDTO> result = new SearchResult<PurchaseReqDTO>();
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
			Page<PurchaseRequisition> page = null;
			List<PurchaseRequisition> allReqsList = new ArrayList<PurchaseRequisition>();
			List<PurchaseReqDTO> transactions = null;

            log.debug("Purchase Request Specification toPredicate - searchCriteria get consolidated status -"+ searchCriteria.isConsolidated());

			if(!searchCriteria.isConsolidated()) {
				log.debug(">>> inside search consolidate <<<");
    			page = purchaseReqRepository.findAll(new PurchaseRequestSpecification(searchCriteria,true),pageRequest);
    			allReqsList.addAll(page.getContent());
    		}

			if(CollectionUtils.isNotEmpty(allReqsList)) {
				if(transactions == null) {
					transactions = new ArrayList<PurchaseReqDTO>();
				}
	        		for(PurchaseRequisition request : allReqsList) {
	        			transactions.add(mapperUtil.toModel(request, PurchaseReqDTO.class));
	        		}
				buildSearchResult(searchCriteria, page, transactions,result);
			}
		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<PurchaseRequisition> page, List<PurchaseReqDTO> transactions, SearchResult<PurchaseReqDTO> result) {
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

	public List<PurchaseReqDTO> getRequestBySite(PurchaseReqDTO purchaseDTO) {
		List<PurchaseRequisition> purchaseReqList = purchaseReqRepository.findIndentBySites(purchaseDTO.getProjectId(), purchaseDTO.getSiteId());
		List<PurchaseReqDTO> purchaseModel = mapperUtil.toModelList(purchaseReqList, PurchaseReqDTO.class);
		return purchaseModel;
	}

	public MaterialIndentDTO createMaterialTransaction(MaterialIndentDTO materialIndentDto) {
		MaterialIndent matIndent = materialIndentRepository.findOne(materialIndentDto.getId());
		matIndent.setIssuedBy(employeeRepository.findOne(materialIndentDto.getIssuedById()));
		matIndent.setIssuedDate(DateUtil.convertToTimestamp(new Date()));
		Site site = siteRepository.findOne(materialIndentDto.getSiteId());
		String siteName = site.getName();
		
		List<MaterialIndentItemDTO> indentItemDTOs = materialIndentDto.getItems();
		Set<MaterialIndentItem> itemEntities = matIndent.getItems();
		Iterator<MaterialIndentItem> itemsItr = itemEntities.iterator();
		
		while(itemsItr.hasNext()) {
			boolean itemFound = false;
			MaterialIndentItem itemEntity = itemsItr.next();
			for(MaterialIndentItemDTO itemDto : indentItemDTOs) {
				if(itemEntity.getId() == itemDto.getId()) {
					itemFound = true;
					long reducedQty = itemEntity.getQuantity() - itemDto.getIssuedQuantity();
					itemEntity.setQuantity(reducedQty);
					itemEntity.setIssuedQuantity(itemDto.getIssuedQuantity());

					Material materialItm = inventoryRepository.findOne(itemDto.getMaterialId());
					
					if(materialItm.getMinimumStock() == materialItm.getStoreStock()) {
					
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
					
					MaterialTransaction materialTrans = new MaterialTransaction();
					materialTrans.setProject(projectRepository.findOne(materialIndentDto.getProjectId()));
					materialTrans.setSite(siteRepository.findOne(materialIndentDto.getSiteId()));
					materialTrans.setMaterialIndent(matIndent);
					materialTrans.setMaterialGroup(materialItemGroupRepository.findOne(materialItm.getItemGroupId()));
					Date dateofTransaction = new Date();
					long consumptionStock = materialItm.getStoreStock() - itemDto.getIssuedQuantity();
					materialItm.setStoreStock(consumptionStock);
					inventoryRepository.save(materialItm);
					materialTrans.setMaterial(materialItm);
					materialTrans.setUom(materialItm.getUom());
					materialTrans.setQuantity(reducedQty);
					materialTrans.setStoreStock(consumptionStock);
					materialTrans.setIssuedQuantity(itemDto.getIssuedQuantity());
					materialTrans.setTransactionType(MaterialTransactionType.ISSUED);
					materialTrans.setTransactionDate(DateUtil.convertToTimestamp(dateofTransaction));
					materialTrans.setActive(MaterialTransaction.ACTIVE_YES);
					materialTrans = inventTransactionRepository.save(materialTrans);
					if(materialTrans.getId() > 0) { 
						matIndent.setTransaction(materialTrans);
					}
				
					break;
				}
			}
			log.debug("itemFound - "+ itemFound);
			if(!itemFound){
				itemsItr.remove();
			}
		}
		
		matIndent = materialIndentRepository.save(matIndent);
		materialIndentDto = mapperUtil.toModel(matIndent, MaterialIndentDTO.class);
		
		return materialIndentDto;
	}

	
	
	
	
	
	
	


}
