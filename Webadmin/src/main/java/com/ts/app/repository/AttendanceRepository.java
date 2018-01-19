package com.ts.app.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long>,JpaSpecificationExecutor<Attendance> {

	Page<Attendance> findByEmployeeId(Long employeeId,Pageable pageRequest);

	Page<Attendance> findBySiteId(Long siteId,Pageable pageRequest);

    @Query("SELECT a from Attendance a where a.checkInTime between :startDate and :endDate ")
	Page<Attendance> findByCheckInTime(@Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

	@Query("SELECT a from Attendance a where a.site.id = :siteId and a.checkInTime between :startDate and :endDate ")
	Page<Attendance> findBySiteIdAndCheckInTime(@Param("siteId") Long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT a from Attendance a where a.site.id = :siteId and a.employee.empId = :empId and a.checkInTime between :startDate and :endDate ")
	Page<Attendance> findBySiteIdEmpIdAndDate(@Param("siteId") Long siteId, @Param("empId") String empId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT a from Attendance a where a.checkInTime between :startDate and :endDate ")
    Page<Attendance> findByDateRange(@Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT a from Attendance a where  a.employee.empId = :empId and a.checkInTime between :startDate and :endDate ")
    Page<Attendance> findByEmpIdAndCheckInTime( @Param("empId") String empId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT a from Attendance a where  a.employee.empId = :empId  ")
    Page<Attendance> findByEmpId(@Param("empId") String empId, Pageable pageRequest);

    @Query("SELECT a from Attendance a where a.employee.id = :employeeId and a.checkInTime between :startDate and :endDate ")
    List<Attendance> findByEmployeeIdAndSiteId(@Param("employeeId") Long empId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT a from Attendance a where a.checkInTime between :startDate and :endDate ")
    List<Attendance> findByCheckInDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT a from Attendance a where a.site.id = :siteId")
    List<Attendance> findBySite(@Param("siteId") Long siteId);

    @Query("SELECT count(a) from Attendance a where a.checkInTime between :startDate and :endDate ")
	long findCountByCheckInTime(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT count(a) from Attendance a where a.site.id = :siteId and a.checkInTime between :startDate and :endDate ")
	long findCountBySiteAndCheckInTime(@Param("siteId") Long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);
}
