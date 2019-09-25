package com.ts.app.service;

import com.google.api.client.repackaged.org.apache.commons.codec.binary.Base64;
import com.ts.app.domain.*;
import com.ts.app.ext.api.FaceRecognitionService;
import com.ts.app.repository.*;
import com.ts.app.rule.EmployeeFilter;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.util.*;
import com.ts.app.soap.classes.TableOfZempDetStr;
import com.ts.app.soap.classes.TableOfZempEduDet;
import com.ts.app.soap.classes.TableOfZempFamilyDet;
import com.ts.app.soap.classes.TableOfZempIdmarkDet;
import com.ts.app.soap.classes.TableOfZempIdsStr;
import com.ts.app.soap.classes.TableOfZempPfnominiDet;
import com.ts.app.soap.classes.TableOfZempPrevempDet;
import com.ts.app.soap.classes.TableOfZempReturn;
import com.ts.app.soap.classes.ZempDetStr;
import com.ts.app.soap.classes.ZempEduDet;
import com.ts.app.soap.classes.ZempFamilyDet;
import com.ts.app.soap.classes.ZempIdmarkDet;
import com.ts.app.soap.classes.ZempIdsStr;
import com.ts.app.soap.classes.ZempPfnominiDet;
import com.ts.app.soap.classes.ZempPrevempDet;
import com.ts.app.soap.classes.ZempReturn;
import com.ts.app.soap.classes.ZempdetailUpdate;
import com.ts.app.soap.classes.ZempdetailUpdateResponse;
import com.ts.app.web.rest.dto.*;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Hibernate;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

/**
 * Service class for managing employee information.
 */
@Service
@Transactional
public class    EmployeeService extends AbstractService {

    private final Logger log = LoggerFactory.getLogger(EmployeeService.class);

    @Autowired
    private RestTemplate restTemplate;
    
    @Inject
    private AttendanceRepository attendanceRepository;
    
    @Inject
    private SiteListRepository siteListRepository;
    
    @Inject
    private NomineeRelationshipRepository nomineeRelationshipRepository ;

    @Inject
    private ReligionRepository religionRepository ;
 
    @Inject
    private EmployeeRepository employeeRepository;

    @Inject
    private TicketRepository ticketRepository;

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
    private FaceRecognitionService faceRecognitionService;

    @Inject
    private PushService pushService;

    @Inject
    private MailService mailService;

    @Inject
    private JobManagementService jobManagementService;

    @Inject
    private OnboardingUserConfigService onboardingUserConfigService;

    @Inject
    private AttendanceService attendanceService;

    @Inject
    private UserRoleService userRoleService;

    @Inject
    private EmployeeShiftRepository employeeShiftRepository;

    @Inject
    private EmployeeRelieverRepository employeeRelieverRepository;

    @Inject
    private EmployeeDocumentRepository employeeDocumentRepository;

    @Inject
    private Environment env;

    @Inject
    private AmazonS3Utils amazonS3utils;

    @Inject
    private EmployeeFilter employeeFilter;

    @Value("${AWS.s3-cloudfront-url}")
    private String cloudFrontUrl;

    @Value("${AWS.s3-bucketEnv}")
    private String bucketEnv;

    @Value("${AWS.s3-enroll-path}")
    private String enrollImagePath;
    
    @Value("${onBoarding.empRetrieve}")
    private String URL_ORACLE;
    
    @Value("${onBoarding.dummyUser}")
    private String dummyUser;


    public EmployeeDTO findByEmpId(String empId) {
        Employee employee = employeeRepository.findByEmpId(empId);
        EmployeeDTO employeeDto = null;
        if(employee!=null) {
            employeeDto = mapperUtil.toModel(employee, EmployeeDTO.class);
        }
        return employeeDto;
    }
    
    private EmployeeDTO prestoredEmployee;
    
    public EmployeeDTO getPrestoredEmployee() {
    	
    	return prestoredEmployee;
    	
    }
    
    public List<EmployeeDocumentsDTO> findEmployeeDocumentsByEmpId(String empId) {
        
    	Employee employeeDomain = employeeRepository.findByEmpId(empId);
        
    	List<EmployeeDocumentsDTO> employeeDocumentsDTO = null; 
    	
        if(employeeDomain !=null) {
        	
        	prestoredEmployee = mapperUtil.toModel(employeeDomain, EmployeeDTO.class);
        	
        	List<EmployeeDocuments> docuemnts = employeeDocumentRepository.findByEmployeeId(employeeDomain.getId());
        	
        	employeeDocumentsDTO = mapperUtil.toModelList(docuemnts, EmployeeDocumentsDTO.class);
        }
        else {
        	
        	prestoredEmployee = null;
        }
        
        return employeeDocumentsDTO;
    }

    public boolean isDuplicate(EmployeeDTO employeeDTO) {
        log.debug("Empid "+employeeDTO.getEmpId());
        SearchCriteria criteria = new SearchCriteria();
        criteria.setEmployeeEmpId(employeeDTO.getEmpId());
        criteria.setUserId(employeeDTO.getUserId());
        SearchResult<EmployeeDTO> searchResults = findBySearchCrieria(criteria);
        if(searchResults != null && CollectionUtils.isNotEmpty(searchResults.getTransactions())) {
            return true;
        }
        return false;
    }

    public List<EmployeeDTO> findActionRequired(boolean imported, boolean submitted, String active, String wbsId) {
    	
    	List<Employee> listEmployees = employeeRepository.findByImportedAndSubmittedAndActiveAndWbsId(imported, submitted, active, wbsId);
 
    	List<EmployeeDTO> listEmployeeDto = mapperUtil.toModelList(listEmployees, EmployeeDTO.class);
    	
    	for(EmployeeDTO emp : listEmployeeDto) {
    		
        	List<EmployeeDocuments> docuemnts = employeeDocumentRepository.findByEmployeeId(emp.getId());
        	
        	List<EmployeeDocumentsDTO> employeeDocumentsDTO = mapperUtil.toModelList(docuemnts, EmployeeDocumentsDTO.class);
        	
        	emp.setDocuments(employeeDocumentsDTO);
        	 
    	}
    	 
    	
    	return listEmployeeDto;
//    	if(CollectionUtils.isNotEmpty(listEmployeeDto)) {
//    		
//    		for( EmployeeDTO employeeDto : listEmployeeDto ) {
//    			
//    			EmpDTO empDto = new EmpDTO();
//    			
//    			List<BankDetailsDTO> banks = new ArrayList<BankDetailsDTO>();
//    			BankDetailsDTO bank = new BankDetailsDTO();
//    			bank.setAccountNo(employeeDto.getAccountNumber());
//    			bank.setIfsc(employeeDto.getIfscCode());
//    			
//    			
//    			
//    			
//    			empDto.setEmployeeCode(employeeDto.getEmpId());
//    			empDto.setEmployeeName(employeeDto.getName());
//    			empDto.setFatherName(employeeDto.getFatherName());
//    			empDto.setMotherName(employeeDto.getMotherName());
//    			empDto.setGender(employeeDto.getGender());
//    			empDto.setMaritalStatus(employeeDto.getMaritalStatus());
//    			empDto.setDateOfBirth(employeeDto.getDob());
//    			empDto.setDateOfJoining(dateOfJoining);
//    			empDto.setReligion(religion);
//    			empDto.setBloodGroup(bloodGroup);
//    			
////    			ArrayList<String> identification = new ArrayList<String>();
////    			identification.add(employeeDto.getPersonalIdentificationMark1());
////    			identification.add(employeeDto.getPersonalIdentificationMark2());
////    			
////    			empDto.setIdentificationMark(identification);
////    			
////    			empDto.setM;
////    			
////    			empDto.setAadharNumber(employeeDto.getAdharCardNumber());
////    			empDto.setPosition(position);
////    			empDto.setProjectId(projectId);
////    			empDto.setWbsId(wbsId);
//    			
//    			
//    			
//    		}
//    		
//    	}
    	
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

/******************************Modified by Vinoth**********************************************************/       
    public EmployeeDTO createNonUDSEmployeeInformation(EmployeeDTO employeeDto) {
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
        
        String name = employee.getEmpId().toString();
        
        employee.setName(name);
        employee.setFullName(name);
        employee.setLastName("");
        employee.setAccountNumber("NIL");
        employee.setAdharCardNumber("NIL");
        employee.setBloodGroup("NIL");
        employee.setBoardInstitute("NIL");
        employee.setClientDescription("NIL");
        employee.setClientName("NIL");
        
        long millis=System.currentTimeMillis();  
        java.sql.Date date=new java.sql.Date(millis);  
        
        employee.setDob(date);
        employee.setDoj(date);
        employee.setEducationalQulification("NIL");
        employee.setEmergencyContactNumber("NIL");
        employee.setEmployer("NIL");
        employee.setFatherName("NIL");
        employee.setGender("NIL");
        employee.setIfscCode("NIL");
        employee.setImported(false);
        employee.setMobile("NIL");
        employee.setMaritalStatus("NIL");
        employee.setMotherName("NIL");
        employee.setNomineeContactNumber("NIL");
        employee.setNomineeName("NIL");
        employee.setNomineeRelationship("NIL");
        employee.setOnBoardSource("NIL");
        employee.setOnBoardedFrom("NIL");
        employee.setPercentage(0);
        employee.setPermanentAddress("NIL");
        employee.setPermanentCity("NIL");
        employee.setPermanentState("NIL");
        employee.setPersonalIdentificationMark1("NIL");
        employee.setPersonalIdentificationMark2("NIl");
        employee.setPresentAddress("NIL");
        employee.setPresentCity("NIL");
        employee.setPresentState("NIL");
        employee.setPreviousDesignation("NIL");
        employee.setProjectCode("NIL");
        employee.setProjectDescription("NIL");
        employee.setReligion("NIL");
        employee.setSyncToSAP(false);
        employee.setSyncedBy("NIL");
        employee.setVerified(false);
        employee.setVerifiedDate(null);
        employee.setWbsDescription("NIL");
        employee.setWbsId("NIL");
        employee.setVerifiedBy(null);
        employee.setNewEmployee(false);
        employee.setPosition("NIL");
        employee.setSubmitted(false);
        employee.setSubmittedBy("NIL");
        employee.setSubmittedOn(null);
        employee.setGross(0);
        employee.setOnboardedPlace("NIL");
        employee.setActivity("NIL");
        employee.setNonUdsEmployee(true);
        
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
/**********************************************************************************************************/ 
    
/******************************Modified by Vinoth**********************************************************/   
    
    public EmployeeDTO createOnboardingEmployeeInfo(EmployeeDTO employeeDTO) throws Exception {
        Employee employee = mapperUtil.toEntity(employeeDTO, Employee.class);
        employee.setFullName(employee.getName());
        employee.setUser(null);
        employee.setActive(Employee.ACTIVE_YES);
        employee.setSubmittedOn(ZonedDateTime.now());
        
        employee.setProjectDescription( onboardingUserConfigService.findDescription(SecurityUtils.getCurrentUserId(), employeeDTO.getProjectCode()) );
        employee.setWbsDescription(onboardingUserConfigService.findDescription(SecurityUtils.getCurrentUserId(), employeeDTO.getWbsId()) );
        
        employee = employeeRepository.save(employee);
        employeeDTO = mapperUtil.toModel(employee, EmployeeDTO.class);
    	return employeeDTO;
    }

    public EmployeeDTO editOnBoardingEmployeeInfo(EmployeeDTO employeeDTO) throws Exception {
        Employee employee = employeeRepository.findByEmpId(employeeDTO.getEmpId());
        employeeDTO.setId(employee.getId());
        employeeDTO.setFullName(employeeDTO.getName());
        Employee updateEmployeeDTO = mapToModelOnBoarding(employeeDTO,employee);

        updateEmployeeDTO.setProjectDescription( onboardingUserConfigService.findDescription(SecurityUtils.getCurrentUserId(), employeeDTO.getProjectCode()) );
        updateEmployeeDTO.setWbsDescription(onboardingUserConfigService.findDescription(SecurityUtils.getCurrentUserId(), employeeDTO.getWbsId()) );

        
        updateEmployeeDTO.setVerifiedBy(null);
       // Employee updateEmployee = mapperUtil.toEntity(updateEmployeeDTO,Employee.class);
//        updateEmployee.setUser(null);
        employee = employeeRepository.saveAndFlush(updateEmployeeDTO);
        employeeDTO = mapperUtil.toModel(employee, EmployeeDTO.class);
        return employeeDTO;
    }
 
//***************************************Modified by Vinoth**********************************************************************************
    
    public EmployeeDTO rejectOnBoardingEmployeeInfo(EmployeeDTO employeeDTO) throws Exception {
        Employee employee = employeeRepository.findByEmpId(employeeDTO.getEmpId());
        employeeDTO.setId(employee.getId());
        employeeDTO.setFullName(employeeDTO.getName());
        Employee updateEmployeeDTO = mapToModelOnBoarding(employeeDTO,employee);

        updateEmployeeDTO.setProjectDescription( onboardingUserConfigService.findDescription(SecurityUtils.getCurrentUserId(), employeeDTO.getProjectCode()) );
        updateEmployeeDTO.setWbsDescription(onboardingUserConfigService.findDescription(SecurityUtils.getCurrentUserId(), employeeDTO.getWbsId()) );

        updateEmployeeDTO.setRejected(true); 
        updateEmployeeDTO.setSubmitted(false);
        updateEmployeeDTO.setVerified(false);
        updateEmployeeDTO.setVerifiedBy(null);
        updateEmployeeDTO.setImported(true);
       // Employee updateEmployee = mapperUtil.toEntity(updateEmployeeDTO,Employee.class);
//        updateEmployee.setUser(null);
        employee = employeeRepository.saveAndFlush(updateEmployeeDTO);
        employeeDTO = mapperUtil.toModel(employee, EmployeeDTO.class);
        return employeeDTO;
    }
    
//******************************************************************************************************************************************    
    
    public ZempdetailUpdateResponse saveEmployeeOnSAP(ZempdetailUpdate zempdetailUpdate) throws Exception {
    	
    	HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
		headers.setContentType( MediaType.APPLICATION_JSON);
		 
		HttpEntity<ZempdetailUpdate> request = new HttpEntity<>(zempdetailUpdate,headers);
 
		SimpleClientHttpRequestFactory rf =
			    (SimpleClientHttpRequestFactory) restTemplate.getRequestFactory();
		
		rf.setConnectTimeout(1000 * 120);
		rf.setReadTimeout(1000 * 120);
	
		ResponseEntity<ZempdetailUpdateResponse> response = restTemplate.exchange(
				URL_ORACLE + "updateEmployeeOnSap" , HttpMethod.POST,  request,
				ZempdetailUpdateResponse.class);

//		ResponseEntity<ZempdetailUpdateResponse> response = restTemplate.exchange(
//				 "http://localhost:8001/updateEmployeeOnSap" , HttpMethod.POST,  request,
//				ZempdetailUpdateResponse.class);

		
		return response.getBody();
		
    }

    @SuppressWarnings("finally")
	public ZempReturn verifyOnBoardingEmployeeInfo(EmployeeDTO employeeDTO) {
        Employee employee = employeeRepository.findOne(employeeDTO.getId());
       // Employee updateEmployee = mapperUtil.toEntity(employeeDTO,Employee.class);
        User user = userRepository.findOne(SecurityUtils.getCurrentUserId());
        
        ZempdetailUpdate zempdetailUpdate = new ZempdetailUpdate(); 
		
		TableOfZempDetStr tableOfZempDetStr = new TableOfZempDetStr();
		 
		
		TableOfZempEduDet tableOfZempEduDet = new TableOfZempEduDet();
		 
		
		TableOfZempFamilyDet tableOfZempFamilyDet = new TableOfZempFamilyDet();
		 
		
		TableOfZempIdmarkDet tableOfZempIdmarkDet = new TableOfZempIdmarkDet();
		 
		
		TableOfZempIdsStr tableOfZempIdsStr = new TableOfZempIdsStr();
		 
		
		TableOfZempPfnominiDet tableOfZempPfnominiDet = new TableOfZempPfnominiDet();
		 
		
		TableOfZempPrevempDet tableOfZempPrevempDet = new TableOfZempPrevempDet();
		 
		
		TableOfZempReturn tableOfZempReturn = new TableOfZempReturn();
		 
		
		ZempDetStr zempDetStr = new ZempDetStr();
		ZempEduDet zempEduDet = new ZempEduDet();

		ZempIdsStr zempIdsStr = new ZempIdsStr();
		ZempPfnominiDet zempPfnominiDet = new ZempPfnominiDet();
		ZempPrevempDet zempPrevempDet = new ZempPrevempDet();
		ZempReturn zempReturn = new ZempReturn();
		
		
		String employeeId = employee.getEmpId();
		
		if(employee.isNewEmployee()) {
			 
			zempDetStr.setEmployeeType("N");
			
		}
		
		zempDetStr.setEmpId(employeeId);
		zempDetStr.setEmpName(employee.getFullName());
		zempDetStr.setDesigNo(employee.getPosition());
		
		log.info("personal area");
		log.info(employee.getProjectCode()+"-"+SecurityUtils.getCurrentUserId());
		
		zempDetStr.setPersa(onboardingUserConfigService.getParentElementOfProject(employee.getProjectCode(),SecurityUtils.getCurrentUserId()));
		zempDetStr.setBloodGroup(employee.getBloodGroup());
		zempDetStr.setDateOfBirth(employee.getDob().toString());
		zempDetStr.setDateOfJoin(employee.getDoj().toString());
		zempDetStr.setEmail(employee.getEmail());
		zempDetStr.setEmpId(employee.getEmpId());
		zempDetStr.setAcNo(employee.getAccountNumber());
		zempDetStr.setAddrLi2M((employee.getPresentAddress().length() >= 40 ?  employee.getPresentAddress().substring(0,39) : employee.getPresentAddress() ));
		zempDetStr.setCityM(employee.getPresentCity());
		StateList presentState = siteListRepository.findByName(employee.getPresentState());
		zempDetStr.setStateM(presentState!=null?presentState.getCode().substring(1):"10");
		zempDetStr.setAddrLi2P((employee.getPermanentAddress().length() >= 40 ?  employee.getPermanentAddress().substring(0,39) : employee.getPermanentAddress() ));
		zempDetStr.setCityP(employee.getPermanentCity());
		StateList permanentState = siteListRepository.findByName(employee.getPermanentState());
		zempDetStr.setStateP(permanentState !=null ? permanentState.getCode().substring(1) : "10");
		zempDetStr.setAcNo(employee.getAccountNumber());
		zempDetStr.setBankKey("9100");
		
		String gender = employee.getGender().toLowerCase().substring(0,1).equals("m") ? "1" : ( employee.getGender().toLowerCase().substring(0,1).equals("f") ? "2" : "3" ); 
	 	
		zempDetStr.setGender(gender);
		zempDetStr.setIfscCode(employee.getIfscCode());
		
		String maritalStatus = "0";
		
		if(employee.getMaritalStatus()!=null) {
			
			switch(employee.getMaritalStatus().toLowerCase()) {
			
				case "single":
					maritalStatus = "0";
				break;
				
				case "married":
					maritalStatus = "1";
				break;
				
				case "widow":
					maritalStatus = "2";
				break;

				case "divorced":
					maritalStatus = "3";
				break;
				
				case "seperated":
					maritalStatus = "5";
				break;

			}
			
		}
		
		zempDetStr.setMaritalStatus(maritalStatus);
		zempDetStr.setMobileNoM(employee.getMobile());
		zempDetStr.setMothersName(employee.getMotherName());
		
		List<Religion> religion = religionRepository.findByTitle(employee.getReligion());
		zempDetStr.setReligion(religion.size() > 0 ? religion.get(0).getCode() : "22");

		zempDetStr.setWbs(employee.getWbsId());
		tableOfZempDetStr.getItem().add(zempDetStr);
		
		
		zempEduDet.setBoardUniv(employee.getBoardInstitute());
		zempEduDet.setEmpId(employee.getEmpId());
		
		tableOfZempEduDet.getItem().add(zempEduDet);
		
		if( StringUtils.isNotEmpty( employee.getMotherName())) {
		
			ZempFamilyDet zempFamilyDetMother = new ZempFamilyDet();
		
			zempFamilyDetMother.setEmpId(employee.getEmpId());
			zempFamilyDetMother.setFamMemName(employee.getMotherName());
			zempFamilyDetMother.setFamMemRelNo("12");
	
			tableOfZempFamilyDet.getItem().add(zempFamilyDetMother);
			
		}
		
		ZempFamilyDet zempFamilyDetFather = new ZempFamilyDet();
		
		zempFamilyDetFather.setEmpId(employee.getEmpId());
		zempFamilyDetFather.setFamMemName(employee.getFatherName());
		zempFamilyDetFather.setFamMemRelNo("11");
		
		tableOfZempFamilyDet.getItem().add(zempFamilyDetFather);
		
		if(StringUtils.isEmpty(employee.getPersonalIdentificationMark1())){
			
			ZempIdmarkDet zempIdmarkDet1 = new ZempIdmarkDet();
			
			zempIdmarkDet1.setEmpId(employeeId);
			zempIdmarkDet1.setIdenmarkText(employee.getPersonalIdentificationMark1());
			
			tableOfZempIdmarkDet.getItem().add(zempIdmarkDet1);
		}
		if(StringUtils.isEmpty(employee.getPersonalIdentificationMark2())){
			
			ZempIdmarkDet zempIdmarkDet2 = new ZempIdmarkDet();
			
			zempIdmarkDet2.setEmpId(employeeId);
			zempIdmarkDet2.setIdenmarkText(employee.getPersonalIdentificationMark2());
			
			tableOfZempIdmarkDet.getItem().add(zempIdmarkDet2);
		}


		
		zempIdsStr.setEmpId(employee.getEmpId());
		zempIdsStr.setIdCardNo(employee.getAdharCardNumber());
		zempIdsStr.setIdentityTypeId("11");
		zempIdsStr.setNameOnCard(employee.getFullName());
		
		Date now = new Date();
        String pattern = "yyyy-MM-dd";
        SimpleDateFormat formatter = new SimpleDateFormat(pattern);
        String mysqlDateString = formatter.format(now);
		
		zempIdsStr.setDateOfIssue(mysqlDateString);
		zempIdsStr.setValidDate(mysqlDateString);
		
		tableOfZempIdsStr.getItem().add(zempIdsStr);
		
		List<NomineeRelationship> relationships = nomineeRelationshipRepository.findByTitle(employee.getNomineeRelationship());
		
		zempPfnominiDet.setEmpId(employee.getEmpId());
		zempPfnominiDet.setNominiName(employee.getNomineeName());
		zempPfnominiDet.setNominiRel(relationships.size()>0 ? relationships.get(0).getCode() : "1");
		zempPfnominiDet.setNominiPercen(new BigDecimal("100"));
		
		tableOfZempPfnominiDet.getItem().add(zempPfnominiDet);
		
		zempPrevempDet.setEmpId(employee.getEmpId());
		zempPrevempDet.setNamePrevOrg(employee.getEmployer());
		
		tableOfZempPrevempDet.getItem().add(zempPrevempDet);
		
		zempReturn.setEmpId(employee.getEmpId());
		
		tableOfZempReturn.getItem().add(zempReturn);
		
		zempdetailUpdate.setEmpDet(tableOfZempDetStr);
		zempdetailUpdate.setEmpEduDet(tableOfZempEduDet);
		zempdetailUpdate.setEmpFamilyDet(tableOfZempFamilyDet);
		zempdetailUpdate.setEmpIdentityProof(tableOfZempIdsStr);
		zempdetailUpdate.setEmpIdmarkDet(tableOfZempIdmarkDet);
		zempdetailUpdate.setEmpPfnominiDet(tableOfZempPfnominiDet);
		zempdetailUpdate.setEmpPrevempDet(tableOfZempPrevempDet);
		zempdetailUpdate.setReturnLog(tableOfZempReturn);
		
		ZempdetailUpdateResponse response;
		ZempReturn returnObject = new ZempReturn();;
		
		try {
			response = saveEmployeeOnSAP(zempdetailUpdate);
			returnObject = response.getReturnLog().getItem().get(0);
			
			
			if(!returnObject.getType().equals("E")) {
					
					returnObject.setEmpId( returnObject.getEmpId().replaceFirst("^0+(?!$)", "") ); 
					employee.setEmpId( returnObject.getEmpId());
					employee.setVerifiedBy(user);
					employee.setVerified(true);
					employee.setVerifiedDate(ZonedDateTime.now());
					employee.setNewEmployee(false);
		            
		            // update login
		            
		            employee = employeeRepository.saveAndFlush(employee);
		            
		            if(employee.getUser()!=null) {
		            	
		            	User empUser = userRepository.findOne(employee.getUser().getId());
		            	
		            	if(!empUser.getLogin().equals(dummyUser)) {
		            		 
		            		empUser.setLogin(employee.getEmpId());
		            		userRepository.saveAndFlush(empUser);
		            		 
		            	}
		            	
		            }
		            
		            
				
			}
			
		} catch (Exception e) {
			
			returnObject = new ZempReturn();
			returnObject.setType("E");
			returnObject.setMessage(e.getMessage());
			
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally {
			return returnObject;
		}
		
		
		 
        
    }


/******************************Modified by Vinoth**********************************************************/    
    
    public DesignationDTO createDesignation(DesignationDTO designationDTO) {
        if(StringUtils.isNotEmpty(designationDTO.getDesignation())) {
            Designation designation = new Designation();
            List<Designation> designationList = designationRepository.findByDesignation(designationDTO.getDesignation());
            if(CollectionUtils.isEmpty(designationList)) {
                designation = mapperUtil.toEntity(designationDTO, Designation.class);
                designationRepository.save(designation);
                designationDTO.setErrorStatus(false);
            }else{
                designationDTO.setErrorMessage("Already exists a "+ designationDTO.getDesignation() +" designation");
                designationDTO.setErrorStatus(true);
                designationDTO.setStatus("400");
            }
        }
        return designationDTO;
    }

    public EmployeeDTO updateReliever(EmployeeDTO employee, EmployeeDTO reliever, RelieverDTO relieverDetails) {
    		EmployeeReliever employeeReliever = new EmployeeReliever();
    		employeeReliever.setEmployee(employeeRepository.findOne(employee.getId()));
    		if(reliever != null) {
    			employeeReliever.setRelieverEmployee(employeeRepository.findOne(reliever.getId()));
    		}
    		if(relieverDetails != null) {
    			if(relieverDetails.getSiteId() > 0) {
    				Site site = siteRepository.findOne(relieverDetails.getSiteId());
    				employeeReliever.setSite(site);
    			}
    			employeeReliever.setStartTime(DateUtil.convertToTimestamp(relieverDetails.getRelievedFromDate()));
    			employeeReliever.setEndTime(DateUtil.convertToTimestamp(relieverDetails.getRelievedToDate()));
    			employeeReliever.setRelieverMobile(relieverDetails.getRelieverMobile());
    			employeeReliever.setRelieverName(relieverDetails.getRelieverName());
    		}
    		employeeRelieverRepository.save(employeeReliever);
    		return employee;
    }

    public EmployeeDTO unAssignReliever(RelieverDTO relieverDTO) {

        Employee relievedEmployee = employeeRepository.findOne(relieverDTO.getEmployeeId());

        relievedEmployee.setRelieved(false);
        relievedEmployee = employeeRepository.save(relievedEmployee);

        return mapperUtil.toModel(relievedEmployee,EmployeeDTO.class);
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

        employeeUpdate.setFullName(employee.getName());
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

        List<EmployeeLocation> locations = employeeUpdate.getLocations();  // update a location of employee
        locations.clear();
        List<EmployeeLocation> updatedLocations = new ArrayList<>();
        if(CollectionUtils.isNotEmpty(employee.getLocations())) {
            for(EmployeeLocationDTO locDTO : employee.getLocations()) {
                EmployeeLocation empLoc = mapperUtil.toEntity(locDTO, EmployeeLocation.class);
                empLoc.setEmployee(employeeUpdate);
                updatedLocations.add(empLoc);
            }
        }

        employeeUpdate.getLocations().addAll(updatedLocations);

        Hibernate.initialize(employeeUpdate.getUser());
        User user = employeeUpdate.getUser();
        if(user != null) {
            if(employee.isLeft() || employeeUpdate.getActive().equalsIgnoreCase(Employee.ACTIVE_NO)) {
                user.setActivated(false);
                user.setActive(Employee.ACTIVE_NO);
                employeeUpdate.setActive(Employee.ACTIVE_NO);
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

        employeeUpdate.setDesignation(employee.getDesignation());
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
        JobDTO completedJob = jobManagementService.onlyCompleteJob(checkInOutDto.getJobId(), checkInOutDto.getUserId());
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
            //validate job completion time
            Calendar now = Calendar.getInstance();
            Calendar jobStartTime = Calendar.getInstance();
            jobStartTime.setTime(job.getPlannedStartTime());
            if(now.before(jobStartTime)) {
                checkInOutDto.setErrorMessage("Cannot complete job before the scheduled job start time");
                return checkInOutDto;
            }

            JobDTO completedJob = jobManagementService.onlyCompleteJob(checkInOutDto.getJobId(), checkInOutDto.getUserId());
            log.debug("onlyCheckOut - completedJob" + completedJob);
            log.debug("Transaction id "+checkInOutDto.getId());
            if(completedJob != null) {
                long siteId = completedJob.getSiteId();
                long transactionId = checkInOutDto.getId();
                log.debug("onlyCheckOut - completedJob siteId -" + transactionId);
                //List<User> users = userService.findUsers(siteId);
                Employee emp =job.getEmployee();
                Hibernate.initialize(emp.getUser());
                User jobUser = emp.getUser();
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
            Set<Long> subEmpIds = null;
            int levelCnt = 1;
            subEmpIds = findAllSubordinates(user.getEmployee(), subEmpIds, levelCnt);
            List<Long> subEmpList = new ArrayList<Long>();
            subEmpList.addAll(subEmpIds);
            entities = employeeRepository.findAllByIds(subEmpList);
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

    public List<EmployeeDTO> findMapableEmployees(long userId) {
        User user = userRepository.findOne(userId);
        List<Employee> entities = null;
        entities = employeeRepository.findAllMappable();
        //return mapperUtil.toModelList(entities, EmployeeDTO.class);
        List<EmployeeDTO> empList = new ArrayList<EmployeeDTO>();
        if(CollectionUtils.isNotEmpty(entities)) {
            for(Employee empEntity : entities) {
                EmployeeDTO employeeDTO = mapperUtil.toModel(empEntity,EmployeeDTO.class);
                if(employeeDTO.getUserId()>0){
                    empList.add(employeeDTO);
                }
            }
        }
        return empList;
    }

    public List<EmployeeDTO> findAllRelievers(long userId, long siteId) {
        List<Employee> entities = null;
        entities = employeeRepository.findAllRelievers(siteId);
        return mapperUtil.toModelList(entities, EmployeeDTO.class);
    }

    public long findRelieversCountByEmployee(SearchCriteria searchCriteria){
        User user = userRepository.findOne(SecurityUtils.getCurrentUserId());
        Hibernate.initialize(user.getEmployee());
        long empId = 0;
        if(user.getEmployee() != null) {
            empId = user.getEmployee().getId();
        }
        long relieverCount =  0;
        List<EmployeeReliever> empRel = new ArrayList<>();
        Calendar startCal = Calendar.getInstance();

        if (searchCriteria.getCheckInDateTimeFrom() != null) {
            startCal.setTime(searchCriteria.getFromDate());
        }
        startCal.set(Calendar.HOUR_OF_DAY, 0);
        startCal.set(Calendar.MINUTE, 0);
        startCal.set(Calendar.SECOND, 0);
        searchCriteria.setFromDate(startCal.getTime());
        Calendar endCal = Calendar.getInstance();
        if (searchCriteria.getCheckInDateTimeTo() != null) {
            endCal.setTime(searchCriteria.getToDate());
        }
        endCal.set(Calendar.HOUR_OF_DAY, 23);
        endCal.set(Calendar.MINUTE, 59);
        endCal.set(Calendar.SECOND, 0);
        searchCriteria.setToDate(endCal.getTime());

        java.sql.Timestamp startDate = new java.sql.Timestamp(searchCriteria.getFromDate().getTime());
        java.sql.Timestamp toDate = new java.sql.Timestamp(searchCriteria.getToDate().getTime());

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
            relieverCount = employeeRelieverRepository.findRelieverCountByEmployee(subEmpList, startDate, toDate);
        }else {
            relieverCount = employeeRelieverRepository.findRelieverCountByEmployee(startDate, toDate);
        }

        return relieverCount;
    }

    public SearchResult<EmployeeRelieverDTO> findRelieversByEmployee(SearchCriteria searchCriteria){

        SearchResult<EmployeeRelieverDTO> result = new SearchResult<>();
        Pageable pageRequest = null;
        if(searchCriteria != null) {

            if (!org.springframework.util.StringUtils.isEmpty(searchCriteria.getColumnName())) {
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" + sort);
                pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);
                if (searchCriteria.isReport()) {
                    pageRequest = createPageSort(searchCriteria.getCurrPage(), Integer.MAX_VALUE, sort);
                } else {
                    pageRequest = createPageSort(searchCriteria.getCurrPage(), PagingUtil.PAGE_SIZE, sort);
                }
            } else {
                if (searchCriteria.isList()) {
                    pageRequest = createPageRequest(searchCriteria.getCurrPage(), true);
                } else {
                    pageRequest = createPageRequest(searchCriteria.getCurrPage());
                }
            }

            Page<EmployeeReliever> page = null;
            List<EmployeeReliever> allTransactionsList = new ArrayList<EmployeeReliever>();
            List<EmployeeRelieverDTO> transactions = null;

            User user = userRepository.findOne(SecurityUtils.getCurrentUserId());
            Hibernate.initialize(user.getEmployee());
            long empId = 0;
            if(user.getEmployee() != null) {
                empId = user.getEmployee().getId();
            }

            Calendar startCal = Calendar.getInstance();

            if (searchCriteria.getCheckInDateTimeFrom() != null) {
                startCal.setTime(searchCriteria.getFromDate());
            }
            startCal.set(Calendar.HOUR_OF_DAY, 0);
            startCal.set(Calendar.MINUTE, 0);
            startCal.set(Calendar.SECOND, 0);
            searchCriteria.setFromDate(startCal.getTime());
            Calendar endCal = Calendar.getInstance();
            if (searchCriteria.getCheckInDateTimeTo() != null) {
                endCal.setTime(searchCriteria.getToDate());
            }
            endCal.set(Calendar.HOUR_OF_DAY, 23);
            endCal.set(Calendar.MINUTE, 59);
            endCal.set(Calendar.SECOND, 0);
            searchCriteria.setToDate(endCal.getTime());

            java.sql.Timestamp startDate = new java.sql.Timestamp(searchCriteria.getFromDate().getTime());
            java.sql.Timestamp toDate = new java.sql.Timestamp(searchCriteria.getToDate().getTime());

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
                page = employeeRelieverRepository.findRelieversByEmployee(subEmpList,startDate,toDate, pageRequest);
            }else {
                page = employeeRelieverRepository.findAllRelieversByEmployee(startDate,toDate, pageRequest);
//                page = employeeRelieverRepository.findAll(pageRequest);
            }

            allTransactionsList.addAll(page.getContent());

            if(CollectionUtils.isNotEmpty(allTransactionsList)) {
                if(transactions == null) {
                    transactions = new ArrayList<EmployeeRelieverDTO>();
                }
                for(EmployeeReliever relieverTrans : allTransactionsList) {
                    transactions.add(mapperUtil.toModel(relieverTrans, EmployeeRelieverDTO.class));
                }
                buildSearchResultTransax(searchCriteria, page, transactions,result);
            }
        }

        return result;
    }

    private void buildSearchResultTransax(SearchCriteria searchCriteria, Page<EmployeeReliever> page,
                                          List<EmployeeRelieverDTO> transactions, SearchResult<EmployeeRelieverDTO> result) {
        // TODO Auto-generated method stub
        if (page != null) {
            result.setTotalPages(page.getTotalPages());
        }
        result.setCurrPage(page.getNumber() + 1);
        result.setTotalCount(page.getTotalElements());
        result.setStartInd((result.getCurrPage() - 1) * 10 + 1);
        result.setEndInd((result.getTotalCount() > 10 ? (result.getCurrPage()) * 10 : result.getTotalCount()));

        result.setTransactions(transactions);
        return;
    }

    public List<EmployeeRelieverDTO> findRelievers(SearchCriteria searchCriteria) {
        List<EmployeeReliever> entities = null;
        Pageable pageRequest = null;
        pageRequest = createPageSort(searchCriteria.getCurrPage(), orderByDESC("createdDate"));
        Page<EmployeeReliever> result = employeeRelieverRepository.findRelievers(searchCriteria.getEmployeeId(), pageRequest);
        if(result != null && CollectionUtils.isNotEmpty(result.getContent())) {
        		entities = result.getContent();
        }
        return mapperUtil.toModelList(entities, EmployeeRelieverDTO.class);
    }

    public List<EmployeeDTO> findBySiteId(long userId,long siteId) {
        List<EmployeeDTO> employeeDtos = null;
        User user = userRepository.findOne(userId);
        List<Employee> entities = null;
        if(user.getUserRole().getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue())) {
            entities = employeeRepository.findBySiteId(siteId);
        }else {
            Set<Long> subEmpIds = null;
            int levelCnt = 1;
            subEmpIds = findAllSubordinates(user.getEmployee(), subEmpIds, levelCnt);
            List<Long> subEmpList = new ArrayList<Long>();
            subEmpList.addAll(subEmpIds);
            entities = employeeRepository.findBySiteIdAndEmpIds(siteId, subEmpList);
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

    public SearchResult<EmployeeDTO> findWithAttendanceBySiteId(SearchCriteria searchCriteria) {
        List<EmployeeDTO> employeeDtos = null;
        SearchResult<EmployeeDTO> result1 = new SearchResult<EmployeeDTO>();
        long userId = searchCriteria.getUserId();
        long siteId = searchCriteria.getSiteId();
        User user = userRepository.findOne(userId);
        List<Employee> entities = null;

        Pageable pageRequest = null;
        if(searchCriteria.isList()) {
            pageRequest = createPageRequest(searchCriteria.getCurrPage(), true);
        }else {
            pageRequest = createPageRequest(searchCriteria.getCurrPage());
        }

        Page<Employee> page = null;
        List<EmployeeDTO> transactions = null;
        if(user.getUserRole().getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue())) {
            page = employeeRepository.findBySiteId(siteId,pageRequest);
        }else {
            Set<Long> subEmpIds = null;
            int levelCnt =1 ;
            subEmpIds = findAllSubordinates(user.getEmployee(), subEmpIds, levelCnt);
            List<Long> subEmpList = new ArrayList<Long>();
            subEmpList.addAll(subEmpIds);
            page = employeeRepository.findBySiteIdAndEmpIds(siteId, subEmpList,pageRequest);
        }
        //return mapperUtil.toModelList(entities, EmployeeDTO.class);
        if(CollectionUtils.isNotEmpty(page.getContent())) {
            employeeDtos = new ArrayList<EmployeeDTO>();
            for(Employee emp : page.getContent()) {
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

        if(page != null) {
            if(employeeDtos == null) {
                employeeDtos = new ArrayList<EmployeeDTO>();
            }
            if(CollectionUtils.isNotEmpty(employeeDtos)) {
                buildSearchResult(searchCriteria, page, employeeDtos,result1);
            }
        }
        return result1;
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
        String enroll_url = cloudFrontUrl + bucketEnv + enrollImagePath + dto.getEnrolled_face();
        dto.setUrl(enroll_url);
        Hibernate.initialize(entity.getManager());
        if(entity.getManager() != null) {
            dto.setManagerId(entity.getManager().getId());
            dto.setManagerName(entity.getManager().getFullName());
        }
        //entity.setProjectSites(entity.getProjectSites());
        return dto;
    }

    public EmployeeDTO enrollFace(EmployeeDTO employeeDTO) throws JSONException {
        Employee entity = employeeRepository.findOne(employeeDTO.getId());
        if (StringUtils.isEmpty(employeeDTO.getEnrolled_face())) {
            log.debug("Employee image not found");
        }else{
            String enrollImage = employeeDTO.getEnrolled_face();
            log.debug("Employee image found");
            long dateTime = new Date().getTime();
            employeeDTO = amazonS3utils.uploadEnrollImage(enrollImage, employeeDTO, dateTime);
            employeeDTO.setUrl(employeeDTO.getUrl());

            log.debug("Enrolled face URL  -----------"+employeeDTO.getUrl());
            String faceRecognitionResponse[] = faceRecognitionService.detectImage(employeeDTO.getUrl());

            if(faceRecognitionResponse.length>0){
                log.debug("Face enroll response - " +faceRecognitionResponse[0]);
                if (faceRecognitionResponse[0] == "success"){

                    String persistedFaceId;

                    String personName = employeeDTO.getSiteId()+"_"+employeeDTO.getEmpId()+"_"+employeeDTO.getName();
                    if(StringUtils.isNotEmpty(employeeDTO.getFaceId())){
                        persistedFaceId = employeeDTO.getFaceId();

                    }else{
                        JSONObject enrollPersonResponse = faceRecognitionService.enrollPerson(personName);
                        log.debug("Person enroll "+enrollPersonResponse);
                        persistedFaceId = (String) enrollPersonResponse.get("personId");
                        log.debug("Face Id"+persistedFaceId);
                    }


                    if(StringUtils.isNotEmpty(persistedFaceId)){
                        entity.setFaceId(persistedFaceId);
                        JSONObject faceEnrollResponse = faceRecognitionService.EnrollImage(employeeDTO,persistedFaceId);
                        String enrolledFaceId = (String) faceEnrollResponse.get("persistedFaceId");
                        if(StringUtils.isNotEmpty(enrolledFaceId)){
                            faceRecognitionService.TainGroup();
                            faceRecognitionService.TrainedStatus();
                            entity.setEnrolled_face(employeeDTO.getEnrolled_face());
                            entity.setFaceIdEnrolled(true);
                            entity.setFaceAuthorised(false);
                            employeeRepository.saveAndFlush(entity);
                            employeeDTO = mapperUtil.toModel(entity, EmployeeDTO.class);
                            return employeeDTO;

                        }else{
                            employeeDTO.setErrorMessage("Face not Enrolled");
                            employeeDTO.setErrorStatus(true);
                            return employeeDTO;
                        }

                    }else{
                        employeeDTO.setErrorMessage("Unable to enroll Person");
                        employeeDTO.setErrorStatus(true);
                        return employeeDTO;
                    }


                }else{
                    employeeDTO.setErrorMessage("Face not Detected");
                    employeeDTO.setErrorStatus(true);
                    return employeeDTO;

                }
            }else{
                employeeDTO.setErrorMessage("Face not Detected");
                employeeDTO.setErrorStatus(true);
                return employeeDTO;
            }

        }
        return employeeDTO;
    }

    public List<Employee> enrollAllEmplloyee() throws JSONException {
        List<Employee> employees = employeeRepository.findEnrolledEmployees();
        log.debug("Employee list length - "+employees.size());
        EmployeeDTO employeeDTO = new EmployeeDTO();
        int i =0;
        for (Employee employee: employees){
            if (employee.isFaceAuthorised() && StringUtils.isEmpty(employee.getFaceId())){
                employeeDTO = mapperUtil.toModel(employee,EmployeeDTO.class);
                Employee entity = employeeRepository.findOne(employeeDTO.getId());
                String enrollImage = employeeDTO.getEnrolled_face();
                log.debug("Employee image found");
                long dateTime = new Date().getTime();
                String enroll_url = cloudFrontUrl + bucketEnv + enrollImagePath + employeeDTO.getEnrolled_face();
                employeeDTO.setUrl(enroll_url);

                log.debug("Enrolled face URL  -----------"+employeeDTO.getUrl());
                log.debug("Enrolled face URL  -----------");
                String faceRecognitionResponse[] = faceRecognitionService.detectImage(employeeDTO.getUrl());

                if(faceRecognitionResponse.length>0){
                    log.debug("Face enroll response - " +faceRecognitionResponse[0]);
                    if (faceRecognitionResponse[0] == "success"){

                        String persistedFaceId;

                        String personName = employeeDTO.getSiteId()+"_"+employeeDTO.getEmpId()+"_"+employeeDTO.getName();
                        if(StringUtils.isNotEmpty(employeeDTO.getFaceId())){
                            persistedFaceId = employeeDTO.getFaceId();

                        }else{
                            JSONObject enrollPersonResponse = faceRecognitionService.enrollPerson(personName);
                            log.debug("Person enroll "+enrollPersonResponse);
                            persistedFaceId = (String) enrollPersonResponse.get("personId");
                            log.debug("Face Id"+persistedFaceId);
                        }


                        if(StringUtils.isNotEmpty(persistedFaceId)){
                            entity.setFaceId(persistedFaceId);
                            JSONObject faceEnrollResponse = faceRecognitionService.EnrollImage(employeeDTO,persistedFaceId);
                            String enrolledFaceId = (String) faceEnrollResponse.get("persistedFaceId");
                            if(StringUtils.isNotEmpty(enrolledFaceId)){
                                faceRecognitionService.TainGroup();
                                faceRecognitionService.TrainedStatus();
                                entity.setEnrolled_face(employeeDTO.getEnrolled_face());
                                entity.setFaceIdEnrolled(true);
                                entity.setFaceAuthorised(true);
                                employeeRepository.saveAndFlush(entity);
                                employeeDTO = mapperUtil.toModel(entity, EmployeeDTO.class);
                            }else{

                                log.debug("Face not Enrolled");
                            }

                        }else{
                            log.debug("Unable to enroll Person");
                        }

                    }else{
                        log.debug("Face not Detected");
                    }
                }else{
                    log.debug("Face not Detected");
                }

            }
            i+=1;
            log.debug("Success - new Face Id)+"+employeeDTO.getFaceId());
            log.debug("Counting --------"+i);
        }
        return employees;
    }

    public EmployeeDTO enrollEmployeeToMicroSoft(long employeeId) throws JSONException {

        Employee employee = employeeRepository.findOne(employeeId);
        EmployeeDTO employeeDTO = new EmployeeDTO();

        if (employee.isFaceAuthorised() && StringUtils.isEmpty(employee.getFaceId())){
            employeeDTO = mapperUtil.toModel(employee,EmployeeDTO.class);
            Employee entity = employeeRepository.findOne(employeeDTO.getId());
            String enrollImage = employeeDTO.getEnrolled_face();
            log.debug("Employee image found");
            long dateTime = new Date().getTime();
            String enroll_url = cloudFrontUrl + bucketEnv + enrollImagePath + employeeDTO.getEnrolled_face();
            employeeDTO.setUrl(enroll_url);

            log.debug("Enrolled face URL  -----------"+employeeDTO.getUrl());
            log.debug("Enrolled face URL  -----------");
            String faceRecognitionResponse[] = faceRecognitionService.detectImage(employeeDTO.getUrl());

            if(faceRecognitionResponse.length>0){
                log.debug("Face enroll response - " +faceRecognitionResponse[0]);
                if (faceRecognitionResponse[0] == "success"){

                    String persistedFaceId;

                    String personName = employeeDTO.getSiteId()+"_"+employeeDTO.getEmpId()+"_"+employeeDTO.getName();
                    if(StringUtils.isNotEmpty(employeeDTO.getFaceId())){
                        persistedFaceId = employeeDTO.getFaceId();

                    }else{
                        JSONObject enrollPersonResponse = faceRecognitionService.enrollPerson(personName);
                        log.debug("Person enroll "+enrollPersonResponse);
                        persistedFaceId = (String) enrollPersonResponse.get("personId");
                        log.debug("Face Id"+persistedFaceId);
                    }


                    if(StringUtils.isNotEmpty(persistedFaceId)){
                        entity.setFaceId(persistedFaceId);
                        JSONObject faceEnrollResponse = faceRecognitionService.EnrollImage(employeeDTO,persistedFaceId);
                        String enrolledFaceId = (String) faceEnrollResponse.get("persistedFaceId");
                        if(StringUtils.isNotEmpty(enrolledFaceId)){
                            faceRecognitionService.TainGroup();
                            faceRecognitionService.TrainedStatus();
                            entity.setEnrolled_face(employeeDTO.getEnrolled_face());
                            entity.setFaceIdEnrolled(true);
                            entity.setFaceAuthorised(true);
                            employeeRepository.saveAndFlush(entity);
                            employeeDTO = mapperUtil.toModel(entity, EmployeeDTO.class);
                        }else{

                            log.debug("Face not Enrolled");
                        }

                    }else{
                        log.debug("Unable to enroll Person");
                    }

                }else{
                    log.debug("Face not Detected");
                }
            }else{
                log.debug("Face not Detected");
            }

        }

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
            List<Employee> allEmpsList = new ArrayList<>();
            Page<Employee> page = null;
            List<EmployeeDTO> transactions = null;
            searchCriteria.setOnBoarded(true);

            if (!StringUtils.isEmpty(searchCriteria.getColumnName())) {
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" + sort);
                if(searchCriteria.isList()) {
                    pageRequest = createPageSort(searchCriteria.getCurrPage(), sort);
                }else {
                    pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);
                }
            } else {
                if(searchCriteria.isList()) {
                    Sort sort = new Sort(Sort.Direction.ASC , "name");
                    pageRequest = createPageSort(searchCriteria.getCurrPage(), sort);
                }else {
                    pageRequest = createPageRequest(searchCriteria.getCurrPage());
                }
            }

//            Calendar startCal = Calendar.getIns
//            tance(TimeZone.getTimeZone("Asia/Kolkata"));
//            if(searchCriteria.getFromDate() != null) {
//                startCal.setTime(searchCriteria.getFromDate());
//            }
//            startCal.set(Calendar.HOUR_OF_DAY, 0);
//            startCal.set(Calendar.MINUTE, 0);
//            startCal.set(Calendar.SECOND, 0);
//            Calendar endCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
//            if(searchCriteria.getToDate() != null) {
//                endCal.setTime(searchCriteria.getToDate());
//            }
//            endCal.set(Calendar.HOUR_OF_DAY, 23);
//            endCal.set(Calendar.MINUTE, 59);
//            endCal.set(Calendar.SECOND, 0);

            //searchCriteria.setFromDate(startCal.getTime());
            //searchCriteria.setToDate(endCal.getTime());


//            java.sql.Date startDate = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(startCal));
//            java.sql.Date toDate = DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(endCal));

            log.debug("findBySearchCriteria - "+searchCriteria.getSiteId() +", "+searchCriteria.getEmployeeId() +", "+searchCriteria.getProjectId());

            boolean isClient = false;

            UserRole role = null;

            if(user != null) {
                role = user.getUserRole();
            }

            if(role != null) {
                isClient = role.getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue());
            }

            List<EmployeeProjectSite> projectSites = user.getEmployee().getProjectSites();
            List<Long> siteIds = new ArrayList<Long>();
            if(CollectionUtils.isNotEmpty(projectSites)) {
                for(EmployeeProjectSite projSite : projectSites) {
                    siteIds.add(projSite.getSite().getId());
                }
                searchCriteria.setSiteIds(siteIds);
            }

            if(user.getEmployee() != null && !user.isAdmin()) {
                Set<Long> subEmpIds = null;
                int levelCnt = 1;
                subEmpIds = findAllSubordinates(user.getEmployee(), subEmpIds, levelCnt);
                List<Long> subEmpList = new ArrayList<Long>();
                subEmpList.addAll(subEmpIds);
                searchCriteria.setSubordinateIds(subEmpList);
            }else if(user.isAdmin()) {
            	searchCriteria.setAdmin(true);
            }

//            if((searchCriteria.getSiteId() != 0 && searchCriteria.getProjectId() != 0)) {
//                if(searchCriteria.getFromDate() != null) {
//                    page = employeeRepository.findBySiteIdAndProjectId(searchCriteria.getProjectId(), searchCriteria.getSiteId(),DateUtil.convertToZDT(searchCriteria.getFromDate()), DateUtil.convertToZDT(searchCriteria.getToDate()), isClient, pageRequest);
//                }else if(StringUtils.isNotEmpty(searchCriteria.getName())) {
//                    page = employeeRepository.findByProjectSiteAndEmployeeName(searchCriteria.getProjectId(), searchCriteria.getSiteId(), searchCriteria.getName(), isClient, pageRequest);
//                }else if(StringUtils.isNotEmpty(searchCriteria.getEmployeeEmpId())) {
//                    page = employeeRepository.findByProjectSiteAndEmployeeEmpId(searchCriteria.getProjectId(), searchCriteria.getSiteId(), searchCriteria.getEmployeeEmpId(), pageRequest);
//                }else {
//                    page = employeeRepository.findBySiteIdAndProjectId(searchCriteria.getProjectId(), searchCriteria.getSiteId(), isClient, pageRequest);
//                }
//            }else if(searchCriteria.getSiteId() != 0 && StringUtils.isNotEmpty(searchCriteria.getName())) {
//                List<String> empIds = new ArrayList<String>();
//                empIds.add(searchCriteria.getEmployeeEmpId());
//                page = employeeRepository.findByProjectSiteAndEmployeeName(searchCriteria.getProjectId(), searchCriteria.getSiteId(), searchCriteria.getName(), isClient, pageRequest);;
//            }else if(searchCriteria.getProjectId() != 0 && StringUtils.isNotEmpty(searchCriteria.getName())) {
//                List<String> empIds = new ArrayList<String>();
//                empIds.add(searchCriteria.getEmployeeEmpId());
//                page = employeeRepository.findByProjectAndEmployeeName(searchCriteria.getProjectId(), searchCriteria.getName(), isClient, pageRequest);;
//            }else if(StringUtils.isNotEmpty(searchCriteria.getEmployeeEmpId())) {
//                List<String> empIds = new ArrayList<String>();
//                empIds.add(searchCriteria.getEmployeeEmpId());
//                page = employeeRepository.findAllByEmpCodes(empIds, isClient, pageRequest);
//            }
//            else if(StringUtils.isNotEmpty(searchCriteria.getName())) {
//                if(role.getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue())) {
//                    page = employeeRepository.findByEmployeeName(searchCriteria.getName(), isClient, pageRequest);
//                }else {
//                    page = employeeRepository.findByEmployeeName(siteIds, searchCriteria.getName(), isClient, pageRequest);
//                }
//            }else if (StringUtils.isNotEmpty(searchCriteria.getEmployeeEmpId())) {
//                log.debug(">>> find empid from service <<<");
//                page = employeeRepository.findEmployeeId(String.valueOf(searchCriteria.getEmployeeId()), isClient, pageRequest);
//            }
//
//            else if (searchCriteria.getProjectId() != 0) {
//                if(searchCriteria.getFromDate() != null) {
//                    page = employeeRepository.findEmployeesByIdAndSiteIdOrProjectId(searchCriteria.getEmployeeId(), searchCriteria.getProjectId(), searchCriteria.getSiteId(), DateUtil.convertToZDT(searchCriteria.getFromDate()), DateUtil.convertToZDT(searchCriteria.getToDate()), isClient, pageRequest);
//                }else {
//                    page = employeeRepository.findEmployeesByIdAndSiteIdOrProjectId(searchCriteria.getEmployeeId(), searchCriteria.getProjectId(), searchCriteria.getSiteId(), isClient, pageRequest);
//                }
//            }else if (searchCriteria.getSiteId() != 0) {
//                if(searchCriteria.getFromDate() != null) {
//                    page = employeeRepository.findEmployeesByIdAndProjectIdOrSiteId(searchCriteria.getEmployeeId(), searchCriteria.getProjectId(), searchCriteria.getSiteId(), DateUtil.convertToZDT(searchCriteria.getFromDate()), DateUtil.convertToZDT(searchCriteria.getToDate()), isClient, pageRequest);
//                }else {
//                    page = employeeRepository.findEmployeesByIdAndProjectIdOrSiteId(searchCriteria.getEmployeeId(), searchCriteria.getProjectId(), searchCriteria.getSiteId(), isClient, pageRequest);
//                }
//            }else if (StringUtils.isNotEmpty(searchCriteria.getSiteName())) {
//                Set<Long> subEmpIds = null;
//                int levelCnt = 1;
//                subEmpIds = findAllSubordinates(user.getEmployee(), subEmpIds, levelCnt);
//                List<Long> subEmpList = new ArrayList<Long>();
//                subEmpList.addAll(subEmpIds);
//                page = employeeRepository.findBySiteName(searchCriteria.getSiteName(), subEmpList, isClient, pageRequest);
//            }else if (StringUtils.isNotEmpty(searchCriteria.getProjectName())) {
//                Set<Long> subEmpIds = null;
//                int levelCnt =1;
//                subEmpIds = findAllSubordinates(user.getEmployee(), subEmpIds, levelCnt);
//                List<Long> subEmpList = new ArrayList<Long>();
//                subEmpList.addAll(subEmpIds);
//                page = employeeRepository.findByProjectName(searchCriteria.getProjectName(), subEmpList, isClient, pageRequest);
//            }else {
                if(role.getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue())) {
//                    page = employeeRepository.findAll(pageRequest);
                    page = employeeRepository.findAll(new EmpSpecification(searchCriteria, isClient),pageRequest);
                	allEmpsList.addAll(page.getContent());
                }else {
//                    if(CollectionUtils.isNotEmpty(siteIds)) {
//                        page = employeeRepository.findBySiteIds(siteIds, isClient, pageRequest);
//                    }else {
//                        Set<Long> subEmpIds = null;
//                        int levelCnt = 1;
//                        subEmpIds = findAllSubordinates(user.getEmployee(), subEmpIds, levelCnt);
//                        List<Long> subEmpList = new ArrayList<Long>();
//                        subEmpList.addAll(subEmpIds);
//                        if(CollectionUtils.isNotEmpty(subEmpIds)) {
//                            page = employeeRepository.findAllByEmpIds(subEmpList, isClient, pageRequest);
//                        }
//                    }
                    page = employeeRepository.findAll(new EmpSpecification(searchCriteria, isClient),pageRequest);
                    allEmpsList.addAll(page.getContent());

                }


                if(CollectionUtils.isNotEmpty(allEmpsList)) {
                    //transactions = mapperUtil.toModelList(page.getContent(), EmployeeDTO.class);
                    if(transactions == null) {
                        transactions = new ArrayList<EmployeeDTO>();
                    }
                    List<Employee> empList =  allEmpsList;
                    if(CollectionUtils.isNotEmpty(empList)) {
                        for(Employee emp : empList) {
                            User empUser = emp.getUser();
                            if(empUser != null) {
                                UserRole userRole = empUser.getUserRole();
                                if(userRole != null) {
                                    if(role != null && employeeFilter.filterByRole(searchCriteria.getModule(), searchCriteria.getAction(), role.getName(), userRole.getName())) {
                                        transactions.add(mapToModel(emp));
                                    }
                                }
                            }else {
                                transactions.add(mapToModel(emp));
                            }
                        }
                    }
                    if(CollectionUtils.isNotEmpty(transactions)) {
                        buildSearchResult(searchCriteria, page, transactions,result);
                    }
                }
            }
        return result;
    }
//******************************************Modified by Vinoth*******************************************************************************
    public SearchResult<EmployeeDTO> findExportOnBoardingBySearchCrieria(SearchCriteria searchCriteria) {
        User user = userRepository.findOne(searchCriteria.getUserId());
        SearchResult<EmployeeDTO> result = new SearchResult<EmployeeDTO>();
        if(searchCriteria != null) {

            Pageable pageRequest = null;
            List<Employee> allEmpsList = new ArrayList<>();
            Page<Employee> page = null;
            List<EmployeeDTO> transactions = null;

            if (!StringUtils.isEmpty(searchCriteria.getColumnName())) {
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" + sort);
                if(searchCriteria.isList()) {
                    pageRequest = createPageSort(searchCriteria.getCurrPage(), sort);
                }else {
                    pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);
                }
            } else {
                if(searchCriteria.isList()) {
                    Sort sort = new Sort(Sort.Direction.ASC , "name");
                    pageRequest = createPageSort(searchCriteria.getCurrPage(), sort);
                }else {
                    pageRequest = createPageRequest(searchCriteria.getCurrPage());
                }
            }


            if(StringUtils.isNotEmpty(searchCriteria.getBranchCode())){


                if(StringUtils.isNotEmpty(searchCriteria.getProjectCode())){

                    if(StringUtils.isEmpty(searchCriteria.getWbsCode())){
                        searchCriteria.setWbsCodes(onboardingUserConfigService.findWbsCodesByProjectAndBranch(user.getId(),searchCriteria.getBranchCode(),searchCriteria.getProjectCode()));
                    }

                }else{

                    searchCriteria.setProjectCodes(onboardingUserConfigService.findProjectCodesByBranch(user.getId(),searchCriteria.getBranchCode()));
                    searchCriteria.setWbsCodes(onboardingUserConfigService.findWBSByProjectCodes(user.getId(),searchCriteria.getProjectCodes()));


                }

            }else{
                searchCriteria.setProjectCodes(onboardingUserConfigService.findProjectCodesByUser(user.getId()));
                searchCriteria.setWbsCodes(onboardingUserConfigService.findWBSCodesByUser(user.getId()));
            }


            log.debug("findBySearchCriteria - "+searchCriteria.getSiteId() +", "+searchCriteria.getEmployeeId() +", "+searchCriteria.getProjectId());

            boolean isClient = false;

            UserRole role = null;

            if(user != null) {
                role = user.getUserRole();
            }

            if(role != null) {
                isClient = role.getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue());
            }
                searchCriteria.setAdmin(true);
                page = employeeRepository.findAll(new EmployeeExportSpecification(searchCriteria, true),pageRequest);
                allEmpsList.addAll(page.getContent());


            if(CollectionUtils.isNotEmpty(allEmpsList)) {
                //transactions = mapperUtil.toModelList(page.getContent(), EmployeeDTO.class);
                if(transactions == null) {
                    transactions = new ArrayList<EmployeeDTO>();
                }
                List<Employee> empList =  allEmpsList;
                if(CollectionUtils.isNotEmpty(empList)) {
                    for(Employee emp : empList) {
                        User empUser = emp.getUser();

                            transactions.add(mapToModelOnBoarding(emp));
                    }
                }
                if(CollectionUtils.isNotEmpty(transactions)) {
                    buildSearchResult(searchCriteria, page, transactions,result);
                }
            }
        }
        return result;
    }
/******************************************************************************************************************************************/


    public SearchResult<EmployeeDTO> findOnBoardingBySearchCrieria(SearchCriteria searchCriteria) {
        User user = userRepository.findOne(searchCriteria.getUserId());
        SearchResult<EmployeeDTO> result = new SearchResult<EmployeeDTO>();
        if(searchCriteria != null) {

            Pageable pageRequest = null;
            List<Employee> allEmpsList = new ArrayList<>();
            Page<Employee> page = null;
            List<EmployeeDTO> transactions = null;

            if (!StringUtils.isEmpty(searchCriteria.getColumnName())) {
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" + sort);
                if(searchCriteria.isList()) {
                    pageRequest = createPageSort(searchCriteria.getCurrPage(), sort);
                }else {
                    pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);
                }
            } else {
                if(searchCriteria.isList()) {
                    Sort sort = new Sort(Sort.Direction.ASC , "name");
                    pageRequest = createPageSort(searchCriteria.getCurrPage(), sort);
                }else {
                    pageRequest = createPageRequest(searchCriteria.getCurrPage());
                }
            }


            if(StringUtils.isNotEmpty(searchCriteria.getBranchCode())){


                if(StringUtils.isNotEmpty(searchCriteria.getProjectCode())){

                    if(StringUtils.isEmpty(searchCriteria.getWbsCode())){
                        searchCriteria.setWbsCodes(onboardingUserConfigService.findWbsCodesByProjectAndBranch(user.getId(),searchCriteria.getBranchCode(),searchCriteria.getProjectCode()));
                    }

                }else{

                    searchCriteria.setProjectCodes(onboardingUserConfigService.findProjectCodesByBranch(user.getId(),searchCriteria.getBranchCode()));
                    searchCriteria.setWbsCodes(onboardingUserConfigService.findWBSByProjectCodes(user.getId(),searchCriteria.getProjectCodes()));


                }

            }else{
                searchCriteria.setProjectCodes(onboardingUserConfigService.findProjectCodesByUser(user.getId()));
                searchCriteria.setWbsCodes(onboardingUserConfigService.findWBSCodesByUser(user.getId()));
            }


            log.debug("findBySearchCriteria - "+searchCriteria.getSiteId() +", "+searchCriteria.getEmployeeId() +", "+searchCriteria.getProjectId());

            boolean isClient = false;

            UserRole role = null;

            if(user != null) {
                role = user.getUserRole();
            }

            if(role != null) {
                isClient = role.getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue());
            }
                searchCriteria.setAdmin(true);
                page = employeeRepository.findAll(new EmployeeSpecification(searchCriteria, true),pageRequest);
                allEmpsList.addAll(page.getContent());


            if(CollectionUtils.isNotEmpty(allEmpsList)) {
                //transactions = mapperUtil.toModelList(page.getContent(), EmployeeDTO.class);
                if(transactions == null) {
                    transactions = new ArrayList<EmployeeDTO>();
                }
                List<Employee> empList =  allEmpsList;
                if(CollectionUtils.isNotEmpty(empList)) {
                    for(Employee emp : empList) {
                        User empUser = emp.getUser();

                            transactions.add(mapToModelOnBoarding(emp));
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
    
//*******************************************Modified by Vinoth***********************************************************************
 
    public ExportResult exportOnboarding(List<EmployeeDTO> transactions) {
        //return exportUtil.writeToCsvFile(transactions, null);
        log.debug("ready to EXPORT EXCEL-------->");
        return exportUtil.writeToOnboardingExcelFile(transactions,null);
    }
    
    public ExportResult getOnboardingExportStatus(String fileId) {
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
    
    public byte[] getOnboardingExportFile(String fileName) {
        return exportUtil.readOnboardingEmployeeExportExcelFile(fileName);
    }
    
//************************************************************************************************************************************


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
        empDto.setUrl(cloudFrontUrl + bucketEnv + enrollImagePath + employee.getEnrolled_face());
        empDto.setLeft(employee.isLeft());
        empDto.setReliever(employee.isReliever());
        empDto.setRelieved(employee.isRelieved());
        empDto.setProjectName(CollectionUtils.isNotEmpty(employee.getProjectSites()) ? employee.getProjectSites().get(0).getProject().getName() : "");
        empDto.setSiteName(CollectionUtils.isNotEmpty(employee.getProjectSites()) ? employee.getProjectSites().get(0).getSite().getName() : "");
        empDto.setClient(employee.isClient());
        return empDto;
    }

/******************************Modified by Vinoth**********************************************************/
private Employee mapToModelOnBoarding(EmployeeDTO employee,Employee empDto) {
    empDto.setId(employee.getId());
    empDto.setEmpId(employee.getEmpId());
    empDto.setName(employee.getName());
    empDto.setFullName(employee.getFullName());
    empDto.setLastName(employee.getLastName());
    empDto.setPhone(employee.getPhone());
    empDto.setEmail(employee.getEmail());
    empDto.setActive(employee.getActive());
    empDto.setAccountNumber(employee.getAccountNumber());
    
//         empDto.setAddressProofImage(employee.getAddressProofImage());
//         empDto.setAdharBackImage(employee.getAdharBackImage());
    empDto.setAdharCardNumber(employee.getAdharCardNumber());
//         empDto.setAdharFrontImage(employee.getAdharFrontImage());
//         empDto.setBankPassbookImage(employee.getBankPassbookImage());
    empDto.setBloodGroup(employee.getBloodGroup());
    empDto.setBoardInstitute(employee.getBoardInstitute());
    empDto.setClientDescription(employee.getClientDescription());
    empDto.setClientName(employee.getClientName());
    empDto.setCode(employee.getCode());
    empDto.setDesignation(employee.getDesignation());
    empDto.setDob(employee.getDob());
    empDto.setDoj(employee.getDoj());
    //empDto.setDrivingLicense(employee.getDrivingLicense());
    empDto.setEducationalQulification(employee.getEducationalQulification());
    empDto.setEmergencyContactNumber(employee.getEmergencyContactNumber());
    empDto.setEmployer(employee.getEmployer());
    empDto.setFatherName(employee.getFatherName());
//         empDto.setFingerPrintLeft(employee.getFingerPrintLeft());
//         empDto.setFingerPrintRight(employee.getFingerPrintRight());
    empDto.setGender(employee.getGender());
    empDto.setIfscCode(employee.getIfscCode());
    empDto.setMaritalStatus(employee.getMaritalStatus());
    empDto.setMobile(employee.getMobile());
    empDto.setMotherName(employee.getMotherName());
    empDto.setNomineeContactNumber(employee.getNomineeContactNumber());
    empDto.setNomineeName(employee.getNomineeName());
    empDto.setNomineeRelationship(employee.getNomineeRelationship());
    //empDto.setPanCard(employee.getPanCard());
    empDto.setPercentage(employee.getPercentage());
    empDto.setPermanentAddress(employee.getPermanentAddress());
    empDto.setPermanentCity(employee.getPermanentCity());
    empDto.setPermanentState(employee.getPermanentState());
    empDto.setPersonalIdentificationMark1(employee.getPersonalIdentificationMark1());
    empDto.setPersonalIdentificationMark2(employee.getPersonalIdentificationMark2());
    empDto.setPresentAddress(employee.getPresentAddress());
    empDto.setPresentCity(employee.getPresentCity());
    empDto.setPresentState(employee.getPresentState());
    empDto.setPreviousDesignation(employee.getPreviousDesignation());
    empDto.setReligion(employee.getReligion());
    //empDto.setVoterId(employee.getVoterId());
    empDto.setWbsDescription(employee.getWbsDescription());
    empDto.setWbsId(employee.getWbsId());
    empDto.setProjectCode(employee.getProjectCode());
    empDto.setProjectDescription(employee.getProjectDescription());
    empDto.setActive(employee.getActive());
    empDto.setPosition(employee.getPosition()); 
    empDto.setOnBoardedFrom(employee.getOnBoardedFrom());
    empDto.setSubmitted(true);
    empDto.setSubmittedBy(SecurityUtils.getCurrentUser().getUsername());
    empDto.setSubmittedOn(ZonedDateTime.now());
    empDto.setVerified(false);
    empDto.setVerifiedBy(null);
    empDto.setVerifiedDate(null); 
    empDto.setOnboardedPlace(employee.getOnboardedPlace()); 
    empDto.setGross(employee.getGross()); 
    empDto.setNewEmployee(employee.isNewEmployee());
    empDto.setActivity(employee.getActivity());
    empDto.setRemarks(employee.getRemarks());
    empDto.setRejected(employee.isRejected());
    return empDto;
}

    private EmployeeDTO mapToModelOnBoarding(Employee employee) {
    	EmployeeDTO empDto = new EmployeeDTO();
        empDto.setId(employee.getId());
        empDto.setEmpId(employee.getEmpId());
        empDto.setName(employee.getName());
        empDto.setFullName(employee.getFullName());
        empDto.setLastName(employee.getLastName());
        empDto.setPhone(employee.getPhone());
        empDto.setEmail(employee.getEmail());
        empDto.setActive(employee.getActive());
    	 empDto.setAccountNumber(employee.getAccountNumber());
//         empDto.setAddressProofImage(employee.getAddressProofImage());
//         empDto.setAdharBackImage(employee.getAdharBackImage());
         empDto.setAdharCardNumber(employee.getAdharCardNumber());
//         empDto.setAdharFrontImage(employee.getAdharFrontImage());
//         empDto.setBankPassbookImage(employee.getBankPassbookImage());
         empDto.setBloodGroup(employee.getBloodGroup());
         empDto.setBoardInstitute(employee.getBoardInstitute());
         empDto.setClientDescription(employee.getClientDescription());
         empDto.setClientName(employee.getClientName());
         empDto.setCode(employee.getCode());
         empDto.setDesignation(employee.getDesignation());
         empDto.setDob(employee.getDob());
         empDto.setDoj(employee.getDoj());
         //empDto.setDrivingLicense(employee.getDrivingLicense());
         empDto.setEducationalQulification(employee.getEducationalQulification());
         empDto.setEmergencyContactNumber(employee.getEmergencyContactNumber());
         empDto.setEmployer(employee.getEmployer());
         empDto.setFatherName(employee.getFatherName());
//         empDto.setFingerPrintLeft(employee.getFingerPrintLeft());
//         empDto.setFingerPrintRight(employee.getFingerPrintRight());
         empDto.setGender(employee.getGender());
         empDto.setIfscCode(employee.getIfscCode());
         empDto.setMaritalStatus(employee.getMaritalStatus());
         empDto.setMobile(employee.getMobile());
         empDto.setMotherName(employee.getMotherName());
         empDto.setNomineeContactNumber(employee.getNomineeContactNumber());
         empDto.setNomineeName(employee.getNomineeName());
         empDto.setNomineeRelationship(employee.getNomineeRelationship());
         //empDto.setPanCard(employee.getPanCard());
         empDto.setPercentage(employee.getPercentage());
         empDto.setPermanentAddress(employee.getPermanentAddress());
         empDto.setPermanentCity(employee.getPermanentCity());
         empDto.setPermanentState(employee.getPermanentState());
         empDto.setPersonalIdentificationMark1(employee.getPersonalIdentificationMark1());
         empDto.setPersonalIdentificationMark2(employee.getPersonalIdentificationMark2());
         empDto.setPresentAddress(employee.getPresentAddress());
         empDto.setPresentCity(employee.getPresentCity());
         empDto.setPresentState(employee.getPresentState());
         empDto.setPreviousDesignation(employee.getPreviousDesignation());
         empDto.setReligion(employee.getReligion());
         //empDto.setVoterId(employee.getVoterId());
         empDto.setWbsDescription(employee.getWbsDescription());
         empDto.setWbsId(employee.getWbsId());
         empDto.setProjectCode(employee.getProjectCode());
         empDto.setProjectDescription(employee.getProjectDescription());
         empDto.setActive(employee.getActive());
         empDto.setPosition(employee.getPosition());
         empDto.setImported(employee.isImported());
         empDto.setOnBoardedFrom(employee.getOnBoardedFrom());
         empDto.setGross(employee.getGross());
         empDto.setOnboardedPlace(employee.getOnboardedPlace());
         if(empDto.isVerified()){
        	 empDto.setVerifiedBy(employee.getVerifiedBy().getFirstName());
         }
         if(employee.getVerifiedDate() != null) {
         empDto.setVerifiedDate(employee.getVerifiedDate());
         }
         empDto.setCreatedBy(employee.getCreatedBy());
         empDto.setCreatedDate(employee.getCreatedDate());
         empDto.setRemarks(employee.getRemarks());
         empDto.setRejected(employee.isRejected());
    	return empDto;
    }
    
/****************************************************************************************/ 
    public String uploadEmpExistingImage() {
        // TODO Auto-generated method stub
        int currPage = 1;
        int pageSize = 100;
        Pageable pageRequest = createPageRequest(currPage, pageSize);
        Page<Employee> empResult = employeeRepository.findByImage(pageRequest);
        List<Employee> empEntity = empResult.getContent();
        while(CollectionUtils.isNotEmpty(empEntity)) {
            log.debug("Length of empEntity List" +empEntity.size());
            for(Employee employee : empEntity) {
                if(employee.getEnrolled_face() != null) {
                    if(employee.getEnrolled_face().indexOf("data:image") == 0) {
                        String base64String = employee.getEnrolled_face().split(",")[1];
                        long dateTime = new Date().getTime();
                        boolean isBase64 = Base64.isBase64(base64String);
                        try {
//							EmployeeDTO emp = mapperUtil.toModel(employee, EmployeeDTO.class);
                            if(isBase64){
                                employee = amazonS3utils.uploadExistingEnrollImage(employee.getEnrolled_face(), employee, dateTime);
                            }
                        }catch(Exception e) {
                            log.debug("Error while mapping employee" + employee.getId() +" - "+employee.getName());
                        }
                    }
                }
            }
            employeeRepository.save(empEntity);
            currPage++;
            pageRequest = createPageRequest(currPage, pageSize);
            empResult = employeeRepository.findAll(pageRequest);
            empEntity = empResult.getContent();
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

    public SearchResult<EmployeeDTO> getEmpAttendanceList(SearchCriteria searchCriteria) {
        SearchResult<EmployeeDTO> result = new SearchResult<>();
    	Set<Long> empIds = new TreeSet<Long>();
    	List<Long> subEmpList = new ArrayList<Long>();
        Pageable pageRequest = null;
        Page<Employee> page = null;
        List<EmployeeDTO> transactions = null;

        if (!StringUtils.isEmpty(searchCriteria.getColumnName())) {
            Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
            log.debug("Sorting object" + sort);
            if(searchCriteria.isList()) {
                pageRequest = createPageSort(searchCriteria.getCurrPage(), sort);
            }else {
                pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);
            }
        } else {
            if(searchCriteria.isList()) {
                Sort sort = new Sort(Sort.Direction.ASC , "name");
                pageRequest = createPageSort(searchCriteria.getCurrPage(), sort);
            }else {
                pageRequest = createPageRequest(searchCriteria.getCurrPage());
            }
        }

        Calendar startCal = Calendar.getInstance();

        if (searchCriteria.getCheckInDateTimeFrom() != null) {
            startCal.setTime(searchCriteria.getCheckInDateTimeFrom());
        }
        startCal.set(Calendar.HOUR_OF_DAY, 0);
        startCal.set(Calendar.MINUTE, 0);
        startCal.set(Calendar.SECOND, 0);
        searchCriteria.setCheckInDateTimeFrom(startCal.getTime());
        Calendar endCal = Calendar.getInstance();
        if (searchCriteria.getCheckInDateTimeTo() != null) {
            endCal.setTime(searchCriteria.getCheckInDateTimeTo());
        }
        endCal.set(Calendar.HOUR_OF_DAY, 23);
        endCal.set(Calendar.MINUTE, 59);
        endCal.set(Calendar.SECOND, 0);
        searchCriteria.setCheckInDateTimeTo(endCal.getTime());

        java.sql.Date startDate = new java.sql.Date(searchCriteria.getCheckInDateTimeFrom().getTime());
        java.sql.Date toDate = new java.sql.Date(searchCriteria.getCheckInDateTimeTo().getTime());
        List<Attendance> attnLists = new ArrayList<>();
        if(searchCriteria.getProjectId() > 0) {
            attnLists = attendanceRepository.findByProjectAndDate(searchCriteria.getProjectId(), startDate, toDate);
        }else if(searchCriteria.getSiteId() > 0) {
            attnLists = attendanceRepository.findBySiteAndDate(searchCriteria.getSiteId(), startDate, toDate);
        }

		if(CollectionUtils.isNotEmpty(attnLists)) {
			for(Attendance attnList : attnLists) {
    			if(attnList.getEmployee().getId() > 0) {
    				empIds.add(attnList.getEmployee().getId());
    			}
    		}
    		subEmpList.addAll(empIds);
    		if(CollectionUtils.isNotEmpty(subEmpList)) {
    		    if(searchCriteria.getSiteId() == 0 && searchCriteria.getProjectId() > 0) {
                    page  = employeeRepository.findAllByNonIds(searchCriteria.getProjectId(), subEmpList, pageRequest);
                } else if(searchCriteria.getSiteId() > 0) {
                    page  = employeeRepository.findAllByNonEmpIds(searchCriteria.getProjectId(), searchCriteria.getSiteId(), subEmpList, pageRequest);
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
                        buildEmployeeResult(searchCriteria, page, transactions, result);
                    }
                }
    		}
		} else {

            result  = this.findBySearchCrieria(searchCriteria);

        }

    	return result;
    }

    private void buildEmployeeResult(SearchCriteria searchCriteria, Page<Employee> page, List<EmployeeDTO> transactions, SearchResult<EmployeeDTO> result) {
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
    
    public ExpenseDocumentDTO uploadFile(MultipartFile file, String fileName) {
        // TODO Auto-generated method stub
        Date uploadDate = new Date();
        ExpenseDocumentDTO expenseDocumentDTO = new ExpenseDocumentDTO();
        expenseDocumentDTO = amazonS3utils.uploadImageDoc(fileName, file, expenseDocumentDTO);
        expenseDocumentDTO.setFile(expenseDocumentDTO.getFile());
        expenseDocumentDTO.setUploadedDate(uploadDate);
        expenseDocumentDTO.setTitle(expenseDocumentDTO.getTitle());
        ExpenseDocument expenseDocument = mapperUtil.toEntity(expenseDocumentDTO, ExpenseDocument.class);
        expenseDocument.setActive(AssetDocument.ACTIVE_YES);
        expenseDocumentDTO.setFileUrl(expenseDocumentDTO.getFileUrl());
        return expenseDocumentDTO;
    }

    public List<EmployeeDTO> getEmployeeWithoutLeft(SearchCriteria searchCriteria) {
        List<Employee> emp = employeeRepository.findWithoutLeftEmp(searchCriteria.getEmpIds(),searchCriteria.getSiteIds());
        return mapperUtil.toModelList(emp, EmployeeDTO.class);
    }

    public List<Ticket> getPendingTickets(long employeeId){
        Employee employee = employeeRepository.findOne(employeeId);
        List<Ticket> tickets = ticketRepository.findEmployeeUnClosedTickets(employee.getId());
        return tickets;
    }

    public List<EmployeeDocuments> getEmployeeDocuments(long employeeId){
        List<EmployeeDocuments> documents = employeeDocumentRepository.findByEmployeeId(employeeId);
        return  documents;
    }
}
