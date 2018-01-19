package com.ts.app.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Employee;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.SiteDTO;

/**
 * Service class for managing Site information.
 */
@Service
@Transactional
public class SiteService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(SiteService.class);

	@Inject
	private SiteRepository siteRepository;

	@Inject
	private UserRepository userRepository;

	@Inject
	private ProjectRepository projectRespository;

//	@Inject
//	private JobManagementService jobService;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private SiteLocationService siteLocationService;

	public SiteDTO createSiteInformation(SiteDTO siteDto) {
		// log.info("The admin Flag value is " +adminFlag);
		Site site = mapperUtil.toEntity(siteDto, Site.class);
        site.setActive(Site.ACTIVE_YES);
		site = siteRepository.save(site);
		log.debug("Created Information for Site: {}", site);
		//update the site location by calling site location service
		siteLocationService.save(site.getUser().getId(), site.getId(), site.getAddressLat(), site.getAddressLng(), site.getRadius());
		siteDto = mapperUtil.toModel(site, SiteDTO.class);
		return siteDto;
	}

	public void updateSite(SiteDTO site) {
		log.debug("Inside Update");
		Site siteUpdate = siteRepository.findOne(site.getId());
		mapToEntity(site,siteUpdate);
		siteUpdate.setProject(projectRespository.findOne(site.getProjectId()));
		siteRepository.saveAndFlush(siteUpdate);
        //update the site location by calling site location service
        siteLocationService.save(siteUpdate.getUser().getId(), site.getId(), site.getAddressLat(), site.getAddressLng(), site.getRadius());
	}

	private void mapToEntity(SiteDTO siteDTO, Site site) {
		site.setName(siteDTO.getName());
		site.setAddress(siteDTO.getAddress());
		site.setCountry(siteDTO.getCountry());
		site.setState(siteDTO.getState());
		site.setAddressLat(siteDTO.getAddressLat());
		site.setAddressLng(siteDTO.getAddressLng());
		site.setStartDate(siteDTO.getStartDate());
		site.setEndDate(siteDTO.getEndDate());
		site.setRadius(siteDTO.getRadius());
	}


	public void deleteSite(Long id) {
		log.debug("Inside Delete");
		Site siteUpdate = siteRepository.findOne(id);
        siteUpdate.setActive(Site.ACTIVE_NO);
		siteRepository.save(siteUpdate);
        // projectUpdate.setName(project.getName());
		//siteRepository.delete(siteUpdate);
		// projectRepository.
		/*
		 * projectRepository.findOne(projectDTO.getId()).ifPresent(u -> {
		 * u.setName(projectDTO.getName()); u.setId(projectDTO.getId());
		 * projectRepository.save(u); log.debug(
		 * "Changed Information for Project: {}", u); });
		 *
		 */
	}

	/*
	 * public void updateUserInformation(String firstName, String lastName,
	 * String email, String langKey) {
	 * userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).
	 * ifPresent(u -> { u.setFirstName(firstName); u.setLastName(lastName);
	 * u.setEmail(email); u.setLangKey(langKey); userRepository.save(u);
	 * log.debug("Changed Information for User1: {}", u); }); }
	 *
	 */

	public List<SiteDTO> findAll() {
		List<Site> entities = siteRepository.findAll();
		return mapperUtil.toModelList(entities, SiteDTO.class);
	}

	public List<SiteDTO> findAll(long userId) {
		User user = userRepository.findOne(userId);
		Hibernate.initialize(user.getEmployee());
		long empId = 0;
		if(user.getEmployee() != null) {
			empId = user.getEmployee().getId();
		}
		//long userGroupId = user.getUserGroup().getId();
		List<Site> entities = new ArrayList<Site>();
		if(empId > 0 && !user.isAdmin()) {
			Employee employee = user.getEmployee();
			List<Long> subEmpIds = new ArrayList<Long>();
			subEmpIds.add(empId);
			if(employee != null) {
				Hibernate.initialize(employee.getSubOrdinates());
				subEmpIds.addAll(findAllSubordinates(employee, subEmpIds));
				log.debug("List of subordinate ids -"+ subEmpIds);
			}
			entities = siteRepository.findAll(subEmpIds);
		}else {
			entities = siteRepository.findAll();
		}
		return mapperUtil.toModelList(entities, SiteDTO.class);
	}

	public List<SiteDTO> findSites(long projectId, long userId) {
		User user = userRepository.findOne(userId);
		Hibernate.initialize(user.getEmployee());
		long empId = 0;
		if(user.getEmployee() != null) {
			empId = user.getEmployee().getId();
		}
		//long userGroupId = user.getUserGroup().getId();
		List<Site> entities =  new ArrayList<Site>();
		if(empId > 0 && !user.isAdmin()) {
			Employee employee = user.getEmployee();
			List<Long> subEmpIds = new ArrayList<Long>();
			subEmpIds.add(empId);
			if(employee != null) {
				Hibernate.initialize(employee.getSubOrdinates());
				subEmpIds.addAll(findAllSubordinates(employee, subEmpIds));
				log.debug("List of subordinate ids -"+ subEmpIds);
			}
			entities = siteRepository.findSites(projectId, subEmpIds);
		}else {
			entities = siteRepository.findSites(projectId);
		}
		return mapperUtil.toModelList(entities, SiteDTO.class);
	}

	public SiteDTO findOne(Long id) {
		Site entity = siteRepository.findOne(id);
		if(entity != null) {
			Hibernate.initialize(entity.getProject());
			Hibernate.initialize(entity.getUser());
		}
		return mapperUtil.toModel(entity, SiteDTO.class);
	}

	public SearchResult<SiteDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		User user = userRepository.findOne(searchCriteria.getUserId());
		Hibernate.initialize(user.getEmployee());
		long empId = 0;
		if(user.getEmployee() != null) {
			empId = user.getEmployee().getId();
		}
    	//long userGroupId = user.getUserGroup().getId();
		SearchResult<SiteDTO> result = new SearchResult<SiteDTO>();
		if(searchCriteria != null) {
			Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
			Page<Site> page = null;
			List<SiteDTO> transactions = null;
			log.debug("Site id = "+ searchCriteria.getSiteId() + ", projectId = "+ searchCriteria.getProjectId() + " ,  empId = "+ empId);
			if(!searchCriteria.isFindAll()) {
				if(searchCriteria.getSiteId() != 0 && searchCriteria.getProjectId() != 0) {
					if(empId > 0){
						page = siteRepository.findSitesByIdAndProjectId(searchCriteria.getSiteId(), searchCriteria.getProjectId(), empId, pageRequest);
					}else {
						page = siteRepository.findSitesByIdAndProjectId(searchCriteria.getSiteId(), searchCriteria.getProjectId(), pageRequest);
					}
				}else {
					if(empId > 0) {
						page = siteRepository.findSitesByIdOrProjectId(searchCriteria.getSiteId(), searchCriteria.getProjectId(), empId, pageRequest);
					}else {
						page = siteRepository.findSitesByIdOrProjectId(searchCriteria.getSiteId(), searchCriteria.getProjectId(), pageRequest);
					}
				}
			}else {
				if(empId > 0 && !user.isAdmin()) {
					Employee employee = user.getEmployee();
					List<Long> subEmpIds = new ArrayList<Long>();
					subEmpIds.add(empId);
					if(employee != null) {
						Hibernate.initialize(employee.getSubOrdinates());
						subEmpIds.addAll(findAllSubordinates(employee, subEmpIds));
						log.debug("List of subordinate ids -"+ subEmpIds);

					}
					page = siteRepository.findSites(subEmpIds, pageRequest );
				}else {
					page = siteRepository.findSites(pageRequest );
				}
			}
			if(page != null) {
				transactions = mapperUtil.toModelList(page.getContent(), SiteDTO.class);
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}

		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<Site> page, List<SiteDTO> transactions, SearchResult<SiteDTO> result) {
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

    public List<Long> findAllSubordinates(Employee employee, List<Long> subEmpIds) {
        Set<Employee> subs = employee.getSubOrdinates();
        log.debug("List of subordinates -"+ subs);
        if(subs == null){
            subEmpIds = new ArrayList<Long>();
        }
        for(Employee sub : subs) {
            subEmpIds.add(sub.getId());
            Hibernate.initialize(sub.getSubOrdinates());
            if(CollectionUtils.isNotEmpty(sub.getSubOrdinates())){
                findAllSubordinates(sub, subEmpIds);
            }
        }
        return subEmpIds;
    }

    public List<SiteDTO> findByEmployeeId(Long id){
        List<Site> entities =  new ArrayList<Site>();
        entities = siteRepository.findSiteByEmployeeId(id);
        return mapperUtil.toModelList(entities, SiteDTO.class);
    }


}
