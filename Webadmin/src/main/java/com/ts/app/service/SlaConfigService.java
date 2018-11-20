package com.ts.app.service;

import com.ts.app.domain.*;
import com.ts.app.repository.*;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.*;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class SlaConfigService extends AbstractService {
	
	private final Logger log = LoggerFactory.getLogger(SlaConfigService.class);

	@Inject
    private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;
	
	@Inject
	private SlaConfigRepository slaconfigrepository;
	
	@Inject
	private SiteRepository siterepository;
	
	@Inject
	private ProjectRepository projectrepository;
	
	@Inject
	private SLAEscalationConfigRepository slaescalationconfigrepository;
	
	@Inject
	private SLANotificationLogRepository slaNotificationLogRepository;
	
	@Inject
	private TicketRepository ticketRepository;
	
	@Inject
	private JobRepository jobRepository;
		
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
		log.debug("slaConfig createdby and date " + slaConfig.getCreatedBy() + " " + slaConfig.getCreatedDate());
		Set<SlaEscalationConfig> slaEscalationConfigs = new HashSet<SlaEscalationConfig>();
		slaConfig = mapToEntitySla(slaconfigdto,slaConfig);
		Set<SlaEscalationConfigDTO> slaEscalationConfigDTO = slaconfigdto.getSlaesc();
		Set<SlaEscalationConfig> deleteSlaEscalationConfigs = slaConfig.getSlaesc();
		for(SlaEscalationConfigDTO slaEscConfig : slaEscalationConfigDTO) {
			SlaEscalationConfig slaEscalationConfig = new SlaEscalationConfig();
			for(SlaEscalationConfig deleteSlaEscalationConfig : deleteSlaEscalationConfigs)
			{
				if(slaEscConfig.getId() != null)
				{
					if(slaEscConfig.getId()!= deleteSlaEscalationConfig.getId())
					{
						slaescalationconfigrepository.delete(deleteSlaEscalationConfig.getId());
					}
				}
			}
			if(slaEscConfig.getId() == null) 
			{
				boolean status = true; 
				for(SlaEscalationConfig deleteSlaEscalationConfig : deleteSlaEscalationConfigs)
				{
				if(slaEscConfig.getLevel() == deleteSlaEscalationConfig.getLevel())
					status =false;
				}
				if(status == true)
				{
					slaEscalationConfig= mapperUtil.toEntity(slaEscConfig, SlaEscalationConfig.class);
					slaEscalationConfig.setSla(slaConfig);
					slaescalationconfigrepository.save(slaEscalationConfig);
				}
			}
			else 
			{
				slaEscalationConfig.setId(slaEscConfig.getId());
				slaEscalationConfig.setLevel(slaEscConfig.getLevel());
				slaEscalationConfig.setHours(slaEscConfig.getHours());
				slaEscalationConfig.setMinutes(slaEscConfig.getMinutes());
				slaEscalationConfig.setEmail(slaEscConfig.getEmail());
				slaEscalationConfig.setCreatedBy(slaEscConfig.getCreatedBy());
				slaEscalationConfig.setCreatedDate(slaEscConfig.getCreatedDate());
				slaEscalationConfig.setSla(slaConfig);
				slaEscalationConfigs.add(slaEscalationConfig);
			}
		} 
		slaConfig.setSlaesc(slaEscalationConfigs);
		slaconfigrepository.save(slaConfig);
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
	
	public SlaConfigDTO searchSelectedSLA(long id) {
		log.debug("*******SLA Service Selected SLA **********");
		SlaConfig entity = slaconfigrepository.findOne(id);
		return mapperUtil.toModel(entity, SlaConfigDTO.class);
	}
	
	public SearchResult<SlaConfigDTO> findBySlaList(SearchCriteria searchCriteria) {
		SearchResult<SlaConfigDTO> result = new SearchResult<SlaConfigDTO>();
		if(searchCriteria != null) {
            Pageable pageRequest = null;
            /*if(!StringUtils.isEmpty(searchCriteria.getColumnName())){
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" +sort);
                pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);

            }else{*/
                pageRequest = createPageRequest(searchCriteria.getCurrPage());
            //}
            Page<SlaConfig> page = null;
			List<SlaConfigDTO> transactions = null;
			log.debug("Site id = "+ searchCriteria.getSiteId());
			if(!searchCriteria.isFindAll()) {
				if(searchCriteria.getSiteId() != 0) {
						
					page = slaconfigrepository.findSlaBySiteId(searchCriteria.getSiteId(), pageRequest);
					log.debug("page content " + page);
				}else {
					page = slaconfigrepository.findActiveAllSlaConfig(pageRequest);
				}
			}
			if(page != null) {
				//transactions = mapperUtil.toModelList(page.getContent(), SiteDTO.class);
				if(transactions == null) {
					transactions = new ArrayList<SlaConfigDTO>();
				}
				List<SlaConfig> slaList =  page.getContent();
				if(CollectionUtils.isNotEmpty(slaList)) {
					for(SlaConfig sla : slaList) {
						transactions.add(mapToModel(sla));
					}
				}
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}

		}
		return result;
	}
	
	private void buildSearchResult(SearchCriteria searchCriteria, Page<SlaConfig> page, List<SlaConfigDTO> transactions, SearchResult<SlaConfigDTO> result) {
		if(page != null) {
			result.setTotalPages(page.getTotalPages());
		}
		result.setCurrPage(page.getNumber() + 1);
		result.setTotalCount(page.getTotalElements());
        result.setStartInd((result.getCurrPage() - 1) * 10 + 1);
        result.setEndInd((result.getTotalCount() > 10  ? (result.getCurrPage()) * 10 : result.getTotalCount()));

		result.setTransactions(transactions);
	}
	
	private SlaConfigDTO mapToModel(SlaConfig sla) 
	{
		SlaConfigDTO slaConfigDTO = new SlaConfigDTO();
		Set<SlaEscalationConfig> slaEscalationConfigs = new HashSet<SlaEscalationConfig>();
		Set<SlaEscalationConfigDTO> slaEscalationConfigDTOs = new HashSet<SlaEscalationConfigDTO>();
		slaConfigDTO.setId(sla.getId());
		slaConfigDTO.setProjectId(sla.getProject().getId());
		slaConfigDTO.setProjectName(sla.getProject().getName());
		slaConfigDTO.setSiteId(sla.getSite().getId());
		slaConfigDTO.setSiteName(sla.getSite().getName());
		slaConfigDTO.setProcessType(sla.getProcessType());
		slaConfigDTO.setCategory(sla.getCategory());
		slaConfigDTO.setSeverity(sla.getSeverity());
		slaConfigDTO.setHours(sla.getHours());
		slaEscalationConfigs = sla.getSlaesc();
		for(SlaEscalationConfig slaEscalationConfig : slaEscalationConfigs)
		{
			SlaEscalationConfigDTO slaEscalationConfigDTO = new SlaEscalationConfigDTO();
			slaEscalationConfigDTO.setId(slaEscalationConfig.getId());
			slaEscalationConfigDTO.setLevel(slaEscalationConfig.getLevel());
			slaEscalationConfigDTO.setHours(slaEscalationConfig.getHours());
			slaEscalationConfigDTO.setMinutes(slaEscalationConfig.getMinutes());
			slaEscalationConfigDTO.setEmail(slaEscalationConfig.getEmail());
			slaEscalationConfigDTOs.add(slaEscalationConfigDTO);
		}
		slaConfigDTO.setSlaesc(slaEscalationConfigDTOs);
		return slaConfigDTO;
	}
	
	@Transactional(propagation =  Propagation.REQUIRES_NEW)
	public void slaEscalationNotificationSave(SLANotificationLog slaNotificationLog) 
	{
		slaNotificationLogRepository.save(slaNotificationLog);
	}
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void slaTicketEscalationStatusUpdate(Ticket ticket)
	{
		ticketRepository.save(ticket);
	}
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void slaJobEscalationStatusUpdate(Job job)
	{
		jobRepository.save(job);
	}
	
}
