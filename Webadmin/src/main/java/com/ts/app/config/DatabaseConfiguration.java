package com.ts.app.config;

import com.codahale.metrics.MetricRegistry;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.h2.tools.Server;
import org.hibernate.ejb.HibernatePersistence;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.inject.Inject;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Properties;

@Configuration
@EnableJpaRepositories("com.ts.app.repository")
@EnableJpaAuditing(auditorAwareRef = "springSecurityAuditorAware")
@EnableTransactionManagement
public class DatabaseConfiguration {

	private final Logger log = LoggerFactory.getLogger(DatabaseConfiguration.class);

	@Inject
	private Environment env;

	@Autowired(required = false)
	private MetricRegistry metricRegistry;

	@Bean
	@ConditionalOnExpression("#{!environment.acceptsProfiles('cloud') && !environment.acceptsProfiles('heroku')}")
	public DataSource dataSource(DataSourceProperties dataSourceProperties, JHipsterProperties jHipsterProperties) {
		log.debug("Configuring Datasource");
		if (dataSourceProperties.getUrl() == null) {
			log.error(
					"Your database connection pool configuration is incorrect! The application"
							+ " cannot start. Please check your Spring profile, current profiles are: {}",
					Arrays.toString(env.getActiveProfiles()));

			throw new ApplicationContextException("Database connection pool is not configured correctly");
		}

		/*
		DriverManagerDataSource dataSource = new DriverManagerDataSource();

		dataSource.setDriverClassName(dataSourceProperties.getDriverClassName());
		dataSource.setUrl(dataSourceProperties.getUrl());
		dataSource.setUsername(dataSourceProperties.getUsername());
		dataSource.setPassword(dataSourceProperties.getPassword());
		*/

		HikariConfig config = new HikariConfig();
		//config.setDataSourceClassName(dataSourceProperties.getDriverClassName());
		//config.setDriverClassName(dataSourceProperties.getDriverClassName());
		config.setJdbcUrl(dataSourceProperties.getUrl());
		config.addDataSourceProperty("url", dataSourceProperties.getUrl());
		if (dataSourceProperties.getUsername() != null) {
			config.addDataSourceProperty("user", dataSourceProperties.getUsername());
		} else {
			config.addDataSourceProperty("user", ""); // HikariCP doesn't allow null user
		}
		if (dataSourceProperties.getPassword() != null) {
			config.addDataSourceProperty("password", dataSourceProperties.getPassword());
		} else {
			config.addDataSourceProperty("password", ""); // HikariCP doesn't allow null password
		}

		// MySQL optimizations, see https://github.com/brettwooldridge/HikariCP/wiki/MySQL-Configuration
		if ("com.mysql.jdbc.Driver".equals(dataSourceProperties.getDriverClassName())) {
			config.addDataSourceProperty("cachePrepStmts", jHipsterProperties.getDatasource().isCachePrepStmts());
			config.addDataSourceProperty("prepStmtCacheSize",
					jHipsterProperties.getDatasource().getPrepStmtCacheSize());
			config.addDataSourceProperty("prepStmtCacheSqlLimit",
					jHipsterProperties.getDatasource().getPrepStmtCacheSqlLimit());
			config.setMaximumPoolSize(90);
			config.setMinimumIdle(3);
		}
		if (metricRegistry != null) {
			config.setMetricRegistry(metricRegistry);
		}
		return new HikariDataSource(config);
		//return dataSource;
	}

	/**
	 * Open the TCP port for the H2 database, so it is available remotely.
	 */
	@Bean(initMethod = "start", destroyMethod = "stop")
	public Server h2TCPServer() throws SQLException {
		return Server.createTcpServer("-tcp", "-tcpAllowOthers");
	}

	/*
	 * @Bean public SpringLiquibase liquibase(DataSource dataSource,
	 * DataSourceProperties dataSourceProperties, LiquibaseProperties
	 * liquibaseProperties) {
	 * 
	 * // Use liquibase.integration.spring.SpringLiquibase if you don't want
	 * Liquibase to start asynchronously SpringLiquibase liquibase = new
	 * AsyncSpringLiquibase(); liquibase.setDataSource(dataSource);
	 * liquibase.setChangeLog("classpath:config/liquibase/master.xml");
	 * liquibase.setContexts(liquibaseProperties.getContexts());
	 * liquibase.setDefaultSchema(liquibaseProperties.getDefaultSchema());
	 * liquibase.setDropFirst(liquibaseProperties.isDropFirst());
	 * liquibase.setShouldRun(liquibaseProperties.isEnabled()); if
	 * (env.acceptsProfiles(Constants.SPRING_PROFILE_FAST)) { if
	 * ("org.h2.jdbcx.JdbcDataSource".equals(dataSourceProperties.
	 * getDriverClassName())) { liquibase.setShouldRun(true); log.warn(
	 * "Using '{}' profile with H2 database in memory is not optimal, you should consider switching to"
	 * + " MySQL or Postgresql to avoid rebuilding your database upon each start." ,
	 * Constants.SPRING_PROFILE_FAST); } else { liquibase.setShouldRun(false); } }
	 * else { log.debug("Configuring Liquibase"); } return liquibase; }
	 */

	/*
	 * @Bean public Hibernate4Module hibernate4Module() { return new
	 * Hibernate4Module(); }
	 */
	@Bean
	public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSourceProperties dataSourceProperties,
			JHipsterProperties jHipsterProperties) {
		LocalContainerEntityManagerFactoryBean entityManagerFactoryBean = new LocalContainerEntityManagerFactoryBean();
		entityManagerFactoryBean.setDataSource(dataSource(dataSourceProperties, jHipsterProperties));
		entityManagerFactoryBean.setPersistenceProviderClass(HibernatePersistence.class);
		entityManagerFactoryBean.setPackagesToScan("com.ts.app.domain");

		entityManagerFactoryBean.setJpaProperties(hibProperties());
		return entityManagerFactoryBean;
	}

	private Properties hibProperties() {
		Properties properties = new Properties();
		properties.put("hibernate.dialect", "org.hibernate.dialect.MySQL5Dialect");
		properties.put("hibernate.show_sql", true);
		properties.put("hibernate.hbm2ddl.auto", "update");
		properties.put("hibernate.ejb.naming_strategy", "org.hibernate.cfg.ImprovedNamingStrategy");
		properties.put("hibernate.format_sql", true);
		properties.put("hibernate.cache.region.factory_class",
				"org.hibernate.cache.ehcache.SingletonEhCacheRegionFactory");
		properties.put("hibernate.cache.use_second_level_cache", true);
		properties.put("hibernate.cache.use_query_cache", true);
		properties.put("hibernate.generate_statistics", false);
		return properties;
	}

	@Bean
	public JpaTransactionManager transactionManager(DataSourceProperties dataSourceProperties,
			JHipsterProperties jHipsterProperties) {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager
				.setEntityManagerFactory(entityManagerFactory(dataSourceProperties, jHipsterProperties).getObject());
		return transactionManager;
	}

}
