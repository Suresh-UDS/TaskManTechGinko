package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Authority;
import com.ts.app.domain.Employee;
import com.ts.app.domain.User;
import com.ts.app.repository.*;
import com.ts.app.security.AuthoritiesConstants;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.MailService;
import com.ts.app.service.UserService;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.RandomUtil;
import com.ts.app.web.rest.dto.*;
import com.ts.app.web.rest.errors.TimesheetException;
import com.ts.app.web.rest.util.HeaderUtil;
import com.ts.app.web.rest.util.PaginationUtil;
import com.ts.app.web.rest.util.UserUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

/**
 * REST controller for managing users.
 *
 * <p>
 * This class accesses the User entity, and needs to fetch its collection of
 * authorities.
 * </p>
 * <p>
 * For a normal use-case, it would be better to have an eager relationship
 * between User and Authority, and send everything to the client side: there
 * would be no DTO, a lot less code, and an outer-join which would be good for
 * performance.
 * </p>
 * <p>
 * We use a DTO for 3 reasons:
 * <ul>
 * <li>We want to keep a lazy association between the user and the authorities,
 * because people will quite often do relationships with the user, and we don't
 * want them to get the authorities all the time for nothing (for performance
 * reasons). This is the #1 goal: we should not impact our users' application
 * because of this use-case.</li>
 * <li>Not having an outer join causes n+1 requests to the database. This is not
 * a real issue as we have by default a second-level cache. This means on the
 * first HTTP call we do the n+1 requests, but then all authorities come from
 * the cache, so in fact it's much better than doing an outer join (which will
 * get lots of data from the database, for each HTTP call).</li>
 * <li>As this manages users, for security reasons, we'd rather have a DTO
 * layer.</li>
 * </p>
 * <p>
 * Another option would be to have a specific JPA entity graph to handle this
 * case.
 * </p>
 */
@RestController
@RequestMapping("/api")
public class UserResource {

	private final Logger log = LoggerFactory.getLogger(UserResource.class);

	@Inject
	private UserRepository userRepository;

	@Inject
	private UserGroupRepository userGroupRepository;

	@Inject
	private UserRoleRepository userRoleRepository;

	@Inject
	private AuthorityRepository authorityRepository;

	@Inject
	private UserService userService;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private MailService mailService;

	@Inject
	private PasswordEncoder passwordEncoder;

	@Inject
	private EmployeeRepository employeeRepository;

	/**
	 * POST /users -> Create a new user.
	 */
	@RequestMapping(value = "/users", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	@Secured(AuthoritiesConstants.ADMIN)
	public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO user,HttpServletRequest request) throws URISyntaxException {
		log.debug("REST request to save User : {}", user);
		UserDTO result = null;
		try {
			result = userService.createUserInformation(user);
			userService.requestPasswordReset(user.getEmail()).get();
			result = userService.getUserWithAuthorities(result.getId());
			String baseUrl = request.getScheme() + // "http"
					"://" + // "://"
					request.getServerName() + // "myhost"
					":" + // ":"
					request.getServerPort(); // "80"
			//baseUrl = request.getContextPath();
			//mailService.sendPasswordResetMail(result, baseUrl);
		}catch(Exception e) {
			throw new TimesheetException(e, result);
		}
		return ResponseEntity.created(new URI("/api/users/" + result.getId()))
				.headers(HeaderUtil.createEntityCreationAlert("user", String.valueOf(result.getId()))).body(result);
	}

	/**
	 * PUT /users -> Updates an existing User.
	 */

	@RequestMapping(value = "/users", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	@Transactional
	@Secured(AuthoritiesConstants.ADMIN)
	public ResponseEntity<UserDTO> updateUser(@RequestBody UserDTO userDTO)
			throws URISyntaxException {
		log.debug("REST request to update User : {}", userDTO);
		log.debug("REST request to update User : {}", userDTO.getLogin());
		return Optional.of(userRepository.findOne(userDTO.getId())).map(user -> {

//			if(userDTO.getUserGroupId() > 0) {
//            		user.setUserGroup(userGroupRepository.findOne(userDTO.getUserGroupId()));
//            }else {
//            		throw new TimesheetException(new IllegalArgumentException("Not a valid User Group"));
//            }

			if(userDTO.getUserRoleId() > 0) {
	        		user.setUserRole(userRoleRepository.findOne(userDTO.getUserRoleId()));
	        }else {
	        		throw new TimesheetException(new IllegalArgumentException("Not a valid User Role"));
	        }

			Employee employee = null;
			log.debug("Create new user - Associated employee id - "+ userDTO.getEmployeeId());
            if(userDTO.getEmployeeId() > 0) {
            	employee = employeeRepository.findOne(userDTO.getEmployeeId());
            	user.setEmployee(employee);
            }
	        	if(employee != null) {
	        		employee.setUser(user);
	        		employeeRepository.save(employee);
	        	}

	        	if(StringUtils.isNotEmpty(userDTO.getLogin())){
                    user.setLogin(userDTO.getLogin());
                }

                if(StringUtils.isNotEmpty(userDTO.getClearPassword())){
                    user.setClearPassword(userDTO.getClearPassword());
                }
			String encryptedPassword = null;
            if(StringUtils.isNotEmpty(userDTO.getPassword())){
            	encryptedPassword = passwordEncoder.encode(userDTO.getPassword());
                user.setPassword(encryptedPassword);
            }else {
            	encryptedPassword = passwordEncoder.encode(RandomUtil.generatePassword());
                user.setPassword(encryptedPassword);
            }
			user.setFirstName(userDTO.getFirstName());
			user.setLastName(userDTO.getLastName());
			user.setEmail(userDTO.getEmail());
			user.setActivated(userDTO.isActivated());
			//if user is activate set the active flag to 'Y'
			if(user.getActivated()) {
				user.setActive(User.ACTIVE_YES);
			}else {
				user.setActive(User.ACTIVE_NO);
			}
			user.setEmailSubscribed(userDTO.isEmailSubscribed());
			user.setLangKey(userDTO.getLangKey());
			Set<Authority> authorities = user.getAuthorities();
			for(Authority auth : authorities) {
				log.debug("auth in DB :"+ auth.getName());
			}
			authorities.clear();
			Set<String> auths = userDTO.getAuthorities();
			for(String auth : auths) {
				log.debug("user authorities :"+ auth);
			}
			userDTO.setAuthorities(UserUtil.transformAuthorities(auths));
			userDTO.getAuthorities().stream()
					.forEach(authority -> authorities.add(authorityRepository.findOne(authority)));

			return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert("user", userDTO.getLogin()))
					.body(mapperUtil.toModel(userRepository.findOne(userDTO.getId()), UserDTO.class));
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
	}

	/**
	 * GET /users -> get all users.
	 */

	@RequestMapping(value = "/users", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	@Transactional(readOnly = true)
	public ResponseEntity<List<UserDTO>> getAllUsers(Pageable pageable) throws URISyntaxException {
		Page<User> page = userRepository.findAll(pageable);
		log.debug("/api/users - page size -" + page.getSize());
		List<User> userList = page.getContent();
		List<UserDTO> userDTOList = new ArrayList<UserDTO>();
		for(User user : userList) {
			if(!user.getLogin().equalsIgnoreCase("admin")) {
				UserDTO userDTO = mapperUtil.toModel(user, UserDTO.class);
				Set<Authority> authorities = user.getAuthorities();
				Set<String> authNames = new HashSet<String>();
				for(Authority auth : authorities) {
					authNames.add(auth.getName());
				}
				userDTO.setAuthorities(authNames);
				userDTOList.add(userDTO);
			}
		}
		log.debug("/api/users - user list size -" + userDTOList.size());
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/users");
		return new ResponseEntity<>(userDTOList, headers, HttpStatus.OK);
	}

	/**
	 * GET /users -> get a user.
	 */

	@RequestMapping(value = "/users/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	@Transactional(readOnly = true)
	public ResponseEntity<UserDTO> getUser(@PathVariable("id") long id) throws URISyntaxException {
		UserDTO userDto = userService.getUserWithAuthorities(id);
		return new ResponseEntity<UserDTO>(userDto, HttpStatus.OK);
	}

	@RequestMapping(value = "/users/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable long id) {
		log.info("Inside Delete" + id);
		userService.deleteUser(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}



	@RequestMapping(value = "/users/search",method = RequestMethod.POST)
	public SearchResult<UserDTO> searchUsers(@RequestBody SearchCriteria searchCriteria) {
		SearchResult<UserDTO> result = null;
		if(searchCriteria != null) {
            searchCriteria.setUserId(SecurityUtils.getCurrentUserId());
			result = userService.findBySearchCrieria(searchCriteria);
		}
		return result;
	}

    @RequestMapping(value = "/user/change_password", method=RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> changeNewPassword(@RequestBody KeyAndPasswordDTO keyAndPasswordDTO){
        User user = userRepository.findOne(SecurityUtils.getCurrentUserId());
        UserDTO userDto = null;
        if(user !=null){
            userDto = userService.changeNewPassword(SecurityUtils.getCurrentUserId(), keyAndPasswordDTO.getNewPassword());
            userDto.setMessage("Username Changed");
             
            return new ResponseEntity<Object>(userDto,HttpStatus.OK);
        }
         
        return new ResponseEntity<Object>(userDto,HttpStatus.SERVICE_UNAVAILABLE);
    }



}
