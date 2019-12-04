package com.ts.app.config;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import org.springframework.http.HttpRequest ;

public class RestTemplateHeaderModifierInterceptor implements ClientHttpRequestInterceptor {
		 
		private Map<String,String> headers;
	
	   	RestTemplateHeaderModifierInterceptor(Map<String,String> reqHeaders){
	   		
	   		headers = reqHeaders;
	   		
	   	}
	
	    public ClientHttpResponse intercept(
	      HttpRequest request, 
	      byte[] body, 
	      ClientHttpRequestExecution execution) throws IOException {
	  
	    	request.getHeaders().setAll(headers);
	        ClientHttpResponse response = execution.execute(request, body);
	         
	        return response;
	    }
}

