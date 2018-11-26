package com.ts.app.service.util;

import com.ts.app.config.ReportDatabaseConfiguration;
import com.ts.app.domain.*;
import com.ts.app.domain.Measurements.JobStatusMeasurement;
import com.ts.app.repository.ReportDatabaseJobRepository;
import com.ts.app.repository.ReportDatabaseTicketRepository;
import com.ts.app.service.ReportDatabaseSerivce;
import org.influxdb.InfluxDB;
import org.influxdb.dto.Point;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
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
    private ReportDatabaseSerivce reportDatabaseSerivce;

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

    public void addPointsToJob() throws Exception {
        InfluxDB influxDB = connectDatabase();
        List<JobStatusReport> reportLists = this.getPreComputeJobData();
        influxDB.setRetentionPolicy("defaultPolicy");
        influxDB.enableBatch(100, 200, TimeUnit.MILLISECONDS);
        for(int i=0; i<100; i++) {
            Point point = Point.measurement("jobReportStatus")
                .time(System.currentTimeMillis(), TimeUnit.MILLISECONDS)
                .addField("date",reportLists.get(i).getJobCreatedDate().toString())
                .tag("date",reportLists.get(i).getJobCreatedDate().toString())
                .addField("status", reportLists.get(i).getJobStatus().toString())
                .tag("status",reportLists.get(i).getJobStatus().toString())
                .addField("type", (reportLists.get(i).getJobType() != null ? reportLists.get(i).getJobType().toString() : "CARPENTRY"))
                .tag("type", (reportLists.get(i).getJobType() != null ? reportLists.get(i).getJobType().toString() : "CARPENTRY"))
                .addField("projectId", reportLists.get(i).getProjectId())
                .addField("siteId", reportLists.get(i).getSiteId())
                .addField("region", reportLists.get(i).getRegion() != null ? reportLists.get(i).getRegion() : "north-region")
                .tag("region", reportLists.get(i).getRegion() != null ? reportLists.get(i).getRegion() : "north-region")
                .addField("branch", reportLists.get(i).getBranch() != null ? reportLists.get(i).getBranch() : "andhrapradesh")
                .tag("branch", reportLists.get(i).getBranch() != null ? reportLists.get(i).getBranch() : "andhrapradesh")
                .addField("statusCount", reportLists.get(i).getStatusCount())
                .build();

            influxDB.write(dbName, "defaultPolicy", point);
            Thread.sleep(2);
        }
        Thread.sleep(10);
        influxDB.disableBatch();
        influxDB.close();
    }


    public List<JobStatusMeasurement> getJobReportCategoryPoints() {
        InfluxDB connection = connectDatabase();
        String query = "select count(type) as categoryCount from jobReportStatus group by type";
        List<JobStatusMeasurement> jobCategoryReportPoints = reportDatabaseSerivce.getPoints(connection, query, dbName);
        return jobCategoryReportPoints;
    }

    public List<ChartModelEntity> getJobReportStatusPoints() {
        InfluxDB connection = connectDatabase();
        String query = "select count(status) as statusCount from jobReportStatus group by type, status";
        List<JobStatusMeasurement> jobStatusReportPoints = reportDatabaseSerivce.getPoints(connection, query, dbName);
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

                log.debug("Formatted JSON for client side" +chartModelEntities.toString());
            }

        }

        return chartModelEntities;
    }



}
