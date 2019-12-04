package com.ts.app.config;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestTemplate;
 
@Configuration
public class KelsaRestConfiguration {
 
	@Value("${kelsa.login}")
	String kelsaLogin;
	
	@Value("${kelsa.token}")
	String kelsaToken;
	
	@Bean(name="kelsa")
	public RestTemplate RestTemplate() {
		
		RestTemplate restTemplate = new RestTemplate();
		List<ClientHttpRequestInterceptor> interceptors = restTemplate.getInterceptors();
		if(CollectionUtils.isEmpty(interceptors)) {
			interceptors = new ArrayList<>();
		}
		
		Map<String,String> kelsaHeader = new HashMap<>();
		
		kelsaHeader.put("X-User-Email", kelsaLogin);
		kelsaHeader.put("X-User-Token", kelsaToken);
		kelsaHeader.put("Content-Type", "application/json");
		
		interceptors.add(new RestTemplateHeaderModifierInterceptor(kelsaHeader));
		restTemplate.setInterceptors(interceptors);
		
        return restTemplate;
	}
	
	
	
	
}

