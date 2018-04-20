package com.ts.app.service;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.transaction.Transactional;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.EmployeeLocation;
import com.ts.app.domain.Feedback;
import com.ts.app.domain.Location;
import com.ts.app.domain.Project;
import com.ts.app.domain.Site;
import com.ts.app.repository.LocationRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.EmployeeLocationDTO;
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
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

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

	public SearchResult<LocationDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		SearchResult<LocationDTO> result = new SearchResult<LocationDTO>();
		if(searchCriteria != null) {
            Pageable pageRequest = null;
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
					page = locationRepository.findByZone(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), searchCriteria.getZone(), pageRequest);
				}else if(StringUtils.isNotEmpty(searchCriteria.getFloor())) {
					page = locationRepository.findByFloor(searchCriteria.getSiteId(), searchCriteria.getBlock(), searchCriteria.getFloor(), pageRequest);
				}else if(StringUtils.isNotEmpty(searchCriteria.getBlock())) {
					page = locationRepository.findByBlock(searchCriteria.getSiteId(), searchCriteria.getBlock(), pageRequest);
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
				page = locationRepository.findAll(pageRequest);
			}
			if(page != null) {
				transitems = mapperUtil.toModelList(page.getContent(), LocationDTO.class);
				if(CollectionUtils.isNotEmpty(transitems)) {
					buildSearchResultFor(searchCriteria, page, transitems,result);
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
}
