package com.ts.app.service;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Employee;
import com.ts.app.domain.Shift;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.EmployeeDTO;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.ShiftDTO;
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

	@Inject
	private ImportUtil importUtil;

	public SiteDTO createSiteInformation(SiteDTO siteDto) {
		// log.info("The admin Flag value is " +adminFlag);
		Site site = mapperUtil.toEntity(siteDto, Site.class);
        site.setActive(Site.ACTIVE_YES);
        List<Shift> shifts = new ArrayList<Shift>();
        List<ShiftDTO> shiftDtos = siteDto.getShifts();
        for(ShiftDTO shiftDto : shiftDtos) {
        		Shift shift = mapperUtil.toEntity(shiftDto, Shift.class);
        		shift.setSite(site);
        		shift.setProject(null);
        		shifts.add(shift);
        }
        site.setShifts(shifts);
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
		List<Shift> shiftEntities = site.getShifts();
		if(CollectionUtils.isNotEmpty(shiftEntities)) {
			shiftEntities.clear();
		}else {
			shiftEntities = new ArrayList<Shift>();
		}
		List<ShiftDTO> shifts = siteDTO.getShifts();
		for(ShiftDTO shift : shifts) {
			Shift shiftEntity = mapperUtil.toEntity(shift, Shift.class);
			shiftEntity.setSite(site);
			shiftEntity.setProject(site.getProject());
			shiftEntities.add(shiftEntity);
		}
	}
	
	private SiteDTO mapToModel(Site site, boolean includeShifts) {
		SiteDTO siteDTO = new SiteDTO();
		siteDTO.setId(site.getId());
		siteDTO.setName(site.getName());
		siteDTO.setAddress(site.getAddress());
		siteDTO.setCountry(site.getCountry());
		siteDTO.setState(site.getState());
		siteDTO.setAddressLat(site.getAddressLat());
		siteDTO.setAddressLng(site.getAddressLng());
		siteDTO.setStartDate(site.getStartDate());
		siteDTO.setEndDate(site.getEndDate());
		siteDTO.setRadius(site.getRadius());
		siteDTO.setProjectId(site.getProject().getId());
		siteDTO.setProjectName(site.getProject().getName());
		if(includeShifts) {
			List<ShiftDTO> shifts = siteDTO.getShifts();
			for(Shift shift : site.getShifts()) {
				ShiftDTO shiftDto = mapperUtil.toModel(shift, ShiftDTO.class);
				shifts.add(shiftDto);
			}
			siteDTO.setShifts(shifts);
		}
		return siteDTO;
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
			Hibernate.initialize(entity.getShifts());
		}
		return mapperUtil.toModel(entity, SiteDTO.class);
	}

	public List<SiteDTO> searchSiteList(SearchCriteria searchCriteria){
	    User user= userRepository.findOne(searchCriteria.getUserId());
        SearchResult<SiteDTO> result = new SearchResult<SiteDTO>();
        List<Site> siteList = null;
        log.debug("Inside search result" + searchCriteria.getName());

        siteList = siteRepository.findSitesByName(searchCriteria.getName());

        return mapperUtil.toModelList(siteList,SiteDTO.class);

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
					if(empId > 0 && !user.isAdmin()){
						List<Long> subEmpIds = findSubOrdinates(user.getEmployee(), empId);
						page = siteRepository.findSitesByIdAndProjectId(searchCriteria.getSiteId(), searchCriteria.getSiteName(), searchCriteria.getProjectId(), searchCriteria.getProjectName(), subEmpIds, pageRequest);
					}else {
						page = siteRepository.findSitesByIdAndProjectId(searchCriteria.getSiteId(), searchCriteria.getProjectId(), searchCriteria.getProjectName(), pageRequest);
					}
				}else {
					if(empId > 0 && !user.isAdmin()) {
						List<Long> subEmpIds = findSubOrdinates(user.getEmployee(), empId);
						page = siteRepository.findSitesByIdOrProjectId(searchCriteria.getSiteId(), searchCriteria.getSiteName(), searchCriteria.getProjectId(), searchCriteria.getProjectName(), subEmpIds, pageRequest);
					}else {
						page = siteRepository.findSitesByIdOrProjectId(searchCriteria.getSiteId(), searchCriteria.getSiteName(), searchCriteria.getProjectId(), searchCriteria.getProjectName(), pageRequest);
					}
				}
			}else {
				if(empId > 0 && !user.isAdmin()) {
					List<Long> subEmpIds = findSubOrdinates(user.getEmployee(), empId);
					page = siteRepository.findSites(subEmpIds, pageRequest );
				}else {
					page = siteRepository.findSites(pageRequest );
				}
			}
			if(page != null) {
				//transactions = mapperUtil.toModelList(page.getContent(), SiteDTO.class);
				if(transactions == null) {
					transactions = new ArrayList<SiteDTO>();
				}
				List<Site> siteList =  page.getContent();
				if(CollectionUtils.isNotEmpty(siteList)) {
					for(Site site : siteList) {
						transactions.add(mapToModel(site, false));
					}
				}
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

//    public List<Long> findAllSubordinates(Employee employee, List<Long> subEmpIds) {
//        Set<Employee> subs = employee.getSubOrdinates();
//        log.debug("List of subordinates -"+ subs);
//        if(subEmpIds == null){
//            subEmpIds = new ArrayList<Long>();
//        }
//        for(Employee sub : subs) {
//            subEmpIds.add(sub.getId());
//            Hibernate.initialize(sub.getSubOrdinates());
//            if(CollectionUtils.isNotEmpty(sub.getSubOrdinates())){
//                findAllSubordinates(sub, subEmpIds);
//            }
//        }
//        return subEmpIds;
//    }

    public List<SiteDTO> findByEmployeeId(Long id){
        List<Site> entities =  new ArrayList<Site>();
        entities = siteRepository.findSiteByEmployeeId(id);
        return mapperUtil.toModelList(entities, SiteDTO.class);
    }

	public ImportResult getImportStatus(String fileId) {
		ImportResult er = new ImportResult();
		//fileId += ".csv";
		if(!StringUtils.isEmpty(fileId)) {
			String status = importUtil.getImportStatus(fileId);
			er.setFile(fileId);
			er.setStatus(status);
		}
		return er;
	}

	public String checkProximity(long id,double lat, double lng){
        String result = siteLocationService.checkProximity(id,lat,lng);
        if(StringUtils.isEmpty(result)){
            return "failure";
        }else{
            return "success";
        }
    }


}
