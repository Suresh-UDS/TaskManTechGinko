package com.ts.app.web.rest.util;

import java.util.HashSet;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.ts.app.security.AuthoritiesConstants;

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
