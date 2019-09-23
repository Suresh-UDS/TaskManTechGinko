package com.ts.app.service;

import com.ts.app.config.Constants;
import com.ts.app.domain.*;
import com.ts.app.repository.*;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.SchedulerConfigDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;
import org.apache.commons.collections.CollectionUtils;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.*;

/**
 * Service class for managing Device information.
 */
@Service
@Transactional
public class SchedulerService extends AbstractService {

	final Logger log = LoggerFactory.getLogger(SchedulerService.class);

	static final String LINE_SEPARATOR = "      \n\n";

	/*private static final String DAILY = "Daily";
	private static final String WEEKLY = "Weekly";
	private static final String MONTHLY = "Monthly";*/

	@Inject
    ProjectRepository projectRepository;

	@Inject
	private ManufacturerRepository siteRepository;

	@Inject
	private JobManagementService jobManagementService;

	@Inject
	private JobRepository jobRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
    MailService mailService;

	@Inject
    ExportUtil exportUtil;

	@Inject
	private SchedulerConfigRepository schedulerConfigRepository;

	@Inject
    AttendanceRepository attendanceRepository;

	@Inject
    EmployeeRepository employeeRepository;

	@Inject
    PushService pushService;

	@Inject
    SettingsRepository settingRepository;

	@Inject
    EmployeeShiftRepository empShiftRepo;

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

//	@Inject
//	private ReportDatabaseUtil reportDatabaseUtil;


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
			schedulerHelperService.createJobs(entity);

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

			schedulerHelperService.createDailyTask(cal.getTime(), null);
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
								schedulerHelperService.createJobs(weeklyTask);
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
								schedulerHelperService.createJobs(monthlyTask);
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
							schedulerHelperService.createJobs(fortnightlyTask);
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
							schedulerHelperService.createJobs(quarterlyTask);
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
							schedulerHelperService.createJobs(halfyearlyTask);
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
							schedulerHelperService.createJobs(yearlyTask);
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
	@Scheduled(cron = "0 0 0/1 * * ?")
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


	@Scheduled(cron = "0 */30 * 1/1 * ?") // send detailed attendance report
	public void attendanceDetailReportSchedule() {
		log.info("Attendance detailed report scheduler invoked");
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DAY_OF_YEAR, -1);
		schedulerHelperService.generateDetailedAttendanceReport(cal.getTime(), false, true, false);
	}

//	@Scheduled(cron = "0 0 9 1 * ?")
//	@Scheduled(cron = "0 */30 * 1/1 * ?") // send detailed attendance report
	public void attendanceMusterrollReportSchedule() {
		log.info("Attendance muster roll report scheduler invoked");
		Calendar startCal = Calendar.getInstance();
		startCal.add(Calendar.MONTH, -1);
		startCal.set(Calendar.DAY_OF_MONTH, 1);
		startCal.set(Calendar.HOUR_OF_DAY,0);
		startCal.set(Calendar.MINUTE,0);
        startCal.set(Calendar.DAY_OF_MONTH, startCal.getActualMinimum(Calendar.DAY_OF_MONTH));
		Calendar endCal = Calendar.getInstance();
		endCal.add(Calendar.MONTH, -1);
        endCal.set(Calendar.DAY_OF_MONTH, 1);
		endCal.set(Calendar.HOUR_OF_DAY,23);
		endCal.set(Calendar.MINUTE,59);
		endCal.set(Calendar.DAY_OF_MONTH, endCal.getActualMaximum(Calendar.DAY_OF_MONTH));
		long siteId = 0;
		schedulerHelperService.generateMusterRollAttendanceReport(siteId, startCal.getTime(), endCal.getTime(), true, false);
	}

	@Scheduled(cron="0 */30 * * * ?") // runs every 30 mins
	public void attendanceCheckOutTask() {
		log.info("Attendance auto check out scheduler invoked");
		schedulerHelperService.autoCheckOutAttendance();
	}

//	@Scheduled(cron="0 0 9 * * ?")
	public void warrantyExpireAlert() {
		schedulerHelperService.sendWarrantyExpireAlert();
		schedulerHelperService.sendSchedulePPMJobsAlert();
		schedulerHelperService.sendScheduleAMCJobsAlert();
	}

	@Scheduled(cron="0 */30 * * * ?") // runs every 30 mins
	public void feedbackDetailReportSchedule() {
		Calendar cal = Calendar.getInstance();
		//cal.add(Calendar.DAY_OF_YEAR, -1);
		schedulerHelperService.feedbackDetailedReport();
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

	//@Scheduled(cron = "0 */05 * * * ?")
	public void slaTicketEscalationNotification()
	{
		String mailStatus = "";
		log.debug(">>> Tickets ");
		java.time.ZonedDateTime currentDate = java.time.ZonedDateTime.now();
//		String subject = "test";
//		String content = "Escalation mail for ticket";
		List<SlaConfig> slaConfigs = slaConfigRepository.findActiveSlaConfig();
		List<Ticket> tickets = new ArrayList<Ticket>();
		for(SlaConfig slaConfig : slaConfigs)
		{
			if(slaConfig.getProcessType().equals("Tickets"))
			{
				tickets = ticketRepository.findAllActiveUnClosedTicket(slaConfig.getSite().getId());
				Set<SlaEscalationConfig> slaEscalationConfigs = slaConfig.getSlaesc();
				int hours  = slaConfig.getHours();
				ArrayList<String> category = slaConfig.getCategory();
				for(SlaEscalationConfig slaEscalationConfig : slaEscalationConfigs)
				{
					int eschours = slaEscalationConfig.getHours();
					int escmins = slaEscalationConfig.getMinutes();
					String email = slaEscalationConfig.getEmail();
					hours += eschours;
					for(Ticket ticket : tickets) {
					    String siteName = ticket.getSite().getName();

					    String url = env.getProperty("url.ticket-view");

					    url += ticket.getId();

						for(String cat : category)
						{
							if(cat.equalsIgnoreCase(ticket.getCategory()));
							{
								log.debug("Ticket category matches -" + ticket.getCategory());
								if(slaEscalationConfig.getLevel() > ticket.getEscalationStatus())
								{
									log.debug("SLA escalation level match -" + slaEscalationConfig.getLevel());
									java.time.ZonedDateTime date = ticket.getCreatedDate().plusHours(hours).plusMinutes(escmins);
									if(date.isBefore(currentDate) || date.equals(currentDate))
									{
										log.debug("SLA escalation date time -" + date);
										if(slaConfig.getSeverity().equalsIgnoreCase(ticket.getSeverity()))
										{
											log.debug("Ticket severity -" + ticket.getSeverity());
											try {
												mailService.sendEscalationEmail(email,siteName,slaEscalationConfig.getLevel(),ticket.getId(),url,ticket.getTitle(),ticket.getDescription());
											} catch (Exception e) {
												// TODO Auto-generated catch block
												e.printStackTrace();
											}
											log.debug("Mail Status " + mailStatus);
											//if(mailStatus.equals("success"))
											//{
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
												ticketRepository.save(ticket);
											//}
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

	@Scheduled(cron = "0 */05 * * * ?")
	public void slaJobEscalationNotification()
	{
		String mailStatus = "";
		log.debug(">>> Job Escalation ");
		List<SlaConfig> slaConfigs = slaConfigRepository.findActiveSlaConfig();
		java.time.ZonedDateTime currentDate = java.time.ZonedDateTime.now();
		java.sql.Date currDate = new java.sql.Date(Calendar.getInstance().getTimeInMillis());
//		String subject = "test";
//		String content = "Escalation mail for job";
		for(SlaConfig slaConfig : slaConfigs)
		{
			List<Job> jobs = new ArrayList<Job>();
			if(slaConfig.getProcessType().equals("Jobs"))
			{
				jobs = jobRepository.findAllActiveInCompleteJobs(currDate, slaConfig.getSite().getId());
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
                                String url = env.getProperty("url.job-view");
                                url += job.getId();

                                String site = job.getSite().getName();
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
												mailService.sendEscalationEmail(email,site,slaEscalationConfig.getLevel(),job.getId(),url,job.getTitle(),job.getDescription());
											}
											catch (Exception e)
											{
												// TODO Auto-generated catch block
												e.printStackTrace();
											}
											log.debug("Mail Status " + mailStatus);
											//if(mailStatus.equals("success"))
											//{
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
												jobRepository.save(job);
												try
												{
													slaConfigService.slaJobEscalationStatusUpdate(job);
												}
												catch(Exception e)
												{
													e.printStackTrace();
												}
											//}
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

	 @Scheduled(cron="0 */30 * * * ?")
	public void sendDaywiseReport() {
		log.info("Daywise report scheduler invoked");
		Calendar cal = Calendar.getInstance();
		boolean isOnDemand = false;
		schedulerHelperService.sendDaywiseReportEmail(cal.getTime(), isOnDemand, 0);
	}

//    @Scheduled(cron="0 */5 * * * ?")
//	public void createJobPoints() {
//        reportDatabaseUtil.deleteOrUpdateJobPoints();
//    }

//    @Scheduled(cron="0 */5 * * * ?")
//    public void createTicketPoints() {
//        reportDatabaseUtil.deleteOrUpdateTicketPoints();
//    }

//    @Scheduled(cron="0 */5 * * * ?")
//    public void createAttnPoints() {
//        reportDatabaseUtil.deleteOrUpdateAttnPoints();
//    }

//    @Scheduled(cron="0 */5 * * * ?")
//    public void createQuotePoints() {
//        reportDatabaseUtil.deleteOrUpdateQuotePoints();
//    }



}
