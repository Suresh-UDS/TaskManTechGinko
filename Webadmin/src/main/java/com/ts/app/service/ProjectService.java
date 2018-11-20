package com.ts.app.service;

import com.ts.app.domain.*;
import com.ts.app.repository.ClientGroupRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.UserRepository;
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
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

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
	private ClientGroupRepository clientGroupRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private ImportUtil importUtil;

	public boolean isDuplicate(ProjectDTO projectDto) {
	    log.debug("Project duplicate get"+projectDto.getUserId());
		SearchCriteria criteria = new SearchCriteria();
		criteria.setProjectName(projectDto.getName());
		criteria.setUserId(projectDto.getUserId());
		SearchResult<ProjectDTO> searchResults = findBySearchCrieria(criteria);
		criteria.setUserId(projectDto.getUserId());
		if(searchResults != null && CollectionUtils.isNotEmpty(searchResults.getTransactions())) {
			return true;
		}
		return false;

	}

	public ProjectDTO createProjectInformation(ProjectDTO projectDto) {
		// log.info("The admin Flag value is " +adminFlag);
        log.debug("Create user information"+projectDto.getUserId());
		Project project = mapperUtil.toEntity(projectDto, Project.class);
		project.setActive(project.ACTIVE_YES);
		
		//create client group if does not exist
		if(!StringUtils.isEmpty(project.getClientGroup())) {
			Clientgroup clientGroup = clientGroupRepository.findByName(project.getClientGroup());
			if(clientGroup == null) {
				clientGroup = new Clientgroup();
				clientGroup.setClientgroup(project.getClientGroup());
				clientGroup.setActive("Y");
				clientGroupRepository.save(clientGroup);
			}
		}
		
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
	
	private void mapToModel(Project project , ProjectDTO projectDTO) {
		projectDTO.setId(project.getId());
		projectDTO.setName(org.apache.commons.lang3.StringUtils.upperCase(project.getName()));
		projectDTO.setCountry(project.getCountry());
		projectDTO.setState(project.getState());
		projectDTO.setAddressLat(project.getAddressLat());
		projectDTO.setAddressLng(project.getAddressLng());
		projectDTO.setEmail(project.getEmail());
		projectDTO.setPhone(project.getPhone());
		projectDTO.setStartDate(project.getStartDate());
		projectDTO.setEndDate(project.getEndDate());
		projectDTO.setContactFirstName(project.getContactFirstName());
		projectDTO.setContactLastName(project.getContactLastName());	
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
		project.setClientGroup(projectDTO.getClientGroup());
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
			Set<Long> subEmpIds = new TreeSet<Long>();
			subEmpIds.add(empId);
			List<Long> subEmpList = new ArrayList<Long>();
			if(employee != null) {
				Hibernate.initialize(employee.getSubOrdinates());
				int levelCnt = 1;
				subEmpIds.addAll(siteService.findAllSubordinates(employee, subEmpIds, levelCnt));
	        		
	        		subEmpList.addAll(subEmpIds);

				log.debug("List of subordinate ids -"+ subEmpList);

			}
			entities = projectRepository.findAll(subEmpList);
		}else {
			entities = projectRepository.findAll(new Sort(Sort.Direction.ASC, "name"));
		}
		List<ProjectDTO> values = new ArrayList<ProjectDTO>();
		if(CollectionUtils.isNotEmpty(entities)) {
			for(Project proj : entities) {
				ProjectDTO projDto = new ProjectDTO();
				mapToModel(proj, projDto);
				values.add(projDto);
			}
		}
		return values;
	}

	public ProjectDTO findOne(Long id) {
		Project entity = projectRepository.findOne(id);
		return mapperUtil.toModel(entity, ProjectDTO.class);
	}

    public SearchResult<ProjectDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
    	log.debug("search Criteria",searchCriteria);
    	User user = userRepository.findOne(searchCriteria.getUserId());
    	log.debug("userId in porject search"+searchCriteria.getUserId());
    	Hibernate.initialize(user.getEmployee());
    	long empId = 0;
    	if(user.getEmployee()!=null) {
    		empId = user.getEmployee().getId();
    	}
    	//long userGroupId = user.getUserGroup().getId();
    	log.debug("empId is :",empId);
        SearchResult<ProjectDTO> result = new SearchResult<ProjectDTO>();
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


            //Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
            Page<Project> page = null;
            List<ProjectDTO> transactions = null;
            if(!searchCriteria.isFindAll()) {
                if(searchCriteria.getProjectId() != 0) {
                		if(empId > 0 && !user.isAdmin()){
                			List<Long> subEmpIds = findSubOrdinates(user.getEmployee(), empId);
                			page = projectRepository.findProjectsById(searchCriteria.getProjectId(),subEmpIds, pageRequest);
                		}else {
                			page = projectRepository.findProjectsById(searchCriteria.getProjectId(),pageRequest);
                		}
                }else if(!StringUtils.isEmpty(searchCriteria.getProjectName())) {
                		if(empId > 0 && !user.isAdmin()){
                			List<Long> subEmpIds = findSubOrdinates(user.getEmployee(), empId);
                    		page = projectRepository.findAllByName(searchCriteria.getProjectName(), subEmpIds, pageRequest);
                		}else {
                    		page = projectRepository.findAllByName(searchCriteria.getProjectName(), pageRequest);

                		}
                }
            }else {
	            	if(empId > 0 && !user.isAdmin()) {
	            		List<Long> subEmpIds = findSubOrdinates(user.getEmployee(), empId);
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

	public ImportResult importFile(MultipartFile file, long dateTime) {
		return importUtil.importClientData(file, dateTime);
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

	public ClientgroupDTO createClientGroup(ClientgroupDTO clientGroupDTO) {
		Clientgroup clientgroup = mapperUtil.toEntity(clientGroupDTO, Clientgroup.class);
		Clientgroup existingGroup = clientGroupRepository.findByName(clientGroupDTO.getClientgroup());
		if(existingGroup == null) { 
			clientgroup.setActive(Clientgroup.ACTIVE_YES);
			clientGroupRepository.save(clientgroup);
			clientGroupDTO = mapperUtil.toModel(clientgroup, ClientgroupDTO.class);
		}else {
			clientGroupDTO.setErrorMessage("Already same asset group exists.");
			clientGroupDTO.setStatus("400");
			clientGroupDTO.setErrorStatus(true);
		}
		return clientGroupDTO;

	}

	public List<ClientgroupDTO> findAllClientGroups() {
		List<Clientgroup> clientgroup = clientGroupRepository.findAll();
		return mapperUtil.toModelList(clientgroup, ClientgroupDTO.class);
	}

}
