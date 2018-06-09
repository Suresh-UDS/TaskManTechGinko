package com.ts.app.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ts.app.domain.Attendance;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeAttendanceReport;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.EmployeeShift;
import com.ts.app.domain.Project;
import com.ts.app.domain.Setting;
import com.ts.app.domain.Shift;
import com.ts.app.domain.Site;
import com.ts.app.service.util.DateUtil;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.SearchCriteria;

/**
 * Service class for managing Device information.
 */
@Service
@Transactional
public class SchedulerHelperService extends AbstractService {

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
								consolidatedData.add(data);
								if (shiftAlert && timeDiff >= 1800000 && timeDiff < 3200000) { // within 1 hour of the shift start timing.)
									shiftAlert = true;
								}else {
									shiftAlert = false;
								}
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
					if (attendanceReportEmails != null && projEmployees > 0 && (shiftAlert || dayReport)) {
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
									if (checkInCal.before(shiftEndCal.getTime()) && shiftEndCal.getTime().before(currCal.getTime())) { // if the employee checked in before the
																																		// shift end time
										// send alert
										if (currCal.getTime().after(endCal.getTime())) { // if the shift ends before EOD midnight.
											// check out automatically
											// dailyAttn.setCheckOutTime(new Timestamp(currCal.getTimeInMillis()));
											// dailyAttn.setShiftEndTime(endTime);
											// dailyAttn.setLatitudeOut(dailyAttn.getLatitudeOut());
											// dailyAttn.setLongitudeOut(dailyAttn.getLongitudeOut());
											dailyAttn.setNotCheckedOut(true); // mark the attendance as not checked out.
											schedulerService.attendanceRepository.save(dailyAttn);
										} else if (currCal.getTime().after(prevDayEndCal.getTime())) {
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
