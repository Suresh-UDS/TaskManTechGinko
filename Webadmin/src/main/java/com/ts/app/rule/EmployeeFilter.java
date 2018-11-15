package com.ts.app.rule;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

/**
 * Component to filter employee based on the designation. Other filters can be added. 
 * @author gnana
 *
 */
@Component
public class EmployeeFilter implements DataFilter {

	public boolean filterByRole(String module, String action, String roleName, String filteredRoles) {
		
		boolean isValid = false;
		
		if(StringUtils.isNotEmpty(roleName) && !StringUtils.containsIgnoreCase(roleName, "Admin")) {
			if(StringUtils.isNotEmpty(module) && module.contains("Ticket")
					&& (StringUtils.isNotEmpty(action) && action.contains("Add")	|| StringUtils.isNotEmpty(action) && action.contains("Edit"))) {
				if(StringUtils.isNotEmpty(roleName) && StringUtils.containsIgnoreCase(roleName, "Client") 
						&& StringUtils.isNotEmpty(filteredRoles) && (StringUtils.containsIgnoreCase(filteredRoles, "Branch") || StringUtils.containsIgnoreCase(filteredRoles, "Helpdesk"))) {
					isValid = true;		
				}else if(StringUtils.isNotEmpty(roleName) && (StringUtils.containsIgnoreCase(roleName, "Branch") || StringUtils.containsIgnoreCase(roleName, "Ticket"))
						&& StringUtils.isNotEmpty(filteredRoles) && StringUtils.containsIgnoreCase(filteredRoles, "Helpdesk")) {
					isValid = true;
				}else if(StringUtils.isNotEmpty(roleName) && StringUtils.containsIgnoreCase(roleName, "Helpdesk") 
						&& StringUtils.isNotEmpty(filteredRoles) && StringUtils.containsIgnoreCase(filteredRoles, "Ticket")) {
					isValid = true;
				}else if(StringUtils.isNotEmpty(roleName) && !StringUtils.containsIgnoreCase(roleName, "Client")
							&& !StringUtils.containsIgnoreCase(roleName, "Branch")
							&& !StringUtils.containsIgnoreCase(roleName, "Helpdesk")
							&& !StringUtils.containsIgnoreCase(roleName, "Ticket")) {
					isValid = true;
				}
			}else {
				isValid = true;
			}
		}else {
			isValid = true;
		}
		
		return isValid;
	}
	
}
