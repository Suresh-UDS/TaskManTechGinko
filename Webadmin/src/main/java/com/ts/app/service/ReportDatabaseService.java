package com.ts.app.service;

import com.ts.app.domain.Measurements.JobStatusMeasurement;
import com.ts.app.domain.Measurements.TicketStatusMeasurement;
import com.ts.app.web.rest.dto.JobDTO;
import org.influxdb.InfluxDB;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;
import org.influxdb.impl.InfluxDBResultMapper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportDatabaseService {

    public List<JobStatusMeasurement> getJobPoints(InfluxDB connection, String query, String databaseName) {
        // Run the query
        Query queryObject = new Query(query, databaseName);
        QueryResult queryResult = connection.query(queryObject);

        // Map it
        InfluxDBResultMapper resultMapper = new InfluxDBResultMapper();
        return resultMapper.toPOJO(queryResult, JobStatusMeasurement.class);
    }

    @Async
    public void addPointsToJobReport(JobDTO response) {


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
