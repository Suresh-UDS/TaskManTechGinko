package com.ts.app.service;

import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

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
import com.ts.app.domain.SlaEscalationConfig;
import com.ts.app.repository.ProjectRepository;
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
		if(slaconfigdto.getId() > 0) {
			updateSLA(slaconfigdto);
		}else {
			SlaConfig slaConfig = mapperUtil.toEntity(slaconfigdto, SlaConfig.class);
			Set<SlaEscalationConfigDTO> slaEscalationConfigDTOs = slaconfigdto.getSlaesc();
			Set<SlaEscalationConfig> slaEscalationConfigs = new HashSet<SlaEscalationConfig>();
			for(SlaEscalationConfigDTO slaEscalationConfigDTO : slaEscalationConfigDTOs) {
				SlaEscalationConfig slaEscalationConfig = mapperUtil.toEntity(slaEscalationConfigDTO, SlaEscalationConfig.class);
				slaEscalationConfig.setSla(slaConfig);
				slaEscalationConfigs.add(slaEscalationConfig);
			}
			Set<SlaEscalationConfig> slaEscalationConfigset = new HashSet<SlaEscalationConfig>();
			slaEscalationConfigset.addAll(slaEscalationConfigs);
			slaConfig.setSlaesc(slaEscalationConfigset);
			if(slaconfigdto.getProjectId() > 0) {
				Project project = projectrepository.findOne(slaconfigdto.getProjectId());
				slaConfig.setProject(project);
			}else {
				slaConfig.setProject(null);
			}
			if(slaconfigdto.getSiteId() > 0) {
				Site site = siterepository.findOne(slaconfigdto.getSiteId());
				slaConfig.setSite(site);
			}else {
				slaConfig.setSite(null);
			}
			slaConfig.setActive(SlaConfig.ACTIVE_YES);
			slaConfig = slaconfigrepository.save(slaConfig);
			log.debug("Created Information for SlaConfig: {}", slaConfig);
			slaconfigdto = mapperUtil.toModel(slaConfig, SlaConfigDTO.class);
		}
		return slaconfigdto;
        
		}
	
	public void updateSLA(SlaConfigDTO slaconfigdto){
		log.debug("******SlaUpdateService" + slaconfigdto.getId());
		SlaConfig slaConfig = slaconfigrepository.findOne(slaconfigdto.getId());
		Set<SlaEscalationConfigDTO> slaEscalationConfigDTOs = slaconfigdto.getSlaesc();
		Set<SlaEscalationConfig> slaEscalationConfig = slaConfig.getSlaesc();
		Iterator<SlaEscalationConfig> slaItr = slaEscalationConfig.iterator();
		while(slaItr.hasNext()) {
			boolean slaFound = false;
			SlaEscalationConfig slaEntity = slaItr.next();
			for(SlaEscalationConfigDTO slaEscalationConfigDTO : slaEscalationConfigDTOs) {
				if(slaEntity.getId() == slaEscalationConfigDTO.getId()) {
					slaFound = true;
					break;
			}
		}
			log.debug("slaFound "+slaFound);
			if(!slaFound) {
				slaItr.remove();
			}
		}
		for(SlaEscalationConfigDTO slaEscalationConfigDTO : slaEscalationConfigDTOs) {
			if(slaEscalationConfigDTO.getId() == 0) {
				SlaEscalationConfig slaEscConfig = mapperUtil.toEntity(slaEscalationConfigDTO, SlaEscalationConfig.class);
				slaEscConfig.setSla(slaConfig);
				slaConfig.getSlaesc().add(slaEscConfig);
			}
		}	
		log.debug("before save ="+slaConfig.getSlaesc());
		slaconfigrepository.save(slaConfig);
		log.debug("updated SLA: {}", slaConfig);
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
	
	public List<SlaConfigDTO> findAll() {
		log.debug(">>> get all SLA");
		List<SlaConfig> entities = slaconfigrepository.findActiveSlaConfig();
		return mapperUtil.toModelList(entities, SlaConfigDTO.class);
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