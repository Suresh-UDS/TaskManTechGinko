package com.ts.app.repository;

import com.ts.app.domain.Job;
import com.ts.app.domain.JobStatusReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportDatabaseRepository extends JpaRepository<Job, Long> {

    @Query("select new com.ts.app.domain.JobStatusReport(cast(j.plannedStartTime as date), j.status, j.type, j.site.id, s.project.id, s.region, s.branch, count(j.id) as statusCount) \n" +
        " from Job j join j.site  s where s.id = j.site.id group by cast(j.plannedStartTime as date), j.status, j.type, j.site.id")
    List<JobStatusReport> findAllJobStatusCountByDate();
}
