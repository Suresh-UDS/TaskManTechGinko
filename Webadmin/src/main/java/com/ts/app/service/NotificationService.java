package com.ts.app.service;

import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

//import com.ts.app.repository.JobRepository;

/**
 * Service class for sending automated email notifications
 */
@Service
public class NotificationService {

//    private final Logger log = LoggerFactory.getLogger(MailService.class);

	@Value("${email.notification.enabled}")
	private boolean emailNotificationEnabled;

	@Value("${email.notification.url}")
	private String reportUrl;

	@Inject
	private UserRepository userRepository;

//	@Inject
//    private JobRepository jobRepository;

	@Inject
    private EmployeeRepository employeeRepository;

//	@Inject
//	private MailService mailService;

	@Inject
    private SiteService siteService;

//	@Scheduled(cron = "${email.notification.schedule1}")
//	public void scheduledNotification1() {
//		sendEmail();
//	}
//
//	@Scheduled(cron = "${email.notification.schedule2}")
//	public void scheduledNotification2() {
//		sendEmail();
//	}

//	public void sendEmail() {
//		if(emailNotificationEnabled) {
//			List<User> subscribedUsers = userRepository.findByEmailSubscribed();
//			for(User user : subscribedUsers) {
//                mailService.sendJobReportEmail(user, reportUrl);
//			}
//		}
//	}
//
//	public void sendReportEmail(long siteId, String file) {
//	    log.debug("notification service: "+siteId+file);
//        if (emailNotificationEnabled) {
//            List<Employee> employees = employeeRepository.findBySiteId(siteId);
//            for(Employee employee:employees){
//                log.debug("Repeating for employee");
//                User getUser = employee.getUser();
//                if(getUser!=null){
//                    List<User> users = userRepository.findUsersById(employee.getUser().getId());
//                    for(User user:users){
//                        Long id = user.getId();
//                        User subscribedUser = userRepository.findByEmailSubscribedById(id);
//                        if(subscribedUser !=null){
//                            log.debug("subscribed users: "+subscribedUser );
//                            mailService.sendJobReportEmailFile(subscribedUser,file,reportUrl);
//                        }else{
//                            log.debug("not subscribed users: "+subscribedUser);
//                        }
//                    }
//                }else{
//                    log.debug("user not found"+employee.getId());
//                }
//
//            }
////            List<User> subscribedUsers = userRepository.findByEmailSubscribed();
//            for (User user : subscribedUsers) {
//                mailService.sendJobReportEmail(user, reportUrl);
//            }
        }
//    }
//}
