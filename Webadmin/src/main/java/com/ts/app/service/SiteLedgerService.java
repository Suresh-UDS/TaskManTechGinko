package com.ts.app.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Employee;
import com.ts.app.domain.Shift;
import com.ts.app.domain.Site;
import com.ts.app.domain.SiteLedger;
import com.ts.app.domain.User;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteLedgerRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.ShiftDTO;
import com.ts.app.web.rest.dto.SiteDTO;
import com.ts.app.web.rest.dto.SiteLedgerDTO;

/**
 * Service class for managing Site Ledger information.
 */
@Service
@Transactional
public class SiteLedgerService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(SiteLedgerService.class);

	@Inject
	private SiteRepository siteRepository;

	@Inject
	private UserRepository userRepository;

	@Inject
	private ProjectRepository projectRespository;

	@Inject
	private SiteLedgerRepository siteLedgerRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	public SiteLedgerDTO createSiteLedger(SiteLedgerDTO siteLedgerDto) {
		SiteLedger siteLedger = mapperUtil.toEntity(siteLedgerDto, SiteLedger.class);
		siteLedger.setSite(siteRepository.findOne(siteLedgerDto.getSiteId()));
		siteLedger = siteLedgerRepository.save(siteLedger);
		log.debug("Created Site Ledger Info: {}", siteLedger);
		siteLedgerDto = mapperUtil.toModel(siteLedger, SiteLedgerDTO.class);
		return siteLedgerDto;
	}

	private SiteLedgerDTO mapToModel(SiteLedger siteLedger, boolean includeShifts) {
		SiteLedgerDTO siteLedgerDTO = new SiteLedgerDTO();
		
		return siteLedgerDTO;
	}

	public List<SiteLedgerDTO> findAll() {
		List<SiteLedger> entities = siteLedgerRepository.findAll();
		return mapperUtil.toModelList(entities, SiteLedgerDTO.class);
	}

	public SiteLedgerDTO findOne(Long id) {
		SiteLedger entity = siteLedgerRepository.findOne(id);
		if(entity != null) {
			Hibernate.initialize(entity.getSite());
		}
		return mapperUtil.toModel(entity, SiteLedgerDTO.class);
	}
	
	public SearchResult<SiteLedgerDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		User user = userRepository.findOne(searchCriteria.getUserId());
		Hibernate.initialize(user.getEmployee());
		long empId = 0;
		if(user.getEmployee() != null) {
			empId = user.getEmployee().getId();
		}

        //-------
		SearchResult<SiteLedgerDTO> result = new SearchResult<SiteLedgerDTO>();
		if(searchCriteria != null) {
            Pageable pageRequest = null;
            if(!StringUtils.isEmpty(searchCriteria.getColumnName())){
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" +sort);
                pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);

            }else{
                pageRequest = createPageRequest(searchCriteria.getCurrPage());
            }
            Page<SiteLedger> page = null;
			List<SiteLedgerDTO> transactions = null;
			log.debug("Site id = "+ searchCriteria.getSiteId());
			if(searchCriteria.getSiteId() != 0) {
				page = siteLedgerRepository.findSiteLedgersBySiteId(searchCriteria.getSiteId(), pageRequest);
			}
			if(page != null) {
				//transactions = mapperUtil.toModelList(page.getContent(), SiteDTO.class);
				if(transactions == null) {
					transactions = new ArrayList<SiteLedgerDTO>();
				}
				List<SiteLedger> siteLedgerList =  page.getContent();
				if(CollectionUtils.isNotEmpty(siteLedgerList)) {
					for(SiteLedger siteLedger : siteLedgerList) {
						transactions.add(mapToModel(siteLedger, false));
					}
				}
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}

		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<SiteLedger> page, List<SiteLedgerDTO> transactions, SearchResult<SiteLedgerDTO> result) {
		if(page != null) {
			result.setTotalPages(page.getTotalPages());
		}
		result.setCurrPage(page.getNumber() + 1);
		result.setTotalCount(page.getTotalElements());
        result.setStartInd((result.getCurrPage() - 1) * 10 + 1);
        result.setEndInd((result.getTotalCount() > 10  ? (result.getCurrPage()) * 10 : result.getTotalCount()));

		result.setTransactions(transactions);
		return;
	}

	private List<Long> findSubOrdinates(Employee employee, long empId) {
		List<Long> subEmpIds = new ArrayList<Long>();
		subEmpIds.add(empId);
		if(employee != null) {
			Hibernate.initialize(employee.getSubOrdinates());
			subEmpIds.addAll(findAllSubordinates(employee, subEmpIds));
			log.debug("List of subordinate ids -"+ subEmpIds);

		}
		return subEmpIds;
	}

    public List<SiteDTO> findByEmployeeId(Long id){
        List<Site> entities =  new ArrayList<Site>();
        entities = siteRepository.findSiteByEmployeeId(id);
        return mapperUtil.toModelList(entities, SiteDTO.class);
    }



}
