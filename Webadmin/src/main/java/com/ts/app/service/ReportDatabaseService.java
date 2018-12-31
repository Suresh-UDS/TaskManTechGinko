package com.ts.app.service;

import com.ts.app.config.ReportDatabaseConfiguration;
import com.ts.app.domain.AttendanceStatusReport;
import com.ts.app.domain.JobStatusReport;
import com.ts.app.domain.Measurements.AttendanceStatusMeasurement;
import com.ts.app.domain.Measurements.JobStatusMeasurement;
import com.ts.app.domain.Measurements.QuotationStatusMeasurement;
import com.ts.app.domain.Measurements.TicketAvgStatus;
import com.ts.app.domain.Measurements.TicketStatusMeasurement;
import com.ts.app.domain.TicketStatusReport;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.QuotationDTO;
import org.influxdb.BatchOptions;
import org.influxdb.InfluxDB;
import org.influxdb.dto.*;
import org.influxdb.impl.InfluxDBResultMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class ReportDatabaseService {

    private final Logger log = LoggerFactory.getLogger(ReportDatabaseService.class);

    @Value("${influxdb.dbname}")
    private String dbName;

    @Inject
    private ReportDatabaseConfiguration reportDatabaseConfiguration;

    private InfluxDB connectDatabase() {
        // Connect to database assumed on local host with default credentials.
        return reportDatabaseConfiguration.initializeInfluxDbConnection();
    }

    public List<JobStatusMeasurement> getJobPoints(InfluxDB connection, String query, String databaseName) {
        // Run the query
        Query queryObject = new Query(query, databaseName);
        QueryResult queryResult = connection.query(queryObject);

        // Map it
        InfluxDBResultMapper resultMapper = new InfluxDBResultMapper();
        return resultMapper.toPOJO(queryResult, JobStatusMeasurement.class);
    }

    public List<TicketStatusMeasurement> getTicketPoints(InfluxDB connection, String query, String databaseName) {
        // Run the query
        Query queryObject = new Query(query, databaseName);
        QueryResult queryResult = connection.query(queryObject);

        // Map it
        InfluxDBResultMapper resultMapper = new InfluxDBResultMapper();
        return resultMapper.toPOJO(queryResult, TicketStatusMeasurement.class);
    }

    public List<AttendanceStatusMeasurement> getAttendancePoints(InfluxDB connection, String query, String databaseName) {
        // Run the query
        Query queryObject = new Query(query, databaseName);
        QueryResult queryResult = connection.query(queryObject);

        // Map it
        InfluxDBResultMapper resultMapper = new InfluxDBResultMapper();
        return resultMapper.toPOJO(queryResult, AttendanceStatusMeasurement.class);
    }

    public List<QuotationStatusMeasurement> getQuotationPoints(InfluxDB connection, String query, String databaseName) {
        // Run the query
        Query queryObject = new Query(query, databaseName);
        QueryResult queryResult = connection.query(queryObject);

        // Map it
        InfluxDBResultMapper resultMapper = new InfluxDBResultMapper();
        return resultMapper.toPOJO(queryResult, QuotationStatusMeasurement.class);
    }

    public void addNewJobPoints(JobStatusReport reportList, int i) throws Exception {
        InfluxDB influxDB = connectDatabase();
//        influxDB.setRetentionPolicy("one_year_policy");
//        influxDB.enableBatch(BatchOptions.DEFAULTS.actions(100).flushDuration(200));
        BatchPoints batchPoints = BatchPoints
            .database(dbName)
            .tag("async", "true")
            .retentionPolicy("one_year_policy")
            .consistency(InfluxDB.ConsistencyLevel.ALL)
            .build();

        if(reportList != null) {
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
                .addField("type", (reportList.getJobType() != null ? reportList.getJobType().toString() : "OTHERS"))
                .tag("type", (reportList.getJobType() != null ? reportList.getJobType().toString() : "OTHERS"))
                .addField("projectId", (float) reportList.getProjectId())
                .addField("siteId", (float) reportList.getSiteId())
                .tag("siteId", String.valueOf(reportList.getSiteId()))
                .addField("region", reportList.getRegion() != null ? reportList.getRegion() : "north-region")
                .tag("region", reportList.getRegion() != null ? reportList.getRegion() : "north-region")
                .addField("branch", reportList.getBranch() != null ? reportList.getBranch() : "andhrapradesh")
                .tag("branch", reportList.getBranch() != null ? reportList.getBranch() : "andhrapradesh")
                .addField("statusCount", reportList.getStatusCount())
                .build();
            batchPoints.point(jobPoint);
            influxDB.write(batchPoints);
            Thread.sleep(2);
            influxDB.disableBatch();
            influxDB.close();
        }
    }

    public void addNewTicketPoints(TicketStatusReport ticketReportList, int i) throws Exception {
        InfluxDB influxDB = connectDatabase();
//        influxDB.setRetentionPolicy("one_year_policy");
//        influxDB.enableBatch(100, 200, TimeUnit.MILLISECONDS);
//        influxDB.setConsistency(InfluxDB.ConsistencyLevel.ALL);
        BatchPoints batchPoints = BatchPoints
            .database(dbName)
            .tag("async1", "true")
            .retentionPolicy("one_year_policy")
            .consistency(InfluxDB.ConsistencyLevel.ALL)
            .build();

        if(ticketReportList.getCreatedDate() != null) {
            ticketReportList.setFormattedDate(Date.from(ticketReportList.getCreatedDate().toInstant()));
        }
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
            .addField("category", ticketReportList.getCategory() != null ? ticketReportList.getCategory() : "ELECTRICAL")
            .tag("category", ticketReportList.getCategory() != null ? ticketReportList.getCategory() : "ELECTRICAL")
            .addField("assignedOn", ticketReportList.getAssignedOn() != null ? assignedOn.getTimeInMillis() : 0)
            .tag("assignedOn", ticketReportList.getAssignedOn() != null ? String.valueOf(assignedOn.getTimeInMillis()) : "")
            .addField("closedOn", ticketReportList.getClosedOn() != null ? closedOn.getTimeInMillis() : 0)
            .tag("closedOn", ticketReportList.getClosedOn() != null ? String.valueOf(closedOn.getTimeInMillis()) : "")
            .addField("statusCount", ticketReportList.getStatusCount())
            .addField("region", ticketReportList.getRegion() != null ? ticketReportList.getRegion() : "north-region")
            .tag("region", ticketReportList.getRegion() != null ? ticketReportList.getRegion() : "north-region")
            .addField("branch", ticketReportList.getBranch() != null ? ticketReportList.getBranch() : "andhrapradesh")
            .tag("branch", ticketReportList.getBranch() != null ? ticketReportList.getBranch() : "andhrapradesh")
            .build();
        batchPoints.point(ticketPoint);
        influxDB.write(batchPoints);
        Thread.sleep(2);
        influxDB.disableBatch();
        influxDB.close();
    }

    public void addNewAttnPoints(AttendanceStatusReport attendanceReportList, int i) throws Exception {
        InfluxDB influxDB = connectDatabase();
//        influxDB.setRetentionPolicy("one_year_policy");
//        influxDB.enableBatch(BatchOptions.DEFAULTS.actions(100).flushDuration(200));
//        influxDB.setConsistency(InfluxDB.ConsistencyLevel.ALL);
        BatchPoints batchPoints = BatchPoints
            .database(dbName)
            .tag("async2", "true")
            .retentionPolicy("one_year_policy")
            .consistency(InfluxDB.ConsistencyLevel.ALL)
            .build();

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
        batchPoints.point(attendancePoint);
        influxDB.write(batchPoints);
        Thread.sleep(2);
        influxDB.disableBatch();
        influxDB.close();
    }


    public void addNewQuotePoints(QuotationDTO quotationResult, int i) throws Exception {
        log.debug("Quotation request -" +quotationResult.toString());
        InfluxDB influxDB = connectDatabase();
        BatchPoints batchPoints = BatchPoints
            .database(dbName)
            .tag("async3", "true")
            .retentionPolicy("one_year_policy")
            .consistency(InfluxDB.ConsistencyLevel.ALL)
            .build();

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
        batchPoints.point(quotationPoint);
        influxDB.write(batchPoints);
        Thread.sleep(2);
        influxDB.disableBatch();
        influxDB.close();
    }
    
    public void addTicketAvg(List<TicketStatusMeasurement> ticketStats) throws Exception {
    	InfluxDB influxDB = connectDatabase();
    	BatchPoints batchPoints = BatchPoints
                .database(dbName)
                .tag("async4", "true")
                .retentionPolicy("one_year_policy")
                .consistency(InfluxDB.ConsistencyLevel.ALL)
                .build();
    	for(TicketStatusMeasurement ticketStat : ticketStats) {
    		Point point = Point.measurement("TicketAvgStatus")
        			.time(System.currentTimeMillis(), TimeUnit.MILLISECONDS)
        			.addField("category", ticketStat.getCategory())
        			.tag("category", ticketStat.getCategory())
        			.addField("counts", ticketStat.getStatusCount())
        			.tag("counts", String.valueOf(ticketStat.getStatusCount()))
        			.build();
        	batchPoints.point(point);
    	}
    	influxDB.write(batchPoints);
    	Thread.sleep(2);
    	influxDB.disableBatch();
    	influxDB.close();
    }

	public List<TicketAvgStatus> getTicketAvgPoints(InfluxDB connection, String query, String dbName) {
		// TODO Auto-generated method stub
		// Run the query
        Query queryObject = new Query(query, dbName);
        QueryResult queryResult = connection.query(queryObject);
        // Map it
        InfluxDBResultMapper resultMapper = new InfluxDBResultMapper();
        return resultMapper.toPOJO(queryResult, TicketAvgStatus.class);
	}
	
	public void deleteQuery(InfluxDB connection, String query, String dbName) {
		 Query queryObject = new Query(query, dbName);
	     QueryResult queryResult = connection.query(queryObject);
	     log.debug("Deleted true" +queryResult);
	}


}
