package com.ts.app.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.TimeZone;
import java.util.TreeSet;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.hibernate.Hibernate;
import org.joda.time.Minutes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.google.api.client.repackaged.org.apache.commons.codec.binary.Base64;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Attendance;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.EmployeeShift;
import com.ts.app.domain.Project;
import com.ts.app.domain.Setting;
import com.ts.app.domain.Shift;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import com.ts.app.domain.UserRole;
import com.ts.app.domain.UserRoleEnum;
import com.ts.app.ext.api.FaceRecognitionService;
import com.ts.app.repository.AttendanceRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.EmployeeShiftRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SettingsRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.AmazonS3Utils;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.FileUploadHelper;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.PagingUtil;
import com.ts.app.service.util.ReportUtil;
import com.ts.app.web.rest.dto.AttendanceDTO;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.EmployeeDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.FaceRecognitionRequest;
import com.ts.app.web.rest.dto.FaceRecognitionResponse;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;

/**
 * Service class for managing employee attendance functions.
 */
@Service
@Transactional
public class AttendanceService extends AbstractService {

    private final Logger log = LoggerFactory.getLogger(AttendanceService.class);

    @Inject
    private AttendanceRepository attendanceRepository;

    @Inject
    private SiteRepository siteRepository;

    @Inject
    private EmployeeRepository employeeRepository;

    @Inject
    private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

    @Inject
    private FileUploadHelper fileUploadHelper;

    @Inject
    private FaceRecognitionService faceRecognitionService;

    @Inject
    private ExportUtil exportUtil;

    @Inject
    private UserRepository userRepository;

    @Inject
    private ProjectRepository projectRepository;

    @Inject
    private ReportUtil reportUtil;

    @Inject
    private SettingsRepository settingRepository;

    @Inject
    private EmployeeShiftRepository empShiftRepo;

    @Inject
    private Environment env;

    @Inject
    private AmazonS3Utils s3ServiceUtils;

    @Value("${AWS.s3-cloudfront-url}")
    private String cloudFrontUrl;

    @Value("${AWS.s3-bucketEnv}")
    private String bucketEnv;

    @Value("${AWS.s3-enroll-path}")
    private String enrollPath;

    @Value("${AWS.s3-checkin-path}")
    private String checkinPath;

    @Value("${AWS.s3-checkout-path}")
    private String checkoutPath;

    public AttendanceDTO saveCheckOutAttendance(AttendanceDTO attnDto){
        Attendance attn = mapperUtil.toEntity(attnDto, Attendance.class);
        Employee emp = employeeRepository.findByEmpId(attnDto.getEmployeeEmpId());
        Attendance dbAttn = attendanceRepository.findOne(attn.getId());
        Calendar now = Calendar.getInstance();
        log.debug("check In Time from db"+dbAttn.getCheckInTime());
        log.debug("attendance id"+dbAttn.getId());
        log.debug("latitude out"+attn.getLatitudeOut());
        log.debug("longitude out"+attn.getLongitudeOut());
        //now.add(Calendar.DAY_OF_MONTH, 1); // added for checking nigth shift next day check out
        //now.set(Calendar.HOUR_OF_DAY,6);
        if(StringUtils.isEmpty(attn.getCheckOutImage())){
            log.debug("check in image not available");
        }else{
            log.debug("check in image available");
            long dateTime = new Date().getTime();
            attnDto = s3ServiceUtils.uploadCheckoutImage(attn.getCheckOutImage(), attnDto, dateTime);
            log.debug("S3 image url and name- "+attnDto.getUrl()+" - "+attnDto.getCheckOutImage());

            String faceRecognitionResponse[] = faceRecognitionService.detectImage(attnDto.getUrl());
            if(faceRecognitionResponse.length>0) {
                if (faceRecognitionResponse[0] == "success" ) {
                    log.debug("Face Id -1 - "+emp.getFaceId());
                    log.debug("Face Id -2 - "+faceRecognitionResponse[1]);
                    String[] faceVerificationResponse = faceRecognitionService.verifyImage(emp.getFaceId(),faceRecognitionResponse[1]);
                    log.debug("Face verification response"+faceVerificationResponse[0]);
                    log.debug("Face verification response"+Boolean.parseBoolean(faceVerificationResponse[1]));

                    if(faceVerificationResponse[0].equals("success") ){
                        log.debug("Face verification response"+faceVerificationResponse[1]);
                        boolean isIdentical = Boolean.parseBoolean(faceVerificationResponse[1]);

                        if(isIdentical){
                            log.debug("Verification success identical: "+isIdentical);
                            attnDto.setUrl(attnDto.getUrl());
                            dbAttn.setCheckOutImage(attnDto.getCheckOutImage());
                            dbAttn.setCheckOutTime(new java.sql.Timestamp(now.getTimeInMillis()));

                        }else{
                            log.debug("Verification failed identical: "+isIdentical);

                            attnDto.setErrorStatus(true);
                            attnDto.setErrorMessage("Face not Verified");
                            return attnDto;
                        }
                    }else{
                        log.debug("Verification failed ");
                        attnDto.setErrorStatus(true);
                        attnDto.setErrorMessage("Face not Verified");
                        return attnDto;
                    }

                }else{
                    attnDto.setErrorMessage("Face Not Detected");
                    attnDto.setErrorStatus(true);
                    return attnDto;
                }
            }else{
                attnDto.setErrorMessage("Face Not Detected");
                attnDto.setErrorStatus(true);
                return attnDto;
            }
        }
        dbAttn.setLatitudeOut(attn.getLatitudeOut());
        dbAttn.setLongitudeOut(attn.getLongitudeOut());
        dbAttn.setOffline(attnDto.isOffline());
        dbAttn.setRemarks(attnDto.getRemarks());
        if(dbAttn.isOffline()){
            dbAttn.setCheckOutTime(DateUtil.convertToTimestamp(attnDto.getCheckOutTime()));
        }
        //findShiftTiming(false, attnDto, dbAttn);

        log.debug("Saving attendance checkout");
        dbAttn = attendanceRepository.save(dbAttn);
        attnDto = mapperUtil.toModel(dbAttn, AttendanceDTO.class);
        return attnDto;
    }

    private void findShiftTiming(boolean isCheckIn, AttendanceDTO attnDto,Attendance dbAttn) {
        long siteId = attnDto.getSiteId();
        Site site = siteRepository.findOne(siteId);
        List<Shift> shifts = siteRepository.findShiftsBySite(siteId);
        //List<Shift> shifts = site.getShifts();
        if(log.isDebugEnabled()) {
            log.debug("shift timings - " + shifts);
        }
        Employee emp = employeeRepository.findByEmpId(attnDto.getEmployeeEmpId());

        //load the lead time and grace time properties
        int shiftStartLeadTime = Integer.valueOf(env.getProperty("attendance.shiftStartLeadTime"));
        int shiftEndLeadTime = Integer.valueOf(env.getProperty("attendance.shiftEndLeadTime"));
        int shiftStartGraceTime = Integer.valueOf(env.getProperty("attendance.shiftStartGraceTime"));
        int shiftEndGraceTime = Integer.valueOf(env.getProperty("attendance.shiftEndGraceTime"));
        if(CollectionUtils.isNotEmpty(shifts)) {
            Calendar prevShiftStartCal = null;
            Calendar prevShiftEndCal = null;
            String prevShiftStartTime = null;
            String prevShiftEndTime = null;

            for(Shift shift : shifts) {
                if(log.isDebugEnabled()) {
                    log.debug("shift timing - " + shift.getStartTime() + " - " + shift.getEndTime());
                    log.debug("check in time - " + dbAttn.getCheckInTime());
                }
                String startTime = shift.getStartTime();
                String[] startTimeUnits = startTime.split(":");
                Calendar startCal = Calendar.getInstance();
                startCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTimeUnits[0]));
                startCal.set(Calendar.MINUTE, Integer.parseInt(startTimeUnits[1]));
                startCal.set(Calendar.SECOND, 0);
                startCal.set(Calendar.MILLISECOND, 0);


                Calendar startCalLeadTime = Calendar.getInstance();
                startCalLeadTime.setTimeInMillis(startCal.getTimeInMillis());
                startCalLeadTime.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTimeUnits[0]) - shiftStartLeadTime);
                startCalLeadTime.set(Calendar.MINUTE, Integer.parseInt(startTimeUnits[1]));

                Calendar startCalGraceTime = Calendar.getInstance();
                startCalGraceTime.setTimeInMillis(startCal.getTimeInMillis());
                startCalGraceTime.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTimeUnits[0]) + shiftStartGraceTime);
                startCalGraceTime.set(Calendar.MINUTE, Integer.parseInt(startTimeUnits[1]));

                String endTime = shift.getEndTime();
                String[] endTimeUnits = endTime.split(":");
                Calendar endCal = Calendar.getInstance();
                endCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(endTimeUnits[0]));
                endCal.set(Calendar.MINUTE, Integer.parseInt(endTimeUnits[1]));
                endCal.set(Calendar.SECOND, 0);
                endCal.set(Calendar.MILLISECOND, 0);

                Calendar endCalLeadTime = Calendar.getInstance();
                endCalLeadTime.setTimeInMillis(endCal.getTimeInMillis());
                endCalLeadTime.set(Calendar.HOUR_OF_DAY, Integer.parseInt(endTimeUnits[0]) - shiftEndLeadTime);
                endCalLeadTime.set(Calendar.MINUTE, Integer.parseInt(endTimeUnits[1]));

                Calendar endCalGraceTime = Calendar.getInstance();
                endCalGraceTime.setTimeInMillis(endCal.getTimeInMillis());
                endCalGraceTime.set(Calendar.HOUR_OF_DAY, Integer.parseInt(endTimeUnits[0]) + shiftEndGraceTime);
                endCalGraceTime.set(Calendar.MINUTE, Integer.parseInt(endTimeUnits[1]));

                if(!isCheckIn && endCal.before(startCal)) {
                    startCal.add(Calendar.DAY_OF_MONTH, -1);
                    startCalLeadTime.add(Calendar.DAY_OF_MONTH, -1);
                    startCalGraceTime.add(Calendar.DAY_OF_MONTH, -1);
                }

                if(isCheckIn && endCal.before(startCal)) {
                    endCal.add(Calendar.DAY_OF_MONTH, 1);
                    endCalLeadTime.add(Calendar.DAY_OF_MONTH, 1);
                    endCalGraceTime.add(Calendar.DAY_OF_MONTH, 1);
                }
                log.debug("Shift timing "+site.getId());
                log.debug("Shift timing "+ emp.getId());
                log.debug("Shift timing "+startCal.getTime());
                log.debug("Shift timing "+endCal.getTime());
                EmployeeShift empShift = empShiftRepo.findEmployeeShiftBySiteAndShift(site.getId(), emp.getId() , DateUtil.convertToTimestamp(startCal.getTime()), DateUtil.convertToTimestamp(endCal.getTime()));

                Calendar checkInCal = Calendar.getInstance();
                checkInCal.setTimeInMillis(dbAttn.getCheckInTime().getTime());

                Calendar checkOutCal = null;
                if(dbAttn.getCheckOutTime() != null) {
                    checkOutCal = Calendar.getInstance();
                    checkOutCal.setTimeInMillis(dbAttn.getCheckOutTime().getTime());
                }


				if(checkInCal.after(startCalLeadTime) && checkInCal.before(endCalGraceTime)) {
					if(checkInCal.after(startCal)) {
						dbAttn.setShiftStartTime(startTime);
						dbAttn.setShiftEndTime(endTime);
					}else if(prevShiftStartCal != null && prevShiftStartCal.equals(startCalLeadTime)) {
						dbAttn.setShiftStartTime(prevShiftStartTime);
						dbAttn.setShiftEndTime(prevShiftEndTime);
					}else {
						dbAttn.setShiftStartTime(startTime);
						dbAttn.setShiftEndTime(endTime);
					}
				}else {
					if(StringUtils.isEmpty(dbAttn.getShiftStartTime())){
						if(prevShiftStartCal != null) {
							long prevShiftDiff = DateUtil.getDiff(prevShiftStartCal, checkInCal);
							long currShiftDiff = DateUtil.getDiff(checkInCal, startCal);
							if(currShiftDiff < prevShiftDiff) {
								dbAttn.setShiftStartTime(startTime);
								dbAttn.setShiftEndTime(endTime);
							}else {
								dbAttn.setShiftStartTime(prevShiftStartTime);
								dbAttn.setShiftEndTime(prevShiftEndTime);
							}
						}else {
							dbAttn.setShiftStartTime(prevShiftStartTime);
							dbAttn.setShiftEndTime(prevShiftEndTime);
						}
					}else {
						String[] prevMatchedStartTimeUnits = dbAttn.getShiftStartTime().split(":");
						Calendar prevMatchedStartCal = Calendar.getInstance();
						prevMatchedStartCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(prevMatchedStartTimeUnits[0]));
						prevMatchedStartCal.set(Calendar.MINUTE, Integer.parseInt(prevMatchedStartTimeUnits[1]));
						prevMatchedStartCal.set(Calendar.SECOND, 0);
						prevMatchedStartCal.set(Calendar.MILLISECOND, 0);
						long prevShiftDiff = DateUtil.getDiff(prevMatchedStartCal, checkInCal);
						long currShiftDiff = DateUtil.getDiff(checkInCal, startCal);
						if(currShiftDiff < prevShiftDiff) {
							dbAttn.setShiftStartTime(startTime);
							dbAttn.setShiftEndTime(endTime);
						}
					}
				}


				/*
				if(checkInCal.before(endCalLeadTime)) { // 12:30 PM checkin time < 1 PM (2PM shift ends) - 1 hr lead time
					if((startCal.before(checkInCal))  // 7 AM shift starts < 12:30 PM check in
							|| startCal.equals(checkInCal)) {
						dbAttn.setShiftStartTime(startTime);  //7 AM considered as shift starts
						dbAttn.setShiftEndTime(endTime);
						if(empShift != null) {
							break;
						}
					}
				}

				if(checkInCal.after(startCalLeadTime) && (prevShiftStartCal != null &&  (prevShiftStartCal.before(startCalLeadTime) || prevShiftStartCal.equals(startCalLeadTime))) ) { // 1:30 PM checkin time > 1 PM (2 PM shift start) - 1 hr lead time
					if((startCal.after(checkInCal))  // 2:00 PM shift starts > 1:30 PM check in
							|| startCal.equals(checkInCal)) {
						dbAttn.setShiftStartTime(startTime);  //2 PM considered as shift starts
						dbAttn.setShiftEndTime(endTime);
						if(empShift != null) {
							break;
						}
					}else if(checkInCal.before(endCalLeadTime) && startCal.before(checkInCal)) {
						dbAttn.setShiftStartTime(startTime);
						dbAttn.setShiftEndTime(endTime);
						if(empShift != null) {
							break;
						}
					}
				}else if(checkInCal.after(startCalLeadTime) && (prevShiftStartCal != null && prevShiftStartCal.after(startCalLeadTime))){
					dbAttn.setShiftStartTime(startTime);
					dbAttn.setShiftEndTime(endTime);
					if(empShift != null) {
						break;
					}
				}else if(checkInCal.after(startCalLeadTime)) {
					dbAttn.setShiftStartTime(startTime);
					dbAttn.setShiftEndTime(endTime);
					if(empShift != null) {
						break;
					}
				}

				*/

				/*
				if(checkOutCal != null) { //if checkout done
					if(checkOutCal.after(startCalGraceTime)) { // 3:30 PM checkout time > 3 PM (2 PM shift start)  + 1 hr grace time
						if((endCal.after(checkOutCal))  // 10 PM shift ends > 3:30 PM checkout time
								|| endCal.equals(checkOutCal)) {
							dbAttn.setShiftEndTime(endTime); // 10 PM considered as checkout time
							break;
						}
					}

					if(checkOutCal.before(endCalGraceTime)) { // 10:30 PM checkout time < 11 PM (10 PM shift ends) + 1 hr grace time
						if((endCal.before(checkOutCal))  // 10 PM shift ends < 10:30 PM checkout time
								|| endCal.equals(checkOutCal)) {
							dbAttn.setShiftEndTime(endTime); //10 PM considered as checkout time
							break;
						}else if(endCal.after(checkOutCal)) {
							dbAttn.setShiftEndTime(endTime);
						}
					}
				}
				*/
                prevShiftStartCal = Calendar.getInstance();
                prevShiftStartCal.setTime(startCal.getTime());

                prevShiftEndCal = Calendar.getInstance();
                prevShiftEndCal.setTime(endCal.getTime());

                prevShiftStartTime = startTime;
                prevShiftEndTime = endTime;
            }
        }
    }

    public AttendanceDTO saveAttendance(AttendanceDTO attnDto) {
        log.debug("Attendance latitude in "+attnDto.getLatitudeIn());
        Attendance attn = mapperUtil.toEntity(attnDto, Attendance.class);
        attn.setActive(attn.ACTIVE_YES);
        SearchCriteria sc = new SearchCriteria();
        sc.setSiteId(attnDto.getSiteId());
        sc.setEmployeeEmpId(String.valueOf(attnDto.getEmployeeEmpId()));
        Calendar startCal = Calendar.getInstance();
        startCal.set(Calendar.HOUR_OF_DAY, 0);
        startCal.set(Calendar.MINUTE, 0);
        startCal.set(Calendar.SECOND, 0);
        Calendar endCal = Calendar.getInstance();
        endCal.set(Calendar.HOUR_OF_DAY, 23);
        endCal.set(Calendar.MINUTE, 59);
        endCal.set(Calendar.SECOND, 0);
        sc.setCheckInDateTimeFrom(startCal.getTime());
        sc.setCheckInDateTimeTo(endCal.getTime());
        log.debug("seach criteria"+" - " +sc.getEmployeeEmpId()+" - " +sc.getSiteId()+" - " +sc.getCheckInDateTimeFrom()+" - " +sc.getCheckInDateTimeTo());
        SearchResult<AttendanceDTO> result = findBySearchCrieria(sc);
        //if(result == null || CollectionUtils.isEmpty(result.getTransactions())) {
        boolean isCheckInAllowed = true;
        if(result != null && !CollectionUtils.isEmpty(result.getTransactions())) {
            List<AttendanceDTO> attns = result.getTransactions();
            for(AttendanceDTO attnd : attns) {
                if(attnd.getCheckOutTime() == null) {
                    isCheckInAllowed = false;
                    break;
                }
            }
        }
        if(isCheckInAllowed) {
            log.debug("no transactions" + attnDto.getEmployeeEmpId());
            Employee emp = employeeRepository.findByEmpId(attnDto.getEmployeeEmpId());
            Site site = siteRepository.findOne(attnDto.getSiteId());
            attn.setSite(site);
            attn.setEmployee(emp);
            attn.setLatitudeIn(attnDto.getLatitudeIn());
            attn.setLongitudeIn(attnDto.getLongitudeIn());
            attn.setOffline(attnDto.isOffline());
            attn.setRemarks(attnDto.getRemarks());
            if(attn.isOffline()){
                attn.setCheckInTime(DateUtil.convertToTimestamp(attnDto.getCheckInTime()));
            }
            log.debug("attendance employee details"+attn.getEmployee().getId());
            Calendar now = Calendar.getInstance();
            //now.set(Calendar.HOUR_OF_DAY, 22); //added for testing night shift
            attn.setCheckInTime(new java.sql.Timestamp(now.getTimeInMillis()));
//			attn.setDate(attn.getCheckInTime());
            if(StringUtils.isEmpty(attn.getCheckInImage())){
                log.debug("check in image not available");
            }else{
                log.debug("check in image available");
                long dateTime = new Date().getTime();
                attnDto = s3ServiceUtils.uploadCheckInImage(attn.getCheckInImage(), attnDto, dateTime);
                String faceRecognitionResponse[] = faceRecognitionService.detectImage(attnDto.getUrl());
                if(faceRecognitionResponse.length>0) {
                    if (faceRecognitionResponse[0] == "success") {
                        log.debug("Face Id -1 - "+emp.getFaceId());
                        log.debug("Face Id -2 - "+faceRecognitionResponse[1]);
                        String[] faceVerificationResponse = faceRecognitionService.verifyImage(emp.getFaceId(),faceRecognitionResponse[1]);

                        boolean isIdentical = Boolean.parseBoolean(faceVerificationResponse[1]);
                        log.debug("Face Verificatio response - "+faceVerificationResponse[0]);
                        log.debug("Face Verificatio response - "+faceVerificationResponse[1]);
                        log.debug("Face Verificatio response - "+faceVerificationResponse[2]);

                        if(faceVerificationResponse[0] == "success"){

                            if(isIdentical){
                                attnDto.setUrl(attnDto.getUrl());
                                attn.setCheckInImage(attnDto.getCheckInImage());
                            }else{
                                attnDto.setErrorStatus(true);
                                attnDto.setErrorMessage("Face not Verified");
                                return attnDto;
                            }


                        }else{
                            attnDto.setErrorStatus(true);
                            attnDto.setErrorMessage("Face not Verified");
                            return attnDto;
                        }

                    }else{
                        attnDto.setErrorMessage("Face Not Detected");
                        attnDto.setErrorStatus(true);
                        return attnDto;
                    }
                }else{
                    attnDto.setErrorMessage("Face Not Detected");
                    attnDto.setErrorStatus(true);
                    return attnDto;
                }

            }
            //mark the shift timings
            findShiftTiming(true,attnDto, attn);
            if(result != null && !CollectionUtils.isEmpty(result.getTransactions())) {
                List<AttendanceDTO> attns =  result.getTransactions();
                if(CollectionUtils.isNotEmpty(attns)) {
                    AttendanceDTO prevAttnDto = attns.get(0);
                    Attendance prevAttn = attendanceRepository.findOne(prevAttnDto.getId());
                    Hibernate.initialize(prevAttn.getSite());
                    Hibernate.initialize(prevAttn.getEmployee());
                    attn.setContinuedAttendance(prevAttn);
                }

            }else {
                attn.setContinuedAttendance(null);
            }

            List<Setting> settings = settingRepository.findSettingByKeyAndSiteId(SettingsService.EMAIL_NOTIFICATION_ATTENDANCE_GRACE_TIME, attnDto.getSiteId());
            if(CollectionUtils.isNotEmpty(settings)) {
                Setting setting = settings.get(0);
                int graceTime = Integer.parseInt(setting.getSettingValue());
                String shiftStartTime = attn.getShiftStartTime();
                if(org.apache.commons.lang3.StringUtils.isNotEmpty(shiftStartTime)) {
                    String[] startTimeUnits = shiftStartTime.split(":");
                    Calendar shiftGraceTimeCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
                    shiftGraceTimeCal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(startTimeUnits[0]));
                    shiftGraceTimeCal.set(Calendar.MINUTE, Integer.parseInt(startTimeUnits[1]));
                    shiftGraceTimeCal.set(Calendar.SECOND, 0);
                    shiftGraceTimeCal.set(Calendar.MILLISECOND, 0);
                    shiftGraceTimeCal.add(Calendar.MINUTE, graceTime);
                    if(shiftGraceTimeCal.before(now)) {
                        attn.setLate(true); //mark late attendance if the checkin time is
                    }
                }
            }

            attn = attendanceRepository.save(attn);
            log.debug("Attendance marked: {}", attn);
            attnDto = mapperUtil.toModel(attn, AttendanceDTO.class);
		/*
		}else {
            List<AttendanceDTO> attns =  result.getTransactions();
            if(CollectionUtils.isNotEmpty(attns)) {
                attnDto = attns.get(0);
            }
            log.debug("Attendance already marked: {}", attnDto);

		}
		*/
        }
        return attnDto;
    }

    @Transactional
    public AttendanceDTO uploadFile(AttendanceDTO attendanceDto) {

        log.debug("EmployeeService.uploadFile - action - " + attendanceDto.getAction());
        log.debug("Employee list from check in out images" + attendanceDto.getEmployeeEmpId());
        log.debug("Employee list from check in out images" + attendanceDto.getId());
        Attendance attendanceImage = attendanceRepository.findOne(attendanceDto.getId());
        // CheckInOut checkInOut = CollectionUtils.isNotEmpty(checkInOutExistingList) ?
        // checkInOutExistingList.get(0) : null;
        String fileName = s3ServiceUtils.uploadAttendanceFile(attendanceDto.getEmployeeEmpId(), attendanceDto.getAction(), attendanceDto.getPhotoOutFile(),
            System.currentTimeMillis());
        attendanceDto.setAttendanceIn(fileName);
        // Attendance attendanceImage = new Attendance();
        attendanceImage.setAttendanceIn(fileName);
        // attendanceImage.setEmployee(employeeRepository.findOne(attendanceDto.getEmployeeId()));
        // attendanceImage.setId(attendanceDto.getId());

        attendanceImage = attendanceRepository.save(attendanceImage);

        if (attendanceDto.getAction().equals("verify")) {
            FaceRecognitionRequest frRequest = new FaceRecognitionRequest();
            frRequest.setEmployeeId(attendanceImage.getEmployee().getId());
            frRequest.setEmployeeFullName(attendanceImage.getEmployee().getFullName());
            String imageUrl = fileUploadHelper.readAttendanceImage(attendanceImage.getId(), attendanceImage.getEmployee().getEmpId(), attendanceImage.getAttendanceIn());
            frRequest.setImageUrl(imageUrl);
//			FaceRecognitionResponse frResponse = faceRecognitionService.verify(frRequest);
//			attendanceDto.setAction(frResponse.getStatusMessage());
            return attendanceDto;
        } else {
            FaceRecognitionRequest frRequest = new FaceRecognitionRequest();
            frRequest.setEmployeeId(attendanceImage.getEmployee().getId());
            frRequest.setEmployeeFullName(attendanceImage.getEmployee().getFullName());
            String imageUrl = fileUploadHelper.readAttendanceImage(attendanceImage.getId(), attendanceImage.getEmployee().getEmpId(), attendanceImage.getAttendanceIn());
            frRequest.setImageUrl(imageUrl);
            FaceRecognitionResponse frResponse = null;
//			FaceRecognitionResponse frResponse = faceRecognitionService.detect(frRequest);
            if (frResponse.getStatus().equals("success")) {
//				FaceRecognitionResponse frEnrollResponse = faceRecognitionService.enroll(frRequest);
//				attendanceDto.setAction(frEnrollResponse.getStatusMessage());
            } else {
                attendanceDto.setAction(frResponse.getStatusMessage());
            }
            return attendanceDto;

        }

    }

    public String enrollUser(EmployeeDTO employee, String imageData) {
        FaceRecognitionRequest frRequest = new FaceRecognitionRequest();
        frRequest.setEmployeeId(employee.getId());
        frRequest.setEmployeeFullName(employee.getFullName());
        frRequest.setImageUrl(imageData);
        FaceRecognitionResponse frResponse = null;
//		FaceRecognitionResponse frResponse = faceRecognitionService.detect(frRequest);
        if (frResponse.getStatus().equals("success")) {
//			FaceRecognitionResponse frEnrollResponse = faceRecognitionService.enroll(frRequest);
            String message = "Success";
            return message;
        } else {
            String message = "failure";
            return message;

        }
    }

    public List<AttendanceDTO> findAll() {
        List<Attendance> entities = attendanceRepository.findAll();
        return mapperUtil.toModelList(entities, AttendanceDTO.class);
    }

    public List<AttendanceDTO> findByEmpId(SearchCriteria searchCriteria) {
        log.debug("search Criteria", searchCriteria);
        List<Attendance> transactions = null;
        if (searchCriteria != null) {

            Calendar startCal = Calendar.getInstance();
            startCal.set(Calendar.HOUR_OF_DAY, 0);
            startCal.set(Calendar.MINUTE, 0);
            startCal.set(Calendar.SECOND, 0);
            Calendar endCal = Calendar.getInstance();
            endCal.set(Calendar.HOUR_OF_DAY, 23);
            endCal.set(Calendar.MINUTE, 59);
            endCal.set(Calendar.SECOND, 0);
            searchCriteria.setCheckInDateTimeFrom(startCal.getTime());
            searchCriteria.setCheckInDateTimeTo(endCal.getTime());
            Long employeeId = searchCriteria.getEmployeeId();
            java.sql.Date startDate = new java.sql.Date(searchCriteria.getCheckInDateTimeFrom().getTime());
            java.sql.Date toDate = new java.sql.Date(searchCriteria.getCheckInDateTimeTo().getTime());
            transactions = attendanceRepository.findBySiteIdEmpId(searchCriteria.getProjectId(), searchCriteria.getSiteId(), searchCriteria.getEmployeeEmpId());
        }
        return mapperUtil.toModelList(transactions, AttendanceDTO.class);
    }

    public List<AttendanceDTO> findEmpCheckInInfo(SearchCriteria searchCriteria) {
        log.debug("search Criteria", searchCriteria);
        List<AttendanceDTO> attnDtos = new ArrayList<AttendanceDTO>();
        List<Attendance> transactions = null;
        if (searchCriteria != null) {

            Calendar startCal = Calendar.getInstance();
            startCal.set(Calendar.HOUR_OF_DAY, 0);
            startCal.set(Calendar.MINUTE, 0);
            startCal.set(Calendar.SECOND, 0);
            Calendar endCal = Calendar.getInstance();
            endCal.set(Calendar.HOUR_OF_DAY, 23);
            endCal.set(Calendar.MINUTE, 59);
            endCal.set(Calendar.SECOND, 0);
            searchCriteria.setCheckInDateTimeFrom(startCal.getTime());
            searchCriteria.setCheckInDateTimeTo(endCal.getTime());
            Long employeeId = searchCriteria.getEmployeeId();
            java.sql.Date startDate = new java.sql.Date(searchCriteria.getCheckInDateTimeFrom().getTime());
            java.sql.Date toDate = new java.sql.Date(searchCriteria.getCheckInDateTimeTo().getTime());
            transactions = attendanceRepository.findBySiteIdEmpId(searchCriteria.getProjectId(), searchCriteria.getSiteId(), searchCriteria.getEmployeeEmpId());
        }
        if(CollectionUtils.isNotEmpty(transactions)) {
            for(Attendance attn : transactions) {
                AttendanceDTO attnDto = new AttendanceDTO();
                attnDto.setNotCheckedOut(attn.isNotCheckedOut());
                attnDto.setId(attn.getId());
                Site site = attn.getSite();
                attnDto.setSiteId(site.getId());
                attnDto.setSiteName(site.getName());
                attnDtos.add(attnDto);
            }
        }
        //return mapperUtil.toModelList(transactions, AttendanceDTO.class);
        return attnDtos;
    }

    public String getAttendanceImage(long id, String empId) {
        String attendanceBase64 = null;
        Attendance attendance = attendanceRepository.findOne(id);
        log.debug("Attendance Image service" + attendance.getId() + " " + attendance.getAttendanceIn());
        attendanceBase64 = fileUploadHelper.readAttendanceImage(attendance.getId(), empId, attendance.getAttendanceIn());

        return attendanceBase64;

    }

	public AttendanceDTO findCurrentCheckInByEmpId(long empId) {
		AttendanceDTO attnDto = null;
		Calendar startCal = Calendar.getInstance();
		startCal.set(Calendar.HOUR_OF_DAY, 0);
		startCal.set(Calendar.MINUTE, 0);
		startCal.set(Calendar.SECOND, 0);
		Calendar endCal = Calendar.getInstance();
		endCal.set(Calendar.HOUR_OF_DAY, 23);
		endCal.set(Calendar.MINUTE, 59);
		endCal.set(Calendar.SECOND, 0);
		List<Attendance> attns = attendanceRepository.findCurrentCheckIn(empId, DateUtil.convertToSQLDate(startCal.getTime()), DateUtil.convertToSQLDate(endCal.getTime()));
		if(CollectionUtils.isNotEmpty(attns)) {
			Attendance attn = attns.get(0);
			attnDto = mapperUtil.toModel(attn, AttendanceDTO.class);
		}
		return attnDto;
	}

    public AttendanceDTO findOne(Long attnId) {
        Attendance entity = attendanceRepository.findOne(attnId);
        return mapperUtil.toModel(entity, AttendanceDTO.class);
    }

    public SearchResult<AttendanceDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
        log.debug("search Criteria siteId - " + searchCriteria.getSiteId());
        log.debug("search Criteria userId -  " + searchCriteria.getUserId());
        log.debug("search Criteria check in date time -  " + searchCriteria.getCheckInDateTimeFrom());
        SearchResult<AttendanceDTO> result = new SearchResult<AttendanceDTO>();
        if (searchCriteria != null) {
            // -------
            Pageable pageRequest = null;
            if (!StringUtils.isEmpty(searchCriteria.getColumnName())) {
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" + sort);
                if (searchCriteria.isReport()) {
                    pageRequest = createPageSort(searchCriteria.getCurrPage(), Integer.MAX_VALUE, sort);
                } else {
                    pageRequest = createPageSort(searchCriteria.getCurrPage(), PagingUtil.PAGE_SIZE, sort);
                }

            } else {
                if (searchCriteria.isReport()) {
                    pageRequest = createPageRequest(searchCriteria.getCurrPage(), true);
                } else {
                    pageRequest = createPageRequest(searchCriteria.getCurrPage());
                }
            }

            // Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
            Page<Attendance> page = null;
            List<AttendanceDTO> transactions = null;
            Calendar startCal = Calendar.getInstance();

            if (searchCriteria.getCheckInDateTimeFrom() != null) {
                startCal.setTime(searchCriteria.getCheckInDateTimeFrom());
            }
            startCal.set(Calendar.HOUR_OF_DAY, 0);
            startCal.set(Calendar.MINUTE, 0);
            startCal.set(Calendar.SECOND, 0);
            searchCriteria.setCheckInDateTimeFrom(startCal.getTime());
            Calendar endCal = Calendar.getInstance();
            if (searchCriteria.getCheckInDateTimeTo() != null) {
                endCal.setTime(searchCriteria.getCheckInDateTimeTo());
            }
            endCal.set(Calendar.HOUR_OF_DAY, 23);
            endCal.set(Calendar.MINUTE, 59);
            endCal.set(Calendar.SECOND, 0);
            searchCriteria.setCheckInDateTimeTo(endCal.getTime());
            if (searchCriteria.isReport()) {
                pageRequest = null;
            }
            if (!searchCriteria.isFindAll()) {
                Employee employee = employeeRepository.findByUserId(searchCriteria.getUserId());
                Set<Long> subEmpIds = new TreeSet<Long>();
                if (employee != null) {
                    Hibernate.initialize(employee.getSubOrdinates());
                    int levelCnt = 1;
                    findAllSubordinates(employee, subEmpIds, levelCnt);
                    log.debug("List of subordinate ids -" + subEmpIds);
                    List<Long> subEmpList = new ArrayList<Long>();
                    subEmpList.addAll(subEmpIds);
                    searchCriteria.setSubordinateIds(subEmpList);
                }


                if (searchCriteria.getCheckInDateTimeFrom() != null) {
                    log.debug("check date and time from available -  " + searchCriteria.getCheckInDateTimeFrom());
                    java.sql.Date startDate = new java.sql.Date(searchCriteria.getCheckInDateTimeFrom().getTime());
                    java.sql.Date toDate = new java.sql.Date(searchCriteria.getCheckInDateTimeTo().getTime());

                    if (!StringUtils.isEmpty(searchCriteria.getEmployeeEmpId())) {
                        log.debug("find by  employee id only - " + searchCriteria.getEmployeeEmpId());
                        page = attendanceRepository.findByEmpIdAndCheckInTime(searchCriteria.getEmployeeEmpId(), startDate, toDate, pageRequest);
                    } else if (!StringUtils.isEmpty(searchCriteria.getName())) {
                        if (searchCriteria.getSiteId() != 0) {
                            page = attendanceRepository.findBySiteIdEmpNameAndDate(searchCriteria.getProjectId(), searchCriteria.getSiteId(), searchCriteria.getName(), startDate,
                                toDate, pageRequest);
                        }
                    }

                    if (searchCriteria.getSiteId() != 0 && searchCriteria.getProjectId() != 0 && StringUtils.isEmpty(searchCriteria.getEmployeeEmpId())) {
                        page = attendanceRepository.findBySiteIdAndCheckInTime(searchCriteria.getSiteId(), startDate, toDate, pageRequest);
                    } else if (searchCriteria.getSiteId() != 0 && StringUtils.isEmpty(searchCriteria.getEmployeeEmpId())) {
                        log.debug("find by site id and check in  date and time - " + searchCriteria.getSiteId());
                        page = attendanceRepository.findBySiteIdAndCheckInTime(searchCriteria.getProjectId(), searchCriteria.getSiteId(), startDate, toDate, pageRequest);
                    } else if (searchCriteria.getSiteId() != 0) {
                        log.debug("find by site id and employee id date and time - " + searchCriteria.getSiteId() + " - " + searchCriteria.getEmployeeEmpId());
                        page = attendanceRepository.findBySiteIdEmpIdAndDate(searchCriteria.getProjectId(), searchCriteria.getSiteId(), searchCriteria.getEmployeeEmpId(),
                            startDate, toDate, pageRequest);
                    } else if (searchCriteria.getProjectId() > 0) {

                        if(StringUtils.isEmpty(searchCriteria.getRegion())){
                            if (StringUtils.isEmpty(searchCriteria.getEmployeeEmpId())) {
                                page = attendanceRepository.findByProjectIdAndDate(searchCriteria.getProjectId(), startDate, toDate, pageRequest);
                            } else {
                                log.debug("find by  employee id only - " + searchCriteria.getEmployeeEmpId());
                                page = attendanceRepository.findBySiteIdEmpIdAndDate(searchCriteria.getProjectId(), searchCriteria.getSiteId(), searchCriteria.getEmployeeEmpId(),
                                    startDate, toDate, pageRequest);
                                if (CollectionUtils.isEmpty(page.getContent())) {
                                    page = attendanceRepository.findByEmpIdsAndDateRange(searchCriteria.getSubordinateIds(), startDate, toDate, pageRequest);
                                }
                            }
                        }else{

                            if(StringUtils.isEmpty(searchCriteria.getBranch())){
                                log.debug("Project Id - "+searchCriteria.getProjectId());
                                log.debug("Region  - "+searchCriteria.getRegion());

                                List<Long> siteIds = siteRepository.findByRegion(searchCriteria.getProjectId(),searchCriteria.getRegion());
                                page = attendanceRepository.findByMultipleSitesAndCheckInTime(siteIds, startDate, toDate, pageRequest);

                            }else{
                                List<Long> siteIds = siteRepository.findByRegionAndBranch(searchCriteria.getProjectId(),searchCriteria.getRegion(),searchCriteria.getBranch());
                                page = attendanceRepository.findByMultipleSitesAndCheckInTime(siteIds, startDate, toDate, pageRequest);

                            }



                        }


                    }

                }

            } else {
                java.sql.Date startDate = new java.sql.Date(searchCriteria.getCheckInDateTimeFrom().getTime());
                java.sql.Date toDate = new java.sql.Date(searchCriteria.getCheckInDateTimeTo().getTime());
                long userId = searchCriteria.getUserId();
                if (userId > 0) {
                    User user = userRepository.findOne(userId);
                    Hibernate.initialize(user.getUserRole());
                    UserRole userRole = user.getUserRole();
                    if (userRole != null) {
                        if (userRole.getName().equalsIgnoreCase(UserRoleEnum.ADMIN.toValue())) {
                            page = attendanceRepository.findByCheckInTime(startDate, toDate, pageRequest);
                        } else {
                            Employee emp = user.getEmployee();
                            List<EmployeeProjectSite> sites = emp.getProjectSites();
                            if (CollectionUtils.isNotEmpty(sites)) {
                                List<Long> siteIds = new ArrayList<Long>();
                                for (EmployeeProjectSite site : sites) {
                                    siteIds.add(site.getSite().getId());
                                }
                                page = attendanceRepository.findByMultipleSitesAndCheckInTime(siteIds, startDate, toDate, pageRequest);
                            } else {

                            }
                        }
                    }
                }
            }
            if (page != null) {
                transactions = mapperUtil.toModelList(page.getContent(), AttendanceDTO.class);
                if (CollectionUtils.isNotEmpty(transactions)) {
                    for(AttendanceDTO transaction : transactions) {
                        if(transaction.getEmployeeId() > 0) {
                            Employee emply = employeeRepository.findOne(transaction.getEmployeeId());
                            if(emply.getEnrolled_face() != null) {
                                String enrollImgUrl = cloudFrontUrl + bucketEnv + enrollPath + emply.getEnrolled_face();
                                transaction.setEnrollImgUrl(enrollImgUrl);
                            }
                        }

                        if(transaction.getCheckInImage() != null) {
                            String checkInImgUrl = cloudFrontUrl + bucketEnv + checkinPath + transaction.getCheckInImage();
                            transaction.setCheckInImgUrl(checkInImgUrl);
                        }

                        if(transaction.getCheckOutImage() != null) {
                            String checkOutImgUrl = cloudFrontUrl + bucketEnv + checkoutPath + transaction.getCheckOutImage();
                            transaction.setCheckOutImgUrl(checkOutImgUrl);
                        }
                    }

                    buildSearchResult(searchCriteria, page, transactions, result);
                }
            }
        }
        return result;
    }

    private void buildSearchResult(SearchCriteria searchCriteria, Page<Attendance> page, List<AttendanceDTO> transactions, SearchResult<AttendanceDTO> result) {
        if (page != null) {
            result.setTotalPages(page.getTotalPages());
        }
        result.setCurrPage(page.getNumber() + 1);
        result.setTotalCount(page.getTotalElements());
        result.setStartInd((result.getCurrPage() - 1) * 10 + 1);
        result.setEndInd((result.getTotalCount() > 10 ? (result.getCurrPage()) * 10 : result.getTotalCount()));

        result.setTransactions(transactions);
        return;
    }

    public List<AttendanceDTO> findBySite(Long siteId) {
        List<Attendance> entities = attendanceRepository.findBySite(siteId);
        if (entities != null) {
            log.debug("Attendances in attendance service");

            return mapperUtil.toModelList(entities, AttendanceDTO.class);
        } else {
            log.debug("Empty attendances in attendance service");
            return mapperUtil.toModelList(entities, AttendanceDTO.class);
        }
    }

    public ExportResult generateReport(List<AttendanceDTO> transactions, SearchCriteria criteria) {
        User user = userRepository.findOne(criteria.getUserId());
        Employee emp = null;
        if(user != null) {
            emp = user.getEmployee();
        }
        long projId = criteria.getProjectId();
        Project proj = null;
        if(projId > 0) {
            proj = projectRepository.findOne(projId);
            criteria.setProjectName(proj.getName());
        }
        return reportUtil.generateAttendanceReports(transactions, user, emp, null, criteria);
    }

    public ExportResult export(List<AttendanceDTO> transactions, String empId) {
        return exportUtil.writeToCsvFile(transactions, empId, null);
    }

    public ExportResult getExportStatus(String empId, String fileId) {
        ExportResult er = new ExportResult();
        fileId += ".xlsx";
        if (!StringUtils.isEmpty(fileId)) {
            String status = exportUtil.getExportStatus(fileId);
            er.setFile(fileId);
            er.setEmpId(empId);
            er.setStatus(status);
        }
        return er;
    }

    public byte[] getExportFile(String empId, String fileName) {
        // return exportUtil.readExportFile(empId, fileName);
        return exportUtil.readAttendanceExportFile(empId, fileName);
    }

    public String uploadExistingCheckInImage() {
        // TODO Auto-generated method stub
        int currPage = 1;
        int pageSize = 10;
        Pageable pageRequest = createPageRequest(currPage, pageSize);
        log.debug("Curr Page ="+ currPage + ",  pageSize -" + pageSize);
        Page<Attendance> attnResult = attendanceRepository.findAll(pageRequest);
        List<Attendance> attendanceEntity = attnResult.getContent();
        log.debug("Length of attendance List" +attendanceEntity.size());
        while(CollectionUtils.isNotEmpty(attendanceEntity)) {
            log.debug("Curr Page ="+ currPage + ",  pageSize -" + pageSize);
            log.debug("Length of attendance List" +attendanceEntity.size());
            for(Attendance attendance : attendanceEntity) {
                if(attendance.getCheckInImage() != null) {
                    if(attendance.getCheckInImage().indexOf("data:image") == 0) {
                        String base64String = attendance.getCheckInImage().split(",")[1];
                        boolean isBase64 = Base64.isBase64(base64String);
                        AttendanceDTO attendanceModel = mapperUtil.toModel(attendance, AttendanceDTO.class);
                        if(isBase64) {
                            long dateTime = new Date().getTime();
                            attendanceModel = s3ServiceUtils.uploadCheckInImage(attendanceModel.getCheckInImage(), attendanceModel, dateTime);
                            attendance.setCheckInImage(attendanceModel.getCheckInImage());
                        }
                    }
                }
            }
            attendanceRepository.save(attendanceEntity);
            currPage++;
            pageRequest = createPageRequest(currPage, pageSize);
            attnResult = attendanceRepository.findAll(pageRequest);
            attendanceEntity = attnResult.getContent();

        }
        return "Upload attendance checkInImage successfully";
    }

    public String uploadExistingCheckOutImage() {
        // TODO Auto-generated method stub
        int currPage = 1;
        int pageSize = 100;
        Pageable pageRequest = createPageRequest(currPage, pageSize);
        log.debug("Curr Page ="+ currPage + ",  pageSize -" + pageSize);
        Page<Attendance> attnResult = attendanceRepository.findByImage(pageRequest);
        List<Attendance> attendanceEntity = attnResult.getContent();
        while(CollectionUtils.isNotEmpty(attendanceEntity)) {
            log.debug("Curr Page ="+ currPage + ",  pageSize -" + pageSize);
            log.debug("Length of attendance List" +attendanceEntity.size());
            for(Attendance attendance : attendanceEntity) {
                if(attendance.getCheckOutImage() != null) {
                    if(attendance.getCheckOutImage().indexOf("data:image") == 0) {
                        String base64String = attendance.getCheckOutImage().split(",")[1];
                        boolean isBase64 = Base64.isBase64(base64String);
                        AttendanceDTO attendanceModel = mapperUtil.toModel(attendance, AttendanceDTO.class);
                        if(isBase64) {
                            long dateTime = new Date().getTime();
                            attendanceModel = s3ServiceUtils.uploadCheckoutImage(attendanceModel.getCheckOutImage(), attendanceModel, dateTime);
                            attendance.setCheckOutImage(attendanceModel.getCheckOutImage());
                        }
                    }
                }
            }
            attendanceRepository.save(attendanceEntity);
            currPage++;
            pageRequest = createPageRequest(currPage, pageSize);
            attnResult = attendanceRepository.findAll(pageRequest);
            attendanceEntity = attnResult.getContent();
        }
        return "Upload attendance checkOutImage successfully";
    }

    public AttendanceDTO addRemarks(long id,String remarks){
        Attendance attendance = attendanceRepository.findOne(id);
        attendance.setRemarks(remarks);
        attendance = attendanceRepository.saveAndFlush(attendance);

        return  mapperUtil.toModel(attendance, AttendanceDTO.class);
    }

}
