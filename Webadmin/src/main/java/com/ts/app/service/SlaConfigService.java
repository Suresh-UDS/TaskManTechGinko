package com.ts.app.service;

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
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.SlaConfigRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.SlaConfigDTO;

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
        sla = slaconfigrepository.save(sla);
        
        return slaconfigdto;
        
		}
	
	public SlaConfigDTO updateSLA(SlaConfigDTO slaconfigdto){
		log.debug("******SlaUpdateService" + slaconfigdto.getId());
		SlaConfig slaUpdate = slaconfigrepository.findOne(slaconfigdto.getId());
		mapToEntitySla(slaconfigdto, slaUpdate);
		slaUpdate = slaconfigrepository.saveAndFlush(slaUpdate);
		return mapperUtil.toModel(slaUpdate, SlaConfigDTO.class);
	}
	
	public void mapToEntitySla(SlaConfigDTO sla, SlaConfig slaUpdate){
		slaUpdate.setId(sla.getId());
		slaUpdate.setProcessType(sla.getProcessType());
		slaUpdate.setCategory(sla.getCategory());
		slaUpdate.setSeverity(sla.getSeverity());
		slaUpdate.setLevel(sla.getLevel());
		slaUpdate.setEhrs1(sla.getEhrs1());
		slaUpdate.setEmins1(sla.getEmins1());
		slaUpdate.setEhrs2(sla.getEhrs2());
		slaUpdate.setEmins2(sla.getEmins2());
		slaUpdate.setEhrs3(sla.getEhrs3());
		slaUpdate.setEmins3(sla.getEmins3());
		slaUpdate.setEhrs4(sla.getEhrs4());
		slaUpdate.setEmins4(sla.getEmins4());
		slaUpdate.setEmail1(sla.getEmail1());
		slaUpdate.setEmail2(sla.getEmail2());
		slaUpdate.setEmail3(sla.getEmail3());
		slaUpdate.setEmail4(sla.getEmail4());
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
		for (SlaConfig loc : slalist) {
		SlaConfigDTO dto = new SlaConfigDTO();
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
		sla.setLevel(slaUpdate.getLevel());
		sla.setEhrs1(slaUpdate.getEhrs1());
		sla.setEmins1(slaUpdate.getEmins1());
		sla.setEhrs2(slaUpdate.getEhrs2());
		sla.setEmins2(slaUpdate.getEmins2());
		sla.setEhrs3(slaUpdate.getEhrs3());
		sla.setEmins3(slaUpdate.getEmins3());
		sla.setEhrs4(slaUpdate.getEhrs4());
		sla.setEmins4(slaUpdate.getEmins4());
		sla.setEmail1(slaUpdate.getEmail1());
		sla.setEmail2(slaUpdate.getEmail2());
		sla.setEmail3(slaUpdate.getEmail3());
		sla.setEmail4(slaUpdate.getEmail4());
		return sla;
	}
}