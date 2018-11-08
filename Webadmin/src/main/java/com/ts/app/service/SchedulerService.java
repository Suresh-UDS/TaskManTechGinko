package com.ts.app.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.base.Splitter;
import com.ts.app.config.Constants;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Asset;
import com.ts.app.domain.Frequency;
import com.ts.app.domain.Job;
import com.ts.app.domain.JobChecklist;
import com.ts.app.domain.Project;
import com.ts.app.domain.SLANotificationLog;
import com.ts.app.domain.SchedulerConfig;
import com.ts.app.domain.Setting;
import com.ts.app.domain.Shift;
import com.ts.app.domain.Site;
import com.ts.app.domain.SlaConfig;
import com.ts.app.domain.SlaEscalationConfig;
import com.ts.app.domain.Ticket;
import com.ts.app.repository.AssetRepository;
import com.ts.app.repository.AttendanceRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.EmployeeShiftRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.ManufacturerRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SLANotificationLogRepository;
import com.ts.app.repository.SchedulerConfigRepository;
import com.ts.app.repository.SettingsRepository;
import com.ts.app.repository.SlaConfigRepository;
import com.ts.app.repository.TicketRepository;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.JobChecklistDTO;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.SchedulerConfigDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;

/**
 * Service class for managing Device information.
 */
@Service
@Transactional
public class SchedulerService extends AbstractService {

	final Logger log = LoggerFactory.getLogger(SchedulerService.class);

	private static final String FREQ_ONCE_EVERY_HOUR = "1H";
	private static final String FREQ_ONCE_EVERY_2_HOUR = "2H";
	private static final String FREQ_ONCE_EVERY_3_HOUR = "3H";
	private static final String FREQ_ONCE_EVERY_4_HOUR = "4H";
	private static final String FREQ_ONCE_EVERY_5_HOUR = "5H";
	private static final String FREQ_ONCE_EVERY_6_HOUR = "6H";

	static final String LINE_SEPARATOR = "      \n\n";

	/*private static final String DAILY = "Daily";
	private static final String WEEKLY = "Weekly";
	private static final String MONTHLY = "Monthly";*/

	@Inject ProjectRepository projectRepository;

	@Inject
	private ManufacturerRepository siteRepository;

	@Inject
	private JobManagementService jobManagementService;

	@Inject
	private JobRepository jobRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject MailService mailService;

	@Inject ExportUtil exportUtil;

	@Inject
	private SchedulerConfigRepository schedulerConfigRepository;

	@Inject AttendanceRepository attendanceRepository;

	@Inject EmployeeRepository employeeRepository;

	@Inject PushService pushService;

	@Inject SettingsRepository settingRepository;

	@Inject EmployeeShiftRepository empShiftRepo;

	@Inject Environment env;

	@Inject
	@Lazy
	public SchedulerHelperService schedulerHelperService;

	@Inject
	private SlaConfigService slaConfigService;

	@Inject
	private SLANotificationLogRepository slaNotificationLogRepository;

	@Inject
	private TicketRepository ticketRepository;

	@Inject
	private SlaConfigRepository slaConfigRepository;

	@Inject
	private AssetRepository assetRepository;


	public SearchResult<SchedulerConfigDTO> getSchedulerConfig() {
		// get all config to show in admin
		List<SchedulerConfig> configs = schedulerConfigRepository.findAll();
		SearchResult<SchedulerConfigDTO> result = new SearchResult<>();
		result.setTransactions(mapperUtil.toModelList(configs, SchedulerConfigDTO.class));
		return result;
	}

	public void deleteCurrentSchedule(long jobId) {
		List<SchedulerConfig> sconfigs = schedulerConfigRepository.findJobSchedule(jobId);
		if (sconfigs != null) {
			for (SchedulerConfig sconfig : sconfigs) {
				sconfig.setActive("N");
				schedulerConfigRepository.save(sconfig);
			}
		}

	}

	public void save(SchedulerConfigDTO dto, Job job) {
		if(dto.getId() != null && dto.getId() > 0){
			log.debug(">>> Schedule Config already created! <<<");
			SchedulerConfig entity =  schedulerConfigRepository.findOne(dto.getId());
			if(entity !=null){
				mapperUtil.toEntity(dto, entity);
				entity = schedulerConfigRepository.save(entity);
				if (entity.getActive().equalsIgnoreCase("no")) { // if the job schedule is de-activated then the remaining jobs to be deleted.
					deleteJobs(entity);
				}
			} else {
				throw new TimesheetException("Scheduler Config not found");
			}

		}else{
			log.debug(">>> Going to create Schedule! <<<");
			SchedulerConfig entity = mapperUtil.toEntity(dto, SchedulerConfig.class);
			entity.setJob(job);
			entity.setActive("Y");
			if(dto.getAssetId() > 0) {
				Asset asset = assetRepository.findOne(dto.getAssetId());
				entity.setAsset(asset);
			}else {
				entity.setAsset(null);
			}
			entity = schedulerConfigRepository.save(entity);
			// create jobs based on the creation policy
			createJobs(entity);

			if(log.isDebugEnabled()) {
				log.debug("Saved parent job and scheduler config " + entity);
			}
			//schedulerHelperService.createJobs(entity);
			if(log.isDebugEnabled()) {
				log.debug("Invoked scheduler helper to create child jobs ");
			}

		}

	}

//	@Scheduled(initialDelay = 60000, fixedRate = 1800000) // Runs every 30 mins
	// @Scheduled(cron="30 * * * * ?") //Test to run every 30 seconds
	@Scheduled(cron = "0 0 19 1/1 * ?")
	public void createDailyTask() {
		if (env.getProperty("scheduler.dailyJob.enabled").equalsIgnoreCase("true")) {
            log.debug("Daily jobs enabled");
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DAY_OF_MONTH, 1);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			Calendar endCal = Calendar.getInstance();
			endCal.add(Calendar.DAY_OF_MONTH, 1);
			endCal.set(Calendar.HOUR_OF_DAY, 23);
			endCal.set(Calendar.MINUTE, 59);
            Calendar nextDay = Calendar.getInstance();
            nextDay.add(Calendar.DATE,1);
            nextDay.set(Calendar.HOUR_OF_DAY, 23);
            nextDay.set(Calendar.MINUTE, 59);

			java.sql.Date startDate = new java.sql.Date(cal.getTimeInMillis());
			java.sql.Date endDate = new java.sql.Date(endCal.getTimeInMillis());
			java.sql.Date tomorrow = new java.sql.Date(nextDay.getTimeInMillis());
			createDailyTask(cal.getTime(), null);
		}
	}

	public void createDailyTask(Date date, List<Long> siteIds) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		Calendar endCal = Calendar.getInstance();
		endCal.setTime(date);
		endCal.set(Calendar.HOUR_OF_DAY, 23);
		endCal.set(Calendar.MINUTE, 59);
		java.sql.Date startDate = new java.sql.Date(cal.getTimeInMillis());
		java.sql.Date endDate = new java.sql.Date(endCal.getTimeInMillis());

		List<SchedulerConfig> dailyTasks = null;
		if(CollectionUtils.isNotEmpty(siteIds)) {
			dailyTasks = schedulerConfigRepository.getDailyTask(startDate, siteIds);
		}else {
			dailyTasks = schedulerConfigRepository.getDailyTask(startDate);
		}
		log.debug("Found {} Daily Tasks", dailyTasks.size());
		ExecutorService executorService = Executors.newFixedThreadPool(50); //Executes job creation task for each schedule asynchronously
		List<Future> futures = new ArrayList<Future>();
		if (CollectionUtils.isNotEmpty(dailyTasks)) {
			for (SchedulerConfig dailyTask : dailyTasks) {
				long parentJobId = dailyTask.getJob().getId();
				if(log.isDebugEnabled()) {
					log.debug("Parent job id - "+parentJobId);
					log.debug("Parent job date - "+startDate);
					log.debug("Parent job date - "+endDate);
				}
				JobCreationThread jobThrd = new JobCreationThread(dailyTask, parentJobId, cal, endCal, jobRepository);
				futures.add(executorService.submit(jobThrd));
			}
			for(Future future : futures) {
				try {
					future.get();
				} catch (InterruptedException | ExecutionException e) {
					log.error("Error while running the job creation thread executor task ",e);
				}
			}
			executorService.shutdown();
		}
		schedulerConfigRepository.save(dailyTasks);
	}

	final class JobCreationThread implements Runnable {

		private final Logger logger = LoggerFactory.getLogger(JobCreationThread.class);

		private long parentJobId;
		private Calendar startTimeCal;
		private Calendar endTimeCal;
		private SchedulerConfig schedulerConfig;
		private JobRepository jobRepository;

		public JobCreationThread(SchedulerConfig schConfig, long parentJobId, Calendar startCal, Calendar endCal, JobRepository jobRepo) {
			this.parentJobId = parentJobId;
			this.startTimeCal = startCal;
			this.endTimeCal = endCal;
			this.schedulerConfig = schConfig;
			this.jobRepository = jobRepo;
		}

		@Override
		public void run() {
			if(logger.isDebugEnabled()) {
				logger.debug("Job Creation Thread Started for, parentJobId -" + parentJobId + ", startTimeCal - " + startTimeCal + ", endTimeCal-" + endTimeCal);
			}
			List<Job> job = jobRepository.findJobsByParentJobIdAndDate(parentJobId, DateUtil.convertToSQLDate(startTimeCal.getTime()), DateUtil.convertToSQLDate(endTimeCal.getTime()));
			if (CollectionUtils.isEmpty(job)) {

				 try {
					 boolean shouldProcess = true;
                     if(schedulerConfig.isScheduleDailyExcludeWeekend()) {
                         //if(today.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY || today.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY) {
                        	if(startTimeCal.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY) {
                             shouldProcess =false;
                         }
                     }
                     if(shouldProcess) {
                         createJobs(schedulerConfig);
                     }
				 } catch (Exception ex) {
					 if(logger.isWarnEnabled())
						 logger.warn("Failed to create JOB ", ex);
				 }
			}
			if(logger.isDebugEnabled()) {
				logger.debug("Job Creation Thread Completed for, parentJobId -" + parentJobId + ", startTimeCal - " + startTimeCal + ", endTimeCal-" + endTimeCal);
			}

		}

	}

//	@Scheduled(initialDelay = 60000, fixedRate = 1800000) // Runs every 30 mins
	// @Scheduled(cron="30 * * * * ?") //Test to run every 30 seconds
	@Scheduled(cron = "0 0 19 1/1 * ?")
	public void createWeeklyTask() {
		if (env.getProperty("scheduler.weeklyJob.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.add(Calendar.DAY_OF_MONTH, 1);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			Calendar endCal = Calendar.getInstance();
			endCal.add(Calendar.DAY_OF_MONTH, 1);
			endCal.set(Calendar.HOUR_OF_DAY, 23);
			endCal.set(Calendar.MINUTE, 59);
			//List<SchedulerConfig> weeklyTasks = schedulerConfigRepository.getWeeklyTask(cal.getTime());
			List<SchedulerConfig> weeklyTasks = schedulerConfigRepository.findScheduledTask(DateUtil.convertToSQLDate(cal.getTime()), Frequency.WEEK.getValue());
			log.debug("Found {} Weekly Tasks", weeklyTasks.size());

			if (CollectionUtils.isNotEmpty(weeklyTasks)) {
				for (SchedulerConfig weeklyTask : weeklyTasks) {
					try {
						DateTime dateTime = new DateTime(weeklyTask.getStartDate().getTime());
						int dayOfWeek = dateTime.getDayOfWeek();
						boolean shouldProcess = false;
						Calendar today = Calendar.getInstance();
						switch (today.get(Calendar.DAY_OF_WEEK)) {

							case Calendar.SUNDAY :
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
						if(!shouldProcess) {
							switch (dayOfWeek) {

								case Calendar.SUNDAY :
									shouldProcess = true;
									break;
								case Calendar.MONDAY:
									shouldProcess = true;
									break;
								case Calendar.TUESDAY:
									shouldProcess = true;
									break;
								case Calendar.WEDNESDAY:
									shouldProcess = true;
									break;
								case Calendar.THURSDAY:
									shouldProcess = true;
									break;
								case Calendar.FRIDAY:
									shouldProcess = true;
									break;
								case Calendar.SATURDAY:
									shouldProcess = true;
									break;
								default:
									shouldProcess = false;
							}
						}
						if (shouldProcess) {
							long parentJobId = weeklyTask.getJob().getId();
							List<Job> job = jobRepository.findJobsByParentJobIdAndDate(parentJobId, DateUtil.convertToSQLDate(cal.getTime()), DateUtil.convertToSQLDate(endCal.getTime()));
							if (CollectionUtils.isEmpty(job)) {
								createJobs(weeklyTask);
							}
							// processWeeklyTasks(weeklyTask);
							//schedulerHelperService.createJobs(weeklyTask);
						}
					} catch (Exception ex) {
						log.warn("Failed to create JOB ", ex);
					}

				}
				schedulerConfigRepository.save(weeklyTasks);
			}
		}
	}

//	@Scheduled(initialDelay = 60000, fixedRate = 1800000) // Runs every 30 mins
	// @Scheduled(cron="30 * * * * ?") //Test to run every 30 seconds
	@Scheduled(cron = "0 0 19 1/1 * ?")
	public void createMonthlyTask() {
		if (env.getProperty("scheduler.monthlyJob.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.add(Calendar.DAY_OF_MONTH, 1);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			Calendar endCal = Calendar.getInstance();
			endCal.add(Calendar.DAY_OF_MONTH, 1);
			endCal.set(Calendar.HOUR_OF_DAY, 23);
			endCal.set(Calendar.MINUTE, 59);
			//List<SchedulerConfig> monthlyTasks = schedulerConfigRepository.getMonthlyTask(cal.getTime());
			List<SchedulerConfig> monthlyTasks = schedulerConfigRepository.findScheduledTask(DateUtil.convertToSQLDate(cal.getTime()), Frequency.MONTH.getValue());
			log.debug("Found {} Monthly Tasks", monthlyTasks.size());

			if (CollectionUtils.isNotEmpty(monthlyTasks)) {
				for (SchedulerConfig monthlyTask : monthlyTasks) {
					try {
						DateTime dateTime = new DateTime(monthlyTask.getStartDate());
						int dayOfMonth = dateTime.getDayOfMonth();
						Calendar today = Calendar.getInstance();
						if (today.get(Calendar.DAY_OF_MONTH) == dayOfMonth) {
							long parentJobId = monthlyTask.getJob().getId();
							List<Job> job = jobRepository.findJobsByParentJobIdAndDate(parentJobId, DateUtil.convertToSQLDate(cal.getTime()), DateUtil.convertToSQLDate(endCal.getTime()));
							if (CollectionUtils.isEmpty(job)) {
								createJobs(monthlyTask);
							}
						}
						if (today.get(Calendar.DAY_OF_WEEK) == monthlyTask.getScheduleMonthlyDay()) {
							// processMonthlyTasks(monthlyTask);
							//schedulerHelperService.createJobs(monthlyTask);
						}
					} catch (Exception ex) {
						log.warn("Failed to create JOB ", ex);
					}

				}
				schedulerConfigRepository.save(monthlyTasks);
			}
		}
	}

	@Scheduled(cron = "0 0 19 1/1 * ?")
	public void createFortnightlyTask() {
		if (env.getProperty("scheduler.fortnightlyJob.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.add(Calendar.DAY_OF_MONTH, 1);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			Calendar endCal = Calendar.getInstance();
			endCal.add(Calendar.DAY_OF_MONTH, 1);
			endCal.set(Calendar.HOUR_OF_DAY, 23);
			endCal.set(Calendar.MINUTE, 59);
			//List<SchedulerConfig> monthlyTasks = schedulerConfigRepository.getMonthlyTask(cal.getTime());
			List<SchedulerConfig> fortnightlyTasks = schedulerConfigRepository.findScheduledTask(DateUtil.convertToSQLDate(cal.getTime()), Frequency.FORTNIGHT.getValue());
			log.debug("Found {} Monthly Tasks", fortnightlyTasks.size());

			if (CollectionUtils.isNotEmpty(fortnightlyTasks)) {
				for (SchedulerConfig fortnightlyTask : fortnightlyTasks) {
					try {
						long parentJobId = fortnightlyTask.getJob().getId();
						List<Job> job = jobRepository.findJobsByParentJobIdAndDate(parentJobId, DateUtil.convertToSQLDate(cal.getTime()), DateUtil.convertToSQLDate(endCal.getTime()));
						if (CollectionUtils.isEmpty(job)) {
							createJobs(fortnightlyTask);
						}
					} catch (Exception ex) {
						log.warn("Failed to create JOB ", ex);
					}

				}
				schedulerConfigRepository.save(fortnightlyTasks);
			}
		}
	}

	@Scheduled(cron = "0 0 19 1/1 * ?")
	public void createQuarterlyTask() {
		if (env.getProperty("scheduler.quarterlyJob.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.add(Calendar.DAY_OF_MONTH, 1);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			Calendar endCal = Calendar.getInstance();
			endCal.add(Calendar.DAY_OF_MONTH, 1);
			endCal.set(Calendar.HOUR_OF_DAY, 23);
			endCal.set(Calendar.MINUTE, 59);
			List<SchedulerConfig> quarterlyTasks = schedulerConfigRepository.findScheduledTask(DateUtil.convertToSQLDate(cal.getTime()), Frequency.QUARTER.getValue());
			log.debug("Found {} Monthly Tasks", quarterlyTasks.size());

			if (CollectionUtils.isNotEmpty(quarterlyTasks)) {
				for (SchedulerConfig quarterlyTask : quarterlyTasks) {
					try {
						long parentJobId = quarterlyTask.getJob().getId();
						List<Job> job = jobRepository.findJobsByParentJobIdAndDate(parentJobId, DateUtil.convertToSQLDate(cal.getTime()), DateUtil.convertToSQLDate(endCal.getTime()));
						if (CollectionUtils.isEmpty(job)) {
							createJobs(quarterlyTask);
						}
					} catch (Exception ex) {
						log.warn("Failed to create JOB ", ex);
					}

				}
				schedulerConfigRepository.save(quarterlyTasks);
			}
		}
	}

	@Scheduled(cron = "0 0 19 1/1 * ?")
	public void createHalfYearlyTask() {
		if (env.getProperty("scheduler.halfyearlyJob.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.add(Calendar.DAY_OF_MONTH, 1);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			Calendar endCal = Calendar.getInstance();
			endCal.add(Calendar.DAY_OF_MONTH, 1);
			endCal.set(Calendar.HOUR_OF_DAY, 23);
			endCal.set(Calendar.MINUTE, 59);
			List<SchedulerConfig> halfyearlyTasks = schedulerConfigRepository.findScheduledTask(DateUtil.convertToSQLDate(cal.getTime()), Frequency.HALFYEAR.getValue());
			log.debug("Found {} Monthly Tasks", halfyearlyTasks.size());

			if (CollectionUtils.isNotEmpty(halfyearlyTasks)) {
				for (SchedulerConfig halfyearlyTask : halfyearlyTasks) {
					try {
						long parentJobId = halfyearlyTask.getJob().getId();
						List<Job> job = jobRepository.findJobsByParentJobIdAndDate(parentJobId, DateUtil.convertToSQLDate(cal.getTime()), DateUtil.convertToSQLDate(endCal.getTime()));
						if (CollectionUtils.isEmpty(job)) {
							createJobs(halfyearlyTask);
						}
					} catch (Exception ex) {
						log.warn("Failed to create JOB ", ex);
					}

				}
				schedulerConfigRepository.save(halfyearlyTasks);
			}
		}
	}

	@Scheduled(cron = "0 0 19 1/1 * ?")
	public void createYearlyTask() {
		if (env.getProperty("scheduler.yearlyJob.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.add(Calendar.DAY_OF_MONTH, 1);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			Calendar endCal = Calendar.getInstance();
			endCal.add(Calendar.DAY_OF_MONTH, 1);
			endCal.set(Calendar.HOUR_OF_DAY, 23);
			endCal.set(Calendar.MINUTE, 59);
			List<SchedulerConfig> yearlyTasks = schedulerConfigRepository.findScheduledTask(DateUtil.convertToSQLDate(cal.getTime()), Frequency.YEAR.getValue());
			log.debug("Found {} Monthly Tasks", yearlyTasks.size());

			if (CollectionUtils.isNotEmpty(yearlyTasks)) {
				for (SchedulerConfig yearlyTask : yearlyTasks) {
					try {
						long parentJobId = yearlyTask.getJob().getId();
						List<Job> job = jobRepository.findJobsByParentJobIdAndDate(parentJobId, DateUtil.convertToSQLDate(cal.getTime()), DateUtil.convertToSQLDate(endCal.getTime()));
						if (CollectionUtils.isEmpty(job)) {
							createJobs(yearlyTask);
						}
					} catch (Exception ex) {
						log.warn("Failed to create JOB ", ex);
					}

				}
				schedulerConfigRepository.save(yearlyTasks);
			}
		}
	}

	@Scheduled(initialDelay = 60000, fixedRate = 900000) // Runs every 15 mins
	public void overDueTaskCheck() {
		schedulerHelperService.overdueJobReport();
	}

	//@Scheduled(initialDelay = 60000,fixedRate = 900000) //Runs every 15 mins
	//@Scheduled(cron = "0 0 19 1/1 * ?")
	public void endOfDayReportSchedule() {


	}

	// @Scheduled(cron="0 0 10 1/1 * ?")
	// @Scheduled(cron="0 0 20 1/1 * ?")
	// @Scheduled(initialDelay = 60000,fixedRate = 3600000) //run every 1 hr to
	// generate consolidated report.
	// @Scheduled(initialDelay = 60000,fixedRate = 300000) //run every 5 mins for
	// testing
	//@Scheduled(cron = "0 0 0/1 * * ?")
	@Transactional
	public void attendanceReportSchedule() {
		if (env.getProperty("scheduler.attendanceDetailReport.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			Calendar genShiftEnd = Calendar.getInstance();
			genShiftEnd.set(Calendar.HOUR_OF_DAY, 23);
			genShiftEnd.set(Calendar.MINUTE, 59);
			List<Project> projects = projectRepository.findAll();
			for (Project proj : projects) {
				SearchCriteria sc = new SearchCriteria();
				sc.setCheckInDateTimeFrom(cal.getTime());
				sc.setCheckInDateTimeTo(cal.getTime());
				sc.setProjectId(proj.getId());
				// SearchResult<AttendanceDTO> searchResults =
				// attendanceService.findBySearchCrieria(sc);
				Set<Site> sites = proj.getSite();
				Iterator<Site> siteItr = sites.iterator();
				while (siteItr.hasNext()) {
					Site site = siteItr.next();
					List<Setting> settings = settingRepository.findSettingByKeyAndSiteIdOrProjectId(SettingsService.EMAIL_NOTIFICATION_SHIFTWISE_ATTENDANCE, site.getId(), proj.getId());
					Setting attendanceReports = null;
					if (CollectionUtils.isNotEmpty(settings)) {
						attendanceReports = settings.get(0);
					}
					if (attendanceReports != null && attendanceReports.getSettingValue().equalsIgnoreCase("true")) {
						settings = settingRepository.findSettingByKeyAndSiteIdOrProjectId(SettingsService.EMAIL_NOTIFICATION_SHIFTWISE_ATTENDANCE_EMAILS, site.getId(), proj.getId());
						Setting attendanceReportEmails = null;
						if (CollectionUtils.isNotEmpty(settings)) {
							attendanceReportEmails = settings.get(0);
						}
						if (CollectionUtils.isNotEmpty(site.getShifts())) {
							List<Shift> shifts = site.getShifts();
							for (Shift shift : shifts) {
								String startTime = shift.getStartTime();
								String[] startTimeUnits = startTime.split(":");
								Calendar startCal = Calendar.getInstance();
								startCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTimeUnits[0]));
								startCal.set(Calendar.MINUTE, Integer.parseInt(startTimeUnits[1]));
								startCal.set(Calendar.SECOND, 0);
								startCal.set(Calendar.MILLISECOND, 0);
								String endTime = shift.getEndTime();
								String[] endTimeUnits = endTime.split(":");
								Calendar endCal = Calendar.getInstance();
								endCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(endTimeUnits[0]));
								endCal.set(Calendar.MINUTE, Integer.parseInt(endTimeUnits[1]));
								endCal.set(Calendar.SECOND, 0);
								endCal.set(Calendar.MILLISECOND, 0);
								Calendar currCal = Calendar.getInstance();
								// currCal.add(Calendar.HOUR_OF_DAY, 1);
								long timeDiff = currCal.getTimeInMillis() - startCal.getTimeInMillis();
								if (timeDiff >= 3600000 && timeDiff < 7200000) { // within 2 hours of the shift start timing.
									// long empCntInShift =
									// employeeRepository.findEmployeeCountBySiteAndShift(site.getId(),
									// shift.getStartTime(), shift.getEndTime());
									long empCntInShift = empShiftRepo.findEmployeeCountBySiteAndShift(site.getId(), DateUtil.convertToSQLDate(startCal.getTime()),
											DateUtil.convertToSQLDate(endCal.getTime()));
									if (empCntInShift == 0) {
										empCntInShift = employeeRepository.findCountBySiteId(site.getId());
									}

									long attendanceCount = attendanceRepository.findCountBySiteAndCheckInTime(site.getId(), DateUtil.convertToSQLDate(startCal.getTime()),
											DateUtil.convertToSQLDate(endCal.getTime()));
									// List<EmployeeAttendanceReport> empAttnList =
									// attendanceRepository.findBySiteId(site.getId(),
									// DateUtil.convertToSQLDate(cal.getTime()),
									// DateUtil.convertToSQLDate(cal.getTime()));
									long absentCount = empCntInShift - attendanceCount;
									log.debug("send consolidated report");

									// ExportResult exportResult = new ExportResult();
									// exportResult = exportUtil.writeAttendanceReportToFile(proj.getName(),
									// empAttnList, null, exportResult);
									// send reports in email.
									if (attendanceReportEmails != null && empCntInShift > 0) {
										StringBuilder content = new StringBuilder("Site Name - " + site.getName() + Constants.LINE_SEPARATOR);
										content.append("Shift - " + shift.getStartTime() + " - " + shift.getEndTime() + Constants.LINE_SEPARATOR);
										content.append("Total employees - " + empCntInShift + Constants.LINE_SEPARATOR);
										content.append("Present - " + attendanceCount + Constants.LINE_SEPARATOR);
										content.append("Absent - " + absentCount + Constants.LINE_SEPARATOR);
										// mailService.sendJobReportEmailFile(attendanceReportEmails.getSettingValue(),
										// exportResult.getFile(), null, cal.getTime());
										mailService.sendAttendanceConsolidatedReportEmail(site.getName(), attendanceReportEmails.getSettingValue(), content.toString(), null,
												cal.getTime());
									}
								}
							}
						} else {
							long empCntInShift = employeeRepository.findCountBySiteId(site.getId());
							long attendanceCount = attendanceRepository.findCountBySiteAndCheckInTime(site.getId(), DateUtil.convertToSQLDate(cal.getTime()),
									DateUtil.convertToSQLDate(genShiftEnd.getTime()));
							long absentCount = empCntInShift - attendanceCount;
							if (attendanceReportEmails != null && empCntInShift > 0) {
								StringBuilder content = new StringBuilder("Site Name - " + site.getName() + Constants.LINE_SEPARATOR);
								content.append("Shift - General Shift" + Constants.LINE_SEPARATOR);
								content.append("Total employees - " + empCntInShift + Constants.LINE_SEPARATOR);
								content.append("Present - " + attendanceCount + Constants.LINE_SEPARATOR);
								content.append("Absent - " + absentCount + Constants.LINE_SEPARATOR);
								mailService.sendAttendanceConsolidatedReportEmail(site.getName(), attendanceReportEmails.getSettingValue(), content.toString(), null, new Date());
							}
						}
					}
				}
			}
		}
	}

	//@Scheduled(cron = "0 */30 * * * ?")
	public void attendanceShiftReportSchedule() {
		Calendar cal = Calendar.getInstance();
		schedulerHelperService.generateDetailedAttendanceReport(cal.getTime(), true, false, false);
	}


	//@Scheduled(cron = "0 */30 * 1/1 * ?") // send detailed attendance report
	public void attendanceDetailReportSchedule() {
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DAY_OF_YEAR, -1);
		schedulerHelperService.generateDetailedAttendanceReport(cal.getTime(), false, true, false);
	}

	//@Scheduled(cron = "0 0 9 1 * ?")
	//@Scheduled(cron = "0 */30 * 1/1 * ?") // send detailed attendance report
	public void attendanceMusterrollReportSchedule() {
		Calendar startCal = Calendar.getInstance();
		startCal.set(Calendar.DAY_OF_MONTH, 1);
		startCal.set(Calendar.HOUR_OF_DAY,0);
		startCal.set(Calendar.MINUTE,0);
		Calendar endCal = Calendar.getInstance();
		endCal.set(Calendar.HOUR_OF_DAY,23);
		endCal.set(Calendar.MINUTE,59);
		endCal.set(Calendar.DAY_OF_MONTH, endCal.getActualMaximum(Calendar.DAY_OF_MONTH));
		long siteId = 0;
		schedulerHelperService.generateMusterRollAttendanceReport(siteId, startCal.getTime(), endCal.getTime(), true, false);
	}

	//@Scheduled(cron="0 */30 * * * ?") // runs every 30 mins
	public void attendanceCheckOutTask() {
		schedulerHelperService.autoCheckOutAttendance();
	}

	//@Scheduled(cron="0 0 9 * * ?")
	public void warrantyExpireAlert() {
		schedulerHelperService.sendWarrantyExpireAlert();
		schedulerHelperService.sendSchedulePPMJobsAlert();
		schedulerHelperService.sendScheduleAMCJobsAlert();
	}

	//@Scheduled(cron="0 */30 * * * ?") // runs every 30 mins
	public void feedbackDetailReportSchedule() {
		Calendar cal = Calendar.getInstance();
		//cal.add(Calendar.DAY_OF_YEAR, -1);
		schedulerHelperService.feedbackDetailedReport();
	}

	public void createJobs(SchedulerConfig scheduledTask) {
		if ("CREATE_JOB".equals(scheduledTask.getType())) {
			String creationPolicy = env.getProperty("scheduler.job.creationPolicy");
			PageRequest pageRequest = new PageRequest(1, 1);
			Job parentJob = scheduledTask.getJob();
			List<Job> prevJobs = jobRepository.findLastJobByParentJobId(parentJob.getId(), pageRequest);
			DateTime today = DateTime.now();
			today = today.withHourOfDay(0); //set today's hour to 0
			Calendar scheduledEndDate = Calendar.getInstance();
			if(parentJob.getScheduleEndDate() != null) {
				scheduledEndDate.setTime(parentJob.getScheduleEndDate());
				scheduledEndDate.set(Calendar.HOUR_OF_DAY, 23);
				scheduledEndDate.set(Calendar.MINUTE, 59);
			}
			DateTime endDate = DateTime.now().withYear(scheduledEndDate.get(Calendar.YEAR)).withMonthOfYear(scheduledEndDate.get(Calendar.MONTH) + 1)
					.withDayOfMonth(scheduledEndDate.get(Calendar.DAY_OF_MONTH)).withHourOfDay(scheduledEndDate.get(Calendar.HOUR_OF_DAY)).withMinuteOfHour(scheduledEndDate.get(Calendar.MINUTE));
			List<JobDTO> jobDtos = new ArrayList<JobDTO>();
			//change the creationPolicy based on the frequency
			Map<String, String> dataMap = Splitter.on("&").withKeyValueSeparator("=").split(scheduledTask.getData());
			if(dataMap != null && dataMap.containsKey("frequency")
					&& (dataMap.get("frequency").equals(FREQ_ONCE_EVERY_HOUR) || dataMap.get("frequency").equals(FREQ_ONCE_EVERY_2_HOUR) ||
							dataMap.get("frequency").equals(FREQ_ONCE_EVERY_3_HOUR) || dataMap.get("frequency").equals(FREQ_ONCE_EVERY_4_HOUR) ||
							dataMap.get("frequency").equals(FREQ_ONCE_EVERY_5_HOUR) || dataMap.get("frequency").equals(FREQ_ONCE_EVERY_6_HOUR))) {
				creationPolicy = "daily";
			}
			if (creationPolicy.equalsIgnoreCase("monthly")) { // if the creation policy is set to monthly, create jobs for the rest of the
																// month
				DateTime currDate = DateTime.now();
				DateTime lastDate = currDate.dayOfMonth().withMaximumValue().withHourOfDay(23).withMinuteOfHour(59);

				if(endDate.isBefore(lastDate)) {
					lastDate = lastDate.withMonthOfYear(scheduledEndDate.get(Calendar.MONTH) + 1);
					lastDate = lastDate.withDayOfMonth(scheduledEndDate.get(Calendar.DAY_OF_MONTH));
				}

				if(CollectionUtils.isNotEmpty(prevJobs)) {
					Job prevJob = prevJobs.get(0);
					currDate = addDays(currDate, scheduledTask.getSchedule(), scheduledTask.getData());
					if(prevJob.getPlannedStartTime().before(currDate.toDate())){
						while ((currDate.isBefore(lastDate) || currDate.isEqual(lastDate))) { //create task for future dates.
							if(currDate.isAfter(today)) {
								jobCreationTask(scheduledTask, scheduledTask.getJob(), scheduledTask.getData(), currDate.toDate(), jobDtos);
							}
							currDate = addDays(currDate, scheduledTask.getSchedule(), scheduledTask.getData());
						}
						if(CollectionUtils.isNotEmpty(jobDtos)) {
							jobManagementService.saveScheduledJob(jobDtos);
						}
					}
				}else {
					currDate = new DateTime(parentJob.getPlannedStartTime().getTime());
					while ((currDate.isBefore(lastDate) || currDate.isEqual(lastDate))) { // create task for future dates.
						if(currDate.isAfter(today) || currDate.isEqual(today)) {
							jobCreationTask(scheduledTask, scheduledTask.getJob(), scheduledTask.getData(), currDate.toDate(), jobDtos);
						}
						currDate = addDays(currDate, scheduledTask.getSchedule(), scheduledTask.getData());
					}
					if(CollectionUtils.isNotEmpty(jobDtos)) {
						jobManagementService.saveScheduledJob(jobDtos);
					}
				}
			} else if (creationPolicy.equalsIgnoreCase("daily")) {
				DateTime currDate = DateTime.now();
				if(CollectionUtils.isNotEmpty(prevJobs)) {
					Job prevJob = prevJobs.get(0);
					currDate = addDays(currDate, scheduledTask.getSchedule(), scheduledTask.getData());
					if(prevJob.getPlannedStartTime().before(currDate.toDate())){
						if(currDate.isAfter(today) && currDate.isBefore(endDate)) {
							jobCreationTask(scheduledTask, scheduledTask.getJob(), scheduledTask.getData(), currDate.toDate(), jobDtos);
							if(CollectionUtils.isNotEmpty(jobDtos)) {
								jobManagementService.saveScheduledJob(jobDtos);
							}
						}
					}
				}else {
					//currDate = new DateTime(parentJob.getPlannedStartTime().getTime());
					if((currDate.isAfter(today) || currDate.isEqual(today)) && currDate.isBefore(endDate)) {
						jobCreationTask(scheduledTask, scheduledTask.getJob(), scheduledTask.getData(), currDate.toDate(), jobDtos);
						if(CollectionUtils.isNotEmpty(jobDtos)) {
							jobManagementService.saveScheduledJob(jobDtos);
						}
					}
				}
			}
		}
	}

	/*public void createJobsOld(SchedulerConfig dailyTask) {
		if ("CREATE_JOB".equals(dailyTask.getType())) {
			if (dailyTask.getSchedule().equalsIgnoreCase(Frequency.DAY.getTypeFrequency())) {
				String creationPolicy = env.getProperty("scheduler.dailyJob.creation");
				PageRequest pageRequest = new PageRequest(1, 1);
				Job parentJob = dailyTask.getJob();
				List<Job> prevJobs = jobRepository.findLastJobByParentJobId(parentJob.getId(), pageRequest);
				if (creationPolicy.equalsIgnoreCase("monthly")) { // if the creation policy is set to monthly, create jobs for the rest of the
																	// month
					DateTime currDate = DateTime.now();
					DateTime lastDate = currDate.dayOfMonth().withMaximumValue();
					if(CollectionUtils.isNotEmpty(prevJobs)) {
						Job prevJob = prevJobs.get(0);
						currDate = addDays(currDate, dailyTask.getSchedule());
						if(prevJob.getPlannedStartTime().before(currDate.toDate())){
							while (currDate.isBefore(lastDate) || currDate.isEqual(lastDate)) {
								jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), currDate.toDate());
								currDate = addDays(currDate, dailyTask.getSchedule());
							}
						}
					}else {
						currDate = new DateTime(parentJob.getPlannedStartTime().getTime());
						while (currDate.isBefore(lastDate) || currDate.isEqual(lastDate)) {
							jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), currDate.toDate());
							currDate = addDays(currDate, dailyTask.getSchedule());
						}
					}
				} else if (creationPolicy.equalsIgnoreCase("daily")) {
					DateTime currDate = DateTime.now();
					if(CollectionUtils.isNotEmpty(prevJobs)) {
						Job prevJob = prevJobs.get(0);
						currDate = addDays(currDate, dailyTask.getSchedule());
						if(prevJob.getPlannedStartTime().before(currDate.toDate())){
							jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), currDate.toDate());
						}
					}else {
						currDate = new DateTime(parentJob.getPlannedStartTime().getTime());
						jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), currDate.toDate());
					}
				}
				// dailyTask.setLastRun(new Date());
			} else if (dailyTask.getSchedule().equalsIgnoreCase(Frequency.WEEK.getTypeFrequency())) {
				String creationPolicy = env.getProperty("scheduler.weeklyJob.creation");
				if (creationPolicy.equalsIgnoreCase("monthly")) { // if the creation policy is set to monthly, create jobs for the rest of the
																	// month
					PageRequest pageRequest = new PageRequest(1, 1);
					List<Job> prevJobs = jobRepository.findLastJobByParentJobId(dailyTask.getJob().getId(), pageRequest);
					DateTime currDate = DateTime.now();
					if (CollectionUtils.isNotEmpty(prevJobs)) {
						Job prevJob = prevJobs.get(0);
						if (prevJob.getPlannedStartTime().before(currDate.toDate())) {
							DateTime lastDate = currDate.dayOfMonth().withMaximumValue();
							currDate = currDate.plusDays(7);
							while (currDate.isBefore(lastDate) || currDate.isEqual(lastDate)) {
								jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), currDate.toDate());
								dailyTask.setLastRun(currDate.toDate());
								currDate = currDate.plusDays(7); // create for every week.
							}
						}
					}
				}
			} else if (dailyTask.getSchedule().equalsIgnoreCase(Frequency.MONTH.getTypeFrequency())) {
				String creationPolicy = env.getProperty("scheduler.monthlyJob.creation");
				if (creationPolicy.equalsIgnoreCase("yearly")) { // if the creation policy is set to monthly, create jobs for the rest of the
																	// month
					PageRequest pageRequest = new PageRequest(1, 1);
					List<Job> prevJobs = jobRepository.findLastJobByParentJobId(dailyTask.getJob().getId(), pageRequest);
					DateTime currDate = DateTime.now();
					if (CollectionUtils.isNotEmpty(prevJobs)) {
						Job prevJob = prevJobs.get(0);
						if (prevJob.getPlannedStartTime().before(currDate.toDate())) {
							DateTime lastDate = currDate.dayOfMonth().withMaximumValue();
							currDate = currDate.plusDays(currDate.dayOfMonth().getMaximumValue());
							while (currDate.isBefore(lastDate) || currDate.isEqual(lastDate)) {
								jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), currDate.toDate());
								dailyTask.setLastRun(currDate.toDate());
								currDate = currDate.plusDays(currDate.dayOfMonth().getMaximumValue()); // create for every month.
							}
						}
					}
				}
			}else if(dailyTask.getSchedule().equalsIgnoreCase(Frequency.valueOf("YEAR").getTypeFrequency())) {
				log.debug(">>> Yearly <<<");
				String creationPolicy = env.getProperty("scheduler.yearlyJob.creation");
				if(creationPolicy.equalsIgnoreCase("daily")) { //if the creation policy is set to daily, create jobs for the rest of the month
					PageRequest pageRequest = new PageRequest(1, 1);
					List<Job> prevJobs = jobRepository.findLastJobByParentJobId(dailyTask.getJob().getId(), pageRequest);
					DateTime currDate = DateTime.now();
					if(CollectionUtils.isNotEmpty(prevJobs)) {
						Job prevJob = prevJobs.get(0);
						if(prevJob.getPlannedStartTime().before(currDate.toDate())) {
					        DateTime lastDate = currDate.dayOfYear().withMaximumValue();
					        currDate = currDate.plusDays(currDate.dayOfYear().getMaximumValue());
							while(currDate.isBefore(lastDate) || currDate.isEqual(lastDate)) {
								jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), currDate.toDate());
								dailyTask.setLastRun(currDate.toDate());
								currDate = currDate.plusDays(currDate.dayOfMonth().getMaximumValue()); //create for every month.
							}
						}
					}
				}
			}else if(dailyTask.getSchedule().equalsIgnoreCase(Frequency.valueOf("FORTNIGHT").getTypeFrequency())) {
				log.debug(">>> Fortnightly <<<");
				String creationPolicy = env.getProperty("scheduler.fornightlyJob.creation");
				if(creationPolicy.equalsIgnoreCase("daily")) { //if the creation policy is set to daily, create jobs for the rest of the month
					PageRequest pageRequest = new PageRequest(1, 1);
					List<Job> prevJobs = jobRepository.findLastJobByParentJobId(dailyTask.getJob().getId(), pageRequest);
					DateTime currDate = DateTime.now();
					if(CollectionUtils.isNotEmpty(prevJobs)) {
						Job prevJob = prevJobs.get(0);
						if(prevJob.getPlannedStartTime().before(currDate.toDate())) {
					        DateTime lastDate = currDate.dayOfMonth().withMaximumValue();
					        currDate = currDate.plusDays(14);
					        while (currDate.isBefore(lastDate) || currDate.isEqual(lastDate)) {
								jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), currDate.toDate());
								dailyTask.setLastRun(currDate.toDate());
								currDate = currDate.plusDays(14); // create for every 2 week.
							}
						}
					}
				}
			}
		} else if (dailyTask.getSchedule().equalsIgnoreCase(Frequency.valueOf("HALFYEAR").getTypeFrequency())) {
			String creationPolicy = env.getProperty("scheduler.halfyearlyJob.creation");
			if (creationPolicy.equalsIgnoreCase("yearly")) { // if the creation policy is set to yearly, create jobs for the rest of the
																// 6 month
				PageRequest pageRequest = new PageRequest(1, 1);
				List<Job> prevJobs = jobRepository.findLastJobByParentJobId(dailyTask.getJob().getId(), pageRequest);
				DateTime currDate = DateTime.now();
				if (CollectionUtils.isNotEmpty(prevJobs)) {
					Job prevJob = prevJobs.get(0);
					if (prevJob.getPlannedStartTime().before(currDate.toDate())) {
						DateTime lastDate = currDate.plusMonths(6).toDateTime();
						currDate = currDate.dayOfMonth().getDateTime();
						while (currDate.isBefore(lastDate) || currDate.isEqual(lastDate)) {
							jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), currDate.toDate());
							dailyTask.setLastRun(currDate.toDate());
							currDate = currDate.plusMonths(6); // create for every 6 month.
						}
					}
				}
			}
		} else {
			log.warn("Unknown scheduler config type job" + dailyTask);
		}
	}*/


	private DateTime addDays(DateTime dateTime , String scheduleType, String data) {
		Frequency frequency = Frequency.fromValue(scheduleType);
		Map<String, String> dataMap = Splitter.on("&").withKeyValueSeparator("=").split(data);
		int duration = 1;
		if(dataMap.get("duration") != null) {
			duration = Integer.parseInt(dataMap.get("duration"));
		}

		switch(frequency) {
			case HOUR :
				dateTime = dateTime.plusHours(1 * duration);
				break;
			case DAY :
				dateTime = dateTime.plusDays(1 * duration);
				break;
			case WEEK :
				dateTime = dateTime.plusWeeks(1 * duration);
				break;
			case FORTNIGHT :
				dateTime = dateTime.plusDays(14 * duration);
				break;
			case MONTH :
				dateTime = dateTime.plusMonths(1 * duration);
				break;
			case YEAR :
				dateTime = dateTime.plusYears(1 * duration);
				break;
			case HALFYEAR :
				dateTime = dateTime.plusMonths(6 * duration);
				break;
			case QUARTER :
				dateTime = dateTime.plusMonths(3 * duration);
				break;
			default:

		}
		return dateTime;
	}


	public void deleteJobs(SchedulerConfig dailyTask) {
		if ("CREATE_JOB".equals(dailyTask.getType())) {
			String creationPolicy = env.getProperty("scheduler.dailyJob.creation");
			if (creationPolicy.equalsIgnoreCase("monthly")) { // if the creation policy is set to monthly, create jobs for the rest of the
																// month
				DateTime currDate = DateTime.now();
				DateTime lastDate = currDate.dayOfMonth().withMaximumValue();
				while (currDate.isBefore(lastDate) || currDate.isEqual(lastDate)) {
					jobRepository.deleteScheduledJobs(dailyTask.getJob().getId(), DateUtil.convertToSQLDate(currDate.toDate()), DateUtil.convertToSQLDate(lastDate.toDate()));
					currDate.plusDays(1);
				}
			}
			dailyTask.setLastRun(new Date());
		} else {
			log.warn("Unknown scheduler config type job" + dailyTask);
		}
	}

	private void processDailyTasks(SchedulerConfig dailyTask) {
		if ("CREATE_JOB".equals(dailyTask.getType())) {
			schedulerHelperService.jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), new Date());
			dailyTask.setLastRun(new Date());
		} else {
			log.warn("Unknown scheduler config type job" + dailyTask);
		}
	}

	private void processWeeklyTasks(SchedulerConfig weeklyTask) {
		if ("CREATE_JOB".equals(weeklyTask.getType())) {
			schedulerHelperService.jobCreationTask(weeklyTask, weeklyTask.getJob(), weeklyTask.getData(), new Date());
			weeklyTask.setLastRun(new Date());
		} else {
			log.warn("Unknown scheduler config type job" + weeklyTask);
		}
	}

	private void processMonthlyTasks(SchedulerConfig monthlyTask) {
		if ("CREATE_JOB".equals(monthlyTask.getType())) {

			schedulerHelperService.jobCreationTask(monthlyTask, monthlyTask.getJob(), monthlyTask.getData(), new Date());
			monthlyTask.setLastRun(new Date());
		} else {
			log.warn("Unknown scheduler config type job" + monthlyTask);
		}
	}

	private void jobCreationTask(SchedulerConfig scheduledTask, Job parentJob, String data, Date jobDate, List<JobDTO> jobs) {
		log.debug("Creating Job : " + data);
		Map<String, String> dataMap = Splitter.on("&").withKeyValueSeparator("=").split(data);
		String sTime = dataMap.get("plannedStartTime");
		String eTime = dataMap.get("plannedEndTime");
		SimpleDateFormat sdf = new SimpleDateFormat("E MMM d HH:mm:ss z yyyy");
		try {
			Date sHrs = sdf.parse(sTime);
			Date eHrs = sdf.parse(eTime);

			try {
				boolean shouldProcess = true;
				if (scheduledTask.isScheduleDailyExcludeWeekend()) {
					Calendar today = Calendar.getInstance();
					today.setTime(jobDate);
					//if (today.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY || today.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY) {
					if (today.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY) {
						shouldProcess = false;
					}
				}
				if (shouldProcess) {
					List<Job> job = jobRepository.findJobsByParentJobIdAndDate(parentJob.getId(), DateUtil.convertToSQLDate(jobDate), DateUtil.convertToSQLDate(jobDate));
					if (CollectionUtils.isEmpty(job)) {
						createJob(parentJob, dataMap, jobDate, eHrs, sHrs, eHrs, jobs);
					}
				}
			} catch (Exception ex) {
				log.warn("Failed to create JOB ", ex);
			}

		} catch (Exception e) {
			log.error("Error while creating scheduled job ", e);
		}
	}

	private JobDTO createJob(Job parentJob, Map<String, String> dataMap, Date jobDate, Date plannedEndTime, Date sHrs, Date eHrs, List<JobDTO> jobs) {
		JobDTO job = new JobDTO();
		job.setTitle(dataMap.get("title"));
		job.setDescription(dataMap.get("description"));
		job.setSiteId(Long.parseLong(dataMap.get("siteId")));
		job.setEmployeeId(Long.parseLong(dataMap.get("empId")));
		//job.setSchedule(dataMap.get("schedule"));
		job.setDuration(dataMap.get("duration"));
		String frequency = dataMap.containsKey("frequency") ? dataMap.get("frequency") : null;
		String plannedHours = dataMap.get("plannedHours");
		Calendar plannedEndTimeCal = Calendar.getInstance();
		plannedEndTimeCal.setTime(plannedEndTime);

		Calendar startTime = Calendar.getInstance();
		startTime.setTime(jobDate);
		// update the plannedEndTimeCal to the current job date in iteration
		plannedEndTimeCal.set(Calendar.DAY_OF_MONTH, startTime.get(Calendar.DAY_OF_MONTH));
		plannedEndTimeCal.set(Calendar.MONTH, startTime.get(Calendar.MONTH));

		Calendar endTime = Calendar.getInstance();
		endTime.setTime(jobDate);
		Calendar cal = DateUtils.toCalendar(sHrs);
		int sHr = cal.get(Calendar.HOUR_OF_DAY);
		int sMin = cal.get(Calendar.MINUTE);
		//log.debug("Start time hours =" + sHr + ", start time mins -" + sMin);
		startTime.set(Calendar.HOUR_OF_DAY, sHr);
		startTime.set(Calendar.MINUTE, sMin);
		startTime.set(Calendar.SECOND, 0);
		startTime.getTime(); // to recalculate
		cal = DateUtils.toCalendar(eHrs);
		int eHr = cal.get(Calendar.HOUR_OF_DAY);
		int eMin = cal.get(Calendar.MINUTE);
		//log.debug("End time hours =" + eHr + ", end time mins -" + eMin);
		if (StringUtils.isNotEmpty(frequency)) {
			endTime.set(Calendar.HOUR_OF_DAY, startTime.get(Calendar.HOUR_OF_DAY));
			if(frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_HOUR)) {
				endTime.add(Calendar.HOUR_OF_DAY, 1);
			}else if(frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_2_HOUR)) {
				endTime.add(Calendar.HOUR_OF_DAY, 2);
			}else if(frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_3_HOUR)) {
				endTime.add(Calendar.HOUR_OF_DAY, 3);
			}else if(frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_4_HOUR)) {
				endTime.add(Calendar.HOUR_OF_DAY, 4);
			}else if(frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_5_HOUR)) {
				endTime.add(Calendar.HOUR_OF_DAY, 5);
			}else if(frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_6_HOUR)) {
				endTime.add(Calendar.HOUR_OF_DAY, 6);
			}
			endTime.set(Calendar.MINUTE, eMin);
			endTime.set(Calendar.SECOND, 0);
			endTime.getTime(); // to recalculate
		} else {
			endTime.set(Calendar.HOUR_OF_DAY, eHr);
			endTime.set(Calendar.MINUTE, eMin);
			endTime.set(Calendar.SECOND, 0);
			endTime.getTime(); // to recalculate
		}

		job.setPlannedStartTime(startTime.getTime());
		job.setPlannedEndTime(endTime.getTime());
		job.setPlannedHours(Integer.parseInt(plannedHours));
		job.setScheduled(true);
		job.setJobType(parentJob.getType());
		job.setSchedule("ONCE");
		job.setLocationId(!StringUtils.isEmpty(dataMap.get("location")) ? Long.parseLong(dataMap.get("location")) : 0);
		job.setActive("Y");
		job.setMaintenanceType(parentJob.getMaintenanceType());
		if(parentJob.getAsset() != null) {
			job.setAssetId(parentJob.getAsset().getId());
		}
		job.setParentJobId(parentJob.getId());
		job.setParentJob(parentJob);
		job.setJobType(parentJob.getType());
		job.setZone(parentJob.getZone());
		job.setFloor(parentJob.getFloor());
		job.setBlock(parentJob.getBlock());
		//log.debug("Job status in scheduler {}",job.getJobStatus());
        if(CollectionUtils.isNotEmpty(parentJob.getChecklistItems())) {
            List<JobChecklist> jobclList = parentJob.getChecklistItems();
            List<JobChecklistDTO> checklistItems = new ArrayList<JobChecklistDTO>();
            for(JobChecklist jobcl : jobclList) {
                JobChecklistDTO checklist = new JobChecklistDTO();
                checklist.setChecklistId(String.valueOf(jobcl.getChecklistId()));
                checklist.setChecklistName(jobcl.getChecklistName());
                checklist.setChecklistItemId(String.valueOf(jobcl.getChecklistItemId()));
                checklist.setChecklistItemName(jobcl.getChecklistItemName());
                checklistItems.add(checklist);

            }
            if(job.getChecklistItems() != null) {
                job.getChecklistItems().addAll(checklistItems);
            }else {
                job.setChecklistItems(checklistItems);
            }
        }
		//log.debug("JobDTO parent job id - " + parentJob.getId());
		//log.debug("JobDTO parent job id - " + job.getParentJobId());
		//log.debug("JobDTO Details before calling saveJob - " + job);
		//jobManagementService.saveScheduledJob(job);
		jobs.add(job);
		if (StringUtils.isNotEmpty(frequency)) {
			Calendar tmpCal = Calendar.getInstance();
			tmpCal.set(Calendar.DAY_OF_MONTH, plannedEndTimeCal.get(Calendar.DAY_OF_MONTH));
			tmpCal.set(Calendar.MONTH, plannedEndTimeCal.get(Calendar.MONTH));
			tmpCal.set(Calendar.HOUR_OF_DAY, plannedEndTimeCal.get(Calendar.HOUR_OF_DAY));
			tmpCal.set(Calendar.MINUTE, plannedEndTimeCal.get(Calendar.MINUTE));
			tmpCal.getTime(); // recalculate
			//log.debug("Planned end time cal value = " + tmpCal.getTime());
			//log.debug("end time value based on frequency = " + endTime.getTime());
			//log.debug("planned end time after endTime " + tmpCal.getTime().after(endTime.getTime()));
			if (tmpCal.getTime().after(endTime.getTime())) {
				tmpCal.setTime(endTime.getTime());
				if(frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_HOUR)) {
					tmpCal.add(Calendar.HOUR_OF_DAY, 1);
					tmpCal.getTime(); // recalculate
				}else if(frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_2_HOUR)) {
					tmpCal.add(Calendar.HOUR_OF_DAY, 2);
					tmpCal.getTime(); // recalculate
				}else if(frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_3_HOUR)) {
					tmpCal.add(Calendar.HOUR_OF_DAY, 3);
					tmpCal.getTime(); // recalculate
				}else if(frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_4_HOUR)) {
					tmpCal.add(Calendar.HOUR_OF_DAY, 4);
					tmpCal.getTime(); // recalculate
				}else if(frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_5_HOUR)) {
					tmpCal.add(Calendar.HOUR_OF_DAY, 5);
					tmpCal.getTime(); // recalculate
				}else if(frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_6_HOUR)) {
					tmpCal.add(Calendar.HOUR_OF_DAY, 6);
					tmpCal.getTime(); // recalculate
				}
				createJob(parentJob, dataMap, jobDate, plannedEndTime, endTime.getTime(), tmpCal.getTime(), jobs);
			}
		}
		return job;
	}

	private List<SchedulerConfig> findScheduledTask(Date taskDate, String schedule) {
		return schedulerConfigRepository.findScheduledTask(DateUtil.convertToSQLDate(taskDate), schedule);
	}

//	@Scheduled(cron = "0 */5 * * * ?")
	public void slaTicketEscalationNotification()
	{
		String mailStatus = "";
		log.debug(">>> Tickets ");
		List<SlaConfig> slaConfigs = slaConfigRepository.findActiveSlaConfig();
		java.time.ZonedDateTime currentDate = java.time.ZonedDateTime.now();
		String subject = "test";
		String content = "Escalation mail for ticket";
		for(SlaConfig slaConfig : slaConfigs)
		{
			List<Ticket> tickets = new ArrayList<Ticket>();
			if(slaConfig.getProcessType().equals("Tickets"))
			{
				tickets = ticketRepository.findAllActiveUnClosedTicket();
				Set<SlaEscalationConfig> slaEscalationConfigs = slaConfig.getSlaesc();
				int hours  = slaConfig.getHours();
				ArrayList<String> category = slaConfig.getCategory();
				for(SlaEscalationConfig slaEscalationConfig : slaEscalationConfigs)
				{
						int eschours = slaEscalationConfig.getHours();
						int escmins = slaEscalationConfig.getMinutes();
						String email = slaEscalationConfig.getEmail();
						hours += eschours;
						for(Ticket ticket : tickets)
						{
							for(String cat : category)
							{
								if(cat.equalsIgnoreCase(ticket.getCategory()));
								{
									if(slaEscalationConfig.getLevel() > ticket.getEscalationStatus())
									{
										java.time.ZonedDateTime date = ticket.getCreatedDate().plusHours(hours).plusMinutes(escmins);
										if(date.isBefore(currentDate) || date.equals(currentDate))
										{
											if(slaConfig.getSeverity().equals(ticket.getSeverity()))
											{
												try {
													mailStatus = mailService.sendEscalationEmail(email,subject,content,false,false,"empty");
												} catch (Exception e) {
													// TODO Auto-generated catch block
													e.printStackTrace();
												}
												log.debug("Mail Status " + mailStatus);
												if(mailStatus.equals("success"))
												{
													SLANotificationLog slaNotificationLog = new SLANotificationLog();
													slaNotificationLog.setProcessId(ticket.getId());
													slaNotificationLog.setSiteId(slaConfig.getSite().getId());
													slaNotificationLog.setProcessType(slaConfig.getProcessType());
													slaNotificationLog.setBeginDate(ticket.getCreatedDate());
													slaNotificationLog.setEscalationDate(currentDate);
													slaNotificationLog.setLevel(slaEscalationConfig.getLevel());
													slaNotificationLog.setEmails(slaEscalationConfig.getEmail());
													try
													{
														slaConfigService.slaEscalationNotificationSave(slaNotificationLog);
														try
														{
															slaConfigService.slaTicketEscalationStatusUpdate(ticket);
														}
														catch(Exception e)
														{
															e.printStackTrace();
														}
													}
													catch(Exception e)
													{
														e.printStackTrace();
													}
													ticket.setId(ticket.getId());
													ticket.setEscalationStatus(slaEscalationConfig.getLevel());

												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}

//	@Scheduled(cron = "0 0 2 * * ?")
	public void slaJobEscalationNotification()
	{
		String mailStatus = "";
		log.debug(">>> Job Escalation ");
		List<SlaConfig> slaConfigs = slaConfigRepository.findActiveSlaConfig();
		java.time.ZonedDateTime currentDate = java.time.ZonedDateTime.now();
		String subject = "test";
		String content = "Escalation mail for job";
		for(SlaConfig slaConfig : slaConfigs)
		{
			List<Job> jobs = new ArrayList<Job>();
			if(slaConfig.getProcessType().equals("Jobs"))
			{
				jobs = jobRepository.findAllActiveUnClosedTicket();
				Set<SlaEscalationConfig> slaEscalationConfigs = slaConfig.getSlaesc();
				int hours  = slaConfig.getHours();
				ArrayList<String> category = slaConfig.getCategory();
				for(SlaEscalationConfig slaEscalationConfig : slaEscalationConfigs)
				{
						int eschours = slaEscalationConfig.getHours();
						int escmins = slaEscalationConfig.getMinutes();
						String email = slaEscalationConfig.getEmail();
						hours += eschours;
						for(Job job : jobs)
							{
							for(String cat : category)
							{
								if(job.getType() !=  null)
								{
								if(cat.equalsIgnoreCase(job.getType().name()))
								{
									if(slaEscalationConfig.getLevel() > job.getEscalationStatus())
									{
										java.time.ZonedDateTime date = job.getCreatedDate().plusHours(hours).plusMinutes(escmins);
										if(date.isBefore(currentDate) || date.equals(currentDate))
										{
											try
											{
												mailStatus = mailService.sendEscalationEmail(email,subject,content,false,false,"empty");
											}
											catch (Exception e)
											{
												// TODO Auto-generated catch block
												e.printStackTrace();
											}
											log.debug("Mail Status " + mailStatus);
											if(mailStatus.equals("success"))
											{
												SLANotificationLog slaNotificationLog = new SLANotificationLog();
												slaNotificationLog.setProcessId(job.getId());
												slaNotificationLog.setSiteId(slaConfig.getSite().getId());
												slaNotificationLog.setProcessType(slaConfig.getProcessType());
												slaNotificationLog.setBeginDate(job.getCreatedDate());
												slaNotificationLog.setEscalationDate(currentDate);
												slaNotificationLog.setLevel(slaEscalationConfig.getLevel());
												slaNotificationLog.setEmails(slaEscalationConfig.getEmail());
												try
												{
													slaConfigService.slaEscalationNotificationSave(slaNotificationLog);
												}
												catch(Exception e)
												{
													e.printStackTrace();
												}
												job.setId(job.getId());
												job.setEscalationStatus(slaEscalationConfig.getLevel());
												try
												{
													slaConfigService.slaJobEscalationStatusUpdate(job);
												}
												catch(Exception e)
												{
													e.printStackTrace();
												}
											}
										}
									}
								}
								}
							}
						}
					}
				}
			}
		}

	//@Scheduled(cron="0 */30 * * * ?")
	public void sendDaywiseReport() {
		Calendar cal = Calendar.getInstance();
		boolean isOnDemand = false;
		schedulerHelperService.sendDaywiseReportEmail(cal.getTime(), isOnDemand, 0);
	}



}
