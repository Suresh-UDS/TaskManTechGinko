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
import com.ts.app.domain.PurchaseRefGen;
import com.ts.app.domain.PurchaseRequisition;
import com.ts.app.domain.PurchaseRequisitionItem;
import com.ts.app.domain.Setting;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import com.ts.app.domain.PurchaseRequestStatus;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.InventoryRepository;
import com.ts.app.repository.InventoryTransactionRepository;
import com.ts.app.repository.MaterialIndentRepository;
import com.ts.app.repository.MaterialItemGroupRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.PurchaseRefGenRepository;
import com.ts.app.repository.PurchaseRequestSpecification;
import com.ts.app.repository.PurchaseRequisitionRepository;
import com.ts.app.repository.SettingsRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.CommonUtil;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.PagingUtil;
import com.ts.app.service.util.ReportUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ExportResult;
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
	private PurchaseRefGenRepository purchaseRefRepository;
	
	@Inject
	private SettingsRepository settingRepository;
	
	@Inject
	private MailService mailService;
	
	@Inject
	private ReportUtil reportUtil;
	
	@Inject
	private ExportUtil exportUtil;
	
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
		purchaseEntity.setRequestStatus(PurchaseRequestStatus.PENDING);
		purchaseEntity.setActive(PurchaseRequisition.ACTIVE_YES);
		
		List<PurchaseReqItemDTO> purchaseItems = purchaseReqDTO.getItems();
		List<PurchaseRequisitionItem> purchaseItemEntity = new ArrayList<PurchaseRequisitionItem>();
		for(PurchaseReqItemDTO purchaseItm : purchaseItems) { 
			PurchaseRequisitionItem purchaseIndentItm = mapperUtil.toEntity(purchaseItm, PurchaseRequisitionItem.class);
			purchaseIndentItm.setPurchaseRequisition(purchaseEntity);
			purchaseIndentItm.setPendingQty(purchaseItm.getQuantity());
			purchaseIndentItm.setActive(PurchaseRequisitionItem.ACTIVE_YES);
			purchaseIndentItm.setMaterial(inventoryRepository.findOne(purchaseItm.getMaterialId()));
			purchaseItemEntity.add(purchaseIndentItm);
		}
		MaterialTransaction materialTranc = null;
		PurchaseRefGen purchaseRef = new PurchaseRefGen();
		Set<PurchaseRequisitionItem> purchaseReqItem = new HashSet<PurchaseRequisitionItem>();
		purchaseReqItem.addAll(purchaseItemEntity);
		purchaseEntity.setItems(purchaseReqItem);
		if(purchaseReqDTO.getTransactionId() > 0) {
			materialTranc = inventTransactionRepository.findOne(purchaseReqDTO.getTransactionId());
			purchaseEntity.setTransaction(materialTranc);
		}else {
			purchaseEntity.setTransaction(null);
		}
		purchaseRef.setPurchaseRequisition(purchaseEntity);
		purchaseEntity.setPurchaseRefNumber(purchaseRef);
		purchaseEntity = purchaseReqRepository.save(purchaseEntity);
		//if(purchaseEntity.getId() > 0) {
		//	purchaseRef.setPurchaseRequisition(purchaseEntity);
		//	purchaseRefRepository.save(purchaseRef);
		//}
		
		log.debug("Save object of Inventory: {}" + purchaseEntity);
		if (materialTranc != null) {
			materialTranc.setPurchaseRequisition(purchaseEntity);
			inventTransactionRepository.save(materialTranc);
		}
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
			purchaseRequest.setApprovedDate(DateUtil.convertToTimestamp(new Date()));
		}
		if(purchaseReqDTO.getRequestStatus().equals(PurchaseRequestStatus.APPROVED)) {
			purchaseRequest.setRequestStatus(PurchaseRequestStatus.APPROVED);
		}	
		if(purchaseReqDTO.getRequestStatus().equals(PurchaseRequestStatus.REJECTED)) {
			purchaseRequest.setRequestStatus(PurchaseRequestStatus.REJECTED);
		}
		if(purchaseReqDTO.getPurchaseOrderNumber() != null) {
			purchaseRequest.setRequestStatus(PurchaseRequestStatus.PURCHASERAISED);
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
					itemEntity.setApprovedQty(itemDto.getCurrentAprQty());
					itemEntity.setUnitPrice(itemDto.getUnitPrice());
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
	        			transactions.add(mapToModel(request));
	        		}
				buildSearchResult(searchCriteria, page, transactions,result);
			}
		}
		return result;
	}

	public PurchaseReqDTO mapToModel(PurchaseRequisition requestEntity) {
	    PurchaseReqDTO requestEntityDTO = new PurchaseReqDTO();
	    requestEntityDTO.setId(requestEntity.getId());
	    requestEntityDTO.setProjectId(requestEntity.getProject().getId());
        requestEntityDTO.setProjectName(requestEntity.getProject().getName());
        requestEntityDTO.setSiteId(requestEntity.getSite().getId());
        requestEntityDTO.setSiteName(requestEntity.getSite().getName());
        requestEntityDTO.setRequestedById(requestEntity.getRequestedBy().getId());
        requestEntityDTO.setRequestedByName(requestEntity.getRequestedBy().getName());
        requestEntityDTO.setRequestedDate(requestEntity.getRequestedDate());
        if(requestEntity.getApprovedBy() != null) {
            requestEntityDTO.setApprovedById(requestEntity.getApprovedBy().getId());
            requestEntityDTO.setApprovedByName(requestEntity.getApprovedBy().getName());
            requestEntityDTO.setApprovedDate(requestEntity.getApprovedDate());
        }
        Set<PurchaseRequisitionItem> purchaseRequisitionItems = requestEntity.getItems();
        if(CollectionUtils.isNotEmpty(purchaseRequisitionItems)) {
            List<PurchaseReqItemDTO> purchaseReqItemDTOS = new ArrayList<>();
            for(PurchaseRequisitionItem purchaseRequItem : purchaseRequisitionItems) {
                PurchaseReqItemDTO purchaseReqItemDTO = new PurchaseReqItemDTO();
                purchaseReqItemDTO.setId(purchaseRequItem.getId());
                if(purchaseRequItem.getMaterial() != null) {
                    purchaseReqItemDTO.setMaterialId(purchaseRequItem.getMaterial().getId());
                    purchaseReqItemDTO.setMaterialItemCode(purchaseRequItem.getMaterial().getItemCode());
                    purchaseReqItemDTO.setMaterialItemGroupId(purchaseRequItem.getMaterial().getItemGroupId());
                    purchaseReqItemDTO.setMaterialName(purchaseRequItem.getMaterial().getName());
                    purchaseReqItemDTO.setMaterialStoreStock(purchaseRequItem.getMaterial().getStoreStock());
                    purchaseReqItemDTO.setMaterialUom(purchaseRequItem.getMaterial().getUom());
                }
                purchaseReqItemDTO.setApprovedQty(purchaseRequItem.getApprovedQty());
                purchaseReqItemDTO.setPendingQty(purchaseRequItem.getPendingQty());
                purchaseReqItemDTO.setQuantity(purchaseRequItem.getQuantity());
                purchaseReqItemDTO.setUnitPrice(purchaseRequItem.getUnitPrice());
                purchaseReqItemDTOS.add(purchaseReqItemDTO);
            }
            requestEntityDTO.setItems(purchaseReqItemDTOS);

        }
        requestEntityDTO.setRequestStatus(requestEntity.getRequestStatus());
        requestEntityDTO.setPurchaseOrderNumber(requestEntity.getPurchaseOrderNumber());
        requestEntityDTO.setPurchaseRefGenNumber(requestEntity.getPurchaseRefNumber().getNumber());
        if(requestEntity.getTransaction() != null) {
            requestEntityDTO.setTransactionId(requestEntity.getTransaction().getId());
        }

        return requestEntityDTO;

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
		List<PurchaseRequisition> purchaseReqList = purchaseReqRepository.findPurchaseReqBySite(purchaseDTO.getProjectId(), purchaseDTO.getSiteId());
		List<PurchaseReqDTO> purchaseModel = mapperUtil.toModelList(purchaseReqList, PurchaseReqDTO.class);
		return purchaseModel;
	}

	public PurchaseReqDTO createMaterialTransaction(PurchaseReqDTO purchaseReqDto) {
		PurchaseRequisition purchaseReqEntity = purchaseReqRepository.findOne(purchaseReqDto.getId());
		purchaseReqEntity.setApprovedBy(employeeRepository.findOne(purchaseReqDto.getApprovedById()));
		purchaseReqEntity.setApprovedDate(DateUtil.convertToTimestamp(new Date()));
		
		List<PurchaseReqItemDTO> purchaseItemDTOs = purchaseReqDto.getItems();
		Set<PurchaseRequisitionItem> itemEntities = purchaseReqEntity.getItems();
		Iterator<PurchaseRequisitionItem> itemsItr = itemEntities.iterator();
		
		while(itemsItr.hasNext()) {
			boolean itemFound = false;
			PurchaseRequisitionItem itemEntity = itemsItr.next();
			for(PurchaseReqItemDTO itemDto : purchaseItemDTOs) {
				if(itemEntity.getId() == itemDto.getId()) {
					itemFound = true;
					long addedQty = itemEntity.getQuantity() + itemDto.getApprovedQty();
					itemEntity.setQuantity(addedQty);
					itemEntity.setApprovedQty(itemDto.getApprovedQty());

					Material materialItm = inventoryRepository.findOne(itemDto.getMaterialId());
					
					MaterialTransaction materialTrans = new MaterialTransaction();
					materialTrans.setProject(projectRepository.findOne(purchaseReqDto.getProjectId()));
					materialTrans.setSite(siteRepository.findOne(purchaseReqDto.getSiteId()));
					materialTrans.setPurchaseRequisition(purchaseReqEntity);
					materialTrans.setMaterialGroup(materialItemGroupRepository.findOne(materialItm.getItemGroupId()));
					Date dateofTransaction = new Date();
					long consumptionStock = materialItm.getStoreStock() + itemDto.getApprovedQty();
					materialItm.setStoreStock(consumptionStock);
					inventoryRepository.save(materialItm);
					materialTrans.setMaterial(materialItm);
					materialTrans.setUom(materialItm.getUom());
					materialTrans.setQuantity(addedQty);
					materialTrans.setStoreStock(consumptionStock);
					materialTrans.setIssuedQuantity(itemDto.getApprovedQty());
					materialTrans.setTransactionType(MaterialTransactionType.RECEIVED);
					materialTrans.setTransactionDate(DateUtil.convertToTimestamp(dateofTransaction));
					materialTrans.setActive(MaterialTransaction.ACTIVE_YES);
					materialTrans = inventTransactionRepository.save(materialTrans);
					if(materialTrans.getId() > 0) { 
						purchaseReqEntity.setTransaction(materialTrans);
					}
				
					break;
				}
			}
			log.debug("itemFound - "+ itemFound);
			if(!itemFound){
				itemsItr.remove();
			}
		}
		
		purchaseReqEntity = purchaseReqRepository.save(purchaseReqEntity);
		purchaseReqDto = mapperUtil.toModel(purchaseReqEntity, PurchaseReqDTO.class);
		
		return purchaseReqDto;
	}

	public ExportResult generateReport(List<PurchaseReqDTO> transactions, SearchCriteria searchCriteria) {
		return reportUtil.generatePRReports(transactions, null, null, searchCriteria);
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

	public byte[] getExportFile(String fileName) {
		// return exportUtil.readExportFile(fileName);
		return exportUtil.readJobExportFile(fileName);
	}

	public PurchaseRequestStatus[] getRequestStatus() {
		// TODO Auto-generated method stub
		PurchaseRequestStatus[] requestStatus = PurchaseRequestStatus.values();
		return requestStatus;
	}
	
	
	
	


}
