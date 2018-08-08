package com.ts.app.service;

import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Job;
import com.ts.app.domain.Project;
import com.ts.app.domain.SchedulerConfig;
import com.ts.app.domain.Setting;
import com.ts.app.domain.Shift;
import com.ts.app.domain.Site;
import com.ts.app.repository.AttendanceRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.EmployeeShiftRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SchedulerConfigRepository;
import com.ts.app.repository.SettingsRepository;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
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

	static final String LINE_SEPARATOR = "      \n\n";

	@Inject ProjectRepository projectRepository;

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

	@Async
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
			schedulerHelperService.createDailyTasks();
			createWeeklyTasks();
			createMonthlyTasks();
		}

	}

	@Scheduled(initialDelay = 60000, fixedRate = 1800000) // Runs every 30 mins
//	 @Scheduled(cron="30 * * * * ?") //Test to run every 30 seconds
	public void runDailyTask() {
	    log.debug("Run Daily Tasks");
	    schedulerHelperService.createDailyTasks();
	}

	
	@Scheduled(initialDelay = 60000, fixedRate = 1800000) // Runs every 30 mins
	// @Scheduled(cron="30 * * * * ?") //Test to run every 30 seconds
	public void runWeeklyTask() {
		createWeeklyTasks();
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void createWeeklyTasks() {
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
							schedulerHelperService.createJobs(weeklyTask);
						}
					} catch (Exception ex) {
						log.warn("Failed to create JOB ", ex);
					}

				}
				schedulerConfigRepository.save(weeklyTasks);
			}
		}
	}

	@Scheduled(initialDelay = 60000, fixedRate = 1800000) // Runs every 30 mins
	// @Scheduled(cron="30 * * * * ?") //Test to run every 30 seconds
	public void runMonthlyTask() {
		createMonthlyTasks();
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void createMonthlyTasks() {
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
							schedulerHelperService.createJobs(monthlyTask);
						}
					} catch (Exception ex) {
						log.warn("Failed to create JOB ", ex);
					}

				}
				schedulerConfigRepository.save(monthlyTasks);
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

	@Scheduled(cron = "0 */30 * * * ?")
	public void attendanceShiftReportSchedule() {
		Calendar cal = Calendar.getInstance();
		schedulerHelperService.generateDetailedAttendanceReport(cal.getTime(), true, false, false);
	}


	@Scheduled(cron = "0 */30 * 1/1 * ?") // send detailed attendance report
	public void attendanceDetailReportSchedule() {
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DAY_OF_YEAR, -1);
		schedulerHelperService.generateDetailedAttendanceReport(cal.getTime(), false, true, false);
	}

	@Scheduled(cron="0 */30 * * * ?") // runs every 30 mins
	public void attendanceCheckOutTask() {
		schedulerHelperService.autoCheckOutAttendance();
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

	
}
