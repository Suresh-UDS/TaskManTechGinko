package com.ts.app.service;

import java.sql.Date;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.inject.Inject;

import com.ts.app.domain.*;
import com.ts.app.repository.*;
import com.ts.app.web.rest.dto.*;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.hibernate.EmptyInterceptor;
import org.hibernate.Hibernate;
import org.joda.time.DateTime;
import org.joda.time.Days;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.FileUploadHelper;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.QRCodeUtil;

/**
 * Service class for managing employee information.
 */
@Service
@Transactional
public class    EmployeeService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(EmployeeService.class);

	@Inject
    private AttendanceRepository attendanceRepository;

	@Inject
	private EmployeeRepository employeeRepository;

	@Inject
	private EmployeeHistoryRepository employeeHistoryRepository;

	@Inject
	private SiteRepository siteRepository;

	@Inject
	private UserRepository userRepository;

	@Inject
	private ProjectRepository projectRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private FileUploadHelper fileUploadHelper;

	@Inject
	private ExportUtil exportUtil;

	@Inject
	private UserService userService;

	@Inject
	private PushService pushService;

//	@Inject
//	private MailService mailService;

	@Inject
	private Environment env;

	public EmployeeDTO findByEmpId(String empId) {
        Employee employee = employeeRepository.findByEmpId(empId);
		EmployeeDTO employeeDto = null;
		if(employee!=null) {
			employeeDto = mapperUtil.toModel(employee, EmployeeDTO.class);
		}
		return employeeDto;
	}

	public EmployeeDTO createEmployeeInformation(EmployeeDTO employeeDto) {
		// log.info("The admin Flag value is " +adminFlag);
		log.debug("EmployeeService.createEmployeeInformation - userId - "+employeeDto.getUserId());
        Employee existingEmployee = employeeRepository.findByEmpId(employeeDto.getEmpId());
		if(existingEmployee!=null && existingEmployee.getActive().equals(Employee.ACTIVE_NO)) { //existing employee update and activate
			employeeDto.setId(existingEmployee.getId());
		    ZoneId  zone = ZoneId.of("Asia/Singapore");
		    ZonedDateTime zdt   = ZonedDateTime.of(LocalDateTime.now(), zone);
		    //update and activate the existing employee.

			employeeDto = updateEmployee(employeeDto, true);
		}else {
			Employee employee = mapperUtil.toEntity(employeeDto, Employee.class);
			log.debug("EmployeeService.createEmployeeInformation - userId - "+employee.getUser().getId());
			employee.setUser(null);
		    ZoneId  zone = ZoneId.of("Asia/Singapore");
		    ZonedDateTime zdt   = ZonedDateTime.of(LocalDateTime.now(), zone);
			employee.setCreatedDate(zdt);
	        employee.setActive(Employee.ACTIVE_YES);
	        if(employeeDto.getManagerId() > 0) {
               Employee manager =  employeeRepository.findOne(employeeDto.getManagerId());
               employee.setManager(manager);
            }
	    	//employee = employeeRepository.save(employee);
			Project newProj = projectRepository.findOne(employeeDto.getProjectId());
			Site newSite = siteRepository.findOne(employeeDto.getSiteId());
			List<Project> projects = new ArrayList<Project>();
			projects.add(newProj);
			List<Site> sites = new ArrayList<Site>();
			sites.add(newSite);
			employee.setProjects(projects);
			employee.setSites(sites);
			employee.setFaceAuthorised(false);
			employee.setFaceIdEnrolled(false);
			employeeRepository.save(employee);
			log.debug("Created Information for Employee: {}", employee);
			employeeDto = mapperUtil.toModel(employee, EmployeeDTO.class);
		}
		return employeeDto;
	}

	public EmployeeDTO updateEmployee(EmployeeDTO employee, boolean shouldUpdateActiveStatus) {
		log.debug("Inside Update");
		Employee employeeUpdate = employeeRepository.findOne(employee.getId());
		Hibernate.initialize(employee.getProjects());
		List<Project> projects = employeeUpdate.getProjects();
		boolean projExists = false;
		for(Project proj : projects) {
			if(proj.getId() == employee.getProjectId()) {
				projExists = true;
			}
		}
		Hibernate.initialize(employee.getSites());
		List<Site> sites = employeeUpdate.getSites();
		boolean siteExists = false;
		for(Site site : sites) {
			if(site.getId() == employee.getSiteId()) {
				siteExists = true;
			}
		}
		Project newProj = projectRepository.findOne(employee.getProjectId());
		Site newSite = siteRepository.findOne(employee.getSiteId());
		/*
		if(!projExists || !siteExists) {
			EmployeeHistory empHist = new EmployeeHistory();
			empHist.setEmployee(employeeUpdate);
			if(!projExists) {
				empHist.setProject(newProj);
			}
			if(!siteExists) {
				empHist.setSite(newSite);

			}
		    ZoneId  zone = ZoneId.of("Asia/Singapore");
		    ZonedDateTime zdt   = ZonedDateTime.of(LocalDateTime.now(), zone);
			empHist.setCreatedDate(zdt);
			empHist.setLastModifiedDate(zdt);
			employeeHistoryRepository.saveAndFlush(empHist);
		}
		*/

		employeeUpdate.setFullName(employee.getFullName());
		employeeUpdate.setName(employee.getName());
		if(newProj != null && !projExists) {
			employeeUpdate.getProjects().add(newProj);
		}
		if(newSite != null && !siteExists) {
			employeeUpdate.getSites().add(newSite);
		}
		//employeeUpdate.setProject(projectRepository.findOne(employee.getProjectId()));
		//employeeUpdate.setSite(siteRepository.findOne(employee.getSiteId()));
	    ZoneId  zone = ZoneId.of("Asia/Kolkata");
	    ZonedDateTime zdt   = ZonedDateTime.of(LocalDateTime.now(), zone);
		employeeUpdate.setLastModifiedDate(zdt);
		employeeUpdate.setCode(employee.getCode());

        if(employee.getManagerId() > 0) {
            Employee manager =  employeeRepository.findOne(employee.getManagerId());
            employeeUpdate.setManager(manager);
        }

		if(shouldUpdateActiveStatus) {
			employeeUpdate.setActive(Employee.ACTIVE_YES);
		}
		employeeRepository.saveAndFlush(employeeUpdate);
		employee = mapperUtil.toModel(employeeUpdate, EmployeeDTO.class);
		return employee;
	}

	public void deleteEmployee(Long id) {
		log.debug("Inside Delete");
		Employee employeeUpdate = employeeRepository.findOne(id);
        employeeUpdate.setActive(Employee.ACTIVE_NO);
        employeeRepository.save(employeeUpdate);
		//employeeRepository.delete(employeeUpdate);
	}

	public List<SiteDTO> deleteEmployeeSite(Long id, Long siteId) {
		log.debug("Inside delete employee site");
		Employee employeeUpdate = employeeRepository.findOne(id);
		Hibernate.initialize(employeeUpdate.getSites());
		List<Site> sites = employeeUpdate.getSites();
		Iterator<Site> siteItr = sites.iterator();
		while(siteItr.hasNext()) {
			Site s = siteItr.next();
			if(s.getId() == siteId) {
				siteItr.remove();
			}
		}
		employeeUpdate.setSites(sites);
        Employee employee = employeeRepository.saveAndFlush(employeeUpdate);
		//employeeRepository.delete(employeeUpdate);
        Hibernate.initialize(employee.getSites());
        List<Site> siteListOnUpdate = employee.getSites();
        List<SiteDTO> siteDtos = null;
        if(CollectionUtils.isNotEmpty(siteListOnUpdate)) {
        	siteDtos = mapperUtil.toModelList(siteListOnUpdate, SiteDTO.class);
        }
        return siteDtos;
	}

	public List<ProjectDTO> deleteEmployeeProject(Long id, Long projectId) {
		log.debug("Inside delete employee project");
		Employee employeeUpdate = employeeRepository.findOne(id);
		Hibernate.initialize(employeeUpdate.getProjects());
		List<Project> projects = employeeUpdate.getProjects();
		Iterator<Project> projItr = projects.iterator();
		while(projItr.hasNext()) {
			Project p = projItr.next();
			if(p.getId() == projectId) {
				projItr.remove();
			}
		}
		employeeUpdate.setProjects(projects);
		Employee employee = employeeRepository.saveAndFlush(employeeUpdate);
		//employeeRepository.delete(employeeUpdate);
		Hibernate.initialize(employeeUpdate.getProjects());
        List<Project> projListOnUpdate = employee.getProjects();
        List<ProjectDTO> projDtos = null;
        if(CollectionUtils.isNotEmpty(projListOnUpdate)) {
        	projDtos = mapperUtil.toModelList(projListOnUpdate, ProjectDTO.class);
        }
        return projDtos;

	}

	public List<EmployeeDTO> findAll(long userId) {
		User user = userRepository.findOne(userId);
		long userGroupId = user.getUserGroup().getId();
		List<Employee> entities = null;
		if(user.getUserGroup().getName().equalsIgnoreCase("admin")) {
			entities = employeeRepository.findAll();
		}else {
			entities = employeeRepository.findAll(userGroupId);
		}
		return mapperUtil.toModelList(entities, EmployeeDTO.class);
	}

    public List<EmployeeDTO> findBySiteId(long userId,long siteId) {
        User user = userRepository.findOne(userId);
        long userGroupId = user.getUserGroup().getId();
        List<Employee> entities = null;
        if(user.getUserGroup().getName().equalsIgnoreCase("admin")) {
            entities = employeeRepository.findBySiteId(siteId);
        }else {
            entities = employeeRepository.findBySiteId(siteId);
        }
        return mapperUtil.toModelList(entities, EmployeeDTO.class);
    }

	public List<EmployeeDTO> findAllEligibleManagers(long empId) {
		List<Employee> entities = null;
		entities = employeeRepository.findAllEligibleManagers(empId);
		Employee self = employeeRepository.findOne(empId);
		Set<Employee> subordinates = self.getSubOrdinates();
		List<Employee> managers = new ArrayList<Employee>(CollectionUtils.subtract(entities, subordinates));
		return mapperUtil.toModelList(managers, EmployeeDTO.class);
	}

	public EmployeeDTO findOne(Long id) {
		Employee entity = employeeRepository.findOne(id);
		Hibernate.initialize(entity.getProjects());
		List<Project> projects = entity.getProjects();
		entity.setProjects(projects);
		Hibernate.initialize(entity.getSites());
		List<Site> sites = entity.getSites();
		for(Site site : sites) {
			Hibernate.initialize(site.getProject());
			site.setProject(site.getProject());
		}
		entity.setSites(sites);
		log.debug("Employee retrieved by findOne - "+ entity );
		EmployeeDTO dto =  mapperUtil.toModel(entity, EmployeeDTO.class);
		Hibernate.initialize(entity.getManager());
		if(entity.getManager() != null) {
			dto.setManagerId(entity.getManager().getId());
			dto.setManagerName(entity.getManager().getName());
		}
		return dto;
	}

	public EmployeeDTO enrollFace(EmployeeDTO employeeDTO){
        Employee entity = employeeRepository.findOne(employeeDTO.getId());
        if (StringUtils.isEmpty(employeeDTO.getEnrolled_face())) {

            log.debug("Employee image not found");

        }else{
            log.debug("Employee image found");
            entity.setEnrolled_face("data:image/jpeg;base64,"+employeeDTO.getEnrolled_face());
            entity.setFaceIdEnrolled(true);
            entity.setFaceAuthorised(false);
            employeeRepository.saveAndFlush(entity);
        }


        employeeDTO = mapperUtil.toModel(entity, EmployeeDTO.class);
        return employeeDTO;
    }

    public EmployeeDTO authorizeImage(EmployeeDTO employeeDTO){
        Employee entity = employeeRepository.findOne(employeeDTO.getId());
        if (StringUtils.isEmpty(entity.getEnrolled_face())) {
            log.debug("Employee image not saved previously");
        }else{
            log.debug("Employee image found");
            entity.setFaceAuthorised(true);
            employeeRepository.saveAndFlush(entity);
        }


        employeeDTO = mapperUtil.toModel(entity, EmployeeDTO.class);
        return employeeDTO;
    }

	public EmployeeDTO findByUserId(Long userId){
		Employee entity = employeeRepository.findByUserId(userId);
		Hibernate.initialize(entity.getUser());
		return mapperUtil.toModel(entity, EmployeeDTO.class);
	}

	public List<EmployeeDTO> findListByUserId(Long userId){
		List<Employee> entity = employeeRepository.findListByUserId(userId);
		return mapperUtil.toModelList(entity, EmployeeDTO.class);
	}

	public EmployeeDTO validateCode(Long code) {
		Employee entity = employeeRepository.findByCode(code);
		EmployeeDTO empModel = null;
		if(entity != null) {
			empModel = mapperUtil.toModel(entity, EmployeeDTO.class);
//			List<CheckInOut> checkInOutExistingList = checkInOutRepository.findByEmployeeIdOrderByCheckInDateTime(empModel.getId());
//			CheckInOut checkInOut = CollectionUtils.isNotEmpty(checkInOutExistingList) ? checkInOutExistingList.get(0) : null;
//			if(checkInOut != null) {
//				if(checkInOut.getCheckInDateTime() != null && checkInOut.getCheckOutDateTime() == null) {
//					empModel.setCheckedIn(true);
//					empModel.setSiteId(checkInOut.getSite().getId());
//					empModel.setSiteName(checkInOut.getSite().getName());
//					empModel.setJobId(checkInOut.getJob().getId());
//					empModel.setJobTitle(checkInOut.getJob().getTitle());
//				}
//			}
		}

		return empModel;
	}

	public List<EmployeeHistoryDTO> getHistory(Long empId) {
		List<EmployeeHistory> empHistory = employeeHistoryRepository.findByEmployeeId(empId);
		return mapperUtil.toModelList(empHistory, EmployeeHistoryDTO.class);
	}

	public SearchResult<EmployeeDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		User user = userRepository.findOne(searchCriteria.getUserId());
    	long userGroupId = user.getUserGroup().getId();
		SearchResult<EmployeeDTO> result = new SearchResult<EmployeeDTO>();
		if(searchCriteria != null) {
			Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
			Page<Employee> page = null;
			List<EmployeeDTO> transactions = null;
			log.debug("findBySearchCriteria - "+searchCriteria.getSiteId() +", "+searchCriteria.getEmployeeId() +", "+searchCriteria.getProjectId());
			if((searchCriteria.getSiteId() != 0 && searchCriteria.getProjectId() != 0)) {
				//page = employeeRepository.findEmployeesByIdOrSiteIdAndProjectId(searchCriteria.getEmployeeId(), searchCriteria.getProjectId(), searchCriteria.getSiteId(), userGroupId, pageRequest);
			}else if((searchCriteria.getSiteId() != 0 && searchCriteria.getEmployeeId() != 0)) {
				log.debug("findBySearchCriteria - "+searchCriteria.getSiteId() +", "+searchCriteria.getEmployeeId() +", "+searchCriteria.getProjectId());
				//page = employeeRepository.findEmployeesByIdAndSiteIdOrProjectId(searchCriteria.getEmployeeId(), searchCriteria.getProjectId(), searchCriteria.getSiteId(), userGroupId, pageRequest);
			}else if((searchCriteria.getEmployeeId() != 0 && searchCriteria.getProjectId() != 0)) {
				//page = employeeRepository.findEmployeesByIdAndProjectIdOrSiteId(searchCriteria.getEmployeeId(), searchCriteria.getProjectId(), searchCriteria.getSiteId(), userGroupId, pageRequest);
			}else if (searchCriteria.getEmployeeId() != 0 && searchCriteria.getProjectId() != 0 && searchCriteria.getSiteId() != 0) {
                //page = employeeRepository.findEmployeesByIdAndSiteIdAndProjectId(searchCriteria.getEmployeeId(), searchCriteria.getProjectId(), searchCriteria.getSiteId(), userGroupId, pageRequest);
            }else if (searchCriteria.getEmployeeId() != 0) {
			    page = employeeRepository.findByEmployeeId(searchCriteria.getEmployeeId(),pageRequest);
            	//page = employeeRepository.findEmployeesByIdOrSiteIdAndProjectId(searchCriteria.getEmployeeId(), searchCriteria.getProjectId(), searchCriteria.getSiteId(), userGroupId, pageRequest);
            }else if (searchCriteria.getProjectId() != 0) {
            	//page = employeeRepository.findEmployeesByIdAndSiteIdOrProjectId(searchCriteria.getEmployeeId(), searchCriteria.getProjectId(), searchCriteria.getSiteId(), userGroupId, pageRequest);
            }else if (searchCriteria.getSiteId() != 0) {
            	//page = employeeRepository.findEmployeesByIdAndProjectIdOrSiteId(searchCriteria.getEmployeeId(), searchCriteria.getProjectId(), searchCriteria.getSiteId(), userGroupId, pageRequest);
            }else {
            	if(user.getUserGroup().getName().equalsIgnoreCase("admin")) {
            		page = employeeRepository.findAll(pageRequest);
            	}else {
            		page = employeeRepository.findEmployees(userGroupId, pageRequest);
            	}
            }

			if(page != null) {
				transactions = mapperUtil.toModelList(page.getContent(), EmployeeDTO.class);
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}
		}
		return result;
	}

	public String generateQRCode(long empId) {
		Employee empEntity = employeeRepository.findOne(empId);
		byte[] qrCodeImage = null;
		String qrCodeBase64 = null;
		if(empEntity != null) {
			String code = String.valueOf(empEntity.getEmpId());
			qrCodeImage = QRCodeUtil.generateQRCode(code);
			String qrCodePath = env.getProperty("qrcode.file.path");
			String imageFileName = null;
			if(StringUtils.isNotEmpty(qrCodePath)) {
				imageFileName = fileUploadHelper.uploadQrCodeFile(code, qrCodeImage);
				empEntity.setQrCodeImage(imageFileName);
				employeeRepository.save(empEntity);
			}
			if(qrCodeImage != null && StringUtils.isNotBlank(imageFileName)) {
				qrCodeBase64 = fileUploadHelper.readQrCodeFile(imageFileName);
			}
		}
		return qrCodeBase64;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<Employee> page, List<EmployeeDTO> transactions, SearchResult<EmployeeDTO> result) {
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
