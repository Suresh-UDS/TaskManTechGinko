
package com.ts.app.service;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
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
import org.springframework.core.env.Environment;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.base.Splitter;
import com.google.common.primitives.Longs;
import com.ts.app.config.Constants;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Asset;
import com.ts.app.domain.Attendance;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeAttendanceReport;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.EmployeeShift;
import com.ts.app.domain.Job;
import com.ts.app.domain.JobChecklist;
import com.ts.app.domain.JobStatus;
import com.ts.app.domain.MaintenanceType;
import com.ts.app.domain.Project;
import com.ts.app.domain.SchedulerConfig;
import com.ts.app.domain.Setting;
import com.ts.app.domain.Shift;
import com.ts.app.domain.Site;
import com.ts.app.domain.util.StringUtil;
import com.ts.app.repository.AssetRepository;
import com.ts.app.repository.AttendanceRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.EmployeeShiftRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SchedulerConfigRepository;
import com.ts.app.repository.SettingsRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.service.util.CommonUtil;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.AssetDTO;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.JobChecklistDTO;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.ReportResult;
import com.ts.app.web.rest.dto.SearchCriteria;

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
	
	private static final String FREQ_ONCE_EVERY_HOUR = "Once in an hour";

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
	private SiteRepository siteRepository;
	
	@Inject
	private AttendanceRepository attendanceRepository;

	@Inject
	private JobManagementService jobManagementService;
	
	@Inject
	private AssetRepository assetRepository;
	
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
					settings = settingRepository.findSettingByKeyAndSiteIdOrProjectId("email.notification.eodReports", site.getId(), proj.getId());
					Setting eodReports = null;
					if (CollectionUtils.isNotEmpty(settings)) {
						eodReports = settings.get(0);
					}
					settings = settingRepository.findSettingByKeyAndSiteIdOrProjectId("email.notification.eodReports.emails", site.getId(), proj.getId());
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
							exportResult = exportUtil.writeConsolidatedJobReportToFile(proj.getName(), reportResults, null, exportResult);
							// send reports in email.
							if (eodReportEmails != null) {
								mailService.sendJobReportEmailFile(eodReportEmails.getSettingValue(), exportResult.getFile(), null, cal.getTime());
							}

						}

					} else {
						log.debug("no jobs found on the daterange");
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

			List<Job> overDueJobs = jobRepository.findOverdueJobsByStatusAndEndDateTime(cal.getTime());
			log.debug("Found {} overdue jobs", (overDueJobs != null ? overDueJobs.size() : 0));

			if (CollectionUtils.isNotEmpty(overDueJobs)) {
				ExportResult exportResult = new ExportResult();
				exportResult = exportUtil.writeJobReportToFile(overDueJobs, exportResult);
				for (Job job : overDueJobs) {
					long siteId = job.getSite().getId();
					long projId = job.getSite().getProject().getId();
					if (siteId > 0) {
						settings = settingRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_OVERDUE, siteId);
						if (CollectionUtils.isNotEmpty(settings)) {
							overdueAlertSetting = settings.get(0);
						}
						settings = settingRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_OVERDUE_EMAILS, siteId);
						if (CollectionUtils.isNotEmpty(settings)) {
							overdueEmails = settings.get(0);
						}
						if (overdueEmails != null) {
							alertEmailIds = overdueEmails.getSettingValue();
						}
					} else if (projId > 0) {
						settings = settingRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_OVERDUE, projId);
						if (CollectionUtils.isNotEmpty(settings)) {
							overdueAlertSetting = settings.get(0);
						}
						settings = settingRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_OVERDUE_EMAILS, projId);
						if (CollectionUtils.isNotEmpty(settings)) {
							overdueEmails = settings.get(0);
						}

						if (overdueEmails != null) {
							alertEmailIds = overdueEmails.getSettingValue();
						}
					}
					try {
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
									pushAlertUserIds.add(manager.getUser().getId()); // add manager user account id for push
								}
							}
						}
						try {
							if (CollectionUtils.isNotEmpty(pushAlertUserIds)) {
								long[] pushUserIds = Longs.toArray(pushAlertUserIds);
								String message = "Site - " + job.getSite().getName() + ", Job - " + job.getTitle() + ", Status - " + JobStatus.OVERDUE.name() + ", Time - "
										+ job.getPlannedEndTime();
								pushService.send(pushUserIds, message); // send push to employee and managers.
							}
							if (overdueAlertSetting != null && overdueAlertSetting.getSettingValue().equalsIgnoreCase("true")) { // send escalation emails to managers and alert
																																	// emails
								//mailService.sendOverdueJobAlert(assignee.getUser(), alertEmailIds, job.getSite().getName(), job.getId(), job.getTitle(), exportResult.getFile());
								//job.setOverDueEmailAlert(true);
							}
						} catch (Exception e) {
							log.error("Error while sending push and email notification for overdue job alerts", e);
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


	@Transactional
	public void generateDetailedAttendanceReport(Date date, boolean shiftAlert, boolean dayReport, boolean onDemand) {
		if (env.getProperty("scheduler.attendanceDetailReport.enabled").equalsIgnoreCase("true")) {
			Calendar cal = Calendar.getInstance();
			cal.setTime(date);
			//cal.add(Calendar.DAY_OF_MONTH, -1);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			cal.set(Calendar.MILLISECOND, 0);
			Calendar dayEndcal = Calendar.getInstance();
			dayEndcal.setTime(date);
			//dayEndcal.add(Calendar.DAY_OF_MONTH, -1);
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
				if(shiftAlert) {
					settings = settingRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_SHIFTWISE_ATTENDANCE, proj.getId());
				}else if(dayReport) {
					settings = settingRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_DAYWISE_ATTENDANCE, proj.getId());
				}
				Setting attendanceReports = null;
				if (CollectionUtils.isNotEmpty(settings)) {
					attendanceReports = settings.get(0);
				}
				long empCntInShift = 0;
				if (attendanceReports != null && attendanceReports.getSettingValue().equalsIgnoreCase("true")) {
					Map<String, Map<String, Integer>> shiftWiseSummary = new HashMap<String,Map<String, Integer>>();
					List<EmployeeAttendanceReport> empAttnList = new ArrayList<EmployeeAttendanceReport>();
					List<EmployeeAttendanceReport> siteAttnList = null;
					List<Map<String, String>> siteShiftConsolidatedData = new ArrayList<Map<String, String>>();
					List<Map<String, String>> consolidatedData = new ArrayList<Map<String, String>>();
					Map<String,List<Map<String, String>>> siteWiseConsolidatedMap = new HashMap<String,List<Map<String, String>>>();
					StringBuilder content = new StringBuilder();
					while (siteItr.hasNext()) {
						Site site = siteItr.next();
						//if(site.getId() == 119) {
						//Hibernate.initialize(site.getShifts());
						List<Shift> shifts = siteRepository.findShiftsBySite(site.getId());
						if (CollectionUtils.isNotEmpty(shifts)) {
							//List<Shift> shifts = site.getShifts();
							content = new StringBuilder("Site Name - " + site.getName() + Constants.LINE_SEPARATOR);
                            int shiftStartLeadTime = Integer.valueOf(env.getProperty("attendance.shiftStartLeadTime"));
							for (Shift shift : shifts) {
								empCntInShift = 0;
								String startTime = shift.getStartTime();
								String[] startTimeUnits = startTime.split(":");
								Calendar startCal = Calendar.getInstance();
								startCal.setTime(date);
								//startCal.add(Calendar.DAY_OF_MONTH, -1);
//								startCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTimeUnits[0]));
//								Subtracting shift lead time with the shift start time  -- Karthick..
								startCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTimeUnits[0]));
								startCal.set(Calendar.MINUTE, Integer.parseInt(startTimeUnits[1]));
								startCal.set(Calendar.SECOND, 0);
								startCal.set(Calendar.MILLISECOND, 0);
								String endTime = shift.getEndTime();
								String[] endTimeUnits = endTime.split(":");
								Calendar endCal = Calendar.getInstance();
								endCal.setTime(date);
								//endCal.add(Calendar.DAY_OF_MONTH, -1);
								endCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(endTimeUnits[0]));
								endCal.set(Calendar.MINUTE, Integer.parseInt(endTimeUnits[1]));
								endCal.set(Calendar.SECOND, 0);
								endCal.set(Calendar.MILLISECOND, 0);
								if(endCal.before(startCal)) {
									endCal.add(Calendar.DAY_OF_MONTH, 1);
								}
								Calendar currCal = Calendar.getInstance();
								//currCal.add(Calendar.HOUR_OF_DAY, 1);
								long timeDiff = currCal.getTimeInMillis() - startCal.getTimeInMillis();
								// if(currCal.equals(startCal) || (timeDiff >= 0 && timeDiff <= 3600000)) {
								// long empCntInShift = 0;
								// //employeeRepository.findEmployeeCountBySiteAndShift(site.getId(),
								// shift.getStartTime(), shift.getEndTime());
								empCntInShift = empShiftRepo.findEmployeeCountBySiteAndShift(site.getId(), DateUtil.convertToSQLDate(startCal.getTime()),
										DateUtil.convertToSQLDate(endCal.getTime()));
//								if (empCntInShift == 0) {
//									empCntInShift = employeeRepository.findCountBySiteId(site.getId());
//								}
								startCal.add(Calendar.HOUR_OF_DAY, -shiftStartLeadTime);

								//long attendanceCount = attendanceRepository.findCountBySiteAndCheckInTime(site.getId(), DateUtil.convertToSQLDate(startCal.getTime()),
								//		DateUtil.convertToSQLDate(endCal.getTime()));
								long attendanceCount = attendanceRepository.findCountBySiteAndShiftInTime(site.getId(), DateUtil.convertToSQLDate(startCal.getTime()), DateUtil.convertToSQLDate(endCal.getTime()), startTime, endTime);
								long absentCount = 0;
								if(empCntInShift >= attendanceCount) {
									absentCount = empCntInShift - attendanceCount;
								}

								// ExportResult exportResult = new ExportResult();
								// exportResult = exportUtil.writeAttendanceReportToFile(proj.getName(),
								// empAttnList, null, exportResult);
								// send reports in email.
								//content.append("Shift - " + shift.getStartTime() + " - " + shift.getEndTime() + LINE_SEPARATOR);
								//content.append("Total employees - " + empCntInShift + LINE_SEPARATOR);
								//content.append("Present - " + attendanceCount + LINE_SEPARATOR);
								//content.append("Absent - " + absentCount + LINE_SEPARATOR);
								Map<String, String> data = new HashMap<String, String>();
								data.put("SiteName", site.getName());
								data.put("ShiftStartTime",  StringUtil.formatShiftTime(shift.getStartTime()));
								data.put("ShiftEndTime", StringUtil.formatShiftTime(shift.getEndTime()));
								data.put("TotalEmployees", String.valueOf(empCntInShift));
								data.put("Present", String.valueOf(attendanceCount));
								data.put("Absent", String.valueOf(absentCount));
								
								String shiftTime = shift.getStartTime()+"-"+shift.getEndTime();
								Map<String, Integer> shiftWiseCount = null;
								if(shiftWiseSummary.containsKey(shiftTime)) {
									shiftWiseCount = shiftWiseSummary.get(shiftTime);
								}else {
									shiftWiseCount = new HashMap<String,Integer>();
								}
								int shiftWiseTotalEmpCnt = shiftWiseCount.containsKey("TotalEmployees") ? shiftWiseCount.get("TotalEmployees") : 0;
								int shiftWisePresentEmpCnt = shiftWiseCount.containsKey("Present") ? shiftWiseCount.get("Present") : 0;
								int shiftWiseAbsentEmpCnt = shiftWiseCount.containsKey("Absent") ? shiftWiseCount.get("Absent") : 0;

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
								if (shiftAlert && timeDiff >= 1800000 && timeDiff < 3200000) { // within 1 hour of the shift start timing.)
									//shiftAlert = true;
									siteShiftConsolidatedData.add(data);
								}
								List<Map<String,String>> siteShiftData = null;
								if(siteWiseConsolidatedMap.containsKey(site.getName())) {
									siteShiftData = siteWiseConsolidatedMap.get(site.getName());
								}else {
									siteShiftData = new ArrayList<Map<String,String>>();
								}
								siteShiftData.add(data);
								siteWiseConsolidatedMap.put(site.getName(),siteShiftData);
								
								consolidatedData.add(data);
								log.debug("Site Name  - "+ site.getName() + ", -shift start time -" + shift.getStartTime() + ", shift end time -" + shift.getEndTime() + ", shift alert -" + shiftAlert);
								// }
							}
						} else {
							empCntInShift = employeeRepository.findCountBySiteId(site.getId());

							long attendanceCount = attendanceRepository.findCountBySiteAndCheckInTime(site.getId(), DateUtil.convertToSQLDate(cal.getTime()),
									DateUtil.convertToSQLDate(dayEndcal.getTime()));
							// List<EmployeeAttendanceReport> empAttnList =
							// attendanceRepository.findBySiteId(site.getId(),
							// DateUtil.convertToSQLDate(cal.getTime()),
							// DateUtil.convertToSQLDate(cal.getTime()));
							long absentCount = empCntInShift - attendanceCount;

							// ExportResult exportResult = new ExportResult();
							// exportResult = exportUtil.writeAttendanceReportToFile(proj.getName(),
							// empAttnList, null, exportResult);
							// send reports in email.
							//content = new StringBuilder("Site Name - " + site.getName() + LINE_SEPARATOR);
							//content.append("Total employees - " + empCntInShift + LINE_SEPARATOR);
							//content.append("Present - " + attendanceCount + LINE_SEPARATOR);
							//content.append("Absent - " + absentCount + LINE_SEPARATOR);
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
						siteAttnList = attendanceRepository.findBySiteId(site.getId(), DateUtil.convertToSQLDate(cal.getTime()),
								DateUtil.convertToSQLDate(dayEndcal.getTime()));
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
							//List<Shift> shifts = site.getShifts();
							shifts = siteRepository.findShiftsBySite(site.getId());
							for (Employee emp : empNotMarkedAttn) {
								EmployeeShift empShift = null; 
								for (Shift shift : shifts) {
									String startTime = shift.getStartTime();
									String[] startTimeUnits = startTime.split(":");
									Calendar startCal = Calendar.getInstance();
									startCal.setTime(date);
									//startCal.add(Calendar.DAY_OF_MONTH, -1);
									startCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTimeUnits[0]));
									startCal.set(Calendar.MINUTE, Integer.parseInt(startTimeUnits[1]));
									startCal.set(Calendar.SECOND, 0);
									startCal.set(Calendar.MILLISECOND, 0);
									String endTime = shift.getEndTime();
									String[] endTimeUnits = endTime.split(":");
									Calendar endCal = Calendar.getInstance();
									endCal.setTime(date);
									//endCal.add(Calendar.DAY_OF_MONTH, -1);
									endCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(endTimeUnits[0]));
									endCal.set(Calendar.MINUTE, Integer.parseInt(endTimeUnits[1]));
									endCal.set(Calendar.SECOND, 0);
									endCal.set(Calendar.MILLISECOND, 0);
									if(endCal.before(startCal)) {
										endCal.add(Calendar.DAY_OF_MONTH, 1);
									}
									empShift = empShiftRepo.findEmployeeShiftBySiteAndShift(site.getId(), emp.getId(), DateUtil.convertToTimestamp(startCal.getTime()), DateUtil.convertToTimestamp(endCal.getTime()));
									if(empShift != null) {
										break;
									}
								}
								EmployeeAttendanceReport empAttnRep = new EmployeeAttendanceReport();
								empAttnRep.setEmpId(emp.getId());
								empAttnRep.setEmployeeId(emp.getEmpId());
								empAttnRep.setName(emp.getName());
								empAttnRep.setLastName(emp.getLastName());
								empAttnRep.setStatus(EmployeeAttendanceReport.ABSENT_STATUS);
								empAttnRep.setSiteName(site.getName());
								if(empShift != null) {
									Timestamp startTime = empShift.getStartTime();
									Calendar startCal = Calendar.getInstance();
									startCal.setTimeInMillis(startTime.getTime());
									empAttnRep.setShiftStartTime(startCal.get(Calendar.HOUR_OF_DAY) + ":" + startCal.get(Calendar.MINUTE));
									Timestamp endTime = empShift.getEndTime();
									Calendar endCal = Calendar.getInstance();
									endCal.setTimeInMillis(endTime.getTime());
									empAttnRep.setShiftEndTime(endCal.get(Calendar.HOUR_OF_DAY) + ":" + endCal.get(Calendar.MINUTE));
								}else {
									empAttnRep.setShiftStartTime("");
									empAttnRep.setShiftEndTime("");
								}
								empAttnRep.setProjectName(proj.getName());
								siteAttnList.add(empAttnRep);
							}
						}
						log.debug("send detailed report");
						empAttnList.addAll(siteAttnList);
					}
					List<Setting> emailAlertTimeSettings = null;
					// summary map
					if(shiftAlert) {
						settings = settingRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_SHIFTWISE_ATTENDANCE_EMAILS, proj.getId());
					}else if(dayReport) {
						settings = settingRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_DAYWISE_ATTENDANCE_EMAILS, proj.getId());
						emailAlertTimeSettings = settingRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_DAYWISE_ATTENDANCE_ALERT_TIME, proj.getId());
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
					//get total employee count
					long projEmpCnt = employeeRepository.findCountByProjectId(proj.getId());

					summaryMap.put("TotalEmployees", String.valueOf(projEmpCnt));
					summaryMap.put("TotalPresent", String.valueOf(projPresent));
					summaryMap.put("TotalAbsent", String.valueOf(projEmpCnt - projPresent));

					content = new StringBuilder("Client Name - " + proj.getName() + Constants.LINE_SEPARATOR);
					content.append("Total employees - " + projEmpCnt + Constants.LINE_SEPARATOR);
					content.append("Present - " + projPresent + Constants.LINE_SEPARATOR);
					content.append("Absent - " + (projEmpCnt - projPresent) + Constants.LINE_SEPARATOR);
					log.debug("Project Name  - "+ proj.getName() + ", shift alert -" + shiftAlert + ", dayReport -" + dayReport);
					// send reports in email.
					if (attendanceReportEmails != null && projEmployees > 0 && ((shiftAlert && siteShiftConsolidatedData.size() > 0) || dayReport)) {
						ExportResult exportResult = null;
						String alertTime = attnDayWiseAlertTime !=null ? attnDayWiseAlertTime.getSettingValue() : null;
						Calendar now = Calendar.getInstance();
						now.set(Calendar.SECOND,  0);
						now.set(Calendar.MILLISECOND, 0);
						Calendar alertTimeCal = Calendar.getInstance();
						if(StringUtils.isNotEmpty(alertTime)) {
							Date alertDateTime = DateUtil.parseToDateTime(alertTime);
							alertTimeCal.setTime(alertDateTime);
							alertTimeCal.set(Calendar.DAY_OF_MONTH, now.get(Calendar.DAY_OF_MONTH));
							alertTimeCal.set(Calendar.MONTH, now.get(Calendar.MONTH));
							alertTimeCal.set(Calendar.YEAR, now.get(Calendar.YEAR));
							alertTimeCal.set(Calendar.SECOND, 0);
							alertTimeCal.set(Calendar.MILLISECOND, 0);
						}
						
						if(dayReport && (attnDayWiseAlertTime == null ||  alertTimeCal.equals(now) || onDemand)) {
							exportResult = exportUtil.writeAttendanceReportToFile(proj.getName(), empAttnList, consolidatedData, summaryMap, shiftWiseSummary, null, exportResult);
							mailService.sendAttendanceDetailedReportEmail(proj.getName(), attendanceReportEmails.getSettingValue(), content.toString(), exportResult.getFile(), null,
									cal.getTime(), summaryMap, shiftWiseSummary, siteWiseConsolidatedMap);
						}else if(shiftAlert || onDemand) {
							exportResult = exportUtil.writeAttendanceReportToFile(proj.getName(), empAttnList, consolidatedData, summaryMap, shiftWiseSummary, null, exportResult);
							mailService.sendAttendanceDetailedReportEmail(proj.getName(), attendanceReportEmails.getSettingValue(), content.toString(), exportResult.getFile(), null,
									cal.getTime(), summaryMap, shiftWiseSummary, siteWiseConsolidatedMap);
							
						}
					}
					//}
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
					log.debug("checkin cal - "+ checkInCal.getTime());
					if (emp != null) {
						Hibernate.initialize(emp.getProjectSites());
						List<EmployeeProjectSite> projSites = emp.getProjectSites();
						for (EmployeeProjectSite projSite : projSites) {
							Site site = projSite.getSite();
							//List<Shift> shifts = site.getShifts();
							List<Shift> shifts = siteRepository.findShiftsBySite(site.getId());
							boolean empShiftMatch = false; 
							for (Shift shift : shifts) {
								String startTime = shift.getStartTime();
								String[] startTimeUnits = startTime.split(":");
								Calendar shiftStartCal = Calendar.getInstance();
								//shiftStartCal.add(Calendar.DAY_OF_MONTH, -1);
								shiftStartCal.setTimeInMillis(dailyAttn.getCheckInTime().getTime());
								shiftStartCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTimeUnits[0]));
								shiftStartCal.set(Calendar.MINUTE, Integer.parseInt(startTimeUnits[1]));
								shiftStartCal.set(Calendar.SECOND, 0);
								shiftStartCal.set(Calendar.MILLISECOND, 0);
								String endTime = shift.getEndTime();
								String[] endTimeUnits = endTime.split(":");
								Calendar shiftEndCal = Calendar.getInstance();
								shiftEndCal.setTimeInMillis(dailyAttn.getCheckInTime().getTime());
								//shiftEndCal.add(Calendar.DAY_OF_MONTH, -1);
								shiftEndCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(endTimeUnits[0]));
								shiftEndCal.set(Calendar.MINUTE, Integer.parseInt(endTimeUnits[1]));
								shiftEndCal.set(Calendar.SECOND, 0);
								shiftEndCal.set(Calendar.MILLISECOND, 0);
								if(shiftEndCal.before(shiftStartCal)) {
									shiftEndCal.add(Calendar.DAY_OF_MONTH, 1);
								}
								log.debug("site - "+ site.getId());
								log.debug("shift start time - "+ DateUtil.convertToTimestamp(shiftStartCal.getTime()));
								log.debug("shift end time - "+ DateUtil.convertToTimestamp(shiftEndCal.getTime()));
								EmployeeShift empShift = empShiftRepo.findEmployeeShiftBySiteAndShift(site.getId(), emp.getId(), DateUtil.convertToTimestamp(shiftStartCal.getTime()),
										DateUtil.convertToTimestamp(shiftEndCal.getTime()));
								log.debug("EmpShift - "+ empShift);
								if (empShift != null) { // if employee shift assignment matches with site shift
                                    log.debug("Employee shift found");
                                    log.debug("Shift end time "+shiftEndCal.getTime());
                                    log.debug("Current time "+currCal.getTime());
                                    log.debug("checkiin time "+checkInCal.getTime());
                                    // shift end time
                                    if (checkInCal.before(shiftEndCal) && shiftEndCal.before(currCal)) { // if the employee checked in before the
										// send alert
                                        log.debug("Shift end time "+shiftEndCal.getTime());
                                        log.debug("Current time "+currCal.getTime());
										if (currCal.after(endCal)) { // if the shift ends beforee EOD midnight.
											// check out automatically
											// dailyAttn.setCheckOutTime(new Timestamp(currCal.getTimeInMillis()));
											// dailyAttn.setShiftEndTime(endTime);
											// dailyAttn.setLatitudeOut(dailyAttn.getLatitudeOut());
											// dailyAttn.setLongitudeOut(dailyAttn.getLongitudeOut());
											dailyAttn.setNotCheckedOut(true); // mark the attendance as not checked out.
											attendanceRepository.save(dailyAttn);
										} else if (checkInCal.before(prevDayEndCal) && currCal.after(prevDayEndCal) && shiftEndCal.before(prevDayEndCal)) {
											dailyAttn.setNotCheckedOut(true); // mark the attendance as not checked out.
											attendanceRepository.save(dailyAttn);
										}
										// send email notifications
										Map<String, Object> values = new HashMap<String, Object>();
										values.put("checkInTime", DateUtil.formatToDateTimeString(checkInCal.getTime()));
										values.put("site", site.getName());
										mailService.sendAttendanceCheckouAlertEmail(emp.getEmail(), values);
										long userId = emp.getUser().getId();
										long[] userIds = new long[1];
										userIds[0] = userId;
										pushService.sendAttendanceCheckoutAlert(userIds, values);
										empShiftMatch = true;
										break;
									}else{
                                        log.debug("Shift end time else condition");
                                    }
                                    empShiftMatch = true;
								}
							}
							if(!empShiftMatch) {
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
	
	public void createDailyTasks() {
		if (env.getProperty("scheduler.dailyJob.enabled").equalsIgnoreCase("true")) {
            log.debug("Daily jobs enabled");
            Calendar cal = Calendar.getInstance();
			//cal.set(Calendar.HOUR_OF_DAY, 0);
			//cal.set(Calendar.MINUTE, 0);
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
		log.debug("Current Date -" +cDate);
		for(Asset asset : assets) { 
			AssetDTO assetModel = mapperUtil.toModel(asset, AssetDTO.class);
			if(asset.getWarrantyToDate() != null) {
				Calendar calendar1 = Calendar.getInstance();
		        calendar1.setTime(asset.getWarrantyToDate());
		        calendar1.add(Calendar.DAY_OF_YEAR, -1);
		        Date prevDate = calendar1.getTime();
		        log.debug("Previous Date -" + prevDate);
		        String fDate = dateFormat.format(prevDate);
		        String warrantyDate = dateFormat.format(asset.getWarrantyToDate());
		        log.debug("Formatted date -" +fDate);
		        log.debug("Validation "+currDate+ "  " + prevDate);
				if(currDate.equals(prevDate)) { 
					Setting setting = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_WARRANTY);
					if(setting != null) {
						if(setting.getSettingValue().equalsIgnoreCase("true") ) {
							Setting settingEntity = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_WARRANTY_EMAILS);
							if(settingEntity.getSettingValue().length() > 0) {
								List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(), ",");
								for(String email : emailLists) {
									mailService.sendAssetWarrantyExpireAlert(email, asset.getTitle(), assetModel.getSiteName(), asset.getCode(), warrantyDate);
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
		log.debug("Current Date -" +cDate);
		for(Job ppmJob : ppmJobs) { 
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
	        log.debug("Formatted date -" +fDate);
	        log.debug("Validation "+currDate+ "  " + prevDate);
	        if(currDate.equals(prevDate)) { 
	        	if(jobModel.getEmployeeId() > 0) { 
	        		Employee emp = employeeRepository.findOne(jobModel.getEmployeeId());
	        		if(emp.getEmail() != null) { 
	        			mailService.sendPreviousDayJobAlert(emp.getEmail(), emp.getId(), emp.getFullName(), jobModel.getId(), jobModel.getPlannedStartTime());
	        		}else {
	        			Setting setting = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_PPM);
						if(setting != null && setting.getSettingValue().equalsIgnoreCase("true")) {
							Setting settingEntity = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_PPM_EMAILS);
							if(settingEntity.getSettingValue().length() > 0) {
								List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(), ",");
								for(String email : emailLists) {
									mailService.sendPreviousDayJobAlert(email, emp.getId(), emp.getFullName(), jobModel.getId(), jobModel.getPlannedStartTime());
								}
							} else {
								log.info("There is no PPM Jobs email ids registered");
							}
						}
	        		}
	        	}else {
        			Setting setting = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_PPM);
					if(setting !=null && setting.getSettingValue().equalsIgnoreCase("true") ) {
						Setting settingEntity = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_PPM_EMAILS);
						if(settingEntity.getSettingValue().length() > 0) {
							List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(), ",");
							for(String email : emailLists) {
								mailService.sendEmployeeAssignAlert(email, jobModel.getId(), jobModel.getPlannedStartTime());
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
		log.debug("Current Date -" +cDate);
		for(Job amcJob : amcJobs) { 
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
	        log.debug("Formatted date -" +fDate);
	        log.debug("Validation "+currDate+ "  " + prevDate);
	        if(currDate.equals(prevDate)) { 
	        	if(jobModel.getEmployeeId() > 0) { 
	        		Employee emp = employeeRepository.findOne(jobModel.getEmployeeId());
	        		if(emp.getEmail() != null) { 
	        			mailService.sendPreviousDayJobAlert(emp.getEmail(), emp.getId(), emp.getFullName(), jobModel.getId(), jobModel.getPlannedStartTime());
	        		}else {
	        			Setting setting = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_AMC);
						if(setting != null && setting.getSettingValue().equalsIgnoreCase("true")) {
							Setting settingEntity = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_AMC_EMAILS);
							if(settingEntity.getSettingValue().length() > 0) {
								List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(), ",");
								for(String email : emailLists) {
									mailService.sendPreviousDayJobAlert(email, emp.getId(), emp.getFullName(), jobModel.getId(), jobModel.getPlannedStartTime());
								}
							} else {
								log.info("There is no AMC Jobs email ids registered");
							}
						}
	        		}
	        	}else {
        			Setting setting = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_AMC);
					if(setting !=null && setting.getSettingValue().equalsIgnoreCase("true") ) {
						Setting settingEntity = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_AMC_EMAILS);
						if(settingEntity.getSettingValue().length() > 0) {
							List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(), ",");
							for(String email : emailLists) {
								mailService.sendEmployeeAssignAlert(email, jobModel.getId(), jobModel.getPlannedStartTime());
							}
						} else {
							log.info("There is no AMC Jobs email ids registered");
						}
					}
        		}
	        }
		}
	}


	public void createJobs(SchedulerConfig dailyTask) {
		if(log.isDebugEnabled()) 
			log.debug("createJobs - SchedulerConfig - dailyTask - "+ dailyTask.getId());
		if ("CREATE_JOB".equals(dailyTask.getType())) {
			Calendar scheduledEndDate = Calendar.getInstance();
			PageRequest pageRequest = new PageRequest(1, 1);
			Job parentJob = dailyTask.getJob();
			if(log.isDebugEnabled())
				log.debug("createJobs - parentJob - "+ parentJob + ", - " + (parentJob != null ? parentJob.getId() : null));
			List<Job> prevJobs = jobRepository.findLastJobByParentJobId(parentJob.getId(), pageRequest);
			if(log.isDebugEnabled())
				log.debug("createJobs - prevJobs - "+ prevJobs );
			scheduledEndDate.setTime(parentJob.getScheduleEndDate());
			scheduledEndDate.set(Calendar.HOUR_OF_DAY, 23);
			scheduledEndDate.set(Calendar.MINUTE, 59);
			DateTime endDate = DateTime.now().withYear(scheduledEndDate.get(Calendar.YEAR)).withMonthOfYear(scheduledEndDate.get(Calendar.MONTH) + 1)
					.withDayOfMonth(scheduledEndDate.get(Calendar.DAY_OF_MONTH)).withHourOfDay(scheduledEndDate.get(Calendar.HOUR_OF_DAY)).withMinuteOfHour(scheduledEndDate.get(Calendar.MINUTE));
			if(log.isDebugEnabled())
				log.debug("createJobs - endDate - "+ endDate );
			if (dailyTask.getSchedule().equalsIgnoreCase(DAILY)) {
				String creationPolicy = env.getProperty("scheduler.dailyJob.creation");
				if (creationPolicy.equalsIgnoreCase("monthly")) { // if the creation policy is set to monthly, create jobs for the rest of the
																	// month
					DateTime currDate = DateTime.now();
					DateTime lastDate = currDate.dayOfMonth().withMaximumValue().withHourOfDay(23).withMinuteOfHour(59);
					if(endDate.isBefore(lastDate)) {
						lastDate = lastDate.withMonthOfYear(scheduledEndDate.get(Calendar.MONTH) + 1);
						lastDate = lastDate.withDayOfMonth(scheduledEndDate.get(Calendar.DAY_OF_MONTH));
					}
					if(log.isDebugEnabled())
						log.debug("createJobs - lastDate - "+ lastDate );
					if(CollectionUtils.isNotEmpty(prevJobs)) {
						Job prevJob = prevJobs.get(0);
						if(prevJob.getPlannedStartTime().before(currDate.toDate())){
							while (currDate.isBefore(lastDate) || currDate.isEqual(lastDate)) {
								if(log.isDebugEnabled())
									log.debug("createJobs - currDate - "+ currDate );
								jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), currDate.toDate());
								currDate = currDate.plusDays(1);
							}
						}
					}else {
						while (currDate.isBefore(lastDate) || currDate.isEqual(lastDate)) {
							if(log.isDebugEnabled())
								log.debug("createJobs - currDate - "+ currDate );
							jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), currDate.toDate());
							currDate = currDate.plusDays(1);
						}
					}
				} else if (creationPolicy.equalsIgnoreCase("daily")) {
					DateTime currDate = DateTime.now();
					if(CollectionUtils.isNotEmpty(prevJobs)) {
						Job prevJob = prevJobs.get(0);
						if(prevJob.getPlannedStartTime().before(currDate.toDate())){
							jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), new Date());
						}
					}else {
						jobCreationTask(dailyTask, dailyTask.getJob(), dailyTask.getData(), new Date());
					}
				}
				 dailyTask.setLastRun(new Date());
			} else if (dailyTask.getSchedule().equalsIgnoreCase(WEEKLY)) {
				String creationPolicy = env.getProperty("scheduler.weeklyJob.creation");
				if (creationPolicy.equalsIgnoreCase("monthly")) { // if the creation policy is set to monthly, create jobs for the rest of the
																	// month
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

	void jobCreationTask(SchedulerConfig dailyTask, Job parentJob, String data, Date jobDate) {
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
					today.setTime(jobDate);
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
		job.setZone(parentJob.getZone());
		job.setFloor(parentJob.getFloor());
		job.setBlock(parentJob.getBlock());
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
