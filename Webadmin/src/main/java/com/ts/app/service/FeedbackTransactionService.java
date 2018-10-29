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
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Employee;
import com.ts.app.domain.FeedbackAnswerType;
import com.ts.app.domain.FeedbackMapping;
import com.ts.app.domain.FeedbackTransaction;
import com.ts.app.domain.FeedbackTransactionResult;
import com.ts.app.domain.Location;
import com.ts.app.domain.Project;
import com.ts.app.domain.Setting;
import com.ts.app.domain.User;
import com.ts.app.repository.FeedbackMappingRepository;
import com.ts.app.repository.FeedbackTransactionRepository;
import com.ts.app.repository.LocationRepository;
import com.ts.app.repository.ManufacturerRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SettingsRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.ReportUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ExportResult;
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
	private ManufacturerRepository siteRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private MailService mailService;

	@Inject
	private TicketManagementService ticketManagementService;

	@Inject
	private Environment env;
	
	@Inject
	private UserRepository userRepository;

	@Inject
	private ExportUtil exportUtil;

    @Inject
    private ReportUtil reportUtil;
    
    @Inject
    private LocationRepository locationRepository;

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

				    if(StringUtils.isNotEmpty(item.getScoreType()) && (item.getScoreType().equalsIgnoreCase("yes:1"))){
				        log.debug("answer score type yes:1");
	                    cumRating += 5;
	                }else{
	                		feedbackAlertItems.add(item.getQuestion() + " - " + item.getAnswer());
	                    log.debug("answer score type yes:0");
	                }
				}else if(item.getAnswerType().equals(FeedbackAnswerType.YESNO) && item.getAnswer().equalsIgnoreCase("false")){
	                log.debug("answer score type no");
	                if(StringUtils.isNotEmpty(item.getScoreType()) && (item.getScoreType().equalsIgnoreCase("no:1"))){
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
			

		}else {
			rating = 5;
		}
		sendFeedbackNotification(feedbackTransDto, feedbackAlertItems);	
		feedbackTrans.setRating(rating);
		feedbackTrans.setResults(items);
		Pageable pageRequest = createPageRequest(1,1);
		Page<FeedbackMapping> feedbackMappingPage = feedbackMappingRepository.findOneByLocation(feedbackTransDto.getFeedbackId(), feedbackTransDto.getSiteId(), feedbackTransDto.getBlock(), feedbackTransDto.getFloor(), feedbackTransDto.getZone(), pageRequest);
        List<FeedbackMapping> fbMappings = feedbackMappingPage.getContent();
		feedbackTrans.setFeedback(fbMappings.get(0));
		feedbackTrans = feedbackTransactionRepository.save(feedbackTrans);
        if(log.isDebugEnabled()) {
        		log.debug("Rating received for this feedback - "+ rating);
        }
        if(rating < 5 ) { //create a ticket
        		TicketDTO ticketDTO = new TicketDTO();
        		ticketDTO.setUserId(feedbackTransDto.getUserId());
        		StringBuilder title = new StringBuilder();
        		title.append("Feedback received for ");
        		title.append(feedbackTransDto.getSiteName());
        		title.append(" - " +feedbackTransDto.getBlock());
        		title.append("-" + feedbackTransDto.getFloor());
        		title.append("-" + feedbackTransDto.getZone());
        		if(StringUtils.isNotBlank(feedbackTransDto.getReviewerName())) {
        			title.append(" given by " + feedbackTransDto.getReviewerName());
        			title.append(" - " + feedbackTransDto.getReviewerCode());
        		}else if(StringUtils.isNotBlank(feedbackTransDto.getReviewerCode())) {
        			title.append(" given by " + feedbackTransDto.getReviewerCode());
        		}
        		
        		
        		ticketDTO.setTitle(title.toString());
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
	
	private void sendFeedbackNotification(FeedbackTransactionDTO feedbackTransDto,List<String> feedbackAlertItems) {
		//send notifications
		Setting feedbackAlertSetting = null;
		Setting feedbackEmails = null;
		String alertEmailIds = "";
		List<Setting> settings = null;
		if(feedbackTransDto.getSiteId() > 0) {
			settings = settingsRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_FEEDBACK, feedbackTransDto.getSiteId());
			if(CollectionUtils.isNotEmpty(settings)) {
				feedbackAlertSetting = settings.get(0);
			}
			settings = settingsRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_FEEDBACK_EMAILS, feedbackTransDto.getSiteId());
			if(CollectionUtils.isNotEmpty(settings)) {
				feedbackEmails = settings.get(0);
			}
			if(feedbackEmails != null) {
				alertEmailIds = feedbackEmails.getSettingValue();
			}
		}else if(feedbackTransDto.getProjectId() > 0) {
			settings = settingsRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_OVERDUE, feedbackTransDto.getProjectId());
			if(CollectionUtils.isNotEmpty(settings)) {
				feedbackAlertSetting = settings.get(0);
			}
			settings = settingsRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_OVERDUE_EMAILS, feedbackTransDto.getProjectId());
			if(CollectionUtils.isNotEmpty(settings)) {
				feedbackEmails = settings.get(0);
			}
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
			StringBuilder givenBy = new StringBuilder();
       		if(StringUtils.isNotBlank(feedbackTransDto.getReviewerName())) {
       			givenBy.append(feedbackTransDto.getReviewerName());
       			givenBy.append(" - " + feedbackTransDto.getReviewerCode());
        		}else if(StringUtils.isNotBlank(feedbackTransDto.getReviewerCode())) {
        			givenBy.append(feedbackTransDto.getReviewerCode());
        		}
       		StringBuilder remarks = new StringBuilder();
       		if(StringUtils.isNotBlank(feedbackTransDto.getRemarks())) {
       			remarks.append(feedbackTransDto.getRemarks());
       		}
			String feedbackReportUrl = env.getProperty("reports.feedback-report.url");
			String feedbackUrl = feedbackReportUrl+"/"+feedbackTransDto.getProjectId()+"/"+feedbackTransDto.getSiteId()+"/"+feedbackTransDto.getBlock()+"/"+feedbackTransDto.getFloor()+"/"+feedbackTransDto.getZone();
			mailService.sendFeedbackAlert(alertEmailIds, feedbackTransDto.getZone(), feedbackLocation.toString(), givenBy.toString(), remarks.toString(), new Date(), feedbackAlertItems, feedbackUrl);
		}	
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

		    //----
            Pageable pageRequest = null;
            if(!StringUtils.isEmpty(searchCriteria.getColumnName())){
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" +sort);
                pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);

            }else{
            		if(searchCriteria.isReport() || searchCriteria.isFindAll()) {
            			pageRequest = createPageRequest(searchCriteria.getCurrPage(), true);
            		}else {
            			pageRequest = createPageRequest(searchCriteria.getCurrPage());
            		}
            }

			Calendar startCal = Calendar.getInstance();

			if (searchCriteria.getCheckInDateTimeFrom() != null) {
				startCal.setTime(searchCriteria.getCheckInDateTimeFrom());
			}
			startCal.set(Calendar.HOUR_OF_DAY, 0);
			startCal.set(Calendar.MINUTE, 0);
			startCal.set(Calendar.SECOND, 0);
			searchCriteria.setCheckInDateTimeFrom(startCal.getTime());
			Calendar endCal = Calendar.getInstance();
			if (searchCriteria.getCheckInDateTimeTo() != null) {
				endCal.setTime(searchCriteria.getCheckInDateTimeTo());
			}
			endCal.set(Calendar.HOUR_OF_DAY, 23);
			endCal.set(Calendar.MINUTE, 59);
			endCal.set(Calendar.SECOND, 0);
			searchCriteria.setCheckInDateTimeTo(endCal.getTime());            
	        	java.sql.Date fromDt = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(startCal));
	        	ZonedDateTime fromTime = fromDt.toLocalDate().atStartOfDay(ZoneId.of("Asia/Kolkata"));
	        	fromTime = fromTime.withHour(0);
	        	fromTime = fromTime.withMinute(0);
	        	fromTime = fromTime.withSecond(0);
	        	java.sql.Date toDt = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(endCal));
	        	ZonedDateTime toTime = toDt.toLocalDate().atStartOfDay(ZoneId.of("Asia/Kolkata"));
	        	toTime = toTime.withHour(23);
	        	toTime = toTime.withMinute(59);
	        	toTime = toTime.withSecond(59);

			Page<FeedbackTransaction> page = null;
			List<FeedbackTransactionDTO> transitems = null;
			if(!searchCriteria.isFindAll()) {
				if(StringUtils.isNotEmpty(searchCriteria.getZone())) {
					page = feedbackTransactionRepository.findByLocation(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone(), fromTime, toTime, pageRequest);
				}else if(StringUtils.isNotEmpty(searchCriteria.getFloor())) {
					page = feedbackTransactionRepository.findByFloor(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), fromTime, toTime, pageRequest);
				}else if(StringUtils.isNotEmpty(searchCriteria.getBlock())) {
					page = feedbackTransactionRepository.findByBlock(searchCriteria.getSiteId(), searchCriteria.getBlock(), fromTime, toTime, pageRequest);
				}else if(searchCriteria.getSiteId() > 0) {
					page = feedbackTransactionRepository.findBySite(searchCriteria.getSiteId(), fromTime,toTime, pageRequest);
				}else if(searchCriteria.getProjectId() > 0) {
					page = feedbackTransactionRepository.findByProject(searchCriteria.getProjectId(), fromTime, toTime, pageRequest);
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
	        ZonedDateTime weeklyFromDate = fromTime;
	        	ZonedDateTime weeklyToDate = toTime;
	        if(searchCriteria.getCheckInDateTimeFrom() == null && searchCriteria.getCheckInDateTimeTo() == null) {
				DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSSSSS");
		        Date date = new Date();
		        String todate = dateFormat.format(date);
		        String pattern = "yyyy-MM-dd HH:mm:ss.SSSSSS";
		        DateTimeFormatter parser = DateTimeFormatter.ofPattern(pattern).withZone(ZoneId.systemDefault());
		        weeklyToDate = ZonedDateTime.parse(todate, parser);
		        Calendar cal = Calendar.getInstance();
		        cal.add(Calendar.DATE, -7);
		        Date todate1 = cal.getTime();
		        String fromdate = dateFormat.format(todate1);
		        weeklyFromDate = ZonedDateTime.parse(fromdate, parser);
	        }
		        // end
			if(searchCriteria.getProjectId() > 0 && searchCriteria.getSiteId() > 0) {
				log.debug("***************"+searchCriteria.getSiteId()+"\t block: "+ searchCriteria.getBlock()+"\t floor : "+ searchCriteria.getFloor()+"\t zone : " +searchCriteria.getZone()+"fromTime: \t"+fromTime+"toTime \t"+toTime);


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

					// weekly
					List<Object[]> weeklyZone = feedbackTransactionRepository.getWeeklyZone(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone(),weeklyFromDate,weeklyToDate);
					List<Object[]> weeklySite = null;
					if(StringUtils.isEmpty(searchCriteria.getZone()))  {
						weeklySite = feedbackTransactionRepository.getWeeklySite(searchCriteria.getSiteId(),weeklyFromDate,weeklyToDate);
					}
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
					
					List<Location> locs = locationRepository.findBySite(searchCriteria.getSiteId());
					Map<String, FeedbackQuestionRating> qratings = new HashMap<String,FeedbackQuestionRating>();
					
					String block = searchCriteria.getBlock();
					String floor = searchCriteria.getFloor();
					String zone = searchCriteria.getZone();
					
					if(CollectionUtils.isNotEmpty(locs)) {
						for(Location loc : locs) {
							boolean locMatch = false;
							if(StringUtils.isNotBlank(block) 
									&& StringUtils.isNotBlank(floor) 
									&& StringUtils.isNotBlank(zone) ) {
								if(block.equalsIgnoreCase(loc.getBlock())
										&& floor.equalsIgnoreCase(loc.getFloor())
										&& zone.equalsIgnoreCase(loc.getZone()) ) {
									locMatch = true;
								}
							}else {
								locMatch = true;
							}
							if(locMatch) {
								searchCriteria.setBlock(loc.getBlock());
								searchCriteria.setFloor(loc.getFloor());
								searchCriteria.setZone(loc.getZone());
								FeedbackMapping feedbackMapping = getFeedbackMappingByLocation(searchCriteria);
								if(log.isDebugEnabled()) {
									log.debug("Location - Block- " +searchCriteria.getBlock() + ", Floor -" + searchCriteria.getFloor() + ", Zone-" + searchCriteria.getZone());
									log.debug("FeedbackMapping - " + (feedbackMapping != null ? feedbackMapping.getId() : null ));
								}
								if(feedbackMapping != null) {
								
									List<Object[]> questionRatings = getQuestionRatings(searchCriteria,feedbackMapping,fromTime,toTime,weeklyFromDate,weeklyToDate);
									log.debug("Question ratings - " + (questionRatings != null ? questionRatings.size() : null ));
									if(CollectionUtils.isNotEmpty(questionRatings)) {
										for(Object[] row : questionRatings) {
											FeedbackQuestionRating qrating = null;
											String question = String.valueOf(row[0]);
											if(qratings.containsKey(question)) {
												qrating = qratings.get(question);
											}else {
												qrating = new FeedbackQuestionRating();
											}
											qrating.setLocation(getLocationFromSearchCriteria(searchCriteria));
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
									log.debug("Question ratings - " + (questionRatings != null ? questionRatings.size() : null ));
									if(CollectionUtils.isNotEmpty(questionRatings)) {
										for(Object[] row : questionRatings) {
											FeedbackQuestionRating qrating = null;
											String question = String.valueOf(row[0]);
											if(qratings.containsKey(question)) {
												qrating = qratings.get(question);
											}else {
												qrating = new FeedbackQuestionRating();
											}
											qrating.setLocation(getLocationFromSearchCriteria(searchCriteria));
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
								}
							}
						}
					}
					List<FeedbackQuestionRating> asList = new ArrayList<FeedbackQuestionRating>();
					asList.addAll(qratings.values());
					reportResult.setQuestionRatings(asList);

				//}
			}else if(searchCriteria.getProjectId() > 0) {
				long feedbackCount = getFeedbackCount(searchCriteria,fromTime,toTime,weeklyFromDate,weeklyToDate);
				Float overallRating = getOverallRating(searchCriteria,fromTime,toTime,weeklyFromDate,weeklyToDate);
				log.debug("feedback count : \t"+ feedbackCount);
				log.debug("overallRating: \t"+overallRating);
				reportResult.setFeedbackCount(feedbackCount);
				reportResult.setOverallRating(overallRating == null ? "0" : df.format(overallRating));
				//reportResult.setFeedbackName(feedbackMapping.getFeedback().getName());
				//reportResult.setSiteId(searchCriteria.getSiteId());
				//reportResult.setSiteName(searchCriteria.getSiteName());
				reportResult.setProjectId(searchCriteria.getProjectId());
				reportResult.setProjectName(searchCriteria.getProjectName());
				//reportResult.setBlock(searchCriteria.getBlock());
				//reportResult.setFloor(searchCriteria.getFloor());
				//reportResult.setZone(searchCriteria.getZone());

				// weekly
				List<Object[]> weeklySite = feedbackTransactionRepository.getSitewiseAverageRating(searchCriteria.getProjectId(),weeklyFromDate,weeklyToDate);
				List<Object[]> weeklyZone = feedbackTransactionRepository.getWeeklyZone(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone(),weeklyFromDate,weeklyToDate);

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
			}
		}
		return reportResult;


	}
	
	private String getLocationFromSearchCriteria(SearchCriteria searchCriteria) {
		StringBuilder sb = new StringBuilder();
		sb.append(searchCriteria.getSiteName());
		sb.append("_");
		sb.append(searchCriteria.getBlock());
		sb.append("_");
		sb.append(searchCriteria.getFloor());
		sb.append("_");
		sb.append(searchCriteria.getZone());
		return sb.toString();
	}

	private List<Object[]> getquestionRatings(SearchCriteria searchCriteria, FeedbackMapping feedbackMapping,
			ZonedDateTime fromTime, ZonedDateTime toTime, ZonedDateTime weeklyFromDate, ZonedDateTime weeklyToDate) {
		// TODO Auto-generated method stub
		List<Object[]> questionsRating = null;

		if(StringUtils.isNotEmpty(searchCriteria.getBlock()) && StringUtils.isNotEmpty(searchCriteria.getZone())){
			questionsRating = feedbackTransactionRepository.getFeedbackAnswersCountForRating(feedbackMapping.getId(), weeklyFromDate, weeklyToDate);
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
			questionRatings = feedbackTransactionRepository.getFeedbackAnswersCountForYesNo(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone(), feedbackMapping.getId(), weeklyFromDate, weeklyToDate);
		} else {
			questionRatings = feedbackTransactionRepository.getWeeklyFeedbackAnswersCountForYesNo(searchCriteria.getSiteId(), weeklyFromDate, weeklyToDate);
		}

		return questionRatings;
	}

	private Float getOverallRating(SearchCriteria searchCriteria, ZonedDateTime fromTime, ZonedDateTime toTime,
			ZonedDateTime weeklyFromDate, ZonedDateTime weeklyToDate) {
		// TODO Auto-generated method stub
		Float overallRating = 0f;
		if(StringUtils.isNotEmpty(searchCriteria.getBlock()) && StringUtils.isNotEmpty(searchCriteria.getZone())){
			overallRating = feedbackTransactionRepository.getFeedbackOverallRating(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone(), weeklyFromDate, weeklyToDate);
		} else if(searchCriteria.getSiteId() > 0){
			overallRating = feedbackTransactionRepository.getWeeklyOverallRating(searchCriteria.getSiteId(),weeklyFromDate,weeklyToDate);
		} else if(searchCriteria.getProjectId() > 0){
			overallRating = feedbackTransactionRepository.getWeeklyOverallRatingByProject(searchCriteria.getProjectId(),weeklyFromDate,weeklyToDate);
		} 
		return overallRating;
	}

	private long getFeedbackCount(SearchCriteria searchCriteria, ZonedDateTime fromTime, ZonedDateTime toTime,
			ZonedDateTime weeklyFromDate, ZonedDateTime weeklyToDate) {
		// TODO Auto-generated method stub
		long feedbackCount=0;
		if(StringUtils.isNotEmpty(searchCriteria.getBlock()) && StringUtils.isNotEmpty(searchCriteria.getZone())){
			feedbackCount = feedbackTransactionRepository.getFeedbackCount(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone(), weeklyFromDate, weeklyToDate);
		} else if(searchCriteria.getSiteId() > 0){
			feedbackCount = feedbackTransactionRepository.getWeeklyFeedbackCount(searchCriteria.getSiteId(),weeklyFromDate,weeklyToDate);
		} else if(searchCriteria.getProjectId() > 0){
			feedbackCount = feedbackTransactionRepository.getWeeklyFeedbackCountByProject(searchCriteria.getProjectId(),weeklyFromDate,weeklyToDate);
		} 

		return feedbackCount;
	}

	private FeedbackMapping getFeedbackMappingByLocation(SearchCriteria searchCriteria) {
		// TODO Auto-generated method stub
		FeedbackMapping feedbackMapping=null;
		/*if(StringUtils.isNotEmpty(searchCriteria.getBlock()) && StringUtils.isNotEmpty(searchCriteria.getZone())){*/
			log.debug("***************zone***********");
			List<FeedbackMapping> feedbackMappings = feedbackMappingRepository.findOneByLocation(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone());
			if(CollectionUtils.isNotEmpty(feedbackMappings)) {
				feedbackMapping = feedbackMappings.get(0);
			}
		/*} else{
			log.debug("***************feedback site***********");
			feedbackMapping = feedbackMappingRepository.findSiteByLocation(searchCriteria.getSiteId());
		}*/
		return feedbackMapping;
	}

    public ExportResult generateReport(List<FeedbackTransactionDTO> transactions, SearchCriteria criteria) {
    		User user = userRepository.findOne(criteria.getUserId());
		Employee emp = null;
		if(user != null) {
			emp = user.getEmployee();
		}
		long projId = criteria.getProjectId();
		Project proj = null;
		if(projId > 0) {
			proj = projectRepository.findOne(projId);
			criteria.setProjectName(proj.getName());
		}
        return reportUtil.generateFeedbackReports(transactions, user, emp, null, criteria);
    }


	public ExportResult getExportStatus(String fileId) {
		ExportResult er = new ExportResult();

		fileId += ".xlsx";
        //log.debug("FILE ID INSIDE OF getExportStatus CALL ***********"+fileId);

		if(!StringUtils.isEmpty(fileId)) {
			String status = exportUtil.getExportStatus(fileId);
			er.setFile(fileId);
			er.setStatus(status);
		}
		return er;
	}

	public byte[] getExportFile(String fileName) {
		return exportUtil.readFeedbackExportFile(null,fileName);
	}

}
