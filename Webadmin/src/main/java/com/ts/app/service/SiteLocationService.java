package com.ts.app.service;

import com.fasterxml.jackson.databind.SerializationFeature;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;



@Service
public class
SiteLocationService {

    @Value("${locationService.url}")
    private String locSvcEndpoint;

    @Value("${locationService.proximityUrl}")
    private String locProximitySvcEndpoint;

    private final Logger log = LoggerFactory.getLogger(SiteLocationService.class);

//	private static final String locSvcEndpoint = exportPath;

    @Async
	public void save(long userId, long siteId, double lat, double lng, double radius) {
		try {
			RestTemplate restTemplate = new RestTemplate();
			MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
			jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
			restTemplate.getMessageConverters().add(jsonHttpMessageConverter);

			//restTemplate.postForLocation(pushEndpoint, request);

			MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
	        Map<String,String> map = new HashMap<String, String>();
	        map.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);

	        headers.setAll(map);

	        //MultiValueMap<String, Object> params = new LinkedMultiValueMap<String, Object>();
	        Map<String,Object> paramMap = new HashMap<String,Object>();
	        paramMap.put("userId", userId);
	        paramMap.put("siteId", siteId);
	        paramMap.put("lat", lat);
	        paramMap.put("lng", lng);
	        paramMap.put("radius", radius);
	        //params.setAll(paramMap);

            JSONObject request = new JSONObject();
            request.put("userId", userId);
            request.put("siteId", siteId);
            request.put("lat", lat);
            request.put("lng",lng);
            request.put("radius", radius);

	        HttpEntity<?> requestEntity = new HttpEntity<>(request.toString(), headers);
            log.debug("Before invoking site location service -" + requestEntity);
            log.debug("location service end point -"+ locSvcEndpoint);
	        ResponseEntity<?> response = restTemplate.postForEntity(locSvcEndpoint, requestEntity, String.class);
	        log.debug("response from push service="+response.getStatusCode());
	        log.debug("response from push service="+response.getBody());
		}catch(Exception e) {
		    log.error("Error while calling location service ", e);
			e.printStackTrace();
		}
	}

    public String checkProximity(long siteId, double lat, double lng){
    	try {
			RestTemplate restTemplate = new RestTemplate();
			MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
			jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
			restTemplate.getMessageConverters().add(jsonHttpMessageConverter);

			//restTemplate.postForLocation(pushEndpoint, request);

			MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
	        Map<String,String> map = new HashMap<String, String>();
	        map.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);

	        headers.setAll(map);

	        //MultiValueMap<String, Object> params = new LinkedMultiValueMap<String, Object>();
	        Map<String,Object> paramMap = new HashMap<String,Object>();
	        paramMap.put("siteId", siteId);
	        paramMap.put("lat", lat);
	        paramMap.put("lng", lng);

            JSONObject request = new JSONObject();
            request.put("siteId", siteId);
            request.put("lat", lat);
            request.put("lng",lng);

	        HttpEntity<?> requestEntity = new HttpEntity<>(request.toString(), headers);
            log.debug("Before invoking site location service -" + requestEntity);
            
            //append params to url
            StringBuffer proximitySvcUrl = new StringBuffer(locProximitySvcEndpoint);
            proximitySvcUrl.append("?");
            proximitySvcUrl.append("siteId="+siteId);
            proximitySvcUrl.append("&lat="+lat);
            proximitySvcUrl.append("&lng="+lng);
            
            log.debug("location service end point -"+ proximitySvcUrl.toString());
	        ResponseEntity<?> response = restTemplate.getForEntity(proximitySvcUrl.toString(), String.class);
	        log.debug("response from push service="+response.getStatusCode());
	        log.debug("response from push service="+response.getBody());
	        return response.getBody().toString();
		}catch(Exception e) {
		    log.error("Error while calling location service ", e);
		}
    		return null;
    }

}
