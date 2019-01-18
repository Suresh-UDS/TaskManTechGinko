package com.ts.app.security;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.User;
import com.ts.app.domain.UserRole;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;


/**
 * Authenticate a user from the database.
 */
@Component("userDetailsService")
public class CustomUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(CustomUserDetailsService.class);

	@Inject
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(final String login) {
        log.debug("Authenticating {}", login);
        String lowercaseLogin = login.toLowerCase();
        Optional<User> userFromDatabase = userRepository.findOneByLogin(lowercaseLogin);
        
        
        return userFromDatabase.map(user -> {
        	
            if (!user.getActivated()) {
                throw new UserNotActivatedException("User " + lowercaseLogin + " was not activated");
            }
            UserRole role = user.getUserRole();
            role.getRolePermissions().size();

            Set<GrantedAuthority> grantedAuthorities = user.getAuthorities().stream()
                    .map(authority -> new SimpleGrantedAuthority(authority.getName()))
                .collect(Collectors.toSet());
                
            MapperUtil<AbstractAuditingEntity, BaseDTO> mapper = new MapperUtil<>();
            
            UserDTO userDto = mapper.toModel(user, UserDTO.class);
            
            return new CustomUserDetails(user.getId(), lowercaseLogin,
                user.getPassword(),
                grantedAuthorities, true, true, true, true, user.isPushSubscribed(), userDto);
        }).orElseThrow(() -> new UsernameNotFoundException("User " + lowercaseLogin + " was not found in the " +
        "database"));
        
    }
    
}
