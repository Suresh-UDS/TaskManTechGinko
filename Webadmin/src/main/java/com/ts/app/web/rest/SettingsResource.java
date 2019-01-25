package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.domain.ApplicationVersionControl;
import com.ts.app.service.SettingsService;
import com.ts.app.web.rest.dto.SettingsDTO;
import com.ts.app.web.rest.errors.TimesheetException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

/**
 * REST controller for managing the Settings information.
 */
@RestController
@RequestMapping("/api")
public class SettingsResource {

	private final Logger log = LoggerFactory.getLogger(SettingsResource.class);

	@Inject
	private SettingsService settingsService;

	@Inject
	public SettingsResource(SettingsService settingsService) {
		this.settingsService = settingsService;
	}

	/**
	 * POST /settings -> save the settings.
	 */
	@RequestMapping(value = "/settings", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveSettings(@Valid @RequestBody SettingsDTO settingsDTO, HttpServletRequest request) {
		log.info("Inside the saveSettings -");
		SettingsDTO settingsUpdated = null;
		try {
			settingsUpdated = settingsService.saveSettings(settingsDTO);
		}catch (Exception e) {
			String msg = "Error while saving settings, please check the information";
			throw new TimesheetException(e, settingsUpdated);

		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/settings/project/{projId}/site/{siteId}", method = RequestMethod.GET)
	public SettingsDTO findAll(@PathVariable("projId") long projId, @PathVariable("siteId") long siteId) {
		log.info("--Invoked SettingsResource.findAll --");
		SettingsDTO settings = settingsService.findAll(projId, siteId);
		return settings;
	}

    @RequestMapping(value = "/version/application", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<ApplicationVersionControl> findVersion(HttpServletRequest request) {
        log.info("Inside the find Version -");

        List<ApplicationVersionControl> applicationVersionControls = settingsService.findApplicationVersionCode();

        return applicationVersionControls;
    }


}
