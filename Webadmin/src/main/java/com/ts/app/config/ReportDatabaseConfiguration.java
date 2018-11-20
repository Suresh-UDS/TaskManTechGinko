package com.ts.app.config;

import org.influxdb.InfluxDB;
import org.influxdb.InfluxDBFactory;
import org.influxdb.dto.Pong;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
public class ReportDatabaseConfiguration {
	
	private final Logger log = LoggerFactory.getLogger(ReportDatabaseConfiguration.class);
	
	@Value("${influxdb.url}")
	private String url;
	
	@Value("${influxdb.username}")
	private String username;
	
	@Value("${influxdb.password}")
	private String password;
	
	@Value("${influxdb.dbname}")
	private String databaseName;
	
	@Bean
	public InfluxDB initializeInduxDbConnection() {
		
		InfluxDB influxDb = InfluxDBFactory.connect(url, username, password);
		
		Pong response = influxDb.ping();
        if (response.getVersion().equalsIgnoreCase("unknown")) {
            log.error("Error pinging server.");
        } else {
            log.info("InfluxDB database successfully connected.");
            log.info("Database version: {}", response.getVersion());
        }

        String dbName = databaseName;
        boolean isExists = influxDb.databaseExists(dbName);

        if(!isExists) {
            log.info("Influx DB to create database....");
            influxDb.createDatabase(dbName);
            influxDb.createRetentionPolicy("defaultPolicy", dbName, "30d", 1, true);
        }else {
            log.info("Already database Exists." +isExists);
        }

        influxDb.setLogLevel(InfluxDB.LogLevel.BASIC);
       
        return influxDb;
		
	}

}
