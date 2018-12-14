package com.ts.app.service;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ts.app.service.util.ImportUtil;
import com.ts.app.web.rest.dto.ImportResult;

@Service
public class ImportService extends AbstractService {
	
	private final Logger log = LoggerFactory.getLogger(ImportService.class);
	
	@Autowired
	private ImportUtil importUtil;
	
	public ImportResult importJobData(MultipartFile file, long dateTime)  {
		ImportResult result = null;
		try {
			result = importUtil.importJobData(file, dateTime);
		}catch(Exception e) {
			result = importUtil.getImportResult(String.valueOf(dateTime));
		}
		return result;
	}

	public ImportResult importClientData(MultipartFile file, long dateTime) {
		ImportResult result = null;
		try {
			result = importUtil.importClientData(file, dateTime);
		}catch(Exception e) {
			result = importUtil.getImportResult(String.valueOf(dateTime));
		}
		return result;
	}

	public ImportResult importSiteData(MultipartFile file, long dateTime) {
		ImportResult result = null;
		try {
			result = importUtil.importSiteData(file, dateTime);
		}catch(Exception e) {
			result = importUtil.getImportResult(String.valueOf(dateTime));
		}
		return result;
	}

	public ImportResult changeEmployeeSite(MultipartFile file, long dateTime) {
	    ImportResult result = null;
	    try {
	    		result = importUtil.changeEmployeeSite(file, dateTime);
	    }catch(Exception e) {
			result = importUtil.getImportResult(String.valueOf(dateTime));
		}
	    return result;

    }

	public ImportResult importLocationData(MultipartFile file, long dateTime) {
        ImportResult result = null;
        try {
        		result = importUtil.importLocationData(file, dateTime);
        }catch(Exception e) {
			result = importUtil.getImportResult(String.valueOf(dateTime));
		}
		return result;
	}

	public ImportResult importEmployeeData(MultipartFile file, long dateTime) {
        ImportResult result = null;
        try {
        		result = importUtil.importEmployeeData(file, dateTime);
        }catch (Exception e) {
        		result = importUtil.getImportResult(String.valueOf(dateTime));
        }
		return result;

	}

	public ImportResult importAssetData(MultipartFile file, long dateTime, boolean isPPM, boolean isAMC) {
        ImportResult result = null;
        try {
        		result = importUtil.importAssetData(file, dateTime, isPPM, isAMC);
        }catch(Exception e) {
			result = importUtil.getImportResult(String.valueOf(dateTime));
		}
		return result;
	}


	public ImportResult importChecklistData(MultipartFile file, long dateTime) {
        ImportResult result = null;
        try {
        		result = importUtil.importChecklistData(file, dateTime);
        }catch(Exception e) {
			result = importUtil.getImportResult(String.valueOf(dateTime));
		}
		return result;

	}

	public ImportResult importEmployeeShiftData(MultipartFile file, long dateTime) {
        ImportResult result = null;
        try {
        		importUtil.importEmployeeShiftData(file, dateTime);
        }catch(Exception e) {
			result = importUtil.getImportResult(String.valueOf(dateTime));
		}
		return result;
	}
}
