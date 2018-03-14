package com.ts.app.service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TimeZone;

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
import com.ts.app.domain.FeedbackAnswerType;
import com.ts.app.domain.FeedbackMapping;
import com.ts.app.domain.FeedbackTransaction;
import com.ts.app.domain.FeedbackTransactionResult;
import com.ts.app.repository.FeedbackMappingRepository;
import com.ts.app.repository.FeedbackTransactionRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.FeedbackQuestionRating;
import com.ts.app.web.rest.dto.FeedbackReportResult;
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
	private FeedbackMappingRepository feedbackMappingRepository;

	@Inject
	private ProjectRepository projectRepository;

	@Inject
	private SiteRepository siteRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	public FeedbackTransactionDTO saveFeebdackInformation(FeedbackTransactionDTO feedbackTransDto) {
		FeedbackTransaction feedbackTrans = mapperUtil.toEntity(feedbackTransDto, FeedbackTransaction.class);
		feedbackTrans.setId(0);
		feedbackTrans.setResults(null);
		List<FeedbackTransactionResultDTO> itemDtos = feedbackTransDto.getResults();
		Set<FeedbackTransactionResult> items = new HashSet<FeedbackTransactionResult>();
		float rating = 0f;
		int positiveCnt = 0;
		float cumRating = 0f;
		for(FeedbackTransactionResultDTO itemDto : itemDtos) {

			FeedbackTransactionResult item = mapperUtil.toEntity(itemDto, FeedbackTransactionResult.class);
			item.setId(0);
			log.debug("answer type - "+item.getAnswerType());
			log.debug("answer type - "+item.getAnswer());
			if(item.getAnswerType().equals(FeedbackAnswerType.YESNO) && item.getAnswer().equalsIgnoreCase("Yes")) {
				cumRating += 5;
			}else if(item.getAnswerType().equals(FeedbackAnswerType.RATING)) {
				cumRating += Float.parseFloat(item.getAnswer());
			}

			item.setFeedbackTransaction(feedbackTrans);
			items.add(item);
		}
		rating = (cumRating / items.size()) * 5; //calculate the overall rating.
		feedbackTrans.setRating(rating);
		feedbackTrans.setResults(items);
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

	public FeedbackReportResult generateReport(SearchCriteria searchCriteria) {
		FeedbackReportResult reportResult = new FeedbackReportResult();
		if(searchCriteria != null) {
			Date checkInDate = searchCriteria.getCheckInDateTimeFrom();
			Calendar checkInDateFrom = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
	        	checkInDateFrom.setTime(checkInDate);

	        	checkInDateFrom.set(Calendar.HOUR_OF_DAY, 0);
	        	checkInDateFrom.set(Calendar.MINUTE,0);
	        	checkInDateFrom.set(Calendar.SECOND,0);
	        	java.sql.Date fromDt =  DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(checkInDateFrom));
	        	ZonedDateTime fromTime = fromDt.toLocalDate().atStartOfDay(ZoneId.of("Asia/Kolkata"));
	        	//String fromDt = DateUtil.formatUTCToIST(checkInDateFrom);
	        	Calendar checkInDateTo = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
	        	if(searchCriteria.getCheckInDateTimeTo() != null) {
	        		checkInDateTo.setTime(searchCriteria.getCheckInDateTimeTo());
	        	}else {
	        		checkInDateTo.setTime(checkInDate);
	        	}

	        	checkInDateTo.set(Calendar.HOUR_OF_DAY, 23);
	        	checkInDateTo.set(Calendar.MINUTE,59);
	        	checkInDateTo.set(Calendar.SECOND,0);
	        	java.sql.Date toDt = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(checkInDateTo));
	        	ZonedDateTime toTime = toDt.toLocalDate().atStartOfDay(ZoneId.of("Asia/Kolkata"));
	        	toTime = toTime.withHour(23);
	        	toTime = toTime.withMinute(59);
	        	toTime = toTime.withSecond(59);
			if(searchCriteria.getProjectId() > 0) {
				FeedbackMapping feedbackMapping = feedbackMappingRepository.findOneByLocation(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone());
				if(feedbackMapping != null) {
					long feedbackCount = feedbackTransactionRepository.getFeedbackCount(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone(), fromTime, toTime);
					Float overallRating = feedbackTransactionRepository.getFeedbackOverallRating(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone(), fromTime, toTime);
					reportResult.setFeedbackCount(feedbackCount);
					reportResult.setOverallRating(overallRating == null ? 0 : overallRating);
					reportResult.setFeedbackName(feedbackMapping.getFeedback().getName());
					reportResult.setSiteId(searchCriteria.getSiteId());
					reportResult.setSiteName(searchCriteria.getSiteName());
					reportResult.setProjectId(searchCriteria.getProjectId());
					reportResult.setProjectName(searchCriteria.getProjectName());
					reportResult.setBlock(searchCriteria.getBlock());
					reportResult.setFloor(searchCriteria.getFloor());
					reportResult.setZone(searchCriteria.getZone());
					List<Object[]> questionRatings = feedbackTransactionRepository.getFeedbackAnswersCountForYesNo(feedbackMapping.getFeedback().getId(), fromTime, toTime);
					List<FeedbackQuestionRating> qratings = new ArrayList<FeedbackQuestionRating>();
					if(CollectionUtils.isNotEmpty(questionRatings)) {
						for(Object[] row : questionRatings) {
							FeedbackQuestionRating qrating = new FeedbackQuestionRating();
							qrating.setQuestion(String.valueOf(row[0]));
							if(row[1] != null && ((String)row[1]).equalsIgnoreCase("Yes")) {
								qrating.setYesCount((Long)row[2]);
							}else {
								qrating.setNoCount((Long)row[2]);
							}
							qratings.add(qrating);
						}
					}
					questionRatings = feedbackTransactionRepository.getFeedbackAnswersCountForRating(feedbackMapping.getFeedback().getId(), fromTime, toTime);
					if(CollectionUtils.isNotEmpty(questionRatings)) {
						for(Object[] row : questionRatings) {
							FeedbackQuestionRating qrating = new FeedbackQuestionRating();
							qrating.setQuestion(String.valueOf(row[0]));
							if(row[2] != null) {
								qrating.setRating((double)row[2]);
							}
							qratings.add(qrating);
						}
					}
					reportResult.setQuestionRatings(qratings);

				}
			}
		}
		return reportResult;


	}


}
