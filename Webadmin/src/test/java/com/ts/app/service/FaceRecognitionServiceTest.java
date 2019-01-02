package com.ts.app.service;

import javax.inject.Inject;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.ts.app.Application;
import com.ts.app.ext.api.FaceRecognitionService;
import com.ts.app.web.rest.dto.FaceRecognitionRequest;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
public class FaceRecognitionServiceTest {

	@Inject
	private FaceRecognitionService faceRecognitionService;
	
	@Test
	public void testDetect() {
		FaceRecognitionRequest request = new FaceRecognitionRequest();
		request.setImageUrl("https://media.kairos.com/liz.jpg");
		//faceRecognitionService.detect(request);
	}
}
