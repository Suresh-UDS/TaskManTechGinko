package com.ts.app.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.SerializationFeature;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Attendance;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.RateCard;
import com.ts.app.domain.Setting;
import com.ts.app.domain.Ticket;
import com.ts.app.domain.User;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.RateCardRepository;
import com.ts.app.repository.SettingsRepository;
import com.ts.app.repository.ManufacturerRepository;
import com.ts.app.repository.TicketRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.AmazonS3Utils;
import com.ts.app.service.util.FileUploadHelper;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.AttendanceDTO;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.QuotationDTO;
import com.ts.app.web.rest.dto.RateCardDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;

/**
 * Service class for exposing rate card related operations.
 */
@Service
@Transactional
public class RateCardService extends AbstractService {

    @Value("${quotationService.url}")
    private String quotationSvcEndPoint;

	private final Logger log = LoggerFactory.getLogger(RateCardService.class);

	@Inject
	private RateCardRepository rateCardRepository;

	@Inject
	private ProjectRepository projectRepository;

	@Inject
	private UserRepository userRepository;

	@Inject
	private ManufacturerRepository siteRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private SettingsRepository settingRepository;

	@Inject
	private MailService mailService;

	@Inject
	private TicketRepository ticketRepository;

	@Inject
	private FileUploadHelper fileUploadHelper;

	@Inject
	private AmazonS3Utils amazonS3Utils;

	@Value("${AWS.s3-cloudfront-url}")
	private String cloudFrontUrl;

	@Value("${AWS.s3-bucketEnv}")
	private String bucketEnv;

	@Value("${AWS.s3-quotation-path}")
	private String quotationFilePath;

	public RateCardDTO createRateCardInformation(RateCardDTO rateCardDto) {
		// log.info("The admin Flag value is " +adminFlag);

        log.debug("Rate card creation");

        try{
            RestTemplate restTemplate = new RestTemplate();
            MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
            jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS,false);
            restTemplate.getMessageConverters().add(jsonHttpMessageConverter);

            MultiValueMap<String, String> headers =new LinkedMultiValueMap<String, String>();
            Map<String, String> map=  new HashMap<String, String>();
            map.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            headers.setAll(map);

            JSONObject request = new JSONObject();
            request.put("projectId", rateCardDto.getProjectId());
            request.put("title",rateCardDto.getName());
            request.put("name",rateCardDto.getName());
            request.put("type",rateCardDto.getType());
            request.put("cost",rateCardDto.getCost());
            request.put("uom", rateCardDto.getUom());

            HttpEntity<?> requestEntity = new HttpEntity<>(request.toString(),headers);
            log.debug("Request entity rate card service"+requestEntity);
            log.debug("Rate card service end point"+quotationSvcEndPoint);
            ResponseEntity<?> response = restTemplate.postForEntity(quotationSvcEndPoint+"/rateCard/create", requestEntity, String.class);
            log.debug("Response freom push service "+ response.getStatusCode());
            log.debug("response from push service"+response.getBody());

        }catch(Exception e) {
            log.error("Error while calling location service ", e);
            e.printStackTrace();
        }
//		RateCard rateCard = mapperUtil.toEntity(rateCardDto, RateCard.class);
//		Project proj = projectRepository.findOne(rateCardDto.getProjectId());
//		rateCard.setProject(proj);
//		if(rateCardDto.getSiteId() > 0) {
//			Site site = siteRepository.findOne(rateCardDto.getSiteId());
//			rateCard.setSite(site);
//		}else {
//			rateCard.setSite(null);
//		}
//		rateCard.setActive(rateCard.ACTIVE_YES);
//
//		rateCard = rateCardRepository.save(rateCard);
//		log.debug("Created Information for RateCard: {}", rateCard);
//		rateCardDto = mapperUtil.toModel(rateCard, RateCardDTO.class);
		return rateCardDto;
	}

	public void updateRateCard(RateCardDTO rateCard) {
//		log.debug("Inside Update");
//		RateCard rateCardUpdate = rateCardRepository.findOne(rateCard.getId());
//		mapToEntity(rateCard, rateCardUpdate);
//		rateCardRepository.saveAndFlush(rateCardUpdate);

	}

	private void mapToEntity(RateCardDTO rateCardDTO, RateCard rateCard) {
		rateCard.setName(rateCardDTO.getName());
		rateCard.setType(rateCardDTO.getType());
		rateCard.setUom(rateCardDTO.getUom());
		rateCard.setAmount(rateCardDTO.getCost());
	}

	public void deleteRateCard(RateCardDTO rateCardDto) {
		log.debug("Inside Delete");

//		RateCard rateCardUpdate = rateCardRepository.findOne(id);
//		rateCardUpdate.setActive(RateCard.ACTIVE_NO);
//		rateCardUpdate.setDeleted(true);
//		rateCardRepository.save(rateCardUpdate);

        try {
            RestTemplate restTemplate = new RestTemplate();
            MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
            jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
            restTemplate.getMessageConverters().add(jsonHttpMessageConverter);

            MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
            Map<String, String> map = new HashMap<String, String>();
            map.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            Map<String,Object> paramMap = new HashMap<String,Object>();
            paramMap.put("id",rateCardDto.getId());


            JSONObject request = new JSONObject();
            request.put("id",rateCardDto.getId());

            HttpEntity<?> requestEntity = new HttpEntity<>(request.toString(),headers);
            log.debug("Rate card service end point"+quotationSvcEndPoint);
            ResponseEntity<?> response = restTemplate.postForEntity(quotationSvcEndPoint+"/rateCard",requestEntity, String.class);
            log.debug("Response freom push service "+ response.getStatusCode());
            log.debug("response from push service"+response.getBody());
//            rateCardDTOList = (List<RateCardDTO>) response.getBody();
//            rateCardDetails = response.getBody();

        }catch(Exception e) {
            log.error("Error while calling location service ", e);
            e.printStackTrace();
        }
	}

	public Object findAll() {

        log.debug("Rate card creation");
        List<RateCardDTO> rateCardDTOList = null;
        Object rateCardDetails = "";

        try {
            RestTemplate restTemplate = new RestTemplate();
            MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
            jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
            restTemplate.getMessageConverters().add(jsonHttpMessageConverter);

            MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
            Map<String, String> map = new HashMap<String, String>();
            map.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            HttpEntity<?> requestEntity = new HttpEntity<>(headers);
            log.debug("Rate card service end point"+quotationSvcEndPoint);
            ResponseEntity<?> response = restTemplate.getForEntity(quotationSvcEndPoint+"/rateCard", String.class);
            log.debug("Response freom push service "+ response.getStatusCode());
            log.debug("response from push service"+response.getBody());
//            rateCardDTOList = (List<RateCardDTO>) response.getBody();
            rateCardDetails = response.getBody();

        }catch(Exception e) {
            log.error("Error while calling location service ", e);
            e.printStackTrace();
        }

//		List<RateCard> entities = new ArrayList<RateCard>();
//		entities = rateCardRepository.findAll();
//		return mapperUtil.toModelList(entities, RateCardDTO.class);
        return  rateCardDetails;
	}

	public Object findAllTypes() {

        log.debug("Find all rate card types");
        List<RateCardDTO> rateCardDTOList = null;
        Object rateCardDetails = "";

        try {
            RestTemplate restTemplate = new RestTemplate();
            MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
            jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
            restTemplate.getMessageConverters().add(jsonHttpMessageConverter);

            MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
            Map<String, String> map = new HashMap<String, String>();
            map.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            HttpEntity<?> requestEntity = new HttpEntity<>(headers);
            log.debug("Rate card service end point"+quotationSvcEndPoint);
            ResponseEntity<?> response = restTemplate.getForEntity(quotationSvcEndPoint+"/rateCardTypes", String.class);
            log.debug("Response freom rateCardTypes service"+ response.getStatusCode());
            log.debug("response from rateCardTypes service"+response.getBody());
//            rateCardDTOList = (List<RateCardDTO>) response.getBody();
            rateCardDetails = response.getBody();

        }catch(Exception e) {
            log.error("Error while calling location service ", e);
            e.printStackTrace();
        }

//		List<RateCard> entities = new ArrayList<RateCard>();
//		entities = rateCardRepository.findAll();
//		return mapperUtil.toModelList(entities, RateCardDTO.class);
        return  rateCardDetails;
	}

	public QuotationDTO saveQuotation(QuotationDTO quotationDto, long currUserId) {

        log.debug("Quotation creation");

        try{
        		//get the user details
        		User currUser = userRepository.findOne(currUserId);

        		//calculate the total cost
        		List<RateCardDTO> rateCardDetails = quotationDto.getRateCardDetails();
        		if(CollectionUtils.isNotEmpty(rateCardDetails)) {
        			double grandTotal = 0;
        			for(RateCardDTO rateCard : rateCardDetails) {
        				grandTotal += rateCard.getQty() * rateCard.getUnitPrice();
        			}
        			quotationDto.setGrandTotal(grandTotal);
        		}else {
        			return quotationDto;
        		}

            RestTemplate restTemplate = new RestTemplate();
            MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
            jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS,false);
            restTemplate.getMessageConverters().add(jsonHttpMessageConverter);

            MultiValueMap<String, String> headers =new LinkedMultiValueMap<String, String>();
            Map<String, String> map=  new HashMap<String, String>();
            map.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            headers.setAll(map);

            JSONObject request = new JSONObject();
            request.put("title",quotationDto.getTitle());
            request.put("description",quotationDto.getDescription());
            JSONArray rateCardArr = new JSONArray();
            if(CollectionUtils.isNotEmpty(quotationDto.getRateCardDetails())) {
            		for(RateCardDTO rateCard : quotationDto.getRateCardDetails()) {
            			JSONObject rcObj = new JSONObject();
            			rcObj.put("title", rateCard.getTitle());
            			rcObj.put("type", rateCard.getType());
            			rcObj.put("uom", rateCard.getUom());
            			rcObj.put("qty", rateCard.getQty());
            			rcObj.put("unitPrice", rateCard.getUnitPrice());
            			rcObj.put("cost", rateCard.getCost());
            			rateCardArr.put(rcObj);
            		}
            }
            request.put("_id", quotationDto.get_id());
            request.put("rateCardDetails",rateCardArr);
            request.put("grandTotal", quotationDto.getGrandTotal());
            request.put("siteId", quotationDto.getSiteId());
            request.put("siteName", quotationDto.getSiteName());
            request.put("projectId", quotationDto.getProjectId());
            request.put("projectName", quotationDto.getProjectName());
            request.put("siteId", quotationDto.getSiteId());
            request.put("ticketId", quotationDto.getTicketId());
            request.put("jobId", quotationDto.getJobId());
            request.put("sentByUserId", quotationDto.getSentByUserId());
            request.put("sentByUserName", quotationDto.getSentByUserName());
            request.put("isDrafted", quotationDto.isDrafted());
            request.put("isSubmitted", quotationDto.isSubmitted());

            log.debug("quotation save  end point"+quotationSvcEndPoint);
            String url = quotationSvcEndPoint+"/quotation/create";

	    		Setting quotationAlertSetting = null;
			List<Setting> settings = settingRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_QUOTATION, quotationDto.getSiteId());
			if(CollectionUtils.isNotEmpty(settings)) {
				quotationAlertSetting = settings.get(0);
			}
			Setting overdueEmails = null;
			settings = settingRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_QUOTATION_EMAILS, quotationDto.getSiteId());
			if(CollectionUtils.isNotEmpty(settings)) {
				overdueEmails = settings.get(0);
			}
			String alertEmailIds =  "";
			if(overdueEmails != null) {
			    log.debug("Overdue email ids found"+overdueEmails.getSettingValue());
				alertEmailIds = overdueEmails.getSettingValue();
			}else{
			    log.debug("Overdue email ids not found");
	        }
			if(quotationDto.getMode().equalsIgnoreCase("create")) {
	        		quotationDto.setCreatedByUserId(currUserId);
	        		quotationDto.setCreateByUserName(currUser.getLogin());
	            request.put("createdByUserId", quotationDto.getCreatedByUserId());
	            request.put("createdByUserName", quotationDto.getCreateByUserName());
	        }
            if(!StringUtils.isEmpty(quotationDto.get_id()) && quotationDto.getMode().equalsIgnoreCase("edit")) {
            		url = quotationSvcEndPoint+"/quotation/edit";
            }else if(quotationDto.getMode().equalsIgnoreCase("submit")) {
            		if(!StringUtils.isEmpty(quotationDto.get_id())) {
            			url = quotationSvcEndPoint+"/quotation/send";
            		}else {
	    	        		quotationDto.setCreatedByUserId(currUserId);
	    	        		quotationDto.setCreateByUserName(currUser.getLogin());
        	            request.put("createdByUserId", quotationDto.getCreatedByUserId());
        	            request.put("createdByUserName", quotationDto.getCreateByUserName());
            		}
            		quotationDto.setDrafted(false);
            		quotationDto.setSubmitted(true);
            		quotationDto.setSentByUserId(currUserId);
	        		quotationDto.setSentByUserName(currUser.getLogin());
                request.put("sentByUserId", quotationDto.getSentByUserId());
                request.put("sentByUserName", quotationDto.getSentByUserName());
                if(quotationAlertSetting != null && quotationAlertSetting.getSettingValue().equalsIgnoreCase("true")) { //send escalation emails to managers and alert emails
                        log.debug("Alert email while sending quotation request"+alertEmailIds);
                		request.put("clientEmailId", alertEmailIds);
				}else{
                    log.debug("Alert emails not found while sending quotation");
                }

            }else if(!StringUtils.isEmpty(quotationDto.get_id()) && quotationDto.getMode().equalsIgnoreCase("approve")) {

            		url = quotationSvcEndPoint+"/quotation/approve";
            		quotationDto.setSubmitted(false);
            		quotationDto.setApproved(true);
            		quotationDto.setApprovedByUserId(currUserId);
	        		quotationDto.setApprovedByUserName(currUser.getLogin());
                request.put("approvedByUserId", quotationDto.getApprovedByUserId());
                request.put("approvedByUserName", quotationDto.getApprovedByUserName());
                if(quotationAlertSetting != null && quotationAlertSetting.getSettingValue().equalsIgnoreCase("true")) { //send escalation emails to managers and alert emails
                		request.put("clientEmailId", alertEmailIds);
                }

            }
            HttpEntity<?> requestEntity = new HttpEntity<>(request.toString(),headers);
            log.debug("Request entity quotation save service"+requestEntity);
            ResponseEntity<?> response = restTemplate.postForEntity(url, requestEntity, String.class);
            log.debug("Response freom push service "+ response.getStatusCode());
            log.debug("response from push service"+response.getBody());
            if(response.getBody() != null) {
	            JSONObject qresp = new JSONObject(response.getBody().toString());
	            //save quotation id in ticket
	            if(qresp != null) {
	            		String serialId = qresp.getString("_id");
	            		log.debug("Quotation id"+serialId);
	            		quotationDto.set_id(serialId);
	            		Ticket ticket = ticketRepository.findOne(quotationDto.getTicketId());
	            		if(ticket != null) {
	            			ticket.setQuotationId(serialId);
	            			ticketRepository.save(ticket);
	            		}
	            }
            }
        }catch(Exception e) {
            log.error("Error while calling quotation save service ", e);
            e.printStackTrace();
        }
		return quotationDto;
	}

    public Object getQuotation(String id) {

        log.debug("get Quotation");
        Object quotationList = "";

        try {
            RestTemplate restTemplate = new RestTemplate();
            MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
            jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
            restTemplate.getMessageConverters().add(jsonHttpMessageConverter);

            MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
            Map<String, String> map = new HashMap<String, String>();
            map.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            HttpEntity<?> requestEntity = new HttpEntity<>(headers);
            log.debug("quotation service end point"+quotationSvcEndPoint);
            ResponseEntity<?> response = restTemplate.getForEntity(quotationSvcEndPoint+"/quotation/id/" + id , String.class);
            log.debug("Response freom push service "+ response.getStatusCode());
            log.debug("response from push service"+response.getBody());
//            rateCardDTOList = (List<RateCardDTO>) response.getBody();
            quotationList = response.getBody();

        }catch(Exception e) {
            log.error("Error while calling location service ", e);
            e.printStackTrace();
        }

        return  quotationList;
    }

    public Object getQuotation(long serialId) {

        log.debug("get Quotation");
        Object quotationList = "";

        try {
            RestTemplate restTemplate = new RestTemplate();
            MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
            jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
            restTemplate.getMessageConverters().add(jsonHttpMessageConverter);

            MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
            Map<String, String> map = new HashMap<String, String>();
            map.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            HttpEntity<?> requestEntity = new HttpEntity<>(headers);
            log.debug("quotation service end point"+quotationSvcEndPoint);
            ResponseEntity<?> response = restTemplate.getForEntity(quotationSvcEndPoint+"/quotation/id/" + serialId , String.class);
            log.debug("Response freom push service "+ response.getStatusCode());
            log.debug("response from push service"+response.getBody());
//            rateCardDTOList = (List<RateCardDTO>) response.getBody();
            quotationList = response.getBody();

        }catch(Exception e) {
            log.error("Error while calling location service ", e);
            e.printStackTrace();
        }

        return  quotationList;
    }

	public Object getQuotations(SearchCriteria searchCriteria) {

        log.debug("get Quotations"+searchCriteria);
        Object quotationList = "";
		User user = userRepository.findOne(searchCriteria.getUserId());
		List<EmployeeProjectSite> projectSites = new ArrayList<EmployeeProjectSite>();
		if(user != null) {
			Employee employee = user.getEmployee();
			if(employee != null) {
				projectSites = employee.getProjectSites();
			}
		}
		List<Long> siteIds = null;
		if(searchCriteria.getSiteId() == 0) {
			siteIds = new ArrayList<Long>();
			if(CollectionUtils.isNotEmpty(projectSites)) {
				for(EmployeeProjectSite projSite : projectSites) {
					siteIds.add(projSite.getSite().getId());
				}
			}
		}

        try {
            RestTemplate restTemplate = new RestTemplate();
            MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
            jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
            restTemplate.getMessageConverters().add(jsonHttpMessageConverter);

            MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
            Map<String, String> map = new HashMap<String, String>();
            map.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            TimeZone tz = TimeZone.getTimeZone("UTC");
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'"); // Quoted "Z" to indicate UTC, no timezone offset
            df.setTimeZone(tz);

            headers.setAll(map);

            log.debug("Parameters - "+searchCriteria.isQuotationIsApproved() + " "+searchCriteria.isQuotationIsArchived()+ " "+ searchCriteria.isQuotationIsDrafted());

            JSONObject request = new JSONObject();
            request.put("projectId",searchCriteria.getProjectId());
            request.put("siteId",searchCriteria.getSiteId());
            request.put("id",searchCriteria.getId());
            request.put("title",searchCriteria.getQuotationTitle());
            request.put("createdBy",searchCriteria.getQuotationCreatedBy());

            if(searchCriteria.getQuotationCreatedDate()!=null){
                df.setTimeZone(tz);
                String createdDate = df.format(searchCriteria.getQuotationCreatedDate());
                String toDate = df.format(searchCriteria.getToDate());
                request.put("createdDate", createdDate);
                request.put("toDate", toDate);

            }

            if(searchCriteria.getFromDate()!=null){
                df.setTimeZone(tz);
                String createdDate = df.format(searchCriteria.getQuotationCreatedDate());
                String toDate = df.format(searchCriteria.getToDate());
                request.put("createdDate", createdDate);
                request.put("toDate", toDate);

            }

            if(searchCriteria.getCheckInDateTimeFrom()!=null){
                df.setTimeZone(tz);
                String createdDate = df.format(searchCriteria.getQuotationCreatedDate());
                String toDate = df.format(searchCriteria.getToDate());
                request.put("createdDate", createdDate);
                request.put("toDate", toDate);

            }

            request.put("approvedBy",searchCriteria.getQuotationApprovedBy());
            request.put("status",searchCriteria.getQuotationStatus());
            request.put("submittedDate", searchCriteria.getQuotationSubmittedDate());
            request.put("approvedDate", searchCriteria.getQuotationApprovedDate());
            request.put("isSubmitted", searchCriteria.isQuotationIsSubmitted());
            request.put("isArchived", searchCriteria.isQuotationIsArchived());
            request.put("isRejected", searchCriteria.isQuotationIsRejected());
            request.put("isDrafted", searchCriteria.isQuotationIsDrafted());
            request.put("isApproved", searchCriteria.isQuotationIsApproved());
            request.put("currPage", searchCriteria.getCurrPage());
            request.put("sort", searchCriteria.getSort());
            request.put("siteIds", siteIds);
            log.debug("Request body " + request.toString());
            HttpEntity<?> requestEntity = new HttpEntity<>(request.toString(), headers);
            log.debug("Rate card service end point"+quotationSvcEndPoint);
                ResponseEntity<?> response = restTemplate.postForEntity(quotationSvcEndPoint+"/quotation", requestEntity, String.class);
            log.debug("Response freom push service "+ response.getStatusCode());
            log.debug("response from push service"+response.getBody());
//            rateCardDTOList = (List<RateCardDTO>) response.getBody();
            quotationList = response.getBody();

        }catch(Exception e) {
            log.error("Error while calling location service ", e);
            e.printStackTrace();
        }

//		List<RateCard> entities = new ArrayList<RateCard>();
//		entities = rateCardRepository.findAll();
//		return mapperUtil.toModelList(entities, RateCardDTO.class);
        return  quotationList;
    }

	public Object getQuotationSummary(SearchCriteria searchCriteria, List<Long> siteIds) {

        log.debug("get Quotations");
        Object quotationList = "";

        try {
            RestTemplate restTemplate = new RestTemplate();
            MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
            jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
            restTemplate.getMessageConverters().add(jsonHttpMessageConverter);

            MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
            Map<String, String> map = new HashMap<String, String>();
            map.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            headers.setAll(map);

            JSONObject request = new JSONObject();
            TimeZone tz = TimeZone.getTimeZone("UTC");
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'"); // Quoted "Z" to indicate UTC, no timezone offset
            df.setTimeZone(tz);
            String createdDate = df.format(searchCriteria.getQuotationCreatedDate());
            String toDate = df.format(searchCriteria.getToDate());
            request.put("createdDate", createdDate);
            request.put("toDate", toDate);
            request.put("siteIds", siteIds);
            log.debug("Request body " + request.toString());
            HttpEntity<?> requestEntity = new HttpEntity<>(request.toString(), headers);
            log.debug("Rate card service end point"+quotationSvcEndPoint);
            ResponseEntity<?> response = restTemplate.postForEntity(quotationSvcEndPoint+"/quotation/summary", requestEntity, String.class);
            log.debug("Response freom push service "+ response.getStatusCode());
            log.debug("response from push service"+response.getBody());
//            rateCardDTOList = (List<RateCardDTO>) response.getBody();
            quotationList = response.getBody();

        }catch(Exception e) {
            log.error("Error while calling Quotations service ", e);
            e.printStackTrace();
        }

//		List<RateCard> entities = new ArrayList<RateCard>();
//		entities = rateCardRepository.findAll();
//		return mapperUtil.toModelList(entities, RateCardDTO.class);
        return  quotationList;
    }

    public Object approveQuotation(QuotationDTO quotation) {
        log.debug("Approve Quotations");
        Object approvedQuotation = "";

        try {

            RestTemplate restTemplate = new RestTemplate();
            MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
            jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS,false);
            restTemplate.getMessageConverters().add(jsonHttpMessageConverter);

            MultiValueMap<String, String> headers =new LinkedMultiValueMap<String, String>();
            Map<String, String> map=  new HashMap<String, String>();
            map.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            headers.setAll(map);

            Map<String,Object> paramMap = new HashMap<String,Object>();
            paramMap.put("_id",quotation.get_id());

            JSONObject request = new JSONObject();
            request.put("_id",quotation.get_id());

            HttpEntity<?> requestEntity = new HttpEntity<>(request.toString(),headers);
            log.debug("Request entity rate card service"+requestEntity);
            log.debug("Rate card service end point"+quotationSvcEndPoint);
            ResponseEntity<?> response = restTemplate.postForEntity(quotationSvcEndPoint+"/quotation/approve", requestEntity, String.class);
            log.debug("Response from push service "+ response.getStatusCode());
            log.debug("response from push service"+response.getBody());


        }catch(Exception e) {
            log.error("Error while calling location service ", e);
            e.printStackTrace();
        }

//		List<RateCard> entities = new ArrayList<RateCard>();
//		entities = rateCardRepository.findAll();
//		return mapperUtil.toModelList(entities, RateCardDTO.class);
        return  approvedQuotation;
    }

    public Object rejectQuotation(QuotationDTO quotation) {
        log.debug("reject Quotations");
        Object approvedQuotation = "";

        try {

            RestTemplate restTemplate = new RestTemplate();
            MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
            jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS,false);
            restTemplate.getMessageConverters().add(jsonHttpMessageConverter);

            MultiValueMap<String, String> headers =new LinkedMultiValueMap<String, String>();
            Map<String, String> map=  new HashMap<String, String>();
            map.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            headers.setAll(map);

            Map<String,Object> paramMap = new HashMap<String,Object>();
            paramMap.put("_id",quotation.get_id());

            JSONObject request = new JSONObject();
            request.put("_id",quotation.get_id());

            HttpEntity<?> requestEntity = new HttpEntity<>(request.toString(),headers);
            log.debug("Request entity rate card service"+requestEntity);
            log.debug("Rate card service end point"+quotationSvcEndPoint);
            ResponseEntity<?> response = restTemplate.postForEntity(quotationSvcEndPoint+"/quotation/reject", requestEntity, String.class);
            log.debug("Response from push service "+ response.getStatusCode());
            log.debug("response from push service"+response.getBody());


        }catch(Exception e) {
            log.error("Error while calling location service ", e);
            e.printStackTrace();
        }

//		List<RateCard> entities = new ArrayList<RateCard>();
//		entities = rateCardRepository.findAll();
//		return mapperUtil.toModelList(entities, RateCardDTO.class);
        return  approvedQuotation;
    }



	public RateCardDTO findOne(Long id) {
		RateCard entity = rateCardRepository.findOne(id);
		return mapperUtil.toModel(entity, RateCardDTO.class);
	}

	@Transactional
    public QuotationDTO uploadFile(QuotationDTO quotationDTO) throws JSONException {

        log.debug("Employee list from check in out images"+quotationDTO.getId());
        //Attendance attendanceImage = attendanceRepository.findOne(attendanceDto.getId());
        quotationDTO = amazonS3Utils.uploadQuotationFile(quotationDTO.getId(), quotationDTO.getQuotationFile(), System.currentTimeMillis(), quotationDTO);
        quotationDTO.setQuotationFileName(quotationDTO.getQuotationFileName());
        quotationDTO.setUrl(quotationDTO.getUrl());
        updateImageName(quotationDTO.getId(), quotationDTO.getQuotationFileName());

		return quotationDTO;
	}

	public String updateImageName(String quotationId, String quotationImageName) throws JSONException {
        log.debug("update image rest function");
        RestTemplate restTemplate = new RestTemplate();
        MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
        jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        restTemplate.getMessageConverters().add(jsonHttpMessageConverter);

        MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
        Map<String, String> map = new HashMap<String, String>();
        map.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);

        headers.setAll(map);

        JSONObject request = new JSONObject();
        request.put("quotationId",quotationId);
        request.put("quotationImage",quotationImageName);

        log.debug("quotation save  end point"+quotationSvcEndPoint);
        String url = quotationSvcEndPoint+"/quotation/uploadImage";

        HttpEntity<?> requestEntity = new HttpEntity<>(request.toString(),headers);
        log.debug("Request entity quotation image name update service"+requestEntity);
        ResponseEntity<?> response = restTemplate.postForEntity(url, requestEntity, String.class);
        log.debug("Response image name update service"+ response.getStatusCode());
        log.debug("response from image name update service"+response.getBody());

	    return "Success";
    }

	public String getQuotationImage(String quotationId, String imageId) {
        String quotationFileUrl = null;
        log.debug("Quotation Image service"+quotationId+" "+imageId);
        quotationFileUrl = cloudFrontUrl + bucketEnv + quotationFilePath + imageId;
        return quotationFileUrl;

    }

    public SearchResult<RateCardDTO> findBySearchCriteria(SearchCriteria searchCriteria) {
    	log.debug("search Criteria",searchCriteria);

        try{
            RestTemplate restTemplate = new RestTemplate();
            MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
            jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS,false);
            restTemplate.getMessageConverters().add(jsonHttpMessageConverter);

            MultiValueMap<String, String> headers =new LinkedMultiValueMap<String, String>();
            Map<String, String> map=  new HashMap<String, String>();
            map.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            headers.setAll(map);

            Map<String,Object> paramMap = new HashMap<String,Object>();
//            paramMap.put("title",searchCriteria.get`());


            JSONObject request = new JSONObject();
//            request.put("title",rateCardDto.getTitle());
            if(StringUtils.isEmpty(searchCriteria.getRateCardTitle()) && StringUtils.isEmpty(searchCriteria.getRateCardType())){

            }else if(StringUtils.isEmpty(searchCriteria.getRateCardType())){
                request.put("title",searchCriteria.getRateCardTitle());
            }else if(StringUtils.isEmpty(searchCriteria.getRateCardTitle())){
                request.put("type",searchCriteria.getRateCardType());
            }else{
                request.put("title",searchCriteria.getRateCardTitle());
                request.put("type",searchCriteria.getRateCardType());
            }

            HttpEntity<?> requestEntity = new HttpEntity<>(request.toString(),headers);
            log.debug("Request entity rate card service"+requestEntity);
            log.debug("Rate card service end point"+quotationSvcEndPoint);
            ResponseEntity<?> response = restTemplate.postForEntity(quotationSvcEndPoint+"/rateCard", requestEntity, String.class);
            log.debug("Response freom push service "+ response.getStatusCode());
            log.debug("response from push service"+response.getBody());

        }catch(Exception e) {
            log.error("Error while calling location service ", e);
            e.printStackTrace();
        }

        SearchResult<RateCardDTO> result = new SearchResult<RateCardDTO>();
        if(searchCriteria != null) {
            Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
            Page<RateCard> page = null;
            List<RateCardDTO> transactions = null;
            if(!searchCriteria.isFindAll()) {
                if(searchCriteria.getSiteId() != 0) {
                    page = rateCardRepository.findBySiteId(searchCriteria.getSiteId(),pageRequest);
                }
            }else {
        		page = rateCardRepository.findAllActive(pageRequest);
            }
            if(page != null) {
                transactions = mapperUtil.toModelList(page.getContent(), RateCardDTO.class);
                if(CollectionUtils.isNotEmpty(transactions)) {
                    buildSearchResult(searchCriteria, page, transactions,result);
                }
            }
        }
        return result;
    }

    private void buildSearchResult(SearchCriteria searchCriteria, Page<RateCard> page, List<RateCardDTO> transactions, SearchResult<RateCardDTO> result) {
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
