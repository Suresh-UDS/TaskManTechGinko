package com.ts.app.service.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ts.app.config.ReportDatabaseConfiguration;
import com.ts.app.domain.*;
import com.ts.app.domain.Measurements.AttendanceStatusMeasurement;
import com.ts.app.domain.Measurements.JobStatusMeasurement;
import com.ts.app.domain.Measurements.QuotationStatusMeasurement;
import com.ts.app.domain.Measurements.TicketStatusMeasurement;
import com.ts.app.domain.util.StringUtil;
import com.ts.app.repository.ReportDatabaseAttendanceRepository;
import com.ts.app.repository.ReportDatabaseJobRepository;
import com.ts.app.repository.ReportDatabaseTicketRepository;
import com.ts.app.service.RateCardService;
import com.ts.app.service.ReportDatabaseService;
import com.ts.app.web.rest.dto.QuotationDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.influxdb.BatchOptions;
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
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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
    private ReportDatabaseAttendanceRepository reportDatabaseAttendanceRepository;

    @Inject
    private ReportDatabaseService reportDatabaseService;

    @Inject
    private RateCardService rateCardService;

    private InfluxDB connectDatabase() {
        // Connect to database assumed on local host with default credentials.
        return reportDatabaseConfiguration.initializeInfluxDbConnection();
    }

    /** Pre-compute a data from database
     **/
    public List<JobStatusReport> getPreComputeJobData() {
        List<JobStatusReport> jobStatusReportList = reportDatabaseJobRepository.findAllJobStatusCountByDate();
        log.debug("List of job status list " +jobStatusReportList.size());
        return jobStatusReportList;
    }

    public List<TicketStatusReport> getPreComputeTicketData() {
        List<TicketStatusReport> ticketStatusReportList = reportDatabaseTicketRepository.findAllTicketStatus();
        log.debug("List of Ticket status list" +ticketStatusReportList.size());
        return ticketStatusReportList;
    }

    public List<AttendanceStatusReport> getPreComputeAttendanceData() {
        List<AttendanceStatusReport> attendanceStatusReports = reportDatabaseAttendanceRepository.findAllAttendance();
        log.debug("List of Ticket status list" +attendanceStatusReports.size());
        return attendanceStatusReports;
    }

    /**
     * Get last 5 minutes modified results
    **/
    public ZonedDateTime getLast5MinZoneTime() {
        Date formatDate = new Date(System.currentTimeMillis() - 5*60*1000);
        ZoneId zone = ZoneId.of("Asia/Kolkata");
        ZonedDateTime zonedDateTime = ZonedDateTime.ofInstant(formatDate.toInstant(), zone);
        return zonedDateTime;
    }

    public List<JobStatusReport> getLastModifiedJobData() {
        ZonedDateTime lastModifiedDate = this.getLast5MinZoneTime();
        List<JobStatusReport> jobStatusReportList = reportDatabaseJobRepository.findAllJobsByDate(lastModifiedDate);
        log.debug("List of last modified jobs list " +jobStatusReportList.size());
        return jobStatusReportList;
    }

    public List<TicketStatusReport> getLastModifiedTicketData() {
        ZonedDateTime lastModifiedDate = this.getLast5MinZoneTime();
        List<TicketStatusReport> ticketReportList = reportDatabaseTicketRepository.findAllTicketsByDate(lastModifiedDate);
        log.debug("List of last modified tickets list " +ticketReportList.size());
        return ticketReportList;
    }

    public List<AttendanceStatusReport> getLastModifiedAttendance() {
        ZonedDateTime lastModifiedDate = this.getLast5MinZoneTime();
        List<AttendanceStatusReport> attendanceReportList = reportDatabaseAttendanceRepository.findAllAttendanceByDate(lastModifiedDate);
        log.debug("List of last modified attendance list " +attendanceReportList.size());
        return attendanceReportList;
    }
    /* End Get last 5 minutes modified results */

    /** Add Points to InfluxDB for PreCompute results from transactions **/
    /* Job points */
    public void addPointsToJob() throws Exception {
        InfluxDB influxDB = connectDatabase();
        List<JobStatusReport> reportLists = this.getPreComputeJobData();
        influxDB.setRetentionPolicy("one_year_policy");
        influxDB.enableBatch(BatchOptions.DEFAULTS.actions(2000).flushDuration(100));
        int i = 0;
        if(reportLists.size() > 0) {
            for(JobStatusReport reportList : reportLists) {
                Calendar cal = Calendar.getInstance();
                cal.setTime(reportList.getJobCreatedDate());
                cal.set(Calendar.HOUR_OF_DAY, 0);
                cal.set(Calendar.MINUTE, 0);
                cal.set(Calendar.SECOND, 0);
                cal.set(Calendar.MILLISECOND, 0);
                log.debug("calendar time milliseconds" +cal.getTimeInMillis());
                log.debug("system time milliseconds" + System.currentTimeMillis());
                Point jobPoint = Point.measurement("JobReport")
                    .time(cal.getTimeInMillis() + i, TimeUnit.MILLISECONDS)
                    .addField("id", reportList.getJobId())
                    .tag("id", String.valueOf(reportList.getJobId()))
                    .addField("date", cal.getTimeInMillis())
                    .tag("date", String.valueOf(cal.getTimeInMillis()))
                    .addField("status", reportList.getJobStatus().toString())
                    .tag("status",reportList.getJobStatus().toString())
                    .addField("type", (reportList.getJobType() != null ? reportList.getJobType().toString() : "CARPENTRY"))
                    .tag("type", (reportList.getJobType() != null ? reportList.getJobType().toString() : "CARPENTRY"))
                    .addField("projectId", (float) reportList.getProjectId())
                    .addField("siteId", (float) reportList.getSiteId())
                    .tag("siteId", String.valueOf(reportList.getSiteId()))
                    .addField("region", reportList.getRegion() != null ? reportList.getRegion() : "north-region")
                    .tag("region", reportList.getRegion() != null ? reportList.getRegion() : "north-region")
                    .addField("branch", reportList.getBranch() != null ? reportList.getBranch() : "andhrapradesh")
                    .tag("branch", reportList.getBranch() != null ? reportList.getBranch() : "andhrapradesh")
                    .addField("statusCount", reportList.getStatusCount())
                    .build();

                influxDB.write(dbName, "one_year_policy", jobPoint);
                Thread.sleep(2);
                i++;
            }
            Thread.sleep(10);
            influxDB.disableBatch();
            influxDB.close();
        }

    }

    /* Ticket points */
    public void addTicketPoints() throws Exception {
        InfluxDB influxDB = connectDatabase();
        List<TicketStatusReport> ticketStatusReportLists = this.getPreComputeTicketData();
        log.debug("Size of ticket status report " +ticketStatusReportLists.size());
        influxDB.setRetentionPolicy("one_year_policy");
        influxDB.enableBatch(BatchOptions.DEFAULTS.actions(2000).flushDuration(100));
        int i = 0;
        for(TicketStatusReport ticketReportList : ticketStatusReportLists) {
            Calendar cal = Calendar.getInstance();
            Calendar assignedOn = Calendar.getInstance();
            Calendar closedOn = Calendar.getInstance();
            cal.setTime(ticketReportList.getFormattedDate());
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);

            if(ticketReportList.getAssignedOn() != null) {
                assignedOn.setTime(ticketReportList.getAssignedOn());
                cal.set(Calendar.HOUR_OF_DAY, 0);
                cal.set(Calendar.MINUTE, 0);
                cal.set(Calendar.SECOND, 0);
                cal.set(Calendar.MILLISECOND, 0);
            }

            if(ticketReportList.getClosedOn() != null) {
                assignedOn.setTime(ticketReportList.getClosedOn());
                cal.set(Calendar.HOUR_OF_DAY, 0);
                cal.set(Calendar.MINUTE, 0);
                cal.set(Calendar.SECOND, 0);
                cal.set(Calendar.MILLISECOND, 0);
            }

            Point ticketPoint = Point.measurement("TicketReport")
                .time(cal.getTimeInMillis() + i, TimeUnit.MILLISECONDS)
                .addField("id", ticketReportList.getTicketId())
                .tag("id", String.valueOf(ticketReportList.getTicketId()))
                .addField("date", cal.getTimeInMillis())
                .tag("date", String.valueOf(cal.getTimeInMillis()))
                .addField("siteId", ticketReportList.getSiteId())
                .addField("projectId", ticketReportList.getProjectId())
                .addField("status", ticketReportList.getStatus())
                .tag("status", ticketReportList.getStatus())
                .addField("category", ticketReportList.getCategory() != null ? ticketReportList.getCategory() : "OTHERS")
                .tag("category", ticketReportList.getCategory() != null ? ticketReportList.getCategory() : "OTHERS")
                .addField("assignedOn", ticketReportList.getAssignedOn() != null ? assignedOn.getTimeInMillis() : 0)
                .tag("assignedOn", ticketReportList.getAssignedOn() != null ? String.valueOf(assignedOn.getTimeInMillis()) : "")
                .addField("closedOn", ticketReportList.getClosedOn() != null ? closedOn.getTimeInMillis() : 0)
                .tag("closedOn", ticketReportList.getClosedOn() != null ? String.valueOf(closedOn.getTimeInMillis()) : "")
                .addField("statusCount", ticketReportList.getStatusCount())
                .addField("region", ticketReportList.getRegion() != null ? ticketReportList.getRegion() : "other-region")
                .tag("region", ticketReportList.getRegion() != null ? ticketReportList.getRegion() : "other-region")
                .addField("branch", ticketReportList.getBranch() != null ? ticketReportList.getBranch() : "andhrapradesh")
                .tag("branch", ticketReportList.getBranch() != null ? ticketReportList.getBranch() : "andhrapradesh")
                .build();

            influxDB.write(dbName, "one_year_policy", ticketPoint);
            Thread.sleep(2);
            i++;
        }
        Thread.sleep(10);
        influxDB.disableBatch();
        influxDB.close();
    }

    /* Attendance Points*/
    public void addAttendancePoints() throws Exception {
        InfluxDB influxDB = connectDatabase();
        List<AttendanceStatusReport> attendanceReportLists = this.getPreComputeAttendanceData();
        influxDB.setRetentionPolicy("one_year_policy");
        influxDB.enableBatch(BatchOptions.DEFAULTS.actions(2000).flushDuration(100));
        int i = 0;
        for(AttendanceStatusReport attendanceReportList : attendanceReportLists) {
            log.debug("Total size" + i);
            Calendar cal = Calendar.getInstance();
            Calendar checkIn = Calendar.getInstance();
            Calendar checkOut = Calendar.getInstance();
            cal.setTime(attendanceReportList.getFormattedDate());
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);
            log.debug("calendar time milliseconds" +cal.getTimeInMillis());
            log.debug("system time milliseconds" + System.currentTimeMillis());

            if(attendanceReportList.getCheckInTime() != null) {
                checkIn.setTime(attendanceReportList.getCheckInTime());
                checkIn.set(Calendar.HOUR_OF_DAY, 0);
                checkIn.set(Calendar.MINUTE, 0);
                checkIn.set(Calendar.SECOND, 0);
                checkIn.set(Calendar.MILLISECOND, 0);
                log.debug("calendar time milliseconds" +checkIn.getTimeInMillis());
            }

            if(attendanceReportList.getCheckOutTime() != null) {
                checkOut.setTime(attendanceReportList.getCheckOutTime());
                checkOut.set(Calendar.HOUR_OF_DAY, 0);
                checkOut.set(Calendar.MINUTE, 0);
                checkOut.set(Calendar.SECOND, 0);
                checkOut.set(Calendar.MILLISECOND, 0);
                log.debug("calendar time milliseconds" +checkOut.getTimeInMillis());
            }

            Point attendancePoint = Point.measurement("AttendanceReport")
                .time(cal.getTimeInMillis() + i, TimeUnit.MILLISECONDS)
                .addField("id", attendanceReportList.getId())
                .tag("id", String.valueOf(attendanceReportList.getId()))
                .addField("date", cal.getTimeInMillis())
                .tag("date", String.valueOf(cal.getTimeInMillis()))
                .addField("checkInTime", attendanceReportList.getCheckInTime() != null ? checkIn.getTimeInMillis() : 0)
                .tag("checkInTime",attendanceReportList.getCheckInTime() != null ? String.valueOf(checkIn.getTimeInMillis()) : "")
                .addField("checkOutTime", attendanceReportList.getCheckOutTime() != null ? checkOut.getTimeInMillis() : 0)
                .tag("checkOutTime", attendanceReportList.getCheckOutTime() != null ? String.valueOf(checkOut.getTimeInMillis()) : "")
                .addField("employeeId", (float) attendanceReportList.getEmployeeId())
                .addField("projectId", (float) attendanceReportList.getProjectId())
                .addField("siteId", (float) attendanceReportList.getSiteId())
                .addField("isLeft", attendanceReportList.isLeft())
                .tag("isLeft", String.valueOf(attendanceReportList.isLeft()))
                .addField("isReliever", attendanceReportList.isReliever())
                .tag("isReliever", String.valueOf(attendanceReportList.isReliever()))
                .addField("region", attendanceReportList.getRegion() != null ? attendanceReportList.getRegion() : "north-region")
                .tag("region", attendanceReportList.getRegion() != null ? attendanceReportList.getRegion() : "north-region")
                .addField("branch", attendanceReportList.getBranch() != null ? attendanceReportList.getBranch() : "andhrapradesh")
                .tag("branch", attendanceReportList.getBranch() != null ? attendanceReportList.getBranch() : "andhrapradesh")
                .addField("statusCount", attendanceReportList.getStatusCount())
                .build();

            influxDB.write(dbName, "one_year_policy", attendancePoint);
            Thread.sleep(2);
            i++;
        }
        Thread.sleep(10);
        influxDB.disableBatch();
        influxDB.close();
    }

    /* Add Quotation Points */
    public void addQuotationPoints() throws Exception {
        InfluxDB influxDB = connectDatabase();
        Object rateCards = rateCardService.getAllQuotations();
        List<QuotationDTO> quotationResults = new ArrayList<QuotationDTO>();
        if (rateCards != null) {
            ObjectMapper mapper = new ObjectMapper();
            mapper.findAndRegisterModules();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(DeserializationFeature.ADJUST_DATES_TO_CONTEXT_TIME_ZONE, false);
            try {
                quotationResults = mapper.readValue((String) rateCards,
                    new TypeReference<List<QuotationDTO>>() {
                    });
            } catch (IOException e) {
                log.error("Error while converting quotation results to objects", e);
            }

            if(CollectionUtils.isNotEmpty(quotationResults)) {
                int i=0;
                for(QuotationDTO quotationResult : quotationResults) {
                    log.debug("Total size" + i);
                    Calendar cal = Calendar.getInstance();
                    if(quotationResult.getCreatedDate() != null) {
                        Date formatDate = Date.from(quotationResult.getCreatedDate().toInstant());
                        cal.setTime(formatDate);
                        cal.set(Calendar.HOUR_OF_DAY, 0);
                        cal.set(Calendar.MINUTE, 0);
                        cal.set(Calendar.SECOND, 0);
                        cal.set(Calendar.MILLISECOND, 0);
                    } else {
                        Date currentDate = new Date();
                        cal.setTime(currentDate);
                        cal.set(Calendar.HOUR_OF_DAY, 0);
                        cal.set(Calendar.MINUTE, 0);
                        cal.set(Calendar.SECOND, 0);
                        cal.set(Calendar.MILLISECOND, 0);
                    }
                    log.debug("calendar time milliseconds" +cal.getTimeInMillis());
                    log.debug("system time milliseconds" + System.currentTimeMillis());

                    Point quotationPoint = Point.measurement("QuotationReport")
                        .time(cal.getTimeInMillis() + i, TimeUnit.MILLISECONDS)
                        .addField("id", quotationResult.getSerialId())
                        .tag("id", String.valueOf(quotationResult.getSerialId()))
                        .addField("date", cal.getTimeInMillis())
                        .tag("date", String.valueOf(cal.getTimeInMillis()))
                        .addField("projectId", (float) quotationResult.getProjectId())
                        .addField("siteId", (float) quotationResult.getSiteId())
                        .addField("status", quotationResult.getStatus()!= null ? quotationResult.getStatus() : "")
                        .tag("status", quotationResult.getStatus())
                        .addField("isApproved", quotationResult.isApproved())
                        .tag("isApproved", String.valueOf(quotationResult.isApproved()))
                        .addField("isArchived", quotationResult.isArchived())
                        .tag("isArchived", String.valueOf(quotationResult.isArchived()))
                        .addField("isDrafted", quotationResult.isDrafted())
                        .tag("isDrafted", String.valueOf(quotationResult.isDrafted()))
                        .addField("isSubmitted", quotationResult.isSubmitted())
                        .tag("isSubmitted", String.valueOf(quotationResult.isSubmitted()))
                        .addField("isRejected", quotationResult.isRejected())
                        .tag("isRejected", String.valueOf(quotationResult.isRejected()))
                        .addField("statusCount", 1)
                        .build();

                    influxDB.write(dbName, "one_year_policy", quotationPoint);
                    Thread.sleep(2);
                    i++;
                }
                Thread.sleep(10);
                influxDB.disableBatch();
                influxDB.close();
            }

        }

    }
    /* End Add Points to InfluxDB for PreCompute results */

    /**
     * Apply counts to charts
    **/
    public List<ChartModelEntity> getJobReportStatusPoints() {
        InfluxDB connection = connectDatabase();
        String query = "select count(status) as statusCount from JobReport group by type, status";
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
        String query = "select count(status) as statusCount from TicketReport group by category,status";
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

//    public List<AttendanceStatusMeasurement> getAttncounts() {
//        InfluxDB influxDB = connectDatabase();
//        String query = "select sum(statusCount) as presentCount, count(distinct(employeeId)) as empCount from AttendanceReport where checkInTime != 0 and time > now() - 30d group by time(1d)";
//        List<AttendanceStatusMeasurement> attnStatusPoints = reportDatabaseService.getAttendancePoints(influxDB, query, dbName);
//        return attnStatusPoints;
//    }

    public List<ChartModelEntity> getAttnTotalCounts() {
        InfluxDB connection = connectDatabase();
        String query = "select sum(statusCount) as presentCount, count(distinct(employeeId)) as empCount from AttendanceReport where " +
            "checkInTime != 0 and time > now() - 30d group by time(1d) fill(0)";
        List<AttendanceStatusMeasurement> attnStatusPoints = reportDatabaseService.getAttendancePoints(connection, query, dbName);
        Map<String, Map<String, Integer>> statusPoints = new HashMap<>();
        Map<String, Integer> statusCounts = null;
        List<ChartModelEntity> chartModelEntities = new ArrayList<>();

        if(attnStatusPoints.size() > 0) {
            for(AttendanceStatusMeasurement attnStatusPoint : attnStatusPoints) {
                Instant instant = attnStatusPoint.getTime();
                Date myDate = Date.from(instant);
                SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
                String category = formatter.format(myDate);
                if(statusPoints.containsKey(category)) {
                    statusCounts = statusPoints.get(category);
                }else {
                    statusCounts = new HashMap<String, Integer>();
                }

                int LeftCnt = statusCounts.containsKey("Left") ? statusCounts.get("Left") : 0;
                int PresentCnt = statusCounts.containsKey("Present") ? statusCounts.get("Present") : 0;
                int AbsentCnt = statusCounts.containsKey("Absent") ? statusCounts.get("Absent") : 0;

                LeftCnt +=  attnStatusPoint.getLeftCount() > 0 ? attnStatusPoint.getLeftCount() : 0;
                PresentCnt += attnStatusPoint.getPresentCount() > 0 ? attnStatusPoint.getPresentCount() : 0;
                AbsentCnt += attnStatusPoint.getAbsentCount() > 0 ? attnStatusPoint.getAbsentCount() : 0;

                statusCounts.put("Left", LeftCnt);
                statusCounts.put("Present", PresentCnt);
                statusCounts.put("Absent", AbsentCnt);

                statusPoints.put(category, statusCounts);

            }
            log.debug("Attn status points map count" +statusPoints.toString());

            if(!statusPoints.isEmpty()) {
                Set<Map.Entry<String,Map<String,Integer>>> entrySet = statusPoints.entrySet();
                List<Map.Entry<String, Map<String,Integer>>> list = new ArrayList<Map.Entry<String, Map<String,Integer>>>(entrySet);
                ChartModelEntity chartModelEntity = new ChartModelEntity();
                List<String> categoryList = new ArrayList<>();
                List<Status> categoryStatusCnts = new ArrayList<>();
                Status leftstatus = new Status();
                Status presentstatus = new Status();
                Status absentstatus = new Status();
                List<Integer> totalLeftCnts = new ArrayList<>();
                List<Integer> totalPresentCnts = new ArrayList<>();
                List<Integer> totalAbsentCnts = new ArrayList<>();
                for(Map.Entry<String, Map<String, Integer>> ent : list) {
                    String category = ent.getKey();
                    categoryList.add(category);
                    Map<String, Integer> categoryWiseCount = statusPoints.get(category);
                    if(categoryWiseCount.containsKey("Left")) {
                        int leftCnt = categoryWiseCount.get("Left");
                        leftstatus.setName("Left");
                        totalLeftCnts.add(leftCnt);
                        leftstatus.setData(totalLeftCnts);
                    }
                    if(categoryWiseCount.containsKey("Present")) {
                        int presentCnt = categoryWiseCount.get("Present");
                        presentstatus.setName("Present");
                        totalPresentCnts.add(presentCnt);
                        presentstatus.setData(totalPresentCnts);
                    }
                    if(categoryWiseCount.containsKey("Absent")) {
                        int absentCnt = categoryWiseCount.get("Absent");
                        absentstatus.setName("Absent");
                        totalAbsentCnts.add(absentCnt);
                        absentstatus.setData(totalAbsentCnts);
                    }

                }

                chartModelEntity.setX(categoryList);
                categoryStatusCnts.add(leftstatus);
                categoryStatusCnts.add(presentstatus);
                categoryStatusCnts.add(absentstatus);
                chartModelEntity.setStatus(categoryStatusCnts);
                chartModelEntities.add(chartModelEntity);

                log.debug("Formatted JSON for Attn" + chartModelEntities.toString());
            }

        }

        return chartModelEntities;
    }


    public List<JobStatusMeasurement> getTodayJobsCount(SearchCriteria searchCriteria) {
        InfluxDB conn = connectDatabase();
        StringBuilder sb = new StringBuilder();
        long fromDate;
        long toDate;
        if(searchCriteria != null) {
            sb.append("SELECT sum(statusCount) as statusCount FROM JobReport WHERE");
            if(searchCriteria.getCheckInDateTimeFrom() != null) {
                Calendar fromCal = Calendar.getInstance();
                fromCal.setTime(searchCriteria.getCheckInDateTimeFrom());
                fromCal.set(Calendar.HOUR_OF_DAY, 0);
                fromCal.set(Calendar.MINUTE, 0);
                fromCal.set(Calendar.SECOND, 0);
                fromCal.set(Calendar.MILLISECOND, 0);
                fromDate = fromCal.getTimeInMillis();
                sb.append(" ");
                sb.append("date >="+fromDate);
            }

            if(searchCriteria.getCheckInDateTimeTo() != null) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                Calendar toCal = Calendar.getInstance();
                toCal.setTime(searchCriteria.getCheckInDateTimeTo());
                toCal.set(Calendar.HOUR_OF_DAY, 0);
                toCal.set(Calendar.MINUTE, 0);
                toCal.set(Calendar.SECOND, 0);
                toCal.set(Calendar.MILLISECOND, 0);
                toDate = toCal.getTimeInMillis();
                sb.append("date <=" +toDate);
                sb.append(" ");
            }

            if(searchCriteria.getProjectId() > 0) {
                sb.append("AND");
                sb.append(" ");
                sb.append("projectId="+searchCriteria.getProjectId());
            }

            if(searchCriteria.getSiteId() > 0) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                sb.append("siteId="+searchCriteria.getSiteId());
            }

            if(searchCriteria.getRegion() != null) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                sb.append("region="+searchCriteria.getRegion());
            }

            if(searchCriteria.getBranch() != null) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                sb.append("branch="+searchCriteria.getBranch());
            }

            sb.append(" group by status");
        }

        String query = sb.toString();
        log.debug("Query string builder" +query);
        List<JobStatusMeasurement> jobTodayCounts = reportDatabaseService.getJobPoints(conn, query, dbName);
        return jobTodayCounts;
    }

    /**
     *  Get Total Counts Status based
     **/
    public List<JobStatusMeasurement> getJobReportCategoryPoints() {
        InfluxDB connection = connectDatabase();
        String query = "select count(type) as categoryCount from JobReport group by type";
        List<JobStatusMeasurement> jobCategoryReportPoints = reportDatabaseService.getJobPoints(connection, query, dbName);
        return jobCategoryReportPoints;
    }

    public List<JobReportCounts> getTotalJobsCount(SearchCriteria searchCriteria) {
        InfluxDB conn = connectDatabase();
        StringBuilder sb = new StringBuilder();
        long fromDate;
        long toDate;
        if(searchCriteria != null) {
            sb.append("SELECT sum(statusCount) as statusCount, count(date) as totalCount FROM JobReport WHERE");
            if(searchCriteria.getCheckInDateTimeFrom() != null) {
                Calendar fromCal = Calendar.getInstance();
                fromCal.setTime(searchCriteria.getCheckInDateTimeFrom());
                fromCal.set(Calendar.HOUR_OF_DAY, 0);
                fromCal.set(Calendar.MINUTE, 0);
                fromCal.set(Calendar.SECOND, 0);
                fromCal.set(Calendar.MILLISECOND, 0);
                fromDate = fromCal.getTimeInMillis();
                sb.append(" ");
                sb.append("date >="+fromDate);
            }

            if(searchCriteria.getCheckInDateTimeTo() != null) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                Calendar toCal = Calendar.getInstance();
                toCal.setTime(searchCriteria.getCheckInDateTimeTo());
                toCal.set(Calendar.HOUR_OF_DAY, 0);
                toCal.set(Calendar.MINUTE, 0);
                toCal.set(Calendar.SECOND, 0);
                toCal.set(Calendar.MILLISECOND, 0);
                toDate = toCal.getTimeInMillis();
                sb.append("date <=" +toDate);
                sb.append(" ");
            }

            if(searchCriteria.getProjectId() > 0) {
                sb.append("AND");
                sb.append(" ");
                sb.append("projectId="+searchCriteria.getProjectId());
            }

            if(searchCriteria.getSiteId() > 0) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                sb.append("siteId="+searchCriteria.getSiteId());
            }

            if(StringUtils.isNotEmpty(searchCriteria.getRegion())) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                sb.append("region='"+searchCriteria.getRegion()+"'");
            }

            if(StringUtils.isNotEmpty(searchCriteria.getBranch())) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                sb.append("branch='"+searchCriteria.getBranch()+"'");
            }

            sb.append(" group by status");
        }

        String query = sb.toString();
        log.debug("Query string builder" +query);

        List<JobStatusMeasurement> jobTotalResults = reportDatabaseService.getJobPoints(conn, query, dbName);
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

    public List<TicketReportCounts> getTotalTicketCount(SearchCriteria searchCriteria) {
        InfluxDB conn = connectDatabase();

        StringBuilder sb = new StringBuilder();
        long fromDate;
        long toDate;
        if(searchCriteria != null) {
            sb.append("SELECT sum(statusCount) as statusCount, count(date) as totalCount FROM TicketReport WHERE");
            if(searchCriteria.getFromDate() != null) {

                Calendar fromCal = Calendar.getInstance();
                fromCal.setTime(searchCriteria.getFromDate());
                fromCal.set(Calendar.HOUR_OF_DAY, 0);
                fromCal.set(Calendar.MINUTE, 0);
                fromCal.set(Calendar.SECOND, 0);
                fromCal.set(Calendar.MILLISECOND, 0);
                fromDate = fromCal.getTimeInMillis();
                sb.append(" ");
                sb.append("date>="+fromDate);
            }

            if(searchCriteria.getToDate() != null) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                Calendar toCal = Calendar.getInstance();
                toCal.setTime(searchCriteria.getToDate());
                toCal.set(Calendar.HOUR_OF_DAY, 0);
                toCal.set(Calendar.MINUTE, 0);
                toCal.set(Calendar.SECOND, 0);
                toCal.set(Calendar.MILLISECOND, 0);
                toDate = toCal.getTimeInMillis();
                sb.append("date<=" +toDate);
                sb.append(" ");
            }

            if(searchCriteria.getProjectId() > 0) {
                sb.append("AND");
                sb.append(" ");
                sb.append("projectId="+searchCriteria.getProjectId());
            }

            if(searchCriteria.getSiteId() > 0) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                sb.append("siteId="+searchCriteria.getSiteId());
            }

            if(StringUtils.isNotEmpty(searchCriteria.getRegion())) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                sb.append("region='"+searchCriteria.getRegion()+"'");
            }

            if(StringUtils.isNotEmpty(searchCriteria.getBranch())) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                sb.append("branch='"+searchCriteria.getBranch()+"'");
            }

            sb.append(" group by status");
        }

        String query = sb.toString();
        log.debug("Query string builder" +query);

        List<TicketStatusMeasurement> ticketTotalResults = reportDatabaseService.getTicketPoints(conn, query, dbName);
        List<TicketReportCounts> ticketReportCounts = new ArrayList<>();
        TicketReportCounts ticketReportCount = new TicketReportCounts();
        if(ticketTotalResults.size() > 0) {
            int totalCounts = 0;
            for(TicketStatusMeasurement ticketTotalResult : ticketTotalResults) {
                if(ticketTotalResult.getStatus().equalsIgnoreCase("ASSIGNED")) {
                    ticketReportCount.setAssignedCounts(ticketTotalResult.getStatusCount());
                    totalCounts += ticketTotalResult.getTotalCount();
                }
                if(ticketTotalResult.getStatus().equalsIgnoreCase("OPEN")) {
                    ticketReportCount.setOpenCounts(ticketTotalResult.getStatusCount());
                    totalCounts += ticketTotalResult.getTotalCount();
                }
                if(ticketTotalResult.getStatus().equalsIgnoreCase("CLOSED")) {
                    ticketReportCount.setClosedCounts(ticketTotalResult.getStatusCount());
                    totalCounts += ticketTotalResult.getTotalCount();
                }
                if(ticketTotalResult.getStatus().equalsIgnoreCase("IN PROGRESS")) {
                    totalCounts += ticketTotalResult.getTotalCount();
                }
            }
            ticketReportCount.setTotalCounts(totalCounts);
            ticketReportCounts.add(ticketReportCount);
        }
        return ticketReportCounts;
    }

    public AttendanceReportCounts getAttendanceTotalCounts(SearchCriteria searchCriteria) {
        InfluxDB influxDB = connectDatabase();
        // Query the data from influxDB
        StringBuilder sb = new StringBuilder();
        long fromDate;
        long toDate;
        if(searchCriteria != null) {
            sb.append("SELECT sum(statusCount) as presentCount, count(distinct(employeeId)) as empCount FROM AttendanceReport WHERE");
            if(searchCriteria.getFromDate() != null) {
                Calendar fromCal = Calendar.getInstance();
                fromCal.setTime(searchCriteria.getFromDate());
                fromCal.set(Calendar.HOUR_OF_DAY, 0);
                fromCal.set(Calendar.MINUTE, 0);
                fromCal.set(Calendar.SECOND, 0);
                fromCal.set(Calendar.MILLISECOND, 0);
                fromDate = fromCal.getTimeInMillis();
                sb.append(" ");
                sb.append("checkInTime>="+fromDate);
            }

            if(searchCriteria.getToDate() != null) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                Calendar toCal = Calendar.getInstance();
                toCal.setTime(searchCriteria.getToDate());
                toCal.set(Calendar.HOUR_OF_DAY, 0);
                toCal.set(Calendar.MINUTE, 0);
                toCal.set(Calendar.SECOND, 0);
                toCal.set(Calendar.MILLISECOND, 0);
                toDate = toCal.getTimeInMillis();
                sb.append("checkInTime<=" +toDate);
                sb.append(" ");
            }

            if(searchCriteria.getProjectId() > 0) {
                sb.append("AND");
                sb.append(" ");
                sb.append("projectId="+searchCriteria.getProjectId());
            }

            if(searchCriteria.getSiteId() > 0) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                sb.append("siteId="+searchCriteria.getSiteId());
            }

            if(StringUtils.isNotEmpty(searchCriteria.getRegion())) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                sb.append("region='"+searchCriteria.getRegion()+"'");
            }

            if(StringUtils.isNotEmpty(searchCriteria.getBranch())) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                sb.append("branch='"+searchCriteria.getBranch()+"'");
            }

            sb.append(" ");
            sb.append("AND");
            sb.append(" ");
            sb.append("isLeft=false");

        }

        String query = sb.toString();
        log.debug("Query string builder" +query);

        AttendanceReportCounts reportCounts = this.getLeftCount(influxDB, sb);

        List<AttendanceStatusMeasurement> attendanceStatusMeasurements = reportDatabaseService.getAttendancePoints(influxDB, query, dbName);

        for(AttendanceStatusMeasurement attendanceMeasurement : attendanceStatusMeasurements) {
            int absentCounts = attendanceMeasurement.getEmpCount() - attendanceMeasurement.getPresentCount();
            reportCounts.setTotalEmployees(attendanceMeasurement.getEmpCount());
            reportCounts.setTotalPresent(attendanceMeasurement.getPresentCount());
            if(absentCounts >= 0) {
                reportCounts.setTotalAbsent(absentCounts);
            } else {
                absentCounts = 0;
                reportCounts.setTotalAbsent(absentCounts);
            }
        }

        return reportCounts;
    }

    public AttendanceReportCounts getLeftCount(InfluxDB influxDB, StringBuilder sb) {
        String query = sb.toString().replace("isLeft=false", "isLeft=true");
        log.debug(query);
        List<AttendanceStatusMeasurement> attendLeftCounts = reportDatabaseService.getAttendancePoints(influxDB, query, dbName);
        AttendanceReportCounts reportCounts = new AttendanceReportCounts();
        if(attendLeftCounts.size() > 0) {
            reportCounts.setTotalLeft(attendLeftCounts.get(0).getLeftCount());
        } else {
            reportCounts.setTotalLeft(0);
        }
        return reportCounts;
    }

    public List<QuotationReportCounts> getQuotationCounts(SearchCriteria searchCriteria) {
        InfluxDB connection = connectDatabase();

        StringBuilder sb = new StringBuilder();
        long fromDate;
        long toDate;
        if(searchCriteria != null) {
            sb.append("SELECT sum(statusCount) as statusCount, count(date) as totalCount FROM QuotationReport WHERE");
            if(searchCriteria.getFromDate() != null) {

                Calendar fromCal = Calendar.getInstance();
                fromCal.setTime(searchCriteria.getFromDate());
                fromCal.set(Calendar.HOUR_OF_DAY, 0);
                fromCal.set(Calendar.MINUTE, 0);
                fromCal.set(Calendar.SECOND, 0);
                fromCal.set(Calendar.MILLISECOND, 0);
                fromDate = fromCal.getTimeInMillis();
                sb.append(" ");
                sb.append("date>="+fromDate);
            }

            if(searchCriteria.getToDate() != null) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                Calendar toCal = Calendar.getInstance();
                toCal.setTime(searchCriteria.getToDate());
                toCal.set(Calendar.HOUR_OF_DAY, 0);
                toCal.set(Calendar.MINUTE, 0);
                toCal.set(Calendar.SECOND, 0);
                toCal.set(Calendar.MILLISECOND, 0);
                toDate = toCal.getTimeInMillis();
                sb.append("date<=" +toDate);
                sb.append(" ");
            }

            if(searchCriteria.getProjectId() > 0) {
                sb.append("AND");
                sb.append(" ");
                sb.append("projectId="+searchCriteria.getProjectId());
            }

            if(searchCriteria.getSiteId() > 0) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                sb.append("siteId="+searchCriteria.getSiteId());
            }

            if(StringUtils.isNotEmpty(searchCriteria.getRegion())) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                sb.append("region='"+searchCriteria.getRegion()+"'");
            }

            if(StringUtils.isNotEmpty(searchCriteria.getBranch())) {
                sb.append(" ");
                sb.append("AND");
                sb.append(" ");
                sb.append("branch='"+searchCriteria.getBranch()+"'");
            }

            sb.append(" group by status");
        }

        String query = sb.toString();
        log.debug("Query string builder" +query);

        List<QuotationStatusMeasurement> quotationPoints = reportDatabaseService.getQuotationPoints(connection, query, dbName);
        List<QuotationReportCounts> quotationReportCounts = new ArrayList<>();
        QuotationReportCounts quotationReportCount = new QuotationReportCounts();
        if(quotationPoints.size() > 0) {
            int totalCounts = 0;
            for(QuotationStatusMeasurement quotationPoint : quotationPoints) {
                if(quotationPoint.getStatus().equalsIgnoreCase("WAITING FOR APPROVAL")) {
                    quotationReportCount.setWaitingForApproveCnts(quotationPoint.getStatusCount());
                    totalCounts += quotationPoint.getTotalCount();
                }
                if(quotationPoint.getStatus().equalsIgnoreCase("PENDING")) {
                    quotationReportCount.setPendingCounts(quotationPoint.getStatusCount());
                    totalCounts += quotationPoint.getTotalCount();
                }
                if(quotationPoint.getStatus().equalsIgnoreCase("APPROVED")) {
                    quotationReportCount.setApprovedCounts(quotationPoint.getStatusCount());
                    totalCounts += quotationPoint.getTotalCount();
                }
                if(quotationPoint.getStatus().equalsIgnoreCase("REJECTED")) {
                    quotationReportCount.setRejectedCounts(quotationPoint.getStatusCount());
                    totalCounts += quotationPoint.getTotalCount();
                }
            }
            quotationReportCount.setTotalQuotations(totalCounts);
            quotationReportCounts.add(quotationReportCount);
        }
        return quotationReportCounts;
    }
    /* End Get Total Counts Status based */

    /* Overwrite a result to Influx Db */
    public String deleteOrUpdateJobPoints() {
        InfluxDB connection = connectDatabase();
        List<JobStatusReport> lastModResults = this.getLastModifiedJobData();
        if(lastModResults.size() > 0) {
            int i=0;
            for(JobStatusReport lastModResult : lastModResults) {            // 0 // 1
                StringBuilder sb = new StringBuilder();
                sb.append("SELECT * FROM JobReport WHERE");
                sb.append(" ");
                sb.append("id="+lastModResult.getJobId());
                String query = sb.toString();
                List<JobStatusMeasurement> jobCategoryReportPoints = reportDatabaseService.getJobPoints(connection, query, dbName);
                if(jobCategoryReportPoints.size() > 0) {                     // 1 record // 0 record
                    for(JobStatusMeasurement jobCat: jobCategoryReportPoints) {   // 0
                        InfluxDB influxDB = connectDatabase();
                        Query deleteQuery = BoundParameterQuery.QueryBuilder.newQuery("DELETE FROM JobReport WHERE time=$time")
                            .forDatabase(dbName)
                            .bind("time", jobCat.getTime())
                            .create();
                        QueryResult results = influxDB.query(deleteQuery);
                        log.debug("Deleted results" +results);
                    }
                }                                                           // empty 1 record
                /* add new job points */
                try {                                                       // 1+1+1 add
                    reportDatabaseService.addNewJobPoints(lastModResult, i);
                }catch (Exception e) {
                    e.printStackTrace();
                }
                i++;
            }
        }

        return "New Job Points are inserted...";
    }

    public String deleteOrUpdateTicketPoints() {
        InfluxDB connection = connectDatabase();
        List<TicketStatusReport> lastModResults = this.getLastModifiedTicketData();
        if(lastModResults.size() > 0) {
            int i=0;
            for(TicketStatusReport lastModResult : lastModResults) {
                StringBuilder sb = new StringBuilder();
                sb.append("SELECT * FROM TicketReport WHERE");
                sb.append(" ");
                sb.append("id="+lastModResult.getTicketId());
                String query = sb.toString();
                List<TicketStatusMeasurement> ticketRepPoints = reportDatabaseService.getTicketPoints(connection, query, dbName);
                if(ticketRepPoints.size() > 0) {
                    for(TicketStatusMeasurement ticketCat: ticketRepPoints) {
                        InfluxDB influxDB = connectDatabase();
                        Query deleteQuery = BoundParameterQuery.QueryBuilder.newQuery("DELETE FROM JobReport WHERE time=$time")
                            .forDatabase(dbName)
                            .bind("time", ticketCat.getTime())
                            .create();
                        QueryResult results = influxDB.query(deleteQuery);
                        log.debug("Deleted results" +results);
                    }
                }
                /* add new ticket points */
                try {
                    reportDatabaseService.addNewTicketPoints(lastModResult, i);
                }catch (Exception e) {
                    e.printStackTrace();
                }
                i++;
            }
        }

        return "New Ticket Points are inserted...";
    }

    public String deleteOrUpdateAttnPoints() {
        InfluxDB connection = connectDatabase();
        List<AttendanceStatusReport> lastModResults = this.getLastModifiedAttendance();
        if(lastModResults.size() > 0) {
            int i=0;
            for(AttendanceStatusReport lastModResult : lastModResults) {
                StringBuilder sb = new StringBuilder();
                sb.append("SELECT * FROM AttendanceReport WHERE");
                sb.append(" ");
                sb.append("id="+lastModResult.getId());
                String query = sb.toString();
                List<AttendanceStatusMeasurement> attnRepPoints = reportDatabaseService.getAttendancePoints(connection, query, dbName);
                if(attnRepPoints.size() > 0) {
                    for(AttendanceStatusMeasurement attn : attnRepPoints) {
                        InfluxDB influxDB = connectDatabase();
                        Query deleteQuery = BoundParameterQuery.QueryBuilder.newQuery("DELETE FROM JobReport WHERE time=$time")
                            .forDatabase(dbName)
                            .bind("time", attn.getTime())
                            .create();
                        QueryResult results = influxDB.query(deleteQuery);
                        log.debug("Deleted results" +results);
                    }
                }
                /* add new Attendance points */
                try {
                    reportDatabaseService.addNewAttnPoints(lastModResult, i);
                }catch (Exception e) {
                    e.printStackTrace();
                }
                i++;
            }
        }

        return "New Attendance Points are inserted...";
    }

    public String deleteOrUpdateQuotePoints() {
        InfluxDB connection = connectDatabase();
        Object quotations = rateCardService.getLastModifiedResult();
        List<QuotationDTO> quotationResults = new ArrayList<QuotationDTO>();
        if (quotations != null) {
            ObjectMapper mapper = new ObjectMapper();
            mapper.findAndRegisterModules();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(DeserializationFeature.ADJUST_DATES_TO_CONTEXT_TIME_ZONE, false);
            try {
                quotationResults = mapper.readValue((String) quotations,
                    new TypeReference<List<QuotationDTO>>() {
                    });
            } catch (IOException e) {
                log.error("Error while converting quotation results to objects", e);
            }
            if (quotationResults.size() > 0) {
                int i = 0;
                for (QuotationDTO lastModResult : quotationResults) {
                    StringBuilder sb = new StringBuilder();
                    sb.append("SELECT * FROM QuotationReport WHERE");
                    sb.append(" ");
                    sb.append("id=" + lastModResult.getSerialId());
                    String query = sb.toString();
                    List<QuotationStatusMeasurement> quoteRepPoints = reportDatabaseService.getQuotationPoints(connection, query, dbName);
                    if (quoteRepPoints.size() > 0) {
                        for (QuotationStatusMeasurement attn : quoteRepPoints) {
                            InfluxDB influxDB = connectDatabase();
                            Query deleteQuery = BoundParameterQuery.QueryBuilder.newQuery("DELETE FROM QuotationReport WHERE time=$time")
                                .forDatabase(dbName)
                                .bind("time", attn.getTime())
                                .create();
                            QueryResult results = influxDB.query(deleteQuery);
                            log.debug("Deleted results" + results);
                        }
                    }
                    /* add new Quotations points */
                    try {
                        reportDatabaseService.addNewQuotePoints(lastModResult, i);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    i++;
                }
            }

        }

        return "New Quotation Points are inserted...";
    }

    public List<ChartModelEntity> getChartzCounts() {
        InfluxDB connection = connectDatabase();
        String query = "select sum(statusCount) as statusCount from QuotationReport where time > now() - 7d group by status,time(1d) fill(0)";
        List<QuotationStatusMeasurement> quoteReportPoints = reportDatabaseService.getQuotationPoints(connection, query, dbName);
        Map<String, Map<String, Integer>> statusPoints = new HashMap<>();
        Map<String, Integer> statusCounts = null;
        List<ChartModelEntity> chartModelEntities = new ArrayList<>();
        if(quoteReportPoints.size() > 0) {
            for(QuotationStatusMeasurement quoteReportPoint : quoteReportPoints) {
                Instant instant = quoteReportPoint.getTime();
                Date myDate = Date.from(instant);
                SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
                String category = formatter.format(myDate);
                if(statusPoints.containsKey(category)) {
                    statusCounts = statusPoints.get(category);
                }else {
                    statusCounts = new HashMap<String, Integer>();
                }

                int pendingCnt = statusCounts.containsKey("Pending") ? statusCounts.get("Pending") : 0;
                int WaitingCnt = statusCounts.containsKey("Waiting for approval") ? statusCounts.get("Waiting for approval") : 0;
                int ApprovedCnt = statusCounts.containsKey("Approved") ? statusCounts.get("Approved") : 0;
                int rejectedCnt = statusCounts.containsKey("Rejected") ? statusCounts.get("Rejected") : 0;

                pendingCnt +=  quoteReportPoint.getStatus().equalsIgnoreCase("Pending") ? quoteReportPoint.getStatusCount() : 0;
                WaitingCnt += quoteReportPoint.getStatus().equalsIgnoreCase("Waiting for approval") ? quoteReportPoint.getStatusCount() : 0;
                ApprovedCnt += quoteReportPoint.getStatus().equalsIgnoreCase("Approved") ? quoteReportPoint.getStatusCount() : 0;
                rejectedCnt += quoteReportPoint.getStatus().equalsIgnoreCase("Rejected") ? quoteReportPoint.getStatusCount() : 0;

                statusCounts.put("Pending", pendingCnt);
                statusCounts.put("Waiting for approval", WaitingCnt);
                statusCounts.put("Approved", ApprovedCnt);
                statusCounts.put("Rejected", rejectedCnt);

                statusPoints.put(category, statusCounts);

            }
            log.debug("Quote status points map count" +statusPoints.toString());

            if(!statusPoints.isEmpty()) {
                Set<Map.Entry<String,Map<String,Integer>>> entrySet = statusPoints.entrySet();
                List<Map.Entry<String, Map<String,Integer>>> list = new ArrayList<Map.Entry<String, Map<String,Integer>>>(entrySet);
                ChartModelEntity chartModelEntity = new ChartModelEntity();
                List<String> categoryList = new ArrayList<>();
                List<Status> categoryStatusCnts = new ArrayList<>();
                Status pendingstatus = new Status();
                Status waitingstatus = new Status();
                Status apprstatus = new Status();
                Status rejstatus = new Status();
                List<Integer> totalPendingCnts = new ArrayList<>();
                List<Integer> totalWaitingCnts = new ArrayList<>();
                List<Integer> totalApprovedCnts = new ArrayList<>();
                List<Integer> totalRejectedCnts = new ArrayList<>();
                for(Map.Entry<String, Map<String, Integer>> ent : list) {
                    String category = ent.getKey();
                    categoryList.add(category);
                    Map<String, Integer> categoryWiseCount = statusPoints.get(category);
                    if(categoryWiseCount.containsKey("Pending")) {
                        int leftCnt = categoryWiseCount.get("Pending");
                        pendingstatus.setName("Pending");
                        totalPendingCnts.add(leftCnt);
                        pendingstatus.setData(totalPendingCnts);
                    }
                    if(categoryWiseCount.containsKey("Waiting for approval")) {
                        int presentCnt = categoryWiseCount.get("Waiting for approval");
                        waitingstatus.setName("Waiting for approval");
                        totalWaitingCnts.add(presentCnt);
                        waitingstatus.setData(totalWaitingCnts);
                    }
                    if(categoryWiseCount.containsKey("Approved")) {
                        int absentCnt = categoryWiseCount.get("Approved");
                        apprstatus.setName("Approved");
                        totalApprovedCnts.add(absentCnt);
                        apprstatus.setData(totalApprovedCnts);
                    }
                    if(categoryWiseCount.containsKey("Rejected")) {
                        int absentCnt = categoryWiseCount.get("Rejected");
                        rejstatus.setName("Rejected");
                        totalRejectedCnts.add(absentCnt);
                        rejstatus.setData(totalRejectedCnts);
                    }

                }

                chartModelEntity.setX(categoryList);
                categoryStatusCnts.add(pendingstatus);
                categoryStatusCnts.add(waitingstatus);
                categoryStatusCnts.add(apprstatus);
                categoryStatusCnts.add(rejstatus);
                chartModelEntity.setStatus(categoryStatusCnts);
                chartModelEntities.add(chartModelEntity);

                log.debug("Formatted JSON for Quotation" + chartModelEntities.toString());
            }

        }

        return chartModelEntities;

    }







}
