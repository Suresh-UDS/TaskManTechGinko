package com.ts.app.web.rest.util;

import com.ts.app.security.AuthoritiesConstants;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.HashSet;
import java.util.Set;

public class UserUtil {

	public static Set<String> transformAuthorities(Set<String> auths) {
		Set<String> authorities = new HashSet<String>();
		if(CollectionUtils.isNotEmpty(auths)) {
			for(String auth : auths) {
				if(StringUtils.isNotEmpty(auth)) {
					authorities.add(auth.equalsIgnoreCase("Admin") ? AuthoritiesConstants.ADMIN : AuthoritiesConstants.USER);
				}
			}
		}
		return authorities;
	}
}
