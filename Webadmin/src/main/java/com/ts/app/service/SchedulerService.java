package com.ts.app.service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.base.Splitter;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Attendance;
import com.ts.app.domain.Employee;
import com.ts.app.domain.Job;
import com.ts.app.domain.SchedulerConfig;
import com.ts.app.domain.User;
import com.ts.app.repository.AttendanceRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.SchedulerConfigRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.SchedulerConfigDTO;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;

/**
 * Service class for managing Device information.
 */
@Service
@Transactional
public class SchedulerService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(SchedulerService.class);

	private static final String FREQ_ONCE_EVERY_HOUR = "Once in an hour";

	@Inject
	private SiteRepository siteRepository;

	@Inject
	private JobManagementService jobManagementService;

    @Inject
	private JobRepository jobRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private MailService mailService;

	@Inject
	private ExportUtil exportUtil;

	@Inject
	private SchedulerConfigRepository schedulerConfigRepository;

	@Inject
	private AttendanceRepository attendanceRepository;

	@Inject
	private PushService pushService;

	public SearchResult<SchedulerConfigDTO> getSchedulerConfig() {
		//get all config to show in admin
		List<SchedulerConfig> configs = schedulerConfigRepository.findAll();
		SearchResult<SchedulerConfigDTO> result = new SearchResult<>();
		result.setTransactions(mapperUtil.toModelList(configs,SchedulerConfigDTO.class));
		return result;
	}

	public void deleteCurrentSchedule(long jobId) {
		List<SchedulerConfig> sconfigs = schedulerConfigRepository.findJobSchedule(jobId);
		if(sconfigs != null) {
			for(SchedulerConfig sconfig : sconfigs) {
				sconfig.setActive("N");
				schedulerConfigRepository.save(sconfig);
			}
		}

	}

	public void save(SchedulerConfigDTO dto, Job job) {
		if(dto.getId() != null && dto.getId() > 0){
			SchedulerConfig entity =  schedulerConfigRepository.findOne(dto.getId());
			if(entity !=null){
				mapperUtil.toEntity(dto, entity);
				schedulerConfigRepository.save(entity);
			}else{
				throw new TimesheetException("Scheduler Config not found");
			}

		}else{
			SchedulerConfig entity = mapperUtil.toEntity(dto, SchedulerConfig.class);
			entity.setJob(job);
			entity.setActive("Y");
			schedulerConfigRepository.save(entity);
		}

	}

	@Scheduled(initialDelay = 60000,fixedRate = 1800000) //Runs every 30 mins
	//@Scheduled(cron="30 * * * * ?") //Test to run every 30 seconds
	public void runDailyTask() {
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.HOUR_OF_DAY,0);
		cal.set(Calendar.MINUTE,0);
		List<SchedulerConfig> dailyTasks = schedulerConfigRepository.getDailyTask(cal.getTime());
		log.debug("Found {} Daily Tasks", dailyTasks.size());

		if(CollectionUtils.isNotEmpty(dailyTasks)) {
			for (SchedulerConfig dailyTask : dailyTasks) {
				try {
					boolean shouldProcess = true;
					if(dailyTask.isScheduleDailyExcludeWeekend()) {
						Calendar today = Calendar.getInstance();

						if(today.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY
								|| today.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY) {
							shouldProcess = false;
						}
					}
					if(shouldProcess) {
						processDailyTasks(dailyTask);
					}
				} catch (Exception ex) {
					log.warn("Failed to create JOB ", ex);
				}
			}
			schedulerConfigRepository.save(dailyTasks);
		}
	}

	@Scheduled(initialDelay = 60000, fixedRate = 1800000) //Runs every day at 00:00
	//@Scheduled(cron="30 * * * * ?") //Test to run every 30 seconds
	public void runWeeklyTask() {
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.HOUR_OF_DAY,0);
		cal.set(Calendar.MINUTE,0);
		List<SchedulerConfig> weeklyTasks = schedulerConfigRepository.getWeeklyTask(cal.getTime());
		log.debug("Found {} Weekly Tasks", weeklyTasks.size());

		if(CollectionUtils.isNotEmpty(weeklyTasks)) {
			for (SchedulerConfig weeklyTask : weeklyTasks) {
				try {
					boolean shouldProcess = false;
					Calendar today = Calendar.getInstance();
					switch(today.get(Calendar.DAY_OF_WEEK)) {

						case Calendar.SUNDAY:
							shouldProcess = weeklyTask.isScheduleWeeklySunday();
							break;
						case Calendar.MONDAY:
							shouldProcess = weeklyTask.isScheduleWeeklyMonday();
							break;
						case Calendar.TUESDAY:
							shouldProcess = weeklyTask.isScheduleWeeklyTuesday();
							break;
						case Calendar.WEDNESDAY:
							shouldProcess = weeklyTask.isScheduleWeeklyWednesday();
							break;
						case Calendar.THURSDAY:
							shouldProcess = weeklyTask.isScheduleWeeklyThursday();
							break;
						case Calendar.FRIDAY:
							shouldProcess = weeklyTask.isScheduleWeeklyFriday();
							break;
						case Calendar.SATURDAY:
							shouldProcess = weeklyTask.isScheduleWeeklySaturday();
							break;
						default:
							shouldProcess = false;
					}
					if(shouldProcess) {
						processWeeklyTasks(weeklyTask);
					}
				} catch (Exception ex) {
					log.warn("Failed to create JOB ", ex);
				}

			}
			schedulerConfigRepository.save(weeklyTasks);
		}
	}

	@Scheduled(initialDelay = 60000,fixedRate = 900000) //Runs every 5 mins
	public void overDueTaskCheck() {
		Calendar cal = Calendar.getInstance();
		List<Job> overDueJobs = jobRepository.findOverdueJobsByStatusAndEndDateTime(cal.getTime());
		List<JobDTO> jobs = new ArrayList<JobDTO>();
		for(Job job : overDueJobs) {
			jobs.add(mapperUtil.toModel(job, JobDTO.class));
		}
		log.debug("Found {} overdue jobs", (overDueJobs != null ? overDueJobs.size() : 0));

		if(CollectionUtils.isNotEmpty(overDueJobs)) {
			ExportResult exportResult = new ExportResult();
			exportResult = exportUtil.writeJobReportToFile(jobs, null, exportResult);
			for (Job job : overDueJobs) {
				try {
					if(!job.isOverDueEmailAlert()) {
						List<Employee> employees = job.getSite().getEmployees();
						for(Employee emp : employees) {
							User user = emp.getUser();
							if(user != null) {
								mailService.sendOverdueJobAlert(user, job.getSite().getName(), job.getId(), job.getTitle(), exportResult.getFile());
							}
						}
						job.setOverDueEmailAlert(true);
						jobRepository.save(job);
					}
				} catch (Exception ex) {
					log.warn("Failed to create JOB ", ex);
				}
			}
		}
	}
	
	@Scheduled(cron="0 0 0 1/1 * ?") //Test to run every 30 seconds
	public void attendanceCheckOutTask() {
		Calendar startCal = Calendar.getInstance();
		startCal.set(Calendar.HOUR_OF_DAY,0);
		startCal.set(Calendar.MINUTE,0);
		Calendar endCal = Calendar.getInstance();
		endCal.set(Calendar.HOUR_OF_DAY,23);
		endCal.set(Calendar.MINUTE,59);
		java.sql.Date startDate = new java.sql.Date(startCal.getTimeInMillis());
		java.sql.Date endDate = new java.sql.Date(endCal.getTimeInMillis());
		List<Attendance> dailyAttnList = attendanceRepository.findByCheckInDate(startDate, endDate);
		log.debug("Found {} Daily Attendance", dailyAttnList.size());

		if(CollectionUtils.isNotEmpty(dailyAttnList)) {
			for (Attendance dailyAttn : dailyAttnList) {
				try {
					if(dailyAttn.getCheckOutTime() == null) {
						java.sql.Timestamp endTime = new Timestamp(endCal.getTimeInMillis());
						dailyAttn.setCheckOutTime(endTime);
						attendanceRepository.save(dailyAttn);
					}
				} catch (Exception ex) {
					log.warn("Failed to checkout daily attendance  ", ex);
				}
			}
		}
	}

	private void processDailyTasks(SchedulerConfig dailyTask) {
		if ("CREATE_JOB".equals(dailyTask.getType())) {
			jobCreationTask(dailyTask.getData());
			dailyTask.setLastRun(new Date());
		} else {
			log.warn("Unknown scheduler config type job" + dailyTask);
		}
	}

	private void processWeeklyTasks(SchedulerConfig weeklyTask) {
		if ("CREATE_JOB".equals(weeklyTask.getType())) {

			jobCreationTask(weeklyTask.getData());
			weeklyTask.setLastRun(new Date());
		} else {
			log.warn("Unknown scheduler config type job" + weeklyTask);
		}
	}

	private void jobCreationTask(String data){
		log.debug("Creating Job : "+data);
		Map<String, String> dataMap = Splitter.on("&").withKeyValueSeparator("=").split(data);
		String sTime = dataMap.get("plannedStartTime");
		String eTime = dataMap.get("plannedEndTime");
		SimpleDateFormat sdf = new SimpleDateFormat("E MMM d HH:mm:ss z yyyy");
		try {
			Date sHrs = sdf.parse(sTime);
			Date eHrs = sdf.parse(eTime);
			createJob(dataMap, eHrs, sHrs, eHrs);
		}catch(Exception e) {
			log.error("Error while creating scheduled job ",e);
		}
	}

	private JobDTO createJob(Map<String,String> dataMap, Date plannedEndTime, Date sHrs, Date eHrs) {
		JobDTO job = new JobDTO();
		job.setTitle(dataMap.get("title"));
		job.setDescription(dataMap.get("description"));
		job.setSiteId(Long.parseLong(dataMap.get("siteId")));
		job.setEmployeeId(Long.parseLong(dataMap.get("empId")));
		String frequency = dataMap.containsKey("frequency") ? dataMap.get("frequency") : null;
		String plannedHours = dataMap.get("plannedHours");
		Calendar plannedEndTimeCal = Calendar.getInstance();
		plannedEndTimeCal.setTime(plannedEndTime);

		Calendar startTime = Calendar.getInstance();
		Calendar endTime = Calendar.getInstance();
		Calendar cal = DateUtils.toCalendar(sHrs);
		int sHr = cal.get(Calendar.HOUR_OF_DAY);
		int sMin = cal.get(Calendar.MINUTE);
		log.debug("Start time hours ="+ sHr +", start time mins -"+ sMin);
		startTime.set(Calendar.HOUR_OF_DAY, sHr);
		startTime.set(Calendar.MINUTE, sMin);
		cal = DateUtils.toCalendar(eHrs);
		int eHr = cal.get(Calendar.HOUR_OF_DAY);
		int eMin = cal.get(Calendar.MINUTE);
		log.debug("End time hours ="+ eHr +", end time mins -"+ eMin);
		if(StringUtils.isNotEmpty(frequency) &&
				frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_HOUR)) {
			endTime.set(Calendar.HOUR_OF_DAY, startTime.get(Calendar.HOUR_OF_DAY));
			endTime.add(Calendar.HOUR_OF_DAY, 1);
			endTime.set(Calendar.MINUTE, eMin);
		}else {
			endTime.set(Calendar.HOUR_OF_DAY, eHr);
			endTime.set(Calendar.MINUTE, eMin);
		}

		job.setPlannedStartTime(startTime.getTime());
		job.setPlannedEndTime(endTime.getTime());
		job.setPlannedHours(Integer.parseInt(plannedHours));
		job.setScheduled(true);
		job.setLocationId(!StringUtils.isEmpty(dataMap.get("location")) ? Long.parseLong(dataMap.get("location")) : 0);
		job.setActive("Y");
		log.debug("JobDTO Details before calling saveJob - " + job);
		jobManagementService.saveJob(job);
		if(StringUtils.isNotEmpty(frequency) &&
				frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_HOUR)) {
			Calendar tmpCal = Calendar.getInstance();
			tmpCal.set(Calendar.HOUR_OF_DAY, plannedEndTimeCal.get(Calendar.HOUR_OF_DAY));
			tmpCal.set(Calendar.MINUTE,plannedEndTimeCal.get(Calendar.MINUTE));
			log.debug("Planned end time cal value = " + tmpCal.getTime());
			log.debug("end time value based on frequency = " + endTime.getTime());
			log.debug("planned end time after endTime " + tmpCal.getTime().after(endTime.getTime()));
			if(tmpCal.getTime().after(endTime.getTime())) {
				tmpCal.setTime(endTime.getTime());
				tmpCal.add(Calendar.HOUR_OF_DAY, 1);
				createJob(dataMap, plannedEndTime, endTime.getTime(), tmpCal.getTime());
			}
		}
		return job;
	}





}
