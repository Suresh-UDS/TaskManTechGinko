package com.ts.app.web.rest.dto;

import com.ts.app.domain.Authority;
import com.ts.app.domain.Employee;
import com.ts.app.domain.User;
import org.hibernate.validator.constraints.Email;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.Set;
import java.util.stream.Collectors;
/**
 * A DTO representing a user, with his authorities.
 */
public class UserDTO extends BaseDTO{

    public static final int PASSWORD_MIN_LENGTH = 5;
    public static final int PASSWORD_MAX_LENGTH = 100;

    private long id;
    
    @Pattern(regexp = "^[A-Za-z0-9]*$")
    @NotNull
    @Size(min = 1, max = 50)
    private String login;

    @NotNull
    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH)
    private String password;
    
    @NotNull
    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH)
    private String clearPassword;

    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    @Email
    @Size(min = 5, max = 100)
    private String email;

    private boolean activated = false;

    @Size(min = 2, max = 5)
    private String langKey;

    @Size(min = 1, max = 1)
    private String adminFlag;
    
    private long userGroupId;
    
    private String userGroupName;

	private Set<String> authorities;

	private String activationKey;
	
	private String resetKey;
	
	private boolean pushSubscribed;
	
	private boolean emailSubscribed;

	private long employeeId;
	
	private String employeeName;
	
	private UserRoleDTO userRole;
	
	private long userRoleId;
	
	private String userRoleName;
	
    public UserDTO() {
    }

    public UserDTO(User user) {
        this(user.getLogin(), null, user.getClearPassword(), user.getFirstName(), user.getLastName(),
            user.getEmail(), user.getActivated(), user.getLangKey(),
            user.getAdminFlag(),
            user.getAuthorities().stream().map(Authority::getName)
                .collect(Collectors.toSet()), user.getEmployee()
            );
    }

    public UserDTO(String login, String password, String clearPassword, String firstName, String lastName,
        String email, boolean activated, String langKey, String adminFlag ,Set<String> authorities, Employee emp) {
    	
        this.login = login;
        this.password = password;
        this.clearPassword = clearPassword;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.activated = activated;
        this.langKey = langKey;
        this.authorities = authorities;
        this.adminFlag = adminFlag;
    		if(emp != null) {
	        this.employeeId = emp.getId();
	        this.employeeName = emp.getFullName();
    		}
    		this.setUserRole(userRole);
    }
    
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getPassword() {
        return password;
    }
	
	public String getClearPassword(){
		return clearPassword;
	}

    public String getLogin() {
        return login;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public boolean isActivated() {
        return activated;
    }

    public String getLangKey() {
        return langKey;
    }
    
    public String getAdminFlag() {
		return adminFlag;
	}

	

    public long getUserGroupId() {
		return userGroupId;
	}

	public void setUserGroupId(long userGroupId) {
		this.userGroupId = userGroupId;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	public void setClearPassword(String clearPassword){
		this.clearPassword = clearPassword;
	}
	
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setActivated(boolean activated) {
		this.activated = activated;
	}

	public void setLangKey(String langKey) {
		this.langKey = langKey;
	}

	public void setAdminFlag(String adminFlag) {
		this.adminFlag = adminFlag;
	}

	public void setAuthorities(Set<String> authorities) {
		this.authorities = authorities;
	}

	public Set<String> getAuthorities() {
        return authorities;
    }
	
	

    public String getUserGroupName() {
		return userGroupName;
	}

	public void setUserGroupName(String userGroupName) {
		this.userGroupName = userGroupName;
	}
	
	public String getActivationKey() {
		return activationKey;
	}

	public void setActivationKey(String activationKey) {
		this.activationKey = activationKey;
	}
	
	public String getResetKey() {
		return resetKey;
	}

	public void setResetKey(String resetKey) {
		this.resetKey = resetKey;
	}
	
	public boolean isPushSubscribed() {
		return pushSubscribed;
	}

	public void setPushSubscribed(boolean pushSubscribed) {
		this.pushSubscribed = pushSubscribed;
	}
	
	public long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(long employeeId) {
		this.employeeId = employeeId;
	}
	
	

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}
	
	public boolean isEmailSubscribed() {
		return emailSubscribed;
	}

	public void setEmailSubscribed(boolean emailSubscribed) {
		this.emailSubscribed = emailSubscribed;
	}
	
	public UserRoleDTO getUserRole() {
		return userRole;
	}

	public void setUserRole(UserRoleDTO userRole) {
		this.userRole = userRole;
	}
	
	public long getUserRoleId() {
		return userRoleId;
	}

	public void setUserRoleId(long userRoleId) {
		this.userRoleId = userRoleId;
	}

	public String getUserRoleName() {
		return userRoleName;
	}

	public void setUserRoleName(String userRoleName) {
		this.userRoleName = userRoleName;
	}

	@Override
    public String toString() {
        return "UserDTO{" +
            "login='" + login + '\'' +
            ", password='" + password + '\'' +
            ", firstName='" + firstName + '\'' +
            ", lastName='" + lastName + '\'' +
            ", email='" + email + '\'' +
            ", activated=" + activated +
            ", langKey='" + langKey + '\'' +
            ", authorities=" + authorities +'\'' +
             ", adminFlag='" + adminFlag + 
              ", clearPassword='" + clearPassword +
              ", employeeId='" + employeeId +
              ", emailSubscribed='" + isEmailSubscribed() +
            "}";
    }
}
