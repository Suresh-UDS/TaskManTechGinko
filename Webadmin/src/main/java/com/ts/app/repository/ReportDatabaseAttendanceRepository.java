package com.ts.app.repository;

import com.ts.app.domain.Attendance;
import com.ts.app.domain.AttendanceStatusReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportDatabaseAttendanceRepository extends JpaRepository<Attendance, Long> {

    @Query("select new com.ts.app.domain.AttendanceStatusReport(at.createdDate, at.checkInTime, at.checkOutTime, at.site.id, e.id, e.isLeft, " +
        "e.isReliever, s.project.id, s.region, s.branch) from Attendance as at join at.employee as e join at.site as s where e.id = at.employee.id and s.id = at.site.id")
    List<AttendanceStatusReport> findAllAttendance();
}
