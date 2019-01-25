package com.ts.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ts.app.domain.PersistentToken;
import com.ts.app.repository.PersistentTokenRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.security.CustomUserDetails;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.EmployeeService;
import com.ts.app.service.MailService;
import com.ts.app.service.UserService;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.EmployeeDTO;
import com.ts.app.web.rest.dto.KeyAndPasswordDTO;
import com.ts.app.web.rest.dto.UserDTO;
import com.ts.app.web.rest.util.TokenUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class AccountResource {

	private final Logger log = LoggerFactory.getLogger(AccountResource.class);

	@Inject
	private UserDetailsService userDetailsService;

	@Inject
	private AuthenticationManager authManager;

	@Inject
	private UserRepository userRepository;

	@Inject
	private UserService userService;

	@Inject
	private PersistentTokenRepository persistentTokenRepository;

	@Inject
	private MailService mailService;

	@Inject
	private MapperUtil mapperUtil;

	@Inject
	private EmployeeService employeeService;

	/**
	 * POST /register -> register the user.
	 */
	@RequestMapping(value = "/register", method = RequestMethod.POST, produces = MediaType.TEXT_PLAIN_VALUE)
	@Timed
	public ResponseEntity<?> registerAccount(@Valid @RequestBody UserDTO userDTO, HttpServletRequest request) {
		log.info("Inside the method in concern" + userDTO.getAdminFlag());
		/*
		 * UserNew userNew =
		 * userNewService.createUserInformation(userDTO.getLogin(),
		 * userDTO.getPassword()); return new
		 * ResponseEntity<>(HttpStatus.CREATED);
		 */
		return userRepository.findOneByLogin(userDTO.getLogin())
				.map(user -> new ResponseEntity<>("login already in use", HttpStatus.BAD_REQUEST))
				.orElseGet(() -> userRepository.findOneByEmail(userDTO.getEmail())
						.map(user -> new ResponseEntity<>("e-mail address already in use", HttpStatus.BAD_REQUEST))
						.orElseGet(() -> {

							UserDTO userDto = userService.createUserInformation(userDTO);

							String baseUrl = request.getScheme() + // "http"
									"://" + // "://"
									request.getServerName() + // "myhost"
									":" + // ":"
									request.getServerPort(); // "80"

							mailService.sendActivationEmail(userDto, baseUrl);
							return new ResponseEntity<>(HttpStatus.CREATED);
						}));

	}

	/**
	 * GET /activate -> activate the registered user.
	 */
	@RequestMapping(value = "/activate", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<String> activateAccount(@RequestParam(value = "key") String key) {
		return Optional.ofNullable(userService.activateRegistration(key))
				.map(user -> new ResponseEntity<String>(HttpStatus.OK))
				.orElse(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
	}

	/**
	 * GET /authenticate -> check if the user is authenticated, and return its
	 * login.
	 */
	@RequestMapping(value = "/authenticate", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public String isAuthenticated(HttpServletRequest request) {
		log.debug("REST request to check if the current user is authenticated");
		return request.getRemoteUser();
	}

	/**
	 * GET /account -> get the current user.
	 */
	@RequestMapping(value = "/account", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<UserDTO> getAccount() {
		/*
		User user = userService.getUserWithAuthorities();
		UserDTO userDto = null;
		if(user != null) {
			userDto = new UserDTO(user);
			MapperUtil<UserRole, UserRoleDTO> roleMapper = new MapperUtil<UserRole, UserRoleDTO>();
			UserRoleDTO userRole = roleMapper.toModel(user.getUserRole(), UserRoleDTO.class);
			userDto.setUserRole(userRole);
		}
		*/
		UserDTO userDto = userService.getUserWithAuthorities();
		if(userDto != null) {
			return new ResponseEntity<>(userDto, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	/**
	 * POST /account -> update the current user information.
	 */
	@RequestMapping(value = "/account", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<String> saveAccount(@RequestBody UserDTO userDTO) {
		return userRepository.findOneByLogin(userDTO.getLogin())
				.filter(u -> u.getLogin().equals(SecurityUtils.getCurrentUserLogin())).map(u -> {
					userService.updateUserInformation(userDTO.getFirstName(), userDTO.getLastName(), userDTO.getEmail(),
							userDTO.getLangKey(), userDTO.getEmployeeId(), userDTO.isEmailSubscribed());
					return new ResponseEntity<String>(HttpStatus.OK);
				}).orElseGet(() -> new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
	}

	/**
	 * POST /account -> update the current user information.
	 */
	@RequestMapping(value = "/account/subscribePush", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<String> subscribePush(@RequestBody UserDTO userDTO) {
		userService.updatePushSubscription(userDTO.getUserId(), userDTO.isPushSubscribed());
		return new ResponseEntity<String>(HttpStatus.OK);
	}

	/**
	 * POST /change_password -> changes the current user's password
	 */
	@RequestMapping(value = "/account/change_password", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<?> changePassword(@RequestBody String password) {
		if (!checkPasswordLength(password)) {
			return new ResponseEntity<>("Incorrect password", HttpStatus.BAD_REQUEST);
		}
		userService.changePassword(password);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	/**
	 * GET /account/sessions -> get the current open sessions.
	 */
	@RequestMapping(value = "/account/sessions", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<List<PersistentToken>> getCurrentSessions() {
		return userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin())
				.map(user -> new ResponseEntity<>(persistentTokenRepository.findByUser(user), HttpStatus.OK))
				.orElse(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
	}

	/**
	 * DELETE /account/sessions?series={series} -> invalidate an existing
	 * session.
	 *
	 * - You can only delete your own sessions, not any other user's session -
	 * If you delete one of your existing sessions, and that you are currently
	 * logged in on that session, you will still be able to use that session,
	 * until you quit your browser: it does not work in real time (there is no
	 * API for that), it only removes the "remember me" cookie - This is also
	 * true if you invalidate your current session: you will still be able to
	 * use it until you close your browser or that the session times out. But
	 * automatic login (the "remember me" cookie) will not work anymore. There
	 * is an API to invalidate the current session, but there is no API to check
	 * which session uses which cookie.
	 */
	@RequestMapping(value = "/account/sessions/{series}", method = RequestMethod.DELETE)
	@Timed
	public void invalidateSession(@PathVariable String series) throws UnsupportedEncodingException {
		String decodedSeries = URLDecoder.decode(series, "UTF-8");
		userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).ifPresent(u -> {
			persistentTokenRepository.findByUser(u).stream()
					.filter(persistentToken -> StringUtils.equals(persistentToken.getSeries(), decodedSeries)).findAny()
					.ifPresent(t -> persistentTokenRepository.delete(decodedSeries));
		});
	}



	@RequestMapping(value = "/account/reset_password/init", method = RequestMethod.POST, produces = MediaType.TEXT_PLAIN_VALUE)
	@Timed
	public ResponseEntity<?> requestPasswordReset(@RequestBody String mail, HttpServletRequest request) {
		UserDTO user = userService.requestPasswordReset(mail).get();
		if(user != null) {
			String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
			//baseUrl = request.getContextPath();
			mailService.sendPasswordResetMail(user, baseUrl);
			return new ResponseEntity<>("e-mail was sent", HttpStatus.OK);
		}
		return new ResponseEntity<>("e-mail address not registered", HttpStatus.BAD_REQUEST);
	}

	@RequestMapping(value = "/account/reset_password/finish", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<String> finishPasswordReset(@RequestBody KeyAndPasswordDTO keyAndPassword) {
		if (!checkPasswordLength(keyAndPassword.getNewPassword())) {
			return new ResponseEntity<>("Incorrect password", HttpStatus.BAD_REQUEST);
		}
		return userService.completePasswordReset(keyAndPassword.getNewPassword(), keyAndPassword.getKey())
				.map(user -> new ResponseEntity<String>(HttpStatus.OK))
				.orElse(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
	}

	@RequestMapping(value = "/auth/{username}/{password}", method = RequestMethod.POST)
	public Map<String,Object> authenticate(@PathVariable("username") String username, @PathVariable("password") String password)
	{
		log.debug("authenticate called... username-"+username+", password="+ password);
		UsernamePasswordAuthenticationToken authenticationToken =
				new UsernamePasswordAuthenticationToken(username, password);
		Authentication authentication = this.authManager.authenticate(authenticationToken);
		SecurityContextHolder.getContext().setAuthentication(authentication);

		/*
		 * Reload user as password of authentication principal will be null after authorization and
		 * password is needed for token generation
		 */
		CustomUserDetails userDetails = (CustomUserDetails) this.userDetailsService.loadUserByUsername(username);
		EmployeeDTO employee = this.employeeService.findByUserId(userDetails.getId());

		Map<String,Object> response = new HashMap<>();
		response.put("token", TokenUtils.createToken(userDetails));
		response.put("pushSubscribed", userDetails.isPushSubscribed());
		response.put("employee", employee );
		response.put("user", userDetails.getUser());

		return response;
	}

	private boolean checkPasswordLength(String password) {
		return (!StringUtils.isEmpty(password) && password.length() >= UserDTO.PASSWORD_MIN_LENGTH
				&& password.length() <= UserDTO.PASSWORD_MAX_LENGTH);
	}
}
