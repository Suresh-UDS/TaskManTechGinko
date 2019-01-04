package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.AttendanceService;
import com.ts.app.service.EmployeeService;
import com.ts.app.service.util.ReportUtil;
import com.ts.app.web.rest.dto.*;
import com.ts.app.web.rest.errors.TimesheetException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.List;

/**
 * REST controller for managing the Attendance information
 */
@RestController
@RequestMapping("/api")
public class AttendanceResource {

	private final Logger log = LoggerFactory.getLogger(AttendanceResource.class);

	@Inject
	private AttendanceService attendanceService;

	@Inject
    private EmployeeService employeeService;

	@Inject
	private ReportUtil reportUtil;

	/**
	 * POST /saveAttendance -> Attendance.
	 */
	@RequestMapping(value = "/attendance", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public AttendanceDTO saveAttendance(@Valid @RequestBody AttendanceDTO attendanceDTO, HttpServletRequest request) {
		log.info("Inside the method in concern" + attendanceDTO.getEmployeeEmpId());
		try {
			log.debug("Logged in user id -" + SecurityUtils.getCurrentUserId());
			attendanceDTO.setUserId(SecurityUtils.getCurrentUserId());
			attendanceDTO = attendanceService.saveAttendance(attendanceDTO);
		}catch (Exception cve) {
			log.error("Error while saving attendance info ",cve);
			throw new TimesheetException(cve);
		}
		return attendanceDTO;

	}

    @RequestMapping(value = "/attendance/save", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public AttendanceDTO saveAttendanceCheckOut(@Valid @RequestBody AttendanceDTO attendanceDTO, HttpServletRequest request) {
        log.info("Inside the method in concern" + attendanceDTO.getEmployeeEmpId()+" - "+attendanceDTO.getId());
        try {
            log.debug("Logged in user id -" + SecurityUtils.getCurrentUserId());
            attendanceDTO.setUserId(SecurityUtils.getCurrentUserId());
            attendanceDTO = attendanceService.saveCheckOutAttendance(attendanceDTO);
        }catch (Exception cve) {
            log.error("Error while saving attendance info ",cve);
            throw new TimesheetException(cve);
        }
        return attendanceDTO;

    }

    @RequestMapping(value = "/attendance/{id}/addRemarks", method = RequestMethod.POST)
    public AttendanceDTO addRemarks(@PathVariable("id") long attendanceId,@RequestBody String remarks) {

	    return attendanceService.addRemarks(attendanceId,remarks);
    }

    @RequestMapping(value = "/attendance/image/upload", method = RequestMethod.POST)
    public ResponseEntity<?> upload(@RequestParam("employeeEmpId") String employeeEmpId, @RequestParam("employeeId") long employeeId, @RequestParam("attendanceId") long attendanceId, @RequestParam("action") String action, @RequestParam("photoOutFile") MultipartFile file) {
       log.debug("Request Params for attendance"+employeeId+" "+ attendanceId+" "+action+ " "+employeeEmpId);
        AttendanceDTO attendanceDto = new AttendanceDTO();
        attendanceDto.setPhotoOutFile(file);
        attendanceDto.setAction(action);
        attendanceDto.setId(attendanceId);
        attendanceDto.setEmployeeId(employeeId);
        attendanceDto.setEmployeeEmpId(employeeEmpId);
//        attendanceDto.(checkInOutId);
        log.debug("attendance resource with parameters"+attendanceId+" ,"+action );
        attendanceService.uploadFile(attendanceDto);
        return new ResponseEntity<String>("{ \"empId\" : \""+attendanceDto.getAction() + "\", \"status\" : \"success\"}", HttpStatus.OK);
    }

	@RequestMapping(value = "/attendance", method = RequestMethod.GET)
	public List<AttendanceDTO> findAll() {
		log.info("--Inside the method in concern--");
		return attendanceService.findAll();
	}

    @RequestMapping(value = "/attendance/{id}/{employeeEmpId}",method = RequestMethod.GET)
    public ResponseEntity<?> findAttendanceImage(@PathVariable("id") Long id, @PathVariable("employeeEmpId") String empId) {
        String image = attendanceService.getAttendanceImage(id, empId);
        return new ResponseEntity<String>("{ \"image\":\" "+image+"\"",HttpStatus.OK);
    }

	@RequestMapping(value = "/attendance/{id}", method = RequestMethod.GET)
	public AttendanceDTO get(@PathVariable Long id) {
		return attendanceService.findOne(id);
	}

	@RequestMapping(value = "/attendance/employee/{empId}", method = RequestMethod.GET)
	public AttendanceDTO getEmployeeCurrentAttendance(@PathVariable("empId") Long empId) {
		return attendanceService.findCurrentCheckInByEmpId(empId);
	}

	@RequestMapping(value = "/attendance/search",method = RequestMethod.POST)
    public SearchResult<AttendanceDTO> searchAttendance(@RequestBody SearchCriteria searchCriteria) {
        SearchResult<AttendanceDTO> result = null;
        log.debug("Search Attendance- "+searchCriteria.getCheckInDateTimeFrom());
        if(searchCriteria != null) {
        	searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
            result = attendanceService.findBySearchCrieria(searchCriteria);
        }
        return result;
    }

	@RequestMapping(value = "/attendance/report/{uid}",method = RequestMethod.POST)
	public SearchResult<AttendanceDTO> jobReport(@PathVariable("uid") String uid) {
		SearchResult<AttendanceDTO> result = null;
		SearchCriteria searchCriteria = reportUtil.getJobReportCriteria(uid);
		if(searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = attendanceService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}


    @RequestMapping(value = "/attendance/export",method = RequestMethod.POST)
	public ExportResponse exportTimesheet(@RequestBody SearchCriteria searchCriteria) {
		ExportResponse resp = new ExportResponse();
		if(searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			SearchResult<AttendanceDTO> result = attendanceService.findBySearchCrieria(searchCriteria);
			log.debug("Attendance RESULT ***********"+result);

			List<AttendanceDTO> results = result.getTransactions();
			resp.addResult(attendanceService.generateReport(results, searchCriteria));
		}
		return resp;
	}

    @RequestMapping(value = "/attendance/site/{siteId}",method = RequestMethod.GET)
    public List<AttendanceDTO> findBySite(@PathVariable("siteId") Long siteId){
	    return attendanceService.findBySite(siteId);
    }

    @RequestMapping(value = "/attendance/image/enroll/{employeeId}",method = RequestMethod.POST)
    public String enrollImage(@RequestBody String imageData, @PathVariable("employeeId") Long employeeId){
        EmployeeDTO employee = new EmployeeDTO();
        employee = employeeService.findOne(employeeId);
        log.debug("employee" +employee.getEmpId());
        String frResponse = attendanceService.enrollUser(employee,imageData);
        return frResponse;
    }

    @RequestMapping(value = "/attendance/site/{siteId}/employee/{employeeId}",method = RequestMethod.POST)
    public List<AttendanceDTO> searchAttendanceByUserId (@PathVariable("siteId") long siteId, @PathVariable("employeeId") long employeeId){
        List<AttendanceDTO> result = null;
        EmployeeDTO employee = new EmployeeDTO();
        log.debug("employeeId"+employeeId);
        employee = employeeService.findOne(employeeId);
        SearchCriteria sc = new SearchCriteria();
        sc.setEmployeeEmpId(employee.getEmpId());
        sc.setEmployeeId(employeeId);
        sc.setSiteId(siteId);
        result = attendanceService.findByEmpId(sc);
        return result;
    }

	@RequestMapping(value = "/attendance/export/{fileId}/status",method = RequestMethod.GET)
	public ExportResult exportStatus(@PathVariable("fileId") String fileId) {
		log.debug("ExportStatus -  fileId -"+ fileId);
		ExportResult result = attendanceService.getExportStatus(null, fileId);
		if(result!=null && result.getStatus() != null) {
			switch(result.getStatus()) {
				case "PROCESSING" :
					result.setMsg("Exporting...");
					break;
				case "COMPLETED" :
					result.setMsg("Download");
					result.setFile("/api/attendance/export/"+fileId);
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

	@RequestMapping(value = "/attendance/export/{fileId}",method = RequestMethod.GET)
	public byte[] getExportFile(@PathVariable("fileId") String fileId, HttpServletResponse response) {
		byte[] content = attendanceService.getExportFile(null, fileId);
		response.setContentType("Application/x-msexcel");
		response.setContentLength(content.length);
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Content-Disposition","attachment; filename=\"" + fileId + ".xlsx\"");
		return content;
	}
	
	@RequestMapping(value = "/attendance/uploadExistingCheckInImages", method = RequestMethod.POST)
	public ResponseEntity<?> uploadExistingCheckInImage() { 
		log.debug("Upload Existing Img to AWS s3");
		String result = "";
		try { 
			result = attendanceService.uploadExistingCheckInImage();
		} catch(Exception e) { 
			throw new TimesheetException("Error while uploading checkInImage to S3" +e);
		}
		return new ResponseEntity<>(result, HttpStatus.CREATED);
	}
	
	@RequestMapping(value = "/attendance/uploadExistingCheckOutImages", method = RequestMethod.POST)
	public ResponseEntity<?> uploadExistingCheckOutImage() { 
		log.debug("Upload Existing Img to AWS s3");
		String result = "";
		try { 
			result = attendanceService.uploadExistingCheckOutImage();
		} catch(Exception e) { 
			throw new TimesheetException("Error while uploading checkOutImage to S3" +e);
		}
		return new ResponseEntity<>(result, HttpStatus.CREATED);
	}


}
