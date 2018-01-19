package com.ts.app.ext.api;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.ts.app.domain.FaceProfile;
import com.ts.app.ext.api.model.KairosResponse;
import com.ts.app.ext.api.model.KairosVerifyResponse;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.FaceProfileRepository;
import com.ts.app.web.rest.dto.FaceRecognitionRequest;
import com.ts.app.web.rest.dto.FaceRecognitionResponse;

@Component
public class FaceRecognitionService {

	private final Logger log = LoggerFactory.getLogger(FaceRecognitionService.class);

	@Autowired
	private FaceProfileRepository faceProfileRepo;

	@Autowired
	private EmployeeRepository employeeRepo;

	@Inject
	private Environment env;

	public FaceRecognitionResponse verify(FaceRecognitionRequest request) {
		FaceRecognitionResponse resp = new FaceRecognitionResponse();
		KairosVerifyResponse callResp = callVerify(request.getImageUrl(), request.getEmployeeFullName());
		if(callResp != null && callResp.getImages() != null && callResp.getImages().length > 0) {
			KairosVerifyResponse.Image images[] = callResp.getImages();
			KairosVerifyResponse.Image image = images[0];
			if(image != null) {
			    log.debug("status....."+image.getTransaction().getStatus()+" "+image.getTransaction().getSubjectId()+" "+image.getTransaction().getConfidence());
				if(image.getTransaction().getStatus().equalsIgnoreCase("success")
						&& image.getTransaction().getSubjectId().equalsIgnoreCase(request.getEmployeeFullName())
						&& image.getTransaction().getConfidence() > 0.75) {
					resp.setStatus("success");
					resp.setStatusMessage("Face id verified successfully");
				}else {
					resp.setStatus("failed");
					resp.setStatusMessage("Face id does not match, please try again");
				}
			}else {
				resp.setStatus("failed");
				resp.setStatusMessage("Error while verifying face id, please try again");
			}
		}
		return resp;
	}

	public FaceRecognitionResponse enroll(FaceRecognitionRequest request) {
	    log.debug("Request face recognition............."+request.getEmployeeFullName());
		FaceRecognitionResponse resp = new FaceRecognitionResponse();
        KairosResponse faceDetectionResponse = callEnroll(request.getImageUrl(), request.getEmployeeFullName());
        ObjectMapper mapper = new ObjectMapper();
        String responseStr = null;
        try {
            responseStr = mapper.writeValueAsString(faceDetectionResponse);
        } catch (JsonProcessingException e) {
            log.error("Error while converting facedetection response string ",e);
        }
        if(faceDetectionResponse != null) {
            if(faceDetectionResponse.getErrors() != null && faceDetectionResponse.getErrors().length > 0) {
                KairosResponse.Error error = faceDetectionResponse.getErrors()[0];
                if(error != null && error.getErrCode().equalsIgnoreCase("5002")) {
                    resp.setStatus("failed");
                    resp.setStatusMessage("Unable to enroll face id");
                }
            }else {
                FaceProfile faceProfile = faceProfileRepo.findByEmployeeId(request.getEmployeeId());
                if(faceProfile == null) {
                    faceProfile = new FaceProfile();
                    faceProfile.setEmployee(employeeRepo.findOne(request.getEmployeeId()));
                }
                faceProfile.setProfileData(responseStr);
                faceProfileRepo.save(faceProfile);
                resp.setStatus("success");
                resp.setStatusMessage("Face id enrolled successfully");
            }
        }
		return resp;
	}


	public FaceRecognitionResponse detect(FaceRecognitionRequest request) {
		FaceRecognitionResponse resp = new FaceRecognitionResponse();
		KairosResponse faceDetectionResponse = callFaceDetectionService(request.getImageUrl());
		ObjectMapper mapper = new ObjectMapper();
		String responseStr = null;
		try {
			responseStr = mapper.writeValueAsString(faceDetectionResponse);
		} catch (JsonProcessingException e) {
			log.error("Error while converting facedetection response string ",e);
		}
		if(faceDetectionResponse != null) {
			if(faceDetectionResponse.getErrors() != null && faceDetectionResponse.getErrors().length > 0) {
				KairosResponse.Error error = faceDetectionResponse.getErrors()[0];
				if(error != null && error.getErrCode().equalsIgnoreCase("5002")) {
					resp.setStatus("failed");
					resp.setStatusMessage("No face was detected in the image");
				}
			}else {
				FaceProfile faceProfile = faceProfileRepo.findByEmployeeId(request.getEmployeeId());
				if(faceProfile == null) {
					faceProfile = new FaceProfile();
					faceProfile.setEmployee(employeeRepo.findOne(request.getEmployeeId()));
				}
				faceProfile.setProfileData(responseStr);
				faceProfileRepo.save(faceProfile);
				resp.setStatus("success");
				resp.setStatusMessage("Face detected successfully");
			}
		}
		return resp;
	}

	private void callDetectApi(String imageUrl) {
		String apiUrl = env.getProperty("facedetection.api.url");
		String apiKey = env.getProperty("facedetection.api.apiKey");
		String apiId = env.getProperty("facedetection.api.apiId");

		CloseableHttpClient client = HttpClients.createDefault();
        HttpPost post = new HttpPost(apiUrl);
		log.debug("Face Recognition request apiUrl  - "+ apiUrl);
		log.debug("Face Recognition request apiId  - "+ apiId);
		log.debug("Face Recognition request apiKey  - "+ apiKey);

        try {

        		StringEntity input = new StringEntity("{\"image\":" + imageUrl + "\"}");
        		//input.setContentType("application/json");
        	    post.setEntity(input);
            post.setHeader("api_id", apiId);
            post.setHeader("api_key", apiKey);
            post.setHeader("Accept", "application/json");
            post.setHeader("Content-Type", "application/json");

        		HttpResponse response = client.execute(post);

            BufferedReader rd = new BufferedReader(new InputStreamReader(
                    response.getEntity().getContent()));
            String line = "";
            while ((line = rd.readLine()) != null) {
                log.debug(line);
            }

        } catch (IOException e) {
            log.error("Error while calling face detection api",e);
        }
	}


	private KairosResponse callFaceDetectionService(String imageUrl) {
		String apiUrl = env.getProperty("facedetection.api.url");
		String apiKey = env.getProperty("facedetection.api.apiKey");
		String apiId = env.getProperty("facedetection.api.apiId");
		String response = null;
		KairosResponse resp = null;
		try {
			RestTemplate restTemplate = new RestTemplate();
			MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
			jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
			restTemplate.getMessageConverters().add(jsonHttpMessageConverter);
			JSONObject apiReq = new JSONObject();
			apiReq.put("image", imageUrl);

//			log.debug("Face Recognition request - "+ apiReq);
//			log.debug("Face Recognition request - "+ apiReq);
			log.debug("Face Recognition request apiUrl  - "+ apiUrl);
			log.debug("Face Recognition request apiId  - "+ apiId);
			log.debug("Face Recognition request apiKey  - "+ apiKey);
			log.debug("Face Recognition request body  - "+ apiReq.toString());


			MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
	        Map<String, String> map = new HashMap<String, String>();
	        map.put("Content-Type", "application/json");
	        map.put("app_id", apiId);
	        map.put("app_key", apiKey);

	        headers.setAll(map);

	        HttpHeaders httpHeaders = new HttpHeaders();
	        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
	        httpHeaders.add("app_id", apiId);
	        httpHeaders.add("app_key", apiKey);

	        String reqJson = "{\"image\" : \""+ imageUrl  + "\"}" ;

	        HttpEntity<String> requestEntity = new HttpEntity<String>(reqJson, httpHeaders);

	        resp = restTemplate.postForObject(apiUrl, requestEntity, KairosResponse.class);
//	        log.debug("response from face detection service="+resp);
//	        log.debug("response from face detection service="+response);

	        //log.debug("Response ="+ response.getBody());
		}catch(Exception e) {
			log.error("Error while calling face detection service ",e);
		}
		return resp;

	}

	private KairosResponse callEnroll(String imageUrl, String name) {
		String apiUrl = env.getProperty("facedetection.api.enrollUrl");
		String apiKey = env.getProperty("facedetection.api.apiKey");
		String apiId = env.getProperty("facedetection.api.apiId");
		String response = null;
		KairosResponse resp = null;
		try {
			RestTemplate restTemplate = new RestTemplate();
			MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
			jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
			restTemplate.getMessageConverters().add(jsonHttpMessageConverter);
			JSONObject apiReq = new JSONObject();
			apiReq.put("image", imageUrl);
			apiReq.put("subject_id", name);
			apiReq.put("gallery_name", "Employee");

//			log.debug("Face Recognition request - "+ apiReq);
//			log.debug("Face Recognition request - "+ apiReq);
			log.debug("Face Recognition request apiUrl  - "+ apiUrl);
			log.debug("Face Recognition request apiId  - "+ apiId);
			log.debug("Face Recognition request apiKey  - "+ apiKey);
//			log.debug("Face Recognition request body  - "+ apiReq.toString());


			MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
	        Map<String, String> map = new HashMap<String, String>();
	        map.put("Content-Type", "application/json");
	        map.put("app_id", apiId);
	        map.put("app_key", apiKey);

	        headers.setAll(map);

	        HttpHeaders httpHeaders = new HttpHeaders();
	        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
	        httpHeaders.add("app_id", apiId);
	        httpHeaders.add("app_key", apiKey);

	        HttpEntity<String> requestEntity = new HttpEntity<String>(apiReq.toString(), httpHeaders);

	        resp = restTemplate.postForObject(apiUrl, requestEntity, KairosResponse.class);
	        log.debug("response from face detection service="+resp);
	        log.debug("response from face detection service="+response);

	        //log.debug("Response ="+ response.getBody());
		}catch(Exception e) {
			log.error("Error while calling face detection service ",e);
		}
		return resp;

	}


	private KairosVerifyResponse callVerify(String imageUrl, String name) {
		String apiUrl = env.getProperty("facedetection.api.verifyUrl");
		String apiKey = env.getProperty("facedetection.api.apiKey");
		String apiId = env.getProperty("facedetection.api.apiId");
		String response = null;
		KairosVerifyResponse resp = null;
		try {
			RestTemplate restTemplate = new RestTemplate();
			MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
			jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
			restTemplate.getMessageConverters().add(jsonHttpMessageConverter);
			JSONObject apiReq = new JSONObject();
			apiReq.put("image", imageUrl);
			apiReq.put("subject_id", name);
			apiReq.put("gallery_name", "Employee");

			log.debug("Face Recognition request - "+ apiReq);
			log.debug("Face Recognition request - "+ apiReq);
			log.debug("Face Recognition request apiUrl  - "+ apiUrl);
			log.debug("Face Recognition request apiId  - "+ apiId);
			log.debug("Face Recognition request apiKey  - "+ apiKey);
			log.debug("Face Recognition request body  - "+ apiReq.toString());


			MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
	        Map<String, String> map = new HashMap<String, String>();
	        map.put("Content-Type", "application/json");
	        map.put("app_id", apiId);
	        map.put("app_key", apiKey);

	        headers.setAll(map);

	        HttpHeaders httpHeaders = new HttpHeaders();
	        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
	        httpHeaders.add("app_id", apiId);
	        httpHeaders.add("app_key", apiKey);

	        HttpEntity<String> requestEntity = new HttpEntity<String>(apiReq.toString(), httpHeaders);

	        resp = restTemplate.postForObject(apiUrl, requestEntity, KairosVerifyResponse.class);
	        log.debug("response from face detection service="+resp);
	        log.debug("response from face detection service="+response);

	        //log.debug("Response ="+ response.getBody());
		}catch(Exception e) {
			log.error("Error while calling face detection service ",e);
		}
		return resp;

	}



}
