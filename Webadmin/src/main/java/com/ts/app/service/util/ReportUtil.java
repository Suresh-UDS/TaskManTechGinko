package com.ts.app.service.util;

import java.util.List;
import java.util.UUID;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.ts.app.domain.EmployeeAttendanceReport;
import com.ts.app.web.rest.dto.AssetDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.MaterialDTO;
import com.ts.app.web.rest.dto.MaterialTransactionDTO;
import com.ts.app.web.rest.dto.PurchaseReqDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.TicketDTO;
import com.ts.app.web.rest.dto.VendorDTO;

@Component
public class ReportUtil {

    private static final Logger log = LoggerFactory.getLogger(ReportUtil.class);


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

            //log.debug("UUID VALUE **********"+uuidVal);
            uuidVal += ".xlsx";
            exportUtil.updateExportStatus(uuidVal, "COMPLETED");

            result.setEmpId(empId);
            result.setStatus("COMPLETED");
           // log.debug("RESULT OBJECT VALUES HERE *************"+result);
            return result;

        }else if(criteria.getExportType().equalsIgnoreCase("xlsx")) {
            //return exportUtil.writeJobReportToFile(content, empId, result);
            return exportUtil.writeJobExcelReportToFile(content,empId,result);
        }
        return result;
    }
    
    public ExportResult generateTicketReports(List<TicketDTO> content, final String empId, ExportResult result, SearchCriteria criteria) {
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

            result.setEmpId(empId);
            result.setStatus("COMPLETED");
           // log.debug("RESULT OBJECT VALUES HERE *************"+result);
            return result;

        }else if(criteria.getExportType().equalsIgnoreCase("xlsx")) {
            //return exportUtil.writeJobReportToFile(content, empId, result);
            return exportUtil.writeTicketExcelReportToFile(content,empId,result);
        }
        return result;
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
			uuidVal += ".xlsx";
			exportUtil.updateExportStatus(uuidVal, "COMPLETED");
			result.setEmpId(empId);
			result.setStatus("COMPLETED");
			return result;

		}else if(criteria.getExportType().equalsIgnoreCase("xlsx")) {
			//return exportUtil.writeAttendanceReportToFile(criteria.getProjectName(), content, empId, result);
            return exportUtil.writeAttendanceExcelReportToFile(criteria.getProjectName(), content, empId, result);
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

	public ExportResult generatePRReports(List<PurchaseReqDTO> transactions, final String empId, ExportResult result, SearchCriteria searchCriteria) {
        if(searchCriteria.getExportType().equalsIgnoreCase("html")) {
            if(result == null) {
                result = new ExportResult();
            }
            String uuidVal = null;
            if(StringUtils.isNotEmpty(searchCriteria.getExportType()) && searchCriteria.getExportType().equalsIgnoreCase("html")) {
                UUID uuid = UUID.randomUUID();
                uuidVal = uuid.toString();
                cacheUtil.putSearchCriteria(uuidVal, searchCriteria);
            }
            result.setFile(uuidVal);
            String reportUrl = env.getProperty("reports.pr-report.url");
            result.setUrl(reportUrl + "/" + uuidVal);

            //log.debug("UUID VALUE **********"+uuidVal);
            uuidVal += ".xlsx";
            exportUtil.updateExportStatus(uuidVal, "COMPLETED");

            result.setEmpId(empId);
            result.setStatus("COMPLETED");
           // log.debug("RESULT OBJECT VALUES HERE *************"+result);
            return result;

        }else if(searchCriteria.getExportType().equalsIgnoreCase("xlsx")) {
            //return exportUtil.writeAssetReportToFile(content, empId, result);
            return exportUtil.writePRExcelReportToFile(transactions, empId, result);
        }
        return result;
	}
	
	public ExportResult generateInventoryReports(List<MaterialDTO> transactions, final String empId, ExportResult result, SearchCriteria searchCriteria) {
        if(searchCriteria.getExportType().equalsIgnoreCase("html")) {
            if(result == null) {
                result = new ExportResult();
            }
            String uuidVal = null;
            if(StringUtils.isNotEmpty(searchCriteria.getExportType()) && searchCriteria.getExportType().equalsIgnoreCase("html")) {
                UUID uuid = UUID.randomUUID();
                uuidVal = uuid.toString();
                cacheUtil.putSearchCriteria(uuidVal, searchCriteria);
            }
            result.setFile(uuidVal);
            String reportUrl = env.getProperty("reports.inventory-report.url");
            result.setUrl(reportUrl + "/" + uuidVal);

            //log.debug("UUID VALUE **********"+uuidVal);
            uuidVal += ".xlsx";
            exportUtil.updateExportStatus(uuidVal, "COMPLETED");

            result.setEmpId(empId);
            result.setStatus("COMPLETED");
           // log.debug("RESULT OBJECT VALUES HERE *************"+result);
            return result;

        }else if(searchCriteria.getExportType().equalsIgnoreCase("xlsx")) {
            //return exportUtil.writeAssetReportToFile(content, empId, result);
            return exportUtil.writeInventoryExcelReportToFile(transactions, empId, result);
        }
        return result;
	}

	public ExportResult generateTransactionReports(List<MaterialTransactionDTO> results, final String empId, ExportResult result, SearchCriteria searchCriteria) {
	    if(searchCriteria.getExportType().equalsIgnoreCase("html")) {
            if(result == null) {
                result = new ExportResult();
            }
            String uuidVal = null;
            if(StringUtils.isNotEmpty(searchCriteria.getExportType()) && searchCriteria.getExportType().equalsIgnoreCase("html")) {
                UUID uuid = UUID.randomUUID();
                uuidVal = uuid.toString();
                cacheUtil.putSearchCriteria(uuidVal, searchCriteria);
            }
            result.setFile(uuidVal);
            String reportUrl = env.getProperty("reports.transaction-report.url");
            result.setUrl(reportUrl + "/" + uuidVal);

            //log.debug("UUID VALUE **********"+uuidVal);
            uuidVal += ".xlsx";
            exportUtil.updateExportStatus(uuidVal, "COMPLETED");

            result.setEmpId(empId);
            result.setStatus("COMPLETED");
           // log.debug("RESULT OBJECT VALUES HERE *************"+result);
            return result;

        }else if(searchCriteria.getExportType().equalsIgnoreCase("xlsx")) {
            //return exportUtil.writeAssetReportToFile(content, empId, result);
            return exportUtil.writeTransactionExcelReportToFile(results, empId, result);
        }
        return result;
	}
}
