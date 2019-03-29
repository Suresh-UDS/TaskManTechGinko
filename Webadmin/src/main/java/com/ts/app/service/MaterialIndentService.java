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
import com.ts.app.domain.ChecklistItem;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.IndentStatus;
import com.ts.app.domain.Material;
import com.ts.app.domain.MaterialIndent;
import com.ts.app.domain.MaterialIndentGen;
import com.ts.app.domain.MaterialIndentItem;
import com.ts.app.domain.MaterialItemGroup;
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
import com.ts.app.repository.MaterialIndentItemRepository;
import com.ts.app.repository.MaterialIndentRepository;
import com.ts.app.repository.MaterialIndentSpecification;
import com.ts.app.repository.MaterialItemGroupRepository;
import com.ts.app.repository.ProjectRepository;
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
	private MaterialIndentItemRepository materialIndentItmRepo;
	
	@Inject
	private MaterialItemGroupRepository materialItemGroupRepository;
	
	@Inject
	private SettingsRepository settingRepository;
	
	@Inject
	private PurchaseRequisitionRepository purchaseReqRepository;
	
	@Inject
	private MailService mailService;
	
	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;
	
	public static final String EMAIL_NOTIFICATION_PURCHASEREQ = "email.notification.purchasereq";

	public static final String EMAIL_NOTIFICATION_PURCHASEREQ_EMAILS = "email.notification.purchasereq.emails";
	
	public MaterialIndentDTO createIndent(MaterialIndentDTO materialIndentDTO) { 
		MaterialIndent indentEntity = mapperUtil.toEntity(materialIndentDTO, MaterialIndent.class);
		indentEntity.setRequestedDate(DateUtil.convertToTimestamp(materialIndentDTO.getRequestedDate()));
		indentEntity.setSite(siteRepository.findOne(materialIndentDTO.getSiteId()));
		indentEntity.setProject(projectRepository.findOne(materialIndentDTO.getProjectId()));
		indentEntity.setRequestedBy(employeeRepository.findOne(materialIndentDTO.getRequestedById()));
		indentEntity.setIssuedBy(employeeRepository.findOne(materialIndentDTO.getIssuedById()));
		indentEntity.setActive(MaterialIndent.ACTIVE_YES);
		indentEntity.setIndentStatus(IndentStatus.PENDING);
		List<MaterialIndentItemDTO> indentItems = materialIndentDTO.getItems();
		List<MaterialIndentItem> indentItemEntity = new ArrayList<MaterialIndentItem>();
		for(MaterialIndentItemDTO indentItm : indentItems) { 
			MaterialIndentItem materialIndentItm = mapperUtil.toEntity(indentItm, MaterialIndentItem.class);
			materialIndentItm.setMaterialIndent(indentEntity);
			materialIndentItm.setPendingQuantity(indentItm.getQuantity());
			materialIndentItm.setActive(MaterialIndentItem.ACTIVE_YES);
			materialIndentItm.setMaterial(inventoryRepository.findOne(indentItm.getMaterialId()));
			indentItemEntity.add(materialIndentItm);
		}
		MaterialTransaction materialTranc = null;
		MaterialIndentGen indentRef = new MaterialIndentGen();
		Set<MaterialIndentItem> materialIndentItem = new HashSet<MaterialIndentItem>();
		materialIndentItem.addAll(indentItemEntity);
		indentEntity.setItems(materialIndentItem);
		if(materialIndentDTO.getTransactionId() > 0) {
			materialTranc = inventTransactionRepository.findOne(materialIndentDTO.getTransactionId());
			indentEntity.setTransaction(materialTranc);
		}else {
			indentEntity.setTransaction(null);
		}
		indentRef.setMaterialIndent(indentEntity);
		indentEntity.setIndentRefNumber(indentRef);
		indentEntity = materialIndentRepository.save(indentEntity);
		log.debug("Save object of Inventory: {}" + indentEntity);
		if (materialTranc != null) {
			materialTranc.setMaterialIndent(indentEntity);
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
		mapToEntity(materialIndent, materialIndentDTO);
		materialIndentRepository.saveAndFlush(materialIndent);		
	}

	private void mapToEntity(MaterialIndent material, MaterialIndentDTO materialindentDTO) {
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
		if(materialindentDTO.getPurpose() != null) {
		    material.setPurpose(materialindentDTO.getPurpose());
        }
		
		List<MaterialIndentItemDTO> indentItemDTOs = materialindentDTO.getItems();
		Set<MaterialIndentItem> itemEntities = material.getItems();
		Iterator<MaterialIndentItem> itemsItr = itemEntities.iterator();
		while(itemsItr.hasNext()) {
			boolean itemFound = false;
			MaterialIndentItem itemEntity = itemsItr.next();
			for(MaterialIndentItemDTO itemDto : indentItemDTOs) {
				if(itemEntity.getId() == itemDto.getId()) {
					itemFound = true;
					itemEntity.setQuantity(itemDto.getQuantity());
					itemEntity.setIssuedQuantity(itemDto.getIssuedQuantity());
					itemEntity.setPendingQuantity(itemDto.getPendingQuantity());
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
		materialIndent.setActive(MaterialIndent.ACTIVE_NO);
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
	        		for(MaterialIndent materialIndent : allIndentsList) {
	        		    MaterialIndentDTO materialIndentDTO = new MaterialIndentDTO();
	        			transactions.add(mapToModel(materialIndent, materialIndentDTO));
	        		}
				buildSearchResult(searchCriteria, page, transactions,result);
			}
		}
		return result;
	}

	public MaterialIndentDTO mapToModel(MaterialIndent materialIndent, MaterialIndentDTO materialIndentDTO) {
//	    MaterialIndentDTO materialIndentDTO = new MaterialIndentDTO();
        List<MaterialIndentItemDTO> materialIndentItemSet = null;
        if(materialIndentDTO.getItems() != null) {
            materialIndentItemSet = materialIndentDTO.getItems();
        }
	    materialIndentDTO.setId(materialIndent.getId());
	    materialIndentDTO.setProjectId(materialIndent.getProject().getId());
	    materialIndentDTO.setProjectName(materialIndent.getProject().getName());
	    materialIndentDTO.setSiteId(materialIndent.getSite().getId());
	    materialIndentDTO.setSiteName(materialIndent.getSite().getName());
	    if(materialIndent.getRequestedBy() != null) {
	        materialIndentDTO.setRequestedById(materialIndent.getRequestedBy().getId());
	        materialIndentDTO.setRequestedByName(materialIndent.getRequestedBy().getName());
	        materialIndentDTO.setRequestedDate(materialIndent.getRequestedDate());
        }
	    if(materialIndent.getIssuedBy() != null) {
	        materialIndentDTO.setIssuedById(materialIndent.getIssuedBy().getId());
	        materialIndentDTO.setIssuedByName(materialIndent.getIssuedBy().getName());
	        materialIndentDTO.setIssuedDate(materialIndent.getIssuedDate());
        }
        Set<MaterialIndentItem> matIndentItems = materialIndent.getItems();
        if(CollectionUtils.isNotEmpty(matIndentItems)) {
            int i = 0;
            List<MaterialIndentItemDTO> matIndentItemDTOS = new ArrayList<>();
            for(MaterialIndentItem indentItem : matIndentItems) {
                MaterialIndentItemDTO matIndentItemDTO = new MaterialIndentItemDTO();
                matIndentItemDTO.setId(indentItem.getId());
                if(indentItem.getMaterial() != null) {
                    matIndentItemDTO.setMaterialId(indentItem.getMaterial().getId());
                    matIndentItemDTO.setMaterialItemCode(indentItem.getMaterial().getItemCode());
                    matIndentItemDTO.setMaterialItemGroupId(indentItem.getMaterial().getItemGroupId());
                    matIndentItemDTO.setMaterialName(indentItem.getMaterial().getName());
                    matIndentItemDTO.setMaterialStoreStock(indentItem.getMaterial().getStoreStock());
                    matIndentItemDTO.setMaterialUom(indentItem.getMaterial().getUom());
                }
                matIndentItemDTO.setIssuedQuantity(indentItem.getIssuedQuantity());
                matIndentItemDTO.setPendingQuantity(indentItem.getPendingQuantity());
                matIndentItemDTO.setQuantity(indentItem.getQuantity());
                if(materialIndentItemSet != null && materialIndentItemSet.get(i).isErrorStatus()){
                    matIndentItemDTO.setErrorMessage(materialIndentItemSet.get(i).getErrorMessage());
                    matIndentItemDTO.setErrorStatus(materialIndentItemSet.get(i).isErrorStatus());
                    matIndentItemDTO.setStatus(materialIndentItemSet.get(i).getStatus());
                }
                matIndentItemDTOS.add(matIndentItemDTO);
                i++;
            }
            materialIndentDTO.setItems(matIndentItemDTOS);
        }
        materialIndentDTO.setIndentRefNumber(materialIndent.getIndentRefNumber().getNumber());
        materialIndentDTO.setIndentStatus(materialIndent.getIndentStatus());
        materialIndentDTO.setPurpose(materialIndent.getPurpose());
        if(materialIndent.getTransaction() != null) {
            materialIndentDTO.setTransactionId(materialIndent.getTransaction().getId());
        }
        return materialIndentDTO;
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

	public MaterialIndentDTO createMaterialTransaction(MaterialIndentDTO materialIndentDto) {
		MaterialIndent matIndent = materialIndentRepository.findOne(materialIndentDto.getId());
		matIndent.setIssuedBy(employeeRepository.findOne(materialIndentDto.getUserId()));
		matIndent.setIssuedDate(DateUtil.convertToTimestamp(new Date()));
		Site site = siteRepository.findOne(materialIndentDto.getSiteId());
		String siteName = site.getName();
		long siteId = site.getId();
		
		List<MaterialIndentItemDTO> indentItemDTOs = materialIndentDto.getItems();
		Set<MaterialIndentItem> itemEntities = matIndent.getItems();
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
						Date dateofTransaction = new Date();
						if(materialItm.getStoreStock() > itemDto.getIssuedQuantity() && itemDto.getIssuedQuantity() > 0) {
							long consumptionStock = materialItm.getStoreStock() - itemDto.getIssuedQuantity();
							reducedQty = itemEntity.getPendingQuantity() - itemDto.getIssuedQuantity();  
							addedQty = itemEntity.getIssuedQuantity() + itemDto.getIssuedQuantity(); 
							itemEntity.setPendingQuantity(reducedQty);  
							itemEntity.setIssuedQuantity(addedQty); 
							MaterialTransaction materialTrans = new MaterialTransaction();
							materialTrans.setProject(projectRepository.findOne(materialIndentDto.getProjectId()));
							materialTrans.setSite(siteRepository.findOne(materialIndentDto.getSiteId()));
							materialTrans.setMaterialIndent(matIndent);
							materialTrans.setMaterialGroup(materialItemGroupRepository.findOne(materialItm.getItemGroupId()));
							materialItm.setStoreStock(consumptionStock);
							inventoryRepository.save(materialItm);
							materialTrans.setMaterial(materialItm);
							materialTrans.setUom(materialItm.getUom());
							materialTrans.setStoreStock(consumptionStock);
							materialTrans.setIssuedQuantity(itemDto.getIssuedQuantity());
							materialTrans.setTransactionType(MaterialTransactionType.ISSUED);
							materialTrans.setTransactionDate(DateUtil.convertToTimestamp(dateofTransaction));
							materialTrans.setActive(MaterialTransaction.ACTIVE_YES);
							materialTrans = inventTransactionRepository.save(materialTrans);
							if(materialTrans.getId() > 0) { 
								matIndent.setTransaction(materialTrans);
							}
							
						} else if(itemDto.getIssuedQuantity() != 0){
							itemDto.setErrorMessage("Issued quantity not available in store stock.");
							itemDto.setErrorStatus(true);
							itemDto.setStatus("400");
						}

						if(materialItm.getStoreStock() < materialItm.getMinimumStock()) {    // send purchase request when stock is minimum level
							PurchaseRequisition purchaseRequest = new PurchaseRequisition();
							purchaseRequest.setProject(projectRepository.findOne(materialIndentDto.getProjectId()));
							purchaseRequest.setSite(siteRepository.findOne(materialIndentDto.getSiteId()));
							purchaseRequest.setRequestedBy(employeeRepository.findOne(materialIndentDto.getRequestedById()));
							purchaseRequest.setRequestedDate(DateUtil.convertToTimestamp(new Date()));
							purchaseRequest.setActive(PurchaseRequisition.ACTIVE_YES);
							purchaseRequest.setRequestStatus(PurchaseRequestStatus.PENDING);
							addPurchaseReqItem(purchaseRequest, materialItm);
						
							List<Setting> settings = settingRepository.findSettingByKeyAndSiteId(EMAIL_NOTIFICATION_PURCHASEREQ, siteId);
							
							log.debug("Setting Email list -" + settings.toString());

                            Setting purchaseReqSetting = null;
                            if (CollectionUtils.isNotEmpty(settings)) {
                                List<Setting> purchaseReqSettings = settings;
                                for(Setting eodSetting : purchaseReqSettings) {
                                    if(eodSetting.getSettingValue().equalsIgnoreCase("true")) {
                                        purchaseReqSetting = eodSetting;
                                    }
                                }

                            }

							if(purchaseReqSetting != null && purchaseReqSetting.getSettingValue().equalsIgnoreCase("true") ) {

								List<Setting> settingEntity = settingRepository.findSettingByKeyAndSiteId(EMAIL_NOTIFICATION_PURCHASEREQ_EMAILS, siteId);
                                Setting emailSetting = null;
								if(CollectionUtils.isNotEmpty(settingEntity)) {
                                    emailSetting = settingEntity.get(0);
									List<String> emailLists = CommonUtil.convertToList(emailSetting.getSettingValue(), ",");
									for(String email : emailLists) {
										mailService.sendPurchaseRequest(email, materialItm.getItemCode(), siteName, materialItm.getName());
									}

								} else {

									log.info("There is no email ids registered");
								}
							} else {

							    log.debug("Purchase request email setting is false for " + siteName);
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
		
		Set<MaterialIndentItem> materialItem = matIndent.getItems();
		boolean isPending = checkIfNoItems(materialItem);
		if(isPending) { 
			 matIndent.setIndentStatus(IndentStatus.PENDING);
		}else {
			matIndent.setIndentStatus(IndentStatus.ISSUED);
		}
		
		matIndent = materialIndentRepository.save(matIndent);
//		materialIndentDto = mapperUtil.toModel(matIndent, MaterialIndentDTO.class);
        materialIndentDto = mapToModel(matIndent, materialIndentDto);
		
		return materialIndentDto;
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

	private void addPurchaseReqItem(PurchaseRequisition purchaseReq, Material material) {
		// TODO Auto-generated method stub
		List<PurchaseRequisitionItem> purchaseItem = new ArrayList<PurchaseRequisitionItem>();
		PurchaseRequisitionItem purchaseReqItemEntity = new PurchaseRequisitionItem();
		purchaseReqItemEntity.setActive(PurchaseRequisitionItem.ACTIVE_YES);
		purchaseReqItemEntity.setMaterial(material);
		purchaseReqItemEntity.setPurchaseRequisition(purchaseReq);
		purchaseReqItemEntity.setQuantity(material.getMaximumStock());
		purchaseReqItemEntity.setUnitPrice(0);
		purchaseReqItemEntity.setApprovedQty(0);
		purchaseReqItemEntity.setPendingQty(material.getMaximumStock());
		purchaseItem.add(purchaseReqItemEntity);
		PurchaseRefGen purchaseRef = new PurchaseRefGen();

		Set<PurchaseRequisitionItem> materialItem = new HashSet<PurchaseRequisitionItem>();
		materialItem.addAll(purchaseItem);
		purchaseReq.setItems(materialItem);
		purchaseRef.setPurchaseRequisition(purchaseReq);
		purchaseReq.setPurchaseRefNumber(purchaseRef);
		purchaseReqRepository.save(purchaseReq);
	}

	
	
	
	
	
	
	

}
