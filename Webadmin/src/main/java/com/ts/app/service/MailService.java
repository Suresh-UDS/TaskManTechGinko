package com.ts.app.service;

import java.io.File;
import java.util.Date;
import java.util.Enumeration;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;

import javax.inject.Inject;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.commons.lang.CharEncoding;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring4.SpringTemplateEngine;

import com.ts.app.config.JHipsterProperties;
import com.ts.app.domain.User;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.Sendgrid;
import com.ts.app.web.rest.dto.UserDTO;

/**
 * Service for sending e-mails.
 * <p/>
 * <p>
 * We use the @Async annotation to send e-mails asynchronously.
 * </p>
 */
@Service
public class MailService {

    private final Logger log = LoggerFactory.getLogger(MailService.class);

    @Inject
    private JHipsterProperties jHipsterProperties;

    @Inject
    private JavaMailSenderImpl javaMailSender;

    @Inject
    private MessageSource messageSource;

    @Inject
    private SpringTemplateEngine templateEngine;

    /**
     * System default email address that sends the e-mails.
     */
    private String from;

    @Value("${export.file.path}")
    private String exportPath;

    @Async
    public void sendEmail(String to, String subject, String content, boolean isMultipart, boolean isHtml,String fileName) {
        log.debug("Send e-mail[multipart '{}' and html '{}'] to '{}' with subject '{}' and content={}",
            isMultipart, isHtml, to, subject, content);

        log.debug(javaMailSender.getHost() +" , " + javaMailSender.getPort() + ", " + javaMailSender.getUsername() + " , " + javaMailSender.getPassword());
        Properties props = javaMailSender.getJavaMailProperties();
        Enumeration<Object> keys = props.keys();
        while(keys.hasMoreElements()) {
        		String key = (String)keys.nextElement();
        		log.debug(key + ", "+ props.getProperty(key));
        }
        //split the to address if more than 1
        String[] toEmails = null;
        if(!StringUtils.isEmpty(to)) {
        		toEmails = to.split(",");
        }
        // Prepare message using a Spring helper
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, isMultipart, CharEncoding.UTF_8);
            message.setTo(toEmails);
            message.setFrom(new InternetAddress(jHipsterProperties.getMail().getFrom()));
            message.setSubject(subject);
            message.setText(content, isHtml);
            if(isMultipart){
            	if(!StringUtils.isEmpty(fileName)) {
	                FileSystemResource file =new FileSystemResource(exportPath+"/" +fileName+".xlsx");
	                message.addAttachment(file.getFilename(),file, "text/html");
            	}
            }
            javaMailSender.send(mimeMessage);
            log.debug("Sent e-mail to User '{}'", to);
        } catch (Exception e) {
//        	e.printStackTrace();
            log.warn("E-mail could not be sent to user '{}', exception is: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendEmailFile(String to, String subject, String content, String fileName ,boolean isMultipart, boolean isHtml) {
        log.debug("Send e-mail[multipart '{}' and html '{}'] to '{}' with subject '{}' and content={}",
            isMultipart, isHtml, to, subject, content);

        log.debug(javaMailSender.getHost() +" , " + javaMailSender.getPort() + ", " + javaMailSender.getUsername() + " , " + javaMailSender.getPassword());
        Properties props = javaMailSender.getJavaMailProperties();
        Enumeration<Object> keys = props.keys();
        while(keys.hasMoreElements()) {
            String key = (String)keys.nextElement();
            log.debug(key + ", "+ props.getProperty(key));
        }
        //split the to address if more than 1
        String[] toEmails = null;
        if(!StringUtils.isEmpty(to)) {
        		toEmails = to.split(",");
        }
        
        // Prepare message using a Spring helper
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, isMultipart, CharEncoding.UTF_8);
            message.setTo(toEmails);
            message.setFrom(new InternetAddress(jHipsterProperties.getMail().getFrom()));
            message.setSubject(subject);
            message.setText(content, isHtml);
            if(isMultipart){
                log.debug("file path seperator"+File.pathSeparator);
                FileSystemResource file =new FileSystemResource(exportPath+"/" +fileName+".xlsx");
                message.addAttachment(file.getFilename(),file);
            }
            javaMailSender.send(mimeMessage);
            log.debug("Sent e-mail to User '{}'", to);
        } catch (Exception e) {
            e.printStackTrace();
            log.warn("E-mail could not be sent to user '{}', exception is: {}", to, e.getMessage());
        }
    }
    @Async
    public void sendActivationEmail(UserDTO user, String baseUrl) {
        log.debug("Sending activation e-mail to '{}'", user.getEmail());
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable("user", user);
        context.setVariable("baseUrl", baseUrl);
        String content = templateEngine.process("activationEmail", context);
        String subject = messageSource.getMessage("email.activation.title", null, locale);
        sendEmail(user.getEmail(), subject, content, false, true, null);
    }

    @Async
    public void sendPasswordResetMail(UserDTO user, String baseUrl) {
        log.debug("Sending password reset e-mail to '{}'", user.getEmail());
        Locale locale = Locale.forLanguageTag(user.getLangKey() != null ? user.getLangKey() : "en-US");
        Context context = new Context(locale);
        context.setVariable("user", user);
        context.setVariable("baseUrl", baseUrl);
        String content = templateEngine.process("passwordResetEmail", context);
        String subject = messageSource.getMessage("email.reset.title", null, locale);
        sendEmail(user.getEmail(), subject, content, false, true, null);
    }

    @Async
    public void sendTicketCreatedMail(String ticketUrl,User user,String emailIds, String siteName, long ticketId, String ticketNumber, String createdBy, String sentTo, String ticketTitle, String ticketDescription, String status, String severity){
        Locale locale = Locale.forLanguageTag(user.getLangKey() != null ? user.getLangKey() : "en-US");
        Context context = new Context(locale);
        context.setVariable("user", user);
        context.setVariable("siteName", siteName);
        context.setVariable("severity", severity);
        context.setVariable("ticketNumber", ticketNumber);
        context.setVariable("ticketTitle", ticketTitle);
        context.setVariable("ticketDescription", ticketDescription);
        context.setVariable("status", status);
        context.setVariable("url", ticketUrl);
        String content = templateEngine.process("ticketCreation", context);
        String subject = messageSource.getMessage("email.ticket.alert.title", null, locale);
        sendEmail(user.getEmail(), subject, content, false, true,null);
    }
    
    @Async
    public void sendTicketUpdatedMail(String ticketUrl,User user,String emailIds, String siteName, long ticketId, String ticketNumber, String createdBy, String sentTo, String ticketTitle, String ticketDescription, String status){
        Locale locale = Locale.forLanguageTag(user.getLangKey() != null ? user.getLangKey() : "en-US");
        Context context = new Context(locale);
        context.setVariable("user", user);
        context.setVariable("siteName", siteName);
        context.setVariable("ticketNumber", ticketNumber);
        context.setVariable("ticketTitle", ticketTitle);
        context.setVariable("ticketDescription", ticketDescription);
        context.setVariable("status", status);
        context.setVariable("url", ticketUrl);
        String content = templateEngine.process("ticketUpdated", context);
        String subject = messageSource.getMessage("email.ticket.updated.alert.title", null, locale);
        sendEmail(user.getEmail(), subject, content, false, true,null);
    }
    
    @Async
    public void sendTicketClosedMail(String ticketUrl,User user,String emailIds, String siteName, long ticketId, String ticketNumber, String createdBy, String sentTo, String ticketTitle, String ticketDescription, String status){
        Locale locale = Locale.forLanguageTag(user.getLangKey() != null ? user.getLangKey() : "en-US");
        Context context = new Context(locale);
        context.setVariable("user", user);
        context.setVariable("siteName", siteName);
        context.setVariable("ticketNumber", ticketNumber);
        context.setVariable("ticketTitle", ticketTitle);
        context.setVariable("ticketDescription", ticketDescription);
        context.setVariable("status", status);
        context.setVariable("url", ticketUrl);
        String content = templateEngine.process("ticketApproved", context);
        String subject = messageSource.getMessage("email.ticket.approved.alert.title", null, locale);
        sendEmail(user.getEmail(), subject, content, false, true,null);
    }

    public void sendAttendanceConsolidatedReportEmail(String siteName, String emailIds, String reportData,  String baseUrl, Date currDate) {
        log.debug("Sending attendance consolidated report e-mail to '{}'", emailIds);
        Locale locale = Locale.forLanguageTag("en-US");
        Context context = new Context(locale);
        context.setVariable("baseUrl", baseUrl);
        //context.setVariable("fileName",file);
        context.setVariable("date", DateUtil.formatToDateString(currDate));
        context.setVariable("reportData", reportData);
        String content = templateEngine.process("attendanceConsolidatedReportEmail", context);
        String subject = messageSource.getMessage("email.attendance.report.title", null, locale);
        subject += " - " + siteName;
        sendEmail(emailIds, subject, content, true, true,null);
    }

    @Async
    public void sendAttendanceDetailedReportEmail(String siteName, String emailIds, String reportData, String file, String baseUrl, Date currDate, 
    							Map<String,String> summaryData, Map<String,Map<String,Integer>> siteWiseSummary, Map<String,List<Map<String,String>>> consolidatedData) {
        log.debug("Sending attendance detailed report e-mail to '{}'", emailIds);
        Locale locale = Locale.forLanguageTag("en-US");
        Context context = new Context(locale);
        context.setVariable("baseUrl", baseUrl);
        context.setVariable("fileName",file);
        context.setVariable("date", DateUtil.formatToDateString(currDate));
        context.setVariable("reportData", reportData);
        context.setVariable("summaryData", summaryData);
        context.setVariable("siteWiseSummary", siteWiseSummary);
        context.setVariable("consolidatedData", consolidatedData);
        String content = templateEngine.process("attendanceDetailedReportEmail", context);
        String subject = messageSource.getMessage("email.attendance.detailed.report.title", null, locale);
        subject += " - " + siteName;
        sendEmail(emailIds, subject, content, true, true,file);
    }

    @Async
    public void sendJobReportEmailFile(String emailIds, String file,  String baseUrl, Date currDate) {
        log.debug("Sending job report e-mail to '{}'", emailIds);
        Locale locale = Locale.forLanguageTag("en-US");
        Context context = new Context(locale);
        context.setVariable("baseUrl", baseUrl);
        context.setVariable("fileName",file);
        context.setVariable("date", DateUtil.formatToDateString(currDate));
        String content = templateEngine.process("jobReportEmail", context);
        String subject = messageSource.getMessage("email.report.title", null, locale);
        String fileName = file;
        sendEmail(emailIds, subject, content, true, true,fileName);
    }


    @Async
    public void sendJobReportEmail(User user,  String baseUrl) {
        log.debug("Sending job report e-mail to '{}'", user.getEmail());
        Locale locale = Locale.forLanguageTag(user.getLangKey() != null ? user.getLangKey() : "en-US");
        Context context = new Context(locale);
        context.setVariable("user", user);
        context.setVariable("baseUrl", baseUrl);
        String content = templateEngine.process("jobReportEmail", context);
        String subject = messageSource.getMessage("email.report.title", null, locale);
        sendEmail(user.getEmail(), subject, content, true, true, null);
    }

    @Async
    public void sendOverdueJobAlert(User user, String emailIds,  String siteName, long jobId , String jobName, String fileName) {
        log.debug("Sending overdue job alert e-mail to '{}'", user.getEmail());
        Locale locale = Locale.forLanguageTag(user.getLangKey() != null ? user.getLangKey() : "en-US");
        Context context = new Context(locale);
        context.setVariable("user", user);
        context.setVariable("siteName", siteName);
        context.setVariable("jobId", jobId);
        context.setVariable("jobName", jobName);
        context.setVariable("siteName", siteName);
        String content = templateEngine.process("overdueJobEmailAlert", context);
        String subject = messageSource.getMessage("email.overdue.report.title", null, locale);
        sendEmail(emailIds, subject, content, true, true, fileName);
    }


    @Async
    public void sendCompletedJobAlert(User user,  String siteName, long jobId , String jobName,String fileName) {
        log.debug("Sending completed job alert e-mail to '{}'", user.getEmail());
        Locale locale = Locale.forLanguageTag(user.getLangKey() != null ? user.getLangKey() : "en-US");
        Context context = new Context(locale);
        context.setVariable("user", user);
        context.setVariable("siteName", siteName);
        context.setVariable("jobId", jobId);
        context.setVariable("jobName", jobName);
        context.setVariable("siteName", siteName);
        String content = templateEngine.process("completedJobEmailAlert", context);
        String subject = messageSource.getMessage("email.completed.report.title", null, locale);
        sendEmail(user.getEmail(), subject, content, true, true,fileName);
    }

    @Async
    public void sendFeedbackAlert(String emailIds,  String feedbackName, String feedbackLocation, Date feedbackDate, List<String> feedbackItems, String reportUrl) {
        log.debug("Sending feedback alert e-mail to '{}'", emailIds);
        Locale locale = Locale.forLanguageTag("en-US");
        Context context = new Context(locale);
        context.setVariable("feedbackName", feedbackName);
        context.setVariable("feedbackLocation", feedbackLocation);
        context.setVariable("feedbackDate", feedbackDate);
        context.setVariable("feedbacks", feedbackItems);
        context.setVariable("feedbackReport", reportUrl);
        String content = templateEngine.process("feedbackEmailAlert", context);
        String subject = messageSource.getMessage("email.feedback.alert.title", null, locale);
        sendEmail(emailIds, subject, content, true, true, null);
    }


    @Async
    public String sendEmail(String emailId, String subject, String message,
			String fileName) {

		String msg = "success";

		try {
			Sendgrid mail1 = new Sendgrid("UDS_Homerun", "UDS_Homerun7");
			mail1.use_headers = false;
			mail1.setTo(emailId).setFrom("taskmanadmin@uds.in")
					.setFromName("TaskMan").setSubject(subject).setText(message);
			mail1.send();

		} catch (Exception e) {
			e.printStackTrace();
			log.debug("this is sendEmail method in CommonServiceImpl class ="
					+ e);
			log.error("Error while sending email -",e);
			msg = "error";
		}
		return msg;
	}
    
    public void sendAttendanceCheckouAlertEmail(String emailIds, Map<String,Object> values) {
    		log.debug("Sending attendance consolidated report e-mail to '{}'", emailIds);
    		Locale locale = Locale.forLanguageTag("en-US");
    		Context context = new Context(locale);
    		context.setVariable("checkInTime", values.get("checkInTime"));
    		context.setVariable("site", values.get("site"));
    		String emailContent = templateEngine.process("attendanceCheckoutAlertEmail", context);
    		String subject = messageSource.getMessage("email.attendance.checkout.alert.title", null, locale);
    		sendEmail(emailIds, subject, emailContent, true, true,null);
    	}
}
