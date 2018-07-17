package com.ts.app.service;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.TimeZone;

import javax.inject.Inject;

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
import org.springframework.transaction.annotation.Transactional;

import com.google.api.client.repackaged.org.apache.commons.codec.binary.Base64;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.CheckInOut;
import com.ts.app.domain.CheckInOutImage;
import com.ts.app.domain.Designation;
import com.ts.app.domain.Device;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeHistory;
import com.ts.app.domain.EmployeeLocation;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.EmployeeShift;
import com.ts.app.domain.Job;
import com.ts.app.domain.Project;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import com.ts.app.domain.UserRoleEnum;
import com.ts.app.repository.AttendanceRepository;
import com.ts.app.repository.CheckInOutImageRepository;
import com.ts.app.repository.CheckInOutRepository;
import com.ts.app.repository.DesignationRepository;
import com.ts.app.repository.DeviceRepository;
import com.ts.app.repository.EmployeeHistoryRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.EmployeeShiftRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.repository.UserRoleRepository;
import com.ts.app.service.util.AmazonS3Utils;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.FileUploadHelper;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.QRCodeUtil;
import com.ts.app.web.rest.dto.AttendanceDTO;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.CheckInOutDTO;
import com.ts.app.web.rest.dto.CheckInOutImageDTO;
import com.ts.app.web.rest.dto.DesignationDTO;
import com.ts.app.web.rest.dto.EmployeeDTO;
import com.ts.app.web.rest.dto.EmployeeHistoryDTO;
import com.ts.app.web.rest.dto.EmployeeProjectSiteDTO;
import com.ts.app.web.rest.dto.EmployeeShiftDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.ImageDeleteRequest;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.ProjectDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.SiteDTO;
import com.ts.app.web.rest.dto.UserDTO;
import com.ts.app.web.rest.dto.UserRoleDTO;

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
    private DeviceRepository deviceRepository;

    @Inject
    private JobRepository jobRepository;

    @Inject
    private DesignationRepository designationRepository;

    @Inject
    private CheckInOutRepository checkInOutRepository;

    @Inject
    private CheckInOutImageRepository checkInOutImageRepository;

	@Inject
	private EmployeeHistoryRepository employeeHistoryRepository;

	@Inject
	private SiteRepository siteRepository;

	@Inject
	private UserRepository userRepository;

	@Inject
	private UserRoleRepository userRoleRepository;

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

	@Inject
	private MailService mailService;

    @Inject
    private JobManagementService jobManagementService;

    @Inject
    private AttendanceService attendanceService;

    @Inject
    private UserRoleService userRoleService;

    @Inject
    private EmployeeShiftRepository employeeShiftRepository;

	@Inject
	private Environment env;
	
	@Inject
	private AmazonS3Utils amazonS3utils;

	public EmployeeDTO findByEmpId(String empId) {
        Employee employee = employeeRepository.findByEmpId(empId);
		EmployeeDTO employeeDto = null;
		if(employee!=null) {
			employeeDto = mapperUtil.toModel(employee, EmployeeDTO.class);
		}
		return employeeDto;
	}

	public boolean isDuplicate(EmployeeDTO employeeDTO) {
	    log.debug("Empid "+employeeDTO.getEmpId());
		SearchCriteria criteria = new SearchCriteria();
		criteria.setEmployeeEmpId(employeeDTO.getEmpId());
		SearchResult<EmployeeDTO> searchResults = findBySearchCrieria(criteria);
		if(searchResults != null && CollectionUtils.isNotEmpty(searchResults.getTransactions())) {
			return true;
		}
		return false;
	}

	public EmployeeDTO createEmployeeInformation(EmployeeDTO employeeDto) {
		// log.info("The admin Flag value is " +adminFlag);
		log.debug("EmployeeService.createEmployeeInformation - userId - "+employeeDto.getUserId());
        /*Employee existingEmployee = employeeRepository.findByEmpId(employeeDto.getEmpId());
		if(existingEmployee!=null && existingEmployee.getActive().equals(Employee.ACTIVE_NO)) { //existing employee update and activate
			employeeDto.setId(existingEmployee.getId());
		    ZoneId  zone = ZoneId.of("Asia/Singapore");
		    ZonedDateTime zdt   = ZonedDateTime.of(LocalDateTime.now(), zone);
		    //update and activate the existing employee.

			employeeDto = updateEmployee(employeeDto, true);
		}else {*/
			employeeDto.setFullName(employeeDto.getName());
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
			employee.setFaceAuthorised(false);
			employee.setFaceIdEnrolled(false);
			employee.setLeft(false);
			employee.setRelieved(false);
			employee.setReliever(false);
			List<EmployeeProjectSite> projectSites =  employee.getProjectSites();
			if(CollectionUtils.isNotEmpty(projectSites)) {
				for(EmployeeProjectSite projSite : projectSites) {
					projSite.setEmployee(employee);
				}
			}
			List<EmployeeLocation> locations = employee.getLocations();
			if(CollectionUtils.isNotEmpty(locations)) {
				for(EmployeeLocation loc : locations) {
					loc.setEmployee(employee);
				}
			}
			if(employeeDto.getUserRoleId() > 0) {
				UserRoleDTO userRoleDTO = userRoleService.findOne(employeeDto.getUserRoleId());
				if(userRoleDTO.getName().startsWith("Client")) {
					employee.setClient(true); //mark the employee as client employee
				}
			}
			employee = employeeRepository.save(employee);
			//create user if opted.
			if(employeeDto.isCreateUser() && employeeDto.getUserRoleId() > 0) {
				UserDTO user = new UserDTO();
				user.setLogin(employee.getEmpId());
				user.setPassword(employee.getEmpId());
				user.setFirstName(employee.getName());
				user.setLastName(employee.getLastName());
				user.setEmail(employee.getEmail());
				user.setAdminFlag("N");
				user.setUserRoleId(employeeDto.getUserRoleId());
				user.setEmployeeId(employee.getId());
				user.setActivated(true);
				userService.createUserInformation(user);

			}

			log.debug("Created Information for Employee: {}", employee);
			employeeDto = mapperUtil.toModel(employee, EmployeeDTO.class);
		//}
		return employeeDto;
	}

    public DesignationDTO createDesignation(DesignationDTO designationDTO) {
        Designation designation= mapperUtil.toEntity(designationDTO, Designation.class);
	    designationRepository.save(designation);
        return designationDTO;
    }

	public EmployeeDTO updateEmployee(EmployeeDTO employee, boolean shouldUpdateActiveStatus) {
		log.debug("Inside Update");
		log.debug("Inside Update"+employee);
		log.debug("Inside Update"+employee.isLeft());
		Employee employeeUpdate = employeeRepository.findOne(employee.getId());
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
		employeeUpdate.setLastName(employee.getLastName());
	    ZoneId  zone = ZoneId.of("Asia/Kolkata");
	    ZonedDateTime zdt   = ZonedDateTime.of(LocalDateTime.now(), zone);
		employeeUpdate.setLastModifiedDate(zdt);
		employeeUpdate.setCode(employee.getCode());
        employeeUpdate.setLeft(employee.isLeft());
        employeeUpdate.setReliever(employee.isReliever());
        employeeUpdate.setRelieved(employee.isRelieved());
        employeeUpdate.setPhone(employee.getPhone());
        employeeUpdate.setEmail(employee.getEmail());
        if(employee.getManagerId() > 0) {
            Employee manager =  employeeRepository.findOne(employee.getManagerId());
            employeeUpdate.setManager(manager);
        }

		if(shouldUpdateActiveStatus) {
			employeeUpdate.setActive(Employee.ACTIVE_YES);
		}
		List<EmployeeProjectSite> projectSites =  employeeUpdate.getProjectSites();
		projectSites.clear();
		List<EmployeeProjectSite> updatedProjSites = new ArrayList<EmployeeProjectSite>();
		if(CollectionUtils.isNotEmpty(employee.getProjectSites())) {
			for(EmployeeProjectSiteDTO projSiteDto : employee.getProjectSites()) {
				EmployeeProjectSite projSite = mapperUtil.toEntity(projSiteDto, EmployeeProjectSite.class);
//				if(CollectionUtils.isEmpty(projSite.getShifts())) {
//					projSite.setShifts(new ArrayList<EmployeeShift>());
//				}
				projSite.setEmployee(employeeUpdate);
				updatedProjSites.add(projSite);
			}
		}
		employeeUpdate.getProjectSites().addAll(updatedProjSites);
		Hibernate.initialize(employeeUpdate.getUser());
		User user = employeeUpdate.getUser();
		if(user != null) {
			if(employee.isLeft() || employee.isRelieved() || employeeUpdate.getActive().equalsIgnoreCase(Employee.ACTIVE_NO)) {
				user.setActivated(false);
				user.setActive(Employee.ACTIVE_NO);
			}
			user.setFirstName(employee.getName());
			user.setLastName(employee.getLastName());
			user.setEmail(employeeUpdate.getEmail());
		}
		employeeUpdate.setUser(user);
		if(employee.getUserRoleId() > 0) {
			UserRoleDTO userRoleDTO = userRoleService.findOne(employee.getUserRoleId());
			if(userRoleDTO.getName().startsWith("Client")) {
				employee.setClient(true); //mark the employee as client employee
			}
		}

		employeeRepository.saveAndFlush(employeeUpdate);
		employee = mapperUtil.toModel(employeeUpdate, EmployeeDTO.class);
		return employee;
	}

	public void updateEmployeeShifts(List<EmployeeShiftDTO> employeeShifts) {
		if(CollectionUtils.isNotEmpty(employeeShifts)) {
			for(EmployeeShiftDTO empShiftDto : employeeShifts) {
				updateEmployeeShift(empShiftDto);
			}
		}
	}

	public EmployeeShiftDTO updateEmployeeShift(EmployeeShiftDTO employeeShift) {
		log.debug("Inside Employee Shift Update");
		EmployeeShift employeeShiftUpdate = employeeShiftRepository.findOne(employeeShift.getId());
	    ZoneId  zone = ZoneId.of("Asia/Kolkata");
	    ZonedDateTime zdt   = ZonedDateTime.of(LocalDateTime.now(), zone);
		employeeShiftUpdate.setLastModifiedDate(zdt);
		//udpate site
		Site site = siteRepository.findOne(employeeShift.getSiteId());
		employeeShiftUpdate.setSite(site);
		employeeShiftUpdate.setStartTime(DateUtil.convertToTimestamp(employeeShift.getStartTime()));
		employeeShiftUpdate.setEndTime(DateUtil.convertToTimestamp(employeeShift.getEndTime()));
		employeeShiftRepository.saveAndFlush(employeeShiftUpdate);
		employeeShift = mapperUtil.toModel(employeeShiftUpdate, EmployeeShiftDTO.class);
		return employeeShift;
	}


	public void deleteEmployee(Long id) {
		log.debug("Inside Delete");
		Employee employeeUpdate = employeeRepository.findOne(id);
        employeeUpdate.setActive(Employee.ACTIVE_NO);
        employeeRepository.save(employeeUpdate);
		//employeeRepository.delete(employeeUpdate);
	}

	public void deleteEmployeeShift(long id) {
		log.debug("Inside Employee Shift Delete");
		EmployeeShift employeeShiftUpdate = employeeShiftRepository.findOne(id);
        Calendar currCal = Calendar.getInstance();
        Calendar startCal = Calendar.getInstance();
        startCal.setTimeInMillis(employeeShiftUpdate.getStartTime().getTime());
        if(currCal.before(startCal)) {
    			employeeShiftRepository.delete(employeeShiftUpdate);
        }
	}

	public List<SiteDTO> deleteEmployeeSite(Long id, Long siteId) {
		log.debug("Inside delete employee site");
		Employee employeeUpdate = employeeRepository.findOne(id);
        Employee employee = employeeRepository.saveAndFlush(employeeUpdate);
		//employeeRepository.delete(employeeUpdate);
        List<SiteDTO> siteDtos = null;
        return siteDtos;
	}

	public List<ProjectDTO> deleteEmployeeProject(Long id, Long projectId) {
		log.debug("Inside delete employee project");
		Employee employeeUpdate = employeeRepository.findOne(id);

        List<ProjectDTO> projDtos = null;
        return projDtos;

	}

    @Transactional
    public CheckInOutDTO onlyCheckOut(CheckInOutDTO checkInOutDto) {

        log.debug("EmployeeService.checkOut - empId - "+checkInOutDto.getEmployeeEmpId());
        //CheckInOut checkInOut = mapperUtil.toEntity(checkInOutDto, CheckInOut.class);
        Timestamp zdt   = new Timestamp(System.currentTimeMillis());
        CheckInOut checkInOut = new CheckInOut();
        checkInOutDto.setCheckInDateTime(zdt);
        checkInOut.setCheckOutDateTime(zdt);
        Device checkoutDevice = deviceRepository.findByUniqueId(checkInOutDto.getDeviceOutUniqueId());
//        checkInOut.setDeviceOut(checkoutDevice);
        checkInOut.setMinsWorked(0);
        checkInOut.setEmployee(employeeRepository.findOne(checkInOutDto.getEmployeeId()));
        checkInOut.setProject(projectRepository.findOne(checkInOutDto.getProjectId()));
        checkInOut.setSite(siteRepository.findOne(checkInOutDto.getSiteId()));
        Job job = jobRepository.findOne(checkInOutDto.getJobId());
        zdt = new  Timestamp(job.getPlannedStartTime().getTime());
        checkInOut.setCheckInDateTime(zdt);
        checkInOut.setJob(job);
//        Device device = deviceRepository.findByUniqueId(checkInOutDto.getDeviceInUniqueId());
//        log.debug("device id " + (device == null ? 0 : device.getId()));
//        if(device != null) {
//            checkInOut.setDeviceIn(device);
//        }else {
//            checkInOut.setDeviceIn(checkoutDevice);
//        }
//        //checkInOut.setDeviceOut(device);
        checkInOut.setLongitudeOut(checkInOutDto.getLongitudeOut());
        checkInOut.setLatitudeOut(checkInOutDto.getLatitudeOut());
        checkInOut.setRemarks(checkInOutDto.getRemarks());
        checkInOut = checkInOutRepository.save(checkInOut);
        checkInOutDto.setId(checkInOut.getId());
        JobDTO completedJob = jobManagementService.onlyCompleteJob(checkInOutDto.getJobId());
        log.debug("onlyCheckOut - completedJob" + completedJob);
        log.debug("Transaction id "+checkInOutDto.getId());
        if(completedJob != null) {
            long siteId = completedJob.getSiteId();
            long transactionId = checkInOutDto.getId();
            log.debug("onlyCheckOut - completedJob siteId -" + transactionId);
            List<User> users = userService.findUsers(siteId);
            log.debug("onlyCheckOut - completedJob users  -" + users);
            if(CollectionUtils.isNotEmpty(users)) {
                long userIds[] = new long[users.size()];
                int ind = 0;
                for(User user : users) {
                    userIds[ind] = user.getId();
                    log.debug("onlyCheckOut - completedJob user id  -" + user.getId());
                    ind++;
                    mailService.sendCompletedJobAlert(user, completedJob.getSiteName(), completedJob.getId(), completedJob.getTitle(), null);
                }
                String message = "Job  -"+ completedJob.getTitle() + " completed for site-" + completedJob.getSiteName();
                log.debug("push message -"+ message);
                pushService.send(userIds, message);
                jobManagementService.saveNotificationLog(checkInOutDto.getJobId(),checkInOutDto.getUserId(), users, siteId, message);
            }
        }
        log.debug("tranction Id",checkInOutDto.getId());
        log.debug("Created check out Information for Employee: {}", checkInOut.getEmployee().getEmpId());

        return checkInOutDto;

    }

    @Transactional
    public CheckInOutDTO saveCheckOutInfo(CheckInOutDTO checkInOutDto) {

        log.debug("EmployeeService.checkOut - empId - "+checkInOutDto.getEmployeeEmpId());
        //CheckInOut checkInOut = mapperUtil.toEntity(checkInOutDto, CheckInOut.class);
        Timestamp zdt   = new Timestamp(System.currentTimeMillis());
        CheckInOut checkInOut = new CheckInOut();

        if (checkInOutDto.getId()>0) {
            log.debug("Checkinout available");
            checkInOut = checkInOutRepository.findOne(checkInOutDto.getId());
        }
        checkInOutDto.setCheckInDateTime(zdt);
        checkInOut.setCheckOutDateTime(zdt);
        Device checkoutDevice = deviceRepository.findByUniqueId(checkInOutDto.getDeviceOutUniqueId());
//        checkInOut.setDeviceOut(checkoutDevice);
        checkInOut.setMinsWorked(0);
        checkInOut.setEmployee(employeeRepository.findOne(checkInOutDto.getEmployeeId()));
        checkInOut.setProject(projectRepository.findOne(checkInOutDto.getProjectId()));
        checkInOut.setSite(siteRepository.findOne(checkInOutDto.getSiteId()));
        Job job = jobRepository.findOne(checkInOutDto.getJobId());
        zdt = new  Timestamp(job.getPlannedStartTime().getTime());
        checkInOut.setCheckInDateTime(zdt);
        checkInOut.setJob(job);
//        Device device = deviceRepository.findByUniqueId(checkInOutDto.getDeviceInUniqueId());
//        log.debug("device id " + (device == null ? 0 : device.getId()));
//        if(device != null) {
//            checkInOut.setDeviceIn(device);
//        }else {
//            checkInOut.setDeviceIn(checkoutDevice);
//        }
//        //checkInOut.setDeviceOut(device);
        checkInOut.setLongitudeOut(checkInOutDto.getLongitudeOut());
        checkInOut.setLatitudeOut(checkInOutDto.getLatitudeOut());
        checkInOut.setRemarks(checkInOutDto.getRemarks());
        checkInOut = checkInOutRepository.save(checkInOut);
        checkInOutDto.setId(checkInOut.getId());
        if(checkInOutDto.isCompleteJob()){
            JobDTO completedJob = jobManagementService.onlyCompleteJob(checkInOutDto.getJobId());
            log.debug("onlyCheckOut - completedJob" + completedJob);
            log.debug("Transaction id "+checkInOutDto.getId());
            if(completedJob != null) {
                long siteId = completedJob.getSiteId();
                long transactionId = checkInOutDto.getId();
                log.debug("onlyCheckOut - completedJob siteId -" + transactionId);
                //List<User> users = userService.findUsers(siteId);
                User jobUser = job.getEmployee().getUser();
                List<User> users = new ArrayList<User>();
                users.add(jobUser);
                log.debug("onlyCheckOut - completedJob users  -" + users);
                if(CollectionUtils.isNotEmpty(users)) {
                    long userIds[] = new long[users.size()];
                    int ind = 0;
                    for(User user : users) {
                        userIds[ind] = user.getId();
                        log.debug("onlyCheckOut - completedJob user id  -" + user.getId());
                        ind++;
                        mailService.sendCompletedJobAlert(user, completedJob.getSiteName(), completedJob.getId(), completedJob.getTitle(), null);
                    }
                    String message = "Job  -"+ completedJob.getTitle() + " completed for site-" + completedJob.getSiteName();
                    log.debug("push message -"+ message);
                    pushService.send(userIds, message);
                    jobManagementService.saveNotificationLog(checkInOutDto.getJobId(),checkInOutDto.getUserId(), users, siteId, message);
                }
            }
        }
        log.debug("tranction Id",checkInOutDto.getId());
        log.debug("Created check out Information for Employee: {}", checkInOut.getEmployee().getEmpId());

        return checkInOutDto;

    }

    @Transactional
    public CheckInOutImageDTO uploadFile(CheckInOutImageDTO checkInOutImageDto) {
        log.debug("EmployeeService.uploadFile - action - "+checkInOutImageDto.getAction());
        log.debug("Employee list from check in out images"+checkInOutImageDto.getEmployeeEmpId());
        checkInOutImageDto = amazonS3utils.uploadEmployeeFile(checkInOutImageDto.getEmployeeEmpId(), checkInOutImageDto, checkInOutImageDto.getAction(), checkInOutImageDto.getPhotoOutFile(), System.currentTimeMillis());
        checkInOutImageDto.setPhotoOut(checkInOutImageDto.getPhotoOut());
        CheckInOutImage checkInOutImage = new CheckInOutImage();
        checkInOutImage.setPhotoOut(checkInOutImageDto.getPhotoOut());
        checkInOutImage.setCheckInOut(checkInOutRepository.findOne(checkInOutImageDto.getCheckInOutId()));
        checkInOutImage.setProject(projectRepository.findOne(checkInOutImageDto.getProjectId()));
        checkInOutImage.setEmployee(employeeRepository.findOne(checkInOutImageDto.getEmployeeId()));
        checkInOutImage.setSite(siteRepository.findOne(checkInOutImageDto.getSiteId()));
        checkInOutImage.setJob(jobRepository.findOne((checkInOutImageDto.getJobId())));
        log.debug("Before save image::::::"+checkInOutImage);
        checkInOutImage = checkInOutImageRepository.save(checkInOutImage);
        return checkInOutImageDto;
    }

    @Transactional(readOnly = true)
    public SearchResult findAllCheckInOut(SearchCriteria searchCriteria) {
        Timestamp checkInDt = new Timestamp(System.currentTimeMillis());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            checkInDt = new Timestamp(sdf.parse(sdf.format(checkInDt)).getTime());
        } catch (ParseException e) {
            log.error("Error while parsing the date");
        }
        Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
        Page<CheckInOut> page = checkInOutRepository.findByCheckInDateTimeRange(checkInDt,checkInDt,pageRequest);
        List<CheckInOutDTO> dtoList = mapperUtil.toModelList(page.getContent(), CheckInOutDTO.class);
        SearchResult result = new SearchResult();
        result.setTotalPages(page.getTotalPages());
        result.setCurrPage(page.getNumber() + 1);
        result.setTotalCount(page.getTotalElements());
        result.setTransactions(dtoList);
        return result;
    }

    public String getEmployeeCheckInImage(String employeeEmpId, String imageId) {
        return fileUploadHelper.readImageFile(employeeEmpId, imageId);
    }

    @Transactional
    public List<String> deleteImages(String employeeEmpId, ImageDeleteRequest deleteRequest) {
        List<String> imagesDeleted = fileUploadHelper.deleteImages(employeeEmpId, deleteRequest.getImageIds());
        List<Long> transIds = deleteRequest.getTransIds();
        if(CollectionUtils.isNotEmpty(transIds)) {
            for(Long transId : transIds) {
                CheckInOut transaction = checkInOutRepository.findOne(transId);
                if(transaction != null) {
                    transaction.setPhotoIn(null);
                    transaction.setPhotoOut(null);
                    checkInOutRepository.save(transaction);
                }
            }
        }
        return imagesDeleted;
    }

    @Transactional(readOnly = true)
    public SearchResult<CheckInOutDTO> findCheckInOut(Long employeeId, int currPage, boolean findAll){
        SearchResult<CheckInOutDTO> result = new SearchResult<CheckInOutDTO>();
        if(!findAll) {
            Pageable pageRequest = createPageRequest(currPage);
            Page<CheckInOut> page = checkInOutRepository.findByEmployeeId(employeeId, pageRequest);
            List<CheckInOutDTO> dtoList = mapperUtil.toModelList(page.getContent(), CheckInOutDTO.class);
            result.setTotalPages(page.getTotalPages());
            result.setCurrPage(page.getNumber() + 1);
            result.setTotalCount(page.getTotalElements());
            result.setTransactions(dtoList);
        }else {
            List<CheckInOut> transactions = checkInOutRepository.findByEmployeeIdOrderByCheckInDateTime(employeeId);
            List<CheckInOutDTO> dtoList = mapperUtil.toModelList(transactions, CheckInOutDTO.class);
            result.setTransactions(dtoList);
            if(CollectionUtils.isNotEmpty(dtoList)) {
                result.setTotalCount(dtoList.size());
            }
        }
        return result;
    }

	public List<EmployeeDTO> findAll(long userId) {
		User user = userRepository.findOne(userId);
		List<Employee> entities = null;
		if(user.getUserRole().getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue())) {
			entities = employeeRepository.findAll();
		}else {
			List<Long> subEmpIds = null;
			subEmpIds = findAllSubordinates(user.getEmployee(), subEmpIds);
			entities = employeeRepository.findAllByIds(subEmpIds);
		}
		//return mapperUtil.toModelList(entities, EmployeeDTO.class);
		List<EmployeeDTO> empList = new ArrayList<EmployeeDTO>();
		if(CollectionUtils.isNotEmpty(entities)) {
			for(Employee empEntity : entities) {
				empList.add(mapToModel(empEntity));
			}
		}
		return empList;
	}

    public List<EmployeeDTO> findAllRelievers(long userId) {
        User user = userRepository.findOne(userId);
        List<Employee> entities = null;
        if(user.getUserRole().getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue())) {
            entities = employeeRepository.findAllRelievers();
        }else {
			List<Long> subEmpIds = null;
			subEmpIds = findAllSubordinates(user.getEmployee(), subEmpIds);
            entities = employeeRepository.findAllRelieversByIds(subEmpIds);
        }
        return mapperUtil.toModelList(entities, EmployeeDTO.class);
    }

    public List<EmployeeDTO> findBySiteId(long userId,long siteId) {
        List<EmployeeDTO> employeeDtos = null;
        User user = userRepository.findOne(userId);
        List<Employee> entities = null;
        if(user.getUserRole().getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue())) {
            entities = employeeRepository.findBySiteId(siteId);
        }else {
            List<Long> subEmpIds = null;
            subEmpIds = findAllSubordinates(user.getEmployee(), subEmpIds);
            entities = employeeRepository.findBySiteIdAndEmpIds(siteId, subEmpIds);
        }
        //return mapperUtil.toModelList(entities, EmployeeDTO.class);
        if(CollectionUtils.isNotEmpty(entities)) {
            employeeDtos = new ArrayList<EmployeeDTO>();
            for(Employee emp : entities) {
                employeeDtos.add(mapToModel(emp));

            }
        }
        return employeeDtos;
    }

    public List<EmployeeDTO> findWithAttendanceBySiteId(long userId,long siteId) {
        List<EmployeeDTO> employeeDtos = null;
        User user = userRepository.findOne(userId);
        List<Employee> entities = null;
        if(user.getUserRole().getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue())) {
            entities = employeeRepository.findBySiteId(siteId);
        }else {
            List<Long> subEmpIds = null;
            subEmpIds = findAllSubordinates(user.getEmployee(), subEmpIds);
            entities = employeeRepository.findBySiteIdAndEmpIds(siteId, subEmpIds);
        }
        //return mapperUtil.toModelList(entities, EmployeeDTO.class);
        if(CollectionUtils.isNotEmpty(entities)) {
            employeeDtos = new ArrayList<EmployeeDTO>();
            for(Employee emp : entities) {
                //EmployeeDTO employeeDTO = mapToModel(emp);
          		EmployeeDTO empDto = new EmployeeDTO();
	        		empDto.setId(emp.getId());
	        		empDto.setEmpId(emp.getEmpId());
	        		empDto.setName(emp.getName());
	        		empDto.setFullName(emp.getFullName());
	        		empDto.setLastName(emp.getLastName());
	        		empDto.setFaceAuthorised(emp.isFaceAuthorised());
	        		empDto.setFaceIdEnrolled(emp.isFaceIdEnrolled());
                SearchCriteria sc = new SearchCriteria();
                sc.setEmployeeEmpId(emp.getEmpId());
                sc.setSiteId(siteId);
                sc.setEmployeeId(emp.getId());
                List<AttendanceDTO> result = attendanceService.findEmpCheckInInfo(sc);
                if(CollectionUtils.isNotEmpty(result)) {
                    AttendanceDTO attendanceDTO = result.get(0);
                    log.debug("Employee checked in "+result.size());
                    empDto.setCheckedIn(true);
                    empDto.setNotCheckedOut(attendanceDTO.isNotCheckedOut());
                    empDto.setAttendanceId(attendanceDTO.getId());
                    empDto.setSiteId(attendanceDTO.getSiteId());
                    empDto.setSiteName(attendanceDTO.getSiteName());
                }else{
                    log.debug("Employee checked false "+result.size());
                    empDto.setCheckedIn(false);
                    empDto.setSiteName(CollectionUtils.isNotEmpty(emp.getProjectSites()) ? emp.getProjectSites().get(0).getSite().getName() : "");
                    empDto.setSiteId(CollectionUtils.isNotEmpty(emp.getProjectSites()) ? emp.getProjectSites().get(0).getSite().getId() : 0);

                }
                employeeDtos.add(empDto);

            }
        }
        return employeeDtos;
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
		Hibernate.initialize(entity.getProjectSites());
		if(CollectionUtils.isNotEmpty(entity.getProjectSites())) {
			/*
			for(EmployeeProjectSite projSite : entity.getProjectSites()) {
				Project proj =  projectRepository.findOne(projSite.getProjectId());
				projSite.setProjectName(proj.getName());
				Site site =  siteRepository.findOne(projSite.getSiteId());
				projSite.setSiteName(site.getName());
			}
			*/
		}
		log.debug("Employee retrieved by findOne - "+ entity );
		EmployeeDTO dto =  mapperUtil.toModel(entity, EmployeeDTO.class);
		Hibernate.initialize(entity.getManager());
		if(entity.getManager() != null) {
			dto.setManagerId(entity.getManager().getId());
			dto.setManagerName(entity.getManager().getFullName());
		}
		//entity.setProjectSites(entity.getProjectSites());
		return dto;
	}

	public EmployeeDTO enrollFace(EmployeeDTO employeeDTO){
        Employee entity = employeeRepository.findOne(employeeDTO.getId());
        if (StringUtils.isEmpty(employeeDTO.getEnrolled_face())) {
            log.debug("Employee image not found");
        }else{
        	String enrollImage = employeeDTO.getEnrolled_face();
            log.debug("Employee image found");
            long dateTime = new Date().getTime(); 
            employeeDTO = amazonS3utils.uploadEnrollImage(enrollImage, employeeDTO, dateTime);
            employeeDTO.setUrl(employeeDTO.getUrl());
            entity.setEnrolled_face(employeeDTO.getEnrolled_face());
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

	private Sort orderByASC(String columnName) {
	    return new Sort(Sort.Direction.ASC, columnName);
	}
//
	private Sort orderByDESC(String columnName) {
	    return new Sort(Sort.Direction.DESC, columnName);
	}

	public SearchResult<EmployeeDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		User user = userRepository.findOne(searchCriteria.getUserId());
		SearchResult<EmployeeDTO> result = new SearchResult<EmployeeDTO>();
		if(searchCriteria != null) {
			Pageable pageRequest = null;
			if(searchCriteria.isList()) {
				pageRequest = createPageRequest(searchCriteria.getCurrPage(), true);
			}else {
				pageRequest = createPageRequest(searchCriteria.getCurrPage());
			}

			Page<Employee> page = null;
			List<EmployeeDTO> transactions = null;

            Calendar startCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
            if(searchCriteria.getFromDate() != null) {
            		startCal.setTime(searchCriteria.getFromDate());
            }
	    		startCal.set(Calendar.HOUR_OF_DAY, 0);
	    		startCal.set(Calendar.MINUTE, 0);
	    		startCal.set(Calendar.SECOND, 0);
	    		Calendar endCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
	    		if(searchCriteria.getToDate() != null) {
	    			endCal.setTime(searchCriteria.getToDate());
	    		}
	    		endCal.set(Calendar.HOUR_OF_DAY, 23);
	    		endCal.set(Calendar.MINUTE, 59);
	    		endCal.set(Calendar.SECOND, 0);

	    		//searchCriteria.setFromDate(startCal.getTime());
	    		//searchCriteria.setToDate(endCal.getTime());


			java.sql.Date startDate = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(startCal));
			java.sql.Date toDate = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(endCal));

			log.debug("findBySearchCriteria - "+searchCriteria.getSiteId() +", "+searchCriteria.getEmployeeId() +", "+searchCriteria.getProjectId());

			boolean isClient = false;

			if(user != null && user.getUserRole() != null) {
				isClient = user.getUserRole().getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue());
			}

			if((searchCriteria.getSiteId() != 0 && searchCriteria.getProjectId() != 0)) {
				if(searchCriteria.getFromDate() != null) {
					page = employeeRepository.findBySiteIdAndProjectId(searchCriteria.getProjectId(), searchCriteria.getSiteId(),startDate, toDate, isClient, pageRequest);
				}else if(StringUtils.isNotEmpty(searchCriteria.getName())) {
					page = employeeRepository.findByProjectSiteAndEmployeeName(searchCriteria.getProjectId(), searchCriteria.getSiteId(), searchCriteria.getName(), isClient, pageRequest);
				}else {
					page = employeeRepository.findBySiteIdAndProjectId(searchCriteria.getProjectId(), searchCriteria.getSiteId(), isClient, pageRequest);
				}
			}else if(searchCriteria.getSiteId() != 0 && StringUtils.isNotEmpty(searchCriteria.getName())) {
				List<String> empIds = new ArrayList<String>();
				empIds.add(searchCriteria.getEmployeeEmpId());
				page = employeeRepository.findByProjectSiteAndEmployeeName(searchCriteria.getProjectId(), searchCriteria.getSiteId(), searchCriteria.getName(), isClient, pageRequest);;
			}else if(searchCriteria.getProjectId() != 0 && StringUtils.isNotEmpty(searchCriteria.getName())) {
				List<String> empIds = new ArrayList<String>();
				empIds.add(searchCriteria.getEmployeeEmpId());
				page = employeeRepository.findByProjectAndEmployeeName(searchCriteria.getProjectId(), searchCriteria.getName(), isClient, pageRequest);;
			}else if(StringUtils.isNotEmpty(searchCriteria.getEmployeeEmpId())) {
				List<String> empIds = new ArrayList<String>();
				empIds.add(searchCriteria.getEmployeeEmpId());
				page = employeeRepository.findAllByEmpCodes(empIds, isClient, pageRequest);
			}
			else if(StringUtils.isNotEmpty(searchCriteria.getName())) {
				page = employeeRepository.findByEmployeeName(searchCriteria.getName(), isClient, pageRequest);
			}else if (StringUtils.isNotEmpty(searchCriteria.getEmployeeEmpId())) {
				log.debug(">>> find empid from service <<<");
				page = employeeRepository.findEmployeeId(String.valueOf(searchCriteria.getEmployeeId()), isClient, pageRequest);
			}

            else if (searchCriteria.getProjectId() != 0) {
            		if(searchCriteria.getFromDate() != null) {
            			page = employeeRepository.findEmployeesByIdAndSiteIdOrProjectId(searchCriteria.getEmployeeId(), searchCriteria.getProjectId(), searchCriteria.getSiteId(), startDate, toDate, isClient, pageRequest);
            		}else {
            			page = employeeRepository.findEmployeesByIdAndSiteIdOrProjectId(searchCriteria.getEmployeeId(), searchCriteria.getProjectId(), searchCriteria.getSiteId(), isClient, pageRequest);
            		}
            }else if (searchCriteria.getSiteId() != 0) {
            		if(searchCriteria.getFromDate() != null) {
            			page = employeeRepository.findEmployeesByIdAndProjectIdOrSiteId(searchCriteria.getEmployeeId(), searchCriteria.getProjectId(), searchCriteria.getSiteId(), startDate, toDate, isClient, pageRequest);
            		}else {
            			page = employeeRepository.findEmployeesByIdAndProjectIdOrSiteId(searchCriteria.getEmployeeId(), searchCriteria.getProjectId(), searchCriteria.getSiteId(), isClient, pageRequest);
            		}
            }else if (StringUtils.isNotEmpty(searchCriteria.getSiteName())) {
	        		List<Long> subEmpIds = null;
	        		subEmpIds = findAllSubordinates(user.getEmployee(), subEmpIds);
	        		page = employeeRepository.findBySiteName(searchCriteria.getSiteName(), subEmpIds, isClient, pageRequest);
            }else if (StringUtils.isNotEmpty(searchCriteria.getProjectName())) {
	        		List<Long> subEmpIds = null;
	        		subEmpIds = findAllSubordinates(user.getEmployee(), subEmpIds);
	        		page = employeeRepository.findByProjectName(searchCriteria.getProjectName(), subEmpIds, isClient, pageRequest);
	        }else {
	            	if(user.getUserRole().getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue())) {
	            		page = employeeRepository.findAll(pageRequest);
	            	}else {
	            		List<EmployeeProjectSite> projectSites = user.getEmployee().getProjectSites();
	            		if(CollectionUtils.isNotEmpty(projectSites)) {
	            			List<Long> siteIds = new ArrayList<Long>();
	            			for(EmployeeProjectSite projSite : projectSites) {
	            				siteIds.add(projSite.getSite().getId());
	            			}
	            			page = employeeRepository.findBySiteIds(siteIds, isClient, pageRequest);
	            		}else {
		            		List<Long> subEmpIds = null;
		            		subEmpIds = findAllSubordinates(user.getEmployee(), subEmpIds);
						if(CollectionUtils.isNotEmpty(subEmpIds)) {
		            			page = employeeRepository.findAllByEmpIds(subEmpIds, isClient, pageRequest);
						}
	            		}
	            	}
            }

			if(page != null) {
				//transactions = mapperUtil.toModelList(page.getContent(), EmployeeDTO.class);
				if(transactions == null) {
					transactions = new ArrayList<EmployeeDTO>();
				}
				List<Employee> empList =  page.getContent();
				if(CollectionUtils.isNotEmpty(empList)) {
					for(Employee emp : empList) {
						transactions.add(mapToModel(emp));
					}
				}
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}
		}
		return result;
	}

	public SearchResult<EmployeeShiftDTO> findEmpShiftBySearchCriteria(SearchCriteria searchCriteria) {
		User user = userRepository.findOne(searchCriteria.getUserId());
		SearchResult<EmployeeShiftDTO> result = new SearchResult<EmployeeShiftDTO>();
		if(searchCriteria != null) {
			Pageable pageRequest = null;
			if(searchCriteria.isList()) {
				pageRequest = createPageRequest(searchCriteria.getCurrPage(), true);
			}else {
				pageRequest = createPageRequest(searchCriteria.getCurrPage());
			}

			Page<EmployeeShift> page = null;
			List<EmployeeShiftDTO> transactions = null;

            Calendar startCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
            if(searchCriteria.getFromDate() != null) {
            		startCal.setTime(searchCriteria.getFromDate());
            }
	    		startCal.set(Calendar.HOUR_OF_DAY, 0);
	    		startCal.set(Calendar.MINUTE, 0);
	    		startCal.set(Calendar.SECOND, 0);
	    		Calendar endCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
	    		if(searchCriteria.getFromDate() != null) {
	    			endCal.setTime(searchCriteria.getFromDate());
	    		}
	    		endCal.set(Calendar.HOUR_OF_DAY, 23);
	    		endCal.set(Calendar.MINUTE, 59);
	    		endCal.set(Calendar.SECOND, 0);

			java.sql.Timestamp startDate = DateUtil.convertToTimestamp(startCal.getTime());
			java.sql.Timestamp toDate = DateUtil.convertToTimestamp(endCal.getTime());


			log.debug("findBySearchCriteria - "+searchCriteria.getSiteId() +", "+searchCriteria.getEmployeeId() +", "+searchCriteria.getProjectId());

			boolean isClient = false;

			if(user != null && user.getUserRole() != null) {
				isClient = user.getUserRole().getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue());
			}

			if(searchCriteria.getSiteId() > 0) {
				page = employeeShiftRepository.findEmployeeShiftBySiteAndDate(searchCriteria.getSiteId(), startDate, toDate, pageRequest);
			}

			if(page != null) {
				//transactions = mapperUtil.toModelList(page.getContent(), EmployeeDTO.class);
				if(transactions == null) {
					transactions = new ArrayList<EmployeeShiftDTO>();
				}
				List<EmployeeShift> empShiftList =  page.getContent();
				if(CollectionUtils.isNotEmpty(empShiftList)) {
					for(EmployeeShift empShift : empShiftList) {
						transactions.add(mapToModel(empShift));
					}
				}
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildEmployeeShiftSearchResult(searchCriteria, page, transactions,result);
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

	private void buildEmployeeShiftSearchResult(SearchCriteria searchCriteria, Page<EmployeeShift> page, List<EmployeeShiftDTO> transactions, SearchResult<EmployeeShiftDTO> result) {
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

	public ExportResult export(List<EmployeeDTO> transactions) {
		//return exportUtil.writeToCsvFile(transactions, null);
        log.debug("ready to EXPORT EXCEL-------->");
        return exportUtil.writeToExcelFile(transactions,null);
	}

	public ExportResult getExportStatus(String fileId) {
		ExportResult er = new ExportResult();
		fileId += ".xlsx";
		if(!StringUtils.isEmpty(fileId)) {
			String status = exportUtil.getExportStatus(fileId);
			er.setFile(fileId);
			//er.setEmpId(empId);
			er.setStatus(status);
		}
		return er;
	}

	public byte[] getExportFile(String fileName) {
		return exportUtil.readEmployeeExportExcelFile(fileName);
	}


    public List<DesignationDTO> findAllDesignations() {
//        User user = userRepository.findOne(userId);
        List<Designation> designation = designationRepository.findAll();

        return mapperUtil.toModelList(designation, DesignationDTO.class);
    }

    private EmployeeDTO mapToModel(Employee employee) {
    		EmployeeDTO empDto = new EmployeeDTO();
    		empDto.setId(employee.getId());
    		empDto.setEmpId(employee.getEmpId());
    		empDto.setName(employee.getName());
    		empDto.setFullName(employee.getFullName());
    		empDto.setLastName(employee.getLastName());
    		empDto.setPhone(employee.getPhone());
    		empDto.setEmail(employee.getEmail());
    		empDto.setActive(employee.getActive());
    		empDto.setFaceAuthorised(employee.isFaceAuthorised());
    		empDto.setFaceIdEnrolled(employee.isFaceIdEnrolled());
    		empDto.setDesignation(employee.getDesignation());
    		empDto.setEnrolled_face(employee.getEnrolled_face());
    		empDto.setLeft(employee.isLeft());
    		empDto.setReliever(employee.isReliever());
    		empDto.setRelieved(employee.isRelieved());
    		empDto.setProjectName(CollectionUtils.isNotEmpty(employee.getProjectSites()) ? employee.getProjectSites().get(0).getProject().getName() : "");
    		empDto.setSiteName(CollectionUtils.isNotEmpty(employee.getProjectSites()) ? employee.getProjectSites().get(0).getSite().getName() : "");
    		empDto.setClient(employee.isClient());
    		return empDto;
    }

	public String uploadEmpExistingImage() {
		// TODO Auto-generated method stub
		List<Employee> empEntity = employeeRepository.findAll();
		for(Employee employee : empEntity) { 
			if(employee.getEnrolled_face() != null) {
				if(employee.getEnrolled_face().indexOf("data:image") == 0) { 
					String base64String = employee.getEnrolled_face().split(",")[1];
					long dateTime = new Date().getTime();
					boolean isBase64 = Base64.isBase64(base64String);
					EmployeeDTO emp = mapperUtil.toModel(employee, EmployeeDTO.class);
					if(isBase64){ 
						emp = amazonS3utils.uploadEnrollImage(emp.getEnrolled_face(), emp, dateTime);
						employee.setEnrolled_face(emp.getEnrolled_face());
						employeeRepository.save(employee);
					}
				}	
			}
		}
		return "Upload Employee enroll image successfully";
	}

	private EmployeeShiftDTO mapToModel(EmployeeShift employeeShift) {
		EmployeeShiftDTO empShiftDto = new EmployeeShiftDTO();
		empShiftDto.setId(employeeShift.getId());
		empShiftDto.setEmployeeId(employeeShift.getEmployee().getId());
		empShiftDto.setEmployeeEmpId(employeeShift.getEmployee().getEmpId());
		empShiftDto.setEmployeeFullName(employeeShift.getEmployee().getFullName());
		Calendar startCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
		startCal.setTimeInMillis(employeeShift.getStartTime().getTime());
		empShiftDto.setStartTime(startCal.getTime());
		Calendar endCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
		endCal.setTimeInMillis(employeeShift.getEndTime().getTime());
		empShiftDto.setEndTime(endCal.getTime());
		empShiftDto.setSiteId(employeeShift.getSite().getId());
		empShiftDto.setSiteName(employeeShift.getSite().getName());
		return empShiftDto;
    }

}
