package com.ts.app.service;

import com.ts.app.domain.*;
import com.ts.app.repository.*;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.*;
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

import javax.inject.Inject;
import java.util.*;

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

	@Inject
    private RegionRepository regionRepository;

	@Inject
    private BranchRepository branchRepository;

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
        if(org.apache.commons.lang3.StringUtils.isNotEmpty(siteDto.getRegion())){   //Branch not Available

            Region region = isRegionSaved(siteDto.getRegion(),siteDto.getProjectId());

            if(region!=null && region.getId()>0){
                siteDto.setRegion(region.getName());

                if(org.apache.commons.lang3.StringUtils.isNotEmpty(siteDto.getBranch())){
                    Branch branch = isBranchSaved(siteDto.getBranch(),siteDto.getProjectId(),region.getId());

                    if(branch!=null && branch.getId()>0){
                        siteDto.setBranch(branch.getName());
                    }
                }
            }

        }

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
		log.debug("REgion and branch in update site - "+siteUpdate.getBranch()+" - "+siteUpdate.getRegion());
		siteUpdate.setProject(projectRespository.findOne(site.getProjectId()));
		siteRepository.saveAndFlush(siteUpdate);
        //update the site location by calling site location service
		siteLocationService.save(siteUpdate.getUser().getId(), site.getId(), site.getAddressLat(), site.getAddressLng(), site.getRadius());
	}

	private void mapToEntity(SiteDTO siteDTO, Site site) {
		site.setName(siteDTO.getName());
		site.setAddress(siteDTO.getAddress());
		site.setCity(siteDTO.getCity());
		site.setCountry(siteDTO.getCountry());
		site.setPinCode(siteDTO.getPinCode());
		site.setState(siteDTO.getState());
		site.setAddressLat(siteDTO.getAddressLat());
		site.setAddressLng(siteDTO.getAddressLng());
		site.setStartDate(siteDTO.getStartDate());
		site.setEndDate(siteDTO.getEndDate());
		site.setRadius(siteDTO.getRadius());
		log.debug("Site region and branch - "+siteDTO.getRegion() + " - "+siteDTO.getBranch());
        if(org.apache.commons.lang3.StringUtils.isNotEmpty(siteDTO.getRegion())){   //Branch not Available
            log.debug("site and region found");

            Region region = isRegionSaved(siteDTO.getRegion(),siteDTO.getProjectId());
            if(region!=null && region.getId()>0){
                site.setRegion(region.getName());
                if(org.apache.commons.lang3.StringUtils.isNotEmpty(siteDTO.getBranch())){
                    Branch branch = isBranchSaved(siteDTO.getBranch(),siteDTO.getProjectId(),region.getId());
                    if(branch!=null && branch.getId()>0){
                        site.setBranch(branch.getName());
                    }
                }
            }
        }
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
		site.getShifts().addAll(shiftEntities);
	}

	private SiteDTO mapToModel(Site site, boolean includeShifts) {
		SiteDTO siteDTO = new SiteDTO();
		siteDTO.setId(site.getId());
		siteDTO.setName(org.apache.commons.lang3.StringUtils.upperCase(site.getName()));
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
			Set<Long> subEmpIds = new TreeSet<Long>();
			subEmpIds.add(empId);
			if(employee != null) {
				Hibernate.initialize(employee.getSubOrdinates());
				int levelCnt = 1;
				subEmpIds.addAll(findAllSubordinates(employee, subEmpIds, levelCnt));
				List<Long> subEmpList = new ArrayList<Long>();
				subEmpList.addAll(subEmpIds);
				log.debug("List of subordinate ids -"+ subEmpIds);
			}
			entities = siteRepository.findAll(subEmpIds);
		}else {
			entities = siteRepository.findAll();
		}
		List<SiteDTO> values = new ArrayList<SiteDTO>();
		if(CollectionUtils.isNotEmpty(entities)) {
			for(Site site : entities) {
				SiteDTO siteDto = mapToModel(site, false);
				values.add(siteDto);
			}
		}
		return values;
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
			Set<Long> subEmpIds = new TreeSet<Long>();
			subEmpIds.add(empId);
			List<Long> subEmpList = new ArrayList<Long>();
			if(employee != null) {
				Hibernate.initialize(employee.getSubOrdinates());
				int levelCnt = 1;
				subEmpIds.addAll(findAllSubordinates(employee, subEmpIds, levelCnt));
				subEmpList.addAll(subEmpIds);
				log.debug("List of subordinate ids -"+ subEmpList);
			}
			entities = siteRepository.findSites(projectId, subEmpList);
		}else {
			entities = siteRepository.findSites(projectId);
		}
		List<SiteDTO> values = new ArrayList<SiteDTO>();
		if(CollectionUtils.isNotEmpty(entities)) {
			for(Site site : entities) {
				SiteDTO siteDto = mapToModel(site, false);
				values.add(siteDto);
			}
		}
		return values;
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

	public List<ShiftDTO> findShifts(long id, Date date) {
		List<ShiftDTO> shiftDtos = new ArrayList<ShiftDTO>();
		Site entity = siteRepository.findOne(id);
		Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
		cal.setTime(date);
		Calendar endCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
		endCal.setTime(date);
		if(entity != null) {
			Hibernate.initialize(entity.getShifts());
			List<Shift> shifts = entity.getShifts();
			if(CollectionUtils.isNotEmpty(shifts)) {
				for(Shift shift : shifts) {
					ShiftDTO shiftDto = mapperUtil.toModel(shift, ShiftDTO.class);
					String[] startTime = shiftDto.getStartTime().split(":");
					cal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTime[0]));
					cal.set(Calendar.MINUTE, Integer.parseInt(startTime[1]));
					cal.set(Calendar.SECOND, 0);
					shiftDto.setStartDateTime(cal.getTime());
					String[] endTime = shiftDto.getEndTime().split(":");
					endCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(endTime[0]));
					endCal.set(Calendar.MINUTE, Integer.parseInt(endTime[1]));
					endCal.set(Calendar.SECOND, 0);
					shiftDto.setEndDateTime(endCal.getTime());
					shiftDtos.add(shiftDto);
				}
			}
		}
		return shiftDtos;
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

        //-------
		SearchResult<SiteDTO> result = new SearchResult<SiteDTO>();
		if(searchCriteria != null) {
            Pageable pageRequest = null;
            if(!StringUtils.isEmpty(searchCriteria.getColumnName())){
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" +sort);
                pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);

            }else{
                if (searchCriteria.isReport()) {
                    pageRequest = createPageRequest(searchCriteria.getCurrPage(), true);
                } else {
                    pageRequest = createPageRequest(searchCriteria.getCurrPage());
                }
            }
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
		Set<Long> subEmpIds = new TreeSet<Long>();
		subEmpIds.add(empId);
		List<Long> subEmpList = new ArrayList<Long>();
		if(employee != null) {
			Hibernate.initialize(employee.getSubOrdinates());
			int levelCnt = 1;
			subEmpIds.addAll(findAllSubordinates(employee, subEmpIds, levelCnt));
			subEmpList.addAll(subEmpIds);
			log.debug("List of subordinate ids -"+ subEmpIds);
		}
		return subEmpList;
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
		//ImportResult er = new ImportResult();
		ImportResult er = null;
		//fileId += ".csv";
		if(!StringUtils.isEmpty(fileId)) {
			er = importUtil.getImportResult(fileId);
			//er.setFile(fileId);
			//er.setStatus(status);
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


    public RegionDTO createRegion(RegionDTO regionDTO) {
	    log.debug("name - "+regionDTO.getName());
	    log.debug("project Id - "+regionDTO.getProjectId());
        Region region= mapperUtil.toEntity(regionDTO, Region.class);
        regionRepository.save(region);
        return regionDTO;
    }

    public BranchDTO createBranch(BranchDTO branchDTO) {
        Branch branch= mapperUtil.toEntity(branchDTO, Branch.class);
        branchRepository.save(branch);
        return branchDTO;
    }

    public List<RegionDTO> findAllRegions() {
//        User user = userRepository.findOne(userId);
        List<Region> regions = regionRepository.findAll();

        return mapperUtil.toModelList(regions, RegionDTO.class);
    }

    public List<BranchDTO> findAllBranches() {
//        User user = userRepository.findOne(userId);
        List<Branch> branches = branchRepository.findAll();
        return mapperUtil.toModelList(branches, BranchDTO.class);
    }

    public List<RegionDTO> findRegionByProject(long projectId){

        User user = userRepository.findOne(SecurityUtils.getCurrentUserId());
        Hibernate.initialize(user.getEmployee());
        long empId = 0;
        if(user.getEmployee() != null) {
            empId = user.getEmployee().getId();
        }
        //long userGroupId = user.getUserGroup().getId();
        List<Region> entities =  new ArrayList<Region>();
        if(empId > 0 && !user.isAdmin()) {
            Employee employee = user.getEmployee();
            Set<Long> subEmpIds = new TreeSet<Long>();
            subEmpIds.add(empId);
            List<Long> subEmpList = new ArrayList<Long>();
            if(employee != null) {
                Hibernate.initialize(employee.getSubOrdinates());
                int levelCnt = 1;
                subEmpIds.addAll(findAllSubordinates(employee, subEmpIds, levelCnt));
                subEmpList.addAll(subEmpIds);
                log.debug("List of subordinate ids -"+ subEmpList);
            }
            entities = regionRepository.findSiteRegions(projectId, subEmpList);
        }else {
            entities = regionRepository.findRegionNameByProject(projectId);
        }
//        List<RegionDTO> values = new ArrayList<RegionDTO>();
//        if(CollectionUtils.isNotEmpty(entities)) {
//            for(String region : entities) {
//                 RegionDTO regionDTO = regionRepository.findByName(region)
//                values.add(siteDto);
//            }
//        }

	    return mapperUtil.toModelList(entities, RegionDTO.class);
    }

    public List<BranchDTO> findBranchByProject(long projectId, long regionId){
        List<Branch> branches = branchRepository.findBranchByProjectAndRegion(projectId,regionId);

        return mapperUtil.toModelList(branches, BranchDTO.class);
    }

    public List<BranchDTO> findBranchByProjectAndRegionName(long projectId, String region){
        List<Branch> branches = branchRepository.findBranchByProjectAndRegionName(projectId,region);

        return mapperUtil.toModelList(branches, BranchDTO.class);
    }


    public List<SiteDTO> findSitesByRegion(long projectId, String region){
        List<Site> sites = siteRepository.findSitesByRegion(projectId,region);

        return mapperUtil.toModelList(sites,SiteDTO.class);
    }

    public List<SiteDTO> findSitesByRegionAndBranch(long projectId, String region, String branch){
        List<Site> sites = siteRepository.findSitesByRegionAndBranch(projectId,region, branch);

        return mapperUtil.toModelList(sites,SiteDTO.class);
    }

    public Region isRegionSaved(String region, Long projectId){
        log.debug("REgion from site import - before "+region);

        Region region1 = regionRepository.findByName(region,projectId);

        if(region1!=null && region1.getId()>0){
            return region1;

        }else{
            RegionDTO regionDTO = new RegionDTO();
            regionDTO.setName(region);
            regionDTO.setProjectId(projectId);
            RegionDTO regionDTO1 = createRegion(regionDTO);

            log.debug("REgion from site import - "+regionDTO1.getName());

            return mapperUtil.toEntity(regionDTO1,Region.class);
        }

    }

    public Branch isBranchSaved(String branch, Long projectId, Long regionId){
        Branch branch1 = branchRepository.findByName(branch,projectId,regionId);

        if(branch1!=null && branch1.getId()>0){
            return branch1;

        }else{
            BranchDTO branchDTO = new BranchDTO();
            branchDTO.setName(branch);
            branchDTO.setProjectId(projectId);
            branchDTO.setRegionId(regionId);
            BranchDTO branchDTO1 = createBranch(branchDTO);

            return mapperUtil.toEntity(branchDTO1,Branch.class);
        }

    }

    public boolean isDuplicate(RegionDTO regionDTO) {

    	List<Long> results = regionRepository.findByRegion(regionDTO.getName(), regionDTO.getProjectId());

        if(!results.isEmpty()) {
            return true;
        }
        return false;
    }

    public boolean isDuplicate(BranchDTO branchDTO) {

    	List<Branch> results = branchRepository.findBranchByProjectAndRegionId(branchDTO.getProjectId(), branchDTO.getRegionId(), branchDTO.getName());

        if(!results.isEmpty()) {
            return true;
        }
        return false;
    }

}
