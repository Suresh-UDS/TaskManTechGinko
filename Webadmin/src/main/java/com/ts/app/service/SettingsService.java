package com.ts.app.service;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.transaction.Transactional;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.ts.app.domain.ApplicationVersionControl;
import com.ts.app.domain.Setting;
import com.ts.app.repository.ApplicationVersionControlRepository;
import com.ts.app.repository.SettingsRepository;
import com.ts.app.service.util.CommonUtil;
import com.ts.app.service.util.DateUtil;
import com.ts.app.web.rest.dto.SettingsDTO;


/**
 * Service class for managing settings information.
 */
@Service
@Transactional
public class SettingsService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(SettingsService.class);

	public static final String EMAIL_NOTIFICATION_SHIFTWISE_ATTENDANCE = "email.notification.shiftwise.attendance";

	public static final String EMAIL_NOTIFICATION_SHIFTWISE_ATTENDANCE_EMAILS = "email.notification.shiftwise.attendance.emails";

	public static final String EMAIL_NOTIFICATION_DAYWISE_ATTENDANCE = "email.notification.daywise.attendance";

	public static final String EMAIL_NOTIFICATION_DAYWISE_ATTENDANCE_EMAILS = "email.notification.daywise.attendance.emails";

	public static final String EMAIL_NOTIFICATION_DAYWISE_ATTENDANCE_ALERT_TIME = "email.notification.daywise.attendance.alert.time";

	public static final String EMAIL_NOTIFICATION_ATTENDANCE_GRACE_TIME = "email.notification.attendance.grace.time";

	public static final String EMAIL_NOTIFICATION_OVERDUE = "email.notification.overdue";

	public static final String EMAIL_NOTIFICATION_OVERDUE_EMAILS = "email.notification.overdue.emails";

	public static final String EMAIL_NOTIFICATION_EODREPORTS = "email.notification.eodReports";

	public static final String EMAIL_NOTIFICATION_EODREPORTS_EMAILS = "email.notification.eodReports.emails";

	public static final String EMAIL_NOTIFICATION_FEEDBACK = "email.notification.feedback";

	public static final String EMAIL_NOTIFICATION_FEEDBACK_EMAILS = "email.notification.feedback.emails";

	public static final String EMAIL_NOTIFICATION_FEEDBACK_REPORT = "email.notification.feedback.report";

	public static final String EMAIL_NOTIFICATION_FEEDBACK_REPORT_EMAILS = "email.notification.feedback.report.emails";

	public static final String EMAIL_NOTIFICATION_FEEDBACK_REPORT_TIME = "email.notification.feedback.report.time";

	public static final String EMAIL_NOTIFICATION_QUOTATION = "email.notification.quotation";

	public static final String EMAIL_NOTIFICATION_QUOTATION_EMAILS = "email.notification.quotation.emails";

	public static final String EMAIL_NOTIFICATION_TICKET = "email.notification.ticket";

	public static final String EMAIL_NOTIFICATION_TICKET_EMAILS = "email.notification.ticket.emails";

	public static final String EMAIL_NOTIFICATION_READING = "email.notification.reading";

	public static final String EMAIL_NOTIFICATION_READING_EMAILS = "email.notification.reading.emails";

	public static final String EMAIL_NOTIFICATION_ASSET = "email.notification.asset";

	public static final String EMAIL_NOTIFICATION_ASSET_EMAILS = "email.notification.asset.emails";

	public static final String EMAIL_NOTIFICATION_PPM = "email.notification.ppm";

	public static final String EMAIL_NOTIFICATION_PPM_EMAILS = "email.notification.ppm.emails";

	public static final String EMAIL_NOTIFICATION_AMC = "email.notification.amc";

	public static final String EMAIL_NOTIFICATION_AMC_EMAILS = "email.notification.amc.emails";

	public static final String EMAIL_NOTIFICATION_WARRANTY = "email.notification.warranty";

	public static final String EMAIL_NOTIFICATION_WARRANTY_EMAILS = "email.notification.warranty.emails";

	public static final String EMAIL_NOTIFICATION_PURCHASEREQ = "email.notification.purchasereq";

	public static final String EMAIL_NOTIFICATION_PURCHASEREQ_EMAILS = "email.notification.purchasereq.emails";

	public static final String EMAIL_NOTIFICATION_DAYWISE_REPORT = "email.notification.daywiseReports";

	public static final String EMAIL_NOTIFICATION_DAYWISE_REPORT_CLIENT_GROUP_ALERT = "email.notification.daywiseReports.client.group.alert";

	public static final String EMAIL_NOTIFICATION_DAYWISE_REPORT_EMAILS = "email.notification.daywiseReports.emails";

	public static final String EMAIL_NOTIFICATION_DAYWISE_REPORT_ALERT_TIME = "email.notification.dayWiseReportAlertTime";

	public static final String EMAIL_NOTIFICATION_MUSTER_ROLL = "email.notification.attendance.musterRoll";

	public static final String EMAIL_NOTIFICATION_MUSTER_ROLL_EMAILS = "email.notification.attendance.musterRoll.emails";

	public static final String JOB_SCHEDULER_ERROR_EMAILS = "JOB_SCHEDULER_ERROR_EMAILS";

	@Inject
	private SettingsRepository settingsRepository;

    @Inject
    private ApplicationVersionControlRepository applicationVersionControlRepository;

	public SettingsDTO saveSettings(SettingsDTO settingsDto) {
		Setting shiftWiseAttendanceAlertSetting = null;
		if(settingsDto.getShiftWiseAttendanceEmailAlertId() > 0) {
			shiftWiseAttendanceAlertSetting = settingsRepository.findOne(settingsDto.getShiftWiseAttendanceEmailAlertId());
		}else {
			shiftWiseAttendanceAlertSetting = new Setting();
		}
		shiftWiseAttendanceAlertSetting.setSettingKey(EMAIL_NOTIFICATION_SHIFTWISE_ATTENDANCE);
		shiftWiseAttendanceAlertSetting.setSettingValue(String.valueOf(settingsDto.isShiftWiseAttendanceEmailAlert()));
		shiftWiseAttendanceAlertSetting.setProjectId(settingsDto.getProjectId());
		shiftWiseAttendanceAlertSetting.setProjectName(settingsDto.getProjectName());
		shiftWiseAttendanceAlertSetting.setSiteId(settingsDto.getSiteId());
		shiftWiseAttendanceAlertSetting.setSiteName(settingsDto.getSiteName());
		shiftWiseAttendanceAlertSetting.setActive("Y");

		Setting shiftWiseAttendanceEmailsSetting = null;
		if(settingsDto.getShiftWiseAttendanceEmailsId() > 0) {
			shiftWiseAttendanceEmailsSetting = settingsRepository.findOne(settingsDto.getShiftWiseAttendanceEmailsId());
		}else {
			shiftWiseAttendanceEmailsSetting = new Setting();
		}
		shiftWiseAttendanceEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_SHIFTWISE_ATTENDANCE_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getShiftWiseAttendanceEmailIds())) {
			shiftWiseAttendanceEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getShiftWiseAttendanceEmailIds()));
		}
		shiftWiseAttendanceEmailsSetting.setProjectId(settingsDto.getProjectId());
		shiftWiseAttendanceEmailsSetting.setProjectName(settingsDto.getProjectName());
		shiftWiseAttendanceEmailsSetting.setSiteId(settingsDto.getSiteId());
		shiftWiseAttendanceEmailsSetting.setSiteName(settingsDto.getSiteName());
		shiftWiseAttendanceEmailsSetting.setActive("Y");

		Setting dayWiseAttendanceAlertSetting = null;
		if(settingsDto.getDayWiseAttendanceEmailAlertId() > 0) {
			dayWiseAttendanceAlertSetting = settingsRepository.findOne(settingsDto.getDayWiseAttendanceEmailAlertId());
		}else {
			dayWiseAttendanceAlertSetting = new Setting();
		}
		dayWiseAttendanceAlertSetting.setSettingKey(EMAIL_NOTIFICATION_DAYWISE_ATTENDANCE);
		dayWiseAttendanceAlertSetting.setSettingValue(String.valueOf(settingsDto.isDayWiseAttendanceEmailAlert()));
		dayWiseAttendanceAlertSetting.setProjectId(settingsDto.getProjectId());
		dayWiseAttendanceAlertSetting.setProjectName(settingsDto.getProjectName());
		dayWiseAttendanceAlertSetting.setSiteId(settingsDto.getSiteId());
		dayWiseAttendanceAlertSetting.setSiteName(settingsDto.getSiteName());
		dayWiseAttendanceAlertSetting.setActive("Y");

		Setting dayWiseAttendanceEmailsSetting = null;
		if(settingsDto.getDayWiseAttendanceEmailsId() > 0) {
			dayWiseAttendanceEmailsSetting = settingsRepository.findOne(settingsDto.getDayWiseAttendanceEmailsId());
		}else {
			dayWiseAttendanceEmailsSetting = new Setting();
		}
		dayWiseAttendanceEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_DAYWISE_ATTENDANCE_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getDayWiseAttendanceEmailIds())) {
			dayWiseAttendanceEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getDayWiseAttendanceEmailIds()));
		}
		dayWiseAttendanceEmailsSetting.setProjectId(settingsDto.getProjectId());
		dayWiseAttendanceEmailsSetting.setProjectName(settingsDto.getProjectName());
		dayWiseAttendanceEmailsSetting.setSiteId(settingsDto.getSiteId());
		dayWiseAttendanceEmailsSetting.setSiteName(settingsDto.getSiteName());
		dayWiseAttendanceEmailsSetting.setActive("Y");

		Setting attendanceGraceTimeSetting = null;
		if(settingsDto.getLateAttendanceGraceTimeId() > 0) {
			attendanceGraceTimeSetting = settingsRepository.findOne(settingsDto.getLateAttendanceGraceTimeId());
		}else {
			attendanceGraceTimeSetting = new Setting();
		}
		attendanceGraceTimeSetting.setSettingKey(EMAIL_NOTIFICATION_ATTENDANCE_GRACE_TIME);
		if(settingsDto.getLateAttendanceGraceTime() > 0) {
			attendanceGraceTimeSetting.setSettingValue(String.valueOf(settingsDto.getLateAttendanceGraceTime()));
		}
		attendanceGraceTimeSetting.setProjectId(settingsDto.getProjectId());
		attendanceGraceTimeSetting.setProjectName(settingsDto.getProjectName());
		attendanceGraceTimeSetting.setSiteId(settingsDto.getSiteId());
		attendanceGraceTimeSetting.setSiteName(settingsDto.getSiteName());
		attendanceGraceTimeSetting.setActive("Y");

		Setting dayWiseAttendanceAlertTimeSetting = null;
		if(settingsDto.getDayWiseAttendanceAlertTimeId() > 0) {
			dayWiseAttendanceAlertTimeSetting = settingsRepository.findOne(settingsDto.getDayWiseAttendanceAlertTimeId());
		}else {
			dayWiseAttendanceAlertTimeSetting = new Setting();
		}
		dayWiseAttendanceAlertTimeSetting.setSettingKey(EMAIL_NOTIFICATION_DAYWISE_ATTENDANCE_ALERT_TIME);
		if(settingsDto.getDayWiseAttendanceAlertTime() != null) {
			dayWiseAttendanceAlertTimeSetting.setSettingValue(String.valueOf(settingsDto.getDayWiseAttendanceAlertTime()));
		}
		dayWiseAttendanceAlertTimeSetting.setProjectId(settingsDto.getProjectId());
		dayWiseAttendanceAlertTimeSetting.setProjectName(settingsDto.getProjectName());
		dayWiseAttendanceAlertTimeSetting.setSiteId(settingsDto.getSiteId());
		dayWiseAttendanceAlertTimeSetting.setSiteName(settingsDto.getSiteName());
		dayWiseAttendanceAlertTimeSetting.setActive("Y");


		Setting overdueAlertSetting = null;
		if(settingsDto.getOverdueEmailAlertId() > 0) {
			overdueAlertSetting = settingsRepository.findOne(settingsDto.getOverdueEmailAlertId());
		}else {
			overdueAlertSetting = new Setting();
		}
		overdueAlertSetting.setSettingKey(EMAIL_NOTIFICATION_OVERDUE);
		overdueAlertSetting.setSettingValue(String.valueOf(settingsDto.isOverdueEmailAlert()));
		overdueAlertSetting.setProjectId(settingsDto.getProjectId());
		overdueAlertSetting.setProjectName(settingsDto.getProjectName());
		overdueAlertSetting.setSiteId(settingsDto.getSiteId());
		overdueAlertSetting.setSiteName(settingsDto.getSiteName());
		overdueAlertSetting.setActive("Y");

		Setting overdueEmailsSetting = null;
		if(settingsDto.getOverdueEmailsId() > 0) {
			overdueEmailsSetting = settingsRepository.findOne(settingsDto.getOverdueEmailsId());
		}else {
			overdueEmailsSetting = new Setting();
		}
		overdueEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_OVERDUE_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getOverdueEmailIds())) {
			overdueEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getOverdueEmailIds()));
		}
		overdueEmailsSetting.setProjectId(settingsDto.getProjectId());
		overdueEmailsSetting.setProjectName(settingsDto.getProjectName());
		overdueEmailsSetting.setSiteId(settingsDto.getSiteId());
		overdueEmailsSetting.setSiteName(settingsDto.getSiteName());
		overdueEmailsSetting.setActive("Y");

		Setting eodJobAlertSetting = null;
		if(settingsDto.getEodJobEmailAlertId() > 0) {
			eodJobAlertSetting = settingsRepository.findOne(settingsDto.getEodJobEmailAlertId());
		}else {
			eodJobAlertSetting = new Setting();
		}
		eodJobAlertSetting.setSettingKey(EMAIL_NOTIFICATION_EODREPORTS);
		eodJobAlertSetting.setSettingValue(String.valueOf(settingsDto.isEodJobEmailAlert()));
		eodJobAlertSetting.setProjectId(settingsDto.getProjectId());
		eodJobAlertSetting.setProjectName(settingsDto.getProjectName());
		eodJobAlertSetting.setSiteId(settingsDto.getSiteId());
		eodJobAlertSetting.setSiteName(settingsDto.getSiteName());
		eodJobAlertSetting.setActive("Y");

		Setting eodJobEmailsSetting = null;
		if(settingsDto.getEodJobEmailsId() > 0) {
			eodJobEmailsSetting = settingsRepository.findOne(settingsDto.getEodJobEmailsId());
		}else {
			eodJobEmailsSetting = new Setting();
		}
		eodJobEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_EODREPORTS_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getEodJobEmailIds())) {
			eodJobEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getEodJobEmailIds()));
		}
		eodJobEmailsSetting.setProjectId(settingsDto.getProjectId());
		eodJobEmailsSetting.setProjectName(settingsDto.getProjectName());
		eodJobEmailsSetting.setSiteId(settingsDto.getSiteId());
		eodJobEmailsSetting.setSiteName(settingsDto.getSiteName());
		eodJobEmailsSetting.setActive("Y");

		//feedback notification setting
		Setting feedbackAlertSetting = null;
		if(settingsDto.getFeedbackEmailAlertId() > 0) {
			feedbackAlertSetting = settingsRepository.findOne(settingsDto.getFeedbackEmailAlertId());
		}else {
			feedbackAlertSetting = new Setting();
		}
		feedbackAlertSetting.setSettingKey(EMAIL_NOTIFICATION_FEEDBACK);
		feedbackAlertSetting.setSettingValue(String.valueOf(settingsDto.isFeedbackEmailAlert()));
		feedbackAlertSetting.setProjectId(settingsDto.getProjectId());
		feedbackAlertSetting.setProjectName(settingsDto.getProjectName());
		feedbackAlertSetting.setSiteId(settingsDto.getSiteId());
		feedbackAlertSetting.setSiteName(settingsDto.getSiteName());
		feedbackAlertSetting.setActive("Y");

		Setting feedbackEmailsSetting = null;
		if(settingsDto.getFeedbackEmailsId() > 0) {
			feedbackEmailsSetting = settingsRepository.findOne(settingsDto.getFeedbackEmailsId());
		}else {
			feedbackEmailsSetting = new Setting();
		}
		feedbackEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_FEEDBACK_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getFeedbackEmailIds())) {
			feedbackEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getFeedbackEmailIds()));
		}
		feedbackEmailsSetting.setProjectId(settingsDto.getProjectId());
		feedbackEmailsSetting.setProjectName(settingsDto.getProjectName());
		feedbackEmailsSetting.setSiteId(settingsDto.getSiteId());
		feedbackEmailsSetting.setSiteName(settingsDto.getSiteName());
		feedbackEmailsSetting.setActive("Y");

		//feedback report setting
		Setting feedbackReportSetting = null;
		if(settingsDto.getFeedbackReportEmailAlertId() > 0) {
			feedbackReportSetting = settingsRepository.findOne(settingsDto.getFeedbackReportEmailAlertId());
		}else {
			feedbackReportSetting = new Setting();
		}
		feedbackReportSetting.setSettingKey(EMAIL_NOTIFICATION_FEEDBACK_REPORT);
		feedbackReportSetting.setSettingValue(String.valueOf(settingsDto.isFeedbackReportEmailAlert()));
		feedbackReportSetting.setProjectId(settingsDto.getProjectId());
		feedbackReportSetting.setProjectName(settingsDto.getProjectName());
		feedbackReportSetting.setSiteId(settingsDto.getSiteId());
		feedbackReportSetting.setSiteName(settingsDto.getSiteName());
		feedbackReportSetting.setActive("Y");

		Setting feedbackReportEmailsSetting = null;
		if(settingsDto.getFeedbackReportEmailsId() > 0) {
			feedbackReportEmailsSetting = settingsRepository.findOne(settingsDto.getFeedbackReportEmailsId());
		}else {
			feedbackReportEmailsSetting = new Setting();
		}
		feedbackReportEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_FEEDBACK_REPORT_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getFeedbackReportEmailIds())) {
			feedbackReportEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getFeedbackReportEmailIds()));
		}
		feedbackReportEmailsSetting.setProjectId(settingsDto.getProjectId());
		feedbackReportEmailsSetting.setProjectName(settingsDto.getProjectName());
		feedbackReportEmailsSetting.setSiteId(settingsDto.getSiteId());
		feedbackReportEmailsSetting.setSiteName(settingsDto.getSiteName());
		feedbackReportEmailsSetting.setActive("Y");

		Setting feedbackReportTimeSetting = null;
		if(settingsDto.getFeedbackReportTimeId() > 0) {
			feedbackReportTimeSetting = settingsRepository.findOne(settingsDto.getFeedbackReportTimeId());
		}else {
			feedbackReportTimeSetting = new Setting();
		}
		feedbackReportTimeSetting.setSettingKey(EMAIL_NOTIFICATION_FEEDBACK_REPORT_TIME);
		if(settingsDto.getFeedbackReportTime() != null) {
			feedbackReportTimeSetting.setSettingValue(String.valueOf(settingsDto.getFeedbackReportTime()));
		}
		feedbackReportTimeSetting.setProjectId(settingsDto.getProjectId());
		feedbackReportTimeSetting.setProjectName(settingsDto.getProjectName());
		feedbackReportTimeSetting.setSiteId(settingsDto.getSiteId());
		feedbackReportTimeSetting.setSiteName(settingsDto.getSiteName());
		feedbackReportTimeSetting.setActive("Y");

		//quotation notification setting
		Setting quotationAlertSetting = null;
		if(settingsDto.getQuotationEmailAlertId() > 0) {
			quotationAlertSetting = settingsRepository.findOne(settingsDto.getQuotationEmailAlertId());
		}else {
			quotationAlertSetting = new Setting();
		}
		quotationAlertSetting.setSettingKey(EMAIL_NOTIFICATION_QUOTATION);
		quotationAlertSetting.setSettingValue(String.valueOf(settingsDto.isQuotationEmailAlert()));
		quotationAlertSetting.setProjectId(settingsDto.getProjectId());
		quotationAlertSetting.setProjectName(settingsDto.getProjectName());
		quotationAlertSetting.setSiteId(settingsDto.getSiteId());
		quotationAlertSetting.setSiteName(settingsDto.getSiteName());
		quotationAlertSetting.setActive("Y");

		Setting quotationEmailsSetting = null;
		if(settingsDto.getQuotationEmailsId() > 0) {
			quotationEmailsSetting = settingsRepository.findOne(settingsDto.getQuotationEmailsId());
		}else {
			quotationEmailsSetting = new Setting();
		}
		quotationEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_QUOTATION_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getQuotationEmailIds())) {
			quotationEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getQuotationEmailIds()));
		}
		quotationEmailsSetting.setProjectId(settingsDto.getProjectId());
		quotationEmailsSetting.setProjectName(settingsDto.getProjectName());
		quotationEmailsSetting.setSiteId(settingsDto.getSiteId());
		quotationEmailsSetting.setSiteName(settingsDto.getSiteName());
		quotationEmailsSetting.setActive("Y");

		//quotation notification setting
		Setting ticketAlertSetting = null;
		if(settingsDto.getTicketEmailAlertId() > 0) {
			ticketAlertSetting = settingsRepository.findOne(settingsDto.getTicketEmailAlertId());
		}else {
			ticketAlertSetting = new Setting();
		}
		ticketAlertSetting.setSettingKey(EMAIL_NOTIFICATION_TICKET);
		ticketAlertSetting.setSettingValue(String.valueOf(settingsDto.isTicketEmailAlert()));
		ticketAlertSetting.setProjectId(settingsDto.getProjectId());
		ticketAlertSetting.setProjectName(settingsDto.getProjectName());
		ticketAlertSetting.setSiteId(settingsDto.getSiteId());
		ticketAlertSetting.setSiteName(settingsDto.getSiteName());
		ticketAlertSetting.setActive("Y");

		Setting ticketEmailsSetting = null;
		if(settingsDto.getTicketEmailsId() > 0) {
			ticketEmailsSetting = settingsRepository.findOne(settingsDto.getTicketEmailsId());
		}else {
			ticketEmailsSetting = new Setting();
		}
		ticketEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_TICKET_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getTicketEmailIds())) {
			ticketEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getTicketEmailIds()));
		}
		ticketEmailsSetting.setProjectId(settingsDto.getProjectId());
		ticketEmailsSetting.setProjectName(settingsDto.getProjectName());
		ticketEmailsSetting.setSiteId(settingsDto.getSiteId());
		ticketEmailsSetting.setSiteName(settingsDto.getSiteName());
		ticketEmailsSetting.setActive("Y");

		Setting readingAlertSetting = null;
		if(settingsDto.getReadingEmailAlertId() > 0) {
			readingAlertSetting = settingsRepository.findOne(settingsDto.getReadingEmailAlertId());
		}else {
			readingAlertSetting = new Setting();
		}
		readingAlertSetting.setSettingKey(EMAIL_NOTIFICATION_READING);
		readingAlertSetting.setSettingValue(String.valueOf(settingsDto.isReadingEmailAlert()));
		readingAlertSetting.setProjectId(settingsDto.getProjectId());
		readingAlertSetting.setProjectName(settingsDto.getProjectName());
		readingAlertSetting.setSiteId(settingsDto.getSiteId());
		readingAlertSetting.setSiteName(settingsDto.getSiteName());
		readingAlertSetting.setActive("Y");

		Setting readingEmailsSetting = null;
		if(settingsDto.getReadingEmailsId() > 0) {
			readingEmailsSetting = settingsRepository.findOne(settingsDto.getReadingEmailsId());
		}else {
			readingEmailsSetting = new Setting();
		}
		readingEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_READING_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getReadingEmailIds())) {
			readingEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getReadingEmailIds()));
		}
		readingEmailsSetting.setProjectId(settingsDto.getProjectId());
		readingEmailsSetting.setProjectName(settingsDto.getProjectName());
		readingEmailsSetting.setSiteId(settingsDto.getSiteId());
		readingEmailsSetting.setSiteName(settingsDto.getSiteName());
		readingEmailsSetting.setActive("Y");

		Setting assetAlertSetting = null;
		if(settingsDto.getAssetEmailAlertId() > 0) {
			assetAlertSetting = settingsRepository.findOne(settingsDto.getAssetEmailAlertId());
		}else {
			assetAlertSetting = new Setting();
		}
		assetAlertSetting.setSettingKey(EMAIL_NOTIFICATION_ASSET);
		assetAlertSetting.setSettingValue(String.valueOf(settingsDto.isAssetEmailAlert()));
		assetAlertSetting.setProjectId(settingsDto.getProjectId());
		assetAlertSetting.setProjectName(settingsDto.getProjectName());
		assetAlertSetting.setSiteId(settingsDto.getSiteId());
		assetAlertSetting.setSiteName(settingsDto.getSiteName());
		assetAlertSetting.setActive("Y");

		Setting assetEmailsSetting = null;
		if(settingsDto.getAssetEmailsId() > 0) {
			assetEmailsSetting = settingsRepository.findOne(settingsDto.getAssetEmailsId());
		}else {
			assetEmailsSetting = new Setting();
		}
		assetEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_ASSET_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getAssetEmailIds())) {
			assetEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getAssetEmailIds()));
		}
		assetEmailsSetting.setProjectId(settingsDto.getProjectId());
		assetEmailsSetting.setProjectName(settingsDto.getProjectName());
		assetEmailsSetting.setSiteId(settingsDto.getSiteId());
		assetEmailsSetting.setSiteName(settingsDto.getSiteName());
		assetEmailsSetting.setActive("Y");

		Setting ppmAlertSetting = null;
		if(settingsDto.getPpmEmailAlertId() > 0) {
			ppmAlertSetting = settingsRepository.findOne(settingsDto.getPpmEmailAlertId());
		}else {
			ppmAlertSetting = new Setting();
		}
		ppmAlertSetting.setSettingKey(EMAIL_NOTIFICATION_PPM);
		ppmAlertSetting.setSettingValue(String.valueOf(settingsDto.isPpmEmailAlert()));
		ppmAlertSetting.setProjectId(settingsDto.getProjectId());
		ppmAlertSetting.setProjectName(settingsDto.getProjectName());
		ppmAlertSetting.setSiteId(settingsDto.getSiteId());
		ppmAlertSetting.setSiteName(settingsDto.getSiteName());
		ppmAlertSetting.setActive("Y");

		Setting ppmEmailsSetting = null;
		if(settingsDto.getPpmEmailsId() > 0) {
			ppmEmailsSetting = settingsRepository.findOne(settingsDto.getPpmEmailsId());
		}else {
			ppmEmailsSetting = new Setting();
		}
		ppmEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_PPM_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getPpmEmailIds())) {
			ppmEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getPpmEmailIds()));
		}
		ppmEmailsSetting.setProjectId(settingsDto.getProjectId());
		ppmEmailsSetting.setProjectName(settingsDto.getProjectName());
		ppmEmailsSetting.setSiteId(settingsDto.getSiteId());
		ppmEmailsSetting.setSiteName(settingsDto.getSiteName());
		ppmEmailsSetting.setActive("Y");

		Setting amcAlertSetting = null;
		if(settingsDto.getAmcEmailAlertId() > 0) {
			amcAlertSetting = settingsRepository.findOne(settingsDto.getAmcEmailAlertId());
		}else {
			amcAlertSetting = new Setting();
		}
		amcAlertSetting.setSettingKey(EMAIL_NOTIFICATION_AMC);
		amcAlertSetting.setSettingValue(String.valueOf(settingsDto.isAmcEmailAlert()));
		amcAlertSetting.setProjectId(settingsDto.getProjectId());
		amcAlertSetting.setProjectName(settingsDto.getProjectName());
		amcAlertSetting.setSiteId(settingsDto.getSiteId());
		amcAlertSetting.setSiteName(settingsDto.getSiteName());
		amcAlertSetting.setActive("Y");

		Setting amcEmailsSetting = null;
		if(settingsDto.getAmcEmailsId() > 0) {
			amcEmailsSetting = settingsRepository.findOne(settingsDto.getAmcEmailsId());
		}else {
			amcEmailsSetting = new Setting();
		}
		amcEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_AMC_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getAmcEmailIds())) {
			amcEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getAmcEmailIds()));
		}
		amcEmailsSetting.setProjectId(settingsDto.getProjectId());
		amcEmailsSetting.setProjectName(settingsDto.getProjectName());
		amcEmailsSetting.setSiteId(settingsDto.getSiteId());
		amcEmailsSetting.setSiteName(settingsDto.getSiteName());
		amcEmailsSetting.setActive("Y");

		Setting warrantyAlertSetting = null;
		if(settingsDto.getWarrantyEmailAlertId() > 0) {
			warrantyAlertSetting = settingsRepository.findOne(settingsDto.getWarrantyEmailAlertId());
		}else {
			warrantyAlertSetting = new Setting();
		}
		warrantyAlertSetting.setSettingKey(EMAIL_NOTIFICATION_WARRANTY);
		warrantyAlertSetting.setSettingValue(String.valueOf(settingsDto.isWarrantyEmailAlert()));
		warrantyAlertSetting.setProjectId(settingsDto.getProjectId());
		warrantyAlertSetting.setProjectName(settingsDto.getProjectName());
		warrantyAlertSetting.setSiteId(settingsDto.getSiteId());
		warrantyAlertSetting.setSiteName(settingsDto.getSiteName());
		warrantyAlertSetting.setActive("Y");

		Setting warrantyEmailsSetting = null;
		if(settingsDto.getWarrantyEmailsId() > 0) {
			warrantyEmailsSetting = settingsRepository.findOne(settingsDto.getWarrantyEmailsId());
		}else {
			warrantyEmailsSetting = new Setting();
		}
		warrantyEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_WARRANTY_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getWarrantyEmailIds())) {
			warrantyEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getWarrantyEmailIds()));
		}
		warrantyEmailsSetting.setProjectId(settingsDto.getProjectId());
		warrantyEmailsSetting.setProjectName(settingsDto.getProjectName());
		warrantyEmailsSetting.setSiteId(settingsDto.getSiteId());
		warrantyEmailsSetting.setSiteName(settingsDto.getSiteName());
		warrantyEmailsSetting.setActive("Y");

		Setting purchaseAlertSetting = null;
		if(settingsDto.getPurchaseReqEmailAlertId() > 0) {
			purchaseAlertSetting = settingsRepository.findOne(settingsDto.getPurchaseReqEmailAlertId());
		}else {
			purchaseAlertSetting = new Setting();
		}
		purchaseAlertSetting.setSettingKey(EMAIL_NOTIFICATION_PURCHASEREQ);
		purchaseAlertSetting.setSettingValue(String.valueOf(settingsDto.isPurchaseReqEmailAlert()));
		purchaseAlertSetting.setProjectId(settingsDto.getProjectId());
		purchaseAlertSetting.setProjectName(settingsDto.getProjectName());
		purchaseAlertSetting.setSiteId(settingsDto.getSiteId());
		purchaseAlertSetting.setSiteName(settingsDto.getSiteName());
		purchaseAlertSetting.setActive("Y");

		Setting purchaseEmailsSetting = null;
		if(settingsDto.getPurchaseReqEmailsId() > 0) {
			purchaseEmailsSetting = settingsRepository.findOne(settingsDto.getPurchaseReqEmailsId());
		}else {
			purchaseEmailsSetting = new Setting();
		}
		purchaseEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_PURCHASEREQ_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getPurchaseReqEmailIds())) {
			purchaseEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getPurchaseReqEmailIds()));
		}
		purchaseEmailsSetting.setProjectId(settingsDto.getProjectId());
		purchaseEmailsSetting.setProjectName(settingsDto.getProjectName());
		purchaseEmailsSetting.setSiteId(settingsDto.getSiteId());
		purchaseEmailsSetting.setSiteName(settingsDto.getSiteName());
		purchaseEmailsSetting.setActive("Y");
		Setting dayWiseReportAlertSetting = null;
		if(settingsDto.getDayWiseReportEmailAlertId() > 0) {
			dayWiseReportAlertSetting = settingsRepository.findOne(settingsDto.getDayWiseReportEmailAlertId());
		}else {
			dayWiseReportAlertSetting = new Setting();
		}
		dayWiseReportAlertSetting.setSettingKey(EMAIL_NOTIFICATION_DAYWISE_REPORT);
		dayWiseReportAlertSetting.setSettingValue(String.valueOf(settingsDto.isDayWiseReportEmailAlert()));
		dayWiseReportAlertSetting.setClientGroupAlert(settingsDto.isClientGroupEmailAlert());
		dayWiseReportAlertSetting.setProjectId(settingsDto.getProjectId());
		dayWiseReportAlertSetting.setProjectName(settingsDto.getProjectName());
		dayWiseReportAlertSetting.setSiteId(settingsDto.getSiteId());
		dayWiseReportAlertSetting.setSiteName(settingsDto.getSiteName());
		dayWiseReportAlertSetting.setActive("Y");

		Setting dayWiseReportClientGroupAlertSetting = null;
		if(settingsDto.getDayWiseReportClientGroupEmailAlertId() > 0) {
			dayWiseReportClientGroupAlertSetting = settingsRepository.findOne(settingsDto.getDayWiseReportClientGroupEmailAlertId());
		}else {
			dayWiseReportClientGroupAlertSetting = new Setting();
		}
		dayWiseReportClientGroupAlertSetting.setSettingKey(EMAIL_NOTIFICATION_DAYWISE_REPORT_CLIENT_GROUP_ALERT);
		dayWiseReportClientGroupAlertSetting.setSettingValue(String.valueOf(settingsDto.isClientGroupEmailAlert()));
		dayWiseReportClientGroupAlertSetting.setClientGroupAlert(settingsDto.isClientGroupEmailAlert());
		dayWiseReportClientGroupAlertSetting.setProjectId(settingsDto.getProjectId());
		dayWiseReportClientGroupAlertSetting.setProjectName(settingsDto.getProjectName());
		dayWiseReportClientGroupAlertSetting.setSiteId(settingsDto.getSiteId());
		dayWiseReportClientGroupAlertSetting.setSiteName(settingsDto.getSiteName());
		dayWiseReportClientGroupAlertSetting.setActive("Y");

		Setting dayWiseReportEmailsSetting = null;
		if(settingsDto.getDayWiseReportEmailsId() > 0) {
			dayWiseReportEmailsSetting = settingsRepository.findOne(settingsDto.getDayWiseReportEmailsId());
		}else {
			dayWiseReportEmailsSetting = new Setting();
		}
		dayWiseReportEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_DAYWISE_REPORT_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getDayWiseReportEmailIds())) {
			dayWiseReportEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getDayWiseReportEmailIds()));
		}
		dayWiseReportEmailsSetting.setProjectId(settingsDto.getProjectId());
		dayWiseReportEmailsSetting.setProjectName(settingsDto.getProjectName());
		dayWiseReportEmailsSetting.setSiteId(settingsDto.getSiteId());
		dayWiseReportEmailsSetting.setSiteName(settingsDto.getSiteName());
		dayWiseReportEmailsSetting.setActive("Y");

		Setting dayWiseReportAlertTimeSetting = null;
		if(settingsDto.getDayWiseReportAlertTimeId() > 0) {
			dayWiseReportAlertTimeSetting = settingsRepository.findOne(settingsDto.getDayWiseReportAlertTimeId());
		}else {
			dayWiseReportAlertTimeSetting = new Setting();
		}
		dayWiseReportAlertTimeSetting.setSettingKey(EMAIL_NOTIFICATION_DAYWISE_REPORT_ALERT_TIME);
		if(settingsDto.getDayWiseReportAlertTime() != null) {
			dayWiseReportAlertTimeSetting.setSettingValue(String.valueOf(settingsDto.getDayWiseReportAlertTime()));
		}
		dayWiseReportAlertTimeSetting.setProjectId(settingsDto.getProjectId());
		dayWiseReportAlertTimeSetting.setProjectName(settingsDto.getProjectName());
		dayWiseReportAlertTimeSetting.setSiteId(settingsDto.getSiteId());
		dayWiseReportAlertTimeSetting.setSiteName(settingsDto.getSiteName());
		dayWiseReportAlertTimeSetting.setActive("Y");

		Setting musterAlertSetting = null;
		if(settingsDto.getMusterRollEmailAlertId() > 0) {
			musterAlertSetting = settingsRepository.findOne(settingsDto.getMusterRollEmailAlertId());
		}else {
			musterAlertSetting = new Setting();
		}
		musterAlertSetting.setSettingKey(EMAIL_NOTIFICATION_MUSTER_ROLL);
		musterAlertSetting.setSettingValue(String.valueOf(settingsDto.isMusterRollEmailAlert()));
		musterAlertSetting.setProjectId(settingsDto.getProjectId());
		musterAlertSetting.setProjectName(settingsDto.getProjectName());
		musterAlertSetting.setSiteId(settingsDto.getSiteId());
		musterAlertSetting.setSiteName(settingsDto.getSiteName());
		musterAlertSetting.setActive("Y");

		Setting musterEmailsSetting = null;
		if(settingsDto.getMusterRollEmailsId() > 0) {
			musterEmailsSetting = settingsRepository.findOne(settingsDto.getMusterRollEmailsId());
		}else {
			musterEmailsSetting = new Setting();
		}
		musterEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_MUSTER_ROLL_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getMusterRollEmailIds())) {
			musterEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getMusterRollEmailIds()));
		}
		musterEmailsSetting.setProjectId(settingsDto.getProjectId());
		musterEmailsSetting.setProjectName(settingsDto.getProjectName());
		musterEmailsSetting.setSiteId(settingsDto.getSiteId());
		musterEmailsSetting.setSiteName(settingsDto.getSiteName());
		musterEmailsSetting.setActive("Y");


		List<Setting> settingList = new ArrayList<Setting>();
		if(StringUtils.isNotEmpty(shiftWiseAttendanceAlertSetting.getSettingValue())) {
			settingList.add(shiftWiseAttendanceAlertSetting);
		}
		if(StringUtils.isNotEmpty(dayWiseAttendanceAlertSetting.getSettingValue())) {
			settingList.add(dayWiseAttendanceAlertSetting);
		}
		if(StringUtils.isNotEmpty(shiftWiseAttendanceEmailsSetting.getSettingValue())) {
			settingList.add(shiftWiseAttendanceEmailsSetting);
		}
		if(StringUtils.isNotEmpty(dayWiseAttendanceEmailsSetting.getSettingValue())) {
			settingList.add(dayWiseAttendanceEmailsSetting);
		}
		if(StringUtils.isNotEmpty(dayWiseAttendanceAlertTimeSetting.getSettingValue())) {
			settingList.add(dayWiseAttendanceAlertTimeSetting);
		}
		if(StringUtils.isNotEmpty(attendanceGraceTimeSetting.getSettingValue())) {
			settingList.add(attendanceGraceTimeSetting);
		}
		if(StringUtils.isNotEmpty(overdueAlertSetting.getSettingValue())) {
			settingList.add(overdueAlertSetting);
		}
		if(StringUtils.isNotEmpty(overdueEmailsSetting.getSettingValue())) {
			settingList.add(overdueEmailsSetting);
		}
		if(StringUtils.isNotEmpty(eodJobAlertSetting.getSettingValue())) {
			settingList.add(eodJobAlertSetting);
		}
		if(StringUtils.isNotEmpty(eodJobEmailsSetting.getSettingValue())) {
			settingList.add(eodJobEmailsSetting);
		}
		if(StringUtils.isNotEmpty(feedbackEmailsSetting.getSettingValue())) {
			settingList.add(feedbackEmailsSetting);
		}
		if(StringUtils.isNotEmpty(feedbackAlertSetting.getSettingValue())) {
			settingList.add(feedbackAlertSetting);
		}
		if(StringUtils.isNotEmpty(feedbackReportSetting.getSettingValue())) {
			settingList.add(feedbackReportSetting);
		}
		if(StringUtils.isNotEmpty(feedbackReportEmailsSetting.getSettingValue())) {
			settingList.add(feedbackReportEmailsSetting);
		}
		if(StringUtils.isNotEmpty(feedbackReportTimeSetting.getSettingValue())) {
			settingList.add(feedbackReportTimeSetting);
		}
		if(StringUtils.isNotEmpty(quotationAlertSetting.getSettingValue())) {
			settingList.add(quotationAlertSetting);
		}
		if(StringUtils.isNotEmpty(quotationEmailsSetting.getSettingValue())) {
			settingList.add(quotationEmailsSetting);
		}
		if(StringUtils.isNotEmpty(ticketAlertSetting.getSettingValue())) {
			settingList.add(ticketAlertSetting);
		}
		if(StringUtils.isNotEmpty(ticketEmailsSetting.getSettingValue())) {
			settingList.add(ticketEmailsSetting);
		}
		if(StringUtils.isNotEmpty(readingAlertSetting.getSettingValue())) {
			settingList.add(readingAlertSetting);
		}
		if(StringUtils.isNotEmpty(readingEmailsSetting.getSettingValue())) {
			settingList.add(readingEmailsSetting);
		}
		if(StringUtils.isNotEmpty(assetAlertSetting.getSettingValue())) {
			settingList.add(assetAlertSetting);
		}
		if(StringUtils.isNotEmpty(assetEmailsSetting.getSettingValue())) {
			settingList.add(assetEmailsSetting);
		}
		if(StringUtils.isNotEmpty(ppmAlertSetting.getSettingValue())) {
			settingList.add(ppmAlertSetting);
		}
		if(StringUtils.isNotEmpty(ppmEmailsSetting.getSettingValue())) {
			settingList.add(ppmEmailsSetting);
		}
		if(StringUtils.isNotEmpty(amcAlertSetting.getSettingValue())) {
			settingList.add(amcAlertSetting);
		}
		if(StringUtils.isNotEmpty(amcEmailsSetting.getSettingValue())) {
			settingList.add(amcEmailsSetting);
		}
		if(StringUtils.isNotEmpty(warrantyAlertSetting.getSettingValue())) {
			settingList.add(warrantyAlertSetting);
		}
		if(StringUtils.isNotEmpty(warrantyEmailsSetting.getSettingValue())) {
			settingList.add(warrantyEmailsSetting);
		}
		if(StringUtils.isNotEmpty(purchaseAlertSetting.getSettingValue())) {
			settingList.add(purchaseAlertSetting);
		}
		if(StringUtils.isNotEmpty(purchaseEmailsSetting.getSettingValue())) {
            settingList.add(purchaseEmailsSetting);
        }
		if(StringUtils.isNotEmpty(dayWiseReportAlertSetting.getSettingValue())) {
			settingList.add(dayWiseReportAlertSetting);
		}

		if(StringUtils.isNotEmpty(dayWiseReportClientGroupAlertSetting.getSettingValue())) {
			settingList.add(dayWiseReportClientGroupAlertSetting);
		}
		if(StringUtils.isNotEmpty(dayWiseReportEmailsSetting.getSettingValue())) {
			settingList.add(dayWiseReportEmailsSetting);
		}
		if(StringUtils.isNotEmpty(dayWiseReportAlertTimeSetting.getSettingValue())) {
			settingList.add(dayWiseReportAlertTimeSetting);
		}
		if(StringUtils.isNotEmpty(musterAlertSetting.getSettingValue())) {
			settingList.add(musterAlertSetting);
		}
		if(StringUtils.isNotEmpty(musterEmailsSetting.getSettingValue())) {
			settingList.add(musterEmailsSetting);
		}

		settingsRepository.save(settingList);

		return settingsDto;
	}

	public SettingsDTO findAll(long projectId, long siteId) {
		List<SettingsDTO> settings = new ArrayList<SettingsDTO>();
		List<Setting> entities = null;
		if(projectId > 0 && siteId > 0) {
			entities = settingsRepository.findSettingByProjectAndSiteId(projectId, siteId);
		}else if(projectId > 0) {
			entities = settingsRepository.findSettingByProjectId(projectId);
		}else if(siteId > 0) {
			entities = settingsRepository.findSettingBySiteId(siteId);
		}else {
			entities = settingsRepository.findAll();
		}
		SettingsDTO settingDto = new SettingsDTO();
		settingDto.setProjectId(projectId);
		settingDto.setSiteId(siteId);
		if(CollectionUtils.isNotEmpty(entities)) {
			for(Setting setting : entities) {
				if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_SHIFTWISE_ATTENDANCE)) {
					settingDto.setShiftWiseAttendanceEmailAlertId(setting.getId());
					settingDto.setShiftWiseAttendanceEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_SHIFTWISE_ATTENDANCE_EMAILS)) {
					settingDto.setShiftWiseAttendanceEmailsId(setting.getId());
					settingDto.setShiftWiseAttendanceEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_DAYWISE_ATTENDANCE)) {
					settingDto.setDayWiseAttendanceEmailAlertId(setting.getId());
					settingDto.setDayWiseAttendanceEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_DAYWISE_ATTENDANCE_EMAILS)) {
					settingDto.setDayWiseAttendanceEmailsId(setting.getId());
					settingDto.setDayWiseAttendanceEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_DAYWISE_ATTENDANCE_ALERT_TIME)) {
					settingDto.setDayWiseAttendanceAlertTimeId(setting.getId());
					settingDto.setDayWiseAttendanceAlertTime(StringUtils.isNotEmpty(setting.getSettingValue()) ? DateUtil.parseToDateTime(setting.getSettingValue()) : null);
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_ATTENDANCE_GRACE_TIME)) {
					settingDto.setLateAttendanceGraceTimeId(setting.getId());
					settingDto.setLateAttendanceGraceTime(Integer.parseInt(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_OVERDUE)) {
					settingDto.setOverdueEmailAlertId(setting.getId());
					settingDto.setOverdueEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_OVERDUE_EMAILS)) {
					settingDto.setOverdueEmailsId(setting.getId());
					settingDto.setOverdueEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_EODREPORTS)) {
					settingDto.setEodJobEmailAlertId(setting.getId());
					settingDto.setEodJobEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_EODREPORTS_EMAILS)) {
					settingDto.setEodJobEmailsId(setting.getId());
					settingDto.setEodJobEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_FEEDBACK)) {
					settingDto.setFeedbackEmailAlertId(setting.getId());
					settingDto.setFeedbackEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_FEEDBACK_EMAILS)) {
					settingDto.setFeedbackEmailsId(setting.getId());
					settingDto.setFeedbackEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_FEEDBACK_REPORT)) {
					settingDto.setFeedbackReportEmailAlertId(setting.getId());
					settingDto.setFeedbackReportEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_FEEDBACK_REPORT_EMAILS)) {
					settingDto.setFeedbackReportEmailsId(setting.getId());
					settingDto.setFeedbackReportEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_FEEDBACK_REPORT_TIME)) {
					settingDto.setFeedbackReportTimeId(setting.getId());
					settingDto.setFeedbackReportTime(StringUtils.isNotEmpty(setting.getSettingValue()) ? DateUtil.parseToDateTime(setting.getSettingValue()) : null);
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_QUOTATION)) {
					settingDto.setQuotationEmailAlertId(setting.getId());
					settingDto.setQuotationEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_QUOTATION_EMAILS)) {
					settingDto.setQuotationEmailsId(setting.getId());
					settingDto.setQuotationEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_TICKET)) {
					settingDto.setTicketEmailAlertId(setting.getId());
					settingDto.setTicketEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_TICKET_EMAILS)) {
					settingDto.setTicketEmailsId(setting.getId());
					settingDto.setTicketEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_READING)) {
					settingDto.setReadingEmailAlertId(setting.getId());
					settingDto.setReadingEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_READING_EMAILS)) {
					settingDto.setReadingEmailsId(setting.getId());
					settingDto.setReadingEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_ASSET)) {
					settingDto.setAssetEmailAlertId(setting.getId());
					settingDto.setAssetEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_ASSET_EMAILS)) {
					settingDto.setAssetEmailsId(setting.getId());
					settingDto.setAssetEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_PPM)) {
					settingDto.setPpmEmailAlertId(setting.getId());
					settingDto.setPpmEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_PPM_EMAILS)) {
					settingDto.setPpmEmailsId(setting.getId());
					settingDto.setPpmEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_AMC)) {
					settingDto.setAmcEmailAlertId(setting.getId());
					settingDto.setAmcEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_AMC_EMAILS)) {
					settingDto.setAmcEmailsId(setting.getId());
					settingDto.setAmcEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_WARRANTY)) {
					settingDto.setWarrantyEmailAlertId(setting.getId());
					settingDto.setWarrantyEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_WARRANTY_EMAILS)) {
					settingDto.setWarrantyEmailsId(setting.getId());
					settingDto.setWarrantyEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_PURCHASEREQ)) {
					settingDto.setPurchaseReqEmailAlertId(setting.getId());
					settingDto.setPurchaseReqEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_PURCHASEREQ_EMAILS)) {
					settingDto.setPurchaseReqEmailsId(setting.getId());
					settingDto.setPurchaseReqEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_DAYWISE_REPORT)) {
					settingDto.setDayWiseReportEmailAlertId(setting.getId());
					settingDto.setDayWiseReportEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_DAYWISE_REPORT_CLIENT_GROUP_ALERT)) {
					settingDto.setDayWiseReportClientGroupEmailAlertId(setting.getId());
					settingDto.setClientGroupEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_DAYWISE_REPORT_EMAILS)) {
					settingDto.setDayWiseReportEmailsId(setting.getId());
					settingDto.setDayWiseReportEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_DAYWISE_REPORT_ALERT_TIME)) {
					settingDto.setDayWiseReportAlertTimeId(setting.getId());
					settingDto.setDayWiseReportAlertTime(StringUtils.isNotEmpty(setting.getSettingValue()) ? DateUtil.parseToDateTime(setting.getSettingValue()) : null);
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_MUSTER_ROLL)) {
					settingDto.setMusterRollEmailAlertId(setting.getId());
					settingDto.setMusterRollEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_MUSTER_ROLL_EMAILS)) {
					settingDto.setMusterRollEmailsId(setting.getId());
					settingDto.setMusterRollEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
				}

				//settings.add(settingDto);
			}
		}
		return settingDto;
	}


    public List<ApplicationVersionControl>  findApplicationVersionCode() {
        List<ApplicationVersionControl> applicationVersionControl = applicationVersionControlRepository.findAll();
        return applicationVersionControl;
    }

    public SettingsDTO findSetting(String key) {
    		SettingsDTO settingDto = null;
    		if(StringUtils.isNotEmpty(key)) {
	    		Setting setting = settingsRepository.findSettingByKey(key);
	    		settingDto = new SettingsDTO();
	    		settingDto.setKey(key);
	    		settingDto.setValue(setting.getSettingValue());
    		}
    		return settingDto;
    }

}
