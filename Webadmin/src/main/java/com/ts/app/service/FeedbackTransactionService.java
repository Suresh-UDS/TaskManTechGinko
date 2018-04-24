package com.ts.app.service;

import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;

import javax.inject.Inject;
import javax.transaction.Transactional;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.FeedbackAnswerType;
import com.ts.app.domain.FeedbackMapping;
import com.ts.app.domain.FeedbackTransaction;
import com.ts.app.domain.FeedbackTransactionResult;
import com.ts.app.domain.Setting;
import com.ts.app.repository.FeedbackMappingRepository;
import com.ts.app.repository.FeedbackTransactionRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SettingsRepository;
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
import com.ts.app.web.rest.dto.TicketDTO;
import com.ts.app.web.rest.dto.WeeklySite;
import com.ts.app.web.rest.dto.WeeklyZone;


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
	private SettingsRepository settingsRepository;

	@Inject
	private SiteRepository siteRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;
	
	@Inject
	private MailService mailService;
	
	@Inject
	private TicketManagementService ticketManagementService;
	
	@Inject
	private Environment env;

	public FeedbackTransactionDTO saveFeebdackInformation(FeedbackTransactionDTO feedbackTransDto) {
	    log.debug("user code- "+feedbackTransDto.getReviewerCode());
		FeedbackTransaction feedbackTrans = mapperUtil.toEntity(feedbackTransDto, FeedbackTransaction.class);
		feedbackTrans.setId(0);
		feedbackTrans.setResults(null);
		List<FeedbackTransactionResultDTO> itemDtos = feedbackTransDto.getResults();
		Set<FeedbackTransactionResult> items = new HashSet<FeedbackTransactionResult>();
		float rating = 0;
		int positiveCnt = 0;
		float cumRating = 0f;
		List<String> feedbackAlertItems = new ArrayList<String>();
		if(!feedbackTransDto.isOverallFeedback()) {
			for(FeedbackTransactionResultDTO itemDto : itemDtos) {
	
				FeedbackTransactionResult item = mapperUtil.toEntity(itemDto, FeedbackTransactionResult.class);
				//item.setAnswerType(FeedbackAnswerType.fromValue(itemDto.getAnswerType()));
				item.setId(0);
				log.debug("answer type - "+item.getAnswerType());
				log.debug("answer type - "+item.getAnswer());
				log.debug("score type - "+item.getScoreType());
				if(item.getAnswerType().equals(FeedbackAnswerType.YESNO) && item.getAnswer().equalsIgnoreCase("true")) {
				    log.debug("answer type yes ");
	
				    if(StringUtils.isNotEmpty(item.getScoreType()) && (item.getScoreType().equalsIgnoreCase("yes:1") || item.getScoreType().equalsIgnoreCase("no:0"))){
				        log.debug("answer score type yes:1");
	                    cumRating += 5;
	                }else{
	                		feedbackAlertItems.add(item.getQuestion() + " - " + item.getAnswer());
	                    log.debug("answer score type yes:0");
	                }
				}else if(item.getAnswerType().equals(FeedbackAnswerType.YESNO) && item.getAnswer().equalsIgnoreCase("false")){
	                log.debug("answer score type no");
	                if(StringUtils.isNotEmpty(item.getScoreType()) && (item.getScoreType().equalsIgnoreCase("no:1") || item.getScoreType().equalsIgnoreCase("yes:1"))){ 
	                    log.debug("answer score type no:1");
	                    cumRating += 5;
	                }else{
	                		feedbackAlertItems.add(item.getQuestion()  + " - " + item.getAnswer());
	                    log.debug("answer score type no:0");
	                }
	            }else if(item.getAnswerType().equals(FeedbackAnswerType.RATING)) {
	            		float currRating = Float.parseFloat(item.getAnswer());
	            		if(currRating < 5) {
	            			feedbackAlertItems.add(item.getQuestion()  + " - Rating - " + item.getAnswer());
	            		}
					cumRating += currRating;
				}
	
				item.setFeedbackTransaction(feedbackTrans);
				items.add(item);
			}
			rating = (cumRating / items.size()); //calculate the overall rating.
			//send notifications
			Setting feedbackAlertSetting = null;
			Setting feedbackEmails = null;
			String alertEmailIds = "";
			if(feedbackTransDto.getSiteId() > 0) {
				feedbackAlertSetting = settingsRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_FEEDBACK, feedbackTransDto.getSiteId());
				feedbackEmails = settingsRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_FEEDBACK_EMAILS, feedbackTransDto.getSiteId());
				if(feedbackEmails != null) {
					alertEmailIds = feedbackEmails.getSettingValue();
				}
			}else if(feedbackTransDto.getProjectId() > 0) {
				feedbackAlertSetting = settingsRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_OVERDUE, feedbackTransDto.getProjectId());
				feedbackEmails = settingsRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_OVERDUE_EMAILS, feedbackTransDto.getProjectId());
				if(feedbackEmails != null) {
					alertEmailIds = feedbackEmails.getSettingValue();
				}
			}
			if(feedbackAlertSetting != null && feedbackAlertSetting.getSettingValue().equalsIgnoreCase("true")) { //send escalation emails to managers and alert emails
				StringBuilder feedbackLocation = new StringBuilder();
				feedbackLocation.append(feedbackTransDto.getSiteName());
				feedbackLocation.append("-");
				feedbackLocation.append(feedbackTransDto.getBlock());
				feedbackLocation.append("-");
				feedbackLocation.append(feedbackTransDto.getFloor());
				
				String feedbackReportUrl = env.getProperty("reports.feedback-report.url");
				mailService.sendFeedbackAlert(alertEmailIds, feedbackTransDto.getZone(), feedbackLocation.toString(), new Date(), feedbackAlertItems, feedbackReportUrl);
			}
		}else {
			rating = 5;
		}
		feedbackTrans.setRating(rating);
		feedbackTrans.setResults(items);
        feedbackTrans = feedbackTransactionRepository.save(feedbackTrans);
        if(rating < 5 ) { //create a ticket
        		TicketDTO ticketDTO = new TicketDTO();
        		ticketDTO.setUserId(feedbackTransDto.getUserId());
        		ticketDTO.setTitle("Feedback received for " +feedbackTransDto.getSiteName() + " - " +feedbackTransDto.getBlock() + "-" + feedbackTransDto.getFloor() + "-" + feedbackTransDto.getZone());
        		if(CollectionUtils.isNotEmpty(feedbackAlertItems)) {
        			StringBuffer sb = new StringBuffer();
        			for(String item : feedbackAlertItems) {
        				sb.append(item +",\n");
        			}
        			sb.append("Received a rating of "+ rating);
        			ticketDTO.setDescription(sb.toString());
        		}else {
        			ticketDTO.setDescription("Received a rating of "+ rating);
        		}
        		ticketDTO.setSeverity("High");
        		ticketDTO.setSiteId(feedbackTransDto.getSiteId());
        		ticketDTO.setSiteName(feedbackTransDto.getSiteName());
        		ticketManagementService.saveTicket(ticketDTO);
        }
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
	        DecimalFormat df = new DecimalFormat("#.0");
			// Calcualte a weekly date need to modify
				DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSSSSS");
		        Date date = new Date();
		        String todate = dateFormat.format(date);
		        String pattern = "yyyy-MM-dd HH:mm:ss.SSSSSS";
		        DateTimeFormatter parser = DateTimeFormatter.ofPattern(pattern).withZone(ZoneId.systemDefault());
		        ZonedDateTime weeklyToDate = ZonedDateTime.parse(todate, parser);
		        Calendar cal = Calendar.getInstance();
		        cal.add(Calendar.DATE, -7);
		        Date todate1 = cal.getTime();
		        String fromdate = dateFormat.format(todate1);
		        ZonedDateTime weeklyFromDate = ZonedDateTime.parse(fromdate, parser);
		        // end
			if(searchCriteria.getProjectId() > 0) {
				log.debug("***************"+searchCriteria.getSiteId()+"\t block: "+ searchCriteria.getBlock()+"\t floor : "+ searchCriteria.getFloor()+"\t zone : " +searchCriteria.getZone()+"fromTime: \t"+fromTime+"toTime \t"+toTime);

				FeedbackMapping feedbackMapping = getFeedbackMappingByLocation(searchCriteria);

				//if(feedbackMapping != null) {
					long feedbackCount = getFeedbackCount(searchCriteria,fromTime,toTime,weeklyFromDate,weeklyToDate);
					Float overallRating = getOverallRating(searchCriteria,fromTime,toTime,weeklyFromDate,weeklyToDate);
					log.debug("feedback count : \t"+ feedbackCount);
					log.debug("overallRating: \t"+overallRating);
					reportResult.setFeedbackCount(feedbackCount);
					reportResult.setOverallRating(overallRating == null ? "0" : df.format(overallRating));
					//reportResult.setFeedbackName(feedbackMapping.getFeedback().getName());
					reportResult.setSiteId(searchCriteria.getSiteId());
					reportResult.setSiteName(searchCriteria.getSiteName());
					reportResult.setProjectId(searchCriteria.getProjectId());
					reportResult.setProjectName(searchCriteria.getProjectName());
					reportResult.setBlock(searchCriteria.getBlock());
					reportResult.setFloor(searchCriteria.getFloor());
					reportResult.setZone(searchCriteria.getZone());
					List<Object[]> questionRatings = getQuestionRatings(searchCriteria,feedbackMapping,fromTime,toTime,weeklyFromDate,weeklyToDate);

					// weekly
					List<Object[]> weeklySite = feedbackTransactionRepository.getWeeklySite(searchCriteria.getSiteId(),weeklyFromDate,weeklyToDate);
					List<Object[]> weeklyZone = feedbackTransactionRepository.getWeeklyZone(searchCriteria.getSiteId(), searchCriteria.getZone(),weeklyFromDate,weeklyToDate);

					List<WeeklySite> weeklySiteList = new ArrayList<WeeklySite>();
					if(CollectionUtils.isNotEmpty(weeklySite)){
						for(Object[] row: weeklySite){
							WeeklySite site= new WeeklySite();
							site.setRating((Double)row[0]);
							site.setZoneName((String)row[1]);
							weeklySiteList.add(site);
						}
					}

					List<WeeklyZone> weeklyZoneList = new ArrayList<WeeklyZone>();
					if(CollectionUtils.isNotEmpty(weeklyZone)){
						for(Object[] row: weeklyZone){
							WeeklyZone zone = new WeeklyZone();
							zone.setRating((Double)row[0]);
							//zone.setDay(Long.valueOf(String.valueOf(row[1])));
							//zone.setDate(DateUtil.convertToDateTime(String.valueOf(row[1]), ""));
							zone.setDate(String.valueOf(row[1]));
							weeklyZoneList.add(zone);
						}
					}
					reportResult.setWeeklyZone(weeklyZoneList);
					reportResult.setWeeklySite(weeklySiteList);
					// end

					Map<String, FeedbackQuestionRating> qratings = new HashMap<String,FeedbackQuestionRating>();
					if(CollectionUtils.isNotEmpty(questionRatings)) {
						for(Object[] row : questionRatings) {
							FeedbackQuestionRating qrating = null;
							String question = String.valueOf(row[0]);
							if(qratings.containsKey(question)) {
								qrating = qratings.get(question);
							}else {
								qrating = new FeedbackQuestionRating();
							}
							qrating.setQuestion(question);
							if(row[1] != null && ((String)row[1]).equalsIgnoreCase("true")) {
								qrating.setYesCount((Long)row[2]);
							}else {
								qrating.setNoCount((Long)row[2]);
							}
							qratings.put(qrating.getQuestion(), qrating);
						}
					}
					//log.debug("feedbackMapping.getFeedback().getId(): \t"+feedbackMapping.getFeedback().getId());
					questionRatings = getquestionRatings(searchCriteria,feedbackMapping,fromTime,toTime,weeklyFromDate,weeklyToDate);
					if(CollectionUtils.isNotEmpty(questionRatings)) {
						for(Object[] row : questionRatings) {
							FeedbackQuestionRating qrating = null;
							String question = String.valueOf(row[0]);
							if(qratings.containsKey(question)) {
								qrating = qratings.get(question);
							}else {
								qrating = new FeedbackQuestionRating();
							}
							qrating.setQuestion(String.valueOf(row[0]));
							if(row[2] != null) {
								Map<String,Long> ratingsMap = null;
								if(qrating.getRating() != null ) { 
									ratingsMap = qrating.getRating();
								}else {
									ratingsMap = new HashMap<String,Long>();
								}
								ratingsMap.put(String.valueOf(row[1]), (long)row[2]);
								qrating.setRating(ratingsMap);
							}
							qratings.put(question, qrating);
						}
					}
					List<FeedbackQuestionRating> asList = new ArrayList<FeedbackQuestionRating>();
					asList.addAll(qratings.values());
					reportResult.setQuestionRatings(asList);

				//}
			}
		}
		return reportResult;


	}

	private List<Object[]> getquestionRatings(SearchCriteria searchCriteria, FeedbackMapping feedbackMapping,
			ZonedDateTime fromTime, ZonedDateTime toTime, ZonedDateTime weeklyFromDate, ZonedDateTime weeklyToDate) {
		// TODO Auto-generated method stub
		List<Object[]> questionsRating = null;

		if(StringUtils.isNotEmpty(searchCriteria.getBlock()) && StringUtils.isNotEmpty(searchCriteria.getZone())){
			questionsRating = feedbackTransactionRepository.getFeedbackAnswersCountForRating(feedbackMapping.getFeedback().getId(), weeklyFromDate, weeklyToDate);
		} else {
			questionsRating = feedbackTransactionRepository.getWeeklyFeedbackAnswersCountForRating(searchCriteria.getSiteId(), weeklyFromDate, weeklyToDate);
		}
		return questionsRating;
	}

	private List<Object[]> getQuestionRatings(SearchCriteria searchCriteria, FeedbackMapping feedbackMapping, ZonedDateTime fromTime,
			ZonedDateTime toTime, ZonedDateTime weeklyFromDate, ZonedDateTime weeklyToDate) {
		// TODO Auto-generated method stub
		List<Object[]> questionRatings = null;

		if(StringUtils.isNotEmpty(searchCriteria.getBlock()) && StringUtils.isNotEmpty(searchCriteria.getZone())){
			questionRatings = feedbackTransactionRepository.getFeedbackAnswersCountForYesNo(feedbackMapping.getFeedback().getId(), weeklyFromDate, weeklyToDate);
		} else {
			questionRatings = feedbackTransactionRepository.getWeeklyFeedbackAnswersCountForYesNo(searchCriteria.getSiteId(), weeklyFromDate, weeklyToDate);
		}

		return questionRatings;
	}

	private Float getOverallRating(SearchCriteria searchCriteria, ZonedDateTime fromTime, ZonedDateTime toTime,
			ZonedDateTime weeklyFromDate, ZonedDateTime weeklyToDate) {
		// TODO Auto-generated method stub
		Float overallRating;
		if(StringUtils.isNotEmpty(searchCriteria.getBlock()) && StringUtils.isNotEmpty(searchCriteria.getZone())){
			overallRating = feedbackTransactionRepository.getFeedbackOverallRating(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone(), weeklyFromDate, weeklyToDate);
		} else {
			overallRating = feedbackTransactionRepository.getWeeklyOverallRating(searchCriteria.getSiteId(),weeklyFromDate,weeklyToDate);
		}
		return overallRating;
	}

	private long getFeedbackCount(SearchCriteria searchCriteria, ZonedDateTime fromTime, ZonedDateTime toTime,
			ZonedDateTime weeklyFromDate, ZonedDateTime weeklyToDate) {
		// TODO Auto-generated method stub
		long feedbackCount=0;
		if(StringUtils.isNotEmpty(searchCriteria.getBlock()) && StringUtils.isNotEmpty(searchCriteria.getZone())){
			feedbackCount = feedbackTransactionRepository.getFeedbackCount(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone(), weeklyFromDate, weeklyToDate);
		} else {
			feedbackCount = feedbackTransactionRepository.getWeeklyFeedbackCount(searchCriteria.getSiteId(),weeklyFromDate,weeklyToDate);
		}

		return feedbackCount;
	}

	private FeedbackMapping getFeedbackMappingByLocation(SearchCriteria searchCriteria) {
		// TODO Auto-generated method stub
		FeedbackMapping feedbackMapping=null;
		/*if(StringUtils.isNotEmpty(searchCriteria.getBlock()) && StringUtils.isNotEmpty(searchCriteria.getZone())){*/
			log.debug("***************zone***********");
			feedbackMapping = feedbackMappingRepository.findOneByLocation(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone());
		/*} else{
			log.debug("***************feedback site***********");
			feedbackMapping = feedbackMappingRepository.findSiteByLocation(searchCriteria.getSiteId());
		}*/
		return feedbackMapping;
	}


}
