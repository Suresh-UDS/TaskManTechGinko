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

	public boolean filterByDesignationForRole(String module, String action, String roleName, String designation) {
		
		boolean isValid = false;
		
		if(StringUtils.isNotEmpty(roleName) && !roleName.contains("Admin")) {
			if(StringUtils.isNotEmpty(module) && module.contains("Ticket")
					&& (StringUtils.isNotEmpty(action) && action.contains("Add")	|| StringUtils.isNotEmpty(action) && action.contains("Edit"))) {
				if(StringUtils.isNotEmpty(roleName) && roleName.contains("Client") 
						&& StringUtils.isNotEmpty(designation) && (designation.contains("Branch")  || designation.contains("Helpdesk"))) {
					isValid = true;		
				}else if(StringUtils.isNotEmpty(roleName) && roleName.contains("Branch") 
						&& StringUtils.isNotEmpty(designation) && designation.contains("Helpdesk")) {
					isValid = true;
				}else if(StringUtils.isNotEmpty(roleName) && roleName.contains("Helpdesk") 
						&& StringUtils.isNotEmpty(designation) && designation.contains("Ticket")) {
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
