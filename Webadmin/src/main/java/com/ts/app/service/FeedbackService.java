package com.ts.app.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.inject.Inject;
import javax.transaction.Transactional;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.Feedback;
import com.ts.app.domain.FeedbackMapping;
import com.ts.app.domain.FeedbackQuestion;
import com.ts.app.domain.Job;
import com.ts.app.domain.Project;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import com.ts.app.repository.FeedbackMappingRepository;
import com.ts.app.repository.FeedbackRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.FileUploadHelper;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.FeedbackDTO;
import com.ts.app.web.rest.dto.FeedbackMappingDTO;
import com.ts.app.web.rest.dto.FeedbackQuestionDTO;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;

/**
 * Service class for managing feedback question information.
 */
@Service
@Transactional
public class FeedbackService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(FeedbackService.class);

	@Inject
	private FeedbackRepository feedbackRepository;

	@Inject
	private ProjectRepository projectRepository;

	@Inject
	private SiteRepository siteRepository;

	@Inject
	private UserRepository userRepository;

	@Inject
	private FeedbackMappingRepository feedbackMappingRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private FileUploadHelper fileUploadHelper;

	public FeedbackDTO saveFeebdackQuestions(FeedbackDTO feedbackDto) {

		if(feedbackDto.getId() > 0) {
			updateFeedback(feedbackDto);
		}else {
			Feedback feedback = mapperUtil.toEntity(feedbackDto, Feedback.class);
			List<FeedbackQuestionDTO> itemDtos = feedbackDto.getQuestions();
			List<FeedbackQuestion> items = new ArrayList<FeedbackQuestion>();
			for(FeedbackQuestionDTO itemDto : itemDtos) {
				FeedbackQuestion item = mapperUtil.toEntity(itemDto, FeedbackQuestion.class);
				item.setFeedback(feedback);
				items.add(item);
			}
			List<FeedbackQuestion> itemsList = new ArrayList<FeedbackQuestion>();
			itemsList.addAll(items);
			feedback.setQuestions(itemsList);

			if(feedbackDto.getProjectId() > 0) {
				Project project = projectRepository.findOne(feedbackDto.getProjectId());
				feedback.setProject(project);
			}else {
				feedback.setProject(null);
			}
			if(feedbackDto.getSiteId() > 0) {
				Site site = siteRepository.findOne(feedbackDto.getSiteId());
				feedback.setSite(site);
			}else {
				feedback.setSite(null);
			}

			feedback.setActive(Feedback.ACTIVE_YES);
	        feedback = feedbackRepository.save(feedback);
			log.debug("Created Information for Feedback: {}", feedback);
			feedbackDto = mapperUtil.toModel(feedback, FeedbackDTO.class);
		}


		return feedbackDto;
	}

	public void updateFeedback(FeedbackDTO feedback) {
		log.debug("Inside Update");
		Feedback feedbackUpdate = feedbackRepository.findOne(feedback.getId());
		//feedbackUpdate.getItems().clear();
		//feedbackUpdate = feedbackRepository.save(feedbackUpdate);
		List<FeedbackQuestionDTO> itemDtos = feedback.getQuestions();
		List<FeedbackQuestion> items = new ArrayList<FeedbackQuestion>();
		List<FeedbackQuestion> itemEntities = feedbackUpdate.getQuestions();
		Iterator<FeedbackQuestion> itemsItr = itemEntities.iterator();
		while(itemsItr.hasNext()) {
			boolean itemFound = false;
			FeedbackQuestion itemEntity = itemsItr.next();
			for(FeedbackQuestionDTO itemDto : itemDtos) {
				//items.add(feedbackItemRepository.findOne(itemDto.getId()));
				//items.add(mapperUtil.toEntity(itemDto, FeedbackQuestion.class));
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
		for(FeedbackQuestionDTO itemDto : itemDtos) {
			if(itemDto.getId() == 0) {
				FeedbackQuestion newItem = mapperUtil.toEntity(itemDto, FeedbackQuestion.class);
				newItem.setFeedback(feedbackUpdate);
				feedbackUpdate.getQuestions().add(newItem);
			}
		}
		log.debug("before save ="+feedbackUpdate.getQuestions());
		feedbackRepository.save(feedbackUpdate);
		log.debug("updated Feedback: {}", feedbackUpdate);
	}

	public List<FeedbackDTO> findAll(int currPage) {
		Pageable pageRequest = createPageRequest(currPage);
		Page<Feedback> result = feedbackRepository.findAll(pageRequest);
		return mapperUtil.toModelList(result.getContent(), FeedbackDTO.class);
	}

	public FeedbackDTO findOne(Long id) {
		Feedback entity = feedbackRepository.findOne(id);
		return mapperUtil.toModel(entity, FeedbackDTO.class);
	}

	public SearchResult<FeedbackDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		SearchResult<FeedbackDTO> result = new SearchResult<FeedbackDTO>();
		if(searchCriteria != null) {
			User user = userRepository.findOne(searchCriteria.getUserId());
			Employee employee = user.getEmployee();


			//-----
            Pageable pageRequest = null;
            if(!StringUtils.isEmpty(searchCriteria.getColumnName())){
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" +sort);
                pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);

            }else{
                pageRequest = createPageRequest(searchCriteria.getCurrPage());
            }



			//Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
			Page<Feedback> page = null;
			List<FeedbackDTO> transitems = null;
			List<Feedback> feedbackList = null;
			if(searchCriteria.getProjectId() > 0 || searchCriteria.getSiteId() > 0) {
				log.debug("SearchCriteria" +searchCriteria.getProjectId()+ "" +searchCriteria.getSiteId());
				page = feedbackRepository.findBySite(searchCriteria.getProjectId(), searchCriteria.getSiteId(), pageRequest);
			}else {
				if(user.isAdmin()) {
					page = feedbackRepository.findAll(pageRequest);

				}else {
					List<EmployeeProjectSite> projectSites = employee.getProjectSites();
		        		if(CollectionUtils.isNotEmpty(projectSites)) {
		        			List<Long> siteIds = new ArrayList<Long>();
		        			for(EmployeeProjectSite projSite : projectSites) {
		        				siteIds.add(projSite.getSite().getId());
		        			}
		        			page = feedbackRepository.findBySites(siteIds, pageRequest);
		        		}
				}
			}
			if(page != null) {
				feedbackList = page.getContent();
			}
			if(CollectionUtils.isNotEmpty(feedbackList)) {
				transitems = mapperUtil.toModelList(feedbackList, FeedbackDTO.class);
				if(CollectionUtils.isNotEmpty(transitems)) {
					buildSearchResult(searchCriteria, page, transitems,result);
				}
			}
		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<Feedback> page, List<FeedbackDTO> transactions, SearchResult<FeedbackDTO> result) {
		if(page != null) {
			result.setTotalPages(page.getTotalPages());
			result.setCurrPage(page.getNumber() + 1);
			result.setTotalCount(page.getTotalElements());
	        result.setStartInd((result.getCurrPage() - 1) * 10 + 1);
	        result.setEndInd((result.getTotalCount() > 10  ? (result.getCurrPage()) * 10 : result.getTotalCount()));
		}

		result.setTransactions(transactions);
		return;
	}


	public FeedbackMappingDTO saveFeebdackMapping(FeedbackMappingDTO feedbackMappingDto) {

		if(feedbackMappingDto.getId() > 0) {
			updateFeedbackMapping(feedbackMappingDto);
		}else {
			List<FeedbackMapping> feedbackMappings = feedbackMappingRepository.findOneByLocation(feedbackMappingDto.getSiteId(), feedbackMappingDto.getBlock(), feedbackMappingDto.getFloor(), feedbackMappingDto.getZone()); 
			FeedbackMapping feedbackMapping = CollectionUtils.isNotEmpty(feedbackMappings)  ? feedbackMappings.get(0) : null;
			if(feedbackMapping == null) {
				feedbackMapping = mapperUtil.toEntity(feedbackMappingDto, FeedbackMapping.class);
	
				if(feedbackMappingDto.getProjectId() > 0) {
					Project project = projectRepository.findOne(feedbackMappingDto.getProjectId());
					feedbackMapping.setProject(project);
				}else {
					feedbackMapping.setProject(null);
				}
				if(feedbackMappingDto.getSiteId() > 0) {
					Site site = siteRepository.findOne(feedbackMappingDto.getSiteId());
					feedbackMapping.setSite(site);
				}else {
					feedbackMapping.setSite(null);
				}
				Feedback feedback = feedbackRepository.findOne(feedbackMappingDto.getFeedback().getId());
				feedbackMapping.setFeedback(feedback);
				feedbackMapping.setActive(Feedback.ACTIVE_YES);
			}else {
				Feedback feedback = feedbackRepository.findOne(feedbackMappingDto.getFeedback().getId());
				feedbackMapping.setFeedback(feedback);
				feedbackMapping.setActive(Feedback.ACTIVE_YES);
			}
	        feedbackMapping = feedbackMappingRepository.save(feedbackMapping);
			log.debug("Created Information for Feedback: {}", feedbackMapping);
			feedbackMappingDto = mapperUtil.toModel(feedbackMapping, FeedbackMappingDTO.class);
		}


		return feedbackMappingDto;
	}

	public void updateFeedbackMapping(FeedbackMappingDTO feedbackMappingDto) {
		log.debug("Inside Update");
		FeedbackMapping feedbackMappingUpdate = feedbackMappingRepository.findOne(feedbackMappingDto.getId());
		Feedback feedback = feedbackRepository.findOne(feedbackMappingDto.getFeedback().getId());
		feedbackMappingUpdate.setFeedback(feedback);
		feedbackMappingRepository.save(feedbackMappingUpdate);
		log.debug("updated Feedback: {}", feedbackMappingUpdate);
	}

	public List<FeedbackMappingDTO> findAllMapping(int currPage) {
		Pageable pageRequest = createPageRequest(currPage);
		Page<FeedbackMapping> result = feedbackMappingRepository.findAll(pageRequest);
		return mapperUtil.toModelList(result.getContent(), FeedbackMappingDTO.class);
	}

	public FeedbackMappingDTO findOneMapping(Long id) {
		FeedbackMapping entity = feedbackMappingRepository.findOne(id);
		return mapperUtil.toModel(entity, FeedbackMappingDTO.class);
	}

	public SearchResult<FeedbackMappingDTO> findMappingBySearchCrieria(SearchCriteria searchCriteria) {
		SearchResult<FeedbackMappingDTO> result = new SearchResult<FeedbackMappingDTO>();
		log.debug("search Criteria - "+searchCriteria.getSiteId()+" - "+searchCriteria.getBlock()+" - "+searchCriteria.getFloor());
		if(searchCriteria != null) {
			User user = userRepository.findOne(searchCriteria.getUserId());
			Employee employee = user.getEmployee();

			//----
            Pageable pageRequest = null;
            if(!StringUtils.isEmpty(searchCriteria.getColumnName())){
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" +sort);
                pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);

            }else{
                pageRequest = createPageRequest(searchCriteria.getCurrPage());
            }


			//Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
			Page<FeedbackMapping> page = null;
			List<FeedbackMapping> allFeedbackList = new ArrayList<FeedbackMapping>();
			List<FeedbackMappingDTO> transactions = null;
			if(!searchCriteria.isFindAll()) {
				if(StringUtils.isNotEmpty(searchCriteria.getZone())) {
					page = feedbackMappingRepository.findByLocation(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone(), pageRequest);
				}else if(searchCriteria.getProjectId() > 0 && searchCriteria.getSiteId() > 0) { 
					page = feedbackMappingRepository.findByClientAndSite(searchCriteria.getProjectId(), searchCriteria.getSiteId(), pageRequest);
				}
			}else {

				if(user.isAdmin()) {
					page = feedbackMappingRepository.findAll(pageRequest);

				}else {
					List<EmployeeProjectSite> projectSites = employee.getProjectSites();
		        		if(CollectionUtils.isNotEmpty(projectSites)) {
		        			List<Long> siteIds = new ArrayList<Long>();
		        			for(EmployeeProjectSite projSite : projectSites) {
		        				siteIds.add(projSite.getSite().getId());
		        			}
		        			page = feedbackMappingRepository.findBySites(siteIds, pageRequest);
		        		}
				}

			}
			if(page != null) {
				log.debug("Size of page" +page.getSize());
				allFeedbackList.addAll(page.getContent());
				if(transactions ==  null) { 
					transactions = new ArrayList<FeedbackMappingDTO>();
				}
				for(FeedbackMapping feedbackMapping : allFeedbackList) {
					log.debug("Feedback mapping list" +feedbackMapping);
					transactions.add(mapperUtil.toModel(feedbackMapping, FeedbackMappingDTO.class));
        		}
//				transitems = mapperUtil.toModelList(page.getContent(), FeedbackMappingDTO.class);
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResultForMapping(searchCriteria, page, transactions, result);
				}
			}
		}
		return result;
	}

    public String getFeedbackQuestionImage(long feedbackQuestionsId, String imageId) {
        return fileUploadHelper.readQuestionImageFile(feedbackQuestionsId, imageId);
    }

	private void buildSearchResultForMapping(SearchCriteria searchCriteria, Page<FeedbackMapping> page, List<FeedbackMappingDTO> transactions, SearchResult<FeedbackMappingDTO> result) {
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
}
