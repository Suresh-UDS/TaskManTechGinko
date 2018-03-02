package com.ts.app.service;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.transaction.Transactional;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.FeedbackTransaction;
import com.ts.app.domain.FeedbackTransactionResult;
import com.ts.app.repository.FeedbackTransactionRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.FeedbackTransactionDTO;
import com.ts.app.web.rest.dto.FeedbackTransactionResultDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;


/**
 * Service class for managing feedback transcation information.
 */
@Service
@Transactional
public class FeedbackTransactionService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(FeedbackTransactionService.class);

	@Inject
	private FeedbackTransactionRepository feedbackTransactionRepository;
	
	@Inject
	private ProjectRepository projectRepository;

	@Inject
	private SiteRepository siteRepository;
	
	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	public FeedbackTransactionDTO saveFeebdackInformation(FeedbackTransactionDTO feedbackTransDto) {
		FeedbackTransaction feedbackTrans = mapperUtil.toEntity(feedbackTransDto, FeedbackTransaction.class);
		List<FeedbackTransactionResultDTO> itemDtos = feedbackTransDto.getResults();
		List<FeedbackTransactionResult> items = new ArrayList<FeedbackTransactionResult>();
		float rating = 0f;
		int positiveCnt = 0;
		for(FeedbackTransactionResultDTO itemDto : itemDtos) {
			FeedbackTransactionResult item = mapperUtil.toEntity(itemDto, FeedbackTransactionResult.class);
			if(item.isAnswer()) {
				positiveCnt++;
			}
			item.setFeedbackTransaction(feedbackTrans);
			items.add(item);
		}
		rating = positiveCnt / items.size(); //calculate the overall rating.
		feedbackTrans.setRating(rating);
        feedbackTrans = feedbackTransactionRepository.save(feedbackTrans);
		log.debug("Created Information for FeedbackTransaction: {}", feedbackTrans);
		feedbackTransDto = mapperUtil.toModel(feedbackTrans, FeedbackTransactionDTO.class);
		return feedbackTransDto;
	}

	public List<FeedbackTransactionDTO> findAll(int currPage) {
		Pageable pageRequest = createPageRequest(currPage);
		Page<FeedbackTransaction> result = feedbackTransactionRepository.findAll(pageRequest);
		return mapperUtil.toModelList(result.getContent(), FeedbackTransactionDTO.class);
	}

	public FeedbackTransactionDTO findOne(Long id) {
		FeedbackTransaction entity = feedbackTransactionRepository.findOne(id);
		return mapperUtil.toModel(entity, FeedbackTransactionDTO.class);
	}


	public SearchResult<FeedbackTransactionDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		SearchResult<FeedbackTransactionDTO> result = new SearchResult<FeedbackTransactionDTO>();
		if(searchCriteria != null) {
			Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
			Page<FeedbackTransaction> page = null;
			List<FeedbackTransactionDTO> transitems = null;
			if(!searchCriteria.isFindAll()) {
				if(StringUtils.isNotEmpty(searchCriteria.getZone())) {
					page = feedbackTransactionRepository.findByLocation(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone(), pageRequest);
				}else if(StringUtils.isNotEmpty(searchCriteria.getFloor())) {
					page = feedbackTransactionRepository.findByFloor(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), pageRequest);
				}else if(StringUtils.isNotEmpty(searchCriteria.getBlock())) {
					page = feedbackTransactionRepository.findByBlock(searchCriteria.getSiteId(), searchCriteria.getBlock(), pageRequest);
				}else if(searchCriteria.getSiteId() > 0) {
					page = feedbackTransactionRepository.findBySite(searchCriteria.getSiteId(), pageRequest);
				}
			}else {
				page = feedbackTransactionRepository.findAll(pageRequest);
			}
			if(page != null) {
				transitems = mapperUtil.toModelList(page.getContent(), FeedbackTransactionDTO.class);
				if(CollectionUtils.isNotEmpty(transitems)) {
					buildSearchResult(searchCriteria, page, transitems,result);
				}
			}
		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<FeedbackTransaction> page, List<FeedbackTransactionDTO> transactions, SearchResult<FeedbackTransactionDTO> result) {
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
