package com.ts.app.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Attendance;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeAttendanceReport;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.Shift;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import com.ts.app.domain.UserRole;
import com.ts.app.domain.UserRoleEnum;
import com.ts.app.ext.api.FaceRecognitionService;
import com.ts.app.repository.AttendanceRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
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

	@Inject
	private ReportUtil reportUtil;

    @Inject
    private Environment env;

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

        findShiftTiming(false, attnDto, dbAttn);

        dbAttn = attendanceRepository.save(dbAttn);
        attnDto = mapperUtil.toModel(dbAttn, AttendanceDTO.class);

        return attnDto;
    }

    private void findShiftTiming(boolean isCheckIn, AttendanceDTO attnDto,Attendance dbAttn) {
    		long siteId = attnDto.getSiteId();
        Site site = siteRepository.findOne(siteId);
        List<Shift> shifts = site.getShifts();
        if(log.isDebugEnabled()) {
        		log.debug("shift timings - " + shifts);
        }
        //load the lead time and grace time properties
        int shiftStartLeadTime = Integer.valueOf(env.getProperty("attendance.shiftStartLeadTime"));
        int shiftEndLeadTime = Integer.valueOf(env.getProperty("attendance.shiftEndLeadTime"));
        int shiftStartGraceTime = Integer.valueOf(env.getProperty("attendance.shiftStartGraceTime"));
        int shiftEndGraceTime = Integer.valueOf(env.getProperty("attendance.shiftEndGraceTime"));
        if(CollectionUtils.isNotEmpty(shifts)) {
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
				}

				Calendar checkInCal = Calendar.getInstance();
				checkInCal.setTimeInMillis(dbAttn.getCheckInTime().getTime());

				Calendar checkOutCal = null;
				if(dbAttn.getCheckOutTime() != null) {
					checkOutCal = Calendar.getInstance();
					checkOutCal.setTimeInMillis(dbAttn.getCheckOutTime().getTime());
				}

				if(checkInCal.before(endCalLeadTime)) { // 12:30 PM checkin time < 1 PM (2PM shift ends) - 1 hr lead time
					if((startCal.before(checkInCal))  // 7 AM shift starts < 12:30 PM check in
							|| startCal.equals(checkInCal)) {
						dbAttn.setShiftStartTime(startTime);  //7 AM considered as shift starts
						dbAttn.setShiftEndTime(endTime);
						break;
					}
				}

				if(checkInCal.after(startCalLeadTime)) { // 1:30 PM checkin time > 1 PM (2 PM shift start) - 1 hr lead time
					if((startCal.after(checkInCal))  // 2:00 PM shift starts > 1:30 PM check in
							|| startCal.equals(checkInCal)) {
						dbAttn.setShiftStartTime(startTime);  //2 PM considered as shift starts
						dbAttn.setShiftEndTime(endTime);
						break;
					}else if(startCal.before(checkInCal)) {
						dbAttn.setShiftStartTime(startTime);
						dbAttn.setShiftEndTime(endTime);
					}
				}

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
            //mark the shift timings
            findShiftTiming(true,attnDto, attn);

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

		log.debug("EmployeeService.uploadFile - action - " + attendanceDto.getAction());
		log.debug("Employee list from check in out images" + attendanceDto.getEmployeeEmpId());
		log.debug("Employee list from check in out images" + attendanceDto.getId());
		Attendance attendanceImage = attendanceRepository.findOne(attendanceDto.getId());
		// CheckInOut checkInOut = CollectionUtils.isNotEmpty(checkInOutExistingList) ?
		// checkInOutExistingList.get(0) : null;
		String fileName = fileUploadHelper.uploadAttendanceFile(attendanceDto.getEmployeeEmpId(), attendanceDto.getAction(), attendanceDto.getPhotoOutFile(),
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
			FaceRecognitionResponse frResponse = faceRecognitionService.verify(frRequest);
			attendanceDto.setAction(frResponse.getStatusMessage());
			return attendanceDto;
		} else {
			FaceRecognitionRequest frRequest = new FaceRecognitionRequest();
			frRequest.setEmployeeId(attendanceImage.getEmployee().getId());
			frRequest.setEmployeeFullName(attendanceImage.getEmployee().getFullName());
			String imageUrl = fileUploadHelper.readAttendanceImage(attendanceImage.getId(), attendanceImage.getEmployee().getEmpId(), attendanceImage.getAttendanceIn());
			frRequest.setImageUrl(imageUrl);
			FaceRecognitionResponse frResponse = faceRecognitionService.detect(frRequest);
			if (frResponse.getStatus().equals("success")) {
				FaceRecognitionResponse frEnrollResponse = faceRecognitionService.enroll(frRequest);
				attendanceDto.setAction(frEnrollResponse.getStatusMessage());
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
		FaceRecognitionResponse frResponse = faceRecognitionService.detect(frRequest);
		if (frResponse.getStatus().equals("success")) {
			FaceRecognitionResponse frEnrollResponse = faceRecognitionService.enroll(frRequest);
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
				attnDto.setSiteId(attn.getSite().getId());
				attnDto.setSiteName(attn.getSite().getName());
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
				List<Long> subEmpIds = new ArrayList<Long>();
				if (employee != null) {
					Hibernate.initialize(employee.getSubOrdinates());
					findAllSubordinates(employee, subEmpIds);
					log.debug("List of subordinate ids -" + subEmpIds);
					searchCriteria.setSubordinateIds(subEmpIds);
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
		List<EmployeeAttendanceReport> attendanceReportList = new ArrayList<EmployeeAttendanceReport>();
		if (CollectionUtils.isNotEmpty(transactions)) {
			for (AttendanceDTO attn : transactions) {
				EmployeeAttendanceReport reportData = new EmployeeAttendanceReport(attn.getEmployeeId(), attn.getEmployeeEmpId(), attn.getEmployeeFullName(), null,
						attn.getSiteName(), null, attn.getCheckInTime(), attn.getCheckOutTime(), attn.getShiftStartTime(), attn.getShiftEndTime());
				attendanceReportList.add(reportData);
			}
		}
		return reportUtil.generateAttendanceReports(attendanceReportList, null, null, criteria);
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

}
