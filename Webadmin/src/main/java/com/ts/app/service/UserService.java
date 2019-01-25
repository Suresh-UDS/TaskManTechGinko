package com.ts.app.service;

import com.ts.app.domain.*;
import com.ts.app.repository.*;
import com.ts.app.security.SecurityUtils;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.RandomUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.dto.UserDTO;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(UserService.class);

	private static final long DEFAULT_USER_GROUP_ID = 1;

	@Inject
	private PasswordEncoder passwordEncoder;

	@Inject
	private UserRepository userRepository;

	@Inject
	private UserGroupRepository userGroupRepository;

	@Inject
	private UserRoleRepository userRoleRepository;

	@Inject
	private PersistentTokenRepository persistentTokenRepository;

	@Inject
	private AuthorityRepository authorityRepository;

	@Inject
	private SiteRepository siteRepository;

	@Inject
	private EmployeeRepository employeeRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private Environment env;

	public User findUser(long userId) {
		return userRepository.findOne(userId);
	}

	public List<User> findUsers(long siteId) {
		List<User> users = null;
		/*
		 * List<Employee> employees = siteRepository.findEmployees(siteId); List<Long>
		 * empIds = new ArrayList<Long>(); for(Employee emp : employees) {
		 * empIds.add(emp.getId()); } users =
		 * employeeRepository.findUsersByEmployeeIds(empIds);
		 */
		users = siteRepository.findUsers(siteId);
		return users;
	}

	public Optional<User> activateRegistration(String key) {
		log.debug("Activating user for activation key {}", key);
		userRepository.findOneByActivationKey(key).map(user -> {
			// activate given user for the registration key.
			user.setActivated(true);
			user.setActivationKey(null);
			userRepository.save(user);
			log.debug("Activated user: {}", user);
			return user;
		});
		return Optional.empty();
	}

	public Optional<User> completePasswordReset(String newPassword, String key) {
		log.debug("Reset user password for reset key {}", key);

		return userRepository.findOneByResetKey(key).filter(user -> {
			ZonedDateTime oneDayAgo = ZonedDateTime.now().minusHours(24);
			return user.getResetDate().isAfter(oneDayAgo);
		}).map(user -> {
			user.setPassword(passwordEncoder.encode(newPassword));
			user.setResetKey(null);
			user.setResetDate(null);
			userRepository.save(user);
			return user;
		});
	}

	public Optional<UserDTO> requestPasswordReset(String mail) {
		return userRepository.findOneByEmail(mail).filter(user -> user.getActivated()).map(user -> {
			user.setResetKey(RandomUtil.generateResetKey());
			user.setResetDate(ZonedDateTime.now());
			userRepository.save(user);
			UserDTO userDto = (UserDTO) mapperUtil.toModel(user, UserDTO.class);
			return userDto;
		});
	}

	public User createUserInformation(String login, String password, String firstName, String lastName, String email,
			String langKey, String adminFlag) {
		log.info("The admin Flag value is " + adminFlag);
		User newUser = new User();
		newUser.setClearPassword(password);
		Authority authority = authorityRepository.findOne("ROLE_USER");
		Set<Authority> authorities = new HashSet<>();
		String encryptedPassword = passwordEncoder.encode(password);
		newUser.setLogin(login);
		// new user gets initially a generated password
		newUser.setPassword(encryptedPassword);
		newUser.setFirstName(firstName);
		newUser.setLastName(lastName);
		newUser.setEmail(email);
		newUser.setLangKey(langKey);
		// new user is not active
		newUser.setActivated(false);
		// new user gets registration key
		newUser.setActivationKey(RandomUtil.generateActivationKey());
		authorities.add(authority);
		newUser.setAuthorities(authorities);
		if (adminFlag == null)
			adminFlag = "N";
		newUser.setAdminFlag(adminFlag);
		userRepository.save(newUser);
		log.debug("Created Information for User1: {}", newUser);
		return newUser;
	}

	public UserDTO createUserInformation(UserDTO userDto) {
		User newUser = new User();
		newUser.setClearPassword(env.getProperty("default.user.password"));
		String encryptedPassword = null;
		//if (StringUtils.isNotEmpty(userDto.getPassword())) {
		//	encryptedPassword = passwordEncoder.encode(userDto.getPassword());
		//} else {
		//	encryptedPassword = passwordEncoder.encode(RandomUtil.generatePassword());
		//}
		encryptedPassword = passwordEncoder.encode(newUser.getClearPassword());
		// new user gets initially a generated password
		newUser.setPassword(encryptedPassword);
		newUser.setLogin(userDto.getLogin());
		newUser.setFirstName(userDto.getFirstName());
		newUser.setLastName(userDto.getLastName());
		newUser.setEmail(userDto.getEmail());
		newUser.setLangKey(userDto.getLangKey());
//		if (userDto.getUserGroupId() > 0) {
//			newUser.setUserGroup(userGroupRepository.findOne(userDto.getUserGroupId()));
//		} else {
//			throw new IllegalArgumentException("Not a valid User Group");
//		}
		if (userDto.getUserRoleId() > 0) {
			newUser.setUserRole(userRoleRepository.findOne(userDto.getUserRoleId()));
		} else {
			throw new IllegalArgumentException("Not a valid User Role");
		}
		// new user is not active
		newUser.setActivated(userDto.isActivated());
		// newUser.setActivated(true);
		// new user gets registration key
		newUser.setActivationKey(RandomUtil.generateActivationKey());
		String adminFlag = StringUtils.isEmpty(userDto.getAdminFlag()) ? "N" : userDto.getAdminFlag();
		newUser.setAdminFlag(adminFlag);
		Set<String> auths = userDto.getAuthorities();
		Set<Authority> authorities = new HashSet<>();
		if (CollectionUtils.isNotEmpty(auths)) {
			for (String auth : auths) {
				if (StringUtils.isNotEmpty(auth)) {
					Authority authority = authorityRepository.findOne(auth);
					if (authority != null) {
						authorities.add(authority);
					}
				}
			}
			if (CollectionUtils.isEmpty(authorities)) {
				Authority authority = null;
				if (newUser.getAdminFlag().equalsIgnoreCase("Y")) {
					authority = authorityRepository.findOne("ROLE_ADMIN");
				} else {
					authority = authorityRepository.findOne("ROLE_USER");
				}
				authorities.add(authority);
			}

		} else {
			Authority authority = null;
			if (newUser.getAdminFlag().equalsIgnoreCase("Y")) {
				authority = authorityRepository.findOne("ROLE_ADMIN");
			} else {
				authority = authorityRepository.findOne("ROLE_USER");
			}
			authorities.add(authority);

		}
		newUser.setAuthorities(authorities);
		newUser.setActive(User.ACTIVE_YES);
		newUser.setEmailSubscribed(userDto.isEmailSubscribed());
		Employee employee = null;
		log.debug("Create new user - Associated employee id - " + userDto.getEmployeeId());
		if (userDto.getEmployeeId() > 0) {
			employee = employeeRepository.findOne(userDto.getEmployeeId());
			newUser.setEmployee(employee);
		}
		User createdUser = userRepository.save(newUser);
		log.debug("Created Information for User1: {}", createdUser);
		if (employee != null) {
			employee.setUser(createdUser);
			employeeRepository.save(employee);
		}
		userDto = mapperUtil.toModel(createdUser, UserDTO.class);
		return userDto;
	}

	public void updateUserInformation(String firstName, String lastName, String email, String langKey, long employeeId,
			boolean emailSubscribed) {
		userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).ifPresent(u -> {
			u.setFirstName(firstName);
			u.setLastName(lastName);
			u.setEmail(email);
			u.setLangKey(langKey);
			u.setEmailSubscribed(emailSubscribed);
			User updatedUser = userRepository.save(u);
			if (employeeId > 0) {
				Employee employee = employeeRepository.findOne(employeeId);
				if (employee != null) {
					employee.setUser(updatedUser);
					employeeRepository.save(employee);
					updatedUser.setEmployee(employee);
					userRepository.save(updatedUser);
				}

			}
			log.debug("Changed Information for User1: {}", u);
		});
	}

	public void updateUserInformation(UserDTO userDto) {
		userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).ifPresent(u -> {
			u.setFirstName(userDto.getFirstName());
			u.setLastName(userDto.getLastName());
			u.setEmail(userDto.getEmail());
			u.setLangKey(userDto.getLangKey());
			u.setEmailSubscribed(userDto.isEmailSubscribed());
			u.setLogin(userDto.getLogin());
			if (userDto.getUserRoleId() > 0) {
				u.setUserRole(userRoleRepository.findOne(userDto.getUserRoleId()));
			}
			User updatedUser = userRepository.save(u);
			if (userDto.getEmployeeId() > 0) {
				Employee employee = employeeRepository.findOne(userDto.getEmployeeId());
				if (employee != null) {
					employee.setUser(updatedUser);
					employeeRepository.save(employee);
					updatedUser.setEmployee(employee);
					userRepository.save(updatedUser);
				}

			}
			log.debug("Changed Information for User1: {}", u);
		});
	}

	public void updatePushSubscription(long userId, boolean pushSubscribed) {
		User u = userRepository.findOne(userId);
		u.setPushSubscribed(pushSubscribed);
		userRepository.save(u);
		log.debug("Changed Information for User1: {}", u);
	}

	public void deleteUser(Long id) {
		log.debug("Inside Delete");
		User userUpdate = userRepository.findOne(id);
		userUpdate.setActivated(false);
		userUpdate.setActive(User.ACTIVE_NO);
		userRepository.save(userUpdate);
	}

	public void changePassword(String password) {
		userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).ifPresent(u -> {
			String encryptedPassword = passwordEncoder.encode(password);
			u.setPassword(encryptedPassword);
			userRepository.save(u);
			log.debug("Changed password for User1: {}", u);
		});
	}

    public UserDTO changeNewPassword(long userId,String password) {
	    log.debug("change password user Service userId: "+userId);
	    log.debug("change password user Service password: "+password);
        User user = userRepository.findOne(userId);
        String encryptedPassword = passwordEncoder.encode(password);
        user.setClearPassword(password);
        user.setPassword(encryptedPassword);
        userRepository.save(user);
        log.debug("password changed for user"+user.getClearPassword());
        UserDTO userDto = mapperUtil.toModel(user, UserDTO.class);
        return userDto;

    }

	@Transactional(readOnly = true)
	public Optional<User> getUserWithAuthoritiesByLogin(String login) {
		return userRepository.findOneByLogin(login).map(u -> {
			u.getAuthorities().size();
			return u;
		});
	}

	@Transactional(readOnly = true)
	public UserDTO getUserWithAuthorities(Long id) {
		User user = userRepository.findOne(id);
		user.getAuthorities().size(); // eagerly load the association
		UserDTO userModel = mapperUtil.toModel(user, UserDTO.class);
		Set<Authority> authorities = user.getAuthorities();
		Set<String> authNames = new HashSet<String>();
		for (Authority auth : authorities) {
			authNames.add(auth.getName().equalsIgnoreCase("ROLE_USER") ? "User" : "Admin");
		}
		userModel.setAuthorities(authNames);

		return userModel;
	}

	@Transactional(readOnly = true)
	public UserDTO getUserWithAuthorities() {
		User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
		if (user != null && CollectionUtils.isNotEmpty(user.getAuthorities())) {
			user.getAuthorities().size(); // eagerly load the association
		}
		if (user != null && user.getUserRole() != null) {
			UserRole role = user.getUserRole();
			role.getRolePermissions().size();
		}
		UserDTO userDto = mapperUtil.toModel(user, UserDTO.class);
		userDto.setAuthorities(user.getAuthorities().stream().map(Authority::getName)
							.collect(Collectors.toSet()));

		return userDto;
	}

	/**
	 * Persistent Token are used for providing automatic authentication, they should
	 * be automatically deleted after 30 days.
	 * <p/>
	 * <p>
	 * This is scheduled to get fired everyday, at midnight.
	 * </p>
	 */
	@Scheduled(cron = "0 0 0 * * ?")
	public void removeOldPersistentTokens() {
		LocalDate now = LocalDate.now();
		persistentTokenRepository.findByTokenDateBefore(now.minusMonths(1)).stream().forEach(token -> {
			log.debug("Deleting token {}", token.getSeries());
			User user = token.getUser();
			user.getPersistentTokens().remove(token);
			persistentTokenRepository.delete(token);
		});
	}

	/**
	 * Not activated users should be automatically deleted after 3 days.
	 * <p/>
	 * <p>
	 * This is scheduled to get fired everyday, at 01:00 (am).
	 * </p>
	 */
	@Scheduled(cron = "0 0 1 * * ?")
	public void removeNotActivatedUsers() {
		ZonedDateTime now = ZonedDateTime.now();
		List<User> users = userRepository.findAllByActivatedIsFalseAndCreatedDateBefore(now.minusDays(3));
		for (User user : users) {
			log.debug("Deleting not activated user {}", user.getLogin());
			userRepository.delete(user);
		}
	}


    private Sort orderByASC(String columnName) {
        return new Sort(Sort.Direction.ASC, columnName);
    }

    private Sort orderByDESC(String columnName) {
        return new Sort(Sort.Direction.DESC, columnName);
    }


    public SearchResult<UserDTO> findBySearchCrieria(SearchCriteria searchCriteria, long loggedInUserId) {
		SearchResult<UserDTO> result = new SearchResult<UserDTO>();
		if (searchCriteria != null) {

            Pageable pageRequest = null;
            if(!StringUtils.isEmpty(searchCriteria.getColumnName())){
                //log.debug("columnName----->>>>>>>"+searchCriteria.getColumnName());
                Sort sort = new Sort(searchCriteria.isSortByAsc()?Sort.Direction.ASC:Sort.Direction.DESC,searchCriteria.getColumnName());
                pageRequest = createPageSort(searchCriteria.getCurrPage(),searchCriteria.getSort(),sort);
            }else{
                pageRequest = createPageRequest(searchCriteria.getCurrPage());
            }

			//Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
			Page<User> page = null;
			List<UserDTO> transactions = null;
			if (!searchCriteria.isFindAll()) {
				if (searchCriteria.getUserId() != 0) {
					page = userRepository.findUsersById(searchCriteria.getUserId(), pageRequest);
				}else {
					page = userRepository.findByLoginOrFirsNameOrLastNameOrRole(searchCriteria.getUserLogin(),searchCriteria.getUserFirstName(),
												searchCriteria.getUserLastName(),searchCriteria.getUserEmail(), searchCriteria.getUserRoleId(), pageRequest);
				}
			} else {
				page = userRepository.findUsers(loggedInUserId, pageRequest);
			}
			if (page != null) {
				// transactions = mapperUtil.toModelList(page.getContent(), UserDTO.class);
				transactions = new ArrayList<UserDTO>();
				List<User> users = page.getContent();
				for (User user : users) {
					//UserDTO userDto = mapperUtil.toModel(user, UserDTO.class);
					UserDTO userDto = mapToModel(user);
//					Set<Authority> authorities = user.getAuthorities();
//					Set<String> authNames = new HashSet<String>();
//					for (Authority auth : authorities) {
//						authNames.add(auth.getName());
//					}
//					userDto.setAuthorities(authNames);

					transactions.add(userDto);
				}

				if (CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions, result);
				}
			}
		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<User> page, List<UserDTO> transactions,
			SearchResult<UserDTO> result) {
		if (page != null) {
			result.setTotalPages(page.getTotalPages());
		}
		result.setCurrPage(page.getNumber() + 1);
		result.setTotalCount(page.getTotalElements());
		result.setStartInd((result.getCurrPage() - 1) * 10 + 1);
		result.setEndInd((result.getTotalCount() > 10 ? (result.getCurrPage()) * 10 : result.getTotalCount()));

		result.setTransactions(transactions);
		return;
	}

	private UserDTO mapToModel(User user) {
		UserDTO userDto = new UserDTO();
		userDto.setId(user.getId());
		userDto.setLogin(user.getLogin());
		userDto.setFirstName(user.getFirstName());
		userDto.setLastName(user.getLastName());
		userDto.setEmail(user.getEmail());
		userDto.setUserRoleId(user.getUserRole().getId());
		userDto.setUserRoleName(user.getUserRole().getName());
		userDto.setActivated(user.getActivated());
		return userDto;
	}


}
