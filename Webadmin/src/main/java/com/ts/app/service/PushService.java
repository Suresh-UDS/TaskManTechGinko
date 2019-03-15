package com.ts.app.service;

import com.fasterxml.jackson.databind.SerializationFeature;
import com.ts.app.web.rest.dto.PushRequestDTO;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring4.SpringTemplateEngine;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Service
@EnableAsync
public class PushService {

	private final Logger log = LoggerFactory.getLogger(PushService.class);

	//private static final String pushEndpoint = "http://localhost:9000/api/push/send";

    @Inject
    private MessageSource messageSource;

    @Inject
    private SpringTemplateEngine templateEngine;

	@Inject
	private Environment env;

	@Async
	public void sendAttendanceCheckoutAlert(long userIds[], Map<String,Object> values) {
		Locale locale = Locale.forLanguageTag("en-US");
		Context context = new Context(locale);
		context.setVariable("checkInTime", values.get("checkInTime"));
		context.setVariable("site", values.get("site"));
		String emailContent = templateEngine.process("attendanceCheckoutAlertPush", context);
		String subject = messageSource.getMessage("email.attendance.checkout.alert.title", null, locale);
		send(userIds, emailContent);
	}
	
	@Async
	public void sendNewJobAlert(long userIds[], Map<String,Object> values) {
		Locale locale = Locale.forLanguageTag("en-US");
		Context context = new Context(locale);
		context.setVariable("dateTime", values.get("jobDateTime"));
		context.setVariable("site", values.get("site"));
		context.setVariable("jobId", values.get("jobId"));
		context.setVariable("jobTitle", values.get("jobTitle"));
		//String emailContent = templateEngine.process("newJobAlertPush", context);
		Object[] data = new Object[4];
		data[0] = String.valueOf(values.get("jobId"));
		data[1] = values.get("jobTitle");
		data[2] = values.get("jobDateTime");
		data[3] = values.get("site");
		String content = messageSource.getMessage("push.newjob.alert.content", data, locale);
		send(userIds, content);
	}
	
	@Async
	public void sendNewTicketAlert(long userIds[], Map<String,Object> values) {
		Locale locale = Locale.forLanguageTag("en-US");
		Context context = new Context(locale);
		context.setVariable("dateTime", values.get("ticketDateTime"));
		context.setVariable("site", values.get("site"));
		context.setVariable("ticketId", values.get("ticketId"));
		context.setVariable("ticketTitle", values.get("ticketTitle"));
		//String emailContent = templateEngine.process("newJobAlertPush", context);
		Object[] data = new Object[4];
		data[0] = String.valueOf(values.get("ticketId"));
		data[1] = values.get("ticketTitle");
		data[2] = values.get("ticketDateTime");
		data[3] = values.get("site");
		String content = messageSource.getMessage("push.newticket.alert.content", data, locale);
		send(userIds, content);
	}
	
	@Async
	public void sendClosedTicketAlert(long userIds[], Map<String,Object> values) {
		Locale locale = Locale.forLanguageTag("en-US");
		Context context = new Context(locale);
		context.setVariable("dateTime", values.get("ticketDateTime"));
		context.setVariable("site", values.get("site"));
		context.setVariable("ticketId", values.get("ticketId"));
		context.setVariable("ticketTitle", values.get("ticketTitle"));
		//String emailContent = templateEngine.process("newJobAlertPush", context);
		Object[] data = new Object[4];
		data[0] = String.valueOf(values.get("ticketId"));
		data[1] = values.get("ticketTitle");
		data[2] = values.get("ticketDateTime");
		data[3] = values.get("site");
		String content = messageSource.getMessage("push.closedticket.alert.content", data, locale);
		send(userIds, content);
	}

	@Async
	public void send(long users[],String message) {
		try {
		    log.debug("Sending push messages to - "+users[0]);
			String pushEndpoint = env.getProperty("pushService.url")+"api/push/send";
			RestTemplate restTemplate = new RestTemplate();
			MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
			jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
			restTemplate.getMessageConverters().add(jsonHttpMessageConverter);
			JSONObject request = new JSONObject();
			request.put("users", users);
			JSONObject msgObj = new JSONObject();
			msgObj.put("message", message);
			JSONObject data = new JSONObject();
			data.put("data", msgObj);
			request.put("payload", data);
			request.put("android", data);
			request.put("ios", data);
			log.debug("Push request - "+ request);

			MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
	        Map map = new HashMap<String, String>();
	        map.put("Content-Type", "application/json");

	        headers.setAll(map);

	        HttpEntity<String> requestEntity = new HttpEntity<String>(request.toString(), headers);

	        ResponseEntity<?> response = restTemplate.postForEntity(pushEndpoint, requestEntity, String.class);
	        log.debug("response from push service="+response.getStatusCode());
		}catch(Exception e) {
			e.printStackTrace();
		}
	}

	@Async
	public void subscribe(PushRequestDTO pushRequest) {
		try {
			String pushEndpoint = env.getProperty("pushService.url")+"api/push/subscribe";
			RestTemplate restTemplate = new RestTemplate();
			MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
			jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
			restTemplate.getMessageConverters().add(jsonHttpMessageConverter);
			JSONObject request = new JSONObject();
			request.put("user", pushRequest.getUser());
			request.put("type", pushRequest.getType());
			request.put("token", pushRequest.getToken());
			request.put("pushUserId", pushRequest.getPushUserId());
			request.put("userId", pushRequest.getUserId());
			request.put("userType", pushRequest.getUserType());
			log.debug("Push request - "+ request);

			MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
	        Map map = new HashMap<String, String>();
	        map.put("Content-Type", "application/json");

	        headers.setAll(map);

	        HttpEntity<String> requestEntity = new HttpEntity<String>(request.toString(), headers);

	        ResponseEntity<?> response = restTemplate.postForEntity(pushEndpoint, requestEntity, String.class);
	        log.debug("response from push service="+response.getStatusCode());
		}catch(Exception e) {
			e.printStackTrace();
		}
	}

}
