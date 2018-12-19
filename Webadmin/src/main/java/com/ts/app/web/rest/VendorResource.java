package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.VendorService;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.web.rest.dto.*;
import com.ts.app.web.rest.errors.TimesheetException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.Calendar;
import java.util.List;

/**
 * REST controller for managing the Vendor information.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class VendorResource {

	private final Logger log = LoggerFactory.getLogger(VendorResource.class);

	@Inject
	private VendorService vendorService;

	@Inject
	private ImportUtil importUtil;

	@Inject
	public VendorResource(VendorService vendorService) {
		this.vendorService = vendorService;
	}

	/**
	 * POST /saveVendor -> saveVendor the Vendor.
	 */
	@RequestMapping(value = "/vendor", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveVendor(@Valid @RequestBody VendorDTO vendorDTO, HttpServletRequest request) {
		log.info("Inside the saveVendor -" + vendorDTO.getName() );
		try  {
			vendorDTO.setUserId(SecurityUtils.getCurrentUserId());
			vendorDTO = vendorService.createVendorInformation(vendorDTO);
		}catch (Exception cve) {
			throw new TimesheetException(cve, vendorDTO);
		}

		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/vendor", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateVendor(@Valid @RequestBody VendorDTO vendor, HttpServletRequest request) {
		log.info("Inside Update" + vendor.getName() );
		try {
			vendorService.updateVendor(vendor);
		}catch (Exception cve) {
			throw new TimesheetException(cve);
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/vendor/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		log.info("Inside Delete" + id);
		vendorService.deleteVendor(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/vendor", method = RequestMethod.GET)
	public List<VendorDTO> findAll(HttpServletRequest request) {
		log.info("--Invoked VendorResource.findAll --");
		return vendorService.findAll();
	}

	@RequestMapping(value = "/vendor/{id}", method = RequestMethod.GET)
	public VendorDTO get(@PathVariable Long id) {
		return vendorService.findOne(id);
	}

	@RequestMapping(value = "/vendor/search",method = RequestMethod.POST)
	public SearchResult<VendorDTO> searchVendors(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<VendorDTO> result = null;
		if(searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = vendorService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}


    @RequestMapping(value = "/vendor/import", method = RequestMethod.POST)
    public ResponseEntity<ImportResult> importJobData(@RequestParam("vendorFile") MultipartFile file){
    	log.info("--Invoked Vendor Import --");
		Calendar cal = Calendar.getInstance();
		//ImportResult result = importUtil.importVendorData(file, cal.getTimeInMillis());
		ImportResult result = null;
		return new ResponseEntity<ImportResult>(result,HttpStatus.OK);
	}

    @RequestMapping(value = "/vendor/import/{fileId}/status",method = RequestMethod.GET)
	public ImportResult importStatus(@PathVariable("fileId") String fileId) {
		log.debug("ImportStatus -  fileId -"+ fileId);
		//ImportResult result = vendorService.getImportStatus(fileId);
		ImportResult result = null;
		if(result!=null && result.getStatus() != null) {
			switch(result.getStatus()) {
				case "PROCESSING" :
					result.setMsg("Importing data...");
					break;
				case "COMPLETED" :
					result.setMsg("Completed importing");
					break;
				case "FAILED" :
					result.setMsg("Failed to import. Please try again");
					break;
				default :
					result.setMsg("Completed importing");
					break;
			}
		}
		return result;
	}
    
    @RequestMapping(value = "/vendor/export", method = RequestMethod.POST)
	public ExportResponse exportVendor(@RequestBody SearchCriteria searchCriteria) {
		// log.debug("JOB EXPORT STARTS HERE **********");
		ExportResponse resp = new ExportResponse();
		if (searchCriteria != null) {
			searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			SearchResult<VendorDTO> result = vendorService.findBySearchCrieria(searchCriteria);
			List<VendorDTO> results = result.getTransactions();
			log.debug("Results length" +results.size());
			resp.addResult(vendorService.generateReport(results, searchCriteria));

			// log.debug("RESPONSE FOR OBJECT resp *************"+resp);
		}
		return resp;
	}
    
    @RequestMapping(value = "/vendor/export/{fileId}/status", method = RequestMethod.GET)
	public ExportResult exportStatus(@PathVariable("fileId") String fileId) {
		// log.debug("ExportStatus - fileId -"+ fileId);
		ExportResult result = vendorService.getExportStatus(fileId);

		// log.debug("RESULT NOW **********"+result);
		// log.debug("RESULT GET STATUS **********"+result.getStatus());

		if (result != null && result.getStatus() != null) {
			switch (result.getStatus()) {
			case "PROCESSING":
				result.setMsg("Exporting...");
				break;
			case "COMPLETED":
				result.setMsg("Download");
				// log.debug("DOWNLOAD FILE PROCESSING HERE
				// ************"+result.getMsg());
				// log.debug("FILE ID IN API CALLING ************"+fileId);
				result.setFile("/api/assets/export/" + fileId);
				// log.debug("DOWNLOADED FILE IS
				// ************"+result.getFile());
				break;
			case "FAILED":
				result.setMsg("Failed to export. Please try again");
				break;
			default:
				result.setMsg("Failed to export. Please try again");
				break;
			}
		}
		return result;
	}

	@RequestMapping(value = "/vendor/export/{fileId}", method = RequestMethod.GET)
	public byte[] getExportFile(@PathVariable("fileId") String fileId, HttpServletResponse response) {
		byte[] content = vendorService.getExportFile(fileId);
		response.setContentType("Application/x-msexcel");
		response.setContentLength(content.length);
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Content-Disposition", "attachment; filename=\"" + fileId + ".xlsx\"");
		return content;
	}











}
