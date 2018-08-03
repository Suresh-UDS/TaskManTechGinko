package com.ts.app.service;

import java.sql.Timestamp;
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
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.primitives.Longs;
import com.ts.app.domain.Attendance;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeAttendanceReport;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.EmployeeShift;
import com.ts.app.domain.Job;
import com.ts.app.domain.JobStatus;
import com.ts.app.domain.Project;
import com.ts.app.domain.Setting;
import com.ts.app.domain.Shift;
import com.ts.app.domain.Site;
import com.ts.app.domain.util.StringUtil;
import com.ts.app.repository.AttendanceRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.EmployeeShiftRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SettingsRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.ReportResult;
import com.ts.app.web.rest.dto.SearchCriteria;

/**
 * Service class for managing Device information.
 */
@Service
@Transactional
public class SchedulerHelperService extends AbstractService {

	final Logger log = LoggerFactory.getLogger(SchedulerHelperService.class);

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
	private ExportUtil exportUtil;

	@Inject
	private Environment env;

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
								mailService.sendOverdueJobAlert(assignee.getUser(), alertEmailIds, job.getSite().getName(), job.getId(), job.getTitle(), exportResult.getFile());
								job.setOverDueEmailAlert(true);
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
							content = new StringBuilder("Site Name - " + site.getName() + SchedulerService.LINE_SEPARATOR);
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
								startCal.add(Calendar.HOUR_OF_DAY, -shiftStartLeadTime);
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
								if (empCntInShift == 0) {
									empCntInShift = employeeRepository.findCountBySiteId(site.getId());
								}

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

					content = new StringBuilder("Client Name - " + proj.getName() + SchedulerService.LINE_SEPARATOR);
					content.append("Total employees - " + projEmpCnt + SchedulerService.LINE_SEPARATOR);
					content.append("Present - " + projPresent + SchedulerService.LINE_SEPARATOR);
					content.append("Absent - " + (projEmpCnt - projPresent) + SchedulerService.LINE_SEPARATOR);
					log.debug("Project Name  - "+ proj.getName() + ", shift alert -" + shiftAlert + ", dayReport -" + dayReport);
					// send reports in email.
					if (attendanceReportEmails != null && projEmployees > 0 && ((shiftAlert && siteShiftConsolidatedData.size() > 0) || dayReport)) {
						ExportResult exportResult = null;
						String alertTime = attnDayWiseAlertTime.getSettingValue();
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
	public void autoCheckOutAttendance(SchedulerService schedulerService) {
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



}
