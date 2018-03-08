package com.ts.app.repository;

import com.ts.app.domain.CheckInOut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.List;

public interface CheckInOutRepository extends PagingAndSortingRepository<CheckInOut, Long> {

	CheckInOut findByEmployeeId(long empSurrogateId);

	Page<CheckInOut> findByEmployeeId(long empId, Pageable pageRequest);

	@Query("select c from CheckInOut c where c.employee.id= :empId order by c.checkOutDateTime desc" )
	List<CheckInOut> findByEmployeeIdOrderByCheckInDateTime(@Param("empId") long empId);

	CheckInOut findByEmployeeEmpIdAndCheckInDateTime(long empSurrogateId, ZonedDateTime checkInDateTime);

	@Query("select c from CheckInOut c where c.job.plannedStartTime between :checkInDateFrom and :checkInDateTo order by c.checkOutDateTime asc")
	Page<CheckInOut> findByCheckInDateTimeRange(@Param("checkInDateFrom") Timestamp checkInDateTimeFrom, @Param("checkInDateTo") Timestamp checkInDateTimeTo, Pageable pageRequest);

	@Query("select c from CheckInOut c where c.job.plannedStartTime between :checkInDateFrom and :checkInDateTo and c.employee.empId = :empId and c.project.id = :projectId and c.site.id =:siteId order by c.checkOutDateTime asc")
	Page<CheckInOut> getCheckInOutUsingAll(@Param("projectId") long projectId, @Param("siteId") long siteId, @Param("empId") String empId, @Param("checkInDateFrom") Timestamp checkInDateFrom, @Param("checkInDateTo") Timestamp checkInDateTo, Pageable pageRequest);

	@Query("select c from CheckInOut c where c.job.plannedStartTime between :checkInDateFrom and :checkInDateTo and c.employee.empId = :empId order by c.checkOutDateTime asc")
	Page<CheckInOut> getCheckInOutUsingDateAndEmpId(@Param("empId") String empId, @Param("checkInDateFrom") Timestamp checkInDateFrom, @Param("checkInDateTo") Timestamp checkInDateTo, Pageable pageRequest);

	@Query("select c from CheckInOut c where c.job.plannedStartTime between :checkInDateFrom and :checkInDateTo and c.employee.empId = :empId and c.project.id = :projectId order by c.checkOutDateTime asc")
	Page<CheckInOut> getCheckInOutUsingDateEmpIdProjectId(@Param("empId") String empId, @Param("projectId") long projectId, @Param("checkInDateFrom") Timestamp checkInDateFrom, @Param("checkInDateTo") Timestamp checkInDateTo, Pageable pageRequest);

	@Query("select c from CheckInOut c where c.job.plannedStartTime between :checkInDateFrom and :checkInDateTo and c.employee.empId = :empId and c.site.id = :siteId order by c.checkOutDateTime asc")
	Page<CheckInOut> getCheckInOutUsingDateEmpIdSiteId(@Param("empId") String empId, @Param("siteId") long siteId, @Param("checkInDateFrom") Timestamp checkInDateFrom, @Param("checkInDateTo") Timestamp checkInDateTo, Pageable pageRequest);

	@Query("select c from CheckInOut c where c.job.plannedStartTime between :checkInDateFrom and :checkInDateTo and c.site.id = :siteId order by c.checkOutDateTime asc")
	Page<CheckInOut> getCheckInOutUsingDateSiteId(@Param("siteId") long siteId, @Param("checkInDateFrom") Timestamp checkInDateFrom, @Param("checkInDateTo") Timestamp checkInDateTo, Pageable pageRequest);

	@Query("select c from CheckInOut c where c.job.plannedStartTime between :checkInDateFrom and :checkInDateTo and c.project.id = :projectId order by c.checkOutDateTime asc")
	Page<CheckInOut> getCheckInOutUsingDateProjectId(@Param("projectId") long projectId, @Param("checkInDateFrom") Timestamp checkInDateFrom, @Param("checkInDateTo") Timestamp checkInDateTo, Pageable pageRequest);

	//queries to get all records

	@Query("select c from CheckInOut c where c.job.plannedStartTime between :checkInDateFrom and :checkInDateTo order by c.checkOutDateTime asc")
	List<CheckInOut> findByCheckInDateTimeRange(@Param("checkInDateFrom") Timestamp checkInDateTimeFrom, @Param("checkInDateTo") Timestamp checkInDateTimeTo);

	@Query("select c from CheckInOut c where c.job.plannedStartTime between :checkInDateFrom and :checkInDateTo and c.employee.empId = :empId and c.project.id = :projectId and c.site.id =:siteId order by c.checkOutDateTime asc")
	List<CheckInOut> getCheckInOutUsingAll(@Param("projectId") long projectId, @Param("siteId") long siteId, @Param("empId") String empId, @Param("checkInDateFrom") Timestamp checkInDateFrom, @Param("checkInDateTo") Timestamp checkInDateTo);

	@Query("select c from CheckInOut c where c.job.plannedStartTime between :checkInDateFrom and :checkInDateTo and c.employee.empId = :empId order by c.checkOutDateTime asc")
	List<CheckInOut> getCheckInOutUsingDateAndEmpId(@Param("empId") String empId, @Param("checkInDateFrom") Timestamp checkInDateFrom, @Param("checkInDateTo") Timestamp checkInDateTo);

	@Query("select c from CheckInOut c where c.job.plannedStartTime between :checkInDateFrom and :checkInDateTo and c.employee.empId = :empId and c.project.id = :projectId order by c.checkOutDateTime asc")
	List<CheckInOut> getCheckInOutUsingDateEmpIdProjectId(@Param("empId") String empId, @Param("projectId") long projectId, @Param("checkInDateFrom") Timestamp checkInDateFrom, @Param("checkInDateTo") Timestamp checkInDateTo);

	@Query("select c from CheckInOut c where c.job.plannedStartTime between :checkInDateFrom and :checkInDateTo and c.employee.empId = :empId and c.site.id = :siteId order by c.checkOutDateTime asc")
	List<CheckInOut> getCheckInOutUsingDateEmpIdSiteId(@Param("empId") String empId, @Param("siteId") long siteId, @Param("checkInDateFrom") Timestamp checkInDateFrom, @Param("checkInDateTo") Timestamp checkInDateTo);

	@Query("select c from CheckInOut c where c.job.plannedStartTime between :checkInDateFrom and :checkInDateTo and c.site.id = :siteId order by c.checkOutDateTime asc")
	List<CheckInOut> getCheckInOutUsingDateSiteId(@Param("siteId") long siteId, @Param("checkInDateFrom") Timestamp checkInDateFrom, @Param("checkInDateTo") Timestamp checkInDateTo);

	@Query("select c from CheckInOut c where c.job.plannedStartTime between :checkInDateFrom and :checkInDateTo and c.project.id = :projectId order by c.checkOutDateTime asc")
	List<CheckInOut> getCheckInOutUsingDateProjectId(@Param("projectId") long projectId, @Param("checkInDateFrom") Timestamp checkInDateFrom, @Param("checkInDateTo") Timestamp checkInDateTo);

    @Query("select c from CheckInOut c where c.job.id = :jobId order by c.checkOutDateTime asc")
    List<CheckInOut> getCheckInOutByJobId(@Param("jobId") long jobId);

}
