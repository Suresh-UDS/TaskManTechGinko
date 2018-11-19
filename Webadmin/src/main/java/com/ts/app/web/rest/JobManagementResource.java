package com.ts.app.web.rest;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
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
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.JobStatus;
import com.ts.app.domain.User;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.AmazonS3Service;
import com.ts.app.service.JobManagementService;
import com.ts.app.service.PushService;
import com.ts.app.service.SchedulerService;
import com.ts.app.service.UserService;
import com.ts.app.service.util.CacheUtil;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.ReportUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.CheckInOutDTO;
import com.ts.app.web.rest.dto.EmployeeDTO;
import com.ts.app.web.rest.dto.ExportResponse;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.GraphResponse;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.LocationDTO;
import com.ts.app.web.rest.dto.NotificationLogDTO;
import com.ts.app.web.rest.dto.Paginator;
import com.ts.app.web.rest.dto.PriceDTO;
import com.ts.app.web.rest.dto.ReportResult;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;

/**
 * REST controller for managing the Site information.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class JobManagementResource {

	private final Logger log = LoggerFactory.getLogger(JobManagementResource.class);

	@Inject
	private JobManagementService jobService;

	@Inject
	private PushService pushService;

	@Inject
	private UserService userService;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private SchedulerService schedulerService;

	@Inject
	private ImportUtil importUtil;

	@Inject
	private CacheUtil cacheUtil;

	@Inject
	private ReportUtil reportUtil;

	@Inject
	private AmazonS3Service amazonService;


	@RequestMapping(path="/job/lookup/status", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public JobStatus[] getJobStatuses() {
		return JobStatus.values();
	}

	@RequestMapping(path="/site/{id}/job", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Paginator<JobDTO> getSiteJobs(@PathVariable("id") Long siteId, @RequestParam(name="currPage",required=false) int page){
		return jobService.getSiteJobs(siteId,page);
	}

	@RequestMapping(path="/job",method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveJob(@Valid @RequestBody JobDTO jobDTO, HttpServletRequest request) {
		log.debug("Job DTO save request ="+ jobDTO);
		JobDTO response = jobService.saveJob(jobDTO);
		log.debug("Job request parameter - "+ request.getParameter("sendNotification"));
		log.debug("Job save response - "+ response);

		if(response != null && response.getId() > 0) {
			String sendNotification = request.getParameter("sendNotification");
			if(StringUtils.isNotBlank(sendNotification)) {
				boolean isNotification = Boolean.parseBoolean(sendNotification);
				log.debug("Job save isNotification - "+ isNotification);
				if(isNotification) { //SEND PUSH notification for the users connected to the site.
					long siteId = jobDTO.getSiteId();
					log.debug("Job save siteId - "+ siteId);
					List<User> users = userService.findUsers(siteId);
					log.debug("Job save users - "+ users);
					if(CollectionUtils.isNotEmpty(users)) {
						long userIds[] = new long[users.size()];
						int ind = 0;
						for(User user : users) {
							userIds[ind] = user.getId();
							ind++;
						}
						String message = "New job "+ jobDTO.getTitle() +" requested for site-" + jobDTO.getSiteName();
						pushService.send(userIds, message);
						//jobService.saveNotificationLog(response.getId(), SecurityUtils.getCurrentUserId(), users, siteId, message);
					}
				}
			}
		}
		if(response != null && response.getId() > 0) {
			return new ResponseEntity<>(response,HttpStatus.CREATED);
		}else {
			return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
		}
	}

	@RequestMapping(path="/job/{id}",method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateJob(@Valid @RequestBody JobDTO jobDTO, HttpServletRequest request, @PathVariable("id") Long id) {
		if(jobDTO.getId() == 0) jobDTO.setId(id);
		log.debug("Job Details in updateJob = "+ jobDTO);
		long userId = SecurityUtils.getCurrentUserId();
		JobDTO response = jobService.updateJob(jobDTO, userId);
        if(response != null) {
        		if(StringUtils.isEmpty(response.getErrorMessage())) {
	            long siteId = response.getSiteId();
	            List<User> users = userService.findUsers(siteId);
	            if(CollectionUtils.isNotEmpty(users)) {
	                if (StringUtils.isNotEmpty(response.getStatus())
	                		&& response.getStatus().equalsIgnoreCase("OUTOFSCOPE")) {
	                    long userIds[] = new long[users.size()];
	                    int ind = 0;
	                    for (User user : users) {
	                        userIds[ind] = user.getId();
	                        ind++;
	                    }
	                    String message = "Job -" + response.getTitle() + "of site-" + response.getSiteName() + "is marked as Out of Scope";
	                    pushService.send(userIds, message);
	                    jobService.saveNotificationLog(id, SecurityUtils.getCurrentUserId(), users, siteId, message);
	                }
	            }
        		}else {
        			return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
        		}
        }
		return new ResponseEntity<>(response,HttpStatus.CREATED);
	}

	@RequestMapping(path="/job/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public JobDTO getJob(@PathVariable("id") Long id){
		return jobService.getJob(id);
	}

	@RequestMapping(path="/job/employee", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<EmployeeDTO> getAsssignableEmployee(){
		long userId = SecurityUtils.getCurrentUserId();
		return jobService.getAsssignableEmployee(userId);
	}

	@RequestMapping(path="/job/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> deleteJob(@PathVariable("id") Long id){
		jobService.deleteJob(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(path="/job/{id}/start", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> startJob(@PathVariable("id") Long id){
		JobDTO response = jobService.startJob(id);
		return new ResponseEntity<>(response,HttpStatus.OK);
	}

	@RequestMapping(path="/job/{id}/complete", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> completeJob(@PathVariable("id") Long id){
		long userId = SecurityUtils.getCurrentUserId();
        JobDTO response = jobService.completeJob(id, userId);
        if(response != null && !response.isErrorStatus()) {
            long siteId = response.getSiteId();
            List<User> users = userService.findUsers(siteId);
            if(CollectionUtils.isNotEmpty(users)) {
                long userIds[] = new long[users.size()];
                int ind = 0;
                for(User user : users) {
                    userIds[ind] = user.getId();
                    ind++;
                }
                String message = "Job -"+ response.getTitle() + " completed for site-" + response.getSiteName();
                pushService.send(userIds, message);
                jobService.saveNotificationLog(id, SecurityUtils.getCurrentUserId(), users, siteId, message);
            }
        }else {
        		return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @RequestMapping(path="/job/save", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveJobAndCheckList(@RequestBody JobDTO jobDTO, HttpServletRequest request){
    		long userId = SecurityUtils.getCurrentUserId();
        JobDTO response = jobService.saveJobAndCheckList(jobDTO, userId);
        if(response.isErrorStatus()) {
        		return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(response,HttpStatus.OK);
    }



	@RequestMapping(value = "/jobs/search",method = RequestMethod.POST)
	public SearchResult<JobDTO> searchJobs(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<JobDTO> result = null;
		if(searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			//jobService.updateJobStatus(searchCriteria.getSiteId(), searchCriteria.getJobStatus());
			result = jobService.findBySearchCrieria(searchCriteria,true);
		}
		return result;
	}

	@RequestMapping(value = "/jobs/report/{uid}",method = RequestMethod.POST)
	public SearchResult<JobDTO> jobReport(@PathVariable("uid") String uid) {
		SearchResult<JobDTO> result = null;
		SearchCriteria searchCriteria = reportUtil.getJobReportCriteria(uid);
		if(searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			//jobService.updateJobStatus(searchCriteria.getSiteId(), searchCriteria.getJobStatus());
			result = jobService.findBySearchCrieria(searchCriteria,true);
		}
		return result;
	}

	@RequestMapping(value = "/jobs/report",method = RequestMethod.POST)
	public List<ReportResult> jobReport(@RequestBody SearchCriteria searchCriteria) {
		List<ReportResult> result = null;
		if(searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = jobService.generateConsolidatedReport(searchCriteria, false);
		}
		return result;
	}

	@RequestMapping(value = "/jobs/graph",method = RequestMethod.POST)
	public GraphResponse jobGraph(@RequestBody SearchCriteria searchCriteria) {
		GraphResponse result = null;
		if(searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			List<ReportResult> reportResultList = jobService.generateConsolidatedReport(searchCriteria, true);
			Map<String,Long> dataMap = new HashMap<String,Long>();
			for(ReportResult rep : reportResultList) {
				Map<java.sql.Date, Long> totalCntMap = rep.getTotalCountMap();
				if(totalCntMap != null && totalCntMap.size() > 0) {
					if(CollectionUtils.isEmpty(result.getDateSeries())) {
						Iterator<java.sql.Date> dateItr = totalCntMap.keySet().iterator();
						List<Date> dateSeries = new ArrayList<Date>();
						while(dateItr.hasNext()) {
							Date dt = new Date(dateItr.next().getTime());
							dateSeries.add(dt);
						}
						result.setDateSeries(dateSeries);
					}
				}
				if(CollectionUtils.isNotEmpty(result.getDateSeries())) {
					List<Date> dateSeries = result.getDateSeries();
					for(Date date : dateSeries) {
						long totalCnt = totalCntMap.get(date);
						if(dataMap.containsKey("TOTAL")) {
							long cumTotalCnt = dataMap.get("TOTAL");
							cumTotalCnt += totalCnt;
							dataMap.put("TOTAL", cumTotalCnt);
						}
					}
				}
			}
		}
		return result;
	}

    @RequestMapping(value = "/jobs/date/search",method = RequestMethod.POST)
    public List<JobDTO> findByDate(@RequestBody SearchCriteria searchCriteria) {
        List<JobDTO> result = null;
        if(searchCriteria != null) {
            searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
            jobService.updateJobStatus(searchCriteria.getSiteId(), searchCriteria.getJobStatus());
            result = jobService.findByDate(searchCriteria,true);
        }
        return result;
    }

    @RequestMapping(value = "/location", method = RequestMethod.GET)
    public List<LocationDTO> findAll(HttpServletRequest request) {
        log.info("--Invoked Location.findAll --");
        return jobService.findAllLocation();
    }

	@RequestMapping(value = "/employee/jobs/search",method = RequestMethod.POST)
	public SearchResult<JobDTO> searchJobsForEmployee(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<JobDTO> result = null;
		if(searchCriteria != null) {
			jobService.updateJobStatus(searchCriteria.getSiteId(), searchCriteria.getJobStatus());
			result = jobService.findBySearchCrieria(searchCriteria,false);
		}
		return result;
	}

    @RequestMapping(value = "/location/jobs/search",method = RequestMethod.POST)
    public SearchResult<JobDTO> searchJobsByLocation(@RequestBody SearchCriteria searchCriteria) {
        SearchResult<JobDTO> result = null;
        if(searchCriteria != null) {
            jobService.updateJobStatus(searchCriteria.getSiteId(), searchCriteria   .getJobStatus());
            result = jobService.findBySearchCrieria(searchCriteria,false);
        }
        return result;
    }

    @RequestMapping(value = "/employee/jobs/search/selectedDate",method = RequestMethod.POST)
    public SearchResult<JobDTO> findByDateSelected(@RequestBody SearchCriteria searchCriteria) {
        SearchResult<JobDTO> result = null;
        if(searchCriteria != null) {
            result = jobService.findByDateSelected(searchCriteria,false);
        }
        return result;
    }

	@RequestMapping(value = "/jobs/notifications/{userId}",method = RequestMethod.GET)
	public List<NotificationLogDTO> getAllNotifications(@PathVariable("userId") long userId) {
		log.debug("Invoking getAllNotifications() - userId -" + userId);
		List<NotificationLogDTO> notificationLogs = jobService.getAllNotifications(userId);
		return notificationLogs;
	}

	@RequestMapping(value = "/jobs/notification",method = RequestMethod.PUT)
	public NotificationLogDTO udpateNotification(@RequestBody NotificationLogDTO notifyLogDto) {
		return jobService.updateNotificationLog(notifyLogDto);
	}




	@RequestMapping(path="/jobs/import", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ImportResult> importJobData(@RequestParam("jobFile") MultipartFile file){
		Calendar cal = Calendar.getInstance();
		ImportResult result = importUtil.importJobData(file, cal.getTimeInMillis());
		return new ResponseEntity<ImportResult>(result,HttpStatus.OK);
	}
 
    @RequestMapping(value = "/jobs/import/{fileId}/status",method = RequestMethod.GET)
	public ImportResult importStatus(@PathVariable("fileId") String fileId) {
		//log.debug("ImportStatus -  fileId -"+ fileId);
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
					//result.setMsg("Failed to import. Please try again");
					break;
				default :
					result.setMsg("Completed importing");
					break;
			}
		}
		return result;
	}


    @RequestMapping(value = "/price", method = RequestMethod.GET)
    public List<PriceDTO> findAllPrices(HttpServletRequest request) {
        log.info("--Invoked prices.findAll --");
        return jobService.findAllPrices();
    }

    @RequestMapping(value = "/price/site/{siteId}", method = RequestMethod.GET)
    public List<PriceDTO> findBySiteId(@PathVariable Long siteId) {
        log.info("--Invoked EmployeeResource.findAll --");
        return jobService.findBySiteId(siteId);
    }

    @RequestMapping(value = "/job/export",method = RequestMethod.POST)
    public ExportResponse exportJob(@RequestBody SearchCriteria searchCriteria) {
	    log.debug("JOB EXPORT STARTS HERE **********"+searchCriteria.isReport());
        ExportResponse resp = new ExportResponse();
        if(searchCriteria != null) {
            searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
            searchCriteria.setReport(true);
            SearchResult<JobDTO> result = jobService.findBySearchCrieria(searchCriteria, true);
            List<JobDTO> results = result.getTransactions();
            for (JobDTO job:result.getTransactions()){
                    log.debug("Location from search result ------- "+job.getBlock());
            }

            for (JobDTO job: results){
                log.debug("Location from list result ------- "+job.getBlock());
            }
            resp.addResult(jobService.generateReport(results, searchCriteria));

           // log.debug("RESPONSE FOR OBJECT resp *************"+resp);
        }
        return resp;
    }

    @RequestMapping(value = "/job/export/{fileId}/status",method = RequestMethod.GET)
	public ExportResult exportStatus(@PathVariable("fileId") String fileId) {
		//log.debug("ExportStatus -  fileId -"+ fileId);
		ExportResult result = jobService.getExportStatus(fileId);

		//log.debug("RESULT NOW **********"+result);
		//log.debug("RESULT GET STATUS **********"+result.getStatus());

		if(result!=null && result.getStatus() != null) {
			switch(result.getStatus()) {
				case "PROCESSING" :
					result.setMsg("Exporting...");
					break;
				case "COMPLETED" :
					result.setMsg("Download");
					//log.debug("DOWNLOAD FILE PROCESSING HERE ************"+result.getMsg());
					//log.debug("FILE ID IN API CALLING ************"+fileId);
					result.setFile("/api/job/export/"+fileId);
					//log.debug("DOWNLOADED FILE IS ************"+result.getFile());
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

	@RequestMapping(value = "/job/export/{fileId}",method = RequestMethod.GET)
	public byte[] getExportFile(@PathVariable("fileId") String fileId, HttpServletResponse response) {
		byte[] content = jobService.getExportFile(fileId);
		response.setContentType("Application/x-msexcel");
		response.setContentLength(content.length);
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Content-Disposition","attachment; filename=\"" + fileId + ".xlsx\"");
		return content;
	}

    @RequestMapping(value = "/job/{id}/checkInOut", method = RequestMethod.GET)
    public List<CheckInOutDTO> findCheckInOutByEmployee(@PathVariable("id") Long jobId) {
        log.info("--Invoked findCheckInOut By JobId--"+jobId);
        return jobService.findCheckInOutByJob(jobId);
    }

    @RequestMapping(value = "/job/uploadExisting/checklistImg", method = RequestMethod.POST)
    public String uploadExistingChecklist() {
    	log.debug("Existing checklist image upload to AWS s3");
    	return jobService.uploadExistingChecklistImg();
    }

    @RequestMapping(value = "/getFilesFromAws", method = RequestMethod.GET)
    public void getFilesFromS3() {
    	log.debug("Get All Files from AWS S3");
    	amazonService.getAllFiles();
    }



}
