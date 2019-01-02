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
import com.ts.app.domain.EmployeeAttendanceReport;

public interface AttendanceRepository extends JpaRepository<Attendance, Long>,JpaSpecificationExecutor<Attendance> {

	Page<Attendance> findByEmployeeId(Long employeeId,Pageable pageRequest);

	Page<Attendance> findBySiteId(Long siteId,Pageable pageRequest);

    /*@Query("SELECT a from Attendance a where a.checkInTime between :startDate and :endDate order by a.checkInTime desc")
	Page<Attendance> findByCheckInTime(@Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);*/

    @Query("SELECT a from Attendance a where a.employee.id = :empId and a.checkInTime between :startDate and :endDate and a.checkOutTime is null order by a.checkInTime desc")
    List<Attendance> findCurrentCheckIn(@Param("empId") long empId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT a from Attendance a where a.checkInTime between :startDate and :endDate")
    Page<Attendance> findByCheckInTime(@Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

	/*@Query("SELECT a from Attendance a where a.site.project.id = :projectId or a.site.id = :siteId and a.checkInTime between :startDate and :endDate order by a.checkInTime desc")
	Page<Attendance> findBySiteIdAndCheckInTime(@Param("projectId") Long projectId,@Param("siteId") Long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);
    */

    @Query("SELECT a from Attendance a where a.site.id = :siteId and a.checkInTime between :startDate and :endDate")
    Page<Attendance> findBySiteIdAndCheckInTime(@Param("siteId") Long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT a from Attendance a where a.site.project.id = :projectId or a.site.id = :siteId and a.checkInTime between :startDate and :endDate")
    Page<Attendance> findBySiteIdAndCheckInTime(@Param("projectId") Long projectId,@Param("siteId") Long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);


    /*@Query("SELECT a from Attendance a where a.site.id in (:siteIds) and a.checkInTime between :startDate and :endDate order by a.checkInTime desc")
	Page<Attendance> findByMultipleSitesAndCheckInTime(@Param("siteIds") List<Long> siteIds, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);*/

    @Query("SELECT a from Attendance a where a.site.id in (:siteIds) and a.checkInTime between :startDate and :endDate")
    Page<Attendance> findByMultipleSitesAndCheckInTime(@Param("siteIds") List<Long> siteIds, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);


	/*@Query("SELECT a from Attendance a where a.site.project.id = :projectId or a.site.id = :siteId and a.employee.empId = :empId and a.checkInTime between :startDate and :endDate order by a.checkInTime desc")
	Page<Attendance> findBySiteIdEmpIdAndDate(@Param("projectId") Long projectId,@Param("siteId") Long siteId, @Param("empId") String empId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);*/

    @Query("SELECT a from Attendance a where (a.site.project.id = :projectId or a.site.id = :siteId) and a.employee.empId = :empId and a.checkInTime between :startDate and :endDate")
    Page<Attendance> findBySiteIdEmpIdAndDate(@Param("projectId") Long projectId,@Param("siteId") Long siteId, @Param("empId") String empId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT a from Attendance a where (a.site.project.id = :projectId or a.site.id = :siteId) and a.employee.empId = :empId and a.notCheckedOut=false and a.checkInTime between :startDate and :endDate")
    Page<Attendance> findBySiteIdEmpIdAndDateAndNotCheckedOut(@Param("projectId") Long projectId,@Param("siteId") Long siteId, @Param("empId") String empId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

    @Query("SELECT a from Attendance a where a.site.project.id = :projectId and a.checkInTime between :startDate and :endDate")
    Page<Attendance> findByProjectIdAndDate(@Param("projectId") Long projectId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

	/*@Query("SELECT a from Attendance a where a.site.project.id = :projectId or a.site.id = :siteId and a.employee.name like '%' || :name || '%' and a.checkInTime between :startDate and :endDate order by a.checkInTime desc")

	Page<Attendance> findBySiteIdEmpNameAndDate(@Param("projectId") Long projectId, @Param("siteId") Long siteId, @Param("name") String name, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);
    */
    @Query("SELECT a from Attendance a where a.site.project.id = :projectId or a.site.id = :siteId and a.employee.name like '%' || :name || '%' and a.checkInTime between :startDate and :endDate")
    Page<Attendance> findBySiteIdEmpNameAndDate(@Param("projectId") Long projectId, @Param("siteId") Long siteId, @Param("name") String name, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);



    @Query("SELECT a from Attendance a where a.site.project.id = :projectId or a.site.id = :siteId and a.employee.empId = :empId and a.checkOutTime is null order by a.checkInTime desc")
    List<Attendance> findBySiteIdEmpId(@Param("projectId") Long projectId, @Param("siteId") Long siteId, @Param("empId") String empId);

	/*@Query("SELECT a from Attendance a where a.site.project.id = :projectId or a.site.id = :siteId and a.employee.empId = :empId order by a.checkInTime desc")
    Page<Attendance> findBySiteIdEmpId(@Param("projectId") Long projectId, @Param("siteId") Long siteId, @Param("empId") String empId,  Pageable pageRequest);*/

    @Query("SELECT a from Attendance a where a.site.project.id = :projectId or a.site.id = :siteId and a.employee.empId = :empId")
    Page<Attendance> findBySiteIdEmpId(@Param("projectId") Long projectId, @Param("siteId") Long siteId, @Param("empId") String empId,  Pageable pageRequest);

    @Query("SELECT a from Attendance a where a.checkInTime between :startDate and :endDate order by a.checkInTime desc")
    Page<Attendance> findByDateRange(@Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

    /*@Query("SELECT a from Attendance a where a.employee.id IN (:empIds) and a.checkInTime between :startDate and :endDate order by a.checkInTime desc")
    Page<Attendance> findByEmpIdsAndDateRange(@Param("empIds") List<Long> empIds, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);*/

    @Query("SELECT a from Attendance a where a.employee.id IN (:empIds) and a.checkInTime between :startDate and :endDate")
    Page<Attendance> findByEmpIdsAndDateRange(@Param("empIds") List<Long> empIds, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);


    /*@Query("SELECT a from Attendance a where  a.employee.empId = :empId and a.checkInTime between :startDate and :endDate order by a.checkInTime desc")
    Page<Attendance> findByEmpIdAndCheckInTime( @Param("empId") String empId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);*/

    @Query("SELECT a from Attendance a where  a.employee.empId = :empId and a.checkInTime between :startDate and :endDate")
    Page<Attendance> findByEmpIdAndCheckInTime( @Param("empId") String empId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageRequest);

    /*@Query("SELECT a from Attendance a where  a.employee.empId = :empId  order by a.checkInTime desc")
    Page<Attendance> findByEmpId(@Param("empId") String empId, Pageable pageRequest);*/

    @Query("SELECT a from Attendance a where  a.employee.empId = :empId")
    Page<Attendance> findByEmpId(@Param("empId") String empId, Pageable pageRequest);

    @Query("SELECT a from Attendance a where a.employee.id = :employeeId and a.checkInTime between :startDate and :endDate order by a.checkInTime desc")
    List<Attendance> findByEmployeeIdAndSiteId(@Param("employeeId") Long empId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT a from Attendance a where a.checkInTime between :startDate and :endDate order by a.checkInTime desc")
    List<Attendance> findByCheckInDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT a from Attendance a where a.checkInTime < :endDate and a.checkOutTime is null and a.notCheckedOut = FALSE order by a.checkInTime desc")
    List<Attendance> findByCheckInDateAndNotCheckout(@Param("endDate") Date endDate);

    @Query("SELECT a from Attendance a where a.site.id = :siteId order by a.checkInTime desc")
    List<Attendance> findBySite(@Param("siteId") Long siteId);

    @Query("SELECT count(a) from Attendance a where a.checkInTime between :startDate and :endDate order by a.checkInTime desc")
	long findCountByCheckInTime(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT count(a) from Attendance a where a.site.id IN (:siteIds) and  a.checkInTime between :startDate and :endDate order by a.checkInTime desc")
	long findCountByCheckInTime(@Param("siteIds") List<Long> siteIds, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT count(a) from Attendance a where a.site.id = :siteId and a.checkInTime between :startDate and :endDate order by a.checkInTime desc")
	long findCountBySiteAndCheckInTime(@Param("siteId") Long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT count(distinct a.employee.id) from Attendance a where a.site.id = :siteId and a.checkInTime between :startDate and :endDate and a.shiftStartTime = :startTime and a.shiftEndTime = :endTime order by a.checkInTime desc")
	long findCountBySiteAndShiftInTime(@Param("siteId") Long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate, @Param("startTime") String startTime, @Param("endTime") String endTime);

    @Query("SELECT new com.ts.app.domain.EmployeeAttendanceReport(e.id,e.empId, e.name, e.lastName, e.designation, a.site.name, a.site.project.name, a.checkInTime, a.checkOutTime, a.shiftStartTime, a.shiftEndTime, a.continuedAttendance.id, a.late,a.remarks) from Attendance a join a.employee e where a.employee.id = e.id and a.site.id = :siteId and a.checkInTime between :startDate and :endDate order by a.checkInTime desc")
    List<EmployeeAttendanceReport> findBySiteId(@Param("siteId") Long siteId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT at FROM Attendance at WHERE at.checkOutImage is not null")
	Page<Attendance> findByImage(Pageable pageRequest);

}
