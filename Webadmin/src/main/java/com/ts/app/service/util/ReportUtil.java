package com.ts.app.service.util;

import com.ts.app.domain.Employee;
import com.ts.app.domain.User;
import com.ts.app.web.rest.dto.*;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import java.util.List;
import java.util.UUID;

@Component
public class ReportUtil {

    private static final Logger log = LoggerFactory.getLogger(ReportUtil.class);


    @Inject
	private ExportUtil exportUtil;

	@Inject
	private CacheUtil cacheUtil;

	@Inject
	private Environment env;

    public ExportResult generateJobReports(List<JobDTO> content, User user, Employee emp, ExportResult result, SearchCriteria criteria) {
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

            //log.debug("UUID VALUE **********"+uuidVal);
            uuidVal += ".xlsx";
            exportUtil.updateExportStatus(uuidVal, "COMPLETED");

            result.setEmpId(emp.getEmpId());
            result.setStatus("COMPLETED");
           // log.debug("RESULT OBJECT VALUES HERE *************"+result);
            return result;

        }else if(criteria.getExportType().equalsIgnoreCase("xlsx")) {
            //return exportUtil.writeJobReportToFile(content, empId, result);
            return exportUtil.writeJobExcelReportToFile(criteria.getProjectName(), content, user, emp,result);
        }
        return result;
    }
    
    public ExportResult generateTicketReports(List<TicketDTO> content, User user, Employee emp, ExportResult result, SearchCriteria criteria) {
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
            String reportUrl = env.getProperty("reports.ticket-report.url");
            result.setUrl(reportUrl + "/" + uuidVal);

            //log.debug("UUID VALUE **********"+uuidVal);
            uuidVal += ".xlsx";
            exportUtil.updateExportStatus(uuidVal, "COMPLETED");

            result.setEmpId(emp.getEmpId());
            result.setStatus("COMPLETED");
           // log.debug("RESULT OBJECT VALUES HERE *************"+result);
            return result;

        }else if(criteria.getExportType().equalsIgnoreCase("xlsx")) {
            //return exportUtil.writeJobReportToFile(content, empId, result);
            return exportUtil.writeTicketExcelReportToFile(criteria.getProjectName(), content, user, emp, result);
        }
        return result;
    }
    
    

	public SearchCriteria getJobReportCriteria(String uid) {
		return cacheUtil.getSearchCriteria(uid);
	}

	public ExportResult generateAttendanceReports(List<AttendanceDTO> content, User user, Employee emp, ExportResult result, SearchCriteria criteria) {
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
			uuidVal += ".xlsx";
			exportUtil.updateExportStatus(uuidVal, "COMPLETED");
			result.setEmpId(emp.getEmpId());
			result.setStatus("COMPLETED");
			return result;

		}else if(criteria.getExportType().equalsIgnoreCase("xlsx")) {
			//return exportUtil.writeAttendanceReportToFile(criteria.getProjectName(), content, empId, result);
            return exportUtil.writeAttendanceExcelReportToFile(criteria.getProjectName(), content, user, emp, result);
		}
		return result;
	}

	public SearchCriteria getAttendanceReportCriteria(String uid) {
		return cacheUtil.getSearchCriteria(uid);
	}
	
	
    public ExportResult generateAssetReports(List<AssetDTO> content, final String empId, ExportResult result, SearchCriteria criteria) {
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
            String reportUrl = env.getProperty("reports.asset-report.url");
            result.setUrl(reportUrl + "/" + uuidVal);

            //log.debug("UUID VALUE **********"+uuidVal);
            uuidVal += ".xlsx";
            exportUtil.updateExportStatus(uuidVal, "COMPLETED");

            result.setEmpId(empId);
            result.setStatus("COMPLETED");
           // log.debug("RESULT OBJECT VALUES HERE *************"+result);
            return result;

        }else if(criteria.getExportType().equalsIgnoreCase("xlsx")) {
            //return exportUtil.writeAssetReportToFile(content, empId, result);
            return exportUtil.writeAssetExcelReportToFile(content,empId,result);
        }
        return result;
    }
    
	public SearchCriteria getAssetReportCriteria(String uid) {
		return cacheUtil.getSearchCriteria(uid);
	}

	public ExportResult generateVendorReports(List<VendorDTO> content, final String empId, ExportResult result, SearchCriteria criteria) {
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
            String reportUrl = env.getProperty("reports.vendor-report.url");
            result.setUrl(reportUrl + "/" + uuidVal);

            //log.debug("UUID VALUE **********"+uuidVal);
            uuidVal += ".xlsx";
            exportUtil.updateExportStatus(uuidVal, "COMPLETED");

            result.setEmpId(empId);
            result.setStatus("COMPLETED");
           // log.debug("RESULT OBJECT VALUES HERE *************"+result);
            return result;

        }else if(criteria.getExportType().equalsIgnoreCase("xlsx")) {
            //return exportUtil.writeAssetReportToFile(content, empId, result);
            return exportUtil.writeVendorExcelReportToFile(content,empId,result);
        }
        return result;
	}
	
	public SearchCriteria getVendorReportCriteria(String uid) {
		return cacheUtil.getSearchCriteria(uid);
	}
	
    public ExportResult generateFeedbackReports(List<FeedbackTransactionDTO> content, User user, Employee emp, ExportResult result, SearchCriteria criteria) {
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
            String reportUrl = env.getProperty("reports.feedback-report.url");
            result.setUrl(reportUrl + "/" + uuidVal);

            //log.debug("UUID VALUE **********"+uuidVal);
            uuidVal += ".xlsx";
            exportUtil.updateExportStatus(uuidVal, "COMPLETED");

            result.setEmpId(emp.getEmpId());
            result.setStatus("COMPLETED");
           // log.debug("RESULT OBJECT VALUES HERE *************"+result);
            return result;

        }else if(criteria.getExportType().equalsIgnoreCase("xlsx")) {
            return exportUtil.writeFeedbackExcelReportToFile(criteria.getProjectName(), content, user, emp,result);
        }
        return result;
    }
}
