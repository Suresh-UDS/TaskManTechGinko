package com.ts.app.repository;

import com.ts.app.domain.SchedulerConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface SchedulerConfigRepository extends JpaRepository<SchedulerConfig, Long>{


	@Query("select s from SchedulerConfig s, Job j where s.job.id = j.id and s.schedule='DAILY' and (s.lastRun is null or s.lastRun < :date) and (s.startDate is NULL or s.startDate <= :date) and s.scheduleEndDate >= :date and j.active='Y' and s.active='Y' ")
	public List<SchedulerConfig> getDailyTask(@Param("date") Date currentDate);

	@Query("select s from SchedulerConfig s, Job j where s.job.id = j.id and s.schedule='WEEKLY' and (s.lastRun is null or s.lastRun < :date) and (s.startDate is NULL or s.startDate <= :date) and s.scheduleEndDate >= :date and j.active='Y' and s.active='Y' ")
	public List<SchedulerConfig> getWeeklyTask(@Param("date") Date currentDate);

	@Query("select s from SchedulerConfig s where s.job.id = :jobId")
	public List<SchedulerConfig> findJobSchedule(@Param("jobId") long jobId);

}
