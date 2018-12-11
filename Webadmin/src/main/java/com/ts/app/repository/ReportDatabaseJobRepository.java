package com.ts.app.repository;

import com.ts.app.domain.Job;
import com.ts.app.domain.JobStatusReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.method.P;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface ReportDatabaseJobRepository extends JpaRepository<Job, Long> {

    @Query("select new com.ts.app.domain.JobStatusReport(j.id, cast(j.plannedStartTime as date), j.status, j.type, j.site.id, s.project.id, s.region, s.branch, count(j.id) as statusCount) \n" +
        " from Job j join j.site  s where s.id = j.site.id group by j.id, cast(j.plannedStartTime as date), j.status, j.type, j.site.id")
    List<JobStatusReport> findAllJobStatusCountByDate();

    @Query("select new com.ts.app.domain.JobStatusReport(j.id, cast(j.plannedStartTime as date), j.status, j.type, j.site.id, s.project.id, s.region, s.branch, count(j.id) as statusCount) \n" +
        " from Job j join j.site  s where s.id = j.site.id and j.lastModifiedDate >= :lastModifiedDate group by j.id, cast(j.plannedStartTime as date), j.status, j.type, j.site.id")
    List<JobStatusReport> findAllJobsByDate(@Param("lastModifiedDate") ZonedDateTime lastModifiedDate);
}
