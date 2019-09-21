package com.ts.app.service;

import com.ts.app.domain.*;
import com.ts.app.repository.ChecklistItemRepository;
import com.ts.app.repository.ChecklistRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.*;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.*;


/**
 * Service class for managing checklist information.
 */
@Service
@Transactional
public class ChecklistService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(ChecklistService.class);

	@Inject
	private ChecklistRepository checklistRepository;
	
	@Inject
	private ChecklistItemRepository checklistItemRepository;
	
	@Inject
	private ProjectRepository projectRepository;

	@Inject
	private SiteRepository siteRepository;
	
	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;
	
	@Inject 
	private ImportUtil importUtil;

	public ChecklistDTO createChecklistInformation(ChecklistDTO checklistDto) {
		if(checklistDto.getId() > 0) {
			updateChecklist(checklistDto);
		}else {
			Checklist checklist = mapperUtil.toEntity(checklistDto, Checklist.class);
			List<ChecklistItemDTO> itemDtos = checklistDto.getItems();
			List<ChecklistItem> items = new ArrayList<ChecklistItem>();
			for(ChecklistItemDTO itemDto : itemDtos) {
				ChecklistItem item = mapperUtil.toEntity(itemDto, ChecklistItem.class);
				item.setChecklist(checklist);
				items.add(item);
			}
//			Set<ChecklistItem> itemsSet = new HashSet<ChecklistItem>();
//			itemsSet.addAll(items);
//			checklist.setItems(itemsSet);
			
//*****************Modified by Vinoth******************************************************************

			List<ChecklistItem> itemList = new ArrayList<ChecklistItem>();
			itemList.addAll(items);
			checklist.setItems(itemList);
			
//******************************************************************************************************			
			
			if(checklistDto.getProjectId() > 0) {
				Project project = projectRepository.findOne(checklistDto.getProjectId());
				checklist.setProject(project);
			}else {
				checklist.setProject(null);
			}
			if(checklistDto.getSiteId() > 0) {
				Site site = siteRepository.findOne(checklistDto.getSiteId());
				checklist.setSite(site);
			}else {
				checklist.setSite(null);
			}
			checklist.setActive(Checklist.ACTIVE_YES);
	        checklist = checklistRepository.save(checklist);
			log.debug("Created Information for Checklist: {}", checklist);
			checklistDto = mapperUtil.toModel(checklist, ChecklistDTO.class);
		}
		return checklistDto;
	}

	public void updateChecklist(ChecklistDTO checklist) {
		log.debug("Inside Update");
		Checklist checklistUpdate = checklistRepository.findOne(checklist.getId());
		checklistUpdate.setName(checklist.getName());
		//checklistUpdate = checklistRepository.save(checklistUpdate);
		List<ChecklistItemDTO> itemDtos = checklist.getItems();
		List<ChecklistItem> items = new ArrayList<ChecklistItem>();
		
//**********************************Modified by Vinoth***************************************************************	
		List<ChecklistItem> itemEntities = checklistUpdate.getItems();
		
//*******************************************************************************************************************		
//		Set<ChecklistItem> itemEntities = checklistUpdate.getItems();
		Iterator<ChecklistItem> itemsItr = itemEntities.iterator();
		while(itemsItr.hasNext()) {
			boolean itemFound = false;
			ChecklistItem itemEntity = itemsItr.next();
			for(ChecklistItemDTO itemDto : itemDtos) {
				//items.add(checklistItemRepository.findOne(itemDto.getId()));
				//items.add(mapperUtil.toEntity(itemDto, ChecklistItem.class));
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
		for(ChecklistItemDTO itemDto : itemDtos) {
			if(itemDto.getId() == 0) {
				ChecklistItem newItem = mapperUtil.toEntity(itemDto, ChecklistItem.class);
				newItem.setChecklist(checklistUpdate);
				checklistUpdate.getItems().add(newItem);
			}
		}	
		log.debug("before save ="+checklistUpdate.getItems());
		checklistRepository.save(checklistUpdate);
		log.debug("updated Checklist: {}", checklistUpdate);
	}

	public void deleteChecklist(Long id) {
		log.debug("Inside Delete");
		Checklist checklistUpdate = checklistRepository.findOne(id);
        checklistUpdate.setActive(Checklist.ACTIVE_NO);
		checklistRepository.save(checklistUpdate);
	}

	public List<ChecklistDTO> findAll() {
		List<Checklist> entities = checklistRepository.findActiveChecklists();
		return mapperUtil.toModelList(entities, ChecklistDTO.class);
	}

	public ChecklistDTO findOne(Long id) {
		Checklist entity = checklistRepository.findOne(id);
		return mapperUtil.toModel(entity, ChecklistDTO.class);
	}


	public SearchResult<ChecklistDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		SearchResult<ChecklistDTO> result = new SearchResult<ChecklistDTO>();
		if(searchCriteria != null) {
			Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
			Page<Checklist> page = null;
			List<ChecklistDTO> transitems = null;
			if(!searchCriteria.isFindAll()) {
				if(searchCriteria.getProjectId() != 0) {
					page = checklistRepository.findByProjectId(searchCriteria.getProjectId(), pageRequest);
				}else if(!StringUtils.isEmpty(searchCriteria.getName())) {
					page = checklistRepository.findByName(searchCriteria.getName(), pageRequest);
				}
			}else {
				page = checklistRepository.findActiveChecklists(pageRequest);
			}
			if(page != null) {
				transitems = mapperUtil.toModelList(page.getContent(), ChecklistDTO.class);
				if(CollectionUtils.isNotEmpty(transitems)) {
					buildSearchResult(searchCriteria, page, transitems,result);
				}
			}
		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<Checklist> page, List<ChecklistDTO> transactions, SearchResult<ChecklistDTO> result) {
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
	
	public ImportResult getImportStatus(String fileId) {
		ImportResult er = null;
		//fileId += ".csv";
		if(!StringUtils.isEmpty(fileId)) {
			er = importUtil.getImportResult(fileId);
			//er.setFile(fileId);
			//er.setStatus(status);
		}
		return er;
	}

	

}
