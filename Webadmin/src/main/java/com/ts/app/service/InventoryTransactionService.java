package com.ts.app.service;

import com.ts.app.domain.*;
import com.ts.app.repository.*;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.util.*;
import com.ts.app.web.rest.dto.*;
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
import java.util.*;

@Service
@Transactional
public class InventoryTransactionService extends AbstractService {

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
							if(materialItm.getStoreStock() >= itemDto.getIssuedQuantity() && itemDto.getIssuedQuantity() > 0) {
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

							if(materialItm.getStoreStock() <= materialItm.getMinimumStock()) {   // send purchase request when stock is minimum level
								PurchaseRequisition purchaseRequest = new PurchaseRequisition();

								User user = userRepository.findOne(materialTransDTO.getUserId());
								Employee employee = user.getEmployee();
								purchaseRequest.setRequestedBy(employeeRepository.findOne(employee.getId()));
								purchaseRequest.setRequestedDate(DateUtil.convertToTimestamp(new Date()));
								purchaseRequest.setRequestStatus(PurchaseRequestStatus.PENDING);
								purchaseRequest.setSite(siteRepository.findOne(materialTransDTO.getSiteId()));
								purchaseRequest.setProject(projectRepository.findOne(materialTransDTO.getProjectId()));
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

								PurchaseRefGen purchaseRef = new PurchaseRefGen();  // Generate Purchase reference number

								Set<PurchaseRequisitionItem> materialItem = new HashSet<PurchaseRequisitionItem>();
								materialItem.addAll(purchaseItem);
								purchaseRequest.setItems(materialItem);
								purchaseRef.setPurchaseRequisition(purchaseRequest);
								purchaseRequest.setPurchaseRefNumber(purchaseRef);
								purchaseReqRepository.save(purchaseRequest);

								Site site = siteRepository.findOne(materialTransDTO.getSiteId());
								String siteName = site.getName();
								long siteId = site.getId();

								List<Setting> settings = settingRepository.findSettingByKeyAndSiteId(EMAIL_NOTIFICATION_PURCHASEREQ, siteId);

								log.debug("Setting Email list -" + settings.toString());

                                Setting purchaseRequestSetting = null;
                                if (CollectionUtils.isNotEmpty(settings)) {
                                    List<Setting> purchaseRequestSettings = settings;
                                    for(Setting purchaseReqSetting : purchaseRequestSettings) {
                                        if(purchaseReqSetting.getSettingValue().equalsIgnoreCase("true")) {
                                            purchaseRequestSetting = purchaseReqSetting;
                                        }
                                    }

                                }

								if(purchaseRequestSetting != null && purchaseRequestSetting.getSettingValue().equalsIgnoreCase("true") ) {

									List<Setting> settingEntity = settingRepository.findSettingByKeyAndSiteId(EMAIL_NOTIFICATION_PURCHASEREQ_EMAILS, siteId);
                                    Setting reqEmailSetting = null;
									if(CollectionUtils.isNotEmpty(settingEntity)) {
                                        reqEmailSetting = settingEntity.get(0);
										List<String> emailLists = CommonUtil.convertToList(reqEmailSetting.getSettingValue(), ",");
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
	        			transactions.add(mapToModel(materialTrans));
	        		}
				buildSearchResult(searchCriteria, page, transactions,result);
			}
		}
		return result;
	}

	public MaterialTransactionDTO mapToModel(MaterialTransaction materialTransaction) {
	    MaterialTransactionDTO materialTransactionDTO = new MaterialTransactionDTO();
	    materialTransactionDTO.setId(materialTransaction.getId());
	    materialTransactionDTO.setProjectId(materialTransaction.getProject().getId());
	    materialTransactionDTO.setProjectName(materialTransaction.getProject().getName());
	    materialTransactionDTO.setSiteId(materialTransaction.getSite().getId());
	    materialTransactionDTO.setSiteName(materialTransaction.getSite().getName());
	    if(materialTransaction.getJob() != null) {
	        materialTransactionDTO.setJobId(materialTransaction.getJob().getId());
        }
	    if(materialTransaction.getAsset() != null) {
	        materialTransactionDTO.setAssetId(materialTransaction.getAsset().getId());
        }
	    if(materialTransaction.getMaterial() != null) {
	        materialTransactionDTO.setMaterialId(materialTransaction.getMaterial().getId());
	        materialTransactionDTO.setMaterialName(materialTransaction.getMaterial().getName());
	        materialTransactionDTO.setMaterialItemCode(materialTransaction.getMaterial().getItemCode());
        }
	    if(materialTransaction.getMaterialGroup() != null) {
	        materialTransactionDTO.setMaterialGroupId(materialTransaction.getMaterialGroup().getId());
	        materialTransactionDTO.setMaterialGroupItemGroup(materialTransaction.getMaterialGroup().getItemGroup());
        }
	    if(materialTransaction.getMaterialIndent() != null) {
	        materialTransactionDTO.setMaterialIndentId(materialTransaction.getMaterialIndent().getId());
	        materialTransactionDTO.setMaterialIndentRefNumber(materialTransaction.getMaterialIndent().getIndentRefNumber().getNumber());
            Set<MaterialIndentItem> matIndentItems = materialTransaction.getMaterialIndent().getItems();
            if(CollectionUtils.isNotEmpty(matIndentItems)) {
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
                    matIndentItemDTOS.add(matIndentItemDTO);
                }
                materialTransactionDTO.setItems(matIndentItemDTOS);

            }
        }
	    if(materialTransaction.getPurchaseRequisition() != null) {
	        materialTransactionDTO.setPurchaseRequisitionId(materialTransaction.getPurchaseRequisition().getId());
	        materialTransactionDTO.setPurchaseRefNumber(materialTransaction.getPurchaseRequisition().getPurchaseRefNumber().getNumber());
            Set<PurchaseRequisitionItem> purchaseRequisitionItems = materialTransaction.getPurchaseRequisition().getItems();
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
                materialTransactionDTO.setPrItems(purchaseReqItemDTOS);

            }
        }
	    materialTransactionDTO.setQuantity(materialTransaction.getQuantity());
	    materialTransactionDTO.setIssuedQuantity(materialTransaction.getIssuedQuantity());
	    materialTransactionDTO.setStoreStock(materialTransaction.getStoreStock());
	    materialTransactionDTO.setTransactionDate(materialTransaction.getTransactionDate());
	    materialTransactionDTO.setTransactionType(materialTransaction.getTransactionType());

        return materialTransactionDTO;
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
