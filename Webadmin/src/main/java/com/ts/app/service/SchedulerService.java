package com.ts.app.service;

import java.awt.print.Pageable;
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

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.hibernate.Hibernate;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.DataSourceInitializedEvent;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.base.Splitter;
import com.google.common.primitives.Longs;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Attendance;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeAttendanceReport;
import com.ts.app.domain.EmployeeShift;
import com.ts.app.domain.Job;
import com.ts.app.domain.JobStatus;
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
import com.ts.app.repository.SiteRepository;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.ReportResult;
import com.ts.app.web.rest.dto.SchedulerConfigDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;

import net.sf.ehcache.hibernate.HibernateUtil;

/**
 * Service class for managing Device information.
 */
@Service
@Transactional
public class SchedulerService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(SchedulerService.class);

	private static final String FREQ_ONCE_EVERY_HOUR = "Once in an hour";
	
	private static final String LINE_SEPARATOR = "      \n\n";
	
	private static final String DAILY = "Daily";
	private static final String WEEKLY = "Weekly";
	private static final String MONTHLY = "Monthly";

	@Inject
	private ProjectRepository projectRepository;
	
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
	private ReportService reportService;

	@Inject
	private AttendanceService attendanceService;

	@Inject
	private AttendanceRepository attendanceRepository;

	@Inject
	private EmployeeRepository employeeRepository;

	@Inject
	private PushService pushService;
	
	@Inject
	private SettingsRepository settingRepository;
	
	@Inject
	private EmployeeShiftRepository empShiftRepo;
	
	@Inject
	private Environment env;

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
				entity = schedulerConfigRepository.save(entity);
				if(entity.getActive().equalsIgnoreCase("no")) { //if the job schedule is de-activated then the remaining jobs to be deleted.
					deleteJobs(entity);
				}
			}else{
				throw new TimesheetException("Scheduler Config not found");
			}

		}else{
			SchedulerConfig entity = mapperUtil.toEntity(dto, SchedulerConfig.class);
			entity.setJob(job);
			entity.setActive("Y");
			entity = schedulerConfigRepository.save(entity);
			//create jobs based on the creation policy
			createJobs(entity);
		}

	}

	@Scheduled(initialDelay = 60000,fixedRate = 1800000) //Runs every 30 mins
	//@Scheduled(cron="30 * * * * ?") //Test to run every 30 seconds
	public void runDailyTask() {
		if(env.getProperty("scheduler.dailyJob.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.set(Calendar.HOUR_OF_DAY,0);
			cal.set(Calendar.MINUTE,0);
			Calendar endCal = Calendar.getInstance();
			cal.set(Calendar.HOUR_OF_DAY,23);
			cal.set(Calendar.MINUTE,59);
			List<SchedulerConfig> dailyTasks = schedulerConfigRepository.getDailyTask(cal.getTime());
			log.debug("Found {} Daily Tasks", dailyTasks.size());
	
			if(CollectionUtils.isNotEmpty(dailyTasks)) {
				for (SchedulerConfig dailyTask : dailyTasks) {
					long parentJobId = dailyTask.getJob().getId();
					List<Job> job = jobRepository.findJobsByParentJobIdAndDate(parentJobId,  DateUtil.convertToSQLDate(cal.getTime()), DateUtil.convertToSQLDate(endCal.getTime()));
					if(CollectionUtils.isEmpty(job)) {
						createJobs(dailyTask);
						/*
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
						*/
					}
				}
				schedulerConfigRepository.save(dailyTasks);
			}
		}
	}

	@Scheduled(initialDelay = 60000, fixedRate = 1800000) //Runs every 30 mins
	//@Scheduled(cron="30 * * * * ?") //Test to run every 30 seconds
	public void runWeeklyTask() {
		if(env.getProperty("scheduler.weeklyJob.enabled").equalsIgnoreCase("true")) {		
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
							//processWeeklyTasks(weeklyTask);
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
	
	@Scheduled(initialDelay = 60000, fixedRate = 1800000) //Runs every 30 mins
	//@Scheduled(cron="30 * * * * ?") //Test to run every 30 seconds
	public void runMonthlyTask() {
		if(env.getProperty("scheduler.monthlyJob.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.set(Calendar.HOUR_OF_DAY,0);
			cal.set(Calendar.MINUTE,0);
			List<SchedulerConfig> monthlyTasks = schedulerConfigRepository.getMonthlyTask(cal.getTime());
			log.debug("Found {} Monthly Tasks", monthlyTasks.size());
	
			if(CollectionUtils.isNotEmpty(monthlyTasks)) {
				for (SchedulerConfig monthlyTask : monthlyTasks) {
					try {
						boolean shouldProcess = false;
						Calendar today = Calendar.getInstance();
						if(today.get(Calendar.DAY_OF_WEEK) == monthlyTask.getScheduleMonthlyDay()) {
							//processMonthlyTasks(monthlyTask);
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

	@Scheduled(initialDelay = 60000,fixedRate = 900000) //Runs every 15 mins
	public void overDueTaskCheck() {
		if(env.getProperty("scheduler.overdueJob.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			//Setting overdueAlertSetting = settingRepository.findSettingByKey("email.notification.overdue");
			Setting overdueAlertSetting = null;
			String alertEmailIds = "";
			Setting overdueEmails = null;
//			if(overdueAlertSetting != null && StringUtils.isNotEmpty(overdueAlertSetting.getSettingValue()) 
//					&& overdueAlertSetting.getSettingValue().equalsIgnoreCase("true")) {
//				overdueEmails = settingRepository.findSettingByKey("email.notification.overdue.emails");
//				alertEmailIds = overdueEmails.getSettingValue();
//			}
			
			List<Job> overDueJobs = jobRepository.findOverdueJobsByStatusAndEndDateTime(cal.getTime());
			log.debug("Found {} overdue jobs", (overDueJobs != null ? overDueJobs.size() : 0));
	
			if(CollectionUtils.isNotEmpty(overDueJobs)) {
				ExportResult exportResult = new ExportResult();
				exportResult = exportUtil.writeJobReportToFile(overDueJobs, exportResult);
				for (Job job : overDueJobs) {
					long siteId = job.getSite().getId();
					long projId = job.getSite().getProject().getId();
					if(siteId > 0) {
						overdueAlertSetting = settingRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_OVERDUE, siteId);
						overdueEmails = settingRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_OVERDUE_EMAILS, siteId);
						if(overdueEmails != null) {
							alertEmailIds = overdueEmails.getSettingValue();
						}
					}else if(projId > 0) {
						overdueAlertSetting = settingRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_OVERDUE, projId);
						overdueEmails = settingRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_OVERDUE_EMAILS, projId);
						if(overdueEmails != null) {
							alertEmailIds = overdueEmails.getSettingValue();
						}
					}
					try {
						List<Long> pushAlertUserIds = new ArrayList<Long>();
						Employee assignee = job.getEmployee();
						if(assignee.getUser() != null) {
							pushAlertUserIds.add(assignee.getUser().getId()); //add employee user account id for push
						}
						int alertCnt = job.getOverdueAlertCount() + 1;
						Employee manager = assignee;
						for(int x = 0; x < alertCnt; x++ ) {
							if(manager != null) {
								manager = manager.getManager();
								if(manager != null && manager.getUser() != null) {
									alertEmailIds += "," + manager.getUser().getEmail();
									pushAlertUserIds.add(manager.getUser().getId()); //add manager user account id for push
								}
							}
						}
						try {
							if(CollectionUtils.isNotEmpty(pushAlertUserIds)) {
								long[] pushUserIds = Longs.toArray(pushAlertUserIds);
								String message = "Site - "+ job.getSite().getName() + ", Job - " + job.getTitle() + ", Status - " + JobStatus.OVERDUE.name() + ", Time - "+ job.getPlannedEndTime();
								pushService.send(pushUserIds, message); //send push to employee and managers.
							}
							if(overdueAlertSetting != null && overdueAlertSetting.getSettingValue().equalsIgnoreCase("true")) { //send escalation emails to managers and alert emails
								mailService.sendOverdueJobAlert(assignee.getUser(), alertEmailIds, job.getSite().getName(), job.getId(), job.getTitle(), exportResult.getFile());
								job.setOverDueEmailAlert(true);
							}
						}catch(Exception e) {
							log.error("Error while sending push and email notification for overdue job alerts",e);
						}
						job.setOverdueAlertCount(alertCnt);
						job.setStatus(JobStatus.OVERDUE);
						jobRepository.save(job);
	
					} catch (Exception ex) {
						log.warn("Failed to create JOB ", ex);
					}
				}
			}
		}
	}
	
	//@Scheduled(initialDelay = 60000,fixedRate = 900000) //Runs every 15 mins
	@Scheduled(cron="0 0 20 1/1 * ?")
	public void endOfDayReportSchedule() {
		if(env.getProperty("scheduler.eodJobReport.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			List<Project> projects = projectRepository.findAll();
			for(Project proj : projects) {
				Set<Site> sites = proj.getSite();
				Iterator<Site> siteItr = sites.iterator();
				while(siteItr.hasNext()) {
					Site site = siteItr.next();
					Setting eodReports = settingRepository.findSettingByKeyAndSiteId("email.notification.eodReports", site.getId());
					if(eodReports == null) {
						eodReports = settingRepository.findSettingByKeyAndProjectId("email.notification.eodReports", proj.getId());
					}
					Setting eodReportEmails = settingRepository.findSettingByKeyAndSiteId("email.notification.eodReports.emails", site.getId());
					if(eodReportEmails == null) {
						eodReportEmails = settingRepository.findSettingByKeyAndProjectId("email.notification.eodReports.emails", proj.getId());
					}
					SearchCriteria sc = new SearchCriteria();
					sc.setCheckInDateTimeFrom(cal.getTime());
					sc.setProjectId(proj.getId());
					List<ReportResult> reportResults = jobManagementService.generateConsolidatedReport(sc, false);
					
					if(CollectionUtils.isNotEmpty(reportResults)) {
							//if report generation needed
			                log.debug("results exists");
							if(eodReports != null && eodReports.getSettingValue().equalsIgnoreCase("true")) {
							    log.debug("send report");
								ExportResult exportResult = new ExportResult();
								exportResult = exportUtil.writeConsolidatedJobReportToFile(proj.getName(), reportResults, null, exportResult);
								//send reports in email.
								if(eodReportEmails != null) {
									mailService.sendJobReportEmailFile(eodReportEmails.getSettingValue(), exportResult.getFile(), null, cal.getTime());
								}
			
							}
			
					}
					else{
			    	    		log.debug("no jobs found on the daterange");
			        }
			
				}
			}
		}
		
	}
	
	//@Scheduled(cron="0 0 10 1/1 * ?")
	//@Scheduled(cron="0 0 20 1/1 * ?")
	//@Scheduled(initialDelay = 60000,fixedRate = 3600000)	 //run every 1 hr to generate consolidated report.
	//@Scheduled(initialDelay = 60000,fixedRate = 300000) //run every 5 mins for testing
	@Scheduled(cron="0 0 0/1 * * ?")
	public void attendanceReportSchedule() {
		if(env.getProperty("scheduler.attendanceDetailReport.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			List<Project> projects = projectRepository.findAll();
			for(Project proj : projects) {
				SearchCriteria sc = new SearchCriteria();
				sc.setCheckInDateTimeFrom(cal.getTime());
				sc.setCheckInDateTimeTo(cal.getTime());
				sc.setProjectId(proj.getId());			
				//SearchResult<AttendanceDTO> searchResults = attendanceService.findBySearchCrieria(sc);
				Set<Site> sites = proj.getSite();
				Iterator<Site> siteItr = sites.iterator();
				while(siteItr.hasNext()) {
					Site site = siteItr.next();
					Setting attendanceReports = settingRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_ATTENDANCE, site.getId());
					if(attendanceReports == null) {
						attendanceReports = settingRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_ATTENDANCE, proj.getId());
					}
					if(attendanceReports != null && attendanceReports.getSettingValue().equalsIgnoreCase("true")) {
						Setting attendanceReportEmails = settingRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_ATTENDANCE_EMAILS, site.getId());
					    if(attendanceReportEmails == null) {
					    		attendanceReportEmails = settingRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_ATTENDANCE_EMAILS, proj.getId());
					    }
						if(CollectionUtils.isNotEmpty(site.getShifts())) {
							List<Shift> shifts = site.getShifts();
							for(Shift shift : shifts) {
								String startTime = shift.getStartTime();
								String[] startTimeUnits = startTime.split(":");
								Calendar startCal = Calendar.getInstance();
								startCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTimeUnits[0]));
								startCal.set(Calendar.MINUTE, Integer.parseInt(startTimeUnits[1]));
								String endTime = shift.getEndTime();
								String[] endTimeUnits = endTime.split(":");
								Calendar endCal = Calendar.getInstance();
								endCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(endTimeUnits[0]));
								endCal.set(Calendar.MINUTE, Integer.parseInt(endTimeUnits[1]));
								Calendar currCal = Calendar.getInstance();
								//currCal.add(Calendar.HOUR_OF_DAY,  1);
								long timeDiff = currCal.getTimeInMillis() - startCal.getTimeInMillis();
								if(timeDiff >= 3600000 && timeDiff < 7200000) { //within 2 hours of the shift start timing.
									//long empCntInShift = employeeRepository.findEmployeeCountBySiteAndShift(site.getId(), shift.getStartTime(), shift.getEndTime());
									long empCntInShift = empShiftRepo.findEmployeeCountBySiteAndShift(site.getId(), DateUtil.convertToSQLDate(startCal.getTime()), DateUtil.convertToSQLDate(endCal.getTime()));
									if(empCntInShift == 0) {
										empCntInShift = employeeRepository.findCountBySiteId(site.getId());
									}
									
									long attendanceCount = attendanceRepository.findCountBySiteAndCheckInTime(site.getId(), DateUtil.convertToSQLDate(startCal.getTime()), DateUtil.convertToSQLDate(endCal.getTime()));
									//List<EmployeeAttendanceReport> empAttnList = attendanceRepository.findBySiteId(site.getId(), DateUtil.convertToSQLDate(cal.getTime()), DateUtil.convertToSQLDate(cal.getTime()));
								    long absentCount = empCntInShift - attendanceCount;
									log.debug("send consolidated report");
									
								    
									//ExportResult exportResult = new ExportResult();
									//exportResult = exportUtil.writeAttendanceReportToFile(proj.getName(), empAttnList, null, exportResult);
									//send reports in email.
									if(attendanceReportEmails != null) {
										StringBuilder content = new StringBuilder("Site Name - " + site.getName() + LINE_SEPARATOR);
										content.append("Shift - "+ shift.getStartTime() + " - " + shift.getEndTime() + LINE_SEPARATOR);
										content.append("Total employees - " + empCntInShift + LINE_SEPARATOR);
										content.append("Present - " + attendanceCount + LINE_SEPARATOR);
										content.append("Absent - " + absentCount + LINE_SEPARATOR);
										//mailService.sendJobReportEmailFile(attendanceReportEmails.getSettingValue(), exportResult.getFile(), null, cal.getTime());
										mailService.sendAttendanceConsolidatedReportEmail(site.getName(), attendanceReportEmails.getSettingValue(), content.toString(), null, cal.getTime());
									}
								}	
							}
	 					}else {
							long empCntInShift = employeeRepository.findCountBySiteId(site.getId());
							long attendanceCount = attendanceRepository.findCountBySiteAndCheckInTime(site.getId(), DateUtil.convertToSQLDate(cal.getTime()), DateUtil.convertToSQLDate(cal.getTime()));
						    long absentCount = empCntInShift - attendanceCount;
						    if(attendanceReportEmails != null) {
								StringBuilder content = new StringBuilder("Site Name - " + site.getName() + LINE_SEPARATOR);
								content.append("Shift - General Shift" + LINE_SEPARATOR);
								content.append("Total employees - " + empCntInShift + LINE_SEPARATOR);
								content.append("Present - " + attendanceCount + LINE_SEPARATOR);
								content.append("Absent - " + absentCount + LINE_SEPARATOR);
								mailService.sendAttendanceConsolidatedReportEmail(site.getName(),attendanceReportEmails.getSettingValue(), content.toString(), null, new Date());
							}
	 					}
					}
				}
			}
		}	
	}
	
	@Scheduled(cron="0 0 7 1/1 * ?") //send detailed attendance report
	public void attendanceDetailReportSchedule() {
		if(env.getProperty("scheduler.attendanceDetailReport.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.add(Calendar.DAY_OF_MONTH, -1);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			Calendar dayEndcal = Calendar.getInstance();
			dayEndcal.add(Calendar.DAY_OF_MONTH, -1);
			dayEndcal.set(Calendar.HOUR_OF_DAY, 23);
			dayEndcal.set(Calendar.MINUTE, 59);

			List<Project> projects = projectRepository.findAll();
			for(Project proj : projects) {
				SearchCriteria sc = new SearchCriteria();
				sc.setCheckInDateTimeFrom(cal.getTime());
				sc.setCheckInDateTimeTo(cal.getTime());
				sc.setProjectId(proj.getId());			
				//SearchResult<AttendanceDTO> searchResults = attendanceService.findBySearchCrieria(sc);
				Set<Site> sites = proj.getSite();
				Iterator<Site> siteItr = sites.iterator();
				while(siteItr.hasNext()) {
					Site site = siteItr.next();
					Setting attendanceReports = settingRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_ATTENDANCE, site.getId());
					if(attendanceReports == null) {
						attendanceReports = settingRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_ATTENDANCE, proj.getId());
					}
					if(attendanceReports != null && attendanceReports.getSettingValue().equalsIgnoreCase("true")) {
						StringBuilder content = new StringBuilder();
						Hibernate.initialize(site.getShifts());
						if(CollectionUtils.isNotEmpty(site.getShifts())) {
							List<Shift> shifts = site.getShifts();
							content = new StringBuilder("Site Name - " + site.getName() + LINE_SEPARATOR);
							for(Shift shift : shifts) {
								String startTime = shift.getStartTime();
								String[] startTimeUnits = startTime.split(":");
								Calendar startCal = Calendar.getInstance();
								startCal.add(Calendar.DAY_OF_MONTH, -1);
								startCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTimeUnits[0]));
								startCal.set(Calendar.MINUTE, Integer.parseInt(startTimeUnits[1]));
								String endTime = shift.getEndTime();
								String[] endTimeUnits = endTime.split(":");
								Calendar endCal = Calendar.getInstance();
								endCal.add(Calendar.DAY_OF_MONTH, -1);
								endCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(endTimeUnits[0]));
								endCal.set(Calendar.MINUTE, Integer.parseInt(endTimeUnits[1]));
								Calendar currCal = Calendar.getInstance();
								currCal.add(Calendar.HOUR_OF_DAY,  1);
								long timeDiff = currCal.getTimeInMillis() - startCal.getTimeInMillis();
								//if(currCal.equals(startCal) || (timeDiff >= 0 && timeDiff <= 3600000)) {
									long empCntInShift = 0; //employeeRepository.findEmployeeCountBySiteAndShift(site.getId(), shift.getStartTime(), shift.getEndTime());
									if(empCntInShift == 0) {
										empCntInShift = employeeRepository.findCountBySiteId(site.getId());
									}
									
									long attendanceCount = attendanceRepository.findCountBySiteAndCheckInTime(site.getId(), DateUtil.convertToSQLDate(startCal.getTime()), DateUtil.convertToSQLDate(endCal.getTime()));
									//List<EmployeeAttendanceReport> empAttnList = attendanceRepository.findBySiteId(site.getId(), DateUtil.convertToSQLDate(cal.getTime()), DateUtil.convertToSQLDate(cal.getTime()));
								    long absentCount = empCntInShift - attendanceCount;
								    
									//ExportResult exportResult = new ExportResult();
									//exportResult = exportUtil.writeAttendanceReportToFile(proj.getName(), empAttnList, null, exportResult);
									//send reports in email.
									content.append("Shift - "+ shift.getStartTime() + " - " + shift.getEndTime() + LINE_SEPARATOR);
									content.append("Total employees - " + empCntInShift + LINE_SEPARATOR);
									content.append("Present - " + attendanceCount + LINE_SEPARATOR);
									content.append("Absent - " + absentCount + LINE_SEPARATOR);
								//}	
							}
	 					}else {
							long empCntInShift = employeeRepository.findCountBySiteId(site.getId());
							
							long attendanceCount = attendanceRepository.findCountBySiteAndCheckInTime(site.getId(), DateUtil.convertToSQLDate(cal.getTime()), DateUtil.convertToSQLDate(dayEndcal.getTime()));
							//List<EmployeeAttendanceReport> empAttnList = attendanceRepository.findBySiteId(site.getId(), DateUtil.convertToSQLDate(cal.getTime()), DateUtil.convertToSQLDate(cal.getTime()));
						    long absentCount = empCntInShift - attendanceCount;
						    
							//ExportResult exportResult = new ExportResult();
							//exportResult = exportUtil.writeAttendanceReportToFile(proj.getName(), empAttnList, null, exportResult);
							//send reports in email.
							content = new StringBuilder("Site Name - " + site.getName() + LINE_SEPARATOR);
							content.append("Total employees - " + empCntInShift + LINE_SEPARATOR);
							content.append("Present - " + attendanceCount + LINE_SEPARATOR);
							content.append("Absent - " + absentCount + LINE_SEPARATOR);
	 					}
						List<EmployeeAttendanceReport> empAttnList = attendanceRepository.findBySiteId(site.getId(), DateUtil.convertToSQLDate(cal.getTime()), DateUtil.convertToSQLDate(dayEndcal.getTime()));
						List<Long> empPresentList = new ArrayList<Long>();
						if(CollectionUtils.isNotEmpty(empAttnList)) {
							for(EmployeeAttendanceReport empAttn : empAttnList) {
								empPresentList.add(empAttn.getEmpId());
							}
							if(CollectionUtils.isNotEmpty(empPresentList)) {
								List<Employee> empNotMarkedAttn = employeeRepository.findNonMatchingBySiteId(site.getId(), empPresentList);
								if(CollectionUtils.isNotEmpty(empNotMarkedAttn)) {
									for(Employee emp : empNotMarkedAttn) {
										EmployeeAttendanceReport empAttnRep = new EmployeeAttendanceReport();
										empAttnRep.setEmpId(emp.getId());
										empAttnRep.setEmployeeId(emp.getEmpId());
										empAttnRep.setName(emp.getName());
										empAttnRep.setLastName(emp.getLastName());
										empAttnRep.setStatus(EmployeeAttendanceReport.ABSENT_STATUS);
										empAttnList.add(empAttnRep);
									}
								}
							}
						}
						log.debug("send detailed report");
						Setting attendanceReportEmails = settingRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_ATTENDANCE_EMAILS, site.getId());
					    if(attendanceReportEmails == null) {
					    		attendanceReportEmails = settingRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_ATTENDANCE_EMAILS, proj.getId());
					    }
						ExportResult exportResult = null;
						exportResult = exportUtil.writeAttendanceReportToFile(proj.getName(), empAttnList, null, exportResult);
						//send reports in email.
						mailService.sendAttendanceDetailedReportEmail(site.getName(),attendanceReportEmails.getSettingValue(), content.toString(), exportResult.getFile(),null, cal.getTime());
					}
				}
			}
		}	
	}
	
	//@Scheduled(cron="0 0 0 1/1 * ?") //Test to run every 30 seconds
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

	public void createJobs(SchedulerConfig dailyTask) {
		if ("CREATE_JOB".equals(dailyTask.getType())) {
			if(dailyTask.getSchedule().equalsIgnoreCase(DAILY)) {
				String creationPolicy = env.getProperty("scheduler.dailyJob.creation");
				if(creationPolicy.equalsIgnoreCase("monthly")) { //if the creation policy is set to monthly, create jobs for the rest of the month
					DateTime currDate = DateTime.now();
			        DateTime lastDate = currDate.dayOfMonth().withMaximumValue();
					while(currDate.isBefore(lastDate) || currDate.isEqual(lastDate)) {
						jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), currDate.toDate());
						currDate = currDate.plusDays(1);
					}
				}else if(creationPolicy.equalsIgnoreCase("daily")) {
					jobCreationTask(dailyTask,dailyTask.getJob(), dailyTask.getData(), new Date());
				}
				//dailyTask.setLastRun(new Date());
			}else if(dailyTask.getSchedule().equalsIgnoreCase(WEEKLY)) {
				String creationPolicy = env.getProperty("scheduler.weeklyJob.creation");
				if(creationPolicy.equalsIgnoreCase("monthly")) { //if the creation policy is set to monthly, create jobs for the rest of the month
					PageRequest pageRequest = new PageRequest(1, 1); 
					List<Job> prevJobs = jobRepository.findLastJobByParentJobId(dailyTask.getJob().getId(), pageRequest);
					DateTime currDate = DateTime.now();
					if(CollectionUtils.isNotEmpty(prevJobs)) {
						Job prevJob = prevJobs.get(0);
						if(prevJob.getPlannedStartTime().before(currDate.toDate())) {
					        DateTime lastDate = currDate.dayOfMonth().withMaximumValue();
					        currDate = currDate.plusDays(7);
							while(currDate.isBefore(lastDate) || currDate.isEqual(lastDate)) {
								jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), currDate.toDate());
								dailyTask.setLastRun(currDate.toDate());
								currDate = currDate.plusDays(7); //create for every week.
							}
						}
					}
				}
			}else if(dailyTask.getSchedule().equalsIgnoreCase(MONTHLY)) {
				String creationPolicy = env.getProperty("scheduler.monthlyJob.creation");
				if(creationPolicy.equalsIgnoreCase("yearly")) { //if the creation policy is set to monthly, create jobs for the rest of the month
					PageRequest pageRequest = new PageRequest(1, 1); 
					List<Job> prevJobs = jobRepository.findLastJobByParentJobId(dailyTask.getJob().getId(), pageRequest);
					DateTime currDate = DateTime.now();
					if(CollectionUtils.isNotEmpty(prevJobs)) {
						Job prevJob = prevJobs.get(0);
						if(prevJob.getPlannedStartTime().before(currDate.toDate())) {
					        DateTime lastDate = currDate.dayOfMonth().withMaximumValue();
					        currDate = currDate.plusDays(currDate.dayOfMonth().getMaximumValue());
							while(currDate.isBefore(lastDate) || currDate.isEqual(lastDate)) {
								jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), currDate.toDate());
								dailyTask.setLastRun(currDate.toDate());
								currDate = currDate.plusDays(currDate.dayOfMonth().getMaximumValue()); //create for every month.
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
			if(creationPolicy.equalsIgnoreCase("monthly")) { //if the creation policy is set to monthly, create jobs for the rest of the month
				DateTime currDate = DateTime.now();
		        DateTime lastDate = currDate.dayOfMonth().withMaximumValue();
				while(currDate.isBefore(lastDate) || currDate.isEqual(lastDate)) {
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

			jobCreationTask(weeklyTask, weeklyTask.getJob(), weeklyTask.getData(),new Date());
			weeklyTask.setLastRun(new Date());
		} else {
			log.warn("Unknown scheduler config type job" + weeklyTask);
		}
	}

	private void processMonthlyTasks(SchedulerConfig monthlyTask) {
		if ("CREATE_JOB".equals(monthlyTask.getType())) {

			jobCreationTask(monthlyTask, monthlyTask.getJob(), monthlyTask.getData(),new Date());
			monthlyTask.setLastRun(new Date());
		} else {
			log.warn("Unknown scheduler config type job" + monthlyTask);
		}
	}

	private void jobCreationTask(SchedulerConfig dailyTask, Job parentJob, String data, Date jobDate){
		log.debug("Creating Job : "+data);
		Map<String, String> dataMap = Splitter.on("&").withKeyValueSeparator("=").split(data);
		String sTime = dataMap.get("plannedStartTime");
		String eTime = dataMap.get("plannedEndTime");
		SimpleDateFormat sdf = new SimpleDateFormat("E MMM d HH:mm:ss z yyyy");
		try {
			Date sHrs = sdf.parse(sTime);
			Date eHrs = sdf.parse(eTime);
			
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
					createJob(parentJob, dataMap, jobDate, eHrs, sHrs, eHrs);
				}
			} catch (Exception ex) {
				log.warn("Failed to create JOB ", ex);
			}
			
		}catch(Exception e) {
			log.error("Error while creating scheduled job ",e);
		}
	}

	private JobDTO createJob(Job parentJob, Map<String,String> dataMap, Date jobDate, Date plannedEndTime, Date sHrs, Date eHrs) {
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
		//update the plannedEndTimeCal to the current job date in iteration
		plannedEndTimeCal.set(Calendar.DAY_OF_MONTH, startTime.get(Calendar.DAY_OF_MONTH));
		plannedEndTimeCal.set(Calendar.MONTH, startTime.get(Calendar.MONTH));

		
		Calendar endTime = Calendar.getInstance();
		endTime.setTime(jobDate);
		Calendar cal = DateUtils.toCalendar(sHrs);
		int sHr = cal.get(Calendar.HOUR_OF_DAY);
		int sMin = cal.get(Calendar.MINUTE);
		log.debug("Start time hours ="+ sHr +", start time mins -"+ sMin);
		startTime.set(Calendar.HOUR_OF_DAY, sHr);
		startTime.set(Calendar.MINUTE, sMin);
		startTime.getTime(); //to recalculate
		cal = DateUtils.toCalendar(eHrs);
		int eHr = cal.get(Calendar.HOUR_OF_DAY);
		int eMin = cal.get(Calendar.MINUTE);
		log.debug("End time hours ="+ eHr +", end time mins -"+ eMin);
		if(StringUtils.isNotEmpty(frequency) &&
				frequency.equalsIgnoreCase(FREQ_ONCE_EVERY_HOUR)) {
			endTime.set(Calendar.HOUR_OF_DAY, startTime.get(Calendar.HOUR_OF_DAY));
			endTime.add(Calendar.HOUR_OF_DAY, 1);
			endTime.set(Calendar.MINUTE, eMin);
			endTime.getTime(); //to recalculate
		}else {
			endTime.set(Calendar.HOUR_OF_DAY, eHr);
			endTime.set(Calendar.MINUTE, eMin);
			endTime.getTime(); //to recalculate
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
			tmpCal.set(Calendar.DAY_OF_MONTH, plannedEndTimeCal.get(Calendar.DAY_OF_MONTH));
			tmpCal.set(Calendar.MONTH, plannedEndTimeCal.get(Calendar.MONTH));
			tmpCal.set(Calendar.HOUR_OF_DAY, plannedEndTimeCal.get(Calendar.HOUR_OF_DAY));
			tmpCal.set(Calendar.MINUTE,plannedEndTimeCal.get(Calendar.MINUTE));
			tmpCal.getTime(); //recalculate
			log.debug("Planned end time cal value = " + tmpCal.getTime());
			log.debug("end time value based on frequency = " + endTime.getTime());
			log.debug("planned end time after endTime " + tmpCal.getTime().after(endTime.getTime()));
			if(tmpCal.getTime().after(endTime.getTime())) {
				tmpCal.setTime(endTime.getTime());
				tmpCal.add(Calendar.HOUR_OF_DAY, 1);
				tmpCal.getTime(); //recalculate
				createJob(parentJob, dataMap, jobDate, plannedEndTime, endTime.getTime(), tmpCal.getTime());
			}
		}
		return job;
	}





}
