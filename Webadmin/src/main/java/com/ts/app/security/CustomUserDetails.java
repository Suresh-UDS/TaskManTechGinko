package com.ts.app.security;

import com.ts.app.web.rest.dto.UserDTO;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;

/**
 * Class representing the Spring Security authenticated user.
 * 
 * @see UserDetails
 *
 */
public class CustomUserDetails implements UserDetails {

    private static final long serialVersionUID = 1L;

    private final Long id;
    private final String password;
    private final String username;
    private final Set<GrantedAuthority> authorities;
    private final boolean accountNonExpired;
    private final boolean accountNonLocked;
    private final boolean credentialsNonExpired;
    private final boolean enabled;
    private final boolean pushSubscribed;
    private final UserDTO user;

    /**
     * @param id
     * @param username
     * @param password
     * @param authorities
     * @param accountNonExpired
     * @param accountNonLocked
     * @param credentialsNonExpired
     * @param enabled
     */
    public CustomUserDetails(Long id, String username, String password, Set<GrantedAuthority> authorities, boolean accountNonExpired, boolean accountNonLocked,
            boolean credentialsNonExpired, boolean enabled, boolean pushSubscribed) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
        this.accountNonExpired = accountNonExpired;
        this.accountNonLocked = accountNonLocked;
        this.credentialsNonExpired = credentialsNonExpired;
        this.enabled = enabled;
        this.pushSubscribed = pushSubscribed;
        this.user = null;
    }
    
    /**
     * @param id
     * @param username
     * @param password
     * @param authorities
     * @param accountNonExpired
     * @param accountNonLocked
     * @param credentialsNonExpired
     * @param enabled
     * @param userRole
     */
    public CustomUserDetails(Long id, String username, String password, Set<GrantedAuthority> authorities, boolean accountNonExpired, boolean accountNonLocked,
            boolean credentialsNonExpired, boolean enabled, boolean pushSubscribed, UserDTO user) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
        this.accountNonExpired = accountNonExpired;
        this.accountNonLocked = accountNonLocked;
        this.credentialsNonExpired = credentialsNonExpired;
        this.enabled = enabled;
        this.pushSubscribed = pushSubscribed;
        this.user = user;
    }    

    public Long getId() {
        return id;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public boolean isUserInRole(String authority) {
        return authorities.contains(new SimpleGrantedAuthority(authority));
    }
    
    public boolean isPushSubscribed() {
		return pushSubscribed;
	}
    
	public UserDTO getUser() {
		return user;
	}

	@Override
    public String toString() {
        return "CustomUserDetails{" + id + ',' + username + ',' + authorities + '}';
    }
}
