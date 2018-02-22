package com.ts.app.service.util;

import java.util.List;
import java.util.UUID;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.ts.app.domain.EmployeeAttendanceReport;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.SearchCriteria;

@Component
public class ReportUtil {
	
	@Inject
	private ExportUtil exportUtil;
	
	@Inject
	private CacheUtil cacheUtil;
	
	@Inject
	private Environment env;

	public ExportResult generateJobReports(List<JobDTO> content, final String empId, ExportResult result, SearchCriteria criteria) {
		if(criteria.getExportType().equalsIgnoreCase("html")) {
			if(result == null) {
				result = new ExportResult();
			}
			String uuidVal = null;
			if(StringUtils.isNotEmpty(criteria.getExportType()) && criteria.getExportType().equalsIgnoreCase("html")) {
				UUID uuid = UUID.randomUUID();
				uuidVal = uuid.toString();
				cacheUtil.putSearchCriteria(uuidVal, criteria);
			}
			result.setFile(uuidVal);
			String reportUrl = env.getProperty("reports.job-report.url");
			result.setUrl(reportUrl + "/" + uuidVal);
			uuidVal += ".csv";
			exportUtil.updateExportStatus(uuidVal, "COMPLETED");
			result.setEmpId(empId);
			result.setStatus("COMPLETED");
			return result;

		}else if(criteria.getExportType().equalsIgnoreCase("csv")) {
			return exportUtil.writeJobReportToFile(content, empId, result);
		}
		return null;
	}
	
	public SearchCriteria getJobReportCriteria(String uid) {
		return cacheUtil.getSearchCriteria(uid);
	}
	
	public ExportResult generateAttendanceReports(List<EmployeeAttendanceReport> content, final String empId, ExportResult result, SearchCriteria criteria) {
		if(criteria.getExportType().equalsIgnoreCase("html")) {
			if(result == null) {
				result = new ExportResult();
			}
			String uuidVal = null;
			if(StringUtils.isNotEmpty(criteria.getExportType()) && criteria.getExportType().equalsIgnoreCase("html")) {
				UUID uuid = UUID.randomUUID();
				uuidVal = uuid.toString();
				cacheUtil.putSearchCriteria(uuidVal, criteria);
			}
			result.setFile(uuidVal);
			String reportUrl = env.getProperty("reports.attendance-report.url");
			result.setUrl(reportUrl + "/" + uuidVal);
			uuidVal += ".csv";
			exportUtil.updateExportStatus(uuidVal, "COMPLETED");
			result.setEmpId(empId);
			result.setStatus("COMPLETED");
			return result;

		}else if(criteria.getExportType().equalsIgnoreCase("csv")) {
			return exportUtil.writeAttendanceReportToFile(criteria.getProjectName(), content, empId, result);
		}
		return null;
	}
	
	public SearchCriteria getAttendanceReportCriteria(String uid) {
		return cacheUtil.getSearchCriteria(uid);
	}
}
