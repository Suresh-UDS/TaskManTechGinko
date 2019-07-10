
package com.ts.app.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Splitter;
import com.ts.app.config.Constants;
import com.ts.app.domain.*;
import com.ts.app.domain.util.StringUtil;
import com.ts.app.repository.*;
import com.ts.app.service.util.CommonUtil;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.*;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.Hibernate;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * Service class for managing Device information.
 */
@Service
@Transactional
public class SchedulerHelperService extends AbstractService {

	final Logger log = LoggerFactory.getLogger(SchedulerHelperService.class);

	private static final String DAILY = "DAY";
	private static final String WEEKLY = "WEEK";
	private static final String MONTHLY = "MONTH";

	private static final String FREQ_ONCE_EVERY_HOUR = "1H";
	private static final String FREQ_ONCE_EVERY_2_HOUR = "2H";
	private static final String FREQ_ONCE_EVERY_3_HOUR = "3H";
	private static final String FREQ_ONCE_EVERY_4_HOUR = "4H";
	private static final String FREQ_ONCE_EVERY_5_HOUR = "5H";
	private static final String FREQ_ONCE_EVERY_6_HOUR = "6H";



	@Inject
	private PushService pushService;

	@Inject
	private MailService mailService;

	@Inject
	private JobRepository jobRepository;

	@Inject
	private SettingsRepository settingRepository;

	@Inject
	private ProjectRepository projectRepository;

	@Inject
	private EmployeeShiftRepository empShiftRepo;

	@Inject
	private EmployeeRepository employeeRepository;

	@Inject
    private UserRepository userRepository;

	@Inject
	private SiteRepository siteRepository;

	@Inject
	private AttendanceRepository attendanceRepository;

	@Inject
	private JobManagementService jobManagementService;

	@Inject
	private ReportService reportService;

	@Inject
	private FeedbackTransactionService feedbackTransactionService;

	@Inject
	private AssetRepository assetRepository;

	@Inject
	private TicketManagementService ticketManagementService;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private ExportUtil exportUtil;

	@Inject
	private Environment env;

	public static final String EMAIL_NOTIFICATION_WARRANTY = "email.notification.warranty";

	public static final String EMAIL_NOTIFICATION_WARRANTY_EMAILS = "email.notification.warranty.emails";

	public static final String EMAIL_NOTIFICATION_PPM = "email.notification.ppm";

	public static final String EMAIL_NOTIFICATION_PPM_EMAILS = "email.notification.ppm.emails";

	public static final String EMAIL_NOTIFICATION_AMC = "email.notification.amc";

	public static final String EMAIL_NOTIFICATION_AMC_EMAILS = "email.notification.amc.emails";

	@Inject
	private SchedulerConfigRepository schedulerConfigRepository;

	@Inject
	private RateCardService quotationService;

	@Value("${export.file.path}")
	private String exportPath;

	public void eodJobReport() {
		if (env.getProperty("scheduler.eodJobReport.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			List<Project> projects = projectRepository.findAll();
			for (Project proj : projects) {
				Set<Site> sites = proj.getSite();
				Iterator<Site> siteItr = sites.iterator();
				while (siteItr.hasNext()) {
					Site site = siteItr.next();
					List<Setting> settings = null;
					settings = settingRepository.findSettingByKeyAndSiteIdOrProjectId("email.notification.eodReports",
							site.getId(), proj.getId());
					Setting eodReports = null;
					if (CollectionUtils.isNotEmpty(settings)) {
						eodReports = settings.get(0);
					}
					settings = settingRepository.findSettingByKeyAndSiteIdOrProjectId(
							"email.notification.eodReports.emails", site.getId(), proj.getId());
					Setting eodReportEmails = null;
					if (CollectionUtils.isNotEmpty(settings)) {
						eodReportEmails = settings.get(0);
					}
					SearchCriteria sc = new SearchCriteria();
					sc.setCheckInDateTimeFrom(cal.getTime());
					sc.setProjectId(proj.getId());
					List<ReportResult> reportResults = jobManagementService.generateConsolidatedReport(sc, false);

					if (CollectionUtils.isNotEmpty(reportResults)) {
						// if report generation needed
						log.debug("results exists");
						if (eodReports != null && eodReports.getSettingValue().equalsIgnoreCase("true")) {
							log.debug("send report");
							ExportResult exportResult = new ExportResult();
							exportResult = exportUtil.writeConsolidatedJobReportToFile(proj.getName(), reportResults,
									null, exportResult);
							// send reports in email.
							if (eodReportEmails != null) {
								mailService.sendJobReportEmailFile(eodReportEmails.getSettingValue(),
										exportResult.getFile(), null, cal.getTime());
							}

						}

					} else {
						log.debug("no jobs found on the daterange");
					}
				}
			}
		}
	}

	public void feedbackDetailedReport() {
		if (env.getProperty("scheduler.feedbackreport.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			Calendar dayEndcal = Calendar.getInstance();
			dayEndcal.set(Calendar.HOUR_OF_DAY, 23);
			dayEndcal.set(Calendar.MINUTE, 59);
			dayEndcal.set(Calendar.SECOND, 0);
			dayEndcal.set(Calendar.MILLISECOND, 0);

			List<Project> projects = projectRepository.findAll();
			for (Project proj : projects) {
				SearchCriteria sc = new SearchCriteria();
				sc.setFromDate(cal.getTime());
				sc.setToDate(cal.getTime());
				sc.setProjectId(proj.getId());
				Hibernate.initialize(proj.getSite());
				Set<Site> sites = proj.getSite();
				Iterator<Site> siteItr = sites.iterator();
				List<Setting> settings = null;
				List<Setting> emailSettings = null;
				List<Setting> timeSettings = null;
				while (siteItr.hasNext()) {
					Site site = siteItr.next();
					sc.setSiteId(site.getId());
					settings = settingRepository.findSettingByKeyAndSiteIdOrProjectId(
							SettingsService.EMAIL_NOTIFICATION_FEEDBACK_REPORT, site.getId(), proj.getId());
					emailSettings = settingRepository.findSettingByKeyAndSiteIdOrProjectId(
							SettingsService.EMAIL_NOTIFICATION_FEEDBACK_REPORT_EMAILS, site.getId(), proj.getId());
					timeSettings = settingRepository.findSettingByKeyAndSiteIdOrProjectId(
							SettingsService.EMAIL_NOTIFICATION_FEEDBACK_REPORT_TIME, site.getId(), proj.getId());
					Setting feedbackReports = null;
					if (CollectionUtils.isNotEmpty(settings)) {
						feedbackReports = settings.get(0);
					}
					Setting feedbackEmail = null;
					if (CollectionUtils.isNotEmpty(emailSettings)) {
						feedbackEmail = emailSettings.get(0);
					}
					Setting feedbackTime = null;
					if (CollectionUtils.isNotEmpty(timeSettings)) {
						feedbackTime = timeSettings.get(0);
					}
					if (feedbackReports != null && feedbackReports.getSettingValue().equalsIgnoreCase("true")) {
						String reportTime = feedbackTime != null ? feedbackTime.getSettingValue() : null;
						Calendar now = Calendar.getInstance();
						now.set(Calendar.SECOND, 0);
						now.set(Calendar.MILLISECOND, 0);
						Calendar reportTimeCal = Calendar.getInstance();
						if (StringUtils.isNotEmpty(reportTime)) {
							try {
								Date reportDateTime = DateUtil.parseToDateTime(reportTime);
								reportTimeCal.setTime(reportDateTime);
								reportTimeCal.set(Calendar.DAY_OF_MONTH, now.get(Calendar.DAY_OF_MONTH));
								reportTimeCal.set(Calendar.MONTH, now.get(Calendar.MONTH));
								reportTimeCal.set(Calendar.YEAR, now.get(Calendar.YEAR));
								reportTimeCal.set(Calendar.SECOND, 0);
								reportTimeCal.set(Calendar.MILLISECOND, 0);
							} catch (Exception e) {
								log.error("Error while parsing feedback report time configured for client : "
										+ proj.getName(), e);
							}
						}
						if (reportTime != null && reportTimeCal.equals(now)
								&& (feedbackEmail != null && StringUtils.isNotEmpty(feedbackEmail.getSettingValue()))) {
							SearchResult<FeedbackTransactionDTO> results = feedbackTransactionService
									.findBySearchCrieria(sc);
							List<FeedbackTransactionDTO> content = results.getTransactions();
							ExportResult result = new ExportResult();
							result.setProjectId(proj.getId());
							result.setSiteId(site.getId());
							exportUtil.writeFeedbackExcelReportToFile(proj.getName(), content, null, null, result);
						}

					}
				}
			}

		}
	}

	public void overdueJobReport() {
		if (env.getProperty("scheduler.overdueJob.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			// Setting overdueAlertSetting =
			// settingRepository.findSettingByKey("email.notification.overdue");
			List<Setting> settings = null;
			Setting overdueAlertSetting = null;
			String alertEmailIds = "";
			Setting overdueEmails = null;
			// if(overdueAlertSetting != null &&
			// StringUtils.isNotEmpty(overdueAlertSetting.getSettingValue())
			// && overdueAlertSetting.getSettingValue().equalsIgnoreCase("true")) {
			// overdueEmails =
			// settingRepository.findSettingByKey("email.notification.overdue.emails");
			// alertEmailIds = overdueEmails.getSettingValue();
			// }

			List<Job> overDueJobs = jobRepository.findOverdueJobsByStatusAndEndDateTime(DateUtil.convertToSQLDate(cal.getTime()));
			log.debug("Found {} overdue jobs", (overDueJobs != null ? overDueJobs.size() : 0));

			if (CollectionUtils.isNotEmpty(overDueJobs)) {
				ExportResult exportResult = new ExportResult();
				exportResult = exportUtil.writeJobReportToFile(overDueJobs, exportResult);
				for (Job job : overDueJobs) {
					/*
					long siteId = job.getSite().getId();
					long projId = job.getSite().getProject().getId();
					if (siteId > 0) {
						settings = settingRepository
								.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_OVERDUE, siteId);
						if (CollectionUtils.isNotEmpty(settings)) {
							overdueAlertSetting = settings.get(0);
						}
						settings = settingRepository
								.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_OVERDUE_EMAILS, siteId);
						if (CollectionUtils.isNotEmpty(settings)) {
							overdueEmails = settings.get(0);
						}
						if (overdueEmails != null) {
							alertEmailIds = overdueEmails.getSettingValue();
						}
					} else if (projId > 0) {
						settings = settingRepository
								.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_OVERDUE, projId);
						if (CollectionUtils.isNotEmpty(settings)) {
							overdueAlertSetting = settings.get(0);
						}
						settings = settingRepository.findSettingByKeyAndProjectId(
								SettingsService.EMAIL_NOTIFICATION_OVERDUE_EMAILS, projId);
						if (CollectionUtils.isNotEmpty(settings)) {
							overdueEmails = settings.get(0);
						}

						if (overdueEmails != null) {
							alertEmailIds = overdueEmails.getSettingValue();
						}
					}
					*/
					try {
						/*
						List<Long> pushAlertUserIds = new ArrayList<Long>();
						Employee assignee = job.getEmployee();
						if (assignee.getUser() != null) {
							pushAlertUserIds.add(assignee.getUser().getId()); // add employee user account id for push
						}
						int alertCnt = job.getOverdueAlertCount() + 1;
						Employee manager = assignee;
						for (int x = 0; x < alertCnt; x++) {
							if (manager != null) {
								manager = manager.getManager();
								if (manager != null && manager.getUser() != null) {
									alertEmailIds += "," + manager.getUser().getEmail();
									pushAlertUserIds.add(manager.getUser().getId()); // add manager user account id for
																						// push
								}
							}
						}
						try {
							if (CollectionUtils.isNotEmpty(pushAlertUserIds)) {
								long[] pushUserIds = Longs.toArray(pushAlertUserIds);
								String message = "Site - " + job.getSite().getName() + ", Job - " + job.getTitle()
										+ ", Status - " + JobStatus.OVERDUE.name() + ", Time - "
										+ job.getPlannedEndTime();
								pushService.send(pushUserIds, message); // send push to employee and managers.
							}
							if (overdueAlertSetting != null
									&& overdueAlertSetting.getSettingValue().equalsIgnoreCase("true")) { // send
																											// escalation
																											// emails to
																											// managers
																											// and alert
																											// emails
								// mailService.sendOverdueJobAlert(assignee.getUser(), alertEmailIds,
								// job.getSite().getName(), job.getId(), job.getTitle(),
								// exportResult.getFile());
								// job.setOverDueEmailAlert(true);
							}
						} catch (Exception e) {
							log.error("Error while sending push and email notification for overdue job alerts", e);
						}

						job.setOverdueAlertCount(alertCnt);
						*/
						job.setStatus(JobStatus.OVERDUE);
						jobRepository.save(job);

					} catch (Exception ex) {
						log.warn("Failed to create JOB ", ex);
					}
				}
			}
		}
	}

	@Transactional
	public void generateDetailedAttendanceReport(Date date, boolean shiftAlert, boolean dayReport, boolean onDemand) {
		if (env.getProperty("scheduler.attendanceDetailReport.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.setTime(date);
			// cal.add(Calendar.DAY_OF_MONTH, -1);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			Calendar dayEndcal = Calendar.getInstance();
			dayEndcal.setTime(date);
			// dayEndcal.add(Calendar.DAY_OF_MONTH, -1);
			dayEndcal.set(Calendar.HOUR_OF_DAY, 23);
			dayEndcal.set(Calendar.MINUTE, 59);
			dayEndcal.set(Calendar.SECOND, 0);
			dayEndcal.set(Calendar.MILLISECOND, 0);
			List<Project> projects = projectRepository.findAll();
			for (Project proj : projects) {
				int projEmployees = 0;
				int projPresent = 0;
				int projAbsent = 0;
				SearchCriteria sc = new SearchCriteria();
				sc.setCheckInDateTimeFrom(cal.getTime());
				sc.setCheckInDateTimeTo(cal.getTime());
				sc.setProjectId(proj.getId());
				// SearchResult<AttendanceDTO> searchResults =
				// attendanceService.findBySearchCrieria(sc);
				Hibernate.initialize(proj.getSite());
				Set<Site> sites = proj.getSite();
				Iterator<Site> siteItr = sites.iterator();
				List<Setting> settings = null;
				if (shiftAlert) {
					settings = settingRepository.findSettingByKeyAndProjectId(
							SettingsService.EMAIL_NOTIFICATION_SHIFTWISE_ATTENDANCE, proj.getId());
				} else if (dayReport) {
					settings = settingRepository.findSettingByKeyAndProjectId(
							SettingsService.EMAIL_NOTIFICATION_DAYWISE_ATTENDANCE, proj.getId());
				}
				Setting attendanceReports = null;
				if (CollectionUtils.isNotEmpty(settings)) {
					attendanceReports = settings.get(0);
				}
				if (attendanceReports != null && attendanceReports.getSettingValue().equalsIgnoreCase("true")) {
					Map<String, Map<String, Integer>> shiftWiseSummary = new HashMap<String, Map<String, Integer>>();
					List<EmployeeAttendanceReport> empAttnList = new ArrayList<EmployeeAttendanceReport>();
					List<EmployeeAttendanceReport> siteAttnList = null;
					List<Map<String, String>> siteShiftConsolidatedData = new ArrayList<Map<String, String>>();
					List<Map<String, String>> consolidatedData = new ArrayList<Map<String, String>>();
					Map<String, List<Map<String, String>>> siteWiseConsolidatedMap = new HashMap<String, List<Map<String, String>>>();
					StringBuilder content = new StringBuilder();
					while (siteItr.hasNext()) {
						Site site = siteItr.next();
						// if(site.getId() == 119) {
						// Hibernate.initialize(site.getShifts());
						Map<String, Long> employeeAttnCnt = extractAttendanceDataForReport(date, proj, site, cal, dayEndcal, siteAttnList, shiftWiseSummary, siteShiftConsolidatedData,
																		siteWiseConsolidatedMap, consolidatedData, empAttnList, content, shiftAlert);
						projEmployees += employeeAttnCnt.get("ProjEmployees");
						projPresent += employeeAttnCnt.get("ProjPresent");
						projAbsent += employeeAttnCnt.get("ProjAbsent");
					}
					List<Setting> emailAlertTimeSettings = null;
					// summary map
					if (shiftAlert) {
						settings = settingRepository.findSettingByKeyAndProjectId(
								SettingsService.EMAIL_NOTIFICATION_SHIFTWISE_ATTENDANCE_EMAILS, proj.getId());
					} else if (dayReport) {
						settings = settingRepository.findSettingByKeyAndProjectId(
								SettingsService.EMAIL_NOTIFICATION_DAYWISE_ATTENDANCE_EMAILS, proj.getId());
						emailAlertTimeSettings = settingRepository.findSettingByKeyAndProjectId(
								SettingsService.EMAIL_NOTIFICATION_DAYWISE_ATTENDANCE_ALERT_TIME, proj.getId());
					}
					Setting attendanceReportEmails = null;
					if (CollectionUtils.isNotEmpty(settings)) {
						attendanceReportEmails = settings.get(0);
					}
					Setting attnDayWiseAlertTime = null;
					if (CollectionUtils.isNotEmpty(emailAlertTimeSettings)) {
						attnDayWiseAlertTime = emailAlertTimeSettings.get(0);
					}

					Map<String, String> summaryMap = new HashMap<String, String>();
					// get total employee count
					long projEmpCnt = employeeRepository.findCountByProjectId(proj.getId());

					summaryMap.put("TotalEmployees", String.valueOf(projEmpCnt));
					summaryMap.put("TotalPresent", String.valueOf(projPresent));
					summaryMap.put("TotalAbsent", String.valueOf(projEmpCnt - projPresent));

					content = new StringBuilder("Client Name - " + proj.getName() + Constants.LINE_SEPARATOR);
					content.append("Total employees - " + projEmpCnt + Constants.LINE_SEPARATOR);
					content.append("Present - " + projPresent + Constants.LINE_SEPARATOR);
					content.append("Absent - " + (projEmpCnt - projPresent) + Constants.LINE_SEPARATOR);
					log.debug("Project Name  - " + proj.getName() + ", shift alert -" + shiftAlert + ", dayReport -"
							+ dayReport);
					// send reports in email.
					if (attendanceReportEmails != null && projEmployees > 0
							&& ((shiftAlert && siteShiftConsolidatedData.size() > 0) || dayReport)) {
						ExportResult exportResult = null;
						String alertTime = attnDayWiseAlertTime != null ? attnDayWiseAlertTime.getSettingValue() : null;
						Calendar now = Calendar.getInstance();
						now.setTime(date);
						now.set(Calendar.SECOND, 0);
						now.set(Calendar.MILLISECOND, 0);
						Calendar alertTimeCal = Calendar.getInstance();
						if (StringUtils.isNotEmpty(alertTime)) {
							try {
								Date alertDateTime = DateUtil.parseToDateTime(alertTime);
								alertTimeCal.setTime(alertDateTime);
								alertTimeCal.set(Calendar.DAY_OF_MONTH, now.get(Calendar.DAY_OF_MONTH));
								alertTimeCal.set(Calendar.MONTH, now.get(Calendar.MONTH));
								alertTimeCal.set(Calendar.YEAR, now.get(Calendar.YEAR));
								alertTimeCal.set(Calendar.SECOND, 0);
								alertTimeCal.set(Calendar.MILLISECOND, 0);
							} catch (Exception e) {
								log.error("Error while parsing attendance shift alert time configured for client : "
										+ proj.getName(), e);
							}
						}

						if (dayReport && (attnDayWiseAlertTime == null || alertTimeCal.equals(now) || onDemand)) {
							exportResult = exportUtil.writeAttendanceReportToFile(proj.getName(), empAttnList,
									consolidatedData, summaryMap, shiftWiseSummary, null, exportResult);
							mailService.sendAttendanceDetailedReportEmail(proj.getName(),
									attendanceReportEmails.getSettingValue(), content.toString(),
									exportResult.getFile(), null, cal.getTime(), summaryMap, shiftWiseSummary,
									siteWiseConsolidatedMap);
						} else if (shiftAlert || onDemand) {
							exportResult = exportUtil.writeAttendanceReportToFile(proj.getName(), empAttnList,
									consolidatedData, summaryMap, shiftWiseSummary, null, exportResult);
							mailService.sendAttendanceDetailedReportEmail(proj.getName(),
									attendanceReportEmails.getSettingValue(), content.toString(),
									exportResult.getFile(), null, cal.getTime(), summaryMap, shiftWiseSummary,
									siteWiseConsolidatedMap);

						}
					}
					// }
				}
			}
		}
	}

	private Map<String, Long> extractAttendanceDataForReport(Date date, Project proj, Site site, Calendar cal, Calendar dayEndCal, List<EmployeeAttendanceReport> siteAttnList, Map<String, Map<String, Integer>> shiftWiseSummary,
                                                             List<Map<String, String>> siteShiftConsolidatedData, Map<String, List<Map<String, String>>> siteWiseConsolidatedMap,
                                                             List<Map<String, String>> consolidatedData, List<EmployeeAttendanceReport> empAttnList, StringBuilder content,
                                                             boolean shiftAlert) {
		Map<String, Long> employeeAttnCount = new HashMap<String, Long>();
		long projEmployees = 0;
		long projPresent = 0;
		long projAbsent = 0;
		long empCntInShift = 0;
		long empCntNotInShift = 0;
		List<Shift> shifts = siteRepository.findShiftsBySite(site.getId());
		if (CollectionUtils.isNotEmpty(shifts)) {
			// List<Shift> shifts = site.getShifts();
           // empCntNotInShift = empShiftRepo.findEmployeeCountBySiteAndNotInShift(site.getId());

            content = new StringBuilder("Site Name - " + site.getName() + Constants.LINE_SEPARATOR);
			int shiftStartLeadTime = Integer.valueOf(env.getProperty("attendance.shiftStartLeadTime"));
			for (Shift shift : shifts) {
				empCntInShift = 0;
				String startTime = shift.getStartTime();
				String[] startTimeUnits = startTime.split(":");
				Calendar startCal = Calendar.getInstance();
				startCal.setTime(date);
				// startCal.add(Calendar.DAY_OF_MONTH, -1);
				// startCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTimeUnits[0]));
				// Subtracting shift lead time with the shift start time -- Karthick..
				startCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTimeUnits[0]));
				startCal.set(Calendar.MINUTE, Integer.parseInt(startTimeUnits[1]));
				startCal.set(Calendar.SECOND, 0);
				startCal.set(Calendar.MILLISECOND, 0);
				String endTime = shift.getEndTime();
				String[] endTimeUnits = endTime.split(":");
				Calendar endCal = Calendar.getInstance();
				endCal.setTime(date);
				// endCal.add(Calendar.DAY_OF_MONTH, -1);
				endCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(endTimeUnits[0]));
				endCal.set(Calendar.MINUTE, Integer.parseInt(endTimeUnits[1]));
				endCal.set(Calendar.SECOND, 0);
				endCal.set(Calendar.MILLISECOND, 0);
				if (endCal.before(startCal)) {
					endCal.add(Calendar.DAY_OF_MONTH, 1);
				}
				Calendar currCal = Calendar.getInstance();
				// currCal.add(Calendar.HOUR_OF_DAY, 1);
				long timeDiff = currCal.getTimeInMillis() - startCal.getTimeInMillis();
				// if(currCal.equals(startCal) || (timeDiff >= 0 && timeDiff <= 3600000)) {
				// long empCntInShift = 0;
				// //employeeRepository.findEmployeeCountBySiteAndShift(site.getId(),
				// shift.getStartTime(), shift.getEndTime());
				empCntInShift = empShiftRepo.findEmployeeCountBySiteAndShift(site.getId(),
						DateUtil.convertToSQLDate(startCal.getTime()),
						DateUtil.convertToSQLDate(endCal.getTime()));
				// if (empCntInShift == 0) {
				// empCntInShift = employeeRepository.findCountBySiteId(site.getId());
				// }
				startCal.add(Calendar.HOUR_OF_DAY, -shiftStartLeadTime);

				// long attendanceCount =
				// attendanceRepository.findCountBySiteAndCheckInTime(site.getId(),
				// DateUtil.convertToSQLDate(startCal.getTime()),
				// DateUtil.convertToSQLDate(endCal.getTime()));
				long attendanceCount = attendanceRepository.findCountBySiteAndShiftInTime(site.getId(),
						DateUtil.convertToSQLDate(startCal.getTime()),
						DateUtil.convertToSQLDate(endCal.getTime()), startTime, endTime);
				long absentCount = 0;
				if (empCntInShift >= attendanceCount) {
					absentCount = empCntInShift - attendanceCount;
				}

				// ExportResult exportResult = new ExportResult();
				// exportResult = exportUtil.writeAttendanceReportToFile(proj.getName(),
				// empAttnList, null, exportResult);
				// send reports in email.
				// content.append("Shift - " + shift.getStartTime() + " - " + shift.getEndTime()
				// + LINE_SEPARATOR);
				// content.append("Total employees - " + empCntInShift + LINE_SEPARATOR);
				// content.append("Present - " + attendanceCount + LINE_SEPARATOR);
				// content.append("Absent - " + absentCount + LINE_SEPARATOR);
				Map<String, String> data = new HashMap<String, String>();
				data.put("SiteName", site.getName());
				data.put("ShiftStartTime", StringUtil.formatShiftTime(shift.getStartTime()));
				data.put("ShiftEndTime", StringUtil.formatShiftTime(shift.getEndTime()));
				data.put("TotalEmployees", String.valueOf(empCntInShift));
				data.put("Present", String.valueOf(attendanceCount));
				data.put("Absent", String.valueOf(absentCount));

				String shiftTime = shift.getStartTime() + "-" + shift.getEndTime();
				Map<String, Integer> shiftWiseCount = null;
				if (shiftWiseSummary.containsKey(shiftTime)) {
					shiftWiseCount = shiftWiseSummary.get(shiftTime);
				} else {
					shiftWiseCount = new HashMap<String, Integer>();
				}
				int shiftWiseTotalEmpCnt = shiftWiseCount.containsKey("TotalEmployees")
						? shiftWiseCount.get("TotalEmployees")
						: 0;
				int shiftWisePresentEmpCnt = shiftWiseCount.containsKey("Present")
						? shiftWiseCount.get("Present")
						: 0;
				int shiftWiseAbsentEmpCnt = shiftWiseCount.containsKey("Absent")
						? shiftWiseCount.get("Absent")
						: 0;

				shiftWiseTotalEmpCnt += empCntInShift;
				shiftWisePresentEmpCnt += attendanceCount;
				shiftWiseAbsentEmpCnt += absentCount;
				shiftWiseCount.put("TotalEmployees", shiftWiseTotalEmpCnt);
				shiftWiseCount.put("Present", shiftWisePresentEmpCnt);
				shiftWiseCount.put("Absent", shiftWiseAbsentEmpCnt);
				shiftWiseSummary.put(shiftTime, shiftWiseCount);
				projEmployees += empCntInShift;
				projPresent += attendanceCount;
				projAbsent += absentCount;
				if (shiftAlert && timeDiff >= 1800000 && timeDiff < 3200000) { // within 1 hour of the
																				// shift start timing.)
					// shiftAlert = true;
					siteShiftConsolidatedData.add(data);
				}
				List<Map<String, String>> siteShiftData = null;
				if (siteWiseConsolidatedMap.containsKey(site.getName())) {
					siteShiftData = siteWiseConsolidatedMap.get(site.getName());
				} else {
					siteShiftData = new ArrayList<Map<String, String>>();
				}
				siteShiftData.add(data);
				siteWiseConsolidatedMap.put(site.getName(), siteShiftData);

				consolidatedData.add(data);
				log.debug("Site Name  - " + site.getName() + ", -shift start time -"
						+ shift.getStartTime() + ", shift end time -" + shift.getEndTime()
						+ ", shift alert -" + shiftAlert);
				// }
			}
            projEmployees = employeeRepository.findCountBySiteId(site.getId());

        } else {
			empCntInShift = employeeRepository.findCountBySiteId(site.getId());

			long attendanceCount = attendanceRepository.findCountBySiteAndCheckInTime(site.getId(),
					DateUtil.convertToSQLDate(cal.getTime()),
					DateUtil.convertToSQLDate(dayEndCal.getTime()));
			// List<EmployeeAttendanceReport> empAttnList =
			// attendanceRepository.findBySiteId(site.getId(),
			// DateUtil.convertToSQLDate(cal.getTime()),
			// DateUtil.convertToSQLDate(cal.getTime()));
			long absentCount = empCntInShift - attendanceCount;

			// ExportResult exportResult = new ExportResult();
			// exportResult = exportUtil.writeAttendanceReportToFile(proj.getName(),
			// empAttnList, null, exportResult);
			// send reports in email.
			// content = new StringBuilder("Site Name - " + site.getName() +
			// LINE_SEPARATOR);
			// content.append("Total employees - " + empCntInShift + LINE_SEPARATOR);
			// content.append("Present - " + attendanceCount + LINE_SEPARATOR);
			// content.append("Absent - " + absentCount + LINE_SEPARATOR);
			Map<String, String> data = new HashMap<String, String>();
			data.put("SiteName", site.getName());
			data.put("TotalEmployees", String.valueOf(empCntInShift));
			data.put("Present", String.valueOf(attendanceCount));
			data.put("Absent", String.valueOf(absentCount));
			projEmployees += empCntInShift;
			projPresent += attendanceCount;
			projAbsent += absentCount;

			consolidatedData.add(data);

		}
		siteAttnList = attendanceRepository.findBySiteId(site.getId(),
				DateUtil.convertToSQLDate(cal.getTime()),
				DateUtil.convertToSQLDate(dayEndCal.getTime()));
		List<Long> empPresentList = new ArrayList<Long>();
		if (CollectionUtils.isNotEmpty(siteAttnList)) {
			for (EmployeeAttendanceReport empAttn : siteAttnList) {
				empPresentList.add(empAttn.getEmpId());
			}
		}
		List<Employee> empNotMarkedAttn = null;
		if (CollectionUtils.isNotEmpty(empPresentList)) {
			empNotMarkedAttn = employeeRepository.findNonMatchingBySiteId(site.getId(), empPresentList);
		} else {
			empNotMarkedAttn = employeeRepository.findBySiteId(site.getId());
		}
		if (CollectionUtils.isNotEmpty(empNotMarkedAttn)) {
			// List<Shift> shifts = site.getShifts();
			shifts = siteRepository.findShiftsBySite(site.getId());
			for (Employee emp : empNotMarkedAttn) {
				List<EmployeeShift> empShift = null;
				for (Shift shift : shifts) {
					String startTime = shift.getStartTime();
					String[] startTimeUnits = startTime.split(":");
					Calendar startCal = Calendar.getInstance();
					startCal.setTime(date);
					// startCal.add(Calendar.DAY_OF_MONTH, -1);
					startCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTimeUnits[0]));
					startCal.set(Calendar.MINUTE, Integer.parseInt(startTimeUnits[1]));
					startCal.set(Calendar.SECOND, 0);
					startCal.set(Calendar.MILLISECOND, 0);
					String endTime = shift.getEndTime();
					String[] endTimeUnits = endTime.split(":");
					Calendar endCal = Calendar.getInstance();
					endCal.setTime(date);
					// endCal.add(Calendar.DAY_OF_MONTH, -1);
					endCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(endTimeUnits[0]));
					endCal.set(Calendar.MINUTE, Integer.parseInt(endTimeUnits[1]));
					endCal.set(Calendar.SECOND, 0);
					endCal.set(Calendar.MILLISECOND, 0);
					if (endCal.before(startCal)) {
						endCal.add(Calendar.DAY_OF_MONTH, 1);
					}
					empShift = empShiftRepo.findEmployeeShiftBySiteAndShift(site.getId(), emp.getId(),
							DateUtil.convertToTimestamp(startCal.getTime()),
							DateUtil.convertToTimestamp(endCal.getTime()));
					if (empShift != null) {
						break;
					}
				}

				if (empShift != null) { //only if a matching shift is found for the employee the employee detail needs to be added to the report
					EmployeeAttendanceReport empAttnRep = new EmployeeAttendanceReport();
					empAttnRep.setEmpId(emp.getId());
					empAttnRep.setEmployeeId(emp.getEmpId());
					empAttnRep.setName(emp.getName());
					empAttnRep.setLastName(emp.getLastName());
					empAttnRep.setReliever(emp.isReliever());
					empAttnRep.setDesignation(emp.getDesignation());
					empAttnRep.setStatus(EmployeeAttendanceReport.ABSENT_STATUS);
					empAttnRep.setSiteName(site.getName());
					Timestamp startTime = empShift.get(0).getStartTime();
					Calendar startCal = Calendar.getInstance();
					startCal.setTimeInMillis(startTime.getTime());
					empAttnRep.setShiftStartTime(
							startCal.get(Calendar.HOUR_OF_DAY) + ":" + startCal.get(Calendar.MINUTE));
					Timestamp endTime = empShift.get(0).getEndTime();
					Calendar endCal = Calendar.getInstance();
					endCal.setTimeInMillis(endTime.getTime());
					empAttnRep.setShiftEndTime(
							endCal.get(Calendar.HOUR_OF_DAY) + ":" + endCal.get(Calendar.MINUTE));
					empAttnRep.setProjectName(proj.getName());
					siteAttnList.add(empAttnRep);
				}
			}
		}
		log.debug("send detailed report");
		empAttnList.addAll(siteAttnList);
		employeeAttnCount.put("ProjEmployees", projEmployees);
		employeeAttnCount.put("ProjPresent", projPresent);
		if(projEmployees<projPresent){
		    long abscnt = 0;
            employeeAttnCount.put("ProjAbsent",abscnt );

        }else{
            employeeAttnCount.put("ProjAbsent", projEmployees - projPresent);
        }
		return employeeAttnCount;
	}

	@Transactional
	public void generateMusterRollAttendanceReport(long siteId, Date fromDate, Date toDate, boolean dayReport,
			boolean onDemand) {
		if (env.getProperty("scheduler.attendanceMusterRollReport.enabled").equalsIgnoreCase("true")) {
			boolean exportAllSites = false;
			boolean exportMatchingSite = false;

			Calendar cal = Calendar.getInstance();
			cal.setTime(fromDate);
			// cal.add(Calendar.DAY_OF_MONTH, -1);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			String month = cal.getDisplayName(Calendar.MONTH, Calendar.LONG_STANDALONE, Locale.US);
			Calendar dayEndcal = Calendar.getInstance();
			dayEndcal.setTime(toDate);
			// dayEndcal.add(Calendar.DAY_OF_MONTH, -1);
			dayEndcal.set(Calendar.HOUR_OF_DAY, 23);
			dayEndcal.set(Calendar.MINUTE, 59);
			dayEndcal.set(Calendar.SECOND, 0);
			dayEndcal.set(Calendar.MILLISECOND, 0);
			List<Project> projects = projectRepository.findAll();
			for (Project proj : projects) {
				int projEmployees = 0;
				int projPresent = 0;
				int projAbsent = 0;
				SearchCriteria sc = new SearchCriteria();
				sc.setCheckInDateTimeFrom(cal.getTime());
				sc.setCheckInDateTimeTo(cal.getTime());
				sc.setProjectId(proj.getId());
				// SearchResult<AttendanceDTO> searchResults =
				// attendanceService.findBySearchCrieria(sc);
				Hibernate.initialize(proj.getSite());
				Set<Site> sites = proj.getSite();
				Iterator<Site> siteItr = sites.iterator();
				List<Setting> settings = null;
				if (dayReport) {
					if(siteItr.hasNext()) {
						Site siteItrId = siteItr.next();
						if(siteItrId != null) {
							settings = settingRepository.findSettingByKeyAndSiteIdOrProjectId(
									SettingsService.EMAIL_NOTIFICATION_MUSTER_ROLL, siteItrId.getId(), proj.getId());
						}
					}
				}
				Setting attendanceReports = null;
				if (CollectionUtils.isNotEmpty(settings)) {
					attendanceReports = settings.get(0);
				}
				long empCntInShift = 0;
				if (attendanceReports != null && attendanceReports.getSettingValue().equalsIgnoreCase("true")) {
					Map<String, Map<String, Integer>> shiftWiseSummary = new HashMap<String, Map<String, Integer>>();
					List<EmployeeAttendanceReport> empAttnList = new ArrayList<EmployeeAttendanceReport>();
					List<EmployeeAttendanceReport> siteAttnList = null;
					StringBuilder content = new StringBuilder();
					siteItr = sites.iterator();
					while (siteItr.hasNext()) {
						Site site = siteItr.next();

						if (siteId > 0 && onDemand && site.getId() == siteId) {
							exportMatchingSite = true;
						} else if (siteId == 0 && !onDemand) {
							exportAllSites = true;
						}
						StringBuilder shiftValues = new StringBuilder();
						LinkedHashMap<Map<String, String>, String> shiftSlot = new LinkedHashMap<Map<String,String>, String>();

						if (exportAllSites || exportMatchingSite) {
							List<Shift> shifts = siteRepository.findShiftsBySite(site.getId());
							int i = 1;
							if (CollectionUtils.isNotEmpty(shifts)) {
								for (Shift shift : shifts) {
									Map<String, String> shiftTime = new LinkedHashMap<String, String>();
									shiftValues.append(shift.getStartTime() + " TO " + shift.getEndTime());
									shiftValues.append("    ");
									shiftTime.put(shift.getStartTime(), shift.getEndTime());
									shiftSlot.put(shiftTime, "S"+i);
									i++;
								}
							} else {
								Map<String, String> shiftTime = new LinkedHashMap<String, String>();
								String startTime = env.getProperty("attendance.generalShift.startTime");
								String endTime = env.getProperty("attendance.generalShift.endTime");
//								shiftValues.append(startTime+ " TO " + endTime);
								shiftValues.append(" ");
								shiftTime.put(startTime, endTime);
								shiftSlot.put(shiftTime, "S"+i);
							}

							siteAttnList = attendanceRepository.findBySiteId(site.getId(),
									DateUtil.convertToSQLDate(cal.getTime()),
									DateUtil.convertToSQLDate(dayEndcal.getTime()));
							List<Long> empPresentList = new ArrayList<Long>();
							if (CollectionUtils.isNotEmpty(siteAttnList)) {
								for (EmployeeAttendanceReport empAttn : siteAttnList) {
									empPresentList.add(empAttn.getEmpId());
								}
							}
							List<Employee> empNotMarkedAttn = null;
							if (CollectionUtils.isNotEmpty(empPresentList)) {
								empNotMarkedAttn = employeeRepository.findNonMatchingBySiteId(site.getId(),
										empPresentList);
							} else {
								empNotMarkedAttn = employeeRepository.findBySiteId(site.getId());
							}
							if (CollectionUtils.isNotEmpty(empNotMarkedAttn)) {
								// List<Shift> shifts = site.getShifts();
								shifts = siteRepository.findShiftsBySite(site.getId());
								for (Employee emp : empNotMarkedAttn) {
									List<EmployeeShift> empShift = null;
									for (Shift shift : shifts) {
										String startTime = shift.getStartTime();
										String[] startTimeUnits = startTime.split(":");
										Calendar startCal = Calendar.getInstance();
										startCal.setTime(fromDate);
										// startCal.add(Calendar.DAY_OF_MONTH, -1);
										startCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTimeUnits[0]));
										startCal.set(Calendar.MINUTE, Integer.parseInt(startTimeUnits[1]));
										startCal.set(Calendar.SECOND, 0);
										startCal.set(Calendar.MILLISECOND, 0);
										String endTime = shift.getEndTime();
										String[] endTimeUnits = endTime.split(":");
										Calendar endCal = Calendar.getInstance();
										endCal.setTime(fromDate);
										// endCal.add(Calendar.DAY_OF_MONTH, -1);
										endCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(endTimeUnits[0]));
										endCal.set(Calendar.MINUTE, Integer.parseInt(endTimeUnits[1]));
										endCal.set(Calendar.SECOND, 0);
										endCal.set(Calendar.MILLISECOND, 0);
										if (endCal.before(startCal)) {
											endCal.add(Calendar.DAY_OF_MONTH, 1);
										}
										empShift = empShiftRepo.findEmployeeShiftBySiteAndShift(site.getId(),
												emp.getId(), DateUtil.convertToTimestamp(startCal.getTime()),
												DateUtil.convertToTimestamp(endCal.getTime()));
										if (empShift != null) {
											break;
										}
									}

									EmployeeAttendanceReport empAttnRep = new EmployeeAttendanceReport();
									if(emp.getDesignation() != "Help Desk" || emp.getDesignation() != "Supervisor") {
                                        empAttnRep.setEmpId(emp.getId());
                                        empAttnRep.setEmployeeId(emp.getEmpId());
                                        empAttnRep.setName(emp.getName());
                                        empAttnRep.setLastName(emp.getLastName());
                                        empAttnRep.setDesignation(emp.getDesignation());
                                        empAttnRep.setStatus(EmployeeAttendanceReport.ABSENT_STATUS);
                                        empAttnRep.setSiteName(site.getName());
                                        if (CollectionUtils.isNotEmpty(empShift)) {
                                            Timestamp startTime = empShift.get(0).getStartTime();
                                            Calendar startCal = Calendar.getInstance();
                                            startCal.setTimeInMillis(startTime.getTime());
                                            empAttnRep.setShiftStartTime(startCal.get(Calendar.HOUR_OF_DAY) + ":"
                                                + startCal.get(Calendar.MINUTE));
                                            Timestamp endTime = empShift.get(0).getEndTime();
                                            Calendar endCal = Calendar.getInstance();
                                            endCal.setTimeInMillis(endTime.getTime());
                                            empAttnRep.setShiftEndTime(
                                                endCal.get(Calendar.HOUR_OF_DAY) + ":" + endCal.get(Calendar.MINUTE));

                                        } else {
                                            empAttnRep.setShiftStartTime("attendance.generalShift.startTime");
                                            empAttnRep.setShiftEndTime("attendance.generalShift.endTime");
                                        }
                                        empAttnRep.setProjectName(proj.getName());
                                        siteAttnList.add(empAttnRep);
                                    }

								}
							}
						}

						if (exportAllSites || exportMatchingSite) {

							List<Setting> emailAlertTimeSettings = null;
							// summary map
							if (dayReport) {
								settings = settingRepository.findSettingByKeyAndSiteIdOrProjectId(
										SettingsService.EMAIL_NOTIFICATION_MUSTER_ROLL_EMAILS, site.getId(), proj.getId());
//								emailAlertTimeSettings = settingRepository.findSettingByKeyAndSiteIdOrProjectId(
//										SettingsService.EMAIL_NOTIFICATION_DAYWISE_ATTENDANCE_ALERT_TIME, site.getId(), proj.getId());
							}
							Setting attendanceReportEmails = null;
							if (CollectionUtils.isNotEmpty(settings)) {
								attendanceReportEmails = settings.get(0);
							}
//							Setting attnDayWiseAlertTime = null;
//							if (CollectionUtils.isNotEmpty(emailAlertTimeSettings)) {
//								attnDayWiseAlertTime = emailAlertTimeSettings.get(0);
//							}

							// get total employee count
							long projEmpCnt = employeeRepository.findCountByProjectId(proj.getId());

							content = new StringBuilder("Client Name - " + proj.getName() + Constants.LINE_SEPARATOR);
							content.append("Total employees - " + projEmpCnt + Constants.LINE_SEPARATOR);
							content.append("Present - " + projPresent + Constants.LINE_SEPARATOR);
							content.append("Absent - " + (projEmpCnt - projPresent) + Constants.LINE_SEPARATOR);
							log.debug("Project Name  - " + proj.getName() + ", dayReport -" + dayReport);
							// send reports in email.
							if (attendanceReportEmails != null && projEmpCnt > 0) {
								ExportResult exportResult = null;
								String alertTime = null;
								Calendar now = Calendar.getInstance();
								now.set(Calendar.SECOND, 0);
								now.set(Calendar.MILLISECOND, 0);
								Calendar alertTimeCal = Calendar.getInstance();
								alertTimeCal.set(Calendar.SECOND, 0);
								alertTimeCal.set(Calendar.MILLISECOND, 0);
								if (StringUtils.isNotEmpty(alertTime)) {
									try {
										Date alertDateTime = DateUtil.parseToDateTime(alertTime);
										alertTimeCal.setTime(alertDateTime);
										alertTimeCal.set(Calendar.DAY_OF_MONTH, now.get(Calendar.DAY_OF_MONTH));
										alertTimeCal.set(Calendar.MONTH, now.get(Calendar.MONTH));
										alertTimeCal.set(Calendar.YEAR, now.get(Calendar.YEAR));
										alertTimeCal.set(Calendar.SECOND, 0);
										alertTimeCal.set(Calendar.MILLISECOND, 0);
									} catch (Exception e) {
										log.error(
												"Error while parsing attendance shift alert time configured for client : "
														+ proj.getName(),
												e);
									}
								}

//								log.debug("This site not having employees ", siteAttnList);

								if(siteAttnList.isEmpty()) {
									log.debug("This site not having employees ", siteAttnList);
								} else {
                                    ListIterator<EmployeeAttendanceReport> iterator = siteAttnList.listIterator();
                                    while(iterator.hasNext())
                                    {
                                        EmployeeAttendanceReport employee = iterator.next();
                                        User user = userRepository.findByLogin(employee.getEmployeeId());
                                        if (user.getUserRole().equals(env.getProperty("roles.exclude.role1")))
                                        {
                                            iterator.remove();
                                        }
                                        if (user.getUserRole().equals(env.getProperty("roles.exclude.role2"))) {
                                            iterator.remove();
                                        }
                                        if (user.getUserRole().equals(env.getProperty("roles.exclude.role3"))) {
                                            iterator.remove();
                                        }
                                    }
                                }

								if (dayReport && !siteAttnList.isEmpty() || onDemand) {
									exportResult = exportUtil.writeMusterRollAttendanceReportToFile(proj.getName(),
											site.getName(), shiftValues.toString(), month, fromDate, toDate,
											siteAttnList, null, exportResult, shiftSlot);
									mailService.sendAttendanceMusterrollReportEmail(proj.getName(),
											attendanceReportEmails.getSettingValue(), content.toString(),
											exportResult.getFile(), null, month);
								}
							}
						}

						if (exportMatchingSite) {
							break;
						}

					}

					// }
				}
				if (exportMatchingSite) {
					break;
				}
			}
		}
	}

	@Transactional
	public void autoCheckOutAttendance() {
		Calendar currCal = Calendar.getInstance();
		Calendar startCal = Calendar.getInstance();
		startCal.set(Calendar.HOUR_OF_DAY, 0);
		startCal.set(Calendar.MINUTE, 0);
		Calendar endCal = Calendar.getInstance();
		endCal.set(Calendar.HOUR_OF_DAY, 23);
		endCal.set(Calendar.MINUTE, 59);
		Calendar prevDayEndCal = Calendar.getInstance();
		prevDayEndCal.add(Calendar.DAY_OF_MONTH, -1);
		prevDayEndCal.set(Calendar.HOUR_OF_DAY, 23);
		prevDayEndCal.set(Calendar.MINUTE, 59);

		java.sql.Date startDate = new java.sql.Date(startCal.getTimeInMillis());
		java.sql.Date endDate = new java.sql.Date(endCal.getTimeInMillis());
		java.sql.Date currDate = new java.sql.Date(currCal.getTimeInMillis());
		List<Attendance> dailyAttnList = attendanceRepository.findByCheckInDateAndNotCheckout(currDate);
		log.debug("Found {} Daily Attendance", dailyAttnList.size());

		if (CollectionUtils.isNotEmpty(dailyAttnList)) {
			for (Attendance dailyAttn : dailyAttnList) {
				try {
					Hibernate.initialize(dailyAttn.getEmployee());
					Employee emp = dailyAttn.getEmployee();
					Calendar checkInCal = Calendar.getInstance();
					checkInCal.setTimeInMillis(dailyAttn.getCheckInTime().getTime());
					log.debug("checkin cal - " + checkInCal.getTime());
					if (emp != null) {
						Hibernate.initialize(emp.getProjectSites());
						List<EmployeeProjectSite> projSites = emp.getProjectSites();
						for (EmployeeProjectSite projSite : projSites) {
							Site site = projSite.getSite();
							// List<Shift> shifts = site.getShifts();
							List<Shift> shifts = siteRepository.findShiftsBySite(site.getId());
							boolean empShiftMatch = false;
							for (Shift shift : shifts) {
								String startTime = shift.getStartTime();
								String[] startTimeUnits = startTime.split(":");
								Calendar shiftStartCal = Calendar.getInstance();
								// shiftStartCal.add(Calendar.DAY_OF_MONTH, -1);
								shiftStartCal.setTimeInMillis(dailyAttn.getCheckInTime().getTime());
								shiftStartCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTimeUnits[0]));
								shiftStartCal.set(Calendar.MINUTE, Integer.parseInt(startTimeUnits[1]));
								shiftStartCal.set(Calendar.SECOND, 0);
								shiftStartCal.set(Calendar.MILLISECOND, 0);
								String endTime = shift.getEndTime();
								String[] endTimeUnits = endTime.split(":");
								Calendar shiftEndCal = Calendar.getInstance();
								shiftEndCal.setTimeInMillis(dailyAttn.getCheckInTime().getTime());
								// shiftEndCal.add(Calendar.DAY_OF_MONTH, -1);
								shiftEndCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(endTimeUnits[0]));
								shiftEndCal.set(Calendar.MINUTE, Integer.parseInt(endTimeUnits[1]));
								shiftEndCal.set(Calendar.SECOND, 0);
								shiftEndCal.set(Calendar.MILLISECOND, 0);
								if (shiftEndCal.before(shiftStartCal)) {
									shiftEndCal.add(Calendar.DAY_OF_MONTH, 1);
								}
								log.debug("site - " + site.getId());
								log.debug("shift start time - " + DateUtil.convertToTimestamp(shiftStartCal.getTime()));
								log.debug("shift end time - " + DateUtil.convertToTimestamp(shiftEndCal.getTime()));
								List<EmployeeShift> empShift = empShiftRepo.findEmployeeShiftBySiteAndShift(site.getId(),
										emp.getId(), DateUtil.convertToTimestamp(shiftStartCal.getTime()),
										DateUtil.convertToTimestamp(shiftEndCal.getTime()));
								log.debug("EmpShift - " + empShift);
								if (empShift != null) { // if employee shift assignment matches with site shift
									log.debug("Employee shift found");
									log.debug("Shift end time " + shiftEndCal.getTime());
									log.debug("Current time " + currCal.getTime());
									log.debug("checkiin time " + checkInCal.getTime());
									// shift end time
									if (checkInCal.before(shiftEndCal) && shiftEndCal.before(currCal)) { // if the
																											// employee
																											// checked
																											// in before
																											// the
										// send alert
										log.debug("Shift end time " + shiftEndCal.getTime());
										log.debug("Current time " + currCal.getTime());
										if (currCal.after(endCal)) { // if the shift ends beforee EOD midnight.
											// check out automatically
											// dailyAttn.setCheckOutTime(new Timestamp(currCal.getTimeInMillis()));
											// dailyAttn.setShiftEndTime(endTime);
											// dailyAttn.setLatitudeOut(dailyAttn.getLatitudeOut());
											// dailyAttn.setLongitudeOut(dailyAttn.getLongitudeOut());
											dailyAttn.setNotCheckedOut(true); // mark the attendance as not checked out.
											attendanceRepository.save(dailyAttn);
										} else if (checkInCal.before(prevDayEndCal) && currCal.after(prevDayEndCal)
												&& shiftEndCal.before(prevDayEndCal)) {
											dailyAttn.setNotCheckedOut(true); // mark the attendance as not checked out.
											attendanceRepository.save(dailyAttn);
										}
										// send email notifications
										Map<String, Object> values = new HashMap<String, Object>();
										values.put("checkInTime",
												DateUtil.formatToDateTimeString(checkInCal.getTime()));
										values.put("site", site.getName());
										mailService.sendAttendanceCheckouAlertEmail(emp.getEmail(), values);
										long userId = emp.getUser().getId();
										long[] userIds = new long[1];
										userIds[0] = userId;
										pushService.sendAttendanceCheckoutAlert(userIds, values);
										empShiftMatch = true;
										break;
									} else {
										log.debug("Shift end time else condition");
									}
									empShiftMatch = true;
								}
							}
							if (!empShiftMatch) {
								if (checkInCal.before(prevDayEndCal) && currCal.after(prevDayEndCal)) {
									dailyAttn.setNotCheckedOut(true); // mark the attendance as not checked out.
									// send email notifications
									Map<String, Object> values = new HashMap<String, Object>();
									values.put("checkInTime", DateUtil.formatToDateTimeString(checkInCal.getTime()));
									values.put("site", site.getName());
									mailService.sendAttendanceCheckouAlertEmail(emp.getEmail(), values);
									long userId = emp.getUser().getId();
									long[] userIds = new long[1];
									userIds[0] = userId;
									pushService.sendAttendanceCheckoutAlert(userIds, values);
									break;
								}
							}

						}
					}

				} catch (Exception ex) {
					log.warn("Failed to checkout daily attendance  ", ex);
				}
			}
		}
	}


	@Transactional
	public void sendWarrantyExpireAlert() {
		// TODO Auto-generated method stub
		List<Asset> assets = assetRepository.findAll();
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Date date = new Date();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		Date currDate = calendar.getTime();
		String cDate = dateFormat.format(currDate);
		log.debug("Current Date -" + cDate);
		for (Asset asset : assets) {
			AssetDTO assetModel = mapperUtil.toModel(asset, AssetDTO.class);
			if (asset.getWarrantyToDate() != null) {
				Calendar calendar1 = Calendar.getInstance();
				calendar1.setTime(asset.getWarrantyToDate());
				calendar1.add(Calendar.DAY_OF_YEAR, -1);
				Date prevDate = calendar1.getTime();
				log.debug("Previous Date -" + prevDate);
				String fDate = dateFormat.format(prevDate);
				String warrantyDate = dateFormat.format(asset.getWarrantyToDate());
				log.debug("Formatted date -" + fDate);
				log.debug("Validation " + currDate + "  " + prevDate);
				if (currDate.equals(prevDate)) {
					Setting setting = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_WARRANTY);
					if (setting != null) {
						if (setting.getSettingValue().equalsIgnoreCase("true")) {
							Setting settingEntity = settingRepository
									.findSettingByKey(EMAIL_NOTIFICATION_WARRANTY_EMAILS);
							if (settingEntity.getSettingValue().length() > 0) {
								List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(),
										",");
								for (String email : emailLists) {
									mailService.sendAssetWarrantyExpireAlert(email, asset.getTitle(),
											assetModel.getSiteName(), asset.getCode(), warrantyDate);
								}
							} else {
								log.info("There is no email ids registered");
							}
						}
					}
				}

			}
		}
	}

	@Transactional
	public void sendSchedulePPMJobsAlert() {
		// TODO Auto-generated method stub
		String ppmType = MaintenanceType.PPM.getValue();
		List<Job> ppmJobs = jobRepository.findAllPPMJobs(ppmType);
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Date date = new Date();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		Date currDate = calendar.getTime();
		String cDate = dateFormat.format(currDate);
		log.debug("Current Date -" + cDate);
		for (Job ppmJob : ppmJobs) {
			JobDTO jobModel = mapperUtil.toModel(ppmJob, JobDTO.class);
			Calendar calendar1 = Calendar.getInstance();
			calendar1.setTime(ppmJob.getPlannedStartTime());
			calendar1.add(Calendar.DAY_OF_YEAR, -1);
			calendar1.set(Calendar.HOUR_OF_DAY, 0);
			calendar1.set(Calendar.MINUTE, 0);
			calendar1.set(Calendar.SECOND, 0);
			calendar1.set(Calendar.MILLISECOND, 0);
			Date prevDate = calendar1.getTime();
			log.debug("Previous Date -" + prevDate);
			String fDate = dateFormat.format(prevDate);
			log.debug("Formatted date -" + fDate);
			log.debug("Validation " + currDate + "  " + prevDate);
			if (currDate.equals(prevDate)) {
				if (jobModel.getEmployeeId() > 0) {
					Employee emp = employeeRepository.findOne(jobModel.getEmployeeId());
					if (emp.getEmail() != null) {
						mailService.sendPreviousDayJobAlert(emp.getEmail(), emp.getId(), emp.getFullName(),
								jobModel.getId(), jobModel.getPlannedStartTime());
					} else {
						Setting setting = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_PPM);
						if (setting != null && setting.getSettingValue().equalsIgnoreCase("true")) {
							Setting settingEntity = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_PPM_EMAILS);
							if (settingEntity.getSettingValue().length() > 0) {
								List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(),
										",");
								for (String email : emailLists) {
									mailService.sendPreviousDayJobAlert(email, emp.getId(), emp.getFullName(),
											jobModel.getId(), jobModel.getPlannedStartTime());
								}
							} else {
								log.info("There is no PPM Jobs email ids registered");
							}
						}
					}
				} else {
					Setting setting = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_PPM);
					if (setting != null && setting.getSettingValue().equalsIgnoreCase("true")) {
						Setting settingEntity = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_PPM_EMAILS);
						if (settingEntity.getSettingValue().length() > 0) {
							List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(), ",");
							for (String email : emailLists) {
								mailService.sendEmployeeAssignAlert(email, jobModel.getId(),
										jobModel.getPlannedStartTime());
							}
						} else {
							log.info("There is no PPM Jobs email ids registered");
						}
					}
				}
			}
		}
	}

	@Transactional
	public void sendScheduleAMCJobsAlert() {
		// TODO Auto-generated method stub
		String amcType = MaintenanceType.AMC.getValue();
		List<Job> amcJobs = jobRepository.findAllAMCJobs(amcType);
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Date date = new Date();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		Date currDate = calendar.getTime();
		String cDate = dateFormat.format(currDate);
		log.debug("Current Date -" + cDate);
		for (Job amcJob : amcJobs) {
			JobDTO jobModel = mapperUtil.toModel(amcJob, JobDTO.class);
			Calendar calendar1 = Calendar.getInstance();
			calendar1.setTime(amcJob.getPlannedStartTime());
			calendar1.add(Calendar.DAY_OF_YEAR, -1);
			calendar1.set(Calendar.HOUR_OF_DAY, 0);
			calendar1.set(Calendar.MINUTE, 0);
			calendar1.set(Calendar.SECOND, 0);
			calendar1.set(Calendar.MILLISECOND, 0);
			Date prevDate = calendar1.getTime();
			log.debug("Previous Date -" + prevDate);
			String fDate = dateFormat.format(prevDate);
			log.debug("Formatted date -" + fDate);
			log.debug("Validation " + currDate + "  " + prevDate);
			if (currDate.equals(prevDate)) {
				if (jobModel.getEmployeeId() > 0) {
					Employee emp = employeeRepository.findOne(jobModel.getEmployeeId());
					if (emp.getEmail() != null) {
						mailService.sendPreviousDayJobAlert(emp.getEmail(), emp.getId(), emp.getFullName(),
								jobModel.getId(), jobModel.getPlannedStartTime());
					} else {
						Setting setting = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_AMC);
						if (setting != null && setting.getSettingValue().equalsIgnoreCase("true")) {
							Setting settingEntity = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_AMC_EMAILS);
							if (settingEntity.getSettingValue().length() > 0) {
								List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(),
										",");
								for (String email : emailLists) {
									mailService.sendPreviousDayJobAlert(email, emp.getId(), emp.getFullName(),
											jobModel.getId(), jobModel.getPlannedStartTime());
								}
							} else {
								log.info("There is no AMC Jobs email ids registered");
							}
						}
					}
				} else {
					Setting setting = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_AMC);
					if (setting != null && setting.getSettingValue().equalsIgnoreCase("true")) {
						Setting settingEntity = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_AMC_EMAILS);
						if (settingEntity.getSettingValue().length() > 0) {
							List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(), ",");
							for (String email : emailLists) {
								mailService.sendEmployeeAssignAlert(email, jobModel.getId(),
										jobModel.getPlannedStartTime());
							}
						} else {
							log.info("There is no AMC Jobs email ids registered");
						}
					}
				}
			}
		}
	}

	public void sendDaywiseReportEmail(Date date, boolean isOnDemand, long projectId) {
		// TODO Auto-generated method stub
		Calendar reportCal = Calendar.getInstance();
		reportCal.setTime(date);
		if(!isOnDemand && reportCal.get(Calendar.DAY_OF_WEEK) == 1) { //FILTER TO AVOID DAILY REPORTS ON SUNDAYS
			return;
		}
		dayWiseJQTReport(date, isOnDemand, projectId);
	}

	public void dayWiseJQTReport(Date date, boolean isOnDemand, long projectId) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		// cal.add(Calendar.DAY_OF_MONTH, -1);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		Calendar dayEndcal = Calendar.getInstance();
		dayEndcal.setTime(date);
		// dayEndcal.add(Calendar.DAY_OF_MONTH, -1);
		dayEndcal.set(Calendar.HOUR_OF_DAY, 23);
		dayEndcal.set(Calendar.MINUTE, 59);
		dayEndcal.set(Calendar.SECOND, 0);
		dayEndcal.set(Calendar.MILLISECOND, 0);

		Calendar now = Calendar.getInstance();
		now.setTime(date);
		now.set(Calendar.SECOND, 0);
		now.set(Calendar.MILLISECOND, 0);

		Map<String, ClientgroupDTO> clientGroupMap = new HashMap<String, ClientgroupDTO>();

		List<Project> projects = projectRepository.findAll();
		for (Project proj : projects) {
			log.info("Generating daily report for client -"+ proj.getName());

			if(projectId > 0 && projectId != proj.getId()) {
				continue;
			}


			StringBuffer sb = new StringBuffer();
			sb.append("<table border=\"1\" cellpadding=\"5\"  style=\"border-collapse:collapse;margin-bottom:20px;\">");
			sb.append("<tr bgcolor=\"FFD966\"><th>Site</th>");
			sb.append("<th colspan=\"4\">Job</th>");
			sb.append("<th colspan=\"4\">Ticket</th>");
			sb.append("<th colspan=\"5\">Quotation</th>");
			sb.append("<th colspan=\"3\">Attendance</th>");
			sb.append("</tr>");
			sb.append("<tr bgcolor=\"F8CBAD\">");
			sb.append("<td><b>" + proj.getName() + "</b></td>");
			//sb.append("<td>Open</td>");
			sb.append("<td>Pending</td>");
			sb.append("<td>Completed</td>");
			sb.append("<td>Overdue</td>");
			sb.append("<td>Total</td>");
			sb.append("<td>Open</td>");
			sb.append("<td>Pending</td>");
			sb.append("<td>Closed</td>");
			sb.append("<td>Total</td>");
			sb.append("<td>Pending</td>");
			sb.append("<td>Waiting for Approval</td>");
			sb.append("<td>Approved</td>");
			sb.append("<td>Rejected</td>");
			sb.append("<td><b>Total</b></td>");
			sb.append("<td>Present</td>");
			sb.append("<td>Absent</td>");
			sb.append("<td><b>Total</b></td>");
			sb.append("</tr>");
			Set<Site> sites = proj.getSite();
			Iterator<Site> siteItr = sites.iterator();
			Setting eodReportEmails = null;
			Setting eodReportClientGroupAlert = null;
			Setting dayWiseAlertTime = null;
			Calendar alertTimeCal = Calendar.getInstance();
			List<String> files = new ArrayList<String>();
			boolean generateReport = false;

			//data for attendance report
			Map<String, Map<String, Integer>> shiftWiseSummary = new HashMap<String, Map<String, Integer>>();
			List<EmployeeAttendanceReport> empAttnList = new ArrayList<EmployeeAttendanceReport>();
			List<EmployeeAttendanceReport> siteAttnList = null;
			List<Map<String, String>> siteShiftConsolidatedData = new ArrayList<Map<String, String>>();
			List<Map<String, String>> consolidatedData = new ArrayList<Map<String, String>>();
			Map<String, List<Map<String, String>>> siteWiseConsolidatedMap = new HashMap<String, List<Map<String, String>>>();
			StringBuilder content = new StringBuilder();
			Map<String, String> summaryMap = new HashMap<String, String>();
			long projEmployees = 0;
			long projPresent = 0;
			long projAbsent = 0;

			while (siteItr.hasNext()) {
				sb.append("<tr bgcolor=\"FFD966\">");
				Site site = siteItr.next();


				List<Setting> settings = null;
				List<Setting> emailAlertTimeSettings = null;
				List<Setting> clientGroupAlertSettings = null;
				settings = settingRepository.findSettingByKeyAndSiteIdOrProjectId("email.notification.daywiseReports",
						site.getId(), proj.getId());
				clientGroupAlertSettings = settingRepository.findSettingByKeyAndSiteIdOrProjectId(
						"email.notification.daywiseReports.client.group.alert", site.getId(), proj.getId());
				Setting eodReports = null;
				if (CollectionUtils.isNotEmpty(settings)) {
					List<Setting> eodSettings = settings;
					for(Setting eodSetting : eodSettings) {
					    if(eodSetting.getSettingValue().equalsIgnoreCase("true")) {
                            eodReports = eodSetting;
                        }
                    }

				}
				List<Setting> emailSettings = settingRepository.findSettingByKeyAndSiteIdOrProjectId(
						"email.notification.daywiseReports.emails", site.getId(), proj.getId());
				emailAlertTimeSettings = settingRepository.findSettingByKeyAndSiteIdOrProjectId(
						"email.notification.dayWiseReportAlertTime", site.getId(), proj.getId());

				if (CollectionUtils.isNotEmpty(emailSettings)) {
					eodReportEmails = emailSettings.get(0);
				}

				if (CollectionUtils.isNotEmpty(clientGroupAlertSettings)) {
					eodReportClientGroupAlert = clientGroupAlertSettings.get(0);
				}

				if (CollectionUtils.isNotEmpty(emailAlertTimeSettings)) {
					dayWiseAlertTime = emailAlertTimeSettings.get(0);
				}

				// get the alert time
				String alertTime = null;

				alertTime = dayWiseAlertTime != null ? dayWiseAlertTime.getSettingValue() : null;

				if (StringUtils.isNotEmpty(alertTime)) {
					try {
						Date alertDateTime = DateUtil.parseToDateTime(alertTime);
						alertTimeCal.setTime(alertDateTime);
						alertTimeCal.set(Calendar.DAY_OF_MONTH, now.get(Calendar.DAY_OF_MONTH));
						alertTimeCal.set(Calendar.MONTH, now.get(Calendar.MONTH));
						alertTimeCal.set(Calendar.YEAR, now.get(Calendar.YEAR));
						alertTimeCal.set(Calendar.SECOND, 0);
						alertTimeCal.set(Calendar.MILLISECOND, 0);
					} catch (Exception e) {
						log.error("Error while parsing attendance shift alert time configured for client : "
								+ proj.getName(), e);
					}
				}

				if(alertTimeCal.equals(now) || isOnDemand) {
					log.info("Site daily report alert time matches ");
					log.info("Generating daily report for site -"+ site.getName());
					generateReport = true;
					SearchCriteria sc = new SearchCriteria();
					sc.setCheckInDateTimeFrom(cal.getTime());
					sc.setFromDate(cal.getTime());
					sc.setToDate(dayEndcal.getTime());
					sc.setQuotationCreatedDate(cal.getTime());
					sc.setSiteId(site.getId());



					sb.append("<td><b>" + StringUtils.capitalize(site.getName()) + "</b></td>");
					ExportResult jobResult = new ExportResult();
					if (env.getProperty("scheduler.dayWiseJobReport.enabled").equalsIgnoreCase("true")) {

					// if report generation needed


						if (eodReports != null && eodReports.getSettingValue().equalsIgnoreCase("true")) {
							sc.setConsolidated(true);
							List<JobDTO> jobResults = jobManagementService.generateReport(sc, false);
							if (CollectionUtils.isNotEmpty(jobResults)) {
								List<ReportResult> jobSummary = jobManagementService.generateConsolidatedReport(sc, false);
								if (CollectionUtils.isNotEmpty(jobSummary)) {
									ReportResult summary = jobSummary.get(0);
									/*
									sb.append("<br/>Job Summary<br/>");
									sb.append(
											"<table border=\"1\" cellpadding=\"5\"  style=\"border-collapse:collapse;margin-bottom:20px;\"><tr><td>Total Jobs : </td><td>"
													+ summary.getTotalJobCount() + "</td>");
									sb.append("<tr><td>Assigned : </td><td>" + summary.getAssignedJobCount() + "</td>");
									sb.append("<tr><td>Completed : </td><td>" + summary.getCompletedJobCount() + "</td>");
									sb.append("<tr><td>Overdue : </td><td>" + summary.getOverdueJobCount() + "</td>");
									sb.append("</tr></table>");
									*/
									//sb.append("<td></td>");
									sb.append("<td>" + summary.getAssignedJobCount() + "</td>");
									sb.append("<td>" + summary.getCompletedJobCount() + "</td>");
									sb.append("<td>" + summary.getOverdueJobCount() + "</td>");
									sb.append("<td><b>" + summary.getTotalJobCount() + "</b></td>");
								}
								log.debug("send report");
								jobResult = exportUtil.writeJobExcelReportToFile(proj.getName(), jobResults, null, null,
										jobResult);
								files.add(jobResult.getFile());
							} else {
								log.debug("no jobs found on the daterange");
	//							sb.append("<td></td>");
								sb.append("<td>0</td>");
								sb.append("<td>0</td>");
								sb.append("<td>0</td>");
								sb.append("<td><b>0</b></td>");

							}
						}else {
	//						sb.append("<td></td>");
							sb.append("<td>0</td>");
							sb.append("<td>0</td>");
							sb.append("<td>0</td>");
							sb.append("<td><b>0</b></td>");
						}

					}

					ExportResult exportTicketResult = new ExportResult();
					if (env.getProperty("scheduler.dayWiseTicketReport.enabled").equalsIgnoreCase("true")) {
						List<TicketDTO> ticketResults = ticketManagementService.generateReport(sc, false);

						if (CollectionUtils.isNotEmpty(ticketResults)) {
							// if report generation needed

								// if report generation needed
								log.debug("results exists");
								if (eodReports != null && eodReports.getSettingValue().equalsIgnoreCase("true")) {
									//sb.append("<br/>Ticket Summary<br/>");
									List<Long> siteIds = new ArrayList<Long>();
									siteIds.add(site.getId());
									ReportResult summary = reportService.getTicketStatsDateRange(0, siteIds, cal.getTime(),
											dayEndcal.getTime());
									if (summary != null) {
		//								sb.append(
		//										"<table border=\"1\" cellpadding=\"5\"  style=\"border-collapse:collapse;margin-bottom:20px;\"><tr><td>Total Tickets : </td><td>"
		//												+ summary.getTotalNewTicketCount() + "</td>");
		//								sb.append("<tr><td>Closed : </td><td>" + summary.getTotalClosedTicketCount() + "</td>");
		//								sb.append(
		//										"<tr><td>Pending : </td><td>" + summary.getTotalPendingTicketCount() + "</td>");
		//								sb.append("</tr></table>");
										sb.append("<td>" + summary.getTotalOpenTicketCount() +  "</td>");
										sb.append("<td>"+ summary.getTotalAssignedTicketCount() +"</td>");
										//sb.append("<td>" + summary.getTotalPendingTicketCount() + "</td>");
										sb.append("<td>" + summary.getTotalClosedTicketCount() + "</td>");
										sb.append("<td><b>" + summary.getTotalTicketCount() + "</b></td>");
									}
									log.debug("send report");
									exportTicketResult = exportUtil.writeTicketExcelReportToFile(proj.getName(), ticketResults,
											null, null, exportTicketResult);
									files.add(exportTicketResult.getFile());
								}else {
									sb.append("<td>0</td>");
									sb.append("<td>0</td>");
		//							sb.append("<td>0</td>");
									sb.append("<td>0</td>");
									sb.append("<td><b>0</b></td>");
								}

							} else {
								log.debug("no tickets found on the daterange");
								sb.append("<td>0</td>");
								sb.append("<td>0</td>");
		//						sb.append("<td>0</td>");
								sb.append("<td>0</td>");
								sb.append("<td><b>0</b></td>");
							}
						}

						ExportResult exportQuotationResult = new ExportResult();
						if (env.getProperty("scheduler.dayWiseQuotationReport.enabled").equalsIgnoreCase("true")) {
							List<QuotationDTO> quotationResults = new ArrayList<QuotationDTO>();
                            sc.setReport(true);
							Object quotationObj = quotationService.getQuotations(sc);
							if (quotationObj != null) {
								ObjectMapper mapper = new ObjectMapper();
								mapper.findAndRegisterModules();
								mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
								mapper.configure(DeserializationFeature.ADJUST_DATES_TO_CONTEXT_TIME_ZONE, false);
                                mapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
                                try {
									quotationResults = mapper.readValue((String) quotationObj,
											new TypeReference<List<QuotationDTO>>() {
											});
								} catch (IOException e) {
									log.error("Error while converting quotation results to objects", e);
								}
							}

							if (CollectionUtils.isNotEmpty(quotationResults)) {
								// if report generation needed
								log.debug("results exists");
								if (eodReports != null && eodReports.getSettingValue().equalsIgnoreCase("true")) {
									//sb.append("<br/>Quotation Summary<br/>");
									QuotationDTO quotationSummary = new QuotationDTO();
									List<Long> siteIds = new ArrayList<Long>();
									siteIds.add(site.getId());
									Object quotationSum = quotationService.getQuotationSummary(sc, siteIds);
									ObjectMapper mapper = new ObjectMapper();
									mapper.findAndRegisterModules();
									mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
									mapper.configure(DeserializationFeature.ADJUST_DATES_TO_CONTEXT_TIME_ZONE, false);
									try {
										quotationSummary = mapper.readValue((String) quotationSum,
												new TypeReference<QuotationDTO>() {
												});
									} catch (IOException e) {
										log.error("Error while converting quotation results to objects", e);
									}
									log.debug("send report");

									if (quotationSummary != null) {
										/*
										sb.append(
												"<table border=\"1\" cellpadding=\"5\"  style=\"border-collapse:collapse;margin-bottom:20px;\"><tr><td>Total Quotations : </td><td>"
														+ quotationSummary.getTotalCount() + "</td>");
										sb.append(
												"<tr><td>Approved : </td><td>" + quotationSummary.getTotalApproved() + "</td>");
										sb.append("<tr><td>Pending : </td><td>" + quotationSummary.getTotalPending() + "</td>");
										sb.append("<tr><td>Submitted : </td><td>" + quotationSummary.getTotalSubmitted()
												+ "</td>");
										sb.append(
												"<tr><td>Archived : </td><td>" + quotationSummary.getTotalArchived() + "</td>");
										sb.append("</tr></table>");
										*/
										sb.append("<td>"+ quotationSummary.getTotalPending() +"</td>");
										sb.append("<td>"+ quotationSummary.getTotalSubmitted() +"</td>");
										sb.append("<td>"+ quotationSummary.getTotalApproved() + "</td>");
										sb.append("<td>"+ quotationSummary.getTotalRejected() +"</td>");
										sb.append("<td><b>" + quotationSummary.getTotalCount() + "</b></td>");

									}
									exportQuotationResult = exportUtil.writeQuotationExcelReportToFile(quotationResults, null,
											exportQuotationResult);
									files.add(exportQuotationResult.getFile());
								}else {
									sb.append("<td>0</td>");
									sb.append("<td>0</td>");
									sb.append("<td>0</td>");
									sb.append("<td>0</td>");
									sb.append("<td><b>0</b></td>");
								}

							} else {
								log.debug("no quotations found on the daterange");
								sb.append("<td>0</td>");
								sb.append("<td>0</td>");
								sb.append("<td>0</td>");
								sb.append("<td>0</td>");
								sb.append("<td><b>0</b></td>");
							}
						}

						//generate attendance report if enabled
						if (env.getProperty("scheduler.dayWiseAttendanceReport.enabled").equalsIgnoreCase("true")) {
							Map<String, Long> empAttnCountMap = extractAttendanceDataForReport(date, proj, site, cal, dayEndcal, siteAttnList, shiftWiseSummary,
																	siteShiftConsolidatedData, siteWiseConsolidatedMap, consolidatedData, empAttnList, content, false);
							if(MapUtils.isNotEmpty(empAttnCountMap)) {
								projEmployees += empAttnCountMap.get("ProjEmployees");
								projPresent += empAttnCountMap.get("ProjPresent");
								projAbsent += empAttnCountMap.get("ProjAbsent");
								sb.append("<td>"+ empAttnCountMap.get("ProjPresent") +"</td>");
								sb.append("<td>"+ empAttnCountMap.get("ProjAbsent") +"</td>");
								sb.append("<td>" + empAttnCountMap.get("ProjEmployees") + "</td>");

							}else {
								sb.append("<td>0</td>");
								sb.append("<td>0</td>");
								sb.append("<td><b>0</b></td>");
							}

						}else {
							sb.append("<td>0</td>");
							sb.append("<td>0</td>");
							sb.append("<td><b>0</b></td>");
						}

						sb.append("</tr>");

						if (eodReports != null && (generateReport || isOnDemand)
								&& (eodReportClientGroupAlert != null
								&& eodReportClientGroupAlert.getSettingValue().equalsIgnoreCase("true"))) {

							if(StringUtils.isEmpty(proj.getClientGroup())) {
								proj.setClientGroup(proj.getName());
							}

							if (proj.getClientGroup() != null) {

								ClientgroupDTO clientGrp = null;
								Map<String, List<ExportContent>> clientContentMap = null;

								if (clientGroupMap.containsKey(proj.getClientGroup())) {
									clientGrp = clientGroupMap.get(proj.getClientGroup());
									clientContentMap = clientGrp.getContents();
								} else {
									clientGrp = new ClientgroupDTO();
									clientGrp.setClientgroup(proj.getClientGroup());
									clientContentMap = new HashMap<String, List<ExportContent>>();
								}

								List<ExportContent> exportContents = null;

								ExportContent exportCnt = new ExportContent();
								exportCnt.setEmail(eodReportEmails !=null ? eodReportEmails.getSettingValue() : StringUtils.EMPTY);
								exportCnt.setSiteId(site.getId());
								exportCnt.setSiteName(site.getName());
								//exportCnt.setSummary(sb.toString());
								exportCnt.setJobFile(jobResult.getFile());
								exportCnt.setTicketFile(exportTicketResult.getFile());
								exportCnt.setQuotationFile(exportQuotationResult.getFile());
								// exportCnt.setFile(files);

								if (clientContentMap.containsKey(proj.getName())) {
									exportContents = clientContentMap.get(proj.getName());
								} else {
									exportContents = new ArrayList<ExportContent>();
								}

								exportContents.add(exportCnt);

								clientContentMap.put(proj.getName(), exportContents);

								clientGrp.setContents(clientContentMap);

								clientGroupMap.put(proj.getClientGroup(), clientGrp);

							}

						}
		//				else if (eodReportEmails != null && (alertTimeCal.equals(now) || isOnDemand)) {
		//					if (CollectionUtils.isNotEmpty(files)) {
		//						mailService.sendDaywiseReportEmailFile(site.getName(), eodReportEmails.getSettingValue(), files,
		//								cal.getTime(), sb.toString());
		//					}
		//				}
				}else {
					sb.append("<tr bgcolor=\"FFD966\">");
					sb.append("<td><b>" + proj.getName() + "</b></td>");
					sb.append("<td>0</td>");
					sb.append("<td>0</td>");
					sb.append("<td>0</td>");
					sb.append("<td>0</td>");
					sb.append("<td>0</td>");
					sb.append("<td>0</td>");
					sb.append("<td>0</td>");
					sb.append("<td>0</td>");
					sb.append("<td>0</td>");
					sb.append("<td>0</td>");
					sb.append("<td>0</td>");
					sb.append("<td>0</td>");
					sb.append("<td>0</td>");
					sb.append("<td>0</td>");
					sb.append("<td>0</td>");
					sb.append("<td>0</td>");
					sb.append("</tr>");
				}

			}
			sb.append("</table>");
			sb.append("<br/>");
			sb.append("<br/>");

			//export attendance report file for the project in iteration
			// get total employee count
			ExportResult exportAttnResult = new ExportResult();
			long projEmpCnt = employeeRepository.findCountByProjectId(proj.getId());

			summaryMap.put("TotalEmployees", String.valueOf(projEmpCnt));
			summaryMap.put("TotalPresent", String.valueOf(projPresent));
			summaryMap.put("TotalAbsent", String.valueOf(projEmpCnt - projPresent));

			content = new StringBuilder("Client Name - " + proj.getName() + Constants.LINE_SEPARATOR);
			content.append("Total employees - " + projEmpCnt + Constants.LINE_SEPARATOR);
			content.append("Present - " + projPresent + Constants.LINE_SEPARATOR);
			content.append("Absent - " + (projEmpCnt - projPresent) + Constants.LINE_SEPARATOR);
			exportAttnResult = exportUtil.writeAttendanceReportToFile(proj.getName(), empAttnList,
					consolidatedData, summaryMap, shiftWiseSummary, null, exportAttnResult);
			files.add(exportAttnResult.getFile());
			if(MapUtils.isNotEmpty(clientGroupMap)) {
				List<ExportContent> exportContents = null;
				ClientgroupDTO clientGroup = null;
				if(StringUtils.isNotEmpty(proj.getClientGroup()) && clientGroupMap.containsKey(proj.getClientGroup())) {
					clientGroup = clientGroupMap.get(proj.getClientGroup());
				}else if(StringUtils.isNotEmpty(proj.getName()) && clientGroupMap.containsKey(proj.getName())) {
					clientGroup =  clientGroupMap.get(proj.getName());
				}
				if(clientGroup != null && MapUtils.isNotEmpty(clientGroup.getContents())) {
					exportContents = clientGroup.getContents().get(proj.getName());
				}
				if(CollectionUtils.isNotEmpty(exportContents)) {
					exportContents.get(0).setAttendanceFile(exportAttnResult.getFile());
				}
			}

			if (StringUtils.isNotEmpty(proj.getClientGroup()) && clientGroupMap.containsKey(proj.getClientGroup())) {

				ClientgroupDTO clientGrp = clientGroupMap.get(proj.getClientGroup());
				if(clientGrp != null) {
					if(StringUtils.isNotEmpty(clientGrp.getSummary())) {
						clientGrp.setSummary(clientGrp.getSummary() + sb.toString());
					}else {
						clientGrp.setSummary(sb.toString());
					}
				}
			}

			if (eodReportEmails != null && (generateReport || isOnDemand)
					&& (eodReportClientGroupAlert == null
							|| eodReportClientGroupAlert.getSettingValue().equalsIgnoreCase("false"))) {
				if (CollectionUtils.isNotEmpty(files)) {
					log.info("Sending daily report email for client - "+ proj.getName());
					mailService.sendDaywiseReportEmailFile(proj.getName(), eodReportEmails.getSettingValue(), files,
							cal.getTime(), sb.toString());
				}
			}


		}

		if (MapUtils.isNotEmpty(clientGroupMap)) {
			exportClientGroupEmail(clientGroupMap);
		}

	}

	private void exportClientGroupEmail(Map<String, ClientgroupDTO> newMap) {
		// TODO Auto-generated method stub
		Date date = new Date();
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		// cal.add(Calendar.DAY_OF_MONTH, -1);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		// Map<String, Object> exportedContent = new HashMap<String, Object>();
		for (Map.Entry<String, ClientgroupDTO> entry : newMap.entrySet()) {
			// exportedContent.put("clientGroup", entry.getKey());
			log.info("Generating report for client group - " + entry.getKey());

			StringBuffer clientSummary = new StringBuffer();
			ClientgroupDTO clientGrp = entry.getValue();
			clientSummary.append(clientGrp.getSummary());
			//clientSummary.append("</table>");
			clientSummary.append("<br/>");
			Map<String, List<ExportContent>> values = clientGrp.getContents();
			//StringBuffer summary = new StringBuffer();
			//StringBuffer emails = new StringBuffer();
			FileOutputStream jobFos = null;
			FileOutputStream ticketFos = null;
			FileOutputStream quotationFos = null;
			FileOutputStream attnFos = null;
			List<String> files = new ArrayList<String>();
			Set<String> emailSet = new LinkedHashSet<>();
			try {
				XSSFWorkbook xssfJobWorkbook = new XSSFWorkbook();
				String jobReportFile = entry.getKey() + "_" + "JOB_REPORT";
				String ticketReportFile = entry.getKey() + "_" + "TICKET_REPORT";
				String quotationReportFile = entry.getKey() + "_" + "QUOTATION_REPORT";
				String attnReportFile = entry.getKey() + "_" + "ATTENDANCE_REPORT";
				jobFos = new FileOutputStream(exportPath + "/" + jobReportFile + ".xlsx");
				XSSFWorkbook xssfTicketWorkbook = new XSSFWorkbook();
				ticketFos = new FileOutputStream(exportPath + "/" + ticketReportFile + ".xlsx");
				XSSFWorkbook xssfQuotationWorkbook = new XSSFWorkbook();
				quotationFos = new FileOutputStream(exportPath + "/" + quotationReportFile + ".xlsx");
				XSSFWorkbook xssfAttnWorkbook = new XSSFWorkbook();
				attnFos = new FileOutputStream(exportPath + "/" + attnReportFile + ".xlsx");
				for (Map.Entry<String, List<ExportContent>> contentEx : values.entrySet()) {
					// exportedContent.put("project", contentEx.getKey());
					List<ExportContent> exportContents = contentEx.getValue();
					// exportedContent.put("email", exportContents.get(0).getEmail());
					for (ExportContent content : exportContents) {
						// exportedContent.put("summary", contents.getSummary());
						// exportedContent.put("files", contents.getFile());
						// exportedContent.put("siteName", contents.getSiteName());
//						emails.append(content.getEmail() + ",");
						String[] emailArr = StringUtils.isNotBlank(content.getEmail()) ? content.getEmail().split(",") : null;
						if(emailArr != null) {
							for(String email : emailArr) {
								emailSet.add(email);
							}
						}
						//emails.append(set);
						// append summary
						 //summary.append("<br/><b>" + content.getSiteName() + "</b><br/>");
						 //if(StringUtils.isNotEmpty(content.getSummary())) {
						//	 summary.append(content.getSummary());
						// }else {
						//	 summary.append("<br/>Nothing to report<br/>");
						 //}

						if (content.getJobFile() != null) {
							// copy the job report sheet to the master report file
							XSSFWorkbook jobWorkBook = new XSSFWorkbook(
									new FileInputStream(exportPath + "/" + content.getJobFile() + ".xlsx"));
							XSSFSheet newSheet = xssfJobWorkbook.createSheet(content.getSiteName());
							//newSheet = jobWorkBook.cloneSheet(0);
							copySheet(jobWorkBook.getSheetAt(0), newSheet);
						}

						// copy the ticket report sheet to the master report file
						if (content.getTicketFile() != null) {

							XSSFWorkbook ticketWorkBook = new XSSFWorkbook(
									new FileInputStream(exportPath + "/" + content.getTicketFile() + ".xlsx"));
							XSSFSheet newTicketSheet = xssfTicketWorkbook.createSheet(content.getSiteName());
							//newTicketSheet = ticketWorkBook.cloneSheet(0);
							copySheet(ticketWorkBook.getSheetAt(0), newTicketSheet);
						}
						// copy the quotation report sheet to the master report file
						if (content.getQuotationFile() != null) {
							XSSFWorkbook quotationWorkBook = new XSSFWorkbook(
									new FileInputStream(exportPath + "/" + content.getQuotationFile() + ".xlsx"));
							XSSFSheet newQuotationSheet = xssfQuotationWorkbook.createSheet(content.getSiteName());
							//newQuotationSheet = quotationWorkBook.cloneSheet(0);
							copySheet(quotationWorkBook.getSheetAt(0), newQuotationSheet);
						}
						// copy the quotation report sheet to the master report file
						if (content.getAttendanceFile() != null) {
							XSSFWorkbook attnWorkBook = new XSSFWorkbook(
									new FileInputStream(exportPath + "/" + content.getAttendanceFile() + ".xlsx"));
							int noOfSheets = attnWorkBook.getNumberOfSheets();
							for(int i = 0; i < noOfSheets; i++) {
								String sheetName = entry.getKey() + "_" + (i+1) + "_" + content.getSiteName();
								try {
									XSSFSheet newAttnSheet = xssfAttnWorkbook.createSheet(sheetName);
									copySheet(attnWorkBook.getSheetAt(i), newAttnSheet);
								}catch (Exception e) {
									log.error("Error while creating attendance report sheet with name - " + sheetName);
								}
							}
						}
					}
				}
				if(xssfJobWorkbook.getNumberOfSheets() > 0) {
					xssfJobWorkbook.write(jobFos);
					files.add(jobReportFile);
				}
				if(xssfTicketWorkbook.getNumberOfSheets() > 0) {
					xssfTicketWorkbook.write(ticketFos);
					files.add(ticketReportFile);
				}
				if(xssfQuotationWorkbook.getNumberOfSheets() > 0) {
					xssfQuotationWorkbook.write(quotationFos);
					files.add(quotationReportFile);
				}
				if(xssfAttnWorkbook.getNumberOfSheets() > 0) {
					xssfAttnWorkbook.write(attnFos);
					files.add(attnReportFile);
				}


			} catch (Exception e) {
				log.error(
						"Error while creating master report for job, ticket and quotation for client " + entry.getKey(),
						e);
			} finally {
				try {

					jobFos.flush();
					jobFos.close();
					ticketFos.flush();
					ticketFos.close();
					quotationFos.flush();
					quotationFos.close();
					attnFos.flush();
					attnFos.close();
				} catch (IOException e) {
					log.error("Error while creating master report for job, ticket and quotation for client "
							+ entry.getKey(), e);
				}
			}

			if (CollectionUtils.isNotEmpty(files)) {
				if(CollectionUtils.isNotEmpty(emailSet)) {
					String[] emailArr = new String[emailSet.size()];
					emailArr = emailSet.toArray(emailArr);
					String emails = String.join(",", emailArr);
					mailService.sendDaywiseReportEmailFile(entry.getKey(), emails, files, cal.getTime(),
							clientSummary.toString());
				}

			}

		}

	}

	private void copySheet(XSSFSheet inputSheet, XSSFSheet outputSheet) {
		int rowCount = inputSheet.getLastRowNum();

		int currentRowIndex = 0;
		if (rowCount > 0) {
			Iterator<Row> rowIterator = inputSheet.rowIterator();
			while (rowIterator.hasNext()) {
				int currentCellIndex = 0;
				Row row = rowIterator.next();
				Iterator<Cell> cellIterator = row.cellIterator();
				while (cellIterator.hasNext()) {
					// Step #5-8 : Creating new Row, Cell and Input value in the newly created
					// sheet.
					String cellData = cellIterator.next().toString();
					if (currentCellIndex == 0)
						outputSheet.createRow(currentRowIndex).createCell(currentCellIndex).setCellValue(cellData);
					else
						outputSheet.getRow(currentRowIndex).createCell(currentCellIndex).setCellValue(cellData);

					currentCellIndex++;
				}
				currentRowIndex++;
			}
			//System.out.println((currentRowIndex - 1) + " rows added to outputsheet " + outputSheet.getSheetName());
			//System.out.println();
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
				/*
				jobThrd.execute();
				try {
					Thread.sleep(1000);
				} catch (InterruptedException e) {
					log.error("Error while waiting for next job creation task");
				}
				*/
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

		public void execute() {
			if(logger.isDebugEnabled()) {
				logger.debug("Job Creation Thread Started for, parentJobId -" + parentJobId + ", startTimeCal - " + startTimeCal + ", endTimeCal-" + endTimeCal);
			}
			List<Job> job = jobRepository.findJobsByParentJobIdAndDate(parentJobId, DateUtil.convertToSQLDate(startTimeCal.getTime()), DateUtil.convertToSQLDate(endTimeCal.getTime()));
			if (CollectionUtils.isEmpty(job)) {
				 long siteId = 0;
				 try {
					 boolean shouldProcess = true;
//					 Job parentJob = jobRepository.findOne(parentJobId);
//					 siteId = parentJob.getSite().getId();
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
					 if(logger.isErrorEnabled())
						 logger.error("Failed to create JOB ", ex);
					 mailService.sendJobCreationErrorEmail(siteId);

				 }
			}
			if(logger.isDebugEnabled()) {
				logger.debug("Job Creation Thread Completed for, parentJobId -" + parentJobId + ", startTimeCal - " + startTimeCal + ", endTimeCal-" + endTimeCal);
			}
		}

		@Override
		public void run() {
			execute();

		}

	}

	public void createJobs(SchedulerConfig scheduledTask) {
		Job parentJob = scheduledTask.getJob();
		log.debug("creating jobs for - siteId -" + parentJob.getSite().getId());
		if ("CREATE_JOB".equals(scheduledTask.getType())) {
			String creationPolicy = env.getProperty("scheduler.job.creationPolicy");
			PageRequest pageRequest = new PageRequest(1, 1);
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
					DateTime plannedTime = new DateTime(parentJob.getPlannedStartTime().getTime());
					currDate = currDate.withHourOfDay(plannedTime.getHourOfDay()).withMinuteOfHour(plannedTime.getMinuteOfHour())
											.withSecondOfMinute(plannedTime.getMinuteOfHour());
					//currDate = addDays(currDate, scheduledTask.getSchedule(), scheduledTask.getData());
					if(prevJob.getPlannedStartTime().before(currDate.toDate())){
						while ((currDate.isBefore(lastDate) || currDate.isEqual(lastDate))) { //create task for future dates.
							//if(currDate.isAfter(today) || currDate.isEqual(today)) {
								jobCreationTask(scheduledTask, parentJob, scheduledTask.getData(), currDate.toDate(), jobDtos);
							//}
							currDate = addDays(currDate, scheduledTask.getSchedule(), scheduledTask.getData());
						}
						if(CollectionUtils.isNotEmpty(jobDtos)) {
							jobManagementService.saveScheduledJob(jobDtos, parentJob.getId(), parentJob.getEmployee(), parentJob.getSite());
						}
					}
				}else {
					currDate = new DateTime(parentJob.getPlannedStartTime().getTime());
					while ((currDate.isBefore(lastDate) || currDate.isEqual(lastDate))) { // create task for future dates.
						//if(currDate.isAfter(today) || currDate.isEqual(today)) {
							jobCreationTask(scheduledTask, parentJob, scheduledTask.getData(), currDate.toDate(), jobDtos);
						//}
						currDate = addDays(currDate, scheduledTask.getSchedule(), scheduledTask.getData());
					}
					if(CollectionUtils.isNotEmpty(jobDtos)) {
						jobManagementService.saveScheduledJob(jobDtos, parentJob.getId(), parentJob.getEmployee(), parentJob.getSite());
					}
				}
			} else if (creationPolicy.equalsIgnoreCase("daily")) {

				DateTime currDate = DateTime.now();

				DateTime lastDate = DateTime.now();

				lastDate = lastDate.plusDays(2);


				if(CollectionUtils.isNotEmpty(prevJobs)) {
					Job prevJob = prevJobs.get(0);
					//currDate = addDays(currDate, scheduledTask.getSchedule(), scheduledTask.getData());
					if(prevJob.getPlannedStartTime().before(currDate.toDate())){
						while ((currDate.isBefore(lastDate) || currDate.isEqual(lastDate))) {
							//if(currDate.isAfter(today) && currDate.isBefore(endDate)) {
							if(currDate.isBefore(endDate)) {
								jobCreationTask(scheduledTask, parentJob, scheduledTask.getData(), currDate.toDate(), jobDtos);
							}
							currDate = addDays(currDate, scheduledTask.getSchedule(), scheduledTask.getData());
						}
						if(CollectionUtils.isNotEmpty(jobDtos)) {
							jobManagementService.saveScheduledJob(jobDtos, parentJob.getId(), parentJob.getEmployee(), parentJob.getSite());
						}

					}
				}else {
					//currDate = new DateTime(parentJob.getPlannedStartTime().getTime());
					while ((currDate.isBefore(lastDate) || currDate.isEqual(lastDate))) {
						//if((currDate.isAfter(today) || currDate.isEqual(today)) && currDate.isBefore(endDate)) {
						if(currDate.isBefore(endDate)) {
							jobCreationTask(scheduledTask, parentJob, scheduledTask.getData(), currDate.toDate(), jobDtos);
						}
						currDate = addDays(currDate, scheduledTask.getSchedule(), scheduledTask.getData());
					}
					if(CollectionUtils.isNotEmpty(jobDtos)) {
						jobManagementService.saveScheduledJob(jobDtos, parentJob.getId(), parentJob.getEmployee(), parentJob.getSite());
					}
				}
			}
		}
	}

	private JobDTO createJob(Job parentJob, Map<String, String> dataMap, Date jobDate, Date plannedEndTime, Date sHrs, Date eHrs, List<JobDTO> jobs) {
		
		JobDTO job = new JobDTO();
		
		try {
		
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
            job.setPlannedEndTime(endTime.getTime());
        } else {
			endTime.set(Calendar.HOUR_OF_DAY, eHr);
			endTime.add(Calendar.HOUR_OF_DAY, parentJob.getPlannedHours());
			endTime.set(Calendar.MINUTE, eMin);
			endTime.set(Calendar.SECOND, 0);
			endTime.getTime(); // to recalculate
            Calendar endTimeCal = Calendar.getInstance();
            endTimeCal.setTime(startTime.getTime());
            endTimeCal.add(Calendar.HOUR_OF_DAY, parentJob.getPlannedHours());
            job.setPlannedEndTime(endTimeCal.getTime());
		}

		job.setPlannedStartTime(startTime.getTime());
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
		}
		catch(Exception x){
			
			log.debug("exception job : "+x);
			
		}
		return job;
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
						job = jobRepository.findChildJobByTitleSiteDateAndLocation(parentJob.getTitle(), parentJob.getSite().getId(), DateUtil.convertToSQLDate(jobDate), DateUtil.convertToSQLDate(jobDate), parentJob.getBlock(), parentJob.getFloor(), parentJob.getZone());
						if(CollectionUtils.isEmpty(job)) {
							createJob(parentJob, dataMap, jobDate, eHrs, sHrs, eHrs, jobs);
						}
					}
				}
			} catch (Exception ex) {
				log.warn("Failed to create JOB ", ex);
				mailService.sendJobCreationErrorEmail(parentJob.getSite().getId());

			}

		} catch (Exception e) {
			log.error("Error while creating scheduled job ", e);
			mailService.sendJobCreationErrorEmail(parentJob.getSite().getId());
		}
	}

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

}
