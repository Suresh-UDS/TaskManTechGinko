package com.ts.app.repository;

import com.ts.app.domain.Attendance;
import com.ts.app.domain.AttendanceStatusReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface ReportDatabaseAttendanceRepository extends JpaRepository<Attendance, Long> {

    @Query("select new com.ts.app.domain.AttendanceStatusReport(at.id, at.createdDate, at.checkInTime, at.checkOutTime, at.site.id, e.id, e.isLeft, " +
        "e.isReliever, s.project.id, s.region, s.branch, count(at.id) as statusCount) " +
        "from Attendance as at join at.employee as e join at.site as s where e.id = at.employee.id and s.id = at.site.id group by at.id, at.createdDate, " +
        "at.checkInTime, at.checkOutTime, at.site.id, at.employee.id")
    List<AttendanceStatusReport> findAllAttendance();

    @Query("select new com.ts.app.domain.AttendanceStatusReport(at.id, at.createdDate, at.checkInTime, at.checkOutTime, at.site.id, e.id, e.isLeft, " +
        "e.isReliever, s.project.id, s.region, s.branch, count(at.id) as statusCount) " +
        "from Attendance as at join at.employee as e join at.site as s where e.id = at.employee.id and s.id = at.site.id " +
        "and at.lastModifiedDate > :lastModifiedDate group by at.id, at.createdDate, " +
        "at.checkInTime, at.checkOutTime, at.site.id, at.employee.id")
    List<AttendanceStatusReport> findAllAttendanceByDate(@Param("lastModifiedDate") ZonedDateTime lastModifiedDate);

}
