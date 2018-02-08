package com.ts.app.web.rest;

import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import com.ts.app.domain.User;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.MailService;
import com.ts.app.service.NotificationService;
import com.ts.app.service.util.QRCodeUtil;
import com.ts.app.web.rest.dto.*;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.EmployeeService;
import com.ts.app.web.rest.errors.TimesheetException;
import com.ts.app.web.rest.util.TokenUtils;

/**
 * REST controller for managing the Employee information.
 */
@RestController
@CrossOrigin
@RequestMapping("/api")
public class EmployeeResource {

	private final Logger log = LoggerFactory.getLogger(EmployeeResource.class);

	@Inject
	private EmployeeService employeeService;

    @Inject
    private MailService mailService;

    @Inject
    private UserRepository userRepository;

    @Inject
    private NotificationService notificationService;

	@Inject
	public EmployeeResource(EmployeeService employeeService) {
		this.employeeService = employeeService;
	}

	/**
	 * POST /saveEmployee -> saveEmployee the Employee.
	 */
	@RequestMapping(value = "/employee", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveEmployee(@Valid @RequestBody EmployeeDTO employeeDTO, HttpServletRequest request) {
		log.info("Inside the saveEmployee -" + employeeDTO);
		log.info("Inside Save employee"+employeeDTO.getManagerId());
		long userId = SecurityUtils.getCurrentUserId();
		log.info("save Employee call - userId "+userId);
		employeeDTO.setUserId(userId);

		try {
			EmployeeDTO employeeDto = employeeService.createEmployeeInformation(employeeDTO);
		}catch(Exception e) {
			throw new TimesheetException(e, employeeDTO);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/employee", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateEmployee(@Valid @RequestBody EmployeeDTO employee, HttpServletRequest request) {
		log.info("Inside Update" + employee.getName() + " , "+ employee.getProjectId());
		try {
			employeeService.updateEmployee(employee,false);
		}catch(Exception e) {
			throw new TimesheetException(e, employee);
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}

    @RequestMapping(value = "/employee/out", method = RequestMethod.POST)
    public ResponseEntity<?> employeeOut(@RequestBody CheckInOutDTO checkInOut) {
        checkInOut.setUserId(SecurityUtils.getCurrentUserId());
        employeeService.onlyCheckOut(checkInOut);
        return new ResponseEntity<String>("{ \"empId\" : "+'"'+checkInOut.getEmployeeEmpId() + '"'+", \"status\" : \"success\", \"transactionId\" : \"" + checkInOut.getId() +"\" }", HttpStatus.OK);
    }

    @RequestMapping(value = "/employee/checkInOut", method = RequestMethod.POST)
    public SearchResult findAllCheckInOut(@RequestBody SearchCriteria searchCriteria) {
        log.info("--Invoked findAllCheckInOut --");
        return employeeService.findAllCheckInOut(searchCriteria);
    }


    @RequestMapping(value = "/employee/enroll", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> enrollEmployeeFace(@Valid @RequestBody EmployeeDTO employee, HttpServletRequest request) {
        log.info("Inside Enroll" + employee.getName() + " , "+ employee.getProjectId());
        try {
            employeeService.enrollFace(employee);
        }catch(Exception e) {
            throw new TimesheetException(e, employee);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/employee/authorizeImage", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> authorizeImage(@Valid @RequestBody EmployeeDTO employee, HttpServletRequest request) {
        log.info("Inside authorize Image" + employee.getName() + " , "+ employee.getProjectId());
        try {
            employeeService.authorizeImage(employee);
        }catch(Exception e) {
            throw new TimesheetException(e, employee);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

	@RequestMapping(value = "/employee/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		log.info("Inside Delete" + id);
		employeeService.deleteEmployee(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/employee/{id}/site/{siteId}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteSite(@PathVariable Long id, @PathVariable Long siteId) {
		log.info("Inside Delete" + id + ", siteId -"+siteId);
		List<SiteDTO> sites = employeeService.deleteEmployeeSite(id,siteId);
		return new ResponseEntity<>(sites, HttpStatus.OK);
	}

	@RequestMapping(value = "/employee/{id}/project/{projectId}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteProject(@PathVariable Long id, @PathVariable Long projectId) {
		log.info("Inside Delete" + id + ", projectId -"+projectId);
		List<ProjectDTO> projects = employeeService.deleteEmployeeProject(id,projectId);
		return new ResponseEntity<>(projects, HttpStatus.OK);
	}

	@RequestMapping(value = "/employee/dupcheck/{empId}", method = RequestMethod.GET)
	public EmployeeDTO findEmployee(@PathVariable String empId) {
		log.info("--Invoked EmployeeResource.findEmployee --");
		return employeeService.findByEmpId(empId);
	}


	@RequestMapping(value = "/employee", method = RequestMethod.GET)
	public List<EmployeeDTO> findAll() {
		log.info("--Invoked EmployeeResource.findAll --");
		return employeeService.findAll(SecurityUtils.getCurrentUserId());
	}

    @RequestMapping(value = "/employee/site/{siteId}", method = RequestMethod.GET)
    public List<EmployeeDTO> findBySiteId(@PathVariable Long siteId) {
        log.info("--Invoked EmployeeResource.findAll --");
        return employeeService.findBySiteId(SecurityUtils.getCurrentUserId(),siteId);
    }

	@RequestMapping(value = "/employee/{id}/managers", method = RequestMethod.GET)
	public List<EmployeeDTO> findAllEligibleManagers(@PathVariable Long id) {
		List<EmployeeDTO> managers = employeeService.findAllEligibleManagers(id);
		log.debug("Get managers -"+ managers);
		return managers;
	}

	@RequestMapping(value = "/employee/{id}", method = RequestMethod.GET)
	public EmployeeDTO get(@PathVariable Long id) {
		EmployeeDTO employeeDto = employeeService.findOne(id);
		log.debug("Get employee details -"+ employeeDto);
		return employeeDto;
		// .map((entity) -> new ResponseEntity<>(entity, HttpStatus.OK))
		// .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@RequestMapping(value = "/employee/validate/{code}", method = RequestMethod.GET)
	public ResponseEntity<?> validateCode(@PathVariable Long code, HttpServletRequest request) {
		EmployeeDTO empModel = employeeService.validateCode(code);
		if(empModel != null) {
			String token = request.getHeader("X-Auth-Token");
			TokenUtils.setObject(token, empModel);
			return new ResponseEntity<EmployeeDTO>(empModel, HttpStatus.OK);
		}else {
			return new ResponseEntity<String>("invalid", HttpStatus.NOT_FOUND);
		}
	}

	@RequestMapping(value = "/employee/{id}/history", method = RequestMethod.GET)
	public List<EmployeeHistoryDTO> getHistory(@PathVariable Long id) {
		return employeeService.getHistory(id);
	}


	@RequestMapping(value = "/employee/{id}/qrcode", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
	public String generateQRCode(@PathVariable("id") long empId) {
		return employeeService.generateQRCode(empId);
	}

	@RequestMapping(value = "/employee/qrcode", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
	public ResponseEntity<?> generateQRCodeForAll() {
		long userId = SecurityUtils.getCurrentUserId();
		List<EmployeeDTO> employees = employeeService.findAll(userId);
		for(EmployeeDTO emp : employees) {
			employeeService.generateQRCode(emp.getId());
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}

    @RequestMapping(value = "/employee/search",method = RequestMethod.POST)
    public SearchResult<EmployeeDTO> searchEmployees(@RequestBody SearchCriteria searchCriteria) {
        if(searchCriteria != null) {
            log.debug("search criteria - " + searchCriteria.getEmployeeId() + " , " + searchCriteria.getProjectId() + " , " + searchCriteria.getSiteId());
            searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
        }
        SearchResult<EmployeeDTO> result = null;
        if(searchCriteria != null) {
            result = employeeService.findBySearchCrieria(searchCriteria);
        }
        return result;
    }




}
