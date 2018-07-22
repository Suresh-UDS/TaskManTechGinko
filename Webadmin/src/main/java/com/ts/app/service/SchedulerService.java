package com.ts.app.service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.inject.Inject;

import com.ts.app.domain.*;
import com.ts.app.web.rest.dto.*;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.base.Splitter;
import com.google.common.primitives.Longs;
import com.ts.app.repository.AttendanceRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.EmployeeShiftRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SchedulerConfigRepository;
import com.ts.app.repository.SettingsRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.errors.TimesheetException;

/**
 * Service class for managing Device information.
 */
@Service
@Transactional
public class SchedulerService extends AbstractService {

	final Logger log = LoggerFactory.getLogger(SchedulerService.class);

	private static final String FREQ_ONCE_EVERY_HOUR = "Once in an hour";

	static final String LINE_SEPARATOR = "      \n\n";

	private static final String DAILY = "Daily";
	private static final String WEEKLY = "Weekly";
	private static final String MONTHLY = "Monthly";

	@Inject ProjectRepository projectRepository;

	@Inject
	private SiteRepository siteRepository;

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

	@Inject
	private ReportService reportService;

	@Inject
	private AttendanceService attendanceService;

	@Inject AttendanceRepository attendanceRepository;

	@Inject EmployeeRepository employeeRepository;

	@Inject PushService pushService;

	@Inject SettingsRepository settingRepository;

	@Inject EmployeeShiftRepository empShiftRepo;

	@Inject Environment env;

	@Inject
	public SchedulerHelperService schedulerHelperService;

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
		if (dto.getId() != null && dto.getId() > 0) {
			SchedulerConfig entity = schedulerConfigRepository.findOne(dto.getId());
			if (entity != null) {
				mapperUtil.toEntity(dto, entity);
				entity = schedulerConfigRepository.save(entity);
				if (entity.getActive().equalsIgnoreCase("no")) { // if the job schedule is de-activated then the remaining jobs to be deleted.
					deleteJobs(entity);
				}
			} else {
				throw new TimesheetException("Scheduler Config not found");
			}

		} else {
			SchedulerConfig entity = mapperUtil.toEntity(dto, SchedulerConfig.class);
			entity.setJob(job);
			entity.setActive("Y");
			entity = schedulerConfigRepository.save(entity);
			// create jobs based on the creation policy
			//createJobs(entity);
			runDailyTask();
			runWeeklyTask();
			runMonthlyTask();
		}

	}

	//@Scheduled(initialDelay = 60000, fixedRate = 1800000) // Runs every 30 mins
//	 @Scheduled(cron="30 * * * * ?") //Test to run every 30 seconds
	public void runDailyTask() {
	    log.debug("Run Daily Tasks");
		if (env.getProperty("scheduler.dailyJob.enabled").equalsIgnoreCase("true")) {
            log.debug("Daily jobs enabled");
            Calendar cal = Calendar.getInstance();
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			Calendar endCal = Calendar.getInstance();
			endCal.set(Calendar.HOUR_OF_DAY, 23);
			endCal.set(Calendar.MINUTE, 59);
            Calendar nextDay = Calendar.getInstance();
            nextDay.add(Calendar.DATE,1);
            nextDay.set(Calendar.HOUR_OF_DAY, 23);
            nextDay.set(Calendar.MINUTE, 59);

			java.sql.Date startDate = new java.sql.Date(cal.getTimeInMillis());
			java.sql.Date endDate = new java.sql.Date(endCal.getTimeInMillis());
			java.sql.Date tomorrow = new java.sql.Date(nextDay.getTimeInMillis());
			List<SchedulerConfig> dailyTasks = schedulerConfigRepository.getDailyTask(cal.getTime());
			log.debug("Found {} Daily Tasks", dailyTasks.size());

			if (CollectionUtils.isNotEmpty(dailyTasks)) {
				for (SchedulerConfig dailyTask : dailyTasks) {
					long parentJobId = dailyTask.getJob().getId();
					log.debug("Parent job id - "+parentJobId);
					log.debug("Parent job date - "+startDate);
					log.debug("Parent job date - "+endDate);
					List<Job> job = jobRepository.findJobsByParentJobIdAndDate(parentJobId, startDate, tomorrow);
//					log.debug("Parent jobs list- "+job.get(0).getId());
					if (CollectionUtils.isEmpty(job) && job.isEmpty()) {
					    log.debug("Parent job found");
//						createJobs(dailyTask);

						 try { boolean shouldProcess = true;
                             if(dailyTask.isScheduleDailyExcludeWeekend()) {
                                 log.debug("Schedule exclude weekend true");
                                 Calendar today = Calendar.getInstance();
                                 log.debug("Todays day---- ",today.get(Calendar.DAY_OF_WEEK));
                                 if(today.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY || today.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY) {
                                     shouldProcess =false;
                                 }
                             }
                             if(shouldProcess) {
                                 createJobs(dailyTask);
                             }
						 } catch (Exception ex) {
						     log.warn("Failed to create JOB ", ex);
						 }

					}
				}
				schedulerConfigRepository.save(dailyTasks);
			}
		}
	}

	//@Scheduled(initialDelay = 60000, fixedRate = 1800000) // Runs every 30 mins
	// @Scheduled(cron="30 * * * * ?") //Test to run every 30 seconds
	public void runWeeklyTask() {
		if (env.getProperty("scheduler.weeklyJob.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			List<SchedulerConfig> weeklyTasks = schedulerConfigRepository.getWeeklyTask(cal.getTime());
			log.debug("Found {} Weekly Tasks", weeklyTasks.size());

			if (CollectionUtils.isNotEmpty(weeklyTasks)) {
				for (SchedulerConfig weeklyTask : weeklyTasks) {
					try {
						boolean shouldProcess = false;
						Calendar today = Calendar.getInstance();
						switch (today.get(Calendar.DAY_OF_WEEK)) {

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
						if (shouldProcess) {
							// processWeeklyTasks(weeklyTask);
							createJobs(weeklyTask);
						}
					} catch (Exception ex) {
						log.warn("Failed to create JOB ", ex);
					}

				}
				schedulerConfigRepository.save(weeklyTasks);
			}
		}
	}

	//@Scheduled(initialDelay = 60000, fixedRate = 1800000) // Runs every 30 mins
	// @Scheduled(cron="30 * * * * ?") //Test to run every 30 seconds
	public void runMonthlyTask() {
		if (env.getProperty("scheduler.monthlyJob.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			List<SchedulerConfig> monthlyTasks = schedulerConfigRepository.getMonthlyTask(cal.getTime());
			log.debug("Found {} Monthly Tasks", monthlyTasks.size());

			if (CollectionUtils.isNotEmpty(monthlyTasks)) {
				for (SchedulerConfig monthlyTask : monthlyTasks) {
					try {
						boolean shouldProcess = false;
						Calendar today = Calendar.getInstance();
						if (today.get(Calendar.DAY_OF_WEEK) == monthlyTask.getScheduleMonthlyDay()) {
							// processMonthlyTasks(monthlyTask);
							createJobs(monthlyTask);
						}
					} catch (Exception ex) {
						log.warn("Failed to create JOB ", ex);
					}

				}
				schedulerConfigRepository.save(monthlyTasks);
			}
		}
	}

	//@Scheduled(initialDelay = 60000, fixedRate = 900000) // Runs every 15 mins
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
										StringBuilder content = new StringBuilder("Site Name - " + site.getName() + LINE_SEPARATOR);
										content.append("Shift - " + shift.getStartTime() + " - " + shift.getEndTime() + LINE_SEPARATOR);
										content.append("Total employees - " + empCntInShift + LINE_SEPARATOR);
										content.append("Present - " + attendanceCount + LINE_SEPARATOR);
										content.append("Absent - " + absentCount + LINE_SEPARATOR);
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
								StringBuilder content = new StringBuilder("Site Name - " + site.getName() + LINE_SEPARATOR);
								content.append("Shift - General Shift" + LINE_SEPARATOR);
								content.append("Total employees - " + empCntInShift + LINE_SEPARATOR);
								content.append("Present - " + attendanceCount + LINE_SEPARATOR);
								content.append("Absent - " + absentCount + LINE_SEPARATOR);
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

	//@Scheduled(cron="0 */30 * * * ?") // runs every 30 mins
	public void attendanceCheckOutTask() {
		schedulerHelperService.autoCheckOutAttendance(this);
	}

	public void createJobs(SchedulerConfig dailyTask) {
		if ("CREATE_JOB".equals(dailyTask.getType())) {
			if (dailyTask.getSchedule().equalsIgnoreCase(DAILY)) {
				String creationPolicy = env.getProperty("scheduler.dailyJob.creation");
				if (creationPolicy.equalsIgnoreCase("monthly")) { // if the creation policy is set to monthly, create jobs for the rest of the
																	// month
					DateTime currDate = DateTime.now();
					DateTime lastDate = currDate.dayOfMonth().withMaximumValue();
					while (currDate.isBefore(lastDate) || currDate.isEqual(lastDate)) {
						jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), currDate.toDate());
						currDate = currDate.plusDays(1);
					}
				} else if (creationPolicy.equalsIgnoreCase("daily")) {
					jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), new Date());
				}
				 dailyTask.setLastRun(new Date());
			} else if (dailyTask.getSchedule().equalsIgnoreCase(WEEKLY)) {
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
			} else if (dailyTask.getSchedule().equalsIgnoreCase(MONTHLY)) {
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
			}
		} else {
			log.warn("Unknown scheduler config type job" + dailyTask);
		}
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
			jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), new Date());
			dailyTask.setLastRun(new Date());
		} else {
			log.warn("Unknown scheduler config type job" + dailyTask);
		}
	}

	private void processWeeklyTasks(SchedulerConfig weeklyTask) {
		if ("CREATE_JOB".equals(weeklyTask.getType())) {

			jobCreationTask(weeklyTask, weeklyTask.getJob(), weeklyTask.getData(), new Date());
			weeklyTask.setLastRun(new Date());
		} else {
			log.warn("Unknown scheduler config type job" + weeklyTask);
		}
	}

	private void processMonthlyTasks(SchedulerConfig monthlyTask) {
		if ("CREATE_JOB".equals(monthlyTask.getType())) {

			jobCreationTask(monthlyTask, monthlyTask.getJob(), monthlyTask.getData(), new Date());
			monthlyTask.setLastRun(new Date());
		} else {
			log.warn("Unknown scheduler config type job" + monthlyTask);
		}
	}

	private void jobCreationTask(SchedulerConfig dailyTask, Job parentJob, String data, Date jobDate) {
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
				if (dailyTask.isScheduleDailyExcludeWeekend()) {
					Calendar today = Calendar.getInstance();

					if (today.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY || today.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY) {
						shouldProcess = false;
					}
				}
				if (shouldProcess) {
					createJob(parentJob, dataMap, jobDate, eHrs, sHrs, eHrs);
				}
			} catch (Exception ex) {
				log.warn("Failed to create JOB ", ex);
			}

		} catch (Exception e) {
			log.error("Error while creating scheduled job ", e);
		}
	}

	private JobDTO createJob(Job parentJob, Map<String, String> dataMap, Date jobDate, Date plannedEndTime, Date sHrs, Date eHrs) {
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
		startTime.setTime(jobDate);
		// update the plannedEndTimeCal to the current job date in iteration
		plannedEndTimeCal.set(Calendar.DAY_OF_MONTH, startTime.get(Calendar.DAY_OF_MONTH));
		plannedEndTimeCal.set(Calendar.MONTH, startTime.get(Calendar.MONTH));

		Calendar endTime = Calendar.getInstance();
		endTime.setTime(jobDate);
		Calendar cal = DateUtils.toCalendar(sHrs);
		int sHr = cal.get(Calendar.HOUR_OF_DAY);
		int sMin = cal.get(Calendar.MINUTE);
		log.debug("Start time hours =" + sHr + ", start time mins -" + sMin);
		startTime.set(Calendar.HOUR_OF_DAY, sHr);
		startTime.set(Calendar.MINUTE, sMin);
		startTime.set(Calendar.SECOND, 0);
		startTime.getTime(); // to recalculate
		cal = DateUtils.toCalendar(eHrs);
		int eHr = cal.get(Calendar.HOUR_OF_DAY);
		int eMin = cal.get(Calendar.MINUTE);
		log.debug("End time hours =" + eHr + ", end time mins -" + eMin);
		if (StringUtils.isNotEmpty(frequency) && frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_HOUR)) {
			endTime.set(Calendar.HOUR_OF_DAY, startTime.get(Calendar.HOUR_OF_DAY));
			endTime.add(Calendar.HOUR_OF_DAY, 1);
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
		job.setParentJobId(parentJob.getId());
		job.setParentJob(parentJob);
		job.setJobType(parentJob.getType());
		log.debug("Job status in scheduler {}",job.getJobStatus());
        if(CollectionUtils.isNotEmpty(parentJob.getChecklistItems())) {
            List<JobChecklist> jobclList = parentJob.getChecklistItems();
            List<JobChecklistDTO> checklistItems = new ArrayList<JobChecklistDTO>();
            for(JobChecklist jobcl : jobclList) {
                JobChecklistDTO checklist = new JobChecklistDTO();
                checklist.setChecklistId(jobcl.getChecklistId());
                checklist.setChecklistName(jobcl.getChecklistName());
                checklist.setChecklistItemId(jobcl.getChecklistItemId());
                checklist.setChecklistItemName(jobcl.getChecklistItemName());
                checklistItems.add(checklist);

            }
            if(job.getChecklistItems() != null) {
                job.getChecklistItems().addAll(checklistItems);
            }else {
                job.setChecklistItems(checklistItems);
            }
        }
		log.debug("JobDTO parent job id - " + parentJob.getId());
		log.debug("JobDTO parent job id - " + job.getParentJobId());
		log.debug("JobDTO Details before calling saveJob - " + job);
		jobManagementService.saveJob(job);
		if (StringUtils.isNotEmpty(frequency) && frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_HOUR)) {
			Calendar tmpCal = Calendar.getInstance();
			tmpCal.set(Calendar.DAY_OF_MONTH, plannedEndTimeCal.get(Calendar.DAY_OF_MONTH));
			tmpCal.set(Calendar.MONTH, plannedEndTimeCal.get(Calendar.MONTH));
			tmpCal.set(Calendar.HOUR_OF_DAY, plannedEndTimeCal.get(Calendar.HOUR_OF_DAY));
			tmpCal.set(Calendar.MINUTE, plannedEndTimeCal.get(Calendar.MINUTE));
			tmpCal.getTime(); // recalculate
			log.debug("Planned end time cal value = " + tmpCal.getTime());
			log.debug("end time value based on frequency = " + endTime.getTime());
			log.debug("planned end time after endTime " + tmpCal.getTime().after(endTime.getTime()));
			if (tmpCal.getTime().after(endTime.getTime())) {
				tmpCal.setTime(endTime.getTime());
				tmpCal.add(Calendar.HOUR_OF_DAY, 1);
				tmpCal.getTime(); // recalculate
				createJob(parentJob, dataMap, jobDate, plannedEndTime, endTime.getTime(), tmpCal.getTime());
			}
		}
		return job;
	}

}
