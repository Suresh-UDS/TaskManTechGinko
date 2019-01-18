package com.ts.app.web.rest;

import com.ts.app.ext.api.FaceRecognitionService;
import com.ts.app.web.rest.errors.TimesheetException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import javax.validation.Valid;

/**
 * REST controller for storing face detection information and verifying
 */
@RestController
@RequestMapping("/api")
public class FaceRecognitionResource {

    private final Logger log = LoggerFactory.getLogger(FaceRecognitionResource.class);

    @Inject
    private FaceRecognitionService faceRecognitionService;


    /**
     * POST /saveFaceProfile -> UserFaceProfile.
     */
//	@RequestMapping(value = "/face/profile", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
//	@Timed
//	public ResponseEntity<FaceRecognitionResponse> saveFaceProfile(@Valid @RequestBody FaceRecognitionRequest frRequest, HttpServletRequest request) {
//		log.info("Inside the method in concern" + frRequest.getEmployeeEmpId());
//		FaceRecognitionResponse resp = null;
//		try {
//			//log.debug("Logged in user id -" + SecurityUtils.getCurrentUserId());
//			//frRequest.setUserId(SecurityUtils.getCurrentUserId());
//			resp = faceRecognitionService.detect(frRequest);
//			resp = faceRecognitionService.enroll(frRequest);
//		}catch (Exception cve) {
//			log.error("Error while saving face profile info ",cve);
//			throw new TimesheetException(cve);
//		}
//		return new ResponseEntity<FaceRecognitionResponse>(resp,HttpStatus.CREATED);
//
//	}

    /**
     * POST /verifyFaceId
     */
//    @RequestMapping(value = "/face/verify",method = RequestMethod.POST)
//    public ResponseEntity<FaceRecognitionResponse> verifyFaceId(@Valid @RequestBody FaceRecognitionRequest frRequest, HttpServletRequest request) {
//		log.info("Inside the method in concern" + frRequest.getEmployeeEmpId());
//		FaceRecognitionResponse resp = null;
//		try {
//			//log.debug("Logged in user id -" + SecurityUtils.getCurrentUserId());
//			//frRequest.setUserId(SecurityUtils.getCurrentUserId());
//			resp = faceRecognitionService.verify(frRequest);
//		}catch (Exception cve) {
//			log.error("Error while saving face profile info ",cve);
//			throw new TimesheetException(cve);
//		}
//    	return new ResponseEntity<FaceRecognitionResponse>(resp,HttpStatus.FOUND);
//    }


    /**
     * POST /saveFaceProfile -> UserFaceProfile.
     */
//    @RequestMapping(value = "/face/enroll", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
//    @Timed
//    public String enrollFaceProfile(@Valid @RequestBody String body) {
//
////        FaceRecognitionResponse resp = null;
//        JSONObject jResp = new JSONObject();
//        try {
//            JSONObject jObj = new JSONObject(body);
//            JSONObject resp = faceRecognitionService.EnrollImage(jObj.toString());
//
//            if (StringUtils.isEmpty(resp.get("success"))) {
//                faceRecognitionService.TainGroup();
//                faceRecognitionService.TrainedStatus();
//                jResp.accumulate("status", "success");
//            } else {
//                jResp.accumulate("status", "failed");
//            }
//        } catch (Exception cve) {
//            log.error("Error while saving face profile info ", cve);
//            throw new TimesheetException(cve);
//        }
//        return jResp.toString();
//    }

    /**
     * POST /verifyFaceId
     */
    @RequestMapping(value = "/face/verify", method = RequestMethod.POST)
    public String verifyFaceId(@Valid @RequestBody String body) {
        JSONObject jResp = new JSONObject();
        String response = "", confidence="";
        try {
            JSONObject jObj = new JSONObject(body);
            String resp[] = faceRecognitionService.detectImage(jObj.toString());
            if (resp[0] == "success") {
                String identResp[] = faceRecognitionService.IdentifyImage(resp[1]);
                response = resp[1];
                if (identResp.length > 0) {
                    if (identResp[0].equalsIgnoreCase("success")) {
                        String[] finalResp = faceRecognitionService.verifyImage(resp[1], identResp[1]);
                        if (finalResp[0].equalsIgnoreCase("success")) {
                            response = finalResp[1];
                            confidence = finalResp[2];
                        } else {
                            response = finalResp[1];
                        }
                    } else {
                        response = "No Match Found !!";
                    }
                } else {
                    response = "Something went wrong!!";
                }

            } else {
                response = resp[1];
            }

            jResp.accumulate("status", response);
            jResp.accumulate("confidence", confidence);
        } catch (Exception cve) {
            log.error("Error while saving face profile info ", cve);
            throw new TimesheetException(cve);
        }

        return jResp.toString();
    }

}
