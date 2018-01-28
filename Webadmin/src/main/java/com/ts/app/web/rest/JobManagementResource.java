package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.User;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.JobManagementService;
import com.ts.app.service.PushService;
import com.ts.app.service.SchedulerService;
import com.ts.app.service.UserService;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.*;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

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

		if(response != null) {
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
		return new ResponseEntity<>(response,HttpStatus.CREATED);
	}

	@RequestMapping(path="/job/{id}",method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateJob(@Valid @RequestBody JobDTO jobDTO, HttpServletRequest request, @PathVariable("id") Long id) {
		if(jobDTO.getId()==null) jobDTO.setId(id);
		log.debug("Job Details in updateJob = "+ jobDTO);
		JobDTO response = jobService.updateJob(jobDTO);
        if(response != null) {

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
        }
		return new ResponseEntity<>(response,HttpStatus.CREATED);
	}

	@RequestMapping(path="/job/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public JobDTO getJob(@PathVariable("id") Long id){
		return jobService.getJob(id);
	}

	@RequestMapping(path="/job/employee", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<EmployeeDTO> getAsssignableEmployee(){
		return jobService.getAsssignableEmployee();
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
		JobDTO response = jobService.completeJob(id);
		if(response != null) {
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
		}
		return new ResponseEntity<>(response,HttpStatus.OK);
	}



	@RequestMapping(value = "/jobs/search",method = RequestMethod.POST)
	public SearchResult<JobDTO> searchJobs(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<JobDTO> result = null;
		if(searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			jobService.updateJobStatus(searchCriteria.getSiteId(), searchCriteria.getJobStatus());
			result = jobService.findBySearchCrieria(searchCriteria,true);
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


    //Asset
    @RequestMapping(path="/asset",method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> saveAsset(@Valid @RequestBody AssetDTO assetDTO, HttpServletRequest request) {
        log.debug("Asset DTO save request ="+ assetDTO);
        AssetDTO response = jobService.saveAsset(assetDTO);
        log.debug("Asset save response - "+ response);
        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }

    @RequestMapping(value = "/assets/search",method = RequestMethod.POST)
    public List<AssetDTO> findAllAssets(HttpServletRequest request) {
        log.info("--Invoked Location.findAll --");
        return jobService.findAllAssets();
    }

    @RequestMapping(path="/site/{id}/asset", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<AssetDTO> getSiteAssets(@PathVariable("id") Long siteId){
        return jobService.getSiteAssets(siteId);
    }

    @RequestMapping(path="/asset/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public AssetDTO getAsset(@PathVariable("id") Long id){
        return jobService.getAsset(id);
    }

    @RequestMapping(path="/asset/code/{code}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public AssetDTO getAssetByCode(@PathVariable("code") String code){
        return jobService.getAssetByCode(code);
    }

    @RequestMapping(path="/asset/{id}",method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<?> updateAsset(@Valid @RequestBody AssetDTO assetDTO, HttpServletRequest request, @PathVariable("id") Long id) {
        if(assetDTO.getId()==null) assetDTO.setId(id);
        log.debug("Asset Details in updateAsset = "+ assetDTO);
        AssetDTO response = jobService.updateAsset(assetDTO);
        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }

    @RequestMapping(value = "/asset/{id}/qrcode", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
    public String generateAssetQRCode(@PathVariable("id") long assetId) {
        return jobService.generateAssetQRCode(assetId);
    }

	@RequestMapping(path="/jobs/import", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> importJobData(){
		importUtil.importJobData();
		return new ResponseEntity<>(HttpStatus.OK);
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



}
