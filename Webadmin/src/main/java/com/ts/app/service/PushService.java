package com.ts.app.service;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.SerializationFeature;

@Service
public class PushService {
	
	private final Logger log = LoggerFactory.getLogger(PushService.class);
	
	//private static final String pushEndpoint = "http://localhost:9000/api/push/send";
	
	@Inject
	private Environment env;

	public void send(long users[],String message) {
		try {
			String pushEndpoint = env.getProperty("pushService.url");
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
			JSONObject addData = new JSONObject();
			request.put("bookingId", 100);
			request.put("stateId", 100);
			request.put("event", "Complete");
			data.put("additionalData", addData);
			request.put("payload", data);
			request.put("android", data);
			request.put("ios", data);
			log.debug("Push request - "+ request);
			//restTemplate.postForLocation(pushEndpoint, request);
			
			MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
	        Map map = new HashMap<String, String>();
	        map.put("Content-Type", "application/json");

	        headers.setAll(map);

	        //Map req_payload = new HashMap();
	        //req_payload.put("name", "piyush");

	        HttpEntity<String> requestEntity = new HttpEntity<String>(request.toString(), headers);
	        //String url = "http://localhost:8080/xxx/xxx/";

	        ResponseEntity<?> response = restTemplate.postForEntity(pushEndpoint, requestEntity, String.class);
	        log.debug("response from push service="+response.getStatusCode());
		}catch(Exception e) {
			e.printStackTrace();
		}
	}

}
