package com.ts.app.ext.api;

import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.FaceProfileRepository;
import com.ts.app.web.rest.dto.EmployeeDTO;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import java.net.URI;

@Component
public class FaceRecognitionService {

    private final Logger log = LoggerFactory.getLogger(FaceRecognitionService.class);

    @Autowired
    private FaceProfileRepository faceProfileRepo;

    @Autowired
    private EmployeeRepository employeeRepo;

    @Inject
    private Environment env;

    String apiUrl = "";
    String apiKey = "";
    String groupId = "";
    String personId = "";

//    String apiUrl = env.getProperty("facedetection.api.url");
//    String apiKey = env.getProperty("facedetection.api.apiKey");
//    String groupId = env.getProperty("facedetection.api.groupId");
//    String personId = env.getProperty("facedetection.api.personId");


//	public FaceRecognitionResponse verify(FaceRecognitionRequest request) {
//		FaceRecognitionResponse resp = new FaceRecognitionResponse();
//		KairosVerifyResponse callResp = callVerify(request.getImageUrl(), request.getEmployeeFullName());
//		if(callResp != null && callResp.getImages() != null && callResp.getImages().length > 0) {
//			KairosVerifyResponse.Image images[] = callResp.getImages();
//			KairosVerifyResponse.Image image = images[0];
//			if(image != null) {
//			    log.debug("status....."+image.getTransaction().getStatus()+" "+image.getTransaction().getSubjectId()+" "+image.getTransaction().getConfidence());
//				if(image.getTransaction().getStatus().equalsIgnoreCase("success")
//						&& image.getTransaction().getSubjectId().equalsIgnoreCase(request.getEmployeeFullName())
//						&& image.getTransaction().getConfidence() > 0.75) {
//					resp.setStatus("success");
//					resp.setStatusMessage("Face id verified successfully");
//				}else {
//					resp.setStatus("failed");
//					resp.setStatusMessage("Face id does not match, please try again");
//				}
//			}else {
//				resp.setStatus("failed");
//				resp.setStatusMessage("Error while verifying face id, please try again");
//			}
//		}
//		return resp;
//	}
//
//	public FaceRecognitionResponse enroll(FaceRecognitionRequest request) {
//	    log.debug("Request face recognition............."+request.getEmployeeFullName());
//		FaceRecognitionResponse resp = new FaceRecognitionResponse();
//        KairosResponse faceDetectionResponse = callEnroll(request.getImageUrl(), request.getEmployeeFullName());
//        ObjectMapper mapper = new ObjectMapper();
//        String responseStr = null;
//        try {
//            responseStr = mapper.writeValueAsString(faceDetectionResponse);
//        } catch (JsonProcessingException e) {
//            log.error("Error while converting facedetection response string ",e);
//        }
//        if(faceDetectionResponse != null) {
//            if(faceDetectionResponse.getErrors() != null && faceDetectionResponse.getErrors().length > 0) {
//                KairosResponse.Error error = faceDetectionResponse.getErrors()[0];
//                if(error != null && error.getErrCode().equalsIgnoreCase("5002")) {
//                    resp.setStatus("failed");
//                    resp.setStatusMessage("Unable to enroll face id");
//                }
//            }else {
//                FaceProfile faceProfile = faceProfileRepo.findByEmployeeId(request.getEmployeeId());
//                if(faceProfile == null) {
//                    faceProfile = new FaceProfile();
//                    faceProfile.setEmployee(employeeRepo.findOne(request.getEmployeeId()));
//                }
//                faceProfile.setProfileData(responseStr);
//                faceProfileRepo.save(faceProfile);
//                resp.setStatus("success");
//                resp.setStatusMessage("Face id enrolled successfully");
//            }
//        }
//		return resp;
//	}
//
//
//	public FaceRecognitionResponse detect(FaceRecognitionRequest request) {
//		FaceRecognitionResponse resp = new FaceRecognitionResponse();
//		KairosResponse faceDetectionResponse = callFaceDetectionService(request.getImageUrl());
//		ObjectMapper mapper = new ObjectMapper();
//		String responseStr = null;
//		try {
//			responseStr = mapper.writeValueAsString(faceDetectionResponse);
//		} catch (JsonProcessingException e) {
//			log.error("Error while converting facedetection response string ",e);
//		}
//		if(faceDetectionResponse != null) {
//			if(faceDetectionResponse.getErrors() != null && faceDetectionResponse.getErrors().length > 0) {
//				KairosResponse.Error error = faceDetectionResponse.getErrors()[0];
//				if(error != null && error.getErrCode().equalsIgnoreCase("5002")) {
//					resp.setStatus("failed");
//					resp.setStatusMessage("No face was detected in the image");
//				}
//			}else {
//				FaceProfile faceProfile = faceProfileRepo.findByEmployeeId(request.getEmployeeId());
//				if(faceProfile == null) {
//					faceProfile = new FaceProfile();
//					faceProfile.setEmployee(employeeRepo.findOne(request.getEmployeeId()));
//				}
//				faceProfile.setProfileData(responseStr);
//				faceProfileRepo.save(faceProfile);
//				resp.setStatus("success");
//				resp.setStatusMessage("Face detected successfully");
//			}
//		}
//		return resp;
//	}
//
//	private void callDetectApi(String imageUrl) {
//		String apiUrl = env.getProperty("facedetection.api.url");
//		String apiKey = env.getProperty("facedetection.api.apiKey");
//		String apiId = env.getProperty("facedetection.api.apiId");
//
//		CloseableHttpClient client = HttpClients.createDefault();
//        HttpPost post = new HttpPost(apiUrl);
//		log.debug("Face Recognition request apiUrl  - "+ apiUrl);
//		log.debug("Face Recognition request apiId  - "+ apiId);
//		log.debug("Face Recognition request apiKey  - "+ apiKey);
//
//        try {
//
//        		StringEntity input = new StringEntity("{\"image\":" + imageUrl + "\"}");
//        		//input.setContentType("application/json");
//        	    post.setEntity(input);
//            post.setHeader("api_id", apiId);
//            post.setHeader("api_key", apiKey);
//            post.setHeader("Accept", "application/json");
//            post.setHeader("Content-Type", "application/json");
//
//        		HttpResponse response = client.execute(post);
//
//            BufferedReader rd = new BufferedReader(new InputStreamReader(
//                    response.getEntity().getContent()));
//            String line = "";
//            while ((line = rd.readLine()) != null) {
//                log.debug(line);
//            }
//
//        } catch (IOException e) {
//            log.error("Error while calling face detection api",e);
//        }
//	}
//
//
//	private KairosResponse callFaceDetectionService(String imageUrl) {
//		String apiUrl = env.getProperty("facedetection.api.url");
//		String apiKey = env.getProperty("facedetection.api.apiKey");
//		String apiId = env.getProperty("facedetection.api.apiId");
//		String response = null;
//		KairosResponse resp = null;
//		try {
//			RestTemplate restTemplate = new RestTemplate();
//			MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
//			jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
//			restTemplate.getMessageConverters().add(jsonHttpMessageConverter);
//			JSONObject apiReq = new JSONObject();
//			apiReq.put("image", imageUrl);
//
////			log.debug("Face Recognition request - "+ apiReq);
////			log.debug("Face Recognition request - "+ apiReq);
//			log.debug("Face Recognition request apiUrl  - "+ apiUrl);
//			log.debug("Face Recognition request apiId  - "+ apiId);
//			log.debug("Face Recognition request apiKey  - "+ apiKey);
//			log.debug("Face Recognition request body  - "+ apiReq.toString());
//
//
//			MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
//	        Map<String, String> map = new HashMap<String, String>();
//	        map.put("Content-Type", "application/json");
//	        map.put("app_id", apiId);
//	        map.put("app_key", apiKey);
//
//	        headers.setAll(map);
//
//	        HttpHeaders httpHeaders = new HttpHeaders();
//	        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
//	        httpHeaders.add("app_id", apiId);
//	        httpHeaders.add("app_key", apiKey);
//
//	        String reqJson = "{\"image\" : \""+ imageUrl  + "\"}" ;
//
//	        HttpEntity<String> requestEntity = new HttpEntity<String>(reqJson, httpHeaders);
//
//	        resp = restTemplate.postForObject(apiUrl, requestEntity, KairosResponse.class);
////	        log.debug("response from face detection service="+resp);
////	        log.debug("response from face detection service="+response);
//
//	        //log.debug("Response ="+ response.getBody());
//		}catch(Exception e) {
//			log.error("Error while calling face detection service ",e);
//		}
//		return resp;
//
//	}
//
//	private KairosResponse callEnroll(String imageUrl, String name) {
//		String apiUrl = env.getProperty("facedetection.api.enrollUrl");
//		String apiKey = env.getProperty("facedetection.api.apiKey");
//		String apiId = env.getProperty("facedetection.api.apiId");
//		String response = null;
//		KairosResponse resp = null;
//		try {
//			RestTemplate restTemplate = new RestTemplate();
//			MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
//			jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
//			restTemplate.getMessageConverters().add(jsonHttpMessageConverter);
//			JSONObject apiReq = new JSONObject();
//			apiReq.put("image", imageUrl);
//			apiReq.put("subject_id", name);
//			apiReq.put("gallery_name", "Employee");
//
////			log.debug("Face Recognition request - "+ apiReq);
////			log.debug("Face Recognition request - "+ apiReq);
//			log.debug("Face Recognition request apiUrl  - "+ apiUrl);
//			log.debug("Face Recognition request apiId  - "+ apiId);
//			log.debug("Face Recognition request apiKey  - "+ apiKey);
////			log.debug("Face Recognition request body  - "+ apiReq.toString());
//
//
//			MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
//	        Map<String, String> map = new HashMap<String, String>();
//	        map.put("Content-Type", "application/json");
//	        map.put("app_id", apiId);
//	        map.put("app_key", apiKey);
//
//	        headers.setAll(map);
//
//	        HttpHeaders httpHeaders = new HttpHeaders();
//	        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
//	        httpHeaders.add("app_id", apiId);
//	        httpHeaders.add("app_key", apiKey);
//
//	        HttpEntity<String> requestEntity = new HttpEntity<String>(apiReq.toString(), httpHeaders);
//
//	        resp = restTemplate.postForObject(apiUrl, requestEntity, KairosResponse.class);
//	        log.debug("response from face detection service="+resp);
//	        log.debug("response from face detection service="+response);
//
//	        //log.debug("Response ="+ response.getBody());
//		}catch(Exception e) {
//			log.error("Error while calling face detection service ",e);
//		}
//		return resp;
//
//	}
//
//
//	private KairosVerifyResponse callVerify(String imageUrl, String name) {
//		String apiUrl = env.getProperty("facedetection.api.verifyUrl");
//		String apiKey = env.getProperty("facedetection.api.apiKey");
//		String apiId = env.getProperty("facedetection.api.apiId");
//		String response = null;
//		KairosVerifyResponse resp = null;
//		try {
//			RestTemplate restTemplate = new RestTemplate();
//			MappingJackson2HttpMessageConverter jsonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
//			jsonHttpMessageConverter.getObjectMapper().configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
//			restTemplate.getMessageConverters().add(jsonHttpMessageConverter);
//			JSONObject apiReq = new JSONObject();
//			apiReq.put("image", imageUrl);
//			apiReq.put("subject_id", name);
//			apiReq.put("gallery_name", "Employee");
//
//			log.debug("Face Recognition request - "+ apiReq);
//			log.debug("Face Recognition request - "+ apiReq);
//			log.debug("Face Recognition request apiUrl  - "+ apiUrl);
//			log.debug("Face Recognition request apiId  - "+ apiId);
//			log.debug("Face Recognition request apiKey  - "+ apiKey);
//			log.debug("Face Recognition request body  - "+ apiReq.toString());
//
//
//			MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
//	        Map<String, String> map = new HashMap<String, String>();
//	        map.put("Content-Type", "application/json");
//	        map.put("app_id", apiId);
//	        map.put("app_key", apiKey);
//
//	        headers.setAll(map);
//
//	        HttpHeaders httpHeaders = new HttpHeaders();
//	        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
//	        httpHeaders.add("app_id", apiId);
//	        httpHeaders.add("app_key", apiKey);
//
//	        HttpEntity<String> requestEntity = new HttpEntity<String>(apiReq.toString(), httpHeaders);
//
//	        resp = restTemplate.postForObject(apiUrl, requestEntity, KairosVerifyResponse.class);
//	        log.debug("response from face detection service="+resp);
//	        log.debug("response from face detection service="+response);
//
//	        //log.debug("Response ="+ response.getBody());
//		}catch(Exception e) {
//			log.error("Error while calling face detection service ",e);
//		}
//		return resp;
//
//	}

    private void getCongfigData(){
        apiUrl = env.getProperty("facedetection.api.url");
        apiKey = env.getProperty("facedetection.api.apiKey");
        groupId = env.getProperty("facedetection.api.groupId");
        personId = env.getProperty("facedetection.api.personId");
    }

    public JSONObject enrollPerson(String name) throws JSONException {

        getCongfigData();

        String body = "{\"name\":"+"\""+name+"\"}";

        JSONObject responseData = new JSONObject();
        HttpClient httpclient = new DefaultHttpClient();

        try {
            URIBuilder builder = new URIBuilder(
                apiUrl + "persongroups/" + groupId + "/persons" );

            // Prepare the URI for the REST API call.
            URI uri = builder.build();
            HttpPost request = new HttpPost(uri);

            // Request headers.
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", apiKey);

            // Request body.
            log.debug("Name before send - "+body);
            StringEntity reqEntity = new StringEntity(body);
            request.setEntity(reqEntity);

            // Execute the REST API call and get the response entity.
            HttpResponse response = httpclient.execute(request);

            log.debug("Enroll Person\n" + response);

            HttpEntity entity = response.getEntity();

            if (entity != null) {
                int code = response.getStatusLine().getStatusCode();
                if (code == 200) {
                    log.debug("200");
                    log.debug("Success response"+entity.toString());
                    String jsonString = EntityUtils.toString(entity).trim();
                    log.debug(jsonString);

                    responseData = new JSONObject(jsonString);
                } else {
                    responseData = new JSONObject("failed");
                    System.out.println("Response: code " + code);
                }

            } else {
                responseData = new JSONObject("failed");
            }
        } catch (Exception e) {
            // Display error message.
            System.out.println(e.getMessage());
            responseData = new JSONObject("failed");
        }
        return responseData;
    }


    public JSONObject EnrollImage(EmployeeDTO employee, String faceId) throws JSONException {

        getCongfigData();

        String imageUrl="";

        JSONObject responseData = new JSONObject();
        HttpClient httpclient = new DefaultHttpClient();

        try {
            URIBuilder builder = new URIBuilder(
                apiUrl + "persongroups/" + groupId + "/persons/" + faceId + "/persistedFaces");

            log.debug("FAceId - :"+faceId);
            log.debug("Face url:"+employee.getUrl());
            // Prepare the URI for the REST API call.
            URI uri = builder.build();
            HttpPost request = new HttpPost(uri);
            imageUrl = "{\"url\":\""+employee.getUrl()+"\"}";

            // Request headers.
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", apiKey);

            // Request body.
            StringEntity reqEntity = new StringEntity(imageUrl);
            request.setEntity(reqEntity);

            // Execute the REST API call and get the response entity.
            HttpResponse response = httpclient.execute(request);

            log.debug("EnrollImage\n" + response);

            HttpEntity entity = response.getEntity();

            if (entity != null) {
                int code = response.getStatusLine().getStatusCode();
                if (code == 200) {
                    log.debug("200");
                    log.debug("Success response"+entity.toString());
                    String jsonString = EntityUtils.toString(entity).trim();
                    log.debug(jsonString);

                    JSONObject jsonArray = new JSONObject(jsonString);
                    log.debug("Person id after saving",jsonArray);

                    responseData = jsonArray;
                } else {
                    responseData = new JSONObject("failed");
                    System.out.println("Response: code " + code);
                }

            } else {
                responseData = new JSONObject("failed");
            }
        } catch (Exception e) {
            // Display error message.
            System.out.println(e.getMessage());
            responseData = new JSONObject("failed");
        }
        return responseData;
    }

    public void TainGroup() {
        HttpClient httpclient = new DefaultHttpClient();

        try {
            URIBuilder builder = new URIBuilder(apiUrl + "persongroups/" + groupId + "/train");

            // Prepare the URI for the REST API call.
            URI uri = builder.build();
            HttpPost request = new HttpPost(uri);

            // Request headers.
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", apiKey);

            // Execute the REST API call and get the response entity.
            HttpResponse response = httpclient.execute(request);

            System.out.println("TainGroup\n" + response);

            HttpEntity entity = response.getEntity();

            if (entity != null) {
                int code = response.getStatusLine().getStatusCode();
                if (code == 202) {
                    System.out.println("202");
                    // String jsonString = EntityUtils.toString(entity).trim();
                    // System.out.println(jsonString);
                    //
                    // JSONObject jsonArray = new JSONObject(jsonString);
                    // System.out.println(jsonArray.get("persistedFaceId"));

                } else {
                    System.out.println("Response: code " + code);
                }

            }
        } catch (Exception e) {
            // Display error message.
            System.out.println(e.getMessage());
        }
    }

    public void TrainedStatus() {
        HttpClient httpclient = new DefaultHttpClient();

        try {
            URIBuilder builder = new URIBuilder(apiUrl + "persongroups/" + groupId + "/training");
//            System.out.println(uriBase + "persongroups/" + personGroupId + "/training");
            // Prepare the URI for the REST API call.
            URI uri = builder.build();
            HttpGet request = new HttpGet(uri);

            // Request headers.
//			request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", apiKey);

            // Execute the REST API call and get the response entity.
            HttpResponse response = httpclient.execute(request);

            System.out.println("TrainedStatus\n" + response);

            HttpEntity entity = response.getEntity();

            if (entity != null) {
                int code = response.getStatusLine().getStatusCode();
                if (code == 200) {
                    System.out.println("200");
                    String jsonString = EntityUtils.toString(entity).trim();
                    System.out.println(jsonString);

                    JSONObject jsonObj = new JSONObject(jsonString);
                    String status = jsonObj.getString("status");
                    System.out.println(status);

                    if (status.equalsIgnoreCase("succeeded")) {
                        System.out.println("Response: success " + status);
                    } else {
                        System.out.println("Response: error " + status);
                    }

                } else {
                    System.out.println("Response: code " + code);
                }

            }
        } catch (Exception e) {
            // Display error message.
            System.out.println(e.getMessage());
        }
    }

    public String[] detectImage(String input) {

        getCongfigData();

        String resp[] = new String[2];
        HttpClient httpclient = new DefaultHttpClient();

        String imageUrl = "";

        try {
            URIBuilder builder = new URIBuilder(apiUrl + "detect");
            imageUrl = "{\"url\":\""+input+"\"}";


            // Request parameters. All of them are optional.
            builder.setParameter("returnFaceId", "true");
            builder.setParameter("returnFaceLandmarks", "true");
//            builder.setParameter("returnFaceAttributes", faceAttributes);

            // Prepare the URI for the REST API call.
            URI uri = builder.build();
            HttpPost request = new HttpPost(uri);

            log.debug("Azure url --- : "+uri);
            // Request headers.
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", apiKey);


            // Request body.
            StringEntity reqEntity = new StringEntity(imageUrl);
            request.setEntity(reqEntity);

            log.debug("Azure url header --- : "+request);


            // Execute the REST API call and get the response entity.
            HttpResponse response = httpclient.execute(request);

            log.debug("detectImage:" + response);

            HttpEntity entity = response.getEntity();

            if (entity != null) {
                // Format and display the JSON response.
                log.debug("detectImage: "+ entity.toString());

                int code = response.getStatusLine().getStatusCode();
                String jsonString = EntityUtils.toString(entity).trim();
                if (code == 200) {
                    log.debug("200"+jsonString);
                    System.out.println(jsonString);

                    JSONArray jsonObj = new JSONArray(jsonString);
                    JSONObject status = jsonObj.getJSONObject(0);
                    String faceID = status.getString("faceId");
                    log.debug("Face Id"+faceID);

                    resp[0] = "success";
                    resp[1] = faceID;
//                    IdentifyImage(faceID);

                } else {
                    log.debug("Response: code " + response.getStatusLine());
                    log.debug("Response: code " + response);
                    JSONObject jsonObj = new JSONObject(jsonString);
                    JSONObject status = jsonObj.getJSONObject("error");

                    resp[0] = "failed";
                    resp[1] = getErrorData(jsonString);//status.getString("code");
                }

            }else{
                resp[0] = "failed";
            }
        } catch (Exception e) {
            // Display error message.
            log.debug(e.getMessage());
        }
        return resp;
    }

    public String[] IdentifyImage(String faceId) {
        String resp[] = new String[2];
        HttpClient httpclient = new DefaultHttpClient();

        try {
            URIBuilder builder = new URIBuilder(apiUrl + "identify");

            // Prepare the URI for the REST API call.
            URI uri = builder.build();
            HttpPost request = new HttpPost(uri);

            // Request headers.
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", apiKey);

            // Request body.
            JSONObject jObj = new JSONObject();
            jObj.accumulate("personGroupId", groupId);
//			jObj.accumulate("maxNumOfCandidatesReturned", 1);
//			jObj.accumulate("confidenceThreshold", 0.5);

            String vr[] = new String[1];
            vr[0] = faceId;
            jObj.accumulate("faceIds", vr);

            System.out.println("IdentifyImage:\n" + jObj.toString());

            StringEntity reqEntity = new StringEntity(jObj.toString());
            request.setEntity(reqEntity);

            // Execute the REST API call and get the response entity.
            HttpResponse response = httpclient.execute(request);

            System.out.println("IdentifyImage:\n" + response);

            HttpEntity entity = response.getEntity();

            if (entity != null) {
                // Format and display the JSON response.
                System.out.println("IdentifyImage:\n");

                int code = response.getStatusLine().getStatusCode();
                String jsonString = EntityUtils.toString(entity).trim();
                if (code == 200) {
                    System.out.println("200");

                    System.out.println(jsonString);

//					JSONObject jsonObj = new JSONObject(jsonString);
                    JSONArray jsonArray = new JSONArray(jsonString);
                    JSONObject status = jsonArray.getJSONObject(0);
                    String faceID = status.getString("faceId");
                    System.out.println(faceID);
                    JSONArray candidatesArray = status.getJSONArray("candidates");
                    System.out.println(candidatesArray);
                    if (candidatesArray.length() > 0) {
                        String personId = candidatesArray.getJSONObject(0).getString("personId");
                        System.out.println(personId);
                        resp[0] = "success";
                        resp[1] = personId;

//                        verifyImage(faceID, personId);

                    } else {
                        resp[0] = "failed";
                        resp[1] = "No match found";
                        System.out.println("No match found");
                    }

                } else {
                    resp[0] = "failed";
                    resp[1] = getErrorData(jsonString);
                    System.out.println("Response: code " + code);
                }

            }
        } catch (Exception e) {
            // Display error message.
            System.out.println(e.getMessage());
        }
        return resp;
    }

    public String[] verifyImage(String personId, String faceId) {
        String[] response = new String[3];
        HttpClient httpclient = new DefaultHttpClient();

        try {
            URIBuilder builder = new URIBuilder(apiUrl + "verify");

            // Prepare the URI for the REST API call.
            URI uri = builder.build();
            HttpPost request = new HttpPost(uri);

            // Request headers.
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", apiKey);

            // Request body.
            JSONObject jObj = new JSONObject();
            jObj.accumulate("personGroupId", groupId);
            jObj.accumulate("faceId", faceId);
            jObj.accumulate("personId", personId);

            StringEntity reqEntity = new StringEntity(jObj.toString());
            request.setEntity(reqEntity);

            // Execute the REST API call and get the response entity.
            HttpResponse resp = httpclient.execute(request);

            log.debug("verifyImage:\n" + resp);

            HttpEntity entity = resp.getEntity();

            if (entity != null) {
                // Format and display the JSON response.
                log.debug("verifyImage:"+entity.toString());

                int code = resp.getStatusLine().getStatusCode();
                String jsonString = EntityUtils.toString(entity).trim();
                if (code == 200) {
                    System.out.println("200");

                    log.debug(jsonString);

                    JSONObject jsonObj = new JSONObject(jsonString);
                    boolean isIdentical = jsonObj.getBoolean("isIdentical");
                    Double confidence = jsonObj.getDouble("confidence");
                    log.debug("is identical"+isIdentical);
                    log.debug("concidence"+confidence);

                    if(isIdentical){
                        response[0] = "success";
                        response[1] = ""+isIdentical;
                        response[2] = ""+confidence;
                    }else{
                        log.debug("Response: code " + code);

                        response[0] = "failed";
                        response[1] = getErrorData(jsonString);
                    }





                } else {
                    log.debug("Response: code " + code);
                    response[0] = "failed";
                    response[1] = getErrorData(jsonString);
                }

            }
        } catch (Exception e) {
            // Display error message.
            log.debug(e.getMessage());
        }
        return response;
    }

    private String getErrorData(String jsonString){
        String response = "";
        try{
            JSONObject jsonObj = new JSONObject(jsonString);
            JSONObject status = jsonObj.getJSONObject("error");
            response = status.getString("code");
        }catch (Exception e){
            System.out.println("getErrorData -> "+e);
        }
        return response;
    }
}

