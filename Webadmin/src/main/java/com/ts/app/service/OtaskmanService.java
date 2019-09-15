package com.ts.app.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.client.RestTemplate;

import com.ts.app.web.rest.dto.EmpDTO;
import com.ts.app.web.rest.dto.PositionDTO;


@Service
@Transactional
public class OtaskmanService {

	@Autowired
	RestTemplate restTemplete;

	@Value("${onBoarding.empRetrieve}")
    private String URL_ORACLE;

	public String getBranchProjectWbs() {
 
		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<String> entity = new HttpEntity<String>(new String(), headers);
		
		ResponseEntity<String> response = restTemplete.exchange(URL_ORACLE+"getBranchProjctWBSHierarchy",
				HttpMethod.GET, entity, String.class);
		
		return response.getBody();
		
	}
	
	public List<PositionDTO> getPositionsWithGrossByWBSID(String wbsId) throws Exception{

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<String> entity = new HttpEntity<String>(new String(), headers);
		
		ResponseEntity<List<PositionDTO>> response = restTemplete.exchange(URL_ORACLE+"getPositionsWithGrossByWBSID/"+wbsId,
				HttpMethod.GET, entity, new ParameterizedTypeReference<List<PositionDTO>>() {});
		
		return response.getBody();
	}
}
