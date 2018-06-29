package com.ts.app.service;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.transaction.Transactional;

import com.ts.app.Application;
import com.ts.app.domain.ApplicationVersionControl;
import com.ts.app.repository.ApplicationVersionControlRepository;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.ts.app.domain.Setting;
import com.ts.app.repository.SettingsRepository;
import com.ts.app.service.util.CommonUtil;
import com.ts.app.web.rest.dto.SettingsDTO;
import com.ts.app.web.rest.dto.ApplicationVersionControlDTO;


/**
 * Service class for managing settings information.
 */
@Service
@Transactional
public class SettingsService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(SettingsService.class);

	public static final String EMAIL_NOTIFICATION_ATTENDANCE = "email.notification.attendance";

	public static final String EMAIL_NOTIFICATION_ATTENDANCE_EMAILS = "email.notification.attendance.emails";

	public static final String EMAIL_NOTIFICATION_OVERDUE = "email.notification.overdue";

	public static final String EMAIL_NOTIFICATION_OVERDUE_EMAILS = "email.notification.overdue.emails";

	public static final String EMAIL_NOTIFICATION_EODREPORTS = "email.notification.eodReports";

	public static final String EMAIL_NOTIFICATION_EODREPORTS_EMAILS = "email.notification.eodReports.emails";

	public static final String EMAIL_NOTIFICATION_FEEDBACK = "email.notification.feedback";

	public static final String EMAIL_NOTIFICATION_FEEDBACK_EMAILS = "email.notification.feedback.emails";

	public static final String EMAIL_NOTIFICATION_QUOTATION = "email.notification.quotation";

	public static final String EMAIL_NOTIFICATION_QUOTATION_EMAILS = "email.notification.quotation.emails";

	public static final String EMAIL_NOTIFICATION_TICKET = "email.notification.ticket";

	public static final String EMAIL_NOTIFICATION_TICKET_EMAILS = "email.notification.ticket.emails";

	@Inject
	private SettingsRepository settingsRepository;

    @Inject
    private ApplicationVersionControlRepository applicationVersionControlRepository;

	public SettingsDTO saveSettings(SettingsDTO settingsDto) {
		Setting attendanceAlertSetting = null;
		if(settingsDto.getAttendanceEmailAlertId() > 0) {
			attendanceAlertSetting = settingsRepository.findOne(settingsDto.getAttendanceEmailAlertId());
		}else {
			attendanceAlertSetting = new Setting();
		}
		attendanceAlertSetting.setSettingKey(EMAIL_NOTIFICATION_ATTENDANCE);
		attendanceAlertSetting.setSettingValue(String.valueOf(settingsDto.isAttendanceEmailAlert()));
		attendanceAlertSetting.setProjectId(settingsDto.getProjectId());
		attendanceAlertSetting.setProjectName(settingsDto.getProjectName());
		attendanceAlertSetting.setSiteId(settingsDto.getSiteId());
		attendanceAlertSetting.setSiteName(settingsDto.getSiteName());
		attendanceAlertSetting.setActive("Y");

		Setting attendanceEmailsSetting = null;
		if(settingsDto.getAttendanceEmailsId() > 0) {
			attendanceEmailsSetting = settingsRepository.findOne(settingsDto.getAttendanceEmailsId());
		}else {
			attendanceEmailsSetting = new Setting();
		}
		attendanceEmailsSetting.setSettingKey(EMAIL_NOTIFICATION_ATTENDANCE_EMAILS);
		if(CollectionUtils.isNotEmpty(settingsDto.getAttendanceEmailIds())) {
			attendanceEmailsSetting.setSettingValue(CommonUtil.convertToString(settingsDto.getAttendanceEmailIds()));
		}
		attendanceEmailsSetting.setProjectId(settingsDto.getProjectId());
		attendanceEmailsSetting.setProjectName(settingsDto.getProjectName());
		attendanceEmailsSetting.setSiteId(settingsDto.getSiteId());
		attendanceEmailsSetting.setSiteName(settingsDto.getSiteName());
		attendanceEmailsSetting.setActive("Y");



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

		List<Setting> settingList = new ArrayList<Setting>();
		if(StringUtils.isNotEmpty(attendanceAlertSetting.getSettingValue())) {
			settingList.add(attendanceAlertSetting);
		}
		if(StringUtils.isNotEmpty(attendanceEmailsSetting.getSettingValue())) {
			settingList.add(attendanceEmailsSetting);
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
		if(StringUtils.isNotEmpty(feedbackAlertSetting.getSettingValue())) {
			settingList.add(feedbackAlertSetting);
		}
		if(StringUtils.isNotEmpty(feedbackEmailsSetting.getSettingValue())) {
			settingList.add(feedbackEmailsSetting);
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
				if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_ATTENDANCE)) {
					settingDto.setAttendanceEmailAlertId(setting.getId());
					settingDto.setAttendanceEmailAlert(Boolean.valueOf(setting.getSettingValue()));
				}else if(setting.getSettingKey().equalsIgnoreCase(EMAIL_NOTIFICATION_ATTENDANCE_EMAILS)) {
					settingDto.setAttendanceEmailsId(setting.getId());
					settingDto.setAttendanceEmailIds(CommonUtil.convertToList(setting.getSettingValue(), ","));
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
				}

				//settings.add(settingDto);
			}
		}
		return settingDto;
	}


    public ApplicationVersionControl  findApplicationVersionCode(String applicationType) {
        ApplicationVersionControl applicationVersionControl = applicationVersionControlRepository.findByApplicationStoreName(applicationType);
        return applicationVersionControl;
    }

}
