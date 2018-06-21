package com.ts.app.service;

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
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SettingsRepository;
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
	public void generateDetailedAttendanceReport(SchedulerService schedulerService, Date date, boolean shiftAlert, boolean dayReport) {
		if (schedulerService.env.getProperty("scheduler.attendanceDetailReport.enabled").equalsIgnoreCase("true")) {
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
			List<Project> projects = schedulerService.projectRepository.findAll();
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
				List<Setting> settings = schedulerService.settingRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_ATTENDANCE, proj.getId());
				Setting attendanceReports = null;
				if (CollectionUtils.isNotEmpty(settings)) {
					attendanceReports = settings.get(0);
				}
				long empCntInShift = 0;
				if (attendanceReports != null && attendanceReports.getSettingValue().equalsIgnoreCase("true")) {
					List<EmployeeAttendanceReport> empAttnList = new ArrayList<EmployeeAttendanceReport>();
					List<EmployeeAttendanceReport> siteAttnList = null;
					List<Map<String, String>> siteShiftConsolidatedData = new ArrayList<Map<String, String>>();
					List<Map<String, String>> consolidatedData = new ArrayList<Map<String, String>>();
					StringBuilder content = new StringBuilder();
					while (siteItr.hasNext()) {
						Site site = siteItr.next();
						Hibernate.initialize(site.getShifts());
						if (CollectionUtils.isNotEmpty(site.getShifts())) {
							List<Shift> shifts = site.getShifts();
							content = new StringBuilder("Site Name - " + site.getName() + SchedulerService.LINE_SEPARATOR);
							for (Shift shift : shifts) {
								empCntInShift = 0;
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
								Calendar currCal = Calendar.getInstance();
								currCal.add(Calendar.HOUR_OF_DAY, 1);
								long timeDiff = currCal.getTimeInMillis() - startCal.getTimeInMillis();
								// if(currCal.equals(startCal) || (timeDiff >= 0 && timeDiff <= 3600000)) {
								// long empCntInShift = 0;
								// //employeeRepository.findEmployeeCountBySiteAndShift(site.getId(),
								// shift.getStartTime(), shift.getEndTime());
								empCntInShift = schedulerService.empShiftRepo.findEmployeeCountBySiteAndShift(site.getId(), DateUtil.convertToSQLDate(startCal.getTime()),
										DateUtil.convertToSQLDate(endCal.getTime()));
								if (empCntInShift == 0) {
									empCntInShift = schedulerService.employeeRepository.findCountBySiteId(site.getId());
								}

								long attendanceCount = schedulerService.attendanceRepository.findCountBySiteAndCheckInTime(site.getId(), DateUtil.convertToSQLDate(startCal.getTime()),
										DateUtil.convertToSQLDate(endCal.getTime()));
								// List<EmployeeAttendanceReport> empAttnList =
								// attendanceRepository.findBySiteId(site.getId(),
								// DateUtil.convertToSQLDate(cal.getTime()),
								// DateUtil.convertToSQLDate(cal.getTime()));
								long absentCount = empCntInShift - attendanceCount;

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
								data.put("ShiftStartTime", shift.getStartTime());
								data.put("ShiftEndTime", shift.getEndTime());
								data.put("TotalEmployees", String.valueOf(empCntInShift));
								data.put("Present", String.valueOf(attendanceCount));
								data.put("Absent", String.valueOf(absentCount));
								projEmployees += empCntInShift;
								projPresent += attendanceCount;
								projAbsent += absentCount;
								if (shiftAlert && timeDiff >= 1800000 && timeDiff < 3200000) { // within 1 hour of the shift start timing.)
									//shiftAlert = true;
									siteShiftConsolidatedData.add(data);
								}
								consolidatedData.add(data);
								schedulerService.log.debug("Site Name  - "+ site.getName() + ", -shift start time -" + shift.getStartTime() + ", shift end time -" + shift.getEndTime() + ", shift alert -" + shiftAlert);
								// }
							}
						} else {
							empCntInShift = schedulerService.employeeRepository.findCountBySiteId(site.getId());

							long attendanceCount = schedulerService.attendanceRepository.findCountBySiteAndCheckInTime(site.getId(), DateUtil.convertToSQLDate(cal.getTime()),
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
						siteAttnList = schedulerService.attendanceRepository.findBySiteId(site.getId(), DateUtil.convertToSQLDate(cal.getTime()),
								DateUtil.convertToSQLDate(dayEndcal.getTime()));
						List<Long> empPresentList = new ArrayList<Long>();
						if (CollectionUtils.isNotEmpty(siteAttnList)) {
							for (EmployeeAttendanceReport empAttn : siteAttnList) {
								empPresentList.add(empAttn.getEmpId());
							}
						}
						List<Employee> empNotMarkedAttn = null;
						if (CollectionUtils.isNotEmpty(empPresentList)) {
							empNotMarkedAttn = schedulerService.employeeRepository.findNonMatchingBySiteId(site.getId(), empPresentList);
						} else {
							empNotMarkedAttn = schedulerService.employeeRepository.findBySiteId(site.getId());
						}
						if (CollectionUtils.isNotEmpty(empNotMarkedAttn)) {
							for (Employee emp : empNotMarkedAttn) {
								EmployeeAttendanceReport empAttnRep = new EmployeeAttendanceReport();
								empAttnRep.setEmpId(emp.getId());
								empAttnRep.setEmployeeId(emp.getEmpId());
								empAttnRep.setName(emp.getName());
								empAttnRep.setLastName(emp.getLastName());
								empAttnRep.setStatus(EmployeeAttendanceReport.ABSENT_STATUS);
								empAttnRep.setSiteName(site.getName());
								empAttnRep.setShiftStartTime("");
								empAttnRep.setShiftEndTime("");
								empAttnRep.setProjectName(proj.getName());
								siteAttnList.add(empAttnRep);
							}
						}
						schedulerService.log.debug("send detailed report");
						empAttnList.addAll(siteAttnList);
					}
					// summary map
					settings = schedulerService.settingRepository.findSettingByKeyAndProjectId(SettingsService.EMAIL_NOTIFICATION_ATTENDANCE_EMAILS, proj.getId());
					Setting attendanceReportEmails = null;
					if (CollectionUtils.isNotEmpty(settings)) {
						attendanceReportEmails = settings.get(0);
					}

					Map<String, String> summaryMap = new HashMap<String, String>();
					//get total employee count
					long projEmpCnt = schedulerService.employeeRepository.findCountByProjectId(proj.getId());

					summaryMap.put("TotalEmployees", String.valueOf(projEmpCnt));
					summaryMap.put("TotalPresent", String.valueOf(projPresent));
					summaryMap.put("TotalAbsent", String.valueOf(projEmpCnt - projPresent));

					content = new StringBuilder("Client Name - " + proj.getName() + SchedulerService.LINE_SEPARATOR);
					content.append("Total employees - " + projEmpCnt + SchedulerService.LINE_SEPARATOR);
					content.append("Present - " + projPresent + SchedulerService.LINE_SEPARATOR);
					content.append("Absent - " + (projEmpCnt - projPresent) + SchedulerService.LINE_SEPARATOR);
					schedulerService.log.debug("Project Name  - "+ proj.getName() + ", shift alert -" + shiftAlert + ", dayReport -" + dayReport);
					// send reports in email.
					if (attendanceReportEmails != null && projEmployees > 0 && ((shiftAlert && siteShiftConsolidatedData.size() > 0) || dayReport)) {
						ExportResult exportResult = null;
						exportResult = schedulerService.exportUtil.writeAttendanceReportToFile(proj.getName(), empAttnList, consolidatedData, summaryMap, null, exportResult);
						schedulerService.mailService.sendAttendanceDetailedReportEmail(proj.getName(), attendanceReportEmails.getSettingValue(), content.toString(), exportResult.getFile(), null,
								cal.getTime());
					}
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
		List<Attendance> dailyAttnList = schedulerService.attendanceRepository.findByCheckInDateAndNotCheckout(currDate);
		schedulerService.log.debug("Found {} Daily Attendance", dailyAttnList.size());

		if (CollectionUtils.isNotEmpty(dailyAttnList)) {
			for (Attendance dailyAttn : dailyAttnList) {
				try {
					Hibernate.initialize(dailyAttn.getEmployee());
					Employee emp = dailyAttn.getEmployee();
					if (emp != null) {
						Hibernate.initialize(emp.getProjectSites());
						List<EmployeeProjectSite> projSites = emp.getProjectSites();
						for (EmployeeProjectSite projSite : projSites) {
							Site site = projSite.getSite();
							List<Shift> shifts = site.getShifts();
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
								schedulerService.log.debug("site - "+ site.getId());
								schedulerService.log.debug("shift start time - "+ DateUtil.convertToTimestamp(shiftStartCal.getTime()));
								schedulerService.log.debug("shift end time - "+ DateUtil.convertToTimestamp(shiftEndCal.getTime()));
								EmployeeShift empShift = schedulerService.empShiftRepo.findEmployeeShiftBySiteAndShift(site.getId(), DateUtil.convertToTimestamp(shiftStartCal.getTime()),
										DateUtil.convertToTimestamp(shiftEndCal.getTime()));
								schedulerService.log.debug("EmpShift - "+ empShift);
								Calendar checkInCal = Calendar.getInstance();
								checkInCal.setTimeInMillis(dailyAttn.getCheckInTime().getTime());
								schedulerService.log.debug("checkin cal - "+ checkInCal.getTime());
								if (empShift != null) { // if employee shift assignment matches with site shift
                                    schedulerService.log.debug("Employee shift found");
                                    schedulerService.log.debug("Shift end time "+shiftEndCal.getTime());
                                    schedulerService.log.debug("Current time "+currCal.getTime());
                                    schedulerService.log.debug("checkiin time "+checkInCal.getTime());
                                    // shift end time
                                    if (checkInCal.before(shiftEndCal) && shiftEndCal.before(currCal)) { // if the employee checked in before the
										// send alert
                                        schedulerService.log.debug("Shift end time "+shiftEndCal.getTime());
                                        schedulerService.log.debug("Current time "+currCal.getTime());
										if (currCal.after(endCal)) { // if the shift ends before EOD midnight.
											// check out automatically
											// dailyAttn.setCheckOutTime(new Timestamp(currCal.getTimeInMillis()));
											// dailyAttn.setShiftEndTime(endTime);
											// dailyAttn.setLatitudeOut(dailyAttn.getLatitudeOut());
											// dailyAttn.setLongitudeOut(dailyAttn.getLongitudeOut());
											dailyAttn.setNotCheckedOut(true); // mark the attendance as not checked out.
											schedulerService.attendanceRepository.save(dailyAttn);
										} else if (checkInCal.after(prevDayEndCal) && currCal.after(prevDayEndCal)) {
											dailyAttn.setNotCheckedOut(true); // mark the attendance as not checked out.
											schedulerService.attendanceRepository.save(dailyAttn);
										}
										// send email notifications
										Map<String, Object> values = new HashMap<String, Object>();
										values.put("checkInTime", DateUtil.formatToDateTimeString(checkInCal.getTime()));
										values.put("site", site.getName());
										schedulerService.mailService.sendAttendanceCheckouAlertEmail(emp.getEmail(), values);
										long userId = emp.getUser().getId();
										long[] userIds = new long[1];
										userIds[0] = userId;
										schedulerService.pushService.sendAttendanceCheckoutAlert(userIds, values);
										break;
									}else{
                                        schedulerService.log.debug("Shift end time else condition");
                                    }
								} else {
									if (checkInCal.before(prevDayEndCal) && currCal.after(prevDayEndCal)) {
										dailyAttn.setNotCheckedOut(true); // mark the attendance as not checked out.
										// send email notifications
										Map<String, Object> values = new HashMap<String, Object>();
										values.put("checkInTime", DateUtil.formatToDateTimeString(checkInCal.getTime()));
										values.put("site", site.getName());
										schedulerService.mailService.sendAttendanceCheckouAlertEmail(emp.getEmail(), values);
										long userId = emp.getUser().getId();
										long[] userIds = new long[1];
										userIds[0] = userId;
										schedulerService.pushService.sendAttendanceCheckoutAlert(userIds, values);
										break;
									}
								}
							}
						}
					}

				} catch (Exception ex) {
					schedulerService.log.warn("Failed to checkout daily attendance  ", ex);
				}
			}
		}
	}



}
