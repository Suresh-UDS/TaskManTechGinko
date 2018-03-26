package com.ts.app.web.rest;

import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import com.ts.app.domain.Employee;
import com.ts.app.domain.User;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.JobManagementService;
import com.ts.app.service.MailService;
import com.ts.app.service.NotificationService;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.UserService;
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
    private JobManagementService jobService;

    @Inject
    private MailService mailService;

    @Inject
    private UserRepository userRepository;

    @Inject
    private NotificationService notificationService;

	@Inject
	private ImportUtil importUtil;

    @Inject
    private UserService userService;

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

			/*
			if(employeeDto.isCreateUser()) {
				UserDTO userDto = new UserDTO();
				userDto.setLogin(employeeDto.getEmpId());
				userDto.setFirstName(employeeDto.getName());
				userDto.setLastName(employeeDto.getLastName());
				userDto.setEmployeeId(employeeDto.getId());
				userDto.setEmployeeName(employeeDto.getName());
				userService.createUserInformation(userDto);
			}
			*/

		}catch(Exception e) {
			throw new TimesheetException(e, employeeDTO);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/employee", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateEmployee(@Valid @RequestBody EmployeeDTO employee, HttpServletRequest request) {
		log.info("Inside Update" + employee.getName() + " , "+ employee.getProjectId()+ " , "+ employee.isLeft());
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

    @RequestMapping(value = "/employee/image/upload", method = RequestMethod.POST)
    public ResponseEntity<?> upload(@RequestParam("employeeEmpId") String employeeEmpId, @RequestParam("employeeId") String employeeId,@RequestParam("jobId") Long jobId,@RequestParam("siteId") String siteId,@RequestParam("checkInOutId") String checkInOutId, @RequestParam("action") String action, @RequestParam("photoOutFile") MultipartFile file) {
        CheckInOutImageDTO checkInOutImage = new CheckInOutImageDTO();

        checkInOutImage.setEmployeeEmpId(employeeEmpId);
        checkInOutImage.setEmployeeId(Long.parseLong(employeeId));
//        checkInOutImage.setProjectId(projectId);
        checkInOutImage.setJobId(jobId);
        checkInOutImage.setSiteId(Long.parseLong(siteId));
        checkInOutImage.setAction(action);
        checkInOutImage.setPhotoOutFile(file);
        checkInOutImage.setCheckInOutId(Long.parseLong(checkInOutId));
        log.debug("Check in out image service called from resource with the parameters::::::"+employeeEmpId+" ,"+employeeId+" ,"+jobId+" ,"+siteId);
        employeeService.uploadFile(checkInOutImage);
        return new ResponseEntity<String>("{ \"empId\" : "+checkInOutImage.getEmployeeEmpId() + ", \"status\" : \"success\"}", HttpStatus.OK);
    }

    @RequestMapping(value = "/employee/{id}/checkInOut/{imageId}",method = RequestMethod.GET)
    public String findCheckInOutByEmployee(@PathVariable("id") String employeeEmpId,@PathVariable("imageId") String imageId) {
        return employeeService.getEmployeeCheckInImage(employeeEmpId, imageId);
    }

    @RequestMapping(value = "/employee/{id}/checkInOut/image",method = RequestMethod.DELETE)
    public List<String> deleteCheckInOutImages(@PathVariable("id") String employeeEmpId,@RequestBody ImageDeleteRequest deleteRequest) {
        log.debug("images ids -"+deleteRequest.getImageIds() + " , trans ids -" + deleteRequest.getTransIds());
        return employeeService.deleteImages(employeeEmpId, deleteRequest);
    }

    @RequestMapping(value = "/employee/checkInOut", method = RequestMethod.POST)
    public SearchResult findAllCheckInOut(@RequestBody SearchCriteria searchCriteria) {
        log.info("--Invoked findAllCheckInOut --");
        return employeeService.findAllCheckInOut(searchCriteria);
    }

    @RequestMapping(value = "/employee/{id}/checkInOut", method = RequestMethod.GET)
    public SearchResult<CheckInOutDTO> findCheckInOutByEmployee(@PathVariable("id") Long employeeId, @RequestParam(name="findAll",required=false) Boolean findAll, @RequestParam(name="currPage",required=false) Integer currPage) {
        log.info("--Invoked findCheckInOut By employeeId --"+employeeId);
        if(findAll == null || !findAll) {
            if(currPage == null) {
                currPage = 1;
            }
            findAll = false;
        }else {
            currPage = 0;
        }
        return employeeService.findCheckInOut(employeeId, currPage, findAll);
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
            log.debug("search criteria - " + searchCriteria.getEmployeeEmpId() + " , " + searchCriteria.getProjectId() + " , " + searchCriteria.getSiteId());
            searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
        }
        SearchResult<EmployeeDTO> result = null;
        if(searchCriteria != null) {
            result = employeeService.findBySearchCrieria(searchCriteria);
        }
        return result;
    }

    @RequestMapping(value = "/employee/relievers", method = RequestMethod.GET)
    public List<EmployeeDTO> findAllRelievers() {
        log.info("--Invoked EmployeeResource.findAll Relievers--");
        return employeeService.findAllRelievers(SecurityUtils.getCurrentUserId());
    }

    @RequestMapping(value = "/employee/export",method = RequestMethod.POST)
	public ExportResponse exportEmployee(@RequestBody SearchCriteria searchCriteria) {
	    ExportResponse resp = new ExportResponse();
		if(searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			SearchResult<EmployeeDTO> result = employeeService.findBySearchCrieria(searchCriteria);
			List<EmployeeDTO> results = result.getTransactions();
			//log.debug("VALUES OF RESULTS ******************"+results);
            resp.addResult(employeeService.export(results));
		}
    	return resp;
	}

    @RequestMapping(value = "/employee/export/{fileId}/status",method = RequestMethod.GET)
	public ExportResult exportStatus(@PathVariable("fileId") String fileId) {
		//log.debug("ExportStatus -  fileId -"+ fileId);
		ExportResult result = employeeService.getExportStatus(fileId);
		if(result!=null && result.getStatus() != null) {
		    //log.info("result.getSTATUS----------"+result.getStatus());
			switch(result.getStatus()) {
				case "PROCESSING" :
					result.setMsg("Exporting...");
					break;
				case "COMPLETED" :
					result.setMsg("Download");
					//log.info("FILE-ID--------"+fileId);
					result.setFile("/api/employee/export/"+fileId);
					//log.info("FILE-ID AFTER RESULT--------"+result);
					break;
				case "FAILED" :
					result.setMsg("Failed to export. Please try again");
					break;
				default :
					result.setMsg("Failed to export. Please try again");
					break;
			}
		}
		return result;
	}

	@RequestMapping(value = "/employee/export/{fileId}",method = RequestMethod.GET)
	public byte[] getExportFile(@PathVariable("fileId") String fileId, HttpServletResponse response) {
	   // log.debug("FILE-ID++++++++++++"+fileId);
		byte[] content = employeeService.getExportFile(fileId);
		//log.debug("GET EXPORT FILE FILE-ID----"+content);
		response.setContentType("Application/x-msexcel");
		response.setContentLength(content.length);
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Content-Disposition","attachment; filename=\"" + fileId + ".xlsx\"");
		return content;
	}

    @RequestMapping(value = "/employee/assignReliever", method = RequestMethod.POST)
    public ResponseEntity<?> assignReliever(@RequestBody RelieverDTO reliever) {

        log.info("Inside assign Reliever" + reliever.getEmployeeId() + " , "+ reliever.getRelieverId());

        EmployeeDTO selectedEmployee = employeeService.findByEmpId(reliever.getEmployeeEmpId());
        EmployeeDTO selectedReliever = employeeService.findByEmpId(reliever.getRelieverEmpId());
        selectedEmployee.setRelieved(true);
        try {
            employeeService.updateEmployee(selectedEmployee,false);
            jobService.assignReliever(selectedEmployee,selectedReliever, reliever.getRelievedFromDate(), reliever.getRelievedToDate());
        }catch(Exception e) {
            throw new TimesheetException(e, selectedEmployee);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/employee/assignJobsAndTransfer", method = RequestMethod.POST)
    public ResponseEntity<?> transferEmployee(@RequestBody RelieverDTO reliever) {

        log.info("Inside assign Reliever" + reliever.getEmployeeId() + " , "+ reliever.getRelieverId());

        EmployeeDTO selectedEmployee = employeeService.findByEmpId(reliever.getEmployeeEmpId());
        EmployeeDTO selectedReliever = employeeService.findByEmpId(reliever.getRelieverEmpId());
        selectedEmployee.setRelieved(true);
        try {
            employeeService.updateEmployee(selectedEmployee,false);
            jobService.assignJobsForDifferentEmployee(selectedEmployee,selectedReliever, reliever.getRelievedFromDate());
        }catch(Exception e) {
            throw new TimesheetException(e, selectedEmployee);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/employee/deleteJobsAndTransfer", method = RequestMethod.POST)
    public ResponseEntity<?> deleteJobsAndTransfer(@RequestBody RelieverDTO reliever) {

        log.info("Inside assign Reliever" + reliever.getEmployeeId() + " , "+ reliever.getRelieverId());

        EmployeeDTO selectedEmployee = employeeService.findByEmpId(reliever.getEmployeeEmpId());
        selectedEmployee.setRelieved(true);
        try {
            employeeService.updateEmployee(selectedEmployee,false);
            jobService.deleteJobsForEmployee(selectedEmployee,reliever.getRelievedFromDate());
        }catch(Exception e) {
            throw new TimesheetException(e, selectedEmployee);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/employee/deleteJobsAndMarkLeft", method = RequestMethod.POST)
    public ResponseEntity<?> deleteJobsAndMarkLeft(@RequestBody RelieverDTO reliever) {

        log.info("Inside mark left Reliever" + reliever.getEmployeeId() + " , "+reliever.getEmployeeEmpId());

        EmployeeDTO selectedEmployee = employeeService.findByEmpId(reliever.getEmployeeEmpId());
        selectedEmployee.setLeft(true);
        try {
            employeeService.updateEmployee(selectedEmployee,false);
            jobService.deleteJobsForEmployee(selectedEmployee,reliever.getRelievedFromDate());
        }catch(Exception e) {
            throw new TimesheetException(e, selectedEmployee);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/designation", method = RequestMethod.GET)
    public List<DesignationDTO> findAllDesignations() {
        log.info("--Invoked EmployeeResource.findAllDesignations --");
        return employeeService.findAllDesignations();
    }

    @RequestMapping(value = "/designation", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> saveDesignation(@Valid @RequestBody DesignationDTO designationDTO, HttpServletRequest request) {
        log.info("Inside the save designation-" + designationDTO);
        log.info("Inside Save designation"+designationDTO.getDesignation());
        long userId = SecurityUtils.getCurrentUserId();
        try {
            DesignationDTO designation= employeeService.createDesignation(designationDTO);
        }catch(Exception e) {
            throw new TimesheetException(e, designationDTO);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(path="/employee/import", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ImportResult> importJobData(@RequestParam("employeeFile") MultipartFile file){
    	log.info("Employee Import Status********************");
		Calendar cal = Calendar.getInstance();
		ImportResult result = importUtil.importEmployeeData(file, cal.getTimeInMillis());
		return new ResponseEntity<ImportResult>(result,HttpStatus.OK);
	}

    @RequestMapping(value = "/employee/import/{fileId}/status",method = RequestMethod.GET)
	public ImportResult importStatus(@PathVariable("fileId") String fileId) {
		log.debug("ImportStatus -  fileId -"+ fileId);
		ImportResult result = jobService.getImportStatus(fileId);
		if(result!=null && result.getStatus() != null) {
			switch(result.getStatus()) {
				case "PROCESSING" :
					result.setMsg("Importing data...");
					break;
				case "COMPLETED" :
					result.setMsg("Completed importing");
					break;
				case "FAILED" :
					result.setMsg("Failed to import. Please try again");
					break;
				default :
					result.setMsg("Completed importing");
					break;
			}
		}
		return result;
	}


}
