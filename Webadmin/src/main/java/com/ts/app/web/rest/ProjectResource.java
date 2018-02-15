package com.ts.app.web.rest;

import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.ProjectService;
import com.ts.app.service.SiteService;
import com.ts.app.web.rest.dto.ProjectDTO;
import com.ts.app.web.rest.dto.SiteDTO;
import com.ts.app.web.rest.errors.ErrorConstants;
import com.ts.app.web.rest.errors.ErrorDTO;
import com.ts.app.web.rest.errors.TimesheetException;

/**
 * REST controller for managing the Project information
 */
@RestController
@RequestMapping("/api")
public class ProjectResource {

	private final Logger log = LoggerFactory.getLogger(ProjectResource.class);

	@Inject
	private ProjectService projectService;

	@Inject
	private SiteService siteService;


	@Inject
	public ProjectResource(ProjectService projectService) {
		this.projectService = projectService;
	}

	/**
	 * POST /saveProject -> saveProject the Project.
	 */
	@RequestMapping(value = "/project", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> saveProject(@Valid @RequestBody ProjectDTO projectDTO, HttpServletRequest request) {
		log.info("Inside the method in concern" + projectDTO.getName());
		try {
			log.debug("Logged in user id -" + SecurityUtils.getCurrentUserId());
			projectDTO.setUserId(SecurityUtils.getCurrentUserId());
			if(!projectService.isDuplicate(projectDTO)) {
				projectDTO = projectService.createProjectInformation(projectDTO);
			}else {
				projectDTO.setMessage("error.duplicateRecordError");
				return new ResponseEntity<>(projectDTO,HttpStatus.BAD_REQUEST);
			}
		}catch (Exception cve) {
			throw new TimesheetException(cve);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);

	}

	@RequestMapping(value = "/project", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> updateProject(@Valid @RequestBody ProjectDTO project, HttpServletRequest request) {
		log.info("Inside Update" + project.getName());

		try {
			projectService.updateProject(project);
		}catch (Exception cve) {
			throw new TimesheetException(cve, project);
		}

		return new ResponseEntity<>(HttpStatus.OK);

	}

	@RequestMapping(value = "/project/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		log.info("Inside Delete" + id);

		projectService.deleteProject(id);

		return new ResponseEntity<>(HttpStatus.OK);

	}

	@RequestMapping(value = "/project", method = RequestMethod.GET)
	public List<ProjectDTO> findAll() {
		log.info("--Inside the method in concern--");
		return projectService.findAll(SecurityUtils.getCurrentUserId());
	}

	@RequestMapping(value = "/project/{id}", method = RequestMethod.GET)
	public ProjectDTO get(@PathVariable Long id) {
		return projectService.findOne(id);
		// .map((entity) -> new ResponseEntity<>(entity, HttpStatus.OK))
		// .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}



    @RequestMapping(value = "/project/search",method = RequestMethod.POST)
    public SearchResult<ProjectDTO> searchProjects(@RequestBody SearchCriteria searchCriteria) {
        SearchResult<ProjectDTO> result = null;
        if(searchCriteria != null) {
        	searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
            result = projectService.findBySearchCrieria(searchCriteria);
        }
        return result;
    }

    @CrossOrigin
    @RequestMapping(value = "/project/{projectId}/sites", method = RequestMethod.GET)
    public List<SiteDTO> getSites(@PathVariable Long projectId) {
        List<SiteDTO> sites = siteService.findSites(projectId, SecurityUtils.getCurrentUserId());
        return sites;
    }



}
