package com.ts.app.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Attendance;
import com.ts.app.domain.Employee;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import com.ts.app.domain.UserGroup;
import com.ts.app.domain.UserGroupEnum;
import com.ts.app.ext.api.FaceRecognitionService;
import com.ts.app.repository.AttendanceRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.FileUploadHelper;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.AttendanceDTO;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.EmployeeDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.FaceRecognitionRequest;
import com.ts.app.web.rest.dto.FaceRecognitionResponse;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;

/**
 * Service class for managing users.
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

    public AttendanceDTO saveCheckOutAttendance(AttendanceDTO attnDto){
        Attendance attn = mapperUtil.toEntity(attnDto, Attendance.class);
        Attendance dbAttn = attendanceRepository.findOne(attn.getId());
        Calendar now = Calendar.getInstance();
        log.debug("check In Time from db"+dbAttn.getCheckInTime());
        log.debug("attendance id"+dbAttn.getId());
        log.debug("latitude out"+attn.getLatitudeOut());
        log.debug("longitude out"+attn.getLongitudeOut());
        dbAttn.setCheckOutTime(new java.sql.Timestamp(now.getTimeInMillis()));
        if(StringUtils.isEmpty(attn.getCheckOutImage())){
            log.debug("check in image not available");
        }else{
            log.debug("check in image available");
            dbAttn.setCheckOutImage("data:image/jpeg;base64,"+attn.getCheckOutImage());
        }
        dbAttn.setLatitudeOut(attn.getLatitudeOut());
        dbAttn.setLongitudeOut(attn.getLongitudeOut());
        dbAttn = attendanceRepository.save(dbAttn);
        attnDto = mapperUtil.toModel(dbAttn, AttendanceDTO.class);

        return attnDto;
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
		if(result == null || CollectionUtils.isEmpty(result.getTransactions())) {
		    log.debug("no transactions" + attnDto.getEmployeeEmpId());
			Employee emp = employeeRepository.findByEmpId(attnDto.getEmployeeEmpId());
			Site site = siteRepository.findOne(attnDto.getSiteId());
			attn.setSite(site);
			attn.setEmployee(emp);
			attn.setLatitudeIn(attnDto.getLatitudeIn());
			attn.setLongitudeIn(attnDto.getLongitudeIn());
			log.debug("attendance employee details"+attn.getEmployee().getId());
			Calendar now = Calendar.getInstance();
			attn.setCheckInTime(new java.sql.Timestamp(now.getTimeInMillis()));
//			attn.setDate(attn.getCheckInTime());
            if(StringUtils.isEmpty(attn.getCheckInImage())){
                log.debug("check in image not available");
            }else{
                log.debug("check in image available");
                attn.setCheckInImage("data:image/jpeg;base64,"+attn.getCheckInImage());
            }
			attn = attendanceRepository.save(attn);
			log.debug("Attendance marked: {}", attn);
			attnDto = mapperUtil.toModel(attn, AttendanceDTO.class);
		}else {
            List<AttendanceDTO> attns =  result.getTransactions();
            if(CollectionUtils.isNotEmpty(attns)) {
                attnDto = attns.get(0);
            }
            log.debug("Attendance already marked: {}", attnDto);

		}
		return attnDto;
	}

    @Transactional
    public AttendanceDTO uploadFile(AttendanceDTO attendanceDto) {


        log.debug("EmployeeService.uploadFile - action - "+attendanceDto.getAction());
        log.debug("Employee list from check in out images"+attendanceDto.getEmployeeEmpId());
        log.debug("Employee list from check in out images"+attendanceDto.getId());
        Attendance attendanceImage = attendanceRepository.findOne(attendanceDto.getId());
//		CheckInOut checkInOut = CollectionUtils.isNotEmpty(checkInOutExistingList) ? checkInOutExistingList.get(0) : null;
        String fileName = fileUploadHelper.uploadAttendanceFile(attendanceDto.getEmployeeEmpId(), attendanceDto.getAction(), attendanceDto.getPhotoOutFile(), System.currentTimeMillis());
        attendanceDto.setAttendanceIn(fileName);
//        Attendance attendanceImage = new Attendance();
        attendanceImage.setAttendanceIn(fileName);
//        attendanceImage.setEmployee(employeeRepository.findOne(attendanceDto.getEmployeeId()));
//        attendanceImage.setId(attendanceDto.getId());

        attendanceImage = attendanceRepository.save(attendanceImage);

        if(attendanceDto.getAction().equals("verify")){
            FaceRecognitionRequest frRequest = new FaceRecognitionRequest();
            frRequest.setEmployeeId(attendanceImage.getEmployee().getId());
            frRequest.setEmployeeFullName(attendanceImage.getEmployee().getFullName());
            String imageUrl = fileUploadHelper.readAttendanceImage(attendanceImage.getId(),attendanceImage.getEmployee().getEmpId(),attendanceImage.getAttendanceIn());
            frRequest.setImageUrl(imageUrl);
            FaceRecognitionResponse frResponse = faceRecognitionService.verify(frRequest);
            attendanceDto.setAction(frResponse.getStatusMessage());
            return attendanceDto;
        }else{
            FaceRecognitionRequest frRequest = new FaceRecognitionRequest();
            frRequest.setEmployeeId(attendanceImage.getEmployee().getId());
            frRequest.setEmployeeFullName(attendanceImage.getEmployee().getFullName());
            String imageUrl = fileUploadHelper.readAttendanceImage(attendanceImage.getId(),attendanceImage.getEmployee().getEmpId(),attendanceImage.getAttendanceIn());
            frRequest.setImageUrl(imageUrl);
            FaceRecognitionResponse frResponse = faceRecognitionService.detect(frRequest);
            if(frResponse.getStatus().equals("success")){
                FaceRecognitionResponse frEnrollResponse = faceRecognitionService.enroll(frRequest);
                attendanceDto.setAction(frEnrollResponse.getStatusMessage());
            }else {
                attendanceDto.setAction(frResponse.getStatusMessage());
            }
            return attendanceDto;

        }



    }

    public String enrollUser(EmployeeDTO employee, String imageData){
        FaceRecognitionRequest frRequest = new FaceRecognitionRequest();
        frRequest.setEmployeeId(employee.getId());
        frRequest.setEmployeeFullName(employee.getFullName());
        frRequest.setImageUrl(imageData);
        FaceRecognitionResponse frResponse = faceRecognitionService.detect(frRequest);
        if(frResponse.getStatus().equals("success")){
            FaceRecognitionResponse frEnrollResponse = faceRecognitionService.enroll(frRequest);
            String message = "Success";
            return message;
        }else {
            String message = "failure";
            return message;

        }
    }

	public List<AttendanceDTO> findAll() {
		List<Attendance> entities = attendanceRepository.findAll();
		return mapperUtil.toModelList(entities, AttendanceDTO.class);
	}

    public List<AttendanceDTO> findByEmpId(SearchCriteria searchCriteria) {
        log.debug("search Criteria",searchCriteria);
        List<Attendance> transactions = null;
        if(searchCriteria != null) {

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
            searchCriteria.setCheckInDateTimeFrom(startCal.getTime());
            searchCriteria.setCheckInDateTimeTo(endCal.getTime());
            Long employeeId = searchCriteria.getEmployeeId();
            java.sql.Date startDate = new java.sql.Date(searchCriteria.getCheckInDateTimeFrom().getTime());
            java.sql.Date toDate = new java.sql.Date(searchCriteria.getCheckInDateTimeTo().getTime());
            transactions = attendanceRepository.findByEmployeeIdAndSiteId(employeeId,startDate,toDate);
        }
        return mapperUtil.toModelList(transactions, AttendanceDTO.class);
    }

    public String getAttendanceImage(long id, String empId) {
        String attendanceBase64 = null;
	    Attendance attendance = attendanceRepository.findOne(id);
        log.debug("Attendance Image service"+attendance.getId()+" "+attendance.getAttendanceIn());
        attendanceBase64=fileUploadHelper.readAttendanceImage(attendance.getId(),empId,attendance.getAttendanceIn());

        return attendanceBase64;

    }

	public AttendanceDTO findOne(Long attnId) {
		Attendance entity = attendanceRepository.findOne(attnId);
		return mapperUtil.toModel(entity, AttendanceDTO.class);
	}

    public SearchResult<AttendanceDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
    	log.debug("search Criteria"+searchCriteria.getSiteId());
        SearchResult<AttendanceDTO> result = new SearchResult<AttendanceDTO>();
        if(searchCriteria != null) {
            Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
            Page<Attendance> page = null;
            List<AttendanceDTO> transactions = null;
            Calendar startCal = Calendar.getInstance();
            startCal.setTime(searchCriteria.getCheckInDateTimeFrom());
    		startCal.set(Calendar.HOUR_OF_DAY, 0);
    		startCal.set(Calendar.MINUTE, 0);
    		startCal.set(Calendar.SECOND, 0);
    		Calendar endCal = Calendar.getInstance();
    		endCal.setTime(searchCriteria.getCheckInDateTimeTo());
    		endCal.set(Calendar.HOUR_OF_DAY, 23);
    		endCal.set(Calendar.MINUTE, 59);
    		endCal.set(Calendar.SECOND, 0);

    		searchCriteria.setCheckInDateTimeFrom(startCal.getTime());
    		searchCriteria.setCheckInDateTimeTo(endCal.getTime());
            if(!searchCriteria.isFindAll()) {
            	java.sql.Date startDate = new java.sql.Date(searchCriteria.getCheckInDateTimeFrom().getTime());
            	java.sql.Date toDate = new java.sql.Date(searchCriteria.getCheckInDateTimeTo().getTime());
                if(searchCriteria.getSiteId() != 0 && StringUtils.isEmpty(searchCriteria.getEmployeeEmpId())) {
                    page = attendanceRepository.findBySiteIdAndCheckInTime(searchCriteria.getSiteId(), startDate, toDate, pageRequest);
                }else if(searchCriteria.getSiteId()==0 ){
                    if (StringUtils.isEmpty(searchCriteria.getEmployeeEmpId())) {
                        log.debug("no side id and employee id- "+startDate+" - "+toDate);
                        page = attendanceRepository.findByDateRange(startDate, toDate, pageRequest);

                    }else{
                        log.debug("find by  employee id - "+searchCriteria.getEmployeeEmpId());
                        page = attendanceRepository.findByEmpIdAndCheckInTime(searchCriteria.getEmployeeEmpId(),startDate, toDate,pageRequest);
                    }
                }else {
                	page = attendanceRepository.findBySiteIdEmpIdAndDate(searchCriteria.getSiteId(),searchCriteria.getEmployeeEmpId(), startDate, toDate, pageRequest);
                }


            }else {
            	java.sql.Date startDate = new java.sql.Date(searchCriteria.getCheckInDateTimeFrom().getTime());
            	java.sql.Date toDate = new java.sql.Date(searchCriteria.getCheckInDateTimeTo().getTime());
            	long userId = searchCriteria.getUserId();
            	if(userId > 0) {
            		User user = userRepository.findOne(userId);
            		Hibernate.initialize(user.getUserGroup());
            		UserGroup userGroup = user.getUserGroup();
            		if(userGroup != null) {
            			if(userGroup.getName().equalsIgnoreCase(UserGroupEnum.ADMIN.toValue())){
                    		page = attendanceRepository.findByCheckInTime(startDate, toDate, pageRequest);
            			}else {
            				Employee emp = user.getEmployee();
            				List<Site> sites = emp.getSites();
            				if(CollectionUtils.isNotEmpty(sites)) {
            					List<Long> siteIds = new ArrayList<Long>();
            					for(Site site : sites) {
            						siteIds.add(site.getId());
            					}
            					attendanceRepository.findByMultipleSitesAndCheckInTime(siteIds, startDate, toDate, pageRequest);
            				}
            			}
            		}
            	}
            }
            if(page != null) {
                transactions = mapperUtil.toModelList(page.getContent(), AttendanceDTO.class);
                if(CollectionUtils.isNotEmpty(transactions)) {
                    buildSearchResult(searchCriteria, page, transactions,result);
                }
            }
        }
        return result;
    }

    private void buildSearchResult(SearchCriteria searchCriteria, Page<Attendance> page, List<AttendanceDTO> transactions, SearchResult<AttendanceDTO> result) {
        if(page != null) {
            result.setTotalPages(page.getTotalPages());
        }
        result.setCurrPage(page.getNumber() + 1);
        result.setTotalCount(page.getTotalElements());
        result.setStartInd((result.getCurrPage() - 1) * 10 + 1);
        result.setEndInd((result.getTotalCount() > 10  ? (result.getCurrPage()) * 10 : result.getTotalCount()));

        result.setTransactions(transactions);
        return;
    }

    public List<AttendanceDTO> findBySite(Long siteId){
        List<Attendance> entities = attendanceRepository.findBySite(siteId);
        if(entities !=null){
            log.debug("Attendances in attendance service");

            return mapperUtil.toModelList(entities, AttendanceDTO.class);
        }else{
            log.debug("Empty attendances in attendance service");
            return mapperUtil.toModelList(entities, AttendanceDTO.class);
        }
    }

	public ExportResult export(List<AttendanceDTO> transactions, String empId) {
		return exportUtil.writeToCsvFile(transactions, empId, null);
	}

	public ExportResult getExportStatus(String empId,String fileId) {
		ExportResult er = new ExportResult();
		fileId += ".csv";
		if(!StringUtils.isEmpty(fileId)) {
			String status = exportUtil.getExportStatus(fileId);
			er.setFile(fileId);
			er.setEmpId(empId);
			er.setStatus(status);
		}
		return er;
	}

	public byte[] getExportFile(String empId, String fileName) {
		return exportUtil.readExportFile(empId, fileName);
	}

}
