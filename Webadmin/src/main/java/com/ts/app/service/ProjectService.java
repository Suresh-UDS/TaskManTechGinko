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
import com.ts.app.domain.Project;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ProjectDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class ProjectService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(UserService.class);

	@Inject
	private ProjectRepository projectRepository;

	@Inject
	private UserRepository userRepository;

	@Inject
	private SiteService siteService;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	public ProjectDTO createProjectInformation(ProjectDTO projectDto) {
		// log.info("The admin Flag value is " +adminFlag);
		Project project = mapperUtil.toEntity(projectDto, Project.class);
		project.setActive(project.ACTIVE_YES);

		project = projectRepository.save(project);
		log.debug("Created Information for Project: {}", project);
		projectDto = mapperUtil.toModel(project, ProjectDTO.class);
		return projectDto;
	}

	public void updateProject(ProjectDTO project) {
		log.debug("Inside Update");
		Project projectUpdate = projectRepository.findOne(project.getId());
		mapToEntity(project, projectUpdate);
		projectRepository.saveAndFlush(projectUpdate);
		// projectRepository.
		/*
		 * projectRepository.findOne(projectDTO.getId()).ifPresent(u -> {
		 * u.setName(projectDTO.getName()); u.setId(projectDTO.getId());
		 * projectRepository.save(u); log.debug(
		 * "Changed Information for Project: {}", u); });
		 *
		 */

	}

	private void mapToEntity(ProjectDTO projectDTO, Project project) {
		project.setName(projectDTO.getName());
		project.setAddress(projectDTO.getAddress());
		project.setCountry(projectDTO.getCountry());
		project.setState(projectDTO.getState());
		project.setAddressLat(projectDTO.getAddressLat());
		project.setAddressLng(projectDTO.getAddressLng());
		project.setEmail(projectDTO.getEmail());
		project.setPhone(projectDTO.getPhone());
		project.setStartDate(projectDTO.getStartDate());
		project.setEndDate(projectDTO.getEndDate());
		project.setContactFirstName(projectDTO.getContactFirstName());
		project.setContactLastName(projectDTO.getContactLastName());
	}

	public void deleteProject(Long id) {
		log.debug("Inside Delete");

		//
		Project projectUpdate = projectRepository.findOne(id);
		projectUpdate.setActive(Project.ACTIVE_NO);
		Set<Site> sites = projectUpdate.getSite();
		for(Site site : sites) {
			site.setActive(Site.ACTIVE_NO);
		}
		projectRepository.save(projectUpdate);
		// projectUpdate.setName(project.getName());
		//projectRepository.delete(projectUpdate);
		// projectRepository.
		/*
		 * projectRepository.findOne(projectDTO.getId()).ifPresent(u -> {
		 * u.setName(projectDTO.getName()); u.setId(projectDTO.getId());
		 * projectRepository.save(u); log.debug(
		 * "Changed Information for Project: {}", u); });
		 *
		 */

	}

	public List<ProjectDTO> findAll(long userId) {
		User user = userRepository.findOne(userId);
		Hibernate.initialize(user.getEmployee());
		List<Project> entities = new ArrayList<Project>();
		if(user.getEmployee()!=null && !user.isAdmin()) {
			long empId = user.getEmployee().getId();
			//long userGroupId = user.getUserGroup().getId();
			//entities = projectRepository.findAllByUserGroupId(empId);
			Employee employee = user.getEmployee();
			List<Long> subEmpIds = new ArrayList<Long>();
			subEmpIds.add(empId);
			if(employee != null) {
				Hibernate.initialize(employee.getSubOrdinates());
				subEmpIds.addAll(siteService.findAllSubordinates(employee, subEmpIds));
				log.debug("List of subordinate ids -"+ subEmpIds);

			}
			entities = projectRepository.findAll(subEmpIds);
		}else {
			entities = projectRepository.findAll();
		}
		return mapperUtil.toModelList(entities, ProjectDTO.class);
	}

	public ProjectDTO findOne(Long id) {
		Project entity = projectRepository.findOne(id);
		return mapperUtil.toModel(entity, ProjectDTO.class);
	}

    public SearchResult<ProjectDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
    	log.debug("search Criteria",searchCriteria);
    	User user = userRepository.findOne(searchCriteria.getUserId());
    	Hibernate.initialize(user.getEmployee());
    	long empId = 0;
    	if(user.getEmployee()!=null) {
    		empId = user.getEmployee().getId();
    	}
    	//long userGroupId = user.getUserGroup().getId();
    	log.debug("empId is :",empId);
        SearchResult<ProjectDTO> result = new SearchResult<ProjectDTO>();
        if(searchCriteria != null) {
            Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
            Page<Project> page = null;
            List<ProjectDTO> transactions = null;
            if(!searchCriteria.isFindAll()) {
                if(searchCriteria.getProjectId() != 0) {
                    page = projectRepository.findProjectsById(searchCriteria.getProjectId(),empId, pageRequest);
                }
            }else {
            	if(empId > 0 && !user.isAdmin()) {
					Employee employee = user.getEmployee();
					List<Long> subEmpIds = new ArrayList<Long>();
					subEmpIds.add(empId);
					if(employee != null) {
						Hibernate.initialize(employee.getSubOrdinates());
						subEmpIds.addAll(siteService.findAllSubordinates(employee, subEmpIds));
						log.debug("List of subordinate ids -"+ subEmpIds);

					}
            		page = projectRepository.findProjects(subEmpIds, pageRequest);
            	}else {
            		page = projectRepository.findAllProjects(pageRequest);
            	}
            }
            if(page != null) {
            		try {
            			transactions = mapperUtil.toModelList(page.getContent(), ProjectDTO.class);
            		}catch(Exception e) {
            			log.error("Error while converting entity to model ",e);
            			e.printStackTrace();
            		}
                if(CollectionUtils.isNotEmpty(transactions)) {
                    buildSearchResult(searchCriteria, page, transactions,result);
                }
            }
        }
        return result;
    }

    private void buildSearchResult(SearchCriteria searchCriteria, Page<Project> page, List<ProjectDTO> transactions, SearchResult<ProjectDTO> result) {
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



}
