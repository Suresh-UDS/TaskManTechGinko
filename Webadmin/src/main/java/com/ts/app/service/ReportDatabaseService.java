package com.ts.app.service;

import com.ts.app.config.ReportDatabaseConfiguration;
import com.ts.app.domain.JobStatusReport;
import com.ts.app.domain.Measurements.JobStatusMeasurement;
import com.ts.app.domain.Measurements.TicketStatusMeasurement;
import com.ts.app.domain.TicketStatusReport;
import com.ts.app.web.rest.dto.JobDTO;
import org.influxdb.InfluxDB;
import org.influxdb.dto.BoundParameterQuery;
import org.influxdb.dto.Point;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;
import org.influxdb.impl.InfluxDBResultMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.Calendar;
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
        return reportDatabaseConfiguration.initializeInduxDbConnection();
    }

    public List<JobStatusMeasurement> getJobPoints(InfluxDB connection, String query, String databaseName) {
        // Run the query
        Query queryObject = new Query(query, databaseName);
        QueryResult queryResult = connection.query(queryObject);

        // Map it
        InfluxDBResultMapper resultMapper = new InfluxDBResultMapper();
        return resultMapper.toPOJO(queryResult, JobStatusMeasurement.class);
    }

    public List<JobStatusMeasurement> getJobExistingPoints(InfluxDB influxDB, Query query) {
        QueryResult results = influxDB.query(query);
        InfluxDBResultMapper mapper = new InfluxDBResultMapper();
        List<JobStatusMeasurement> jobStatusMeasurementList = mapper.toPOJO(results, JobStatusMeasurement.class);
        return jobStatusMeasurementList;
    }

    @Async
    public void addNewJobPoints(JobStatusReport response) throws Exception {
        InfluxDB influxDB = connectDatabase();
        log.debug("job status measurement" + response.toString());
        Calendar cal = Calendar.getInstance();
        cal.setTime(response.getJobCreatedDate());
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        influxDB.setRetentionPolicy("defaultPolicy");
        influxDB.enableBatch(100, 200, TimeUnit.MILLISECONDS);
        Point jobNewPoint = Point.measurement("jobReportStatus")
            .time(System.currentTimeMillis(), TimeUnit.MILLISECONDS)
            .addField("date", cal.getTimeInMillis())
            .tag("date", String.valueOf(cal.getTimeInMillis()))
            .addField("status", response.getJobStatus().toString())
            .tag("status",response.getJobStatus().toString())
            .addField("type", (response.getJobType() != null ? response.getJobType().toString() : "CARPENTRY"))
            .tag("type", (response.getJobType() != null ? response.getJobType().toString() : "CARPENTRY"))
            .addField("projectId", response.getProjectId())
            .addField("siteId", response.getSiteId())
            .addField("region", response.getRegion() != null ? response.getRegion() : "north-region")
            .tag("region", response.getRegion() != null ? response.getRegion() : "north-region")
            .addField("branch", response.getBranch() != null ? response.getBranch() : "andhrapradesh")
            .tag("branch", response.getBranch() != null ? response.getBranch() : "andhrapradesh")
            .addField("statusCount", response.getStatusCount())
            .build();
        influxDB.write(dbName, "defaultPolicy", jobNewPoint);
        Thread.sleep(2);
        influxDB.disableBatch();
        influxDB.close();
    }

    public void updateJobPoints(JobStatusReport response) {
        InfluxDB influxDB = connectDatabase();

        // Query the data from influxDB
        Query query = BoundParameterQuery.QueryBuilder.newQuery("SELECT * FROM jobReportStatus WHERE date >= $fromDate AND date <= $toDate")
            .forDatabase(dbName)
            .bind("fromDate", 1531765800090L)
            .bind("toDate", 1531765800092L)
            .create();

        Query updateQry = BoundParameterQuery.QueryBuilder.newQuery("INSERT jobReportStatus")
            .forDatabase(dbName)
            .create();

        List<JobStatusMeasurement> jobStatusMeasurementList = getJobExistingPoints(influxDB, query);
        log.debug("Existing points for job ", jobStatusMeasurementList.size());
    }

    public List<TicketStatusMeasurement> getTicketPoints(InfluxDB connection, String query, String databaseName) {
        // Run the query
        Query queryObject = new Query(query, databaseName);
        QueryResult queryResult = connection.query(queryObject);

        // Map it
        InfluxDBResultMapper resultMapper = new InfluxDBResultMapper();
        return resultMapper.toPOJO(queryResult, TicketStatusMeasurement.class);
    }


}
