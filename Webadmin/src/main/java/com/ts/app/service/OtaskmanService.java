package com.ts.app.service;

import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;

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

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Positions;
import com.ts.app.repository.PositionsRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.EmpDTO;
import com.ts.app.web.rest.dto.PositionDTO;


@Service
@Transactional
public class OtaskmanService {

	@Autowired
	RestTemplate restTemplete;

	@Value("${onBoarding.empRetrieve}")
    private String URL_ORACLE;
	
	@Autowired
	private PositionsRepository positionsRepository; 
 
	public String getBranchProjectWbs() {
 
		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<String> entity = new HttpEntity<String>(new String(), headers);
		
		ResponseEntity<String> response = restTemplete.exchange(URL_ORACLE+"getBranchProjctWBSHierarchy",
				HttpMethod.GET, entity, String.class);
		
		return response.getBody();
		
	}
	
	public List<Positions> getPositionsWithGrossByWBSID(String wbsId) throws Exception{

		return positionsRepository.findByWbsId(wbsId);
 		 
	}
	
	public void syncPositionsWithGross() throws Exception{

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<String> entity = new HttpEntity<String>(new String(), headers);
		
		ResponseEntity<List<PositionDTO>> response = restTemplete.exchange(URL_ORACLE+"getPositionsWithGross",
				HttpMethod.GET, entity, new ParameterizedTypeReference<List<PositionDTO>>() {});
		
		List<PositionDTO>  postions = response.getBody();
		
		if(postions!=null) {
			
			positionsRepository.deleteAll();
			
			for(PositionDTO positon : postions)
			{
			
				Positions newPosition  = new Positions();
				
				newPosition.setGrossAmount(positon.getGrossAmount());
				newPosition.setPositionDesc(positon.getPositionDesc());
				newPosition.setPositionId(positon.getPositionId());
				newPosition.setWbsId(positon.getWbsId());
				positionsRepository.save(newPosition); 
				
				
			}
			 
		}
		
	}
}
