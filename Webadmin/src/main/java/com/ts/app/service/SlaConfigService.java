package com.ts.app.service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Asset;
import com.ts.app.domain.Project;
import com.ts.app.domain.Site;
import com.ts.app.domain.SlaConfig;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.domain.SlaEscalationConfig;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.SlaConfigRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.SlaConfigDTO;
import com.ts.app.web.rest.dto.SlaEscalationConfigDTO;

@Service
@Transactional
public class SlaConfigService {
	
	private final Logger log = LoggerFactory.getLogger(SlaConfigService.class);

	@Inject
    private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;
	
	@Inject
	private SlaConfigRepository slaconfigrepository;
	
	@Inject
	private SiteRepository siterepository;
	
	@Inject
	private ProjectRepository projectrepository;
	
	public SlaConfigDTO saveSla(SlaConfigDTO slaconfigdto){
		
		log.debug("*********SLA CONFIGURATION***********");

		SlaConfig sla = mapperUtil.toEntity(slaconfigdto, SlaConfig.class);
		Site site = siterepository.findOne(slaconfigdto.getSiteId());
        sla.setSite(site);
        sla.setActive(SlaConfig.ACTIVE_YES);
        List<SlaEscalationConfig> slaescalationconfig = new ArrayList<SlaEscalationConfig>();
        List<SlaEscalationConfigDTO> slaescconfigdtos = slaconfigdto.getSlaesc();
        for(SlaEscalationConfigDTO slaescconfigdto : slaescconfigdtos) {
        	SlaEscalationConfig slaescconfig = mapperUtil.toEntity(slaescconfigdto, SlaEscalationConfig.class);
        	slaescconfig.setLevel(slaescconfigdto.getLevel());
        	slaescconfig.setHours(slaescconfigdto.getHours());
        	slaescconfig.setMinutes(slaescconfigdto.getMinutes());
        	slaescconfig.setEmail(slaescconfigdto.getEmail());
        	slaescalationconfig.add(slaescconfig);
        }
        sla.setSlaesc(slaescalationconfig);
        sla = slaconfigrepository.save(sla);
        
        return slaconfigdto;
        
		}
	
	public String updateSLA(SlaConfigDTO slaconfigdto){
		log.debug("******SlaUpdateService" + slaconfigdto.getId());
		SlaConfig slaUpdate = slaconfigrepository.findOne(slaconfigdto.getId());
		slaUpdate = mapToEntitySla(slaconfigdto, slaUpdate);
		List<SlaEscalationConfig> slaescalationconfig = new ArrayList<SlaEscalationConfig>();
        List<SlaEscalationConfigDTO> slaescconfigdtos = slaconfigdto.getSlaesc();
       /* List<SlaEscalationConfig> slaescconfig1 = slaUpdate.getSlaesc();
		if(CollectionUtils.isNotEmpty(slaescconfig1)) {
			slaescconfig1.clear();
		}else {
			slaescconfig1 = new ArrayList<SlaEscalationConfig>();
		}*/
		for(SlaEscalationConfigDTO slaescconfigdto : slaescconfigdtos) {
        	SlaEscalationConfig slaescconfig = mapperUtil.toEntity(slaescconfigdto, SlaEscalationConfig.class);
        	log.debug("***********SlaEscID " + slaescconfigdto.getId());
        	//ZonedDateTime z = ZonedDateTime.now(ZoneId.systemDefault());
        	slaescconfig.setId(slaescconfigdto.getId());
        	//slaescconfig.setCreatedBy("anonymousUser");
        	//slaescconfig.setCreatedDate(z);
        	slaescconfig.setCreatedBy(slaUpdate.getCreatedBy());
        	slaescconfig.setCreatedDate(slaUpdate.getCreatedDate());
        	log.debug("***********SlaEscID " + slaescconfigdto.getCreatedBy() + slaescconfigdto.getCreatedDate());
        	slaescconfig.setLevel(slaescconfigdto.getLevel());
        	slaescconfig.setHours(slaescconfigdto.getHours());
        	slaescconfig.setMinutes(slaescconfigdto.getMinutes());
        	slaescconfig.setEmail(slaescconfigdto.getEmail());
        	slaescalationconfig.add(slaescconfig);
        }
		slaUpdate.setSlaesc(slaescalationconfig);
		slaUpdate = slaconfigrepository.saveAndFlush(slaUpdate);
		//mapperUtil.toModel(slaUpdate, SlaConfigDTO.class);
		return "success";
	}
	
	public SlaConfig mapToEntitySla(SlaConfigDTO sla, SlaConfig slaUpdate){
		slaUpdate.setId(sla.getId());
		slaUpdate.setProcessType(sla.getProcessType());
		slaUpdate.setCategory(sla.getCategory());
		slaUpdate.setSeverity(sla.getSeverity());
		slaUpdate.setHours(sla.getHours());
		return slaUpdate;
	}

	public void deleteSlaConfig(Long id) {
		log.debug(">>> Inside SlaConfig Delete Service");
		SlaConfig sladel= slaconfigrepository.findOne(id);
		sladel.setActive(Asset.ACTIVE_NO);
		slaconfigrepository.save(sladel);
	}
	
	public List<SlaConfigDTO> findAllSla() {
		log.debug(">>> get all SLA");
		List<SlaConfig> slalist = slaconfigrepository.findAll();
		List<SlaConfigDTO> sladto = new ArrayList<SlaConfigDTO>();
		SlaConfigDTO dto = new SlaConfigDTO();
		for (SlaConfig loc : slalist) {
		Long siteId = loc.getSite().getId();
		Site site = siterepository.findOne(siteId);
		dto.setSiteName(site.getName());
		Long prjId = site.getProject().getId();
		Project prj =projectrepository.findOne(prjId);
		dto.setProjectName(prj.getName());
		dto = mapToModelSla(dto, loc);
		sladto.add(dto);
		}
		
		return sladto;
	}
	
	public SlaConfigDTO mapToModelSla(SlaConfigDTO sla, SlaConfig slaUpdate){
		sla.setId(slaUpdate.getId());
		sla.setProcessType(slaUpdate.getProcessType());
		sla.setCategory(slaUpdate.getCategory());
		sla.setSeverity(slaUpdate.getSeverity());
		sla.setHours(slaUpdate.getHours());
		return sla;
	}
}