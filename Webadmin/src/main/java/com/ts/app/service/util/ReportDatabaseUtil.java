package com.ts.app.service.util;

import com.ts.app.config.ReportDatabaseConfiguration;
import com.ts.app.domain.*;
import com.ts.app.domain.Measurements.JobStatusMeasurement;
import com.ts.app.domain.Measurements.TicketStatusMeasurement;
import com.ts.app.repository.ReportDatabaseJobRepository;
import com.ts.app.repository.ReportDatabaseTicketRepository;
import com.ts.app.service.ReportDatabaseService;
import org.influxdb.InfluxDB;
import org.influxdb.dto.BoundParameterQuery;
import org.influxdb.dto.Point;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Component
public class ReportDatabaseUtil {

    final Logger log = LoggerFactory.getLogger(ReportDatabaseUtil.class);

    @Value("${influxdb.dbname}")
    private String dbName;

    @Inject
    private ReportDatabaseConfiguration reportDatabaseConfiguration;

    @Inject
    private ReportDatabaseJobRepository reportDatabaseJobRepository;

    @Inject
    private ReportDatabaseTicketRepository reportDatabaseTicketRepository;

    @Inject
    private ReportDatabaseService reportDatabaseService;

    private InfluxDB connectDatabase() {
        // Connect to database assumed on local host with default credentials.
        return reportDatabaseConfiguration.initializeInduxDbConnection();
    }

    public List<JobStatusReport> getPreComputeJobData() {
        // Pre-compute a data from database
        List<JobStatusReport> jobStatusReportList = reportDatabaseJobRepository.findAllJobStatusCountByDate();
        log.debug("List of job status list " +jobStatusReportList.size());
        return jobStatusReportList;
    }

    public List<TicketStatusReport> getPreComputeTicketData() {
        List<TicketStatusReport> ticketStatusReportList = reportDatabaseTicketRepository.findAllTicketStatus();
        log.debug("List of Ticket status list" +ticketStatusReportList.size());
        return ticketStatusReportList;
    }

    public List<TicketAgeStatus> getPreComputeTicketAge() {
        List<TicketAgeStatus> ticketAgeStatusList = reportDatabaseTicketRepository.findByTicketAge();
        log.debug("List of Ticket Age size" +ticketAgeStatusList);
        return ticketAgeStatusList;
    }

    public void addPointsToJob() throws Exception {
        InfluxDB influxDB = connectDatabase();
        List<JobStatusReport> reportLists = this.getPreComputeJobData();
        influxDB.setRetentionPolicy("defaultPolicy");
        influxDB.enableBatch(100, 200, TimeUnit.MILLISECONDS);
        for(int i=0; i<100; i++) {
            Calendar cal = Calendar.getInstance();
            cal.setTime(reportLists.get(i).getJobCreatedDate());
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);
            log.debug("calendar time milliseconds" +cal.getTimeInMillis());
            log.debug("system time milliseconds" + System.currentTimeMillis());
            Point jobPoint = Point.measurement("jobReportStatus")
                .time(System.currentTimeMillis(), TimeUnit.MILLISECONDS)
                .addField("date", (float) cal.getTimeInMillis())
                .tag("date", String.valueOf(cal.getTimeInMillis()))
                .addField("status", reportLists.get(i).getJobStatus().toString())
                .tag("status",reportLists.get(i).getJobStatus().toString())
                .addField("type", (reportLists.get(i).getJobType() != null ? reportLists.get(i).getJobType().toString() : "CARPENTRY"))
                .tag("type", (reportLists.get(i).getJobType() != null ? reportLists.get(i).getJobType().toString() : "CARPENTRY"))
                .addField("projectId", (float) reportLists.get(i).getProjectId())
                .addField("siteId", (float) reportLists.get(i).getSiteId())
                .tag("siteId", String.valueOf(reportLists.get(i).getSiteId()))
                .addField("region", reportLists.get(i).getRegion() != null ? reportLists.get(i).getRegion() : "north-region")
                .tag("region", reportLists.get(i).getRegion() != null ? reportLists.get(i).getRegion() : "north-region")
                .addField("branch", reportLists.get(i).getBranch() != null ? reportLists.get(i).getBranch() : "andhrapradesh")
                .tag("branch", reportLists.get(i).getBranch() != null ? reportLists.get(i).getBranch() : "andhrapradesh")
                .addField("statusCount", reportLists.get(i).getStatusCount())
                .build();

            influxDB.write(dbName, "defaultPolicy", jobPoint);
            Thread.sleep(2);
        }
        Thread.sleep(10);
        influxDB.disableBatch();
        influxDB.close();
    }

    public void addTicketPoints() throws Exception {
        InfluxDB influxDB = connectDatabase();
        List<TicketStatusReport> ticketStatusReportLists = this.getPreComputeTicketData();
        log.debug("Size of ticket status report " +ticketStatusReportLists.size());
        influxDB.setRetentionPolicy("defaultPolicy");
        influxDB.enableBatch(100, 200, TimeUnit.MILLISECONDS);
        for(TicketStatusReport ticketReportList : ticketStatusReportLists) {
            Calendar cal = Calendar.getInstance();
            cal.setTime(ticketReportList.getFormattedDate());
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);

            Point ticketPoint = Point.measurement("ticketReportStatus")
                .time(System.currentTimeMillis(), TimeUnit.MILLISECONDS)
                .addField("date", cal.getTimeInMillis())
                .tag("date", String.valueOf(cal.getTimeInMillis()))
                .addField("siteId", ticketReportList.getSiteId())
                .addField("projectId", ticketReportList.getProjectId())
                .addField("status", ticketReportList.getStatus())
                .tag("status", ticketReportList.getStatus())
                .addField("category", ticketReportList.getCategory() != null ? ticketReportList.getCategory() : "")
                .tag("category", ticketReportList.getCategory() != null ? ticketReportList.getCategory() : "ELECTRICAL")
                .addField("assignedOn", ticketReportList.getAssignedOn() != null ? ticketReportList.getAssignedOn().toString() : "")
                .tag("assignedOn", ticketReportList.getAssignedOn() != null ? ticketReportList.getAssignedOn().toString() : "")
                .addField("closedOn", ticketReportList.getClosedOn() != null ? ticketReportList.getClosedOn().toString() : "")
                .tag("closedOn", ticketReportList.getClosedOn() != null ? ticketReportList.getClosedOn().toString() : "")
                .addField("statusCount", ticketReportList.getStatusCount())
                .addField("region", ticketReportList.getRegion() != null ? ticketReportList.getRegion() : "")
                .tag("region", ticketReportList.getRegion() != null ? ticketReportList.getRegion() : "")
                .addField("branch", ticketReportList.getBranch() != null ? ticketReportList.getBranch() : "")
                .tag("branch", ticketReportList.getBranch() != null ? ticketReportList.getBranch() : "")
                .build();

            influxDB.write(dbName, "defaultPolicy", ticketPoint);
            Thread.sleep(2);
        }

        Thread.sleep(10);
        influxDB.disableBatch();
        influxDB.close();
    }


    public List<JobStatusMeasurement> getJobReportCategoryPoints() {
        InfluxDB connection = connectDatabase();
        String query = "select count(type) as categoryCount from jobReportStatus group by type";
        List<JobStatusMeasurement> jobCategoryReportPoints = reportDatabaseService.getJobPoints(connection, query, dbName);
        return jobCategoryReportPoints;
    }

    public List<ChartModelEntity> getJobReportStatusPoints() {
        InfluxDB connection = connectDatabase();
        String query = "select count(status) as statusCount from jobReportStatus group by type, status";
        List<JobStatusMeasurement> jobStatusReportPoints = reportDatabaseService.getJobPoints(connection, query, dbName);
        Map<String, Map<String, Integer>> statusPoints = new HashMap<>();
        Map<String, Integer> statusCounts = null;
        List<ChartModelEntity> chartModelEntities = new ArrayList<>();

        if(jobStatusReportPoints.size() > 0) {
            for(JobStatusMeasurement jobStatusPoint : jobStatusReportPoints) {
                String category = jobStatusPoint.getType();

                if(statusPoints.containsKey(category)) {
                    statusCounts = statusPoints.get(category);
                }else {
                    statusCounts = new HashMap<String, Integer>();
                }

                int AssignedCnt = statusCounts.containsKey("Assigned") ? statusCounts.get("Assigned") : 0; // 0 // 0
                int OverdueCnt = statusCounts.containsKey("Overdue") ? statusCounts.get("Overdue") : 0;  // 4  // 0
                int CompletedCnt = statusCounts.containsKey("Completed") ? statusCounts.get("Completed") : 0; // 0  // 0

                AssignedCnt +=  jobStatusPoint.getStatus().equalsIgnoreCase("ASSIGNED") ? jobStatusPoint.getStatusCount() : 0; // 3
                OverdueCnt += jobStatusPoint.getStatus().equalsIgnoreCase("OVERDUE") ? jobStatusPoint.getStatusCount() : 0;    // 4 //
                CompletedCnt += jobStatusPoint.getStatus().equalsIgnoreCase("COMPLETED") ? jobStatusPoint.getStatusCount() : 0; // 1

                statusCounts.put("Assigned", AssignedCnt); // 0 // 3
                statusCounts.put("Overdue", OverdueCnt);  // 4 // 1
                statusCounts.put("Completed", CompletedCnt); // 0 // 1

                statusPoints.put(category, statusCounts);

            }
            log.debug("job status points map count" +statusPoints.toString());

            if(!statusPoints.isEmpty()) {
                Set<Map.Entry<String,Map<String,Integer>>> entrySet = statusPoints.entrySet();
                List<Map.Entry<String, Map<String,Integer>>> list = new ArrayList<Map.Entry<String, Map<String,Integer>>>(entrySet);
                ChartModelEntity chartModelEntity = new ChartModelEntity();
                List<String> categoryList = new ArrayList<>();
                List<Status> categoryStatusCnts = new ArrayList<>();
                Status assignstatus = new Status();
                Status overDuestatus = new Status();
                Status complstatus = new Status();
                List<Integer> totalAssignCnts = new ArrayList<>();
                List<Integer> totalOverDueCnts = new ArrayList<>();
                List<Integer> totalComplCnts = new ArrayList<>();
                for(Map.Entry<String, Map<String, Integer>> ent : list) {
                    String category = ent.getKey();
                    categoryList.add(category);
                    Map<String, Integer> categoryWiseCount = statusPoints.get(category);
                    if(categoryWiseCount.containsKey("Assigned")) {
                        int assignCnt = categoryWiseCount.get("Assigned");
                        assignstatus.setName("Assigned");
                        totalAssignCnts.add(assignCnt);
                        assignstatus.setData(totalAssignCnts);
                    }
                    if(categoryWiseCount.containsKey("Overdue")) {
                        int overCnt = categoryWiseCount.get("Overdue");
                        overDuestatus.setName("Overdue");
                        totalOverDueCnts.add(overCnt);
                        overDuestatus.setData(totalOverDueCnts);
                    }
                    if(categoryWiseCount.containsKey("Completed")) {
                        int compCnt = categoryWiseCount.get("Completed");
                        complstatus.setName("Completed");
                        totalComplCnts.add(compCnt);
                        complstatus.setData(totalComplCnts);
                    }

                }

                chartModelEntity.setX(categoryList);
                categoryStatusCnts.add(assignstatus);
                categoryStatusCnts.add(overDuestatus);
                categoryStatusCnts.add(complstatus);
                chartModelEntity.setStatus(categoryStatusCnts);
                chartModelEntities.add(chartModelEntity);

                log.debug("Formatted JSON for jobs" +chartModelEntities.toString());
            }

        }

        return chartModelEntities;
    }

    public List<ChartModelEntity> getTicketReportStatusPoints() {
        InfluxDB connection = connectDatabase();
        String query = "select count(status) as statusCount from ticketReportStatus group by category,status";
        List<TicketStatusMeasurement> ticketCategoryReportPoints = reportDatabaseService.getTicketPoints(connection, query, dbName);
        Map<String, Map<String, Integer>> statusPoints = new HashMap<>();
        Map<String, Integer> statusCounts = null;
        List<ChartModelEntity> chartModelEntities = new ArrayList<>();

        if(ticketCategoryReportPoints.size() > 0) {
            for(TicketStatusMeasurement ticketStatusPoint : ticketCategoryReportPoints) {
                String category = ticketStatusPoint.getCategory();

                if(statusPoints.containsKey(category)) {
                    statusCounts = statusPoints.get(category);
                }else {
                    statusCounts = new HashMap<String, Integer>();
                }

                int AssignCnt = statusCounts.containsKey("Assigned") ? statusCounts.get("Assigned") : 0;
                int OpenCnt = statusCounts.containsKey("Open") ? statusCounts.get("Open") : 0;
                int ClosedCnt = statusCounts.containsKey("Closed") ? statusCounts.get("Closed") : 0;

                AssignCnt +=  ticketStatusPoint.getStatus().equalsIgnoreCase("Open") ? ticketStatusPoint.getStatusCount() : 0;
                OpenCnt += ticketStatusPoint.getStatus().equalsIgnoreCase("Assigned") ? ticketStatusPoint.getStatusCount() : 0;
                ClosedCnt += ticketStatusPoint.getStatus().equalsIgnoreCase("Closed") ? ticketStatusPoint.getStatusCount() : 0;

                statusCounts.put("Assigned", AssignCnt);
                statusCounts.put("Open", OpenCnt);
                statusCounts.put("Closed", ClosedCnt);

                statusPoints.put(category, statusCounts);

            }
            log.debug("Ticket status points map count" +statusPoints.toString());

            if(!statusPoints.isEmpty()) {
                Set<Map.Entry<String,Map<String,Integer>>> entrySet = statusPoints.entrySet();
                List<Map.Entry<String, Map<String,Integer>>> list = new ArrayList<Map.Entry<String, Map<String,Integer>>>(entrySet);
                ChartModelEntity chartModelEntity = new ChartModelEntity();
                List<String> categoryList = new ArrayList<>();
                List<Status> categoryStatusCnts = new ArrayList<>();
                Status assignstatus = new Status();
                Status openstatus = new Status();
                Status closedstatus = new Status();
                List<Integer> totalAssignCnts = new ArrayList<>();
                List<Integer> totalOverDueCnts = new ArrayList<>();
                List<Integer> totalComplCnts = new ArrayList<>();
                for(Map.Entry<String, Map<String, Integer>> ent : list) {
                    String category = ent.getKey();
                    categoryList.add(category);
                    Map<String, Integer> categoryWiseCount = statusPoints.get(category);
                    if(categoryWiseCount.containsKey("Assigned")) {
                        int assignCnt = categoryWiseCount.get("Assigned");
                        assignstatus.setName("Assigned");
                        totalAssignCnts.add(assignCnt);
                        assignstatus.setData(totalAssignCnts);
                    }
                    if(categoryWiseCount.containsKey("Open")) {
                        int overCnt = categoryWiseCount.get("Open");
                        openstatus.setName("Open");
                        totalOverDueCnts.add(overCnt);
                        openstatus.setData(totalOverDueCnts);
                    }
                    if(categoryWiseCount.containsKey("Closed")) {
                        int compCnt = categoryWiseCount.get("Closed");
                        closedstatus.setName("Closed");
                        totalComplCnts.add(compCnt);
                        closedstatus.setData(totalComplCnts);
                    }

                }

                chartModelEntity.setX(categoryList);
                categoryStatusCnts.add(assignstatus);
                categoryStatusCnts.add(openstatus);
                categoryStatusCnts.add(closedstatus);
                chartModelEntity.setStatus(categoryStatusCnts);
                chartModelEntities.add(chartModelEntity);

                log.debug("Formatted JSON for ticket" +chartModelEntities.toString());
            }

        }

        return chartModelEntities;
    }


    public List<JobStatusMeasurement> getTodayJobsCount() {
        InfluxDB conn = connectDatabase();
        Query query = BoundParameterQuery.QueryBuilder.newQuery("SELECT sum(statusCount) as statusCount FROM jobReportStatus WHERE date >= $fromDate " +
            "AND date <= $toDate group by date, status")
            .forDatabase(dbName)
            .bind("fromDate", 1531679342592L)
            .bind("toDate", 1531852226560L)
            .create();
        QueryResult results = conn.query(query);
        List<JobStatusMeasurement> jobTodayCounts = reportDatabaseService.getJobExistingPoints(conn, query);
        return jobTodayCounts;
    }

    public List<JobReportCounts> getTotalJobsCount() {
        InfluxDB conn = connectDatabase();
        Query query = BoundParameterQuery.QueryBuilder.newQuery("SELECT sum(statusCount) as statusCount, count(date) as totalCount FROM jobReportStatus " +
            "WHERE projectId = $projectId AND region = $region AND branch = $branch AND siteId = $siteId group by status")
            .forDatabase(dbName)
            .bind("fromDate", 1531765800090L)
            .bind("toDate", 1531852200099L)
            .bind("projectId", 2)
            .bind("region", "south-region")
            .bind("branch", "chennai")
            .bind("siteId", 2)
            .create();
        QueryResult result = conn.query(query);
        List<JobStatusMeasurement> jobTotalResults = reportDatabaseService.getJobExistingPoints(conn, query);
        List<JobReportCounts> jobReportCounts = new ArrayList<>();
        JobReportCounts jobReportCount = new JobReportCounts();
        if(jobTotalResults.size() > 0) {
            int totalCounts = 0;
            for(JobStatusMeasurement jobTotalResult : jobTotalResults) {
                if(jobTotalResult.getStatus().equalsIgnoreCase("ASSIGNED")) {
                    jobReportCount.setAssignedCounts(jobTotalResult.getStatusCount());
                    totalCounts += jobTotalResult.getTotalCount();
                }
                if(jobTotalResult.getStatus().equalsIgnoreCase("OVERDUE")) {
                    jobReportCount.setOverdueCounts(jobTotalResult.getStatusCount());
                    totalCounts += jobTotalResult.getTotalCount();
                }
                if(jobTotalResult.getStatus().equalsIgnoreCase("COMPLETED")) {
                    jobReportCount.setCompletedCounts(jobTotalResult.getStatusCount());
                    totalCounts += jobTotalResult.getTotalCount();
                }
            }
            jobReportCount.setTotalCounts(totalCounts);
            jobReportCounts.add(jobReportCount);
        }
        return jobReportCounts;
    }













}
