package com.ts.app.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import javax.inject.Inject;
import javax.transaction.Transactional;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeLocation;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.Feedback;
import com.ts.app.domain.JobStatus;
import com.ts.app.domain.Location;
import com.ts.app.domain.Project;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import com.ts.app.domain.UserRoleEnum;
import com.ts.app.repository.LocationRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.AmazonS3Utils;
import com.ts.app.service.util.FileUploadHelper;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.QRCodeUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.EmployeeLocationDTO;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.LocationDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;

/**
 * Service class for managing location information.
 */
@Service
@Transactional
public class LocationService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(LocationService.class);

	@Inject
	private ProjectRepository projectRepository;

	@Inject
	private SiteRepository siteRepository;

	@Inject
	private LocationRepository locationRepository;

    @Inject
    private Environment env;

    @Inject
    private FileUploadHelper fileUploadHelper;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private ImportUtil importUtil;
	
	@Inject
	private AmazonS3Utils s3ServiceUtils;
	
	@Inject
	private UserRepository userRepository;

	public LocationDTO saveLocation(LocationDTO locationDto) {

		if(locationDto.getId() > 0) {
			updateLocation(locationDto);
		}else {
			Location location = mapperUtil.toEntity(locationDto, Location.class);

			if(locationDto.getProjectId() > 0) {
				Project project = projectRepository.findOne(locationDto.getProjectId());
				location.setProject(project);
			}else {
				location.setProject(null);
			}
			if(locationDto.getSiteId() > 0) {
				Site site = siteRepository.findOne(locationDto.getSiteId());
				location.setSite(site);
			}else {
				location.setSite(null);
			}
			location.setActive(Feedback.ACTIVE_YES);
	        location = locationRepository.save(location);
			log.debug("Created Information for Feedback: {}", location);
			locationDto = mapperUtil.toModel(location, LocationDTO.class);
		}


		return locationDto;
	}

	public void updateLocation(LocationDTO locationDto) {
		log.debug("Inside Update");
		Location locationUpdate = locationRepository.findOne(locationDto.getId());
		locationRepository.save(locationUpdate);
		log.debug("updated Feedback: {}", locationUpdate);
	}

	public List<LocationDTO> findAll(int currPage) {
		Pageable pageRequest = createPageRequest(currPage);
		Page<Location> result = locationRepository.findAll(pageRequest);
		return mapperUtil.toModelList(result.getContent(), LocationDTO.class);
	}

	public LocationDTO findOne(Long id) {
		Location entity = locationRepository.findOne(id);
		return mapperUtil.toModel(entity, LocationDTO.class);
	}

    public LocationDTO findId(Long siteId, String block, String floor, String zone) {
        List<Location> entity = locationRepository.findByAll(siteId,block,floor,zone);
        Location locationEntity = entity.get(0);
        return mapperUtil.toModel(locationEntity, LocationDTO.class);
    }

    public List<LocationDTO> findIds(Long siteId, String block, String floor, String zone) {
        List<Location> entity = locationRepository.findByAll(siteId,block,floor,zone);
        return mapperUtil.toModelList(entity, LocationDTO.class);
    }

	public List<String> findBlocks(long projectId, long siteId) {
		if(projectId > 0) {
			return locationRepository.findBlocks(projectId, siteId);
		}else {
			return locationRepository.findBlocks(siteId);
		}
	}

	public List<String> findFloors(long projectId, long siteId, String block) {
		if(projectId > 0) {
			return locationRepository.findFloors(projectId, siteId, block);
		}else {
			return locationRepository.findFloors(siteId, block);
		}
	}

	public List<String> findZones(long projectId, long siteId, String block, String floor) {
		if(projectId > 0) {
			return locationRepository.findZones(projectId, siteId, block, floor);
		}else {
			return locationRepository.findZones(siteId, block, floor);
		}
	}

	public SearchResult<LocationDTO>  findBySearchCrieria(SearchCriteria searchCriteria) {
		SearchResult<LocationDTO> result = new SearchResult<LocationDTO>();
		if(searchCriteria != null) {
			log.debug("findBYSearchCriteria search criteria -"+ (searchCriteria.getJobStatus() != null && searchCriteria.getJobStatus().equals(JobStatus.OVERDUE)));

			User user = userRepository.findOne(searchCriteria.getUserId());
			Employee employee = user.getEmployee();

			//log.debug(""+employee.getEmpId());

			Set<Long> subEmpIds = new TreeSet<Long>();
			if(employee != null && !user.isAdmin()) {
				searchCriteria.setDesignation(employee.getDesignation());
				Hibernate.initialize(employee.getSubOrdinates());
				/*
				Set<Employee> subs = employee.getSubOrdinates();
				log.debug("List of subordinates -"+ subs);
				if(CollectionUtils.isNotEmpty(subs)){
					subEmpIds = new ArrayList<Long>();
				}
				for(Employee sub : subs) {
					subEmpIds.add(sub.getId());
				}
				*/
				int levelCnt = 1;
				findAllSubordinates(employee, subEmpIds, levelCnt);
	        		List<Long> subEmpList = new ArrayList<Long>();
	        		subEmpList.addAll(subEmpIds);
				
				log.debug("List of subordinate ids -"+ subEmpIds);
				if(CollectionUtils.isEmpty(subEmpList)) {
					subEmpList.add(employee.getId());
				}
				searchCriteria.setSubordinateIds(subEmpList);
			}else if(user.isAdmin()){
				searchCriteria.setAdmin(true);
			}
			log.debug("SearchCriteria ="+ searchCriteria);
		if(searchCriteria != null) {

		    //----
            Pageable pageRequest = null;
            if(!StringUtils.isEmpty(searchCriteria.getColumnName())){
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" +sort);
                pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);

            }else{
                pageRequest = createPageRequest(searchCriteria.getCurrPage());
            }


            //Pageable pageRequest = null;
            if(!StringUtils.isEmpty(searchCriteria.getColumnName())){
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" +sort);
                pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);

            }else{
                pageRequest = createPageRequest(searchCriteria.getCurrPage());
            }


            Page<Location> page = null;
			List<LocationDTO> transitems = null;
			if(!searchCriteria.isFindAll()) {
				if(StringUtils.isNotEmpty(searchCriteria.getZone())) {
					page = locationRepository.findByZone(searchCriteria.getProjectId(), searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone(), pageRequest);
				}else if(StringUtils.isNotEmpty(searchCriteria.getFloor())) {
					page = locationRepository.findByFloor(searchCriteria.getProjectId(), searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), pageRequest);
				}else if(StringUtils.isNotEmpty(searchCriteria.getBlock())) {
					page = locationRepository.findByBlock(searchCriteria.getProjectId(), searchCriteria.getSiteId(), searchCriteria.getBlock(), pageRequest);
				}else if(searchCriteria.getSiteId() > 0) {
					if(searchCriteria.getEmployeeId() > 0) {
						List<EmployeeLocation> empLocs  = locationRepository.findBySiteAndEmployee(searchCriteria.getSiteId(), searchCriteria.getEmployeeId());
						if(empLocs != null && CollectionUtils.isNotEmpty(empLocs)) {
							List<EmployeeLocationDTO> empDtos = mapperUtil.toModelList(empLocs, EmployeeLocationDTO.class);
							List<LocationDTO> locDtos = new ArrayList<LocationDTO>();
							for(EmployeeLocationDTO empLocDto : empDtos) {
								LocationDTO locDto = new LocationDTO();
								locDto.setProjectId(empLocDto.getProjectId());
								locDto.setSiteId(empLocDto.getSiteId());
								locDto.setBlock(empLocDto.getBlock());
								locDto.setFloor(empLocDto.getFloor());
								locDto.setZone(empLocDto.getZone());
								locDtos.add(locDto);
							}
							buildSearchResultForEmployeeLocation(searchCriteria, empLocs, locDtos, result);
						}
					}else {
						page = locationRepository.findBySite(searchCriteria.getSiteId(), pageRequest);
					}
				}else {
					page = locationRepository.findByProject(searchCriteria.getProjectId(), pageRequest);
				}
			}else {
				if(user.getUserRole().getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue())) {
					page = locationRepository.findAll(pageRequest);
				}else {
					List<Long> siteIds = new ArrayList<Long>();
	            		List<EmployeeProjectSite> sites = employee.getProjectSites();
	            		for(EmployeeProjectSite site : sites) {
	            			siteIds.add(site.getSite().getId());
	            		}
	            		page = locationRepository.findBySites(siteIds, pageRequest);
				}
			}
			if(page != null) {
				transitems = mapperUtil.toModelList(page.getContent(), LocationDTO.class);
				if(CollectionUtils.isNotEmpty(transitems)) {
					buildSearchResultFor(searchCriteria, page, transitems,result);
				}
			}
		}
	}
		return result;
	}

	private void buildSearchResultFor(SearchCriteria searchCriteria, Page<Location> page, List<LocationDTO> transactions, SearchResult<LocationDTO> result) {
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

	private void buildSearchResultForEmployeeLocation(SearchCriteria searchCriteria, List<EmployeeLocation> results, List<LocationDTO> transactions, SearchResult<LocationDTO> result) {
		if(CollectionUtils.isNotEmpty(results)) {
			result.setTotalPages(results.size());
		}
		result.setCurrPage(1);
		result.setTotalCount(results.size());
        result.setStartInd((result.getCurrPage() - 1) * 10 + 1);
        result.setEndInd((result.getTotalCount() > 10  ? (result.getCurrPage()) * 10 : result.getTotalCount()));

		result.setTransactions(transactions);
		return;
	}

	public ImportResult getImportStatus(String fileId) {
		ImportResult er = null;
		//fileId += ".csv";
		if(!StringUtils.isEmpty(fileId)) {
			er = importUtil.getImportResult(fileId);
			//er.setFile(fileId);
			//er.setStatus(status);
		}
		return er;
	}

    public Map<String, Object> generateLocationQRCode(long location, long siteId) {
        Location loc = locationRepository.findOne(location);
//        long siteId = asset.getSite().getId();
        log.debug("Selected location"+loc.getId());
        LocationDTO locDTO = new LocationDTO();
        byte[] qrCodeImage = null;
//        String qrCodeBase64 = null;
        Map<String, Object> qrCodeObject = new HashMap<>();
        if (loc != null) {
        		String codeName = siteId+"_"+loc.getBlock()+"_"+loc.getFloor()+"_"+loc.getZone();
        		qrCodeImage = QRCodeUtil.generateQRCode(codeName);
            String qrCodePath = env.getProperty("AWS.s3-locationqr-path");
//            String imageFileName = null;
            if (org.apache.commons.lang3.StringUtils.isNotEmpty(qrCodePath)) {
            	
//                imageFileName = fileUploadHelper.uploadQrCodeFile(codeName, qrCodeImage);
//                loc.setQrCodeImage(imageFileName);
//                locationRepository.save(loc);
            	locDTO = s3ServiceUtils.uploadLocationQrCodeFile(codeName, qrCodeImage, locDTO);
				qrCodeObject.put("code", codeName);
				qrCodeObject.put("url", locDTO.getUrl());
				qrCodeObject.put("imageName", locDTO.getQrCodeImage());
				loc.setQrCodeImage(locDTO.getQrCodeImage());
				locationRepository.save(loc);
            }
//            if (qrCodeImage != null && org.apache.commons.lang3.StringUtils.isNotBlank(imageFileName)) {
//                qrCodeBase64 = fileUploadHelper.readQrCodeFile(imageFileName);
//            }
        }
        log.debug("*****************"+loc.getId());
        return qrCodeObject;
    }

    public String generateQRCode(String block, String floor, String zone, long siteId) {
        byte[] qrCodeImage = null;
        String qrCodeBase64 = null;
            String codeName = siteId+"_"+block+"_"+floor+"_"+zone;
            
            qrCodeImage = QRCodeUtil.generateQRCode(codeName);
            String qrCodePath = env.getProperty("locationQRCode.file.path");
            String imageFileName = null;
            if (org.apache.commons.lang3.StringUtils.isNotEmpty(qrCodePath)) {
                imageFileName = fileUploadHelper.uploadQrCodeFile(codeName, qrCodeImage);
//                loc.setQrCodeImage(imageFileName);
//                locationRepository.save(loc);
            }
            if (qrCodeImage != null && org.apache.commons.lang3.StringUtils.isNotBlank(imageFileName)) {
                qrCodeBase64 = fileUploadHelper.readQrCodeFile(imageFileName);
            }
//        log.debug("*****************"+loc.getId());
//        return getQRCode(loc.getId());
        return  qrCodeBase64;
    }

    public String getQRCode(long locationId) {
        log.debug(">>> get QR Code <<<");
        Location loc = locationRepository.findOne(locationId);
        log.debug(loc.getQrCodeImage());
        String qrCodeBase64 = null;
        String imageFileName = null;
        if (loc != null) {
            imageFileName = loc.getQrCodeImage();
            if (org.apache.commons.lang3.StringUtils.isNotBlank(imageFileName)) {
                qrCodeBase64 = fileUploadHelper.readQrCodeFile(imageFileName);
            }
        }
        qrCodeBase64 = qrCodeBase64 + "." + loc.getId();
        return qrCodeBase64;
    }
}
