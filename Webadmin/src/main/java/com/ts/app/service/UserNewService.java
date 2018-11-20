package com.ts.app.service;

import com.ts.app.domain.UserNew;
import com.ts.app.repository.AuthorityRepository;
import com.ts.app.repository.PersistentTokenRepository;
import com.ts.app.repository.UserGroupRepository;
import com.ts.app.repository.UserNewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserNewService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    @Inject
    private PasswordEncoder passwordEncoder;

   // @Inject
    private UserNewRepository userRepository;

    @Inject
    private PersistentTokenRepository persistentTokenRepository;

    @Inject
    private AuthorityRepository authorityRepository;
    
    @Inject
    private UserGroupRepository userGroupRepository;
    
    public UserNew createUserInformation(String login, String password) {
    	 log.debug("Within the method written by Deepa");
        UserNew newUser = new UserNew();
     //   Authority authority = authorityRepository.findOne("ROLE_USER");
     //   Set<Authority> authorities = new HashSet<>();
        //UserGroup userGroup = userGroupRepository.findOne("1");
        String encryptedPassword = passwordEncoder.encode(password);
  //      Set<UserGroup> userGroups = new HashSet<>();
        newUser.setName(login);
        newUser.setPassword(encryptedPassword);
        //newUser.setUserGroup(userGroup);
        /*
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
        */
        //userRepository.save(newUser);
        log.debug("Created Information for User: {}", newUser);
        return newUser;
    }


 
}
