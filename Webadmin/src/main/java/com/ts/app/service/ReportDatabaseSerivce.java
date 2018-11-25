package com.ts.app.service;

import com.ts.app.domain.Measurements.JobStatusMeasurement;
import org.influxdb.InfluxDB;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;
import org.influxdb.impl.InfluxDBResultMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportDatabaseSerivce {

    public List<JobStatusMeasurement> getPoints(InfluxDB connection, String query, String databaseName) {
        // Run the query
        Query queryObject = new Query(query, databaseName);
        QueryResult queryResult = connection.query(queryObject);

        // Map it
        InfluxDBResultMapper resultMapper = new InfluxDBResultMapper();
        return resultMapper.toPOJO(queryResult, JobStatusMeasurement.class);
    }
}
